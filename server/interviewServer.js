import { getCodexStatus, runCodexInterview } from './codexInterview.js'
import { getMiniMaxStatus, runMiniMaxInterview, streamMiniMaxChat } from './minimaxInterview.js'
import { validateInterviewRequest } from './interviewProtocol.js'
import { streamCodexChat } from './codexChat.js'
import { createChatService } from './interviewChat.js'

const defaultAdapters = {
  codex: { status: getCodexStatus, run: runCodexInterview, chat: streamCodexChat },
  minimax: { status: getMiniMaxStatus, run: runMiniMaxInterview, chat: streamMiniMaxChat },
}
const names = { codex: 'Codex', minimax: 'MiniMax' }
const MAX_BODY_BYTES = 384 * 1024

export function createInterviewService(adapters = defaultAdapters) {
  const active = new Set()
  return {
    ...createChatService(adapters, active),
    async getStatus() {
      const entries = await Promise.all(Object.keys(names).map(async id => {
        let status
        try { status = await adapters[id].status() }
        catch { status = { ready: false, message: names[id] + ' 状态检测失败，请重新检测。' } }
        return [id, { id, label: names[id], ready: status.ready === true, message: status.message }]
      }))
      const providers = Object.fromEntries(entries)
      // Keep the legacy Codex-only status fields for older open pages.
      return { ready: providers.codex.ready, message: providers.codex.message, providers }
    },
    async generate(body, legacy = false) {
      const provider = body?.provider === undefined ? 'codex' : body.provider
      if (typeof provider !== 'string' || !Object.hasOwn(names, provider) || (legacy && provider !== 'codex')) {
        return { status: 400, data: { error: '请选择 Codex 或 MiniMax 服务。' } }
      }
      const input = validateInterviewRequest(body)
      if (!input) return { status: 400, data: { error: '题目或回答格式不正确。', provider } }
      if (active.has(provider)) return { status: 429, data: { error: names[provider] + ' 已有请求正在生成，请稍候或切换服务。', provider } }
      active.add(provider)
      try {
        const result = await adapters[provider].run(input)
        return { status: result.status, data: { ...result.data, provider } }
      } catch {
        return { status: 503, data: { error: names[provider] + ' 暂时不可用，答案已保留。', provider } }
      } finally { active.delete(provider) }
    },
  }
}

function localRequest(req) {
  const address = req.socket.remoteAddress
  if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address)) return false
  try {
    const host = new URL(`http://${req.headers.host}`).hostname
    if (!['localhost', '127.0.0.1', '[::1]'].includes(host)) return false
    if (req.headers.origin) {
      const origin = new URL(req.headers.origin)
      if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) return false
      if (origin.host !== req.headers.host) return false
    }
    return true
  } catch { return false }
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(data))
}

async function readJson(req) {
  req.setEncoding('utf8')
  let text = ''
  for await (const chunk of req) {
    text += chunk.toString()
    if (Buffer.byteLength(text) > MAX_BODY_BYTES) throw new Error('too-large')
  }
  try { return JSON.parse(text) } catch { throw new Error('invalid-json') }
}

export function interviewMiddleware() {
  const service = createInterviewService()
  return {
    name: 'local-ai-interview',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/interview', async (req, res) => {
        if (!localRequest(req)) return sendJson(res, 403, { error: '模拟面试接口仅允许本机访问。' })
        if (req.url === '/status' && req.method === 'GET') return sendJson(res, 200, await service.getStatus())
        if (!['/generate', '/codex', '/connect', '/chat'].includes(req.url) || req.method !== 'POST') return sendJson(res, 404, { error: '接口不存在。' })
        let body
        try { body = await readJson(req) } catch {
          return sendJson(res, 400, { error: '请求内容无效或过大。' })
        }
        if (req.url === '/connect' || req.url === '/chat') {
          const controller = new AbortController()
          const abort = () => { if (!res.writableEnded) controller.abort() }
          res.on('close', abort)
          const emit = event => {
            if (res.destroyed || controller.signal.aborted) return
            if (!res.headersSent) {
              res.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' })
              res.flushHeaders()
            }
            res.write(JSON.stringify(event) + '\n')
          }
          try {
            if (req.url === '/connect') {
              const connection = await service.connect(body?.provider, controller.signal)
              if (!controller.signal.aborted) sendJson(res, 200, connection)
            } else {
              const result = await service.chat(body, { signal: controller.signal, onDelta: text => emit({ type: 'delta', text }) })
              emit({ type: 'done', ...result })
              res.end()
            }
          } catch (error) {
            if (!controller.signal.aborted && !res.destroyed) {
              const data = { error: error.message || '模型连接失败，请重新检测。' }
              if (res.headersSent) { emit({ type: 'error', ...data }); res.end() }
              else sendJson(res, error.status || 503, data)
            }
          } finally { res.off('close', abort) }
          return
        }
        const result = await service.generate(body, req.url === '/codex')
        sendJson(res, result.status, result.data)
      })
    },
  }
}

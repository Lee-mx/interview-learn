import { randomUUID } from 'node:crypto'
import { validateChatMessages } from './chatProtocol.js'

const TTL = 3 * 60 * 1000
const validProvider = value => value === 'codex' || value === 'minimax'
const problem = (status, message) => Object.assign(Error(message), { status })

export function createChatService(adapters, active = new Set(), now = Date.now) {
  const verified = new Map()
  return {
    async connect(provider, signal) {
      if (!validProvider(provider)) throw problem(400, '请选择有效的 AI 服务。')
      if (active.has(provider)) throw problem(429, '该服务正在生成，请完成或停止后再连接。')
      active.add(provider)
      verified.delete(provider)
      try {
        let reply = ''
        await adapters[provider].chat([{ role: 'user', content: '连接测试。请只回复：连接成功。' }], { signal, timeoutMs: 45000, onDelta: text => { reply += text } })
        if (!reply.trim() || signal?.aborted) throw problem(503, '模型未返回有效回复。')
        const connection = { token: randomUUID(), expiresAt: now() + TTL }
        verified.set(provider, connection)
        return { provider, ready: true, ...connection }
      } finally { active.delete(provider) }
    },
    async chat(body, { signal, onDelta }) {
      const provider = body?.provider
      if (!validProvider(provider)) throw problem(400, '请选择有效的 AI 服务。')
      const messages = validateChatMessages(body.messages)
      if (!messages) throw problem(400, '对话格式无效或内容过长，请清空对话后重试。')
      const connection = verified.get(provider)
      if (!connection || body.token !== connection.token || now() >= connection.expiresAt) throw problem(412, '连接验证已过期，请重新检测后发送。')
      if (active.has(provider)) throw problem(429, '该服务正在生成，请稍候重试。')
      active.add(provider)
      try {
        await adapters[provider].chat(messages, { signal, onDelta })
        if (signal?.aborted) throw Object.assign(Error('Cancelled'), { name: 'AbortError' })
        connection.expiresAt = now() + TTL
        return { provider, expiresAt: connection.expiresAt }
      } catch (error) {
        if (error.name !== 'AbortError') verified.delete(provider)
        throw error
      } finally { active.delete(provider) }
    },
  }
}

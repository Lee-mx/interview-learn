import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { runProcess } from './interviewProcess.js'
import { buildInterviewPrompt, interviewSchemas, normalizeInterviewOutput, parseModelJson } from './interviewProtocol.js'
import { CHAT_INSTRUCTIONS } from './chatProtocol.js'

// npm's Windows .cmd/.ps1 shims cannot be spawned with shell:false.
// Run the installed package's JS entry with Node; answers never become shell arguments.
export function resolveMmxCommand({ env = process.env, platform = process.platform, node = process.execPath } = {}) {
  const override = env.MMX_BIN
  if (override && /\.(?:mjs|cjs|js)$/i.test(override)) return { command: node, args: [override] }
  if (override && !/\.(?:cmd|ps1|bat)$/i.test(override)) return { command: override, args: [] }
  const paths = override ? [dirname(override)] : [
    ...(env.PATH || env.Path || '').split(platform === 'win32' ? ';' : ':'),
    ...(env.APPDATA ? [join(env.APPDATA, 'npm')] : []),
  ]
  for (const path of paths.filter(Boolean)) {
    const packageFile = join(path.replace(/^"|"$/g, ''), 'node_modules', 'mmx-cli', 'package.json')
    try {
      const pkg = JSON.parse(readFileSync(packageFile, 'utf8'))
      const entry = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.mmx
      if (entry && ['.js', '.mjs', '.cjs'].includes(extname(entry))) {
        const file = resolve(dirname(packageFile), entry)
        if (existsSync(file)) return { command: node, args: [file] }
      }
    } catch { /* Try the next installed package location. */ }
  }
  if (override || platform === 'win32') throw Object.assign(new Error('MMX CLI not found'), { code: 'ENOENT' })
  return { command: 'mmx', args: [] }
}

const commonArgs = ['--non-interactive', '--quiet', '--output', 'json', '--no-color']

export function minimaxErrorMessage(result) {
  if (result.timedOut || result.code === 5) return 'MiniMax 生成超时，请检查网络或稍后重试；也可以切换到 Codex。'
  if (result.outputLimited) return 'MiniMax 返回内容过大，请重试。'
  if (result.code === 3) return 'MiniMax 认证不可用，请在启动项目的同一用户环境运行 mmx auth login。'
  if (result.code === 4) return 'MiniMax 当前额度不足、频率受限或所选模型不在套餐内，请检查 mmx quota show，或切换到 Codex。'
  if (result.code === 6) return 'MiniMax 连接失败，请检查终端网络或代理，也可以切换到 Codex。'
  if (result.code === 10) return 'MiniMax 未接受本次内容，请调整回答后重试。'
  if (result.code === 2) return '当前 mmx CLI 不支持所需参数，请检查安装版本。'
  return 'MiniMax 调用失败，请检查本机 mmx 配置或切换到 Codex。'
}

export function parseMiniMaxStatus(result) {
  if (result.code !== 0 || result.timedOut || result.outputLimited) return { ready: false, message: minimaxErrorMessage(result) }
  try {
    const data = JSON.parse(result.stdout)
    const ready = ['api-key', 'oauth'].includes(data.method) && data.authenticated !== false
    // Never expose auth status stdout: it may contain a key or account information.
    return { ready, message: ready ? 'MiniMax 认证已配置；模型连接将在提交时验证。' : 'MiniMax 尚未配置认证，请在同一用户环境运行 mmx auth login。' }
  } catch { return { ready: false, message: '无法读取 MiniMax 认证状态，请检查 mmx auth status。' } }
}

export async function getMiniMaxStatus() {
  try {
    const cli = resolveMmxCommand()
    return parseMiniMaxStatus(await runProcess(cli.command, [...cli.args, 'auth', 'status', ...commonArgs], { timeoutMs: 12_000 }))
  } catch {
    return { ready: false, message: '未找到可运行的 mmx CLI。请安装 mmx-cli，或用 MMX_BIN 指定 CLI 入口。' }
  }
}

export function parseMiniMaxOutput(stdout, mode) {
  let parsed = parseModelJson(stdout)
  // mmx --quiet returns the generated text; some versions return a Messages API envelope.
  if (Array.isArray(parsed?.content)) {
    if (parsed.stop_reason === 'max_tokens') return null
    const answer = parsed.content.filter(block => block.type === 'text').map(block => block.text).join('')
    parsed = parseModelJson(answer)
  }
  return normalizeInterviewOutput(parsed, mode)
}

export async function runMiniMaxInterview(input) {
  let workdir
  try {
    const status = await getMiniMaxStatus()
    if (!status.ready) return { status: 503, data: { error: status.message } }
    const cli = resolveMmxCommand()
    workdir = await mkdtemp(join(tmpdir(), 'interview-minimax-'))
    const messagesFile = join(workdir, 'messages.json')
    const messages = [
      { role: 'system', content: '你是前端面试练习助手。只输出符合下列 JSON Schema 的 JSON，不输出 Markdown，不调用工具：\n' + JSON.stringify(interviewSchemas[input.mode]) },
      { role: 'user', content: buildInterviewPrompt(input) },
    ]
    // A file also works on Windows versions of mmx that read stdin via /dev/stdin.
    await writeFile(messagesFile, JSON.stringify(messages), { encoding: 'utf8', mode: 0o600 })
    const args = [...cli.args, 'text', 'chat', '--messages-file', messagesFile, '--max-tokens', '4096', '--timeout', '110', ...commonArgs]
    if (process.env.MINIMAX_MODEL) args.push('--model', process.env.MINIMAX_MODEL)
    const result = await runProcess(cli.command, args, { cwd: workdir })
    if (result.code !== 0 || result.timedOut || result.outputLimited) return { status: 503, data: { error: minimaxErrorMessage(result) } }
    let data
    try { data = parseMiniMaxOutput(result.stdout, input.mode) } catch { /* Malformed generated output is retriable. */ }
    return data ? { status: 200, data } : { status: 502, data: { error: 'MiniMax 返回的内容格式不完整，答案已保留，请重试或切换服务。' } }
  } catch (error) {
    return { status: 503, data: { error: error.code === 'ENOENT' ? '未找到 mmx CLI，请检查本机安装或 MMX_BIN 配置。' : 'MiniMax 本地调用失败，请检查本机 CLI 配置。' } }
  } finally {
    if (workdir && dirname(resolve(workdir)) === resolve(tmpdir()) && basename(workdir).startsWith('interview-minimax-')) {
      await rm(workdir, { recursive: true, force: true }).catch(() => {})
    }
  }
}

export async function streamMiniMaxChat(messages, { signal, onDelta, timeoutMs = 120000 }) {
  let workdir
  try {
    const cli = resolveMmxCommand()
    workdir = await mkdtemp(join(tmpdir(), 'interview-minimax-chat-'))
    const file = join(workdir, 'messages.json')
    await writeFile(file, JSON.stringify([{ role: 'system', content: CHAT_INSTRUCTIONS }, ...messages]), { encoding: 'utf8', mode: 0o600 })
    // This CLI buffers --output json until completion; text mode emits actual token deltas.
    const args = [...cli.args, 'text', 'chat', '--messages-file', file, '--stream', '--max-tokens', '4096', '--timeout', '110', '--non-interactive', '--quiet', '--output', 'text', '--no-color']
    if (process.env.MINIMAX_MODEL) args.push('--model', process.env.MINIMAX_MODEL)
    let length = 0
    const limit = new AbortController()
    const combined = signal ? AbortSignal.any([signal, limit.signal]) : limit.signal
    const result = await runProcess(cli.command, args, { cwd: workdir, signal: combined, timeoutMs, onStdout: delta => {
      length += delta.length
      if (length > 12000) limit.abort()
      else onDelta(delta)
    } }).catch(error => {
      if (limit.signal.aborted && !signal?.aborted) throw Error('回复已达到长度上限，请缩小问题范围后重试。')
      throw error
    })
    if (result.code !== 0 || result.timedOut || result.outputLimited) throw Error(minimaxErrorMessage(result))
    if (!result.stdout.trim()) throw Error('MiniMax 没有返回有效回复，请重新检测连接。')
  } catch (error) {
    if (error.code === 'ENOENT') throw Error('未找到 mmx CLI，请检查本机安装。')
    throw error
  } finally {
    if (workdir && dirname(resolve(workdir)) === resolve(tmpdir()) && basename(workdir).startsWith('interview-minimax-chat-')) await rm(workdir, { recursive: true, force: true }).catch(() => {})
  }
}

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { runProcess } from './interviewProcess.js'
import { buildInterviewPrompt, interviewSchemas, normalizeInterviewOutput, parseModelJson } from './interviewProtocol.js'
export { buildInterviewPrompt, validateInterviewRequest } from './interviewProtocol.js'

function findDesktopCodex() {
  if (process.platform !== 'win32' || !process.env.LOCALAPPDATA) return null
  try {
    const binRoot = join(process.env.LOCALAPPDATA, 'OpenAI', 'Codex', 'bin')
    const binaries = readdirSync(binRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => join(binRoot, entry.name, 'codex.exe'))
      .filter(existsSync)
    return binaries.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0] || null
  } catch { return null }
}

export function parseLoopbackProxy(value) {
  if (typeof value !== 'string') return null
  const entries = value.split(';').map(entry => entry.trim()).filter(Boolean)
  const ordered = [
    ...entries.filter(entry => /^https=/i.test(entry)),
    ...entries.filter(entry => !entry.includes('=')),
    ...entries.filter(entry => /^http=/i.test(entry)),
  ]
  for (const entry of ordered) {
    const address = entry.replace(/^(?:https|http)=/i, '').replace(/^https?:\/\//i, '')
    const match = /^(?:127\.0\.0\.1|localhost):(\d{1,5})$/i.exec(address)
    const port = Number(match?.[1])
    if (port >= 1 && port <= 65535) return `http://127.0.0.1:${port}`
  }
  return null
}

function findWindowsLoopbackProxy() {
  if (process.platform !== 'win32') return null
  const regExe = join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'reg.exe')
  const key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings'
  const options = { encoding: 'utf8', timeout: 2000, windowsHide: true }
  try {
    const enabled = spawnSync(regExe, ['query', key, '/v', 'ProxyEnable'], options)
    if (enabled.status !== 0 || !/ProxyEnable\s+REG_DWORD\s+0x1\b/i.test(enabled.stdout)) return null
    const server = spawnSync(regExe, ['query', key, '/v', 'ProxyServer'], options)
    if (server.status !== 0) return null
    return parseLoopbackProxy(/ProxyServer\s+REG_SZ\s+(.+)\r?$/im.exec(server.stdout)?.[1])
  } catch { return null }
}

const CODEX_BIN = process.env.CODEX_BIN || findDesktopCodex() || 'codex'
const CODEX_PROXY = process.env.CODEX_PROXY || (process.env.HTTPS_PROXY || process.env.https_proxy ? null : findWindowsLoopbackProxy())
const CODEX_ENV = CODEX_PROXY ? { ...process.env, HTTPS_PROXY: CODEX_PROXY, HTTP_PROXY: CODEX_PROXY } : process.env
export const getCodexRuntime = () => ({ command: CODEX_BIN, env: CODEX_ENV })
export function codexErrorMessage(result) {
  const combined = `${result.stdout}\n${result.stderr}`.toLowerCase()
  if (/unknown variant [`']?max|failed to decode models response|failed to load models cache/.test(combined)) return '当前 Codex CLI 版本较旧，无法解析模型信息。请升级 CLI，或用 CODEX_BIN 指向较新的 Codex 可执行文件。'
  if (result.timedOut) return 'Codex 已登录，但生成等待超过 120 秒。请检查启动开发服务的终端网络或代理。'
  if (result.outputLimited) return 'Codex CLI 输出异常过大，可能是版本兼容问题；请检查 CLI 版本和终端日志。'
  if (/not logged in|login required|please log in|unauthorized/.test(combined)) return 'Codex 尚未登录。请在启动项目的同一用户环境中运行 codex login。'
  if (/rate limit|usage limit|quota/.test(combined)) return 'Codex 当前额度或频率受限，请稍后重试。'
  if (/request timed out|stream disconnected|reconnecting|connection.*reset/.test(combined)) return 'Codex 已登录，但连接模型服务失败。请检查启动开发服务的终端网络或代理。'
  if (/failed to (?:start|create|initialize).*sandbox|sandbox.*(?:failed|denied)|permission denied/.test(combined)) return 'Codex 本地沙箱无法启动，请检查终端权限。'
  return 'Codex 已登录，但模型调用失败。请检查开发服务终端中的具体错误。'
}

export async function getCodexStatus() {
  try {
    const result = await runProcess(CODEX_BIN, ['login', 'status'], { timeoutMs: 12_000, env: CODEX_ENV })
    return { ready: result.code === 0, message: result.code === 0 ? 'Codex 已登录；模型连接将在提交回答时验证。' : '当前开发服务的 Codex 未登录，请在同一用户环境运行 codex login。' }
  } catch {
    return { ready: false, message: '未找到 Codex CLI。请确认 codex 命令在 PATH 中。' }
  }
}

export async function runCodexInterview(input) {
  let workdir
  try {
    const status = await getCodexStatus()
    if (!status.ready) return { status: 503, data: { error: status.message } }
    workdir = await mkdtemp(join(tmpdir(), 'interview-codex-'))
    const schemaFile = join(workdir, 'schema.json')
    const schema = interviewSchemas[input.mode]
    await writeFile(schemaFile, JSON.stringify(schema), 'utf8')
    const result = await runProcess(CODEX_BIN, [
      'exec', '--sandbox', 'read-only', '--ephemeral', '--ignore-user-config',
      '--skip-git-repo-check', '--output-schema', schemaFile, '-C', workdir, '-',
    ], { cwd: workdir, input: buildInterviewPrompt(input), env: CODEX_ENV })

    if (result.code !== 0) return { status: 503, data: { error: codexErrorMessage(result) } }
    let parsed
    try { parsed = parseModelJson(result.stdout) } catch {
      return { status: 502, data: { error: 'Codex 返回格式不符合预期，请重试。' } }
    }
    const data = normalizeInterviewOutput(parsed, input.mode)
    return data ? { status: 200, data } : { status: 502, data: { error: 'Codex 返回内容不完整，请重试。' } }
  } catch (error) {
    return { status: 503, data: { error: error.code === 'ENOENT' ? '未找到 Codex CLI。请确认 codex 命令在 PATH 中。' : 'Codex 本地调用失败，请检查开发服务终端。' } }
  } finally {
    // Only clean up the unique temporary directory created for this request.
    if (workdir && dirname(resolve(workdir)) === resolve(tmpdir()) && basename(workdir).startsWith('interview-codex-')) {
      await rm(workdir, { recursive: true, force: true }).catch(() => {})
    }
  }
}

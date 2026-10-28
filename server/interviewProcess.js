import { spawn } from 'node:child_process'

const MAX_OUTPUT_BYTES = 128 * 1024

export function runProcess(command, args, { cwd, input = '', timeoutMs = 120_000, env = process.env, signal, onStdout } = {}) {
  return new Promise((resolveProcess, rejectProcess) => {
    if (signal?.aborted) return rejectProcess(Object.assign(new Error('Cancelled'), { name: 'AbortError' }))
    const child = spawn(command, args, {
      cwd,
      env,
      windowsHide: true,
      shell: false,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    let settled = false
    let timedOut = false
    let outputLimited = false
    const abort = () => child.kill()
    signal?.addEventListener('abort', abort, { once: true })
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    const timer = setTimeout(() => { timedOut = true; child.kill() }, timeoutMs)
    const finish = (error, result) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      if (signal?.aborted) error = Object.assign(new Error('Cancelled'), { name: 'AbortError' })
      if (error) rejectProcess(error)
      else resolveProcess(result)
    }
    child.on('error', error => finish(error))
    child.stdout.on('data', chunk => {
      stdout += chunk.toString()
      if (Buffer.byteLength(stdout) > MAX_OUTPUT_BYTES) { outputLimited = true; child.kill() }
      else onStdout?.(chunk)
    })
    child.stderr.on('data', chunk => {
      stderr += chunk.toString()
      if (Buffer.byteLength(stderr) > MAX_OUTPUT_BYTES) { outputLimited = true; child.kill() }
    })
    child.on('close', code => finish(null, { code, stdout, stderr, timedOut, outputLimited }))
    child.stdin.on('error', () => {})
    child.stdin.end(input)
  })
}

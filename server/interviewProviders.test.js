import assert from 'node:assert/strict'
import test from 'node:test'
import { createInterviewService } from './interviewServer.js'
import { parseMiniMaxOutput, parseMiniMaxStatus, resolveMmxCommand } from './minimaxInterview.js'
import { normalizeInterviewOutput } from './interviewProtocol.js'

const feedback = { mode: 'feedback', question: '事件循环是什么？', answer: '同步代码之后执行微任务。', history: [] }
const requests = [feedback, { mode: 'report', history: [{ question: 'Q', answer: 'A', source: 'minimax' }] },
  { mode: 'compare', question: 'Q', previous: { answer: 'A', skipped: false }, current: { answer: 'B', skipped: false } }]
const adapter = (run = async input => ({ status: 200, data: { mode: input.mode, provider: 'untrusted' } })) => ({
  status: async () => ({ ready: true, message: 'Ready', key: 'private-test-key' }), run,
})

test('routes all interview operations and stamps the actual service', async () => {
  const seen = []
  const adapters = Object.fromEntries(['codex', 'minimax'].map(id => [id, adapter(async input => {
    seen.push([id, input.mode]); return { status: 200, data: { provider: 'untrusted' } }
  })]))
  const service = createInterviewService(adapters)
  for (const provider of ['codex', 'minimax']) for (const request of requests) {
    assert.deepEqual(await service.generate({ ...request, provider }), { status: 200, data: { provider } })
  }
  assert.equal(seen.length, 6)
  assert.equal((await service.generate(feedback)).data.provider, 'codex')
  for (const provider of ['__proto__', 'other', {}, null, ['codex']]) {
    assert.equal((await service.generate({ ...feedback, provider })).status, 400)
  }
  assert.equal((await service.generate({ ...feedback, provider: 'minimax' }, true)).status, 400)
  assert.equal((await service.generate({ ...feedback, answer: '' })).status, 400)
})

test('service status failures are isolated and credentials never leave the adapter', async () => {
  const service = createInterviewService({ codex: { status: async () => { throw Error('private error') } }, minimax: adapter() })
  const status = await service.getStatus()
  assert.equal(status.providers.codex.ready, false)
  assert.equal(status.providers.minimax.ready, true)
  assert.doesNotMatch(JSON.stringify(status), /private/)
  assert.equal(status.providers.minimax.key, undefined)
})

test('a busy or failing provider does not block the other provider and releases its lock', async () => {
  let release
  const service = createInterviewService({ codex: adapter(() => new Promise(resolve => { release = resolve })), minimax: adapter() })
  const pending = service.generate(feedback)
  assert.equal((await service.generate(feedback)).status, 429)
  assert.equal((await service.generate({ ...feedback, provider: 'minimax' })).status, 200)
  release({ status: 503, data: { error: 'timeout' } })
  await pending
  const retry = service.generate(feedback)
  release({ status: 200, data: {} })
  assert.equal((await retry).status, 200)
  const failing = createInterviewService({ codex: adapter(async () => { throw Error('private error') }), minimax: adapter() })
  assert.equal((await failing.generate(feedback)).status, 503)
  assert.equal((await failing.generate(feedback)).status, 503)
})

test('MiniMax auth status is sanitized and distinguishes missing authentication', () => {
  const status = parseMiniMaxStatus({ code: 0, stdout: JSON.stringify({ method: 'api-key', key: 'private-key', account: 'private-account' }) })
  assert.equal(status.ready, true)
  assert.doesNotMatch(JSON.stringify(status), /private/)
  assert.equal(parseMiniMaxStatus({ code: 0, stdout: '{"authenticated":false,"method":"oauth"}' }).ready, false)
  assert.equal(parseMiniMaxStatus({ code: 3, stdout: '' }).ready, false)
})

test('MiniMax accepts text or envelopes, rejects truncated or invalid results', () => {
  const answer = { feedback: '说明', followUp: '追问' }
  assert.deepEqual(parseMiniMaxOutput('```json\n' + JSON.stringify(answer) + '\n```', 'feedback'), answer)
  const envelope = { content: [{ type: 'thinking', thinking: 'hidden' }, { type: 'text', text: JSON.stringify(answer) }] }
  assert.deepEqual(parseMiniMaxOutput(JSON.stringify(envelope), 'feedback'), answer)
  assert.equal(parseMiniMaxOutput(JSON.stringify({ ...envelope, stop_reason: 'max_tokens' }), 'feedback'), null)
  assert.equal(parseMiniMaxOutput('{"feedback":"incomplete"}', 'feedback'), null)
  assert.throws(() => parseMiniMaxOutput('not JSON', 'feedback'))
  assert.equal(normalizeInterviewOutput({ summary: 'x', strengths: [] }, 'report'), null)
  assert.deepEqual(normalizeInterviewOutput({ summary: ' x ', improved: [], remaining: [], nextSteps: ['a', 'b', 'c', 'd'], secret: 'omit' }, 'compare'),
    { summary: 'x', improved: [], remaining: [], nextSteps: ['a', 'b', 'c'] })
})

test('MiniMax JS entry with spaces is passed as an argument without a shell', () => {
  assert.deepEqual(resolveMmxCommand({ env: { MMX_BIN: 'C:/Program Files/mmx/cli.mjs' }, platform: 'win32', node: 'node.exe' }),
    { command: 'node.exe', args: ['C:/Program Files/mmx/cli.mjs'] })
  assert.throws(() => resolveMmxCommand({ env: {}, platform: 'win32' }), { code: 'ENOENT' })
})

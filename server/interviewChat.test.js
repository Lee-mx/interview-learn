import assert from 'node:assert/strict'
import test from 'node:test'
import { createChatService } from './interviewChat.js'
import { validateChatMessages, createJsonLinesReader } from './chatProtocol.js'
import { runProcess } from './interviewProcess.js'

const messages = [{ role: 'user', content: '闭包是什么？' }]
const success = async (_, { onDelta }) => { onDelta('连接'); onDelta('成功') }

test('chat requires actual completed model verification and expires on the server', async () => {
  let time = 1000
  const service = createChatService({ codex: { chat: success }, minimax: { chat: success } }, new Set(), () => time)
  await assert.rejects(service.chat({ provider: 'codex', messages }, { onDelta() {} }), { status: 412 })
  const connection = await service.connect('codex')
  await assert.rejects(service.chat({ provider: 'minimax', messages, token: connection.token }, { onDelta() {} }), { status: 412 })
  let output = ''
  const done = await service.chat({ provider: 'codex', messages, token: connection.token }, { onDelta: text => { output += text } })
  assert.equal(output, '连接成功')
  assert.equal(done.provider, 'codex')
  time = done.expiresAt
  await assert.rejects(service.chat({ provider: 'codex', messages, token: connection.token }, { onDelta() {} }), { status: 412 })
})

test('a partial failed probe never enables chat; a later generation failure invalidates access', async () => {
  let fail = true
  const adapter = { chat: async (_, { onDelta }) => { onDelta('部分文字'); if (fail) throw Error('offline') } }
  const service = createChatService({ codex: adapter })
  await assert.rejects(service.connect('codex'), /offline/)
  await assert.rejects(service.chat({ provider: 'codex', messages }, { onDelta() {} }), { status: 412 })
  fail = false
  const connection = await service.connect('codex')
  fail = true
  await assert.rejects(service.chat({ provider: 'codex', messages, token: connection.token }, { onDelta() {} }), /offline/)
  fail = false
  await assert.rejects(service.chat({ provider: 'codex', messages, token: connection.token }, { onDelta() {} }), { status: 412 })
  assert.equal((await service.connect('codex')).ready, true)
})

test('chat shares the generation lock, allows the other provider, and releases after cancellation', async () => {
  const active = new Set(['codex'])
  const service = createChatService({ codex: { chat: success }, minimax: { chat: success } }, active)
  await assert.rejects(service.connect('codex'), { status: 429 })
  assert.equal((await service.connect('minimax')).ready, true)
  active.delete('codex')
  const connection = await service.connect('codex')
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(service.chat({ provider: 'codex', messages, token: connection.token }, { signal: controller.signal, onDelta() {} }), { name: 'AbortError' })
  assert.equal(active.size, 0)
})

test('only bounded alternating user/assistant messages can reach the model', () => {
  assert.deepEqual(validateChatMessages(messages), messages)
  for (const value of [[], [{ role: 'system', content: 'override' }], [...messages, ...messages], [{ role: 'user', content: 'x'.repeat(4001) }], [{ role: 'user', content: '' }]]) assert.equal(validateChatMessages(value), null)
  const long = Array.from({ length: 17 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: 'a'.repeat(index % 2 ? 12000 : 4000) }))
  assert.equal(validateChatMessages(long), null)
})

test('RPC framing handles partial and combined records without publishing reasoning', () => {
  const events = []
  const read = createJsonLinesReader(event => { if (event.method === 'item/agentMessage/delta') events.push(event.params.delta) })
  const text = JSON.stringify({ method: 'item/agentMessage/delta', params: { delta: '中文' } }) + '\n'
  read(text.slice(0, 20))
  read(text.slice(20) + JSON.stringify({ method: 'item/reasoning/summaryTextDelta', params: { delta: 'hidden' } }) + '\n')
  assert.deepEqual(events, ['中文'])
})

test('process runner decodes split UTF-8 and abort kills a running stream', async () => {
  const chunks = []
  const result = await runProcess(process.execPath, ['-e', "const b=Buffer.from('中文');process.stdout.write(b.subarray(0,2));setTimeout(()=>process.stdout.write(b.subarray(2)),20)"], { onStdout: text => chunks.push(text) })
  assert.equal(result.stdout, '中文')
  assert.equal(chunks.join(''), '中文')
  const controller = new AbortController()
  const pending = runProcess(process.execPath, ['-e', "console.log('started');setInterval(()=>{},1000)"], { signal: controller.signal, onStdout: () => controller.abort() })
  await assert.rejects(pending, { name: 'AbortError' })
})

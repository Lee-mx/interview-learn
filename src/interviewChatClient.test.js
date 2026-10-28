import assert from 'node:assert/strict'
import test from 'node:test'
import { chatContext, readChatStream } from './interviewChatClient.js'

function response(events, bytewise = false) {
  const data = new TextEncoder().encode(events.map(event => JSON.stringify(event) + '\n').join(''))
  return new Response(new ReadableStream({ start(controller) {
    if (bytewise) for (const byte of data) controller.enqueue(Uint8Array.of(byte))
    else controller.enqueue(data)
    controller.close()
  } }), { headers: { 'Content-Type': 'application/x-ndjson' } })
}

test('real stream parser preserves multibyte text and requires an explicit completion', async () => {
  let text = ''
  const done = await readChatStream(response([{ type: 'delta', text: '中文🙂' }, { type: 'done', provider: 'minimax', expiresAt: 123 }], true), delta => { text += delta })
  assert.equal(text, '中文🙂')
  assert.equal(done.provider, 'minimax')
  await assert.rejects(readChatStream(response([{ type: 'delta', text: '部分回复' }]), () => {}), /提前中断/)
  await assert.rejects(readChatStream(response([{ type: 'delta', text: '部分回复' }, { type: 'error', error: '服务断线' }]), () => {}), /服务断线/)
  await assert.rejects(readChatStream(new Response('{"error":"请重新检测"}', { status: 412 }), () => {}), /重新检测/)
})

test('chat context excludes stopped turns and retains at most eight complete rounds', () => {
  const turns = Array.from({ length: 10 }, (_, index) => ({ prompt: 'Q' + index, reply: 'A' + index, status: 'done' }))
  turns.push({ prompt: '失败问题', reply: '未完成内容', status: 'failed' })
  const result = chatContext(turns, '新问题')
  assert.equal(result.length, 17)
  assert.deepEqual(result[0], { role: 'user', content: 'Q2' })
  assert.deepEqual(result.at(-1), { role: 'user', content: '新问题' })
  assert.doesNotMatch(JSON.stringify(result), /未完成内容/)
  const large = Array.from({ length: 8 }, () => ({ prompt: 'x'.repeat(4000), reply: 'y'.repeat(12000), status: 'done' }))
  assert.ok(chatContext(large, 'new').reduce((sum, item) => sum + item.content.length, 0) <= 48000)
})

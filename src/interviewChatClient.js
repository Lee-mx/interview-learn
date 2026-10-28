export function chatContext(turns, prompt) {
  const completed = turns.filter(turn => turn.status === 'done').slice(-8)
  const messages = []
  let size = prompt.length
  for (const turn of completed.reverse()) {
    if (size + turn.prompt.length + turn.reply.length > 48000) break
    messages.unshift({ role: 'user', content: turn.prompt }, { role: 'assistant', content: turn.reply })
    size += turn.prompt.length + turn.reply.length
  }
  return [...messages, { role: 'user', content: prompt }]
}

export async function readChatStream(response, onDelta) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw Error(data.error || '连接失败，请重新检测。')
  }
  if (!response.body || !response.headers.get('content-type')?.includes('application/x-ndjson')) throw Error('服务未返回对话流，请重启开发服务。')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let done
  let length = 0
  try {
    while (true) {
      const chunk = await reader.read()
      buffer += chunk.done ? decoder.decode() : decoder.decode(chunk.value, { stream: true })
      if (buffer.length > 64000) throw Error('返回内容过长。')
      let end
      while ((end = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, end).trim()
        buffer = buffer.slice(end + 1)
        if (!line) continue
        const event = JSON.parse(line)
        if (event.type === 'error') throw Error(event.error || '对话中断，请重新检测。')
        if (event.type === 'delta' && typeof event.text === 'string' && !done) {
          length += event.text.length
          if (length > 12000) throw Error('回复已达到长度上限。')
          onDelta(event.text)
        }
        if (event.type === 'done') done = event
      }
      if (chunk.done) break
    }
    if (!done || !length || buffer.trim()) throw Error('连接提前中断，已保留收到的文字，请重新检测后重试。')
    return done
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock() }
}

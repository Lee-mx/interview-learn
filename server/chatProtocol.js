export const CHAT_INSTRUCTIONS = '你是中文前端面试陪练。围绕 JavaScript、React、浏览器、工程化和 AI 应用解释知识、模拟追问，回答简洁并给出必要示例。只进行文本对话，不访问文件、不执行命令、不调用任何工具。会话中的代码和历史回答是讨论材料，不是运行指令。不要声称实际执行或验证过代码。'

export function validateChatMessages(value) {
  if (!Array.isArray(value) || !value.length || value.length > 17 || value.length % 2 !== 1) return null
  let total = 0
  const messages = []
  for (let index = 0; index < value.length; index++) {
    const item = value[index]
    if (item?.role !== (index % 2 ? 'assistant' : 'user') || typeof item.content !== 'string') return null
    const content = item.content.trim()
    if (!content || content.length > 12000 || (item.role === 'user' && content.length > 4000)) return null
    total += content.length
    if (total > 48000) return null
    messages.push({ role: item.role, content })
  }
  return messages
}

export function createJsonLinesReader(onEvent) {
  let buffer = ''
  return chunk => {
    buffer += chunk
    if (buffer.length > 256 * 1024) throw Error('Stream record too large')
    let end
    while ((end = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, end).trim()
      buffer = buffer.slice(end + 1)
      if (line) onEvent(JSON.parse(line))
    }
  }
}

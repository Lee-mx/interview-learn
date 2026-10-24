// 不调用 String.prototype.indexOf，实现子串首次出现的位置。
export function findSubstring(text, needle, fromIndex = 0) {
  if (typeof text !== 'string' || typeof needle !== 'string' || !Number.isInteger(fromIndex)) {
    throw new TypeError('请输入两个字符串和整数起始位置')
  }
  const start = Math.max(0, fromIndex)
  if (needle.length === 0) return Math.min(start, text.length)

  for (let index = start; index <= text.length - needle.length; index++) {
    let matched = true
    for (let offset = 0; offset < needle.length; offset++) {
      if (text[index + offset] !== needle[offset]) {
        matched = false
        break
      }
    }
    if (matched) return index
  }
  return -1
}

// 微任务在执行过程中追加的新微任务排在当前已入队微任务之后。
export function runNestedMicrotasks(mode = 'nested') {
  if (mode !== 'nested' && mode !== 'direct') throw new Error('未知排队方式')
  return new Promise(resolve => {
    const lines = ['同步 A']
    queueMicrotask(() => {
      lines.push('微任务 1')
      if (mode === 'nested') queueMicrotask(() => lines.push('微任务 3'))
    })
    if (mode === 'direct') queueMicrotask(() => lines.push('微任务 3'))
    Promise.resolve().then(() => lines.push('微任务 2'))
    lines.push('同步 B')
    setTimeout(() => {
      lines.push('setTimeout')
      resolve(lines)
    }, 0)
  })
}

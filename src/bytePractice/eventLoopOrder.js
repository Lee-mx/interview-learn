// 对比 Promise.then 与 queueMicrotask 的入队先后；定时器属于后续任务。
export function runEventLoopOrder(first = 'promise') {
  if (first !== 'promise' && first !== 'queueMicrotask') throw new Error('未知入队顺序')
  return new Promise(resolve => {
    const lines = ['同步 A']
    setTimeout(() => {
      lines.push('setTimeout')
      resolve(lines)
    }, 0)
    if (first === 'promise') {
      Promise.resolve().then(() => lines.push('Promise.then'))
      queueMicrotask(() => lines.push('queueMicrotask'))
    } else {
      queueMicrotask(() => lines.push('queueMicrotask'))
      Promise.resolve().then(() => lines.push('Promise.then'))
    }
    lines.push('同步 B')
  })
}

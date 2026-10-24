// await 之前的代码同步执行；await 后的续体与 Promise.then 按入队先后执行。
export function runAsyncAwaitOrder(first = 'await') {
  if (first !== 'await' && first !== 'promise') throw new Error('未知入队顺序')
  return new Promise(resolve => {
    const lines = ['同步 A']
    async function work() {
      lines.push('async 开始')
      await Promise.resolve()
      lines.push('await 后')
    }
    const enqueueThen = () => Promise.resolve().then(() => lines.push('Promise.then'))
    if (first === 'await') {
      work()
      enqueueThen()
    } else {
      enqueueThen()
      work()
    }
    lines.push('同步 B')
    setTimeout(() => {
      lines.push('setTimeout')
      resolve(lines)
    }, 0)
  })
}

// 面试原题：
// Promise.reject()
//   .then(() => console.log(1), () => console.log(2))
//   .catch(() => console.log(3))
// 下方用收集输出代替 console.log，供页面比较“正常处理”和“再次抛错”。
export function runPromiseRejectionChain(rethrow = false) {
  const lines = []
  return Promise.reject(new Error('起始拒绝'))
    .then(() => {
      lines.push('1')
    }, () => {
      lines.push('2')
      if (rethrow) throw new Error('再次拒绝')
    })
    .catch(() => {
      lines.push('3')
    })
    .then(() => lines)
}

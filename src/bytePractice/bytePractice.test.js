import test from 'node:test'
import assert from 'node:assert/strict'
import { deepClone } from './deepClone.js'
import { findSubstring } from './findSubstring.js'
import { getPath } from './getPath.js'
import { runEventLoopOrder } from './eventLoopOrder.js'
import { runAsyncAwaitOrder } from './asyncAwaitOrder.js'
import { runNestedMicrotasks } from './nestedMicrotasks.js'
import { runPromiseRejectionChain } from './promiseRejectionChain.js'
import { intersectionIndices, intersectionValues } from './intersectionIndices.js'

test('深拷贝保留循环关系、共享引用和原型', () => {
  class User { greet() { return this.name } }
  const user = Object.assign(Object.create(User.prototype), { name: 'Lin' })
  const date = new Date('2024-01-01')
  const original = { user, date, again: date, tags: new Set(['React']), map: new Map() }
  original.self = original
  original.map.set(user, original)
  const copy = deepClone(original)
  assert.notEqual(copy, original)
  assert.equal(copy.self, copy)
  assert.equal(copy.date, copy.again)
  assert.notEqual(copy.date, date)
  assert.equal(copy.user.greet(), 'Lin')
  assert.equal(copy.map.get(copy.user), copy)
  copy.user.name = 'Ming'
  assert.equal(user.name, 'Lin')
  assert.throws(() => deepClone(new Promise(() => {})), TypeError)
})

test('子串查找与原生 indexOf 的边界一致', () => {
  for (const text of ['', 'aaaaa', 'frontend interview', 'ababa']) {
    for (const needle of ['', 'a', 'aba', 'view', 'not found']) {
      for (const from of [-2, 0, 2, text.length + 2]) {
        assert.equal(findSubstring(text, needle, from), text.indexOf(needle, from))
      }
    }
  }
})

test('简化路径读取区分缺失、undefined 和 null', () => {
  const source = { user: { name: null, age: undefined }, items: [{ title: 'React' }] }
  assert.equal(getPath(source, 'items[0].title', '备用'), 'React')
  assert.equal(getPath(source, 'user.name', '备用'), null)
  assert.equal(getPath(source, 'user.age', '备用'), '备用')
  assert.equal(getPath(source, 'user.missing', '备用'), '备用')
  assert.throws(() => getPath(source, '__proto__.polluted'), Error)
})

test('事件循环示例按实际微任务入队顺序输出', async () => {
  assert.deepEqual(await runEventLoopOrder('promise'), ['同步 A', '同步 B', 'Promise.then', 'queueMicrotask', 'setTimeout'])
  assert.deepEqual(await runEventLoopOrder('queueMicrotask'), ['同步 A', '同步 B', 'queueMicrotask', 'Promise.then', 'setTimeout'])
})

test('await 续体与 Promise.then 按入队先后执行', async () => {
  assert.deepEqual(await runAsyncAwaitOrder('await'), ['同步 A', 'async 开始', '同步 B', 'await 后', 'Promise.then', 'setTimeout'])
  assert.deepEqual(await runAsyncAwaitOrder('promise'), ['同步 A', 'async 开始', '同步 B', 'Promise.then', 'await 后', 'setTimeout'])
  assert.throws(() => runAsyncAwaitOrder('other'), Error)
})

test('嵌套微任务追加到已排队微任务之后', async () => {
  assert.deepEqual(await runNestedMicrotasks('nested'), ['同步 A', '同步 B', '微任务 1', '微任务 2', '微任务 3', 'setTimeout'])
  assert.deepEqual(await runNestedMicrotasks('direct'), ['同步 A', '同步 B', '微任务 1', '微任务 3', '微任务 2', 'setTimeout'])
  assert.throws(() => runNestedMicrotasks('other'), Error)
})

test('then 的拒绝回调处理错误后，后面的 catch 不再执行', async () => {
  assert.deepEqual(await runPromiseRejectionChain(), ['2'])
  assert.deepEqual(await runPromiseRejectionChain(true), ['2', '3'])
})

test('交集下标保留 source 中每次命中的位置', () => {
  assert.deepEqual(intersectionIndices([1, 2, 2, 3], [2, 4]), [1, 2])
  assert.deepEqual(intersectionIndices([2, 4], [1, 2, 2, 3]), [0])
  assert.deepEqual(intersectionIndices([1, 3], [2, 4]), [])
  assert.deepEqual(intersectionIndices([NaN, 0], [NaN, -0]), [0, 1])
  const shared = { id: 1 }
  assert.deepEqual(intersectionIndices([shared, { id: 1 }], [shared]), [0])
})

test('按交集下标取出最终数字或字符串数组', () => {
  assert.deepEqual(intersectionValues([1, 2, 2, 3], [2, 4]), [2, 2])
  assert.deepEqual(intersectionValues(['a', 'b', 'b', 'c'], ['b', 'd']), ['b', 'b'])
  assert.deepEqual(intersectionValues(['2', '3'], [2, 3]), [])
  assert.deepEqual(intersectionValues([1, 3], [2, 4]), [])
})

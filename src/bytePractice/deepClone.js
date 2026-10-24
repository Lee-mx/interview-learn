// 教学实现：支持数组、对象、Date、RegExp、Map、Set 和循环引用。
export function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value
  if (seen.has(value)) return seen.get(value)

  if (value instanceof Date) {
    const copy = new Date(value.getTime())
    seen.set(value, copy)
    return copy
  }
  if (value instanceof RegExp) {
    const copy = new RegExp(value.source, value.flags)
    copy.lastIndex = value.lastIndex
    seen.set(value, copy)
    return copy
  }
  if (value instanceof Map) {
    const copy = new Map()
    seen.set(value, copy)
    value.forEach((item, key) => copy.set(deepClone(key, seen), deepClone(item, seen)))
    return copy
  }
  if (value instanceof Set) {
    const copy = new Set()
    seen.set(value, copy)
    value.forEach(item => copy.add(deepClone(item, seen)))
    return copy
  }

  if (!Array.isArray(value) && Object.prototype.toString.call(value) !== '[object Object]') {
    throw new TypeError('这个教学版本不支持该内建对象类型')
  }
  const copy = Array.isArray(value) ? new Array(value.length) : Object.create(Object.getPrototypeOf(value))
  seen.set(value, copy)
  for (const key of Reflect.ownKeys(value)) {
    if (Array.isArray(value) && key === 'length') continue
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if ('value' in descriptor) descriptor.value = deepClone(descriptor.value, seen)
    Object.defineProperty(copy, key, descriptor)
  }
  return copy
}

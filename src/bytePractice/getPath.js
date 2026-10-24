// 简化版 lodash.get：支持 a.b 与 items[0].name，不执行路径文本。
export function getPath(source, path, fallback) {
  if (typeof path !== 'string' || !/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\[\d+\])*$/.test(path)) {
    throw new Error('路径请使用 a.b 或 items[0].name 形式')
  }
  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean)
  if (keys.some(key => ['__proto__', 'prototype', 'constructor'].includes(key))) {
    throw new Error('不读取原型相关路径')
  }
  let current = source
  for (const key of keys) {
    if (current === null || current === undefined || !Object.hasOwn(Object(current), key)) return fallback
    current = current[key]
  }
  return current === undefined ? fallback : current
}

// 返回 source 中也出现在 other 里的所有位置；重复元素对应的下标会保留。
export const intersectionIndices = (source, other) => source.flatMap((value, index) => other.includes(value) ? [index] : [])

// 按这些下标从 source 取值，得到最终交集数组（保留 source 中的重复值）。
export const intersectionValues = (source, other) => intersectionIndices(source, other).map(index => source[index])

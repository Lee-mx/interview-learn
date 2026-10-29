import { useEffect, useState } from 'react'

export function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function SearchBox({ label }) {
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query)
  return <section><label>{label}<input value={query} onChange={event => setQuery(event.target.value)} /></label>
    <p>即时输入：{query || '空'}<br />停止输入 500ms 后：{debounced || '空'}</p></section>
}

export default function CustomHookDemo() {
  return <div className="demo-list advanced-demo"><h3>复用逻辑，状态各自独立</h3>
    <SearchBox label="搜索框 A" /><SearchBox label="搜索框 B" />
    <small>两个组件调用同一个 Hook，但各自拥有 State 和定时器。这里只延迟显示，没有发网络请求。</small>
  </div>
}

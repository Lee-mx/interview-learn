import { useRef, useState } from 'react'

export default function RefDemo() {
  const input = useRef(null)
  const clicks = useRef(0)
  const [snapshot, setSnapshot] = useState(0)
  return <div className="demo-list advanced-demo">
    <h3>保存引用，不触发渲染</h3>
    <input ref={input} aria-label="聚焦实验输入框" placeholder="点击按钮让我获得焦点" />
    <button onClick={() => input.current?.focus()}>聚焦输入框</button>
    <button onClick={() => { clicks.current += 1 }}>只修改 ref +1</button>
    <p>最近一次读取：{snapshot}</p>
    <button onClick={() => setSnapshot(clicks.current)}>读取 ref，更新 State</button>
    <small>先点几次“只修改 ref”，页面数值不会跟着变；读取并更新 State 后才显示。</small>
  </div>
}

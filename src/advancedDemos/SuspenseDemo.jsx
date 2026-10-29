import { lazy, Suspense, useState } from 'react'

// 声明在组件外，避免重新渲染时创建新的 lazy 组件。
const LazyCard = lazy(() => Promise.all([
  import('./LazyCard.jsx'),
  new Promise(resolve => setTimeout(resolve, 800)), // 教学延时，方便观察 fallback。
]).then(([module]) => module))

export default function SuspenseDemo() {
  const [open, setOpen] = useState(false)
  return <div className="demo-list advanced-demo"><h3>加载中与加载完成</h3>
    <button onClick={() => setOpen(value => !value)}>{open ? '隐藏组件' : '显示懒加载组件'}</button>
    {open && <Suspense fallback={<p role="status">正在加载模块…</p>}><LazyCard /></Suspense>}
    <small>首次加载额外等待 800ms。lazy 会缓存结果，隐藏后再打开通常直接显示。普通 Effect 请求不会自动触发 Suspense；加载错误需由错误边界处理。</small>
  </div>
}

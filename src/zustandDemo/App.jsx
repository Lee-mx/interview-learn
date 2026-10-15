import { ProgressControls, ProgressSummary } from './ProgressWidgets.jsx'

export default function App() {
  return <div className="demo-centered text-left">
    <h3 className="demo-title">不写 Provider，也能共享状态</h3>
    <p className="demo-caption mt-2">组件 A 调用 store 中的 action；组件 B 通过 selector 订阅需要的数据。</p>
    <ProgressControls />
    <ProgressSummary />
  </div>
}

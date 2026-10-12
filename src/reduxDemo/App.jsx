import { useState } from 'react'
import { Provider } from 'react-redux'
import { createProgressStore } from './store.js'
import { ProgressControls, ProgressSummary } from './ProgressWidgets.jsx'

export default function App() {
  // 每次重新挂载示例时创建独立 store，方便“重置示例”恢复初始状态。
  const [store] = useState(createProgressStore)

  return <Provider store={store}>
    <div className="demo-centered text-left">
      <h3 className="demo-title">输入数字，观察共享状态</h3>
      <p className="demo-caption mt-2">App 提供 store；组件 A 产生数据并派发 action；组件 B 读取更新后的状态。</p>
      <ProgressControls />
      <ProgressSummary />
    </div>
  </Provider>
}

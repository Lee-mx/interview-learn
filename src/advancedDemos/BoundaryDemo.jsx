import { Component, useState } from 'react'

export class DemoBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div role="alert"><h3>这个区域暂时不可用</h3>
      <p>其他区域仍可操作。</p><button onClick={this.props.onReset}>重置错误区域</button></div> : this.props.children
  }
}

function RiskyCard({ broken }) {
  if (broken) throw new Error('教学示例：子组件渲染失败')
  return <p>子组件当前正常渲染。</p>
}

export default function BoundaryDemo() {
  const [broken, setBroken] = useState(false)
  const [version, setVersion] = useState(0)
  const [outside, setOutside] = useState(0)
  return <div className="demo-list advanced-demo">
    <button onClick={() => setOutside(value => value + 1)}>边界外计数：{outside}</button>
    <DemoBoundary key={version} onReset={() => { setBroken(false); setVersion(value => value + 1) }}>
      <RiskyCard broken={broken} /><button onClick={() => setBroken(true)}>触发子组件渲染错误</button>
    </DemoBoundary>
    <small>按钮只改 State；异常在子组件的下一次渲染中抛出。开发控制台会有预期的错误日志。</small>
  </div>
}

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function PortalWindow({ onClose }) {
  const dialog = useRef(null)
  useEffect(() => {
    const element = dialog.current
    element.showModal()
    return () => element.close()
  }, [])
  return <dialog className="advanced-modal" ref={dialog} aria-labelledby="portal-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <h3 id="portal-title">我挂载在 document.body 下</h3>
    <p>DOM 位置改变了，React 组件关系没有改变。</p>
    <button>点击这里，让事件向 React 父组件冒泡</button>
    <button onClick={event => { event.stopPropagation(); onClose() }}>关闭弹窗</button>
  </dialog>
}

export default function PortalDemo() {
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState(0)
  return <div className="demo-list advanced-demo" onClick={() => setEvents(value => value + 1)}>
    <h3>Portal 改变 DOM 落点</h3><p>父组件收到的点击：{events}</p>
    <button onClick={event => { event.stopPropagation(); setOpen(true) }}>打开 Portal 弹窗</button>
    {open && createPortal(<PortalWindow onClose={() => setOpen(false)} />, document.body)}
    <small>点弹窗内的冒泡按钮，再关闭弹窗看计数。原生 dialog 提供模态、焦点约束和 Escape 关闭能力。</small>
  </div>
}

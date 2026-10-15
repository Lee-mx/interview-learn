import { useState } from 'react'
import { useProgressStore } from './store.js'

export function ProgressControls() {
  const [amount, setAmount] = useState('2')
  const addAmount = useProgressStore((state) => state.addAmount)
  const reset = useProgressStore((state) => state.reset)

  function handleSubmit(event) {
    event.preventDefault()
    addAmount(Number(amount))
  }

  return <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-[#dce8d8] bg-white px-5 py-4 shadow-sm">
    <label className="demo-overline" htmlFor="zustand-amount">业务组件 A · 输入要完成的节数</label>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <input id="zustand-amount" className="demo-input !w-24" type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
      <button type="submit" className="rounded-xl bg-[#326f51] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#245a41]">调用 addAmount</button>
      <button type="button" className="rounded-xl border border-[#cfdfce] bg-white px-4 py-2.5 text-sm font-medium text-[#315b46] hover:bg-[#f5fbf2]" onClick={reset}>重置</button>
    </div>
    <p className="demo-caption mt-3">输入值 → store action → set 更新状态</p>
  </form>
}

export function ProgressSummary() {
  const completed = useProgressStore((state) => state.completed)
  const lastAdded = useProgressStore((state) => state.lastAdded)

  return <div className="mt-3 rounded-2xl border border-[#dce8d8] bg-white px-5 py-4 text-left shadow-sm">
    <span className="demo-overline">业务组件 B · 按 selector 读取状态</span>
    <p className="mt-2 text-2xl font-semibold text-[#315b46]">已完成 {completed} 节</p>
    <p className="demo-caption mt-2">上次增加：{lastAdded > 0 ? `+${lastAdded}` : '暂无'}</p>
  </div>
}

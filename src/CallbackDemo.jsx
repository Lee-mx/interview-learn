import { memo, useCallback, useEffect, useState } from 'react'

const ActionCard = memo(function ActionCard({ title, onAdd }) {
  const [callbackChanges, setCallbackChanges] = useState(0)

  useEffect(() => {
    setCallbackChanges((value) => value + 1)
  }, [onAdd])

  return <div className="rounded-2xl border border-[#dce8d8] bg-white px-4 py-4 text-left shadow-sm">
    <strong className="text-sm text-[#315b46]">{title}</strong>
    <p className="demo-caption mt-2">收到新回调：{callbackChanges} 次</p>
    <button className="mt-3 rounded-xl border border-[#cfdfce] px-3 py-2 text-sm text-[#315b46] hover:bg-[#f5fbf2]" onClick={onAdd}>计数 +1</button>
  </div>
})

export default function CallbackDemo() {
  const [count, setCount] = useState(0)
  const [dark, setDark] = useState(false)
  const stableAdd = useCallback(() => setCount((value) => value + 1), [])
  const inlineAdd = () => setCount((value) => value + 1)

  return <div className="demo-list">
    <span className="demo-overline">STABLE FUNCTION REFERENCE</span>
    <h3 className="demo-title mt-2">计数：{count}</h3>
    <button className="mt-3 rounded-xl bg-[#326f51] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#245a41]" onClick={() => setDark((value) => !value)}>切换无关外观</button>
    <div className={`mt-4 grid gap-3 rounded-2xl p-3 sm:grid-cols-2 ${dark ? 'bg-[#dce9e5]' : 'bg-[#f3f8ef]'}`}>
      <ActionCard title="useCallback：依赖不变" onAdd={stableAdd} />
      <ActionCard title="普通函数：每次新建" onAdd={inlineAdd} />
    </div>
    <p className="demo-caption mt-4">反复切换外观：左侧回调引用不变，右侧每次都会改变。开发环境 Strict Mode 首次可能额外执行 Effect，请比较后续增量。</p>
  </div>
}

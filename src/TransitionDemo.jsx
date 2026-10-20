import { memo, useState, useTransition } from 'react'

const subjects = ['React', 'Vite', 'JavaScript', 'TypeScript']
const lessons = Array.from({ length: 800 }, (_, index) => ({
  id: index + 1,
  title: `${subjects[index % subjects.length]} 练习 ${index + 1}`,
}))

const Results = memo(function Results({ query }) {
  const matches = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return <div className="mt-4">
    <p className="demo-caption mb-2">结果关键词：<strong>{query || '全部'}</strong> · {matches.length} 项</p>
    <div className="max-h-44 space-y-1 overflow-y-auto rounded-xl border border-[#dce8d8] bg-white p-2" aria-label="筛选结果">
      {matches.slice(0, 100).map(lesson => <div key={lesson.id} className="rounded-lg bg-[#f3f8ef] px-3 py-1.5 text-sm text-[#315b46]">{lesson.title}</div>)}
      {matches.length > 100 && <p className="px-3 py-1 text-xs text-[#78917c]">仅展示前 100 项</p>}
      {matches.length === 0 && <p className="px-3 py-2 text-sm text-[#78917c]">没有匹配的练习</p>}
    </div>
  </div>
})

export default function TransitionDemo() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(event) {
    const next = event.target.value
    setInput(next) // 输入框是紧急更新，保持受控输入即时响应
    startTransition(() => {
      setQuery(next) // 结果列表是非紧急更新，可以被后续输入打断
    })
  }

  return <div className="demo-list">
    <span className="demo-overline">URGENT INPUT · BACKGROUND RESULTS</span>
    <h3 className="demo-title mb-4">搜索学习练习</h3>
    <input className="demo-input" value={input} onChange={handleChange} placeholder="试试输入 React / Vite" aria-label="搜索练习" />
    <p className="demo-caption mt-3" aria-live="polite">{isPending ? '结果更新中…' : '结果已更新'} · 输入框：{input || '空'}</p>
    <Results query={query} />
    <p className="demo-caption mt-4">输入框立即更新，列表稍后完成渲染；列表很快时，等待状态可能一闪而过。Transition 不会防抖，也不会让筛选计算本身变快。</p>
  </div>
}

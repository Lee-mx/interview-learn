import { useState } from 'react'

const entries = [
  {
    name: 'useActionState', version: 'React 19.0',
    scenario: '提交表单', flow: ['触发 Action', '读取 pending', '展示返回状态'],
    takeaway: '把提交结果、校验消息和等待状态放在同一条更新链路中。',
    url: 'https://react.dev/reference/react/useActionState',
  },
  {
    name: 'useOptimistic', version: 'React 19.0',
    scenario: '点击点赞', flow: ['先显示 +1', '等待服务端', '确认或回退'],
    takeaway: '乐观状态只是临时显示，最终仍要以真实结果更新基础状态。',
    url: 'https://react.dev/reference/react/useOptimistic',
  },
  {
    name: 'useFormStatus', version: 'React DOM 19.0',
    scenario: '表单内按钮', flow: ['父级 form 提交', '子组件读 pending', '禁用提交按钮'],
    takeaway: '从 react-dom 导入；必须在目标 form 的后代组件中读取。',
    url: 'https://react.dev/reference/react-dom/hooks/useFormStatus',
  },
  {
    name: 'useEffectEvent', version: 'React 19.2',
    scenario: '计时器读取最新步长', flow: ['建立一次 Effect', '读取最新值', '不因步长重建'],
    takeaway: '只用于从 Effect 触发的事件逻辑，不是规避依赖规则的通用工具。',
    url: 'https://react.dev/reference/react/useEffectEvent',
  },
  {
    name: 'use（API）', version: 'React 19.0',
    scenario: '读取 Promise', flow: ['读取稳定资源', '等待时 Suspense', '完成后显示数据'],
    takeaway: '名字虽像 Hook，官方归类为 API；可在条件分支中调用。',
    url: 'https://react.dev/reference/react/use',
  },
]

export default function React19GuideDemo() {
  const [active, setActive] = useState(0)
  const entry = entries[active]
  return <div className="w-full max-w-[520px] rounded-2xl border border-[#dbe8d7] bg-white p-5 text-left shadow-sm">
    <span className="text-[11px] font-semibold tracking-[.16em] text-[#577c60]">REACT 19 · 概念导览</span>
    <p className="mt-2 text-xs leading-5 text-[#718476]">本站运行 React 18；这里仅演示使用场景，左侧代码需放到对应版本的 React 项目运行。</p>
    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="选择 React 19 API">
      {entries.map((item, index) => <button key={item.name} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={'rounded-lg border px-2.5 py-1.5 text-xs transition ' + (active === index ? 'border-[#84b38a] bg-[#e8f3e4] text-[#245a41]' : 'border-[#dbe8d7] text-[#617969] hover:bg-[#f5faf3]')}>{item.name}</button>)}
    </div>
    <div className="mt-5 rounded-xl bg-[#f4f8f0] p-4">
      <div className="flex items-center justify-between gap-2"><strong className="text-sm text-[#254b36]">{entry.scenario}</strong><span className="text-[11px] text-[#668270]">{entry.version}</span></div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#355840]">{entry.flow.map((step, index) => <span key={step} className="rounded-full bg-white px-2.5 py-1.5 shadow-sm">{index + 1}. {step}</span>)}</div>
      <p className="mt-4 text-xs leading-5 text-[#526d59]">{entry.takeaway}</p>
    </div>
    <a className="mt-4 inline-block text-xs font-semibold text-[#326f51] underline underline-offset-4" href={entry.url} target="_blank" rel="noopener noreferrer">查看 React 官方文档 ↗</a>
  </div>
}

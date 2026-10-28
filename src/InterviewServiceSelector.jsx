import { useState } from 'react'
import { LoaderCircle, MessageSquare, RotateCcw } from 'lucide-react'
import { AI_PROVIDERS } from './interviewProviders.js'
import InterviewChatDialog from './InterviewChatDialog.jsx'

export default function InterviewServiceSelector({ provider, statuses, checking, busy, onChange, onRefresh }) {
  const [chatOpen, setChatOpen] = useState(false)
  return <section className="mi-service-bar" aria-label="AI 服务选择">
    <div className="mi-service-heading"><strong>AI 面试服务</strong><span>点评、追问、复盘与同题对比</span><button className="mi-chat-launch" disabled={busy} onClick={() => setChatOpen(true)}><MessageSquare size={14} />打开 AI 对话</button></div>
    <div className="mi-service-options">{AI_PROVIDERS.map(item => <button key={item.id}
      className={provider === item.id ? 'is-selected' : ''} aria-pressed={provider === item.id}
      aria-label={'使用 ' + item.name} disabled={busy} onClick={() => onChange(item.id)}>
      <span>{item.name}</span><small><i className={'mi-dot ' + (statuses?.[item.id]?.ready ? 'is-ready' : '')} />{checking ? '检测中…' : statuses?.[item.id]?.ready ? item.id === 'codex' ? '已登录' : '已配置' : statuses ? '未就绪' : '待检测'}</small>
    </button>)}</div>
    <button className="mi-service-refresh" disabled={checking || busy} onClick={onRefresh} aria-label="重新检测两个 AI 服务">{checking ? <LoaderCircle size={15} className="mi-spin" /> : <RotateCcw size={15} />}重新检测</button>
    <p className="mi-service-note" role="status">{busy ? '正在生成，完成后可切换服务。' : statuses?.[provider]?.message || '正在读取本机服务配置…'}<span>切换仅影响后续请求，已有结果保留原服务来源。</span></p>
    <InterviewChatDialog open={chatOpen} onClose={() => setChatOpen(false)} provider={provider} onProviderChange={onChange} />
  </section>
}

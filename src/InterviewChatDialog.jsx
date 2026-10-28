import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, MessageSquare, Send, Square, Trash2, X } from 'lucide-react'
import { AI_PROVIDERS, providerName } from './interviewProviders.js'
import { chatContext, readChatStream } from './interviewChatClient.js'
import './interviewChat.css'

const empty = () => ({ turns: [], draft: '', connection: null, error: '' })

export default function InterviewChatDialog({ open, onClose, provider, onProviderChange }) {
  const [sessions, setSessions] = useState({ codex: empty(), minimax: empty() })
  const [activity, setActivity] = useState(null)
  const [now, setNow] = useState(Date.now())
  const dialog = useRef(null)
  const input = useRef(null)
  const bottom = useRef(null)
  const request = useRef(null)
  const alive = useRef(true)
  const session = sessions[provider]
  const ready = session.connection?.expiresAt > now
  const busy = Boolean(activity)
  const patch = (id, value) => setSessions(old => ({ ...old, [id]: { ...old[id], ...value } }))
  const updateTurn = (id, turnId, update) => setSessions(old => ({ ...old, [id]: { ...old[id], turns: old[id].turns.map(turn => turn.id === turnId ? update(turn) : turn) } }))

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false; request.current?.abort() }
  }, [])
  useEffect(() => {
    if (open) {
      dialog.current?.showModal()
      setNow(Date.now())
      const timer = setInterval(() => setNow(Date.now()), 1000)
      return () => clearInterval(timer)
    }
    request.current?.abort()
    dialog.current?.close()
  }, [open])
  useEffect(() => { if (open) bottom.current?.scrollIntoView({ block: 'nearest' }) }, [session.turns, activity, open])

  const close = () => { request.current?.abort(); onClose() }
  const connect = async () => {
    if (request.current) return
    const id = provider
    const controller = new AbortController()
    request.current = controller
    setActivity('connect')
    patch(id, { connection: null, error: '' })
    const timer = setTimeout(() => controller.abort('timeout'), 50000)
    try {
      const response = await fetch('/api/interview/connect', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: id }) })
      const data = await response.json()
      if (!response.ok || !data.ready || data.provider !== id) throw Error(data.error || '连接验证失败。')
      if (alive.current) { patch(id, { connection: data }); setNow(Date.now()); input.current?.focus() }
    } catch (error) {
      if (alive.current && (!controller.signal.aborted || controller.signal.reason === 'timeout')) patch(id, { error: controller.signal.aborted ? '检测超时，请检查网络后重试。' : error.message })
    } finally {
      clearTimeout(timer)
      request.current = null
      if (alive.current) setActivity(null)
    }
  }

  const send = async event => {
    event?.preventDefault()
    const prompt = session.draft.trim()
    if (request.current || !prompt) return
    if (!session.connection || session.connection.expiresAt <= Date.now()) { patch(provider, { connection: null, error: '请先检测连接，验证通过后才能发送。' }); return }
    const id = provider
    const turnId = crypto.randomUUID()
    const controller = new AbortController()
    request.current = controller
    setActivity('chat')
    patch(id, { error: '', draft: '', turns: [...session.turns, { id: turnId, prompt, reply: '', status: 'streaming' }].slice(-20) })
    const timer = setTimeout(() => controller.abort('timeout'), 130000)
    try {
      const response = await fetch('/api/interview/chat', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: id, token: session.connection.token, messages: chatContext(session.turns, prompt) }) })
      const result = await readChatStream(response, delta => {
        if (alive.current) updateTurn(id, turnId, turn => ({ ...turn, reply: turn.reply + delta }))
      })
      if (result.provider !== id) throw Error('回复来源不匹配，请重新检测。')
      if (alive.current) {
        updateTurn(id, turnId, turn => ({ ...turn, status: 'done' }))
        patch(id, { connection: { ...session.connection, expiresAt: result.expiresAt } })
        setNow(Date.now())
      }
    } catch (error) {
      if (alive.current) {
        const stopped = controller.signal.aborted && controller.signal.reason !== 'timeout'
        updateTurn(id, turnId, turn => ({ ...turn, status: stopped ? 'stopped' : 'failed' }))
        patch(id, { draft: prompt, ...(stopped ? {} : { connection: null, error: controller.signal.aborted ? '生成超时，已保留回复和原问题。请重新检测。' : error.message }) })
      }
    } finally {
      clearTimeout(timer)
      request.current = null
      if (alive.current) { setActivity(null); input.current?.focus() }
    }
  }

  return <dialog ref={dialog} className="mi-chat-dialog" aria-labelledby="mi-chat-title" onCancel={event => { event.preventDefault(); close() }}>
    <header className="mi-chat-header"><div><span className="mi-eyebrow">INTERVIEW CHAT</span><h2 id="mi-chat-title"><MessageSquare size={20} /> AI 面试对话</h2></div><button onClick={close} aria-label="关闭对话" className="mi-chat-icon"><X size={21} /></button></header>
    <div className="mi-chat-toolbar"><div className="mi-chat-tabs">{AI_PROVIDERS.map(item => <button key={item.id} aria-pressed={provider === item.id} disabled={busy} onClick={() => onProviderChange(item.id)}>{item.name}</button>)}</div>
      <button className="mi-chat-icon" aria-label="清空当前服务对话" disabled={busy || !session.turns.length} onClick={() => patch(provider, { turns: [], error: '' })}><Trash2 size={17} /></button></div>
    <div className={'mi-chat-connection ' + (ready ? 'is-ready' : '')} role="status"><div><strong>{activity === 'connect' ? '正在验证模型响应…' : ready ? `${providerName(provider)} 已连接` : '模型连接尚未验证'}</strong><p>{activity === 'connect' ? '正在发送一条简短测试，通常需要数秒。' : ready ? '可发送消息，回复会实时显示。空闲 3 分钟后需重新检测。' : '先发起真实模型检测，通过后开放发送。检测会使用少量模型额度。'}</p></div><button disabled={busy} onClick={connect}>{activity === 'connect' ? <LoaderCircle size={16} className="mi-spin" /> : null}{ready ? '重新检测' : '检测并连接'}</button></div>
    <div className="mi-chat-messages" aria-label={`${providerName(provider)} 对话记录`}>
      {!session.turns.length && <div className="mi-chat-empty"><MessageSquare size={30} /><h3>把没讲清楚的地方，再聊透一点。</h3><p>可以练一道题、追问一个原理，或请 AI 帮你梳理回答。</p><div>{['用一道 React 状态管理题考考我', '帮我梳理事件循环的面试回答', '如何讲清楚一个项目的技术难点？'].map(prompt => <button key={prompt} disabled={busy} onClick={() => { patch(provider, { draft: prompt }); input.current?.focus() }}>{prompt}</button>)}</div></div>}
      {session.turns.map(turn => <div className="mi-chat-turn" key={turn.id}><article className="mi-chat-user"><strong>你</strong><p>{turn.prompt}</p></article><article className="mi-chat-assistant"><strong>{providerName(provider)}{turn.status === 'streaming' && <LoaderCircle size={13} className="mi-spin" />}</strong><p>{turn.reply || (turn.status === 'streaming' ? '正在等待模型回复…' : '本次没有收到回复。')}</p>{['stopped', 'failed'].includes(turn.status) && <small>{turn.status === 'stopped' ? '已停止' : '回复未完成'} · 此轮不加入后续上下文</small>}</article></div>)}
      <div ref={bottom} />
    </div>
    {session.error && <div className="mi-chat-error" role="alert">{session.error}</div>}
    <form className="mi-chat-composer" onSubmit={send}><label htmlFor="mi-chat-input">你的问题 <span>{session.draft.length} / 4000</span></label><textarea ref={input} id="mi-chat-input" value={session.draft} maxLength={4000} disabled={busy} placeholder="输入想练习或追问的问题…" onChange={event => patch(provider, { draft: event.target.value })} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) send(event) }} />
      <div><small>Enter 发送 · Shift + Enter 换行<br />对话仅在本页保留，不计入面试复盘；最近 8 轮完整对话会发送给所选服务。</small>{activity === 'chat' ? <button type="button" onClick={() => request.current?.abort()}><Square size={15} />停止生成</button> : <button type="submit" disabled={!ready || busy || !session.draft.trim()}><Send size={15} />发送</button>}</div></form>
  </dialog>
}

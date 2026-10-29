import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, CheckCircle2, Clock3, Download, LoaderCircle, MessageSquare, RotateCcw, Save, SkipForward, Sparkles } from 'lucide-react'
import { archiveCategories, archiveQuestions } from './archiveQuestions.js'
import { completeQuestion, createInterview, exportInterview, formatDuration, INTERVIEW_STORAGE_KEY, restoreWorkspace, selectQuestions, validComparison } from './mockInterviewSession.js'
import { addWeakQuestion, recordReviewAttempt, restoreReviewLibrary, reviewBaselines, selectReviewQuestions, setReviewMastery } from './interviewReview.js'
import { AnswerComparison, ReviewDashboard } from './InterviewReviewPanel.jsx'
import InterviewServiceSelector from './InterviewServiceSelector.jsx'
import { AI_PROVIDERS, feedbackLabel, normalizeProvider, providerName, resultProviderName, switchSessionProvider } from './interviewProviders.js'
import './mockInterview.css'

const categoryName = id => id === 'weak' ? '薄弱点重练' : id === 'all' ? '综合面试' : archiveCategories.find(item => item.id === id)?.short || '专项练习'
const getQuestion = id => archiveQuestions.find(item => item.id === id)
const dateLabel = value => new Date(value).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

function readInitial() {
  try {
    const raw = localStorage.getItem(INTERVIEW_STORAGE_KEY)
    const workspace = restoreWorkspace(raw, archiveQuestions)
    let saved
    try { saved = JSON.parse(raw) } catch { /* Invalid JSON is handled by restoreWorkspace. */ }
    return { ...workspace, preferredProvider: normalizeProvider(saved?.preferredProvider || workspace.session?.provider), library: restoreReviewLibrary(saved?.reviewLibrary, [...workspace.recent, workspace.session], archiveQuestions) }
  } catch { return { session: null, recent: [], library: {}, storageBlocked: true } }
}

function ReferenceAnswer({ question }) {
  return <details className="mi-reference">
    <summary><BookOpen size={15} /> 展开参考思路</summary>
    <div>{question.answer?.map((item, index) => <p key={index}>{item}</p>)}
      {question.example && <details><summary>查看参考代码</summary><pre><code>{question.example}</code></pre></details>}
      <a href={'#/archive/' + question.category}>前往对应题库 <ArrowRight size={13} /></a>
    </div>
  </details>
}

function AnswerRecord({ item, number, marked, onMark, comparison }) {
  const question = getQuestion(item.questionId)
  return <section className="mi-record">
    <div className="mi-record-head"><span className="mi-number">{String(number).padStart(2, '0')}</span>
      <div><span className={'mi-tag ' + (item.skipped ? 'is-amber' : '')}>{item.skipped ? '已跳过' : '已作答'}</span><h3>{item.question}</h3></div>
      <button className={'mi-icon-button ' + (marked ? 'is-marked' : '')} onClick={onMark} aria-pressed={marked} aria-label={marked ? '取消待复习标记' : '标记为待复习'}><Bookmark size={17} fill={marked ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="mi-record-body"><h4>我的回答</h4><p>{item.answer || '本题尚未作答。'}</p>
      {item.feedback && <div className="mi-feedback"><span>{feedbackLabel(item)}</span><p>{item.feedback}</p></div>}
      {item.followUp && <><h4>追问 · {item.followUp}</h4><p>{item.followUpAnswer || '未回答追问'}</p></>}
      <ReferenceAnswer question={question} />
      {comparison}
    </div>
  </section>
}

export default function MockInterviewPage() {
  const [initial] = useState(readInitial)
  const [workspaceSession, setWorkspaceSession] = useState(initial.session)
  const [historyPreview, setHistoryPreview] = useState(null)
  const session = historyPreview || workspaceSession
  const setSession = updater => historyPreview ? setHistoryPreview(updater) : setWorkspaceSession(updater)
  const [recent, setRecent] = useState(initial.recent)
  const [library, setLibrary] = useState(initial.library)
  const [showSetup, setShowSetup] = useState(!initial.session)
  const [preferredProvider, setPreferredProvider] = useState(normalizeProvider(initial.preferredProvider))
  const provider = showSetup ? preferredProvider : normalizeProvider(session?.provider)
  const [category, setCategory] = useState('javascript')
  const [count, setCount] = useState(10)
  const [mode, setMode] = useState('ai')
  const [status, setStatus] = useState(null)
  const [checking, setChecking] = useState(false)
  const [storageError, setStorageError] = useState(Boolean(initial.storageBlocked))
  const [busy, setBusy] = useState(false)
  const [aiTask, setAiTask] = useState(null)
  const [waitSeconds, setWaitSeconds] = useState(0)
  const [error, setError] = useState('')
  const [inspectIndex, setInspectIndex] = useState(null)
  const [reviewFilter, setReviewFilter] = useState('all')
  const requestRef = useRef(null)
  const statusRef = useRef(null)
  const alive = useRef(true)
  const headingRef = useRef(null)

  const refreshStatus = useCallback(async () => {
    statusRef.current?.abort()
    const controller = new AbortController()
    statusRef.current = controller
    setChecking(true)
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch('/api/interview/status', { signal: controller.signal, cache: 'no-store' })
      if (!response.ok) throw new Error()
      const data = await response.json()
      if (alive.current && !controller.signal.aborted) setStatus(data.providers || { codex: data, minimax: { ready: false, message: '请重启开发服务以启用 MiniMax。' } })
    } catch {
      if (alive.current && statusRef.current === controller) setStatus(Object.fromEntries(AI_PROVIDERS.map(item => [item.id, { ready: false, message: 'AI 服务暂未连接。可以重新检测，或选择题库自练。' }])))
    } finally {
      clearTimeout(timeout)
      if (alive.current && statusRef.current === controller) setChecking(false)
    }
  }, [])

  useEffect(() => {
    alive.current = true
    refreshStatus()
    window.addEventListener('focus', refreshStatus)
    return () => {
      alive.current = false
      requestRef.current?.abort()
      statusRef.current?.abort()
      window.removeEventListener('focus', refreshStatus)
    }
  }, [refreshStatus])

  useEffect(() => {
    if (session?.stage === 'review') setRecent(previous => [session, ...previous.filter(item => item.id !== session.id)]
      .sort((a, b) => b.startedAt - a.startedAt).slice(0, 5))
  }, [session])

  useLayoutEffect(() => {
    try {
      localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify({ session: workspaceSession, recent, preferredProvider, reviewLibrary: { version: 1, entries: Object.values(library) } }))
      setStorageError(false)
    } catch { setStorageError(true) }
  }, [workspaceSession, recent, library, preferredProvider])

  const running = Boolean(session && !showSetup && session.stage !== 'review')
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') setSession(previous => ({ ...previous, elapsedSeconds: previous.elapsedSeconds + 1 }))
    }, 1000)
    return () => clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (!busy) return
    setWaitSeconds(0)
    const timer = setInterval(() => setWaitSeconds(value => value + 1), 1000)
    return () => clearInterval(timer)
  }, [busy])

  useEffect(() => {
    if (showSetup || session?.stage === 'review') window.scrollTo(0, 0)
    else {
      headingRef.current?.focus({ preventScroll: true })
      headingRef.current?.scrollIntoView({ block: 'start' })
    }
  }, [session?.index, session?.stage, showSetup])

  const current = session ? getQuestion(session.questionIds[session.index]) : null
  const total = session?.questionIds.length || 0
  const poolSize = category === 'all' ? archiveQuestions.length : archiveQuestions.filter(item => item.category === category).length
  const answered = session?.history.filter(item => !item.skipped).length || 0
  const skipped = session?.history.filter(item => item.skipped).length || 0
  const markedCount = session?.markedIds.length || 0
  const patchSession = patch => setSession(previous => ({ ...previous, ...patch }))
  const changeProvider = next => {
    if (busy || requestRef.current) return
    setPreferredProvider(normalizeProvider(next))
    if (!showSetup) setSession(previous => switchSessionProvider(previous, next))
  }

  const start = kind => {
    const isWeak = kind === 'weak'
    const questions = isWeak ? selectReviewQuestions(archiveQuestions, library, count) : selectQuestions(archiveQuestions, category, count)
    if (!questions.length) return
    if (session && session.stage !== 'review' && !window.confirm('开始新一轮会替换当前未完成的练习和草稿，确定开始吗？')) return
    setHistoryPreview(null)
    setWorkspaceSession(createInterview(questions, {
      category: isWeak ? 'weak' : category, mode, provider: preferredProvider, practiceKind: isWeak ? 'weak' : 'general',
      baselines: reviewBaselines(library, questions, recent),
    }))
    setShowSetup(false)
    setInspectIndex(null)
    setError('')
    setReviewFilter('all')
  }

  const markQuestion = id => {
    const adding = !session.markedIds.includes(id)
    setSession(previous => ({
      ...previous, markedIds: adding ? [...previous.markedIds, id] : previous.markedIds.filter(item => item !== id),
    }))
    if (adding) setLibrary(previous => {
      const next = addWeakQuestion(previous, id, 'marked')
      const record = session.history.find(item => item.questionId === id)
      return record ? recordReviewAttempt(next, session, record) : next
    })
  }

  const setMastery = (id, mastered, delayDays = 0) => setLibrary(previous => setReviewMastery(previous, id, mastered, Date.now(), delayDays))

  const finish = (skip = false) => {
    const next = completeQuestion(session, current, skip)
    if (next === session) return
    setSession(next)
    setLibrary(previous => recordReviewAttempt(previous, next, next.history[session.index]))
    setInspectIndex(null)
    setError('')
  }

  const useBank = () => {
    if (!session.answer.trim() || busy) return
    patchSession({
      stage: 'followup',
      pending: {
        answer: session.answer.trim(), feedback: '这次追问来自题库。完成后可对照参考思路复盘，未生成 AI 点评。',
        followUp: current.followUp || '请结合实际项目说明这个知识点的使用场景和边界。',
        source: 'question-bank',
      },
    })
    setError('')
  }

  const runAI = async (requestMode, record) => {
    if (busy || requestRef.current || (requestMode === 'feedback' && !session.answer.trim())) return
    const previousAnswer = record && session.baselines?.[record.questionId]
    if (requestMode === 'compare' && (!previousAnswer || previousAnswer.skipped || record.skipped)) return
    const controller = new AbortController()
    requestRef.current = controller
    setBusy(true)
    setAiTask({ mode: requestMode, questionId: record?.questionId, provider })
    setError('')
    const timeout = setTimeout(() => controller.abort(), 135000)
    const payload = requestMode === 'compare'
      ? { mode: 'compare', question: record.question, reference: getQuestion(record.questionId).answer.join('\n'), previous: previousAnswer, current: record }
      : requestMode === 'feedback'
      ? { mode: requestMode, question: current.title, answer: session.answer.trim(), reference: current.answer.join('\n'), history: session.history }
      : { mode: requestMode, history: session.history }
    try {
      const response = await fetch('/api/interview/generate', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, provider }) })
      let data
      try { data = await response.json() } catch { throw new Error('AI 服务暂未连接，请稍后重试。你的答案已保留。') }
      if (!response.ok) throw new Error(data.error || '生成失败，请稍后重试。')
      if (data.provider !== provider) throw new Error('服务返回的来源不匹配，请重新检测后重试。')
      if (!alive.current) return
      if (requestMode === 'compare') {
        if (!validComparison(data)) throw new Error('对比结果格式不完整，请重试。')
        setSession(previous => ({ ...previous, history: previous.history.map(item => item.questionId === record.questionId ? { ...item, comparison: data } : item) }))
      } else if (requestMode === 'feedback') setSession(previous => ({ ...previous, stage: 'followup', pending: { answer: payload.answer, feedback: data.feedback, followUp: data.followUp, source: data.provider, provider: data.provider } }))
      else patchSession({ report: data })
    } catch (cause) {
      if (alive.current) setError(providerName(provider) + '：' + (cause.name === 'AbortError' ? '等待超时，答案已保留。请稍后重试或切换服务。' : cause.message))
    } finally {
      clearTimeout(timeout)
      if (alive.current) setBusy(false)
      requestRef.current = null
    }
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportInterview(session, archiveQuestions)], { type: 'text/markdown;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = '模拟面试复盘-' + new Date(session.startedAt).toISOString().slice(0, 10) + '.md'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const openHistory = item => {
    if (item.id === workspaceSession?.id) {
      setWorkspaceSession(item)
      setHistoryPreview(null)
    } else setHistoryPreview(item)
    setShowSetup(false)
    setError('')
    setReviewFilter('all')
  }

  const waiting = busy && <div className="mi-wait" role="status"><LoaderCircle className="mi-spin" size={18} /><div><strong>{aiTask?.mode === 'compare' ? '正在对比两次回答，寻找具体变化' : session.stage === 'review' ? '正在整理你的面试报告' : '正在分析回答，准备下一次追问'}</strong><p>{providerName(aiTask?.provider)} · {waitSeconds < 20 ? '正在生成，请稍候。' : waitSeconds < 60 ? '生成仍在进行，你的回答已保留。' : '本次等待较久，服务最迟约两分钟返回结果。'} · 已等待 {waitSeconds} 秒</p></div></div>
  const errorPanel = error && aiTask?.mode !== 'compare' && <div className="mi-error" role="alert"><strong>这次生成没有完成</strong><p>{error}</p><p>可在上方切换服务后重试，答案会保留。</p><div className="mi-actions"><button onClick={() => runAI(session.stage === 'review' ? 'report' : 'feedback')} disabled={busy}><RotateCcw size={14} /> 使用 {providerName(provider)} 重试</button>{session.stage === 'answer' && <button onClick={useBank} disabled={busy}>用题库追问继续 <ArrowRight size={14} /></button>}</div></div>

  const comparisonFor = item => {
    const selected = aiTask?.mode === 'compare' && aiTask.questionId === item.questionId
    return <AnswerComparison item={item} previous={session.baselines?.[item.questionId]} entry={library[item.questionId]}
      onCompare={() => runAI('compare', item)} onMastery={(mastered, days) => setMastery(item.questionId, mastered, days)}
      busy={busy} providerLabel={providerName(provider)} waiting={selected ? waiting : null} error={selected ? error : ''} />
  }

  return <article className="mi-page">
    <header className={'mi-page-header ' + (!showSetup ? 'is-compact' : '')}>
      <div><span className="mi-eyebrow">INTERVIEW STUDIO / 模拟面试</span><h2>{showSetup ? <>把知识说清楚，<em>从这一轮开始。</em></> : session.stage === 'review' ? '完成一轮，更了解自己的下一步。' : categoryName(session.category) + ' · 模拟面试'}</h2><p>{showSetup ? '从熟悉的知识点出发，在回答、追问与复盘中找到需要补强的地方。' : session.stage === 'review' ? '回看自己的表达，再对照参考思路；把不确定的问题留给下一次练习。' : '先说原理，再举例子，最后说明边界与取舍。'}</p></div>
      <div className="mi-header-note">本机 AI · {providerName(provider)}</div>
    </header>
    <InterviewServiceSelector provider={provider} statuses={status} checking={checking} busy={busy} onChange={changeProvider} onRefresh={refreshStatus} />
    {storageError && <p className="mi-error" role="alert">浏览器无法保存练习记录，刷新可能丢失本轮内容。完成后请先导出复盘。</p>}

    {showSetup ? <>
      <a className="daily-entry" href="#/daily"><div><strong>今天先练一个小知识点</strong><p>每日一练 · 3 道递进题，从预测到动手验证</p></div><ArrowRight size={18} /></a>
      {session && <div className="mi-resume"><Save size={20} /><div><strong>{session.stage === 'review' ? '上一轮复盘已保存' : '接着上次的思路，继续练习'}</strong><p>{categoryName(session.category)} · {session.history.length} / {total} 题 · {session.stage === 'review' ? '已完成' : '草稿已保存'}</p></div><button className="mi-primary" onClick={() => { setShowSetup(false); setInspectIndex(null); setError('') }}>{session.stage === 'review' ? '查看复盘' : '继续练习'} <ArrowRight size={16} /></button></div>}
      <ReviewDashboard library={library} bank={archiveQuestions} count={count} mode={mode} onStart={() => start('weak')} onMastery={setMastery} />
      <div className="mi-setup-layout"><section className="mi-card">
        <div className="mi-section-heading"><span>01</span><div><h3>今天想练什么？</h3><p>选一个方向深入，或来一轮综合面试。</p></div></div>
        <div className="mi-categories">{[{ id: 'all', short: '综合面试' }, ...archiveCategories].map(item => <button key={item.id} aria-pressed={category === item.id} className={category === item.id ? 'is-selected' : ''} onClick={() => setCategory(item.id)}><span>{item.short}</span><small>{item.id === 'all' ? archiveQuestions.length : archiveQuestions.filter(question => question.category === item.id).length} 道题</small>{category === item.id && <Check size={14} />}</button>)}</div>
        <div className="mi-section-heading"><span>02</span><div><h3>选择练习方式</h3><p>每道主问题后，都有一次深入追问。</p></div></div>
        <div className="mi-modes">
          <button className={mode === 'ai' ? 'is-selected' : ''} aria-pressed={mode === 'ai'} onClick={() => setMode('ai')}><Sparkles size={21} /><div><strong>AI 模拟面试</strong><p>针对你的回答点评、追问，最后生成复盘报告。</p></div></button>
          <button className={mode === 'practice' ? 'is-selected' : ''} aria-pressed={mode === 'practice'} onClick={() => setMode('practice')}><BookOpen size={21} /><div><strong>题库自练</strong><p>按自己的节奏思考，完成后对照参考答案。</p></div></button>
        </div>
      </section><aside className="mi-plan mi-card">
        <span className="mi-eyebrow">YOUR SESSION</span><h3>这一轮练习</h3><div className="mi-plan-title">{categoryName(category)}</div>
        <label className="mi-label">题目数量</label><div className="mi-counts">{[3, 5, 10].map(value => <button key={value} aria-pressed={count === value} className={count === value ? 'is-selected' : ''} onClick={() => setCount(value)}>{value} <small>题</small></button>)}</div>
        <p className="mi-plan-estimate"><Clock3 size={14} /> 建议预留 {count * 3}–{count * 5} 分钟</p>
        {poolSize < count && <p className="mi-note">该方向有 {poolSize} 道题，将补充 {count - poolSize} 道其他方向题目。</p>}
        <ol className="mi-steps"><li><span>1</span>独立回答，组织思路</li><li><span>2</span>接受追问，补充细节</li><li><span>3</span>回看记录，标记薄弱点</li></ol>
        <button className="mi-primary mi-wide" onClick={start}>开始{count}题练习 <ArrowRight size={16} /></button>
        {mode === 'ai' && status && !status[provider]?.ready && <p className="mi-note">{status[provider]?.message}</p>}
        <p className="mi-save-note"><Save size={12} /> 答案自动保存，可随时回来继续</p>
      </aside></div>
      {recent.length > 0 && <section className="mi-recent"><div className="mi-section-title"><h3>最近的练习</h3><span>此浏览器保留最近 5 轮</span></div><div className="mi-recent-grid">{recent.map(item => <button key={item.id} onClick={() => openHistory(item)}><span className="mi-eyebrow">{dateLabel(item.startedAt)}</span><strong>{categoryName(item.category)}</strong><p>{item.questionIds.length} 题 · {formatDuration(item.elapsedSeconds)} · {item.markedIds.length} 道待复习</p><span>查看复盘 <ArrowRight size={14} /></span></button>)}</div></section>}
    </> : session.stage === 'review' ? <>
      <div className="mi-toolbar"><button onClick={() => { setHistoryPreview(null); setShowSetup(true); setError('') }} disabled={busy}><ArrowLeft size={14} /> 返回练习首页</button><button onClick={download}><Download size={14} /> 导出复盘</button></div>
      <div className="mi-metrics">{[['已作答', answered, '题'], ['已跳过', skipped, '题'], ['待复习', markedCount, '题'], ['练习用时', formatDuration(session.elapsedSeconds), '']].map(([label, value, unit]) => <div key={label}><span>{label}</span><strong>{value}<small>{unit}</small></strong></div>)}</div>
      <section className="mi-card mi-report">
        <div className="mi-section-title"><div><span className="mi-eyebrow">REFLECTION / 本轮复盘</span><h3>{session.report ? '从这次回答出发，继续进步。' : '把这轮练习，变成下一步行动。'}</h3></div><Sparkles size={25} /></div>
        {session.report ? <><p className="mi-note">生成来源：{resultProviderName(session.report)}</p><p className="mi-report-summary">{session.report.summary}</p><div className="mi-report-columns">{[['strengths', '表现较好'], ['improvements', '需要补强'], ['nextSteps', '下一步练习']].map(([key, label]) => <div key={key}><h4>{label}</h4><ul>{session.report[key].map((item, index) => <li key={index}>{item}</li>)}</ul></div>)}</div></> : <><p>逐题查看自己的回答和参考思路。也可以让 AI 结合本轮记录，整理优势、遗漏点和练习建议。</p><button className="mi-primary" onClick={() => runAI('report')} disabled={busy || answered === 0}><Sparkles size={16} /> {busy && aiTask?.mode === 'report' ? '正在生成复盘…' : `用 ${providerName(provider)} 生成复盘报告`}</button>{answered === 0 && <p className="mi-note">本轮全部跳过，先对照下方参考答案复习，再开始下一轮。</p>}</>}
        {aiTask?.mode !== 'compare' && waiting}{errorPanel}
      </section>
      <div className="mi-section-title mi-review-title"><h3>逐题复盘 <small>{total} 题</small></h3><div className="mi-filter">{[['all', '全部'], ['marked', '待复习'], ['skipped', '已跳过']].map(([value, label]) => <button key={value} aria-pressed={reviewFilter === value} className={reviewFilter === value ? 'is-selected' : ''} onClick={() => setReviewFilter(value)}>{label}</button>)}</div></div>
      {session.history.filter(item => reviewFilter === 'all' || (reviewFilter === 'marked' ? session.markedIds.includes(item.questionId) : item.skipped)).map(item => <AnswerRecord key={item.questionId} item={item} number={session.questionIds.indexOf(item.questionId) + 1} marked={session.markedIds.includes(item.questionId)} onMark={() => markQuestion(item.questionId)} comparison={comparisonFor(item)} />)}
      {((reviewFilter === 'marked' && !markedCount) || (reviewFilter === 'skipped' && !skipped)) && <div className="mi-empty"><CheckCircle2 size={25} /><p>{reviewFilter === 'marked' ? '还没有标记待复习的问题，点击题目旁的书签即可标记。' : '本轮没有跳过的问题。'}</p></div>}
    </> : <div className="mi-workspace">
      <aside className="mi-sidebar mi-card">
        <div className="mi-section-title"><span className="mi-eyebrow">本轮进度</span><span>{session.history.length} / {total}</span></div>
        <progress max={total} value={session.history.length} aria-label="已完成题目" />
        <div className="mi-question-nav">{session.questionIds.map((id, index) => <button key={id} disabled={index > session.index || busy} className={(index === (inspectIndex ?? session.index) ? 'is-current ' : '') + (session.history[index]?.skipped ? 'is-skipped' : session.history[index] ? 'is-done' : '')} onClick={() => setInspectIndex(index === session.index ? null : index)} aria-label={'第 ' + (index + 1) + ' 题' + (session.history[index]?.skipped ? '，已跳过' : session.history[index] ? '，已完成' : '，未完成')} aria-current={index === (inspectIndex ?? session.index) ? 'step' : undefined}>{index + 1}{session.markedIds.includes(id) && <i />}</button>)}</div>
        <div className="mi-nav-legend"><span>已完成</span><span>已跳过</span><span>待复习 ·</span></div>
        <div className="mi-clock"><Clock3 size={16} /><span>练习用时</span><strong>{formatDuration(session.elapsedSeconds)}</strong></div>
        <div className="mi-sidebar-tip"><MessageSquare size={17} /><strong>把思考过程说出来</strong><p>定义 → 原理 → 示例 → 边界。遇到不熟悉的问题，可以标记后继续。</p></div>
        <button className="mi-secondary mi-wide" disabled={busy} onClick={() => { setShowSetup(true); setError('') }}><Save size={14} /> 保存并返回</button>
        <p className="mi-save-note">{storageError ? '暂时无法自动保存' : '草稿自动保存在此浏览器'}</p>
      </aside>
      <div className="mi-main">
        {inspectIndex !== null ? <><div className="mi-toolbar"><span>回看已完成的问题</span><button disabled={busy} onClick={() => setInspectIndex(null)}>继续当前题 <ArrowRight size={14} /></button></div><AnswerRecord item={session.history[inspectIndex]} number={inspectIndex + 1} marked={session.markedIds.includes(session.questionIds[inspectIndex])} onMark={() => markQuestion(session.questionIds[inspectIndex])} comparison={comparisonFor(session.history[inspectIndex])} /></> : <section className="mi-card mi-answer-card">
          <div className="mi-question-meta"><div><span className="mi-tag">{categoryName(current.category)}</span><span>{String(session.index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {session.stage === 'followup' ? '深入追问' : '独立作答'}</span></div><button className={'mi-bookmark ' + (session.markedIds.includes(current.id) ? 'is-marked' : '')} aria-pressed={session.markedIds.includes(current.id)} onClick={() => markQuestion(current.id)}><Bookmark size={15} fill={session.markedIds.includes(current.id) ? 'currentColor' : 'none'} />{session.markedIds.includes(current.id) ? '已标记待复习' : '标记待复习'}</button></div>
          <div className="mi-phase-label"><span className={session.stage === 'answer' ? 'is-active' : ''}>1. 回答问题</span><span /><span className={session.stage === 'followup' ? 'is-active' : ''}>2. 深入追问</span></div>
          {session.baselines?.[current.id] ? <p className="mi-repeat-note"><RotateCcw size={14} /> 同题重答 · 上次回答已隐藏，完成本题后可对比。</p> : session.practiceKind === 'weak' && <p className="mi-repeat-note">{library[current.id] ? '薄弱题重练 · 先独立组织一次完整回答。' : '拓展题 · 补充练习，拓宽知识覆盖。'}</p>}
          <h3 className="mi-question-title" tabIndex={-1} ref={headingRef}>{session.stage === 'answer' ? current.title : session.pending.followUp}</h3>
          {session.stage === 'followup' ? <><details className="mi-original"><summary>回看原题与我的回答</summary><strong>{current.title}</strong><p>{session.answer}</p></details><div className="mi-feedback"><span><Sparkles size={14} /> {feedbackLabel(session.pending)}</span><p>{session.pending.feedback}</p></div></> : <p className="mi-answer-hint">先独立作答，完成后再对照参考思路。可以用文字或代码描述。</p>}
          <label className="mi-editor-label" htmlFor="mi-answer">{session.stage === 'answer' ? '你的回答' : '补充你的分析'}<span>{(session.stage === 'answer' ? session.answer : session.followUpAnswer).length} / 4000</span></label>
          <textarea id="mi-answer" value={session.stage === 'answer' ? session.answer : session.followUpAnswer} disabled={busy} maxLength={4000} onChange={event => patchSession(session.stage === 'answer' ? { answer: event.target.value } : { followUpAnswer: event.target.value })} placeholder={session.stage === 'answer' ? '我对这个问题的理解是…\n\n可以结合一个实际场景或一段代码展开。' : '针对这个追问，我会进一步考虑…'} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); if (busy) return; if (session.stage === 'followup') finish(); else if (session.mode === 'practice') useBank(); else runAI('feedback') } }} />
          <div className="mi-editor-footer"><span><Save size={12} /> {storageError ? '保存不可用' : '自动保存'} <i>·</i> Ctrl / ⌘ + Enter 提交</span><span>{session.stage === 'followup' ? '留空则记录为未回答追问' : '不确定也可以先说思路'}</span></div>
          {waiting}{errorPanel}
          <div className="mi-answer-actions">{session.stage === 'answer' ? <><button className="mi-text-button" disabled={busy} onClick={() => finish(true)}><SkipForward size={15} /> 跳过本题</button><button className="mi-primary" disabled={busy || !session.answer.trim()} onClick={() => session.mode === 'practice' ? useBank() : runAI('feedback')}>{busy ? <LoaderCircle size={16} className="mi-spin" /> : <ArrowRight size={16} />}{busy ? '正在生成追问…' : session.mode === 'practice' ? '提交，进入题库追问' : '提交，获取 AI 追问'}</button></> : <><span className="mi-answer-hint">完成后，本题会进入复盘记录。</span><button className="mi-primary" onClick={() => finish()}>{session.index + 1 === total ? '完成本轮，查看复盘' : '完成本题，继续下一题'}<ArrowRight size={16} /></button></>}</div>
        </section>}
      </div>
    </div>}
    <footer className="mi-footer"><span>练习记录保存在当前浏览器，不跨设备同步。</span><span>使用 AI 点评、对比或复盘时，会发送相应题目和回答。</span></footer>
  </article>
}

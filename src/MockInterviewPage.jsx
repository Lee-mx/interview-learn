import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react'
import { archiveCategories, archiveQuestions } from './archiveQuestions.js'
import './mockInterview.css'

const DEFAULT_CATEGORY = 'javascript'

async function askCodex(payload) {
  const response = await fetch('/api/interview/codex', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  let data
  try { data = await response.json() } catch { throw new Error('本地 Codex 服务未启动。请使用 npm run dev 打开页面。') }
  if (!response.ok) throw new Error(data.error || 'Codex 暂时无法回答，请重试。')
  return data
}

function chooseQuestions(category, count) {
  const pool = archiveQuestions.filter(question => category === 'all' || question.category === category)
  const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, count)
  if (selected.length < count) {
    const others = archiveQuestions.filter(question => question.category !== category)
    selected.push(...others.sort(() => Math.random() - 0.5).slice(0, count - selected.length))
  }
  return selected
}

function ReportList({ title, items }) {
  return <div className="mock-report-list"><strong>{title}</strong><ul>{items.length ? items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>) : <li>暂无内容</li>}</ul></div>
}

export default function MockInterviewPage() {
  const [category, setCategory] = useState(DEFAULT_CATEGORY)
  const [count, setCount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('setup')
  const [answer, setAnswer] = useState('')
  const [followUpAnswer, setFollowUpAnswer] = useState('')
  const [pending, setPending] = useState(null)
  const [history, setHistory] = useState([])
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/interview/status', { signal: controller.signal })
      .then(response => response.json())
      .then(setStatus)
      .catch(error => { if (error.name !== 'AbortError') setStatus({ ready: false, message: '本地 Codex 服务未连接。请通过 npm run dev 启动。' }) })
    return () => controller.abort()
  }, [])

  const current = questions[index]
  const total = questions.length

  const start = () => {
    const selected = chooseQuestions(category, count)
    if (!selected.length) return
    setQuestions(selected)
    setIndex(0)
    setPhase('answer')
    setAnswer('')
    setFollowUpAnswer('')
    setPending(null)
    setHistory([])
    setReport(null)
    setError('')
  }

  const restart = () => {
    setPhase('setup')
    setQuestions([])
    setHistory([])
    setReport(null)
    setPending(null)
    setAnswer('')
    setFollowUpAnswer('')
    setError('')
  }

  const getFeedback = async () => {
    if (!answer.trim() || busy) return
    setBusy(true)
    setError('')
    try {
      const result = await askCodex({
        mode: 'feedback',
        question: current.title,
        answer: answer.trim(),
        reference: Array.isArray(current.answer) ? current.answer.join('\n') : String(current.answer || ''),
        history,
      })
      setPending({ question: current.title, answer: answer.trim(), feedback: result.feedback, followUp: result.followUp, source: 'codex' })
      setPhase('followup')
    } catch (cause) {
      setError(cause.message)
    } finally {
      setBusy(false)
    }
  }

  const useQuestionBankFollowUp = () => {
    setPending({
      question: current.title,
      answer: answer.trim(),
      feedback: '本题未获得 Codex 点评，以下追问来自题库。',
      followUp: current.followUp || '这道题在实际项目中有哪些容易忽略的边界情况？',
      source: 'question-bank',
    })
    setError('')
    setPhase('followup')
  }

  const next = () => {
    const completed = [...history, { ...pending, followUpAnswer: followUpAnswer.trim() }]
    setHistory(completed)
    setAnswer('')
    setFollowUpAnswer('')
    setPending(null)
    setError('')
    if (index + 1 < total) {
      setIndex(index + 1)
      setPhase('answer')
    } else {
      setPhase('review')
    }
  }

  const generateReport = async () => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      setReport(await askCodex({ mode: 'report', history }))
      setPhase('report')
    } catch (cause) {
      setError(cause.message)
    } finally {
      setBusy(false)
    }
  }

  return <article className="mock-page">
    <div className="mock-breadcrumb"><span>春日代码簿</span><ArrowRight size={13} /><strong>模拟面试</strong></div>
    <div className="mock-hero"><div><span className="section-kicker"><span /> LOCAL INTERVIEW LAB</span><h2>先说出你的思路，<br /><em>再让追问走深一步。</em></h2><p>从本站面试题归档抽题。你负责回答，本机终端 Codex 负责点评、追问和总结；仅供本地内测。</p></div><div className="mock-hero-icon" aria-hidden="true">Q<span>↗</span></div></div>
    <div className={`mock-status ${status?.ready ? 'is-ready' : ''}`} role="status"><span className="mock-status-dot" /><span>{status?.message || '正在检查本机 Codex 登录状态…'}</span><small>终端 Codex · 本地调用</small></div>

    {phase === 'setup' && <section className="mock-card mock-setup"><div className="mock-card-heading"><span>01 / 准备</span><h3>选择这次要练的方向</h3><p>题目来自现有归档；每题都有一次回答和一次追问。若所选方向不足 10 题，会从其他方向补齐。</p></div><div className="mock-category-grid"><button className={category === 'all' ? 'is-selected' : ''} aria-pressed={category === 'all'} onClick={() => setCategory('all')}>全部方向<small>{archiveQuestions.length} 题</small></button>{archiveCategories.map(item => <button key={item.id} className={category === item.id ? 'is-selected' : ''} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.short}<small>{archiveQuestions.filter(question => question.category === item.id).length} 题</small></button>)}</div><div className="mock-setup-footer"><label>本次数量 <select value={count} onChange={event => setCount(Number(event.target.value))}><option value={10}>10 题 · 标准模拟</option><option value={5}>5 题 · 精简练习</option><option value={3}>3 题 · 快速练习</option></select></label><button className="mock-primary" onClick={start}>开始模拟面试 <ArrowRight size={16} /></button></div></section>}

    {phase !== 'setup' && <><div className="mock-progress"><span>进度 {Math.min(index + 1, total)} / {total}</span><div>{questions.map((item, itemIndex) => <i key={item.id} className={itemIndex <= index ? 'is-active' : ''} />)}</div><button onClick={restart} disabled={busy}><RotateCcw size={14} /> 重新开始</button></div>

      {phase === 'answer' && <section className="mock-card mock-question"><div className="mock-card-heading"><span>问题 {index + 1} / {total} · {archiveCategories.find(item => item.id === current.category)?.short}</span><h3>{current.title}</h3><p>请先独立作答，提交后再看点评与追问。</p></div><label className="mock-answer-label" htmlFor="mock-answer">你的回答</label><textarea id="mock-answer" value={answer} onChange={event => setAnswer(event.target.value)} maxLength={4000} placeholder="像真实面试一样，先解释核心原理，再结合场景说说取舍…" /><div className="mock-input-footer"><span>{answer.length} / 4000 字</span><button className="mock-primary" onClick={getFeedback} disabled={!answer.trim() || busy}>{busy ? 'Codex 正在思考…' : '提交回答，获取追问'} <Sparkles size={16} /></button></div>{error && <div className="mock-error" role="alert"><p>{error}</p><button onClick={useQuestionBankFollowUp}>暂用题库追问继续</button></div>}</section>}

      {phase === 'followup' && <section className="mock-card mock-question"><div className="mock-card-heading"><span>追问 {index + 1} / {total} · {pending.source === 'codex' ? 'CODEX AI' : '题库预设'}</span><h3>{pending.followUp}</h3></div><div className="mock-feedback"><Sparkles size={16} /><p>{pending.feedback}</p></div><label className="mock-answer-label" htmlFor="mock-followup-answer">继续回答追问</label><textarea id="mock-followup-answer" value={followUpAnswer} onChange={event => setFollowUpAnswer(event.target.value)} maxLength={4000} placeholder="补充你的分析，也可以先想清楚再作答…" /><div className="mock-input-footer"><span>可以留空，记录为未回答</span><button className="mock-primary" onClick={next}>{index + 1 < total ? '进入下一题' : '完成答题'} <ArrowRight size={16} /></button></div></section>}

      {phase === 'review' && <section className="mock-card mock-review"><CheckCircle2 size={32} /><h3>这轮面试答完了</h3><p>已记录 {history.length} 道题的回答。生成报告会再次调用本机 Codex；若暂时未登录，你仍可查看下方作答记录。</p><button className="mock-primary" onClick={generateReport} disabled={busy}>{busy ? '正在整理面试报告…' : '生成 Codex 面试报告'} <Sparkles size={16} /></button>{error && <p className="mock-error" role="alert">{error}</p>}</section>}

      {phase === 'report' && <section className="mock-card mock-report"><div className="mock-card-heading"><span>FINAL NOTES · CODEX AI</span><h3>这次面试，已经有了自己的答案。</h3></div><p className="mock-report-summary">{report.summary}</p><div className="mock-report-grid"><ReportList title="表现较好的地方" items={report.strengths} /><ReportList title="值得补强的地方" items={report.improvements} /><ReportList title="下一步怎么练" items={report.nextSteps} /></div></section>}

      {(phase === 'review' || phase === 'report') && <section className="mock-history"><h3><BookOpen size={18} /> 本轮作答记录</h3>{history.map((item, itemIndex) => <details key={`${itemIndex}-${item.question}`}><summary><span>{String(itemIndex + 1).padStart(2, '0')}</span>{item.question}</summary><div><strong>你的回答</strong><p>{item.answer}</p><strong>{item.source === 'codex' ? 'Codex 点评' : '题库追问说明'}</strong><p>{item.feedback}</p><strong>追问 · {item.followUp}</strong><p>{item.followUpAnswer || '未回答'}</p></div></details>)}</section>}
    </>}
    <p className="mock-footnote"><ArrowLeft size={13} /> 内测提示：Codex 是在线模型服务，本页只是通过你电脑上的 CLI 调用；题目和回答会发送给所使用的模型服务。</p>
  </article>
}

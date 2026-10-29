import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Check, CheckCircle2, Clock3, Lightbulb, Play, Sprout } from 'lucide-react'
import { dailyLessons, lessonById, taskQuestions } from './dailyPracticeData.js'
import { DAILY_KEY, advanceDaily, canAdvance, dayKey, outcome, outcomeLabel, pickLesson, restoreDaily, startDaily, submitDaily } from './dailyPracticeState.js'
import './dailyPractice.css'

const phases = ['预测结果', '解释原理', '变式检验']
const reactCode = mode => `const [count, setCount] = useState(0)\n\nfunction handleClick() {\n${Array(3).fill(mode === 'snapshot' ? '  setCount(count + 1)' : '  setCount(n => n + 1)').join('\n')}\n}\n\nreturn <button onClick={handleClick}>{count}</button>`

function ReactExperiment({ mode, onResult }) {
  const [count, setCount] = useState(0)
  const [clicked, setClicked] = useState(false)
  const reported = useRef(false)
  useEffect(() => { if (clicked && !reported.current) { reported.current = true; onResult([String(count)]) } }, [clicked, count, onResult])
  return <button className="dp-primary" disabled={clicked} onClick={() => {
    if (mode === 'snapshot') { setCount(count + 1); setCount(count + 1); setCount(count + 1) }
    else { setCount(n => n + 1); setCount(n => n + 1); setCount(n => n + 1) }
    setClicked(true)
  }}><Play size={15} />点击一次运行 · count = {count}</button>
}

export default function DailyPracticePage() {
  const [state, setState] = useState(() => { try { return restoreDaily(localStorage.getItem(DAILY_KEY)) } catch { return restoreDaily(null) } })
  const [storageError, setStorageError] = useState(false)
  const [today, setToday] = useState(dayKey())
  const [running, setRunning] = useState(false)
  const [demoError, setDemoError] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const heading = useRef(null)
  const runId = useRef(0)
  useEffect(() => {
    const refresh = () => setToday(dayKey())
    window.addEventListener('focus', refresh)
    const timer = setInterval(refresh, 30000)
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); runId.current++ }
  }, [])
  useLayoutEffect(() => { try { localStorage.setItem(DAILY_KEY, JSON.stringify(state)); setStorageError(false) } catch { setStorageError(true) } }, [state])
  const task = state.active
  const completed = state.history.find(item => item.completedDay === today)
  const lesson = lessonById(task?.lessonId || completed?.lessonId) || pickLesson(state.entries, today)
  const question = task ? taskQuestions(task)[task.index] : null
  const answer = task?.answers[task.index]
  useEffect(() => {
    setDemoError('')
    heading.current?.focus({ preventScroll: true })
    const target = heading.current || document.querySelector('.dp-summary')
    target?.scrollIntoView({ block: 'start' })
  }, [task?.lessonId, task?.index])
  const patchAnswer = value => setState(old => old.active ? { ...old, active: { ...old.active, answers: old.active.answers.map((item, index) => index === old.active.index ? { ...item, ...value } : item) } } : old)
  const runDemo = async () => {
    if (running) return
    const id = ++runId.current
    const output = []
    setRunning(true)
    setDemoError('')
    try {
      await question.demo(value => output.push(String(value)))
      if (id === runId.current) patchAnswer({ ran: true, output })
    } catch { if (id === runId.current) setDemoError('运行未完成，请再试一次。') }
    finally { if (id === runId.current) setRunning(false) }
  }
  const due = dailyLessons.filter(item => state.entries[item.id]?.due <= today)
  const doneCount = Object.keys(state.entries).length

  return <section className="dp-page">
    <header className="dp-header"><div><span className="dp-eyebrow">DAILY PRACTICE / 每日一练</span><h1>每天一小步，<br /><em>把懂了变成会了。</em></h1><p>先想一遍，再亲手验证。今天只专注一个知识点。</p></div><div className="dp-date"><Sprout size={25} /><strong>{today.replaceAll('-', ' / ')}</strong><span>10–15 分钟 · 3 道递进题</span></div></header>
    {storageError && <p className="dp-error" role="alert">浏览器无法保存记录。请先复制自己的回答，避免刷新后丢失。</p>}
    <div className="dp-layout"><div>
      {!task && !completed && <section className="dp-card dp-mission"><span className="dp-eyebrow">TODAY’S FOCUS / 今日任务</span><span className="dp-chip">{state.entries[lesson.id] ? '回忆练习' : '新主题'}</span><h2>{lesson.title}</h2><p>{lesson.goal}</p><ol className="dp-path">{phases.map((phase, index) => <li key={phase}><span>0{index + 1}</span><strong>{phase}</strong><small>{['独立判断，写下理由', '抓住决定结果的规则', '换一个条件，再验证'][index]}</small></li>)}</ol><button className="dp-primary" onClick={() => { setReviewing(false); setState(old => startDaily(old, dayKey())) }}>开始今天的 3 道题 <ArrowRight size={16} /></button><p className="dp-muted">答案在提交后展开。需要帮助时，可以逐级查看提示；进度会自动保存。</p></section>}

      {task && <section className="dp-card dp-exercise">
        <div className="dp-progress" aria-label="练习进度">{phases.map((phase, index) => <span key={phase} className={task.index === index ? 'is-current' : index < task.index ? 'is-done' : ''}>{index < task.index ? <Check size={13} /> : `0${index + 1}`} {phase}</span>)}</div>
        <div className="dp-task-heading"><span className="dp-eyebrow">{lesson.tag} · {task.round > 0 ? '先回忆，再核对' : '独立作答'}</span><span>{task.index + 1} / 3</span></div>
        {task.day !== today && <p className="dp-muted">继续 {task.day} 保存的练习，完成后计入今天。</p>}
        <h2 ref={heading} tabIndex={-1}>{question.title}</h2>
        {(question.demo || question.reactMode) && <><p className="dp-muted">{question.demo ? 'log 用于记录输出。下面展示的函数会在验证时真实执行。' : '在 React 组件中执行下面的事件处理函数。'}</p><pre className="dp-code"><code>{question.demo ? question.demo.toString() : reactCode(question.reactMode)}</code></pre></>}
        <fieldset className="dp-options" disabled={answer.submitted}><legend>先选一个判断</legend>{question.options.map((option, index) => <label key={option} className={answer.choice === index ? 'is-selected' : ''}><input type="radio" name="daily-answer" checked={answer.choice === index} onChange={() => patchAnswer({ choice: index })} /><span>{String.fromCharCode(65 + index)}</span>{option}</label>)}</fieldset>
        <label className="dp-label" htmlFor="daily-reason">为什么这样判断？<span>{answer.reason.length} / 2000</span></label><textarea id="daily-reason" maxLength={2000} disabled={answer.submitted} value={answer.reason} onChange={event => patchAnswer({ reason: event.target.value })} placeholder="用自己的话说明关键原因，至少 8 个字…" />
        <fieldset className="dp-confidence" disabled={answer.submitted}><legend>你有多确定？</legend>{[['sure', '有把握'], ['unsure', '还不确定']].map(([value, label]) => <label key={value}><input type="radio" name="daily-confidence" checked={answer.confidence === value} onChange={() => patchAnswer({ confidence: value })} />{label}</label>)}</fieldset>
        {!answer.submitted && <div className="dp-hints"><button disabled={answer.hints === 3} onClick={() => patchAnswer({ hints: answer.hints + 1 })}><Lightbulb size={15} />{['给我一个方向', '再给一个提示', '我需要完整讲解', '已查看完整讲解'][answer.hints]}</button><small>帮助 {answer.hints} / 3 · 查看帮助会如实记录</small>{question.hints.slice(0, Math.min(answer.hints, 2)).map((hint, index) => <p key={hint}><b>提示 {index + 1}</b>{hint}</p>)}{answer.hints === 3 && <p><b>完整讲解 · 答案 {String.fromCharCode(65 + question.correct)}</b>{question.explanation}</p>}</div>}
        {!answer.submitted ? <button className="dp-primary" disabled={answer.choice === null || answer.reason.trim().length < 8 || !answer.confidence} onClick={() => setState(submitDaily)}>提交判断，查看差距 <ArrowRight size={16} /></button> : <div className="dp-feedback">
          <div className={'dp-verdict ' + (answer.correct ? 'is-correct' : '')}><CheckCircle2 size={20} /><div><strong>{answer.correct ? '选项判断正确，再检查你的理由。' : '发现一个值得补上的差距。'}</strong><p>正确选项：{String.fromCharCode(65 + question.correct)} · {question.options[question.correct]}</p></div></div>
          <p className="dp-explanation">{question.explanation}</p>
          {(question.demo || question.reactMode) && <div className="dp-demo"><strong>亲手验证一次</strong>{answer.ran ? <output aria-label="实际运行结果">{answer.output.join(' → ')}</output> : question.reactMode ? <ReactExperiment key={question.id} mode={question.reactMode} onResult={output => patchAnswer({ ran: true, output })} /> : <button className="dp-primary" disabled={running} onClick={runDemo}><Play size={15} />{running ? '正在运行…' : '运行代码，验证判断'}</button>}<small>{answer.ran ? '这是本次真实执行的结果。' : '完成一次运行后，再进入下一题。'}</small>{demoError && <p role="alert">{demoError}</p>}</div>}
          <label className="dp-label" htmlFor="daily-reflection">现在重新解释一次：什么规则决定了结果？</label><textarea id="daily-reflection" value={answer.reflection} maxLength={2000} onChange={event => patchAnswer({ reflection: event.target.value })} placeholder="补上刚才遗漏的原因，或用一句话重新讲清楚，至少 8 个字…" />
          <fieldset className="dp-confidence"><legend>对照讲解后，你能自己讲清楚吗？</legend>{[[true, '可以独立解释'], [false, '还需要再练']].map(([value, label]) => <label key={String(value)}><input type="radio" name="daily-clear" checked={answer.clear === value} onChange={() => patchAnswer({ clear: value })} />{label}</label>)}</fieldset>
          <p className="dp-muted">文字说明由你对照参考自查，系统只核对选项与练习过程，不把选对一次等同于掌握。</p>
          <button className="dp-primary" disabled={!canAdvance(task)} onClick={() => setState(old => advanceDaily(old, dayKey()))}>{task.index === 2 ? '完成练习，安排复习' : '继续下一题'} <ArrowRight size={16} /></button>
        </div>}
      </section>}

      {!task && completed && <section className="dp-card dp-summary"><span className="dp-eyebrow">TODAY, YOU MADE PROGRESS</span><CheckCircle2 className="dp-summary-icon" size={42} /><h2>今天，给理解留下了一点痕迹。</h2><p>{lesson.title} · 3 道题已完成</p><div className="dp-result-grid">{['independent', 'assisted', 'retry'].map(value => <div key={value}><strong>{completed.answers.filter(item => outcome(item) === value).length}</strong><span>{outcomeLabel(value)}</span></div>)}</div><div className="dp-next"><Clock3 size={22} /><div><strong>下次回忆：{completed.due}</strong><p>{completed.due === today ? '今天可以再回忆。' : '回来时先独立作答，再看今天的思路。复习会优先于新主题。'}</p></div></div><button className="dp-secondary" onClick={() => setReviewing(value => !value)}>{reviewing ? '收起本次记录' : '回看本次回答与修正'}</button>{reviewing && taskQuestions(completed).map((item, index) => <details className="dp-record" key={item.id}><summary>{index + 1}. {item.title} · {outcomeLabel(outcome(completed.answers[index]))}</summary><h4>原来的解释</h4><p>{completed.answers[index].reason}</p><h4>重新整理后的解释</h4><p>{completed.answers[index].reflection}</p><h4>参考规则</h4><p>{item.explanation}</p></details>)}<div className="dp-summary-links"><a href="#/interview">去模拟面试中试试 <ArrowRight size={14} /></a><a href={'#/archive/' + lesson.archive}>继续查阅相关题库 <BookOpen size={14} /></a></div></section>}
    </div><aside className="dp-aside"><section className="dp-card"><span className="dp-eyebrow">YOUR LEARNING PATH</span><h3>小步练习，逐步深入。</h3><p>已练习 {doneCount} / {dailyLessons.length} 个主题 · {due.length} 个主题到期</p><div className="dp-topics">{dailyLessons.map(item => <div key={item.id} className={item.id === lesson.id ? 'is-current' : ''}><span>{state.entries[item.id] ? <Check size={15} /> : <Sprout size={15} />}</span><div><strong>{item.title}</strong><small>{state.entries[item.id] ? `下次复习 ${state.entries[item.id].due}` : '等待第一次练习'}</small></div></div>)}</div></section><section className="dp-card dp-note"><Lightbulb size={23} /><h3>不是看过，是说得出来。</h3><p>先留下自己的判断，才知道该补哪里。提示后答对也有价值，明天再验证能否独立完成。</p><a href={lesson.reference.url} target="_blank" rel="noreferrer">核对资料：{lesson.reference.label} ↗</a></section><p className="dp-local-note">进度保存在当前浏览器。首次练习安排次日复习；后续独立完成可间隔 3 / 7 天。这是可调整的练习安排，不是掌握度评分。</p></aside></div>
  </section>
}

import { useState } from 'react'
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react'
import { reviewQueue } from './interviewReview.js'
import { resultProviderName } from './interviewProviders.js'

const dateLabel = value => new Date(value).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })

export function ReviewDashboard({ library, bank, count, mode, onStart, onMastery }) {
  const [filter, setFilter] = useState('learning')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)
  const now = Date.now()
  const queue = reviewQueue(library)
  const mastered = Object.values(library).filter(item => item.status === 'mastered')
  const due = queue.filter(item => item.dueAt <= now)
  const byId = new Map(bank.map(item => [item.id, item]))
  const matching = (filter === 'learning' ? queue : mastered)
    .filter(item => byId.get(item.questionId)?.title.toLowerCase().includes(search.trim().toLowerCase()))
  const weakCount = Math.min(queue.length, count)

  return <section className="mi-review-home mi-card" aria-labelledby="mi-review-heading">
    <div className="mi-review-intro">
      <div><span className="mi-eyebrow">DAILY REVIEW / 今日复习</span><h3 id="mi-review-heading">把上次的不确定，练成这次的把握。</h3><p>跳过和标记的问题会收进薄弱题库。先独立重答，再对照上次的思路。</p></div>
      <BookOpen size={28} aria-hidden="true" />
    </div>
    <div className="mi-review-overview">
      <div className="mi-review-stats"><div><strong>{due.length}</strong><span>到期可复习</span></div><div><strong>{queue.length}</strong><span>待掌握</span></div><div><strong>{mastered.length}</strong><span>已确认掌握</span></div></div>
      <div className="mi-review-start"><button className="mi-primary" onClick={onStart} disabled={!queue.length}>练我的薄弱点 · {count} 题 <ArrowRight size={15} /></button>
        <p>{queue.length ? `${weakCount} 道薄弱题${weakCount < count ? ` + ${count - weakCount} 道拓展题` : ''} · ${mode === 'ai' ? 'AI 面试' : '题库自练'}` : '完成练习并跳题或标记后，这里会出现你的复习计划。'}</p>
      </div>
    </div>
    {queue.length > 0 && <p className="mi-review-policy">优先练到期题，再练其他薄弱题；重答后默认 3 天后复习，由你确认是否掌握。题量和练习方式沿用下方设置。</p>}
    {(queue.length + mastered.length > 0) && <details className="mi-library">
      <summary>管理薄弱题库 <span>{queue.length + mastered.length} 题</span></summary>
      <div className="mi-library-tools"><div className="mi-filter">{[['learning', '待掌握'], ['mastered', '已掌握']].map(([value, label]) => <button key={value} aria-pressed={filter === value} className={filter === value ? 'is-selected' : ''} onClick={() => { setFilter(value); setExpanded(false) }}>{label}</button>)}</div><input type="search" aria-label="搜索薄弱题库" placeholder="搜索题目…" value={search} onChange={event => { setSearch(event.target.value); setExpanded(false) }} /></div>
      <div className="mi-weak-list">{(expanded ? matching : matching.slice(0, 6)).map(entry => <div className="mi-weak-row" key={entry.questionId}>
        <div><h4>{byId.get(entry.questionId).title}</h4><p>{entry.reasons.includes('skipped') ? '曾跳过' : '主动标记'} · 已记录 {entry.attemptCount} 次练习 · {entry.status === 'mastered' ? '已确认掌握' : entry.dueAt <= now ? '现在可复习' : dateLabel(entry.dueAt) + ' 复习'}</p></div>
        {entry.status === 'mastered' ? <button className="mi-secondary" onClick={() => onMastery(entry.questionId, false)}>重新加入</button>
          : <button className="mi-secondary" onClick={() => onMastery(entry.questionId, true)}>确认已掌握</button>}
      </div>)}</div>
      {!matching.length && <p className="mi-review-policy">{search ? '没有匹配的题目，试试其他关键词。' : filter === 'mastered' ? '暂时没有确认掌握的题目，按自己的节奏慢慢练。' : '目前没有待掌握的问题。'}</p>}
      {matching.length > 6 && <button className="mi-text-button" onClick={() => setExpanded(value => !value)}>{expanded ? '收起' : `展开全部 ${matching.length} 题`}</button>}
      <p className="mi-review-policy">薄弱题库独立保留，不受最近 5 轮限制。取消单轮书签不会删除这里的记录。</p>
    </details>}
  </section>
}

function AttemptColumn({ title, attempt, date }) {
  return <div className="mi-attempt"><div className="mi-attempt-label"><strong>{title}</strong>{date && <span>{dateLabel(date)}</span>}</div>
    {attempt.skipped && <span className="mi-tag is-amber">已跳过 · 以下仅为未提交草稿</span>}
    <p>{attempt.answer || '未作答'}</p>
    {attempt.followUp && <details><summary>查看这次的追问与补充</summary><h5>{attempt.followUp}</h5><p>{attempt.followUpAnswer || '未回答追问'}</p></details>}
  </div>
}

export function AnswerComparison({ item, previous, entry, onCompare, onMastery, busy, waiting, error, providerLabel = 'Codex' }) {
  if (!previous && !entry) return null
  const canCompare = previous && !previous.skipped && !item.skipped && previous.answer.trim() && item.answer.trim()
  return <section className="mi-comparison" aria-label="同题重答复盘">
    <div className="mi-section-title"><h4>{previous ? '同题二答 · 看见具体变化' : '已收进薄弱题库'}</h4><span>{entry?.status === 'mastered' ? '已确认掌握' : '完成重练后，由你确认掌握程度'}</span></div>
    {previous ? <div className="mi-attempt-grid"><AttemptColumn title="上次回答" attempt={previous} date={previous.answeredAt} /><AttemptColumn title="这次回答" attempt={item} date={item.completedAt} /></div>
      : <p className="mi-review-policy">下次重练会先隐藏这次的回答；完成后，可并排对比两次思路。</p>}
    {previous && !canCompare && <p className="mi-review-policy">{item.skipped ? '这次跳过了问题，先保留记录，下次正式作答后再分析变化。' : '上次没有正式作答。这次的回答会成为下次对比的起点。'}</p>}
    {item.comparison ? <div className="mi-comparison-result"><span className="mi-eyebrow">AI 对比建议 · {resultProviderName(item.comparison)}</span><p>{item.comparison.summary}</p><div className="mi-report-columns">{[['improved', '这次补全了什么'], ['remaining', '仍需补充'], ['nextSteps', '下一步怎么练']].map(([key, label]) => <div key={key}><h4>{label}</h4>{item.comparison[key].length ? <ul>{item.comparison[key].map((text, index) => <li key={index}>{text}</li>)}</ul> : <p>本次没有识别到明确内容。</p>}</div>)}</div></div>
      : canCompare && <button className="mi-secondary" disabled={busy} onClick={onCompare}><Sparkles size={15} /> 用 {providerLabel} 分析两次回答</button>}
    {waiting}
    {error && <div className="mi-error" role="alert"><strong>对比暂未完成，两个回答都已保留。</strong><p>{error}</p><p>可在上方切换服务后重试。</p><button className="mi-text-button" disabled={busy} onClick={onCompare}><RotateCcw size={14} /> 使用 {providerLabel} 重试对比</button></div>}
    {entry && <div className="mi-mastery"><span>{entry.status === 'mastered' ? '掌握状态由你确认，可随时重新加入复习。' : `下次复习：${entry.dueAt <= Date.now() ? '现在可练' : dateLabel(entry.dueAt)}。对照参考思路后，由你决定是否掌握。`}</span><div>
      {entry.status === 'mastered' ? <button className="mi-secondary" onClick={() => onMastery(false)}>重新加入复习</button> : <><button className="mi-secondary" onClick={() => onMastery(false, 3)}>3 天后再练</button><button className="mi-primary" onClick={() => onMastery(true)} disabled={item.skipped || !item.answer.trim()}><CheckCircle2 size={15} /> 确认已掌握</button></>}
    </div></div>}
  </section>
}

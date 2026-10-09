import { useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, BookOpen, ChevronDown, Search, Sparkles } from 'lucide-react'
import { archiveCategories, archiveQuestions, archiveReferences } from './archiveQuestions.js'
import './archive.css'

const questionNumber = new Map(archiveQuestions.map((question, index) => [question.id, String(index + 1).padStart(2, '0')]))
const focusCards = [
  { category: 'javascript', label: '01 · 基础机制', title: '能解释原理，也能用代码验证', detail: '异步、对象模型、模块、类型边界继续打底。' },
  { category: 'scenario', label: '02 · 场景排障', title: '从白屏、埋点到跨标签页同步', detail: '讲清复现路径、定位证据、方案取舍与验收。' },
  { category: 'performance', label: '03 · 性能体验', title: '指标驱动，而非背优化清单', detail: '结合 Core Web Vitals、资源瀑布和真实设备。' },
  { category: 'vite', label: '04 · 工程实践', title: '构建、发布与线上故障连起来', detail: 'Vite、Webpack、缓存与版本切换一起回答。' },
  { category: 'ai', label: '05 · AI 应用', title: '把模型能力做成可靠功能', detail: '覆盖检索、工具调用、评测、安全、成本与求职叙述。' },
]

export default function ArchivePage({ categoryId, onSelectCategory }) {
  const [query, setQuery] = useState('')
  const [openIds, setOpenIds] = useState(() => new Set([archiveQuestions[0].id]))
  const activeCategory = archiveCategories.find(category => category.id === categoryId)
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const visibleQuestions = useMemo(() => archiveQuestions.filter(question => {
    if (categoryId && question.category !== categoryId) return false
    if (!normalizedQuery) return true
    const category = archiveCategories.find(item => item.id === question.category)
    return [question.title, question.brief, question.level, category.name, ...question.answer, question.followUp].join(' ').toLocaleLowerCase().includes(normalizedQuery)
  }), [categoryId, normalizedQuery])

  const toggle = id => setOpenIds(current => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  const allVisibleOpen = visibleQuestions.length > 0 && visibleQuestions.every(question => openIds.has(question.id))
  const toggleAll = () => setOpenIds(current => {
    const next = new Set(current)
    visibleQuestions.forEach(question => { if (allVisibleOpen) next.delete(question.id); else next.add(question.id) })
    return next
  })

  return <article className="archive-page">
    <div className="archive-breadcrumb"><span>春日代码簿</span><ArrowRight size={13} /><strong>面试题归档</strong>{activeCategory && <><ArrowRight size={13} /><span>{activeCategory.name}</span></>}</div>
    <div className="archive-hero">
      <div className="archive-hero-copy">
        <span className="section-kicker"><span /> INTERVIEW QUESTION ARCHIVE · 2024—2026</span>
        <h2>把常见追问，<br /><em>答得更有条理。</em></h2>
        <p>面向大厂及中大型团队前端面试准备：从基础机制、框架原理到工程与性能，每道题都整理回答路径、可讨论的边界和延伸追问。</p>
        <div className="archive-hero-stats"><span><strong>{archiveQuestions.length}</strong> 道问题</span><i /><span><strong>{archiveCategories.length}</strong> 个方向</span><i /><span><strong>24—26</strong> 年度整理</span></div>
      </div>
      <div className="archive-hero-art" aria-hidden="true"><span>Q.</span><div><b>01</b><b>02</b><b>03</b></div><small>KEEP ASKING WHY ↗</small></div>
    </div>
    <p className="archive-note"><Sparkles size={15} /> 这是按 2024—2026 年面试准备中常见的考查方向整理的题库，不标注未经核实的企业原题或出现频率。技术答案附官方文档，工程细节请结合实际版本回答。</p>

    {!activeCategory && <section className="archive-focus" aria-label="2026 年备考方向预测">
      <div className="archive-focus-heading"><div><span className="section-kicker"><span /> 2026 PREP FORECAST</span><h3>2026 年，可以优先准备这些方向。</h3></div><p>依据提供的《2024前端面试八股文》与《2025年前端最新场景题面试攻略》梳理：前者覆盖基础知识体系，后者包含大量实际场景与工程问题。以下是备考推断，不是企业提问频率统计。</p></div>
      <div className="archive-focus-grid">{focusCards.map(card => <button key={card.category} onClick={() => onSelectCategory(card.category)}><span>{card.label}</span><strong>{card.title}</strong><small>{card.detail}</small><ArrowUpRight size={16} /></button>)}</div>
    </section>}

    <section className="archive-browser" id="archive-browser" aria-label="浏览面试题">
      <div className="archive-browser-head"><div><span className="section-kicker"><span /> PICK A DIRECTION</span><h3>{activeCategory ? activeCategory.name : '从一个方向开始复习。'}</h3><p>{activeCategory ? activeCategory.description : '按方向浏览，或输入关键词查找具体问题。'}</p></div><label className="archive-search"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索题目、概念、关键词" aria-label="搜索面试题" />{query && <button onClick={() => setQuery('')} aria-label="清空搜索">×</button>}</label></div>
      <div className="archive-category-list" aria-label="题目分类">
        <button className={!categoryId ? 'is-active' : ''} aria-pressed={!categoryId} onClick={() => onSelectCategory(null)}>全部 <small>{archiveQuestions.length}</small></button>
        {archiveCategories.map(category => <button key={category.id} className={categoryId === category.id ? 'is-active' : ''} aria-pressed={categoryId === category.id} onClick={() => onSelectCategory(category.id)}>{category.short} <small>{archiveQuestions.filter(question => question.category === category.id).length}</small></button>)}
      </div>
      <div className="archive-results-head"><span>找到 <strong>{visibleQuestions.length}</strong> 道题</span><button onClick={toggleAll} disabled={!visibleQuestions.length}>{allVisibleOpen ? '收起当前结果' : '展开当前结果'} <ChevronDown size={15} className={allVisibleOpen ? 'is-up' : ''} /></button></div>
      {visibleQuestions.length ? <div className="archive-question-list">{visibleQuestions.map(question => {
        const category = archiveCategories.find(item => item.id === question.category)
        const expanded = openIds.has(question.id)
        return <section className={'archive-question' + (expanded ? ' is-open' : '')} key={question.id}>
          <button className="archive-question-trigger" aria-expanded={expanded} aria-controls={'archive-answer-' + question.id} onClick={() => toggle(question.id)}>
            <span className="archive-question-number">{questionNumber.get(question.id)}</span>
            <span className="archive-question-title"><span className="archive-question-meta">{category.short} <i /> {question.level}</span><strong>{question.title}</strong><small>{question.brief}</small></span>
            <ChevronDown className="archive-question-chevron" size={18} />
          </button>
          {expanded && <div className="archive-question-body" id={'archive-answer-' + question.id}>
            <div className="archive-answer-main"><span className="archive-answer-label">回答思路</span>{question.answer.map((paragraph, index) => <div className="archive-answer-step" key={paragraph}><span>{String(index + 1).padStart(2, '0')}</span><p>{paragraph}</p></div>)}</div>
            {question.example && <div className="archive-example"><div><BookOpen size={15} /> 一个小例子</div><pre><code>{question.example}</code></pre></div>}
            <div className="archive-followup"><span>延伸追问</span><p>{question.followUp}</p></div>
            <div className="archive-sources"><span>核对资料</span>{question.refs.map(id => <a href={archiveReferences[id].url} target="_blank" rel="noopener noreferrer" key={id}>{archiveReferences[id].label}<ArrowUpRight size={13} /></a>)}</div>
          </div>}
        </section>
      })}</div> : <div className="archive-empty"><span>✳</span><strong>暂时没有匹配的题目</strong><p>换个关键词，或切回「全部」分类试试。</p><button onClick={() => { setQuery(''); onSelectCategory(null) }}>查看全部题目 <ArrowRight size={15} /></button></div>}
    </section>
  </article>
}

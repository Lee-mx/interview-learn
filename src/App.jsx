import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, ChevronRight, Clipboard, Code2, Menu, Play, RotateCcw, Sparkles, X } from 'lucide-react'
import { groups, topics, topicOrder } from './topics.jsx'
import PerformanceChart from './PerformanceChart.jsx'
import { interviewQuestions } from './interviewQuestions.js'
import { virtualLibraryDemos } from './VirtualLibraryDemos.jsx'

function routeFromHash() {
  const value = window.location.hash.replace(/^#\/?/, '')
  if (value === 'about') return 'about'
  const match = value.match(/^topic\/(.+)$/)
  return match && topics[match[1]] ? match[1] : 'components'
}

function Logo() {
  return <span className="brand-lockup"><span className="brand-mark"><span>✳</span></span><span className="brand-text">春日代码簿<small>REACT × VITE LAB</small></span></span>
}

function Header({ current, onNavigate }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const desktopHover = () => window.matchMedia('(min-width: 681px)').matches
  useEffect(() => {
    const closeOnEscape = event => { if (event.key === 'Escape') { setOpenMenu(null); setMobileOpen(false) } }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])
  const select = id => { onNavigate(id); setOpenMenu(null); setMobileOpen(false) }
  return <header className="site-header">
    <div className="header-inner">
      <button className="brand-button" onClick={() => select('components')} aria-label="返回首页"><Logo /></button>
      <nav className={`site-nav ${mobileOpen ? 'is-mobile-open' : ''}`} aria-label="主导航">
        {groups.map(group => <div className={`nav-group ${openMenu === group.id ? 'is-open' : ''}`} key={group.id} onMouseEnter={() => { if (desktopHover()) setOpenMenu(group.id) }} onMouseLeave={() => { if (desktopHover()) setOpenMenu(null) }}>
          <button className={`nav-trigger ${group.topics.includes(current) ? 'is-current' : ''}`} aria-expanded={openMenu === group.id} aria-haspopup="true" onClick={() => setOpenMenu(value => value === group.id ? null : group.id)}>{group.title}<ChevronDown size={14} strokeWidth={1.8} /></button>
          <div className="nav-dropdown" role="menu" aria-label={group.title}>
            <div className="dropdown-heading"><span>{group.en}</span><strong>{group.title}</strong><p>{group.description}</p></div>
            <div className="dropdown-topics">{group.topics.map(id => <button role="menuitem" key={id} className={current === id ? 'is-selected' : ''} onClick={() => select(id)}><span>{topics[id].number}</span>{topics[id].title}<ArrowUpRight size={14} /></button>)}</div>
          </div>
        </div>)}
        <button className={`about-nav ${current === 'about' ? 'is-current' : ''}`} onClick={() => select('about')}>关于</button>
      </nav>
      <div className="header-right"><span className="header-note"><span className="online-dot" /> 一起保持好奇</span><button className="header-start" onClick={() => select('components')}>开始探索 <ArrowUpRight size={15} /></button></div>
      <button className="mobile-menu-button" aria-label={mobileOpen ? '关闭菜单' : '打开菜单'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
  </header>
}

function Hero({ current, onNavigate }) {
  return <section className="hero" aria-label="项目介绍">
    <div className="hero-grid">
      <div className="hero-copy">
        <div className="hero-eyebrow"><span className="hero-sun">✳</span> A LITTLE SPACE TO LEARN & GROW <span className="eyebrow-line" /></div>
        <h1>把知识点讲清楚，<br /><em>让代码</em><span className="highlight-word">跑起来<span className="scribble" /></span>。</h1>
        <p>一份轻盈的 React × Vite 面试学习手册。读懂核心概念，对照真实代码，再亲手点一点 Demo，让每个知识点都变得具体。</p>
        <div className="hero-actions"><button className="primary-cta" onClick={() => { onNavigate(current === 'about' ? 'components' : current); document.getElementById('learning-area')?.scrollIntoView({ behavior: 'smooth' }) }}>开始学习 <ArrowRight size={17} /></button><span>{topicOrder.length} 个知识点 <i /> {topicOrder.length + virtualLibraryDemos.length} 个互动示例</span></div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="float-label float-label-one">01 / LEARN</div>
        <div className="float-label float-label-two">02 / BUILD</div>
        <div className="art-window"><div className="art-window-top"><span /><span /><span /><b>hello-react.jsx</b></div><div className="art-lines"><span><i>function</i> Spring() {'{'}</span><span className="indented"><i>return</i> (</span><span className="indented-more">&lt;<b>GoodIdeas</b> /&gt;</span><span className="indented">)</span><span>{'}'}</span></div><div className="art-result"><div className="art-sparkle">✳</div><strong>每一天，<br />都有新发现。</strong><span>hello, spring 🌱</span></div></div>
        <div className="hero-leaf leaf-one">✦</div><div className="hero-leaf leaf-two">✳</div>
      </div>
    </div>
  </section>
}

function Sidebar({ current, onNavigate }) {
  return <aside className="sidebar" aria-label="知识点目录">
    <div className="sidebar-top"><span>EXPLORE THE TOPICS</span><strong>学习目录 <span>{topicOrder.length}</span></strong></div>
    {groups.map(group => <div className="sidebar-group" key={group.id}><div className="sidebar-group-title"><span>{group.title}</span><small>{group.topics.length.toString().padStart(2, '0')}</small></div>{group.topics.map(id => <button key={id} className={`sidebar-link ${current === id ? 'is-active' : ''}`} onClick={() => onNavigate(id)}><span>{topics[id].number}</span>{topics[id].title}{current === id && <ChevronRight size={15} />}</button>)}</div>)}
    <div className="sidebar-note"><span>✳</span><p>慢慢来，<br />好的理解会在动手时发芽。</p><small>KEEP GROWING, ONE STEP AT A TIME.</small></div>
  </aside>
}

const tokenPattern = /(\/\/.*$|'[^']*'|"[^"]*"|`[^`]*`|\b(?:function|return|export|default|const|let|import|from|async|await|if|new|true|false|null)\b|<\/?[A-Za-z][\w.]*)/g
function tokenClass(token) {
  if (token.startsWith('//')) return 'token-comment'
  if (/^['"`]/.test(token)) return 'token-string'
  if (token.startsWith('<')) return 'token-tag'
  if (/^(function|return|export|default|const|let|import|from|async|await|if|new|true|false|null)$/.test(token)) return 'token-keyword'
  return ''
}
function CodeLine({ line, number }) {
  const parts = line.split(tokenPattern).filter(Boolean)
  return <div className="code-line"><span className="line-number">{number}</span><span className="line-content">{parts.map((part, index) => <span key={index} className={tokenClass(part)}>{part}</span>)}</span></div>
}

function Workspace({ topic }) {
  const [previewKey, setPreviewKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const Demo = topic.Demo
  useEffect(() => { setPreviewKey(0); setCopied(false) }, [topic])
  const copy = async () => {
    try { await navigator.clipboard.writeText(topic.code); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }
    catch { setCopied(false) }
  }
  return <section className="workspace" aria-label="代码与效果展示">
    <div className="workspace-header"><div><span className="workspace-activity"><span /> INTERACTIVE PLAYGROUND</span><strong>看代码，也看它如何发生。</strong></div><div className="workspace-header-right"><span>React + Vite</span><Code2 size={18} /></div></div>
    <div className="workspace-grid">
      <div className="code-pane"><div className="pane-toolbar"><div className="pane-tab"><Code2 size={16} /><span>App.jsx</span></div><button className="toolbar-button" onClick={copy} aria-label="复制代码">{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? '已复制' : '复制代码'}</button></div><div className="code-scroll"><pre aria-label="示例代码"><code>{topic.code.split('\n').map((line, index) => <CodeLine key={index} line={line} number={index + 1} />)}</code></pre></div><div className="code-bottom"><span><span className="code-status-dot" /> JSX</span><span>UTF-8 <i /> React</span></div></div>
      <div className="preview-pane"><div className="pane-toolbar preview-toolbar"><div className="preview-title"><Play size={14} fill="currentColor" /><span>实时效果</span><span className="live-pill"><span /> LIVE</span></div><button className="toolbar-button preview-reset" onClick={() => setPreviewKey(value => value + 1)}><RotateCcw size={15} /> 重置示例</button></div><div className="preview-surface" key={previewKey}><Demo /></div><div className="preview-bottom"><span>试着点击、输入或切换，观察界面变化</span><Sparkles size={15} /></div></div>
    </div>
  </section>
}

function Solutions({ solutions }) {
  return <section className="solution-section" aria-label="虚拟列表常用方案"><div className="solution-heading"><div><span className="section-kicker"><span /> COMMON OPTIONS</span><h3>实际项目，常用这 3 种方案。</h3></div><p>先看手写 Demo 理解原理，再用下方三套库的 Demo 体会选型差异。</p></div><div className="solution-grid">{solutions.map((solution, index) => <article className="solution-card" key={solution.name}><div className="solution-card-top"><span>0{index + 1} / {solution.label}</span><ArrowUpRight size={17} /></div><h4>{solution.name}</h4><strong>{solution.fit}</strong><p>{solution.detail}</p><a href={solution.url} target="_blank" rel="noopener noreferrer" aria-label={`查看 ${solution.name} 官方文档`}>查看官方文档 <ArrowRight size={14} /></a></article>)}</div></section>
}

function LibraryDemos() {
  const [activeId, setActiveId] = useState(virtualLibraryDemos[0].id)
  const [copied, setCopied] = useState(false)
  const active = virtualLibraryDemos.find(item => item.id === activeId)
  const Demo = active.Demo

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch { setCopied(false) }
  }

  return <section className="library-section" aria-label="三种虚拟列表库的交互示例">
    <div className="library-section-heading"><span className="section-kicker"><span /> LIBRARY PLAYGROUND</span><h3>同样是 10,000 条，试试三种写法。</h3><p>切换方案，看核心代码、滚动效果和它们各自负责的工作。</p></div>
    <div className="library-tabs" aria-label="选择虚拟列表方案">
      {virtualLibraryDemos.map((item, index) => <button key={item.id} className={`library-tab ${activeId === item.id ? 'is-active' : ''}`} aria-pressed={activeId === item.id} onClick={() => { setActiveId(item.id); setCopied(false) }}><small>0{index + 1}</small><strong>{item.name}</strong><span>{item.feature}</span></button>)}
    </div>
    <div className="library-workspace">
      <div className="library-workspace-intro"><strong>{active.feature}</strong><p>{active.takeaway}</p></div>
      <div className="workspace-grid library-workspace-grid">
        <div className="code-pane"><div className="pane-toolbar"><div className="pane-tab"><Code2 size={16} /><span>{active.name} · 核心代码</span></div><button className="toolbar-button" onClick={copy} aria-label={`复制 ${active.name} 示例代码`}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? '已复制' : '复制代码'}</button></div><div className="code-scroll"><pre aria-label={`${active.name} 示例代码`}><code>{active.code.split('\n').map((line, index) => <CodeLine key={index} line={line} number={index + 1} />)}</code></pre></div><div className="code-bottom"><span><span className="code-status-dot" /> JSX</span><span>核心 API <i /> React</span></div></div>
        <div className="preview-pane"><div className="pane-toolbar preview-toolbar"><div className="preview-title"><Play size={14} fill="currentColor" /><span>实时效果</span><span className="live-pill"><span /> LIVE</span></div><span className="library-preview-label">10,000 ITEMS</span></div><div className="preview-surface library-preview-surface" key={active.id}><Demo /></div><div className="preview-bottom"><span>滚动列表，或点击跳转按钮</span><Sparkles size={15} /></div></div>
      </div>
    </div>
  </section>
}

function TopicPage({ id, onNavigate }) {
  const topic = topics[id]
  const [openQuestion, setOpenQuestion] = useState(null)
  useEffect(() => { setOpenQuestion(null) }, [id])
  const index = topicOrder.indexOf(id)
  const group = groups.find(item => item.id === topic.group)
  const questions = [{ question: topic.question, answer: topic.answer }, ...interviewQuestions[id]]
  return <article className="topic-content">
    <div className="breadcrumb"><span>知识点文案梳理 & Demo 演示</span><ChevronRight size={14} /><span>{group.title}</span><ChevronRight size={14} /><strong>{topic.title}</strong></div>
    <div className="topic-heading"><div><span className="chapter-label">CHAPTER {topic.number} <i /> {group.en}</span><h2>{topic.title}<span className="heading-star">✳</span></h2><p>{topic.subtitle}</p></div><div className="reading-time"><BookOpen size={17} /><span>{topic.time} 阅读</span></div></div>
    <div className="concept-card"><div className="concept-main"><span className="section-kicker"><span /> THE BIG IDEA</span><p>{topic.lead}</p></div><div className="concept-points"><span>记住这 3 件事</span>{topic.points.map((point, index) => <div key={point}><b>0{index + 1}</b><p>{point}</p></div>)}</div></div>
    {topic.solutions && <Solutions solutions={topic.solutions} />}
    <div className="section-title-row"><div><span className="section-kicker"><span /> TRY IT YOURSELF</span><h3>动手看看，会更容易记住。</h3></div><span className="section-side-note">CODE <span>↔</span> PREVIEW</span></div>
    <Workspace topic={topic} />
    {id === 'virtual-list' && <LibraryDemos />}
    {id === 'virtual-list' && <PerformanceChart />}
    <section className="interview-questions" aria-label="面试时可能会问"><div className="interview-questions-head"><div className="question-icon">?</div><div><span>INTERVIEW NOTES</span><h3>面试时可能会问</h3></div><small>{questions.length} 道精选问题</small></div><div className="interview-questions-list">{questions.map((item, questionIndex) => <div className={`interview-qa ${openQuestion === questionIndex ? 'is-open' : ''}`} key={item.question}><button aria-expanded={openQuestion === questionIndex} aria-controls={`answer-${id}-${questionIndex}`} onClick={() => setOpenQuestion(value => value === questionIndex ? null : questionIndex)}><span className="interview-qa-number">0{questionIndex + 1}</span><strong>{item.question}</strong><span className="interview-qa-action">{openQuestion === questionIndex ? '收起思路' : '查看思路'} <ChevronDown size={15} /></span></button>{openQuestion === questionIndex && <p id={`answer-${id}-${questionIndex}`}>{item.answer}</p>}</div>)}</div></section>
    <div className="topic-pagination"><button disabled={index === 0} onClick={() => onNavigate(topicOrder[index - 1])}><ArrowLeft size={17} /><span><small>上一节</small>{index > 0 ? topics[topicOrder[index - 1]].title : '已经是第一节'}</span></button><button disabled={index === topicOrder.length - 1} onClick={() => onNavigate(topicOrder[index + 1])}><span><small>下一节</small>{index < topicOrder.length - 1 ? topics[topicOrder[index + 1]].title : '已经学完了'}</span><ArrowRight size={17} /></button></div>
  </article>
}

function AboutPage() {
  return <article className="about-page"><div className="breadcrumb"><span>春日代码簿</span><ChevronRight size={14} /><strong>关于</strong></div><div className="about-hero"><span className="section-kicker"><span /> ABOUT THIS LITTLE LAB</span><div className="about-flower" aria-hidden="true">✳</div><h2>留一块地方，<br />给<span>好奇心</span>慢慢生长。</h2><p>这里是 React × Vite 面试演示项目的「关于」页。目前先留下一段小小的开场白，后续可以补充项目背景、学习路线和更多实践案例。</p><div className="about-coming">MORE STORIES COMING SOON <span>↗</span></div></div><div className="about-values"><div><span>01 / READ</span><strong>先把概念讲明白</strong><p>用简短的语言，提炼面试中最常被问到的要点。</p></div><div><span>02 / SEE</span><strong>再看看代码怎么写</strong><p>每一节都配上源码，帮助把抽象概念变成具体结构。</p></div><div><span>03 / TRY</span><strong>最后亲手点一点</strong><p>可交互 Demo 让状态变化、条件判断与模块加载看得见。</p></div></div></article>
}

function Footer() {
  return <footer className="site-footer"><div><Logo /><p>用一段段小实验，让学习保持明亮。</p></div><span>MADE FOR CURIOUS MINDS <span>✳</span> REACT × VITE</span></footer>
}

export default function App() {
  const [current, setCurrent] = useState(routeFromHash)
  useEffect(() => {
    const update = () => setCurrent(routeFromHash())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  const navigate = id => {
    const hash = id === 'about' ? '#/about' : `#/topic/${id}`
    if (window.location.hash === hash) setCurrent(id)
    else window.location.hash = hash
    document.getElementById('learning-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return <div className="app-shell"><Header current={current} onNavigate={navigate} /><main><Hero current={current} onNavigate={navigate} /><div className="content-shell" id="learning-area"><Sidebar current={current} onNavigate={navigate} />{current === 'about' ? <AboutPage /> : <TopicPage id={current} onNavigate={navigate} />}</div></main><Footer /></div>
}

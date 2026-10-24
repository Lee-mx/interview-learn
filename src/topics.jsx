import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, CircleHelp, Leaf, Minus, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import CallbackDemo from './CallbackDemo.jsx'
import callbackCode from './CallbackDemo.jsx?raw'
import TransitionDemo from './TransitionDemo.jsx'
import transitionCode from './TransitionDemo.jsx?raw'
import ReduxDemo from './reduxDemo/App.jsx'
import reduxAppCode from './reduxDemo/App.jsx?raw'
import reduxWidgetsCode from './reduxDemo/ProgressWidgets.jsx?raw'
import reduxStoreCode from './reduxDemo/store.js?raw'
import ZustandDemo from './zustandDemo/App.jsx'
import zustandAppCode from './zustandDemo/App.jsx?raw'
import zustandWidgetsCode from './zustandDemo/ProgressWidgets.jsx?raw'
import zustandStoreCode from './zustandDemo/store.js?raw'
import { resetProgressStore } from './zustandDemo/store.js'
import React19GuideDemo from './React19GuideDemo.jsx'
import { react19Files } from './react19Examples.js'

const softButton = 'rounded-xl border border-[#cfdfce] bg-white px-4 py-2.5 text-sm font-medium text-[#315b46] shadow-sm transition hover:border-[#96bc9d] hover:bg-[#f5fbf2] active:scale-[.98]'
const solidButton = 'rounded-xl bg-[#326f51] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#245a41] active:scale-[.98]'

function IntroDemo() {
  const [clicks, setClicks] = useState(0)
  return <div className="demo-centered text-left">
    <span className="demo-overline"><Sparkles size={14} /> YOUR FIRST COMPONENT</span>
    <h3 className="demo-title">Welcome to my app <span>✳</span></h3>
    <p className="demo-caption">一个组件，就是一块可以反复使用的界面。</p>
    <button className={solidButton + ' mt-7'} onClick={() => setClicks(value => value + 1)}>I'm a button <span className="ml-2 opacity-70">{clicks ? `· ${clicks}` : '↗'}</span></button>
  </div>
}

function PropsDemo() {
  const [active, setActive] = useState('React')
  return <div className="demo-centered">
    <span className="demo-overline"><Leaf size={14} /> REUSABLE UI</span>
    <h3 className="demo-title mb-5">同一个组件，不同的内容</h3>
    <div className="flex flex-wrap justify-center gap-3">
      {['React', 'Vite', 'JavaScript'].map(name => <button key={name} onClick={() => setActive(name)} className={`topic-chip ${active === name ? 'is-active' : ''}`}>{name}<ArrowRight size={15} /></button>)}
    </div>
    <p className="demo-caption mt-6">当前传入的 title：<strong>{active}</strong></p>
  </div>
}

function StateDemo() {
  const [count, setCount] = useState(0)
  return <div className="demo-centered">
    <span className="demo-overline">STATE IN ACTION</span>
    <div className="counter-number">{String(count).padStart(2, '0')}</div>
    <p className="demo-caption mb-7">点击按钮，状态变化会触发界面更新。</p>
    <div className="flex items-center justify-center gap-3">
      <button className={softButton + ' !p-3'} aria-label="减少计数" onClick={() => setCount(value => value - 1)}><Minus size={18} /></button>
      <button className={solidButton + ' !px-6'} onClick={() => setCount(value => value + 1)}>加一次 <Plus size={16} className="ml-1 inline" /></button>
      <button className={softButton + ' !p-3'} aria-label="重置计数" onClick={() => setCount(0)}><RotateCcw size={18} /></button>
    </div>
  </div>
}

function ConditionalDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return <div className="demo-centered">
    <span className="demo-overline">CONDITIONAL RENDERING</span>
    <div className="status-illustration">{isLoggedIn ? '☀' : '☁'}</div>
    <h3 className="demo-title">{isLoggedIn ? '欢迎回来，开发者！' : '今天也来写点 React 吧'}</h3>
    <p className="demo-caption mb-7">{isLoggedIn ? '条件为 true，显示已登录视图。' : '条件为 false，显示访客视图。'}</p>
    <button className={solidButton} onClick={() => setIsLoggedIn(value => !value)}>{isLoggedIn ? '退出登录' : '模拟登录'}</button>
  </div>
}

function ListDemo() {
  const [items, setItems] = useState([{ id: 1, text: '阅读 React 文档' }, { id: 2, text: '动手写一个 Demo' }, { id: 3, text: '复盘面试问题' }])
  const [input, setInput] = useState('')
  const add = (event) => {
    event.preventDefault()
    if (!input.trim()) return
    setItems(current => [...current, { id: Date.now(), text: input.trim() }])
    setInput('')
  }
  return <div className="demo-list">
    <span className="demo-overline">MY LEARNING LIST</span>
    <h3 className="demo-title mb-5">今日学习清单</h3>
    <form className="flex gap-2" onSubmit={add}><input className="demo-input" value={input} onChange={event => setInput(event.target.value)} placeholder="添加一个学习任务" aria-label="新任务" /><button className={solidButton + ' shrink-0'} type="submit">添加</button></form>
    <ul className="mt-5 space-y-2">{items.map(item => <li key={item.id} className="task-row"><span><Check size={15} /> {item.text}</span><button aria-label={`删除 ${item.text}`} onClick={() => setItems(current => current.filter(task => task.id !== item.id))}><Trash2 size={15} /></button></li>)}</ul>
    {items.length === 0 && <p className="demo-caption mt-5">清单空了，添加一项试试。</p>}
  </div>
}

function EffectDemo() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => setSeconds(value => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running])
  return <div className="demo-centered">
    <span className="demo-overline">EFFECT & CLEANUP</span>
    <div className="timer-face">{String(Math.floor(seconds / 60)).padStart(2, '0')}<span>:</span>{String(seconds % 60).padStart(2, '0')}</div>
    <p className="demo-caption mb-7">计时器在 Effect 中创建，并在清理函数中关闭。</p>
    <div className="flex justify-center gap-3"><button className={solidButton} onClick={() => setRunning(value => !value)}>{running ? '暂停' : '开始计时'}</button><button className={softButton} onClick={() => { setRunning(false); setSeconds(0) }}>重置</button></div>
  </div>
}

const fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach']
function MemoDemo() {
  const [query, setQuery] = useState('')
  const visible = useMemo(() => fruits.filter(fruit => fruit.toLowerCase().includes(query.toLowerCase())), [query])
  return <div className="demo-list">
    <span className="demo-overline">DERIVED DATA</span>
    <h3 className="demo-title mb-5">快速筛选水果</h3>
    <input className="demo-input" value={query} onChange={event => setQuery(event.target.value)} placeholder="试试输入 ap / b / orange" aria-label="搜索水果" />
    <div className="mt-5 flex flex-wrap gap-2">{visible.map(fruit => <span className="fruit-pill" key={fruit}>{fruit}</span>)}{visible.length === 0 && <span className="demo-caption">没有找到匹配项</span>}</div>
    <p className="demo-caption mt-6">当前结果：{visible.length} 项</p>
  </div>
}

const ThemeContext = createContext('light')
function ThemeCard() {
  const theme = useContext(ThemeContext)
  return <div className={`context-card ${theme === 'dark' ? 'is-dark' : ''}`}><span>{theme === 'dark' ? '☾' : '☀'}</span><strong>{theme === 'dark' ? '夜间模式' : '春日模式'}</strong><small>从 Context 读取主题，无需逐层传 props。</small></div>
}
function ContextDemo() {
  const [theme, setTheme] = useState('light')
  return <ThemeContext.Provider value={theme}><div className="demo-centered"><span className="demo-overline">SHARED CONTEXT</span><ThemeCard /><button className={softButton + ' mt-6'} onClick={() => setTheme(value => value === 'light' ? 'dark' : 'light')}>切换主题</button></div></ThemeContext.Provider>
}

const virtualItems = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  label: `第 ${index + 1} 条学习记录`,
}))
const virtualRowHeight = 44
const virtualViewportHeight = 220
const virtualOverscan = 3

function VirtualListDemo() {
  const viewportRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const firstVisible = Math.floor(scrollTop / virtualRowHeight)
  const start = Math.max(0, firstVisible - virtualOverscan)
  const end = Math.min(
    virtualItems.length,
    firstVisible + Math.ceil(virtualViewportHeight / virtualRowHeight) + virtualOverscan + 1,
  )
  const visibleItems = virtualItems.slice(start, end)

  const jumpTo = index => {
    if (!viewportRef.current) return
    viewportRef.current.scrollTop = (index - 1) * virtualRowHeight
    setScrollTop(viewportRef.current.scrollTop)
  }

  return <div className="virtual-demo">
    <div className="virtual-demo-heading"><div><span className="demo-overline">RENDER WHAT YOU SEE</span><h3 className="demo-title">一万条数据，也能轻快滚动。</h3></div><span className="virtual-sparkle" aria-hidden="true">✳</span></div>
    <div className="virtual-stats"><span><strong>{virtualItems.length.toLocaleString()}</strong> 条数据</span><span><strong>{visibleItems.length}</strong> 个 DOM 节点</span></div>
    <div className="virtual-viewport" ref={viewportRef} onScroll={event => setScrollTop(event.currentTarget.scrollTop)} style={{ height: virtualViewportHeight }} role="list" aria-label="虚拟列表，包含一万条学习记录">
      <div className="virtual-spacer" style={{ height: virtualItems.length * virtualRowHeight }}>
        {visibleItems.map(item => <div className="virtual-row" role="listitem" aria-posinset={item.id} aria-setsize={virtualItems.length} key={item.id} style={{ top: (item.id - 1) * virtualRowHeight, height: virtualRowHeight }}><span>{String(item.id).padStart(5, '0')}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span></div>)}
      </div>
    </div>
    <div className="virtual-demo-bottom"><span>当前渲染：{start + 1} – {end}</span><div><button onClick={() => jumpTo(1)}>开头</button><button onClick={() => jumpTo(5000)}>第 5000 条</button><button onClick={() => jumpTo(10000)}>末尾</button></div></div>
  </div>
}

function EnvDemo() {
  return <div className="demo-list">
    <span className="demo-overline">VITE RUNTIME INFO</span>
    <h3 className="demo-title mb-5">当前开发环境</h3>
    <div className="env-row"><span>MODE</span><strong>{import.meta.env.MODE}</strong></div>
    <div className="env-row"><span>DEV</span><strong>{String(import.meta.env.DEV)}</strong></div>
    <div className="env-row"><span>BASE_URL</span><strong>{import.meta.env.BASE_URL}</strong></div>
    <p className="demo-caption mt-6"><CircleHelp size={15} className="inline mr-1" />只有以 VITE_ 开头的自定义环境变量会暴露给客户端。</p>
  </div>
}

function ModuleDemo() {
  const [message, setMessage] = useState('模块还没有加载')
  const [loading, setLoading] = useState(false)
  const load = async () => {
    setLoading(true)
    const module = await import('./demoMessages.js')
    setMessage(module.getGreeting())
    setLoading(false)
  }
  return <div className="demo-centered"><span className="demo-overline">DYNAMIC IMPORT</span><div className="module-icon">↗</div><h3 className="demo-title">按需加载一个模块</h3><p className="demo-caption mb-7">{message}</p><button className={solidButton} onClick={load} disabled={loading}>{loading ? '加载中...' : '加载模块'}</button></div>
}

export const groups = [
  { id: 'basics', title: 'React 基础', en: 'THE FOUNDATIONS', description: '从组件出发，理解界面如何由数据驱动。', topics: ['components', 'props', 'state', 'conditional', 'lists'] },
  { id: 'advanced', title: 'React 进阶', en: 'GO A LITTLE DEEPER', description: '处理副作用、跨层传值、状态管理与 React 19 新能力。', topics: ['effect', 'context', 'redux', 'zustand', 'react19-hooks'] },
  { id: 'performance', title: '性能优化', en: 'MAKE IT FEEL FAST', description: '用缓存、非紧急更新与虚拟化改善交互体验。', topics: ['memo', 'callback', 'transition', 'virtual-list'] },
  { id: 'vite', title: 'Vite 工程化', en: 'BUILD WITH VITE', description: '让开发与构建过程更轻快。', topics: ['env', 'modules'] },
]

export const topics = {
  components: {
    group: 'basics', number: '01', title: '组件与 JSX', subtitle: '用小组件，组合出完整的界面。', time: '3 min',
    lead: 'React 组件是返回界面的 JavaScript 函数。JSX 让你在 JavaScript 中描述标签结构，再把组件像标签一样组合起来。',
    points: ['组件名使用大写字母开头，便于 React 区分组件与原生标签。', '一个组件应返回一个根节点；可用 Fragment 避免额外 DOM。', '事件处理函数传引用，例如 onClick={handleClick}。'],
    question: '为什么组件名必须以大写字母开头？', answer: '小写标签会被 React 当作原生 HTML 标签；大写名称会被当作组件引用。',
    code: `import { useState } from 'react';\n\nfunction MyButton() {\n  const [clicks, setClicks] = useState(0);\n  return (\n    <button onClick={() => setClicks(c => c + 1)}>\n      I'm a button {clicks > 0 && clicks}\n    </button>\n  );\n}\n\nexport default function MyApp() {\n  return (\n    <div>\n      <h1>Welcome to my app</h1>\n      <MyButton />\n    </div>\n  );\n}`, Demo: IntroDemo,
  },
  props: {
    group: 'basics', number: '02', title: 'Props 数据传递', subtitle: '让组件成为可复用的积木。', time: '4 min',
    lead: 'Props 是父组件传给子组件的输入。它让相同的组件结构可以呈现不同的数据，同时保持数据从上往下流动。',
    points: ['通过 JSX 属性传入 props，在组件参数中解构读取。', 'Props 是只读的；需要更新时由拥有状态的组件处理。', 'children 可用于传入一段嵌套内容。'],
    question: 'Props 与 state 的主要区别是什么？', answer: 'Props 由父组件传入且在子组件中只读；state 由组件自己管理，可以通过 setter 更新。',
    code: `import { useState } from 'react';\n\nfunction TopicCard({ title, onSelect }) {\n  return (\n    <button onClick={() => onSelect(title)}>\n      {title} →\n    </button>\n  );\n}\n\nexport default function App() {\n  const [active, setActive] = useState('React');\n  return (\n    <>\n      {['React', 'Vite', 'JavaScript'].map(name => (\n        <TopicCard key={name} title={name} onSelect={setActive} />\n      ))}\n      <p>当前：{active}</p>\n    </>\n  );\n}`, Demo: PropsDemo,
  },
  state: {
    group: 'basics', number: '03', title: 'useState 状态', subtitle: '让页面对交互做出响应。', time: '4 min',
    lead: 'State 是组件记住的信息。调用 setter 会安排一次重新渲染，React 随后根据最新状态更新界面。',
    points: ['useState 返回当前值与更新函数。', '新值依赖旧值时，优先使用函数式更新。', '不要直接修改 state 中的对象或数组；创建新值。'],
    question: '连续调用 setCount(count + 1) 两次，一定会加 2 吗？', answer: '不一定。两次调用可能读取同一次渲染的 count；使用 setCount(c => c + 1) 才能逐次基于前值更新。',
    code: `import { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <strong>{count}</strong>\n      <button onClick={() => setCount(c => c - 1)}>−</button>\n      <button onClick={() => setCount(c => c + 1)}>＋</button>\n      <button onClick={() => setCount(0)}>重置</button>\n    </div>\n  );\n}`, Demo: StateDemo,
  },
  conditional: {
    group: 'basics', number: '04', title: '条件渲染', subtitle: '同一块区域，呈现不同状态。', time: '3 min',
    lead: 'React 使用普通 JavaScript 条件语句决定渲染内容。根据场景可以使用 if、三元表达式或 &&。',
    points: ['两种视图二选一时，三元表达式最直接。', '仅在条件满足时展示内容，可使用 &&。', '复杂条件可先计算变量，再放到 JSX 中。'],
    question: '使用 count && <Badge /> 可能出现什么问题？', answer: '当 count 为 0，React 会把数字 0 渲染出来；可写成 count > 0 && <Badge />。',
    code: `import { useState } from 'react';\n\nexport default function Welcome() {\n  const [isLoggedIn, setIsLoggedIn] = useState(false);\n\n  return (\n    <section>\n      <h2>{isLoggedIn ? '欢迎回来！' : '欢迎，访客'}</h2>\n      <button onClick={() => setIsLoggedIn(v => !v)}>\n        {isLoggedIn ? '退出登录' : '模拟登录'}\n      </button>\n    </section>\n  );\n}`, Demo: ConditionalDemo,
  },
  lists: {
    group: 'basics', number: '05', title: '列表与 Key', subtitle: '用数据生成界面，保持元素身份稳定。', time: '5 min',
    lead: '使用 map 将数组转换为 React 元素。Key 帮助 React 在增删、重排时识别每一项的身份。',
    points: ['Key 在同级列表中应唯一且稳定。', '优先使用数据自带的 id；可重排列表尽量避免使用数组下标。', '新增或删除条目时返回新数组，不直接修改旧数组。'],
    question: '什么时候不适合使用数组下标作为 key？', answer: '列表会插入、删除或重排时，下标不能稳定代表某一项，可能造成状态错位。',
    code: `import { useState } from 'react';\n\nexport default function TaskList() {\n  const [tasks, setTasks] = useState([\n    { id: 1, text: '阅读 React 文档' },\n    { id: 2, text: '动手写一个 Demo' },\n  ]);\n  const [text, setText] = useState('');\n\n  function addTask(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    setTasks(list => [...list, { id: Date.now(), text }]);\n    setText('');\n  }\n\n  return (\n    <>\n      <form onSubmit={addTask}>\n        <input value={text} onChange={e => setText(e.target.value)} />\n        <button>添加</button>\n      </form>\n      <ul>{tasks.map(task => (\n        <li key={task.id}>\n          {task.text}\n          <button onClick={() => setTasks(list =>\n            list.filter(item => item.id !== task.id)\n          )}>删除</button>\n        </li>\n      ))}</ul>\n    </>\n  );\n}`, Demo: ListDemo,
  },
  effect: {
    group: 'advanced', number: '06', title: 'useEffect 副作用', subtitle: '与组件外部系统保持同步。', time: '5 min',
    lead: 'Effect 用于同步 React 与浏览器 API、网络连接等外部系统。依赖变化时，React 会先执行旧 Effect 的清理，再运行新 Effect。',
    points: ['计时器、订阅和事件监听应在清理函数中移除。', '依赖数组要包含 Effect 中读取的响应式值。', '仅为计算派生数据时，通常不需要 Effect。'],
    question: '为什么定时器需要 cleanup？', answer: '组件卸载或依赖变化时，旧定时器若继续运行会产生重复更新与资源泄漏。',
    code: `import { useEffect, useState } from 'react';\n\nexport default function Timer() {\n  const [seconds, setSeconds] = useState(0);\n  const [running, setRunning] = useState(false);\n\n  useEffect(() => {\n    if (!running) return;\n    const id = setInterval(() => {\n      setSeconds(value => value + 1);\n    }, 1000);\n    return () => clearInterval(id);\n  }, [running]);\n\n  return (\n    <>\n      <span>{seconds}s</span>\n      <button onClick={() => setRunning(v => !v)}>\n        {running ? '暂停' : '开始'}\n      </button>\n    </>\n  );\n}`, Demo: EffectDemo,
  },
  memo: {
    group: 'performance', number: '11', title: 'useMemo 派生数据', subtitle: '只在依赖变化时重新计算。', time: '4 min',
    lead: 'useMemo 会缓存一次计算的结果，直到依赖发生变化。它适用于开销较大的计算，也可以帮助稳定传给子组件的引用。',
    points: ['先保证计算逻辑正确，再根据性能需要添加缓存。', '依赖数组必须包含计算中使用的响应式值。', '简单计算不必为了使用 useMemo 而使用它。'],
    question: 'useMemo 能代替 useEffect 吗？', answer: '不能。useMemo 用于渲染期间的纯计算，useEffect 用于与外部系统同步。',
    code: `import { useMemo, useState } from 'react';\n\nconst fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry',\n  'Cherry', 'Grape', 'Mango', 'Orange', 'Peach'];\n\nexport default function FruitSearch() {\n  const [query, setQuery] = useState('');\n  const results = useMemo(() =>\n    fruits.filter(fruit =>\n      fruit.toLowerCase().includes(query.toLowerCase())\n    ), [query]\n  );\n\n  return (\n    <>\n      <input value={query} onChange={e => setQuery(e.target.value)} />\n      {results.map(fruit => <span key={fruit}>{fruit}</span>)}\n    </>\n  );\n}`, Demo: MemoDemo,
  },
  callback: {
    group: 'performance', number: '12', title: 'useCallback 稳定回调', subtitle: '让依赖不变时的函数引用保持稳定。', time: '5 min',
    lead: 'useCallback 缓存函数本身，而 useMemo 缓存计算结果。把回调传给 React.memo 子组件时，如果依赖没有变化，稳定的函数引用能帮助子组件跳过由父组件无关更新带来的重新渲染；它不是给每个事件函数都套一层的规则。',
    points: ['useCallback(fn, deps) 返回函数；依赖改变时才换成新的函数引用。', '与 React.memo 配合、或自定义 Hook 向外返回回调时更可能有价值；先定位实际重渲染问题。', '依赖必须完整。若更新只需要旧状态，可用函数式 setter，避免为读取旧值而增加依赖。'],
    question: '为什么只给普通子组件传 useCallback，不一定能减少渲染？',
    answer: 'useCallback 只稳定函数引用，不会自动让子组件跳过渲染。普通子组件通常仍随父组件重新渲染；当子组件使用 React.memo 且其他 props 也保持相同时，稳定的回调才可能帮助跳过这次渲染。',
    code: callbackCode, Demo: CallbackDemo,
  },
  transition: {
    group: 'performance', number: '13', title: 'useTransition 非紧急更新', subtitle: '让输入先响应，较重的界面更新随后完成。', time: '5 min',
    lead: 'useTransition 返回 isPending 和 startTransition。把不需要立即显示的状态更新放进 startTransition，React 就可以优先处理输入等紧急交互，并在有新输入时中断尚未完成的过渡渲染。',
    points: ['受控输入的 value 要用普通 state 立即更新；不要把控制输入框的 setter 放进 Transition。', 'startTransition 中的函数会立即执行；被标记为非紧急的是其中同步安排的状态更新，并非延迟调用函数。', 'isPending 可以显示等待反馈。Transition 不会加速计算、替代防抖或自动取消网络请求。'],
    question: '搜索框为什么要维护 input 和 query 两份状态？',
    answer: 'input 控制输入框，必须随着键入立即更新；query 驱动较重的结果列表，可以放进 startTransition 作为非紧急更新。若把控制输入框的 setInput 放进 Transition，受控输入就无法按预期即时响应。',
    code: transitionCode, Demo: TransitionDemo,
  },
  context: {
    group: 'advanced', number: '07', title: 'Context 跨层共享', subtitle: '把共享数据传到需要它的地方。', time: '5 min',
    lead: 'Context 可把主题、语言等数据提供给组件树下方的组件，避免每一层都手动透传 props。',
    points: ['使用 createContext 创建上下文，Provider 提供值。', '后代组件通过 useContext 读取最近的 Provider。', 'Provider 的 value 变化会让读取该 Context 的组件更新。'],
    question: 'Context 是否应该替代所有 props？', answer: '不需要。局部、明确的数据传递仍用 props；多个层级都需要的数据才适合 Context。',
    code: `import { createContext, useContext, useState } from 'react';\n\nconst ThemeContext = createContext('light');\n\nfunction ThemeCard() {\n  const theme = useContext(ThemeContext);\n  return <div>当前主题：{theme}</div>;\n}\n\nexport default function App() {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={theme}>\n      <ThemeCard />\n      <button onClick={() => setTheme(\n        current => current === 'light' ? 'dark' : 'light'\n      )}>切换主题</button>\n    </ThemeContext.Provider>\n  );\n}`, Demo: ContextDemo,
  },
  redux: {
    group: 'advanced', number: '08', title: 'Redux 状态管理', subtitle: '从业务输入到 action.payload，再到共享状态。', time: '7 min',
    lead: 'Redux 把跨组件共享的状态放进 store。业务组件从输入或事件获得数据，调用 action creator 把数据放进 action.payload，再由 dispatch 交给 reducer 更新状态。示例把 store、业务组件和 App 分成三个真实文件。',
    points: ['store.js 用 createSlice 定义 reducer 和 action creator，再用 configureStore 创建 store。', '业务组件调用 dispatch(addAmount(value))；value 来自输入框，reducer 从 action.payload 读取它。', 'App.jsx 用 Provider 提供 store；其他组件通过 useSelector 读取更新后的状态。'],
    question: 'dispatch(addAmount(value)) 中的 value 从哪里来？', answer: '业务组件先从输入框得到 amount，提交时转成数字 value。addAmount(value) 生成带有 payload: value 的 action；dispatch 将它交给 store，reducer 读取 action.payload 更新状态，其他组件再通过 useSelector 读到新值。',
    files: [
      { name: 'App.jsx', code: reduxAppCode },
      { name: 'ProgressWidgets.jsx', code: reduxWidgetsCode },
      { name: 'store.js', code: reduxStoreCode },
    ], Demo: ReduxDemo,
  },
  zustand: {
    group: 'advanced', number: '09', title: 'Zustand 状态管理', subtitle: '用小型 store 与 selector 共享 React 状态。', time: '6 min',
    lead: 'Zustand 的 create 创建可在 React 组件中使用的 store Hook。业务组件把输入值传给 store 中的 action，action 用 set 更新状态；其他组件通过 selector 只订阅需要的字段。普通全局 store 不必像 Redux 那样先包 Provider。',
    points: ['store.js 用 create 定义共享状态和 addAmount、reset 两个 action。', '组件 A 从输入框取得数字，调用 addAmount(value)；组件 B 用 selector 读取 completed 与 lastAdded。', 'set 默认浅合并顶层状态；嵌套对象更新仍要创建新对象。模块级 store 会跨组件重挂载持续存在，本示例的“重置示例”会显式调用 reset。'],
    question: 'Zustand 的 addAmount(value) 中 value 从哪里来，为什么另一个组件能读到结果？',
    answer: 'value 来自业务组件的输入框。组件调用 store 中的 addAmount(value)，action 用 set 根据旧状态生成新 completed；订阅 completed 的组件通过 selector 收到新值并重新渲染。这里不经过 Redux 的 dispatch/action.payload。',
    files: [
      { name: 'App.jsx', code: zustandAppCode },
      { name: 'ProgressWidgets.jsx', code: zustandWidgetsCode },
      { name: 'store.js', code: zustandStoreCode },
    ], Demo: ZustandDemo, resetDemo: resetProgressStore,
  },
  'react19-hooks': {
    group: 'advanced', number: '10', title: 'React 19 新 Hook 与 use API', subtitle: '表单 Action、乐观更新与 Effect 事件。', time: '9 min',
    lead: 'React 19.0 新增 useActionState、useOptimistic 与 React DOM 的 useFormStatus；React 19.2 又加入 useEffectEvent。use 是同一时期引入的资源读取 API，但不是 Hook。当前站点依赖 React 18，左侧代码仅供 React 19 对应版本使用，右侧是概念交互，不会执行这些新 API。',
    points: ['useActionState 管理 Action 结果与 pending；useFormStatus 让表单内部子组件读取父 form 的提交状态。', 'useOptimistic 先显示临时结果，完成后回归基础状态；useEffectEvent（19.2+）让 Effect 事件逻辑读取最新值。', 'use 可以读取 Promise 或 Context，官方将它归类为 API 而非 Hook；useTransition 则早在 React 18 就已存在。'],
    question: 'React 19 新增的 use 是 Hook 吗？为什么它能在条件分支中调用？',
    answer: '不是。React 官方把 use 归类为 API；它用于渲染期间读取 Promise 或 Context，和普通 Hook 的调用规则不同，可以在条件分支或循环中调用，但仍必须在组件或自定义 Hook 中使用。use(promise) 还需要稳定的 Promise，并配合 Suspense 处理等待状态。',
    files: react19Files, Demo: React19GuideDemo, previewMode: 'concept',
  },
  'virtual-list': {
    group: 'performance', number: '14', title: 'React 虚拟列表', subtitle: '只渲染屏幕附近的内容，而非整张长列表。', time: '12 min',
    lead: '虚拟列表会根据滚动位置计算可见区间，只挂载这个区间和少量缓冲项。一个与完整列表等高的占位容器保留滚动条长度，再把可见行放到正确位置。',
    points: ['固定行高时，可用 Math.floor(scrollTop / rowHeight) 求出首个可见项。', '上下增加 overscan 缓冲项，避免快速滚动时出现短暂空白。', '数据量仍然存在内存中；虚拟化主要减少 DOM 数量和渲染开销。'],
    solutions: [
      { name: 'react-window', label: '轻量组件', fit: '固定高度、已知尺寸的列表与网格', detail: 'API 简洁，适合快速实现常规窗口化。新版 List 也支持动态行高，但预知尺寸通常更高效。', url: 'https://github.com/bvaughn/react-window' },
      { name: '@tanstack/react-virtual', label: '灵活无头', fit: '自定义布局、动态高度、横向列表与表格', detail: '只提供虚拟化逻辑，样式和 DOM 由你控制；复杂表格可与 TanStack Table 配合。', url: 'https://tanstack.com/virtual/latest/docs/introduction' },
      { name: 'react-virtuoso', label: '开箱即用', fit: '高度不一的列表、网格与表格', detail: '自动处理可变高度，内置常见滚动能力；聊天专用 Message List 是另售的商业包。', url: 'https://virtuoso.dev/' },
    ],
    question: '虚拟列表为什么还需要一个完整高度的占位容器？', answer: '它维持与全部数据相同的滚动范围。否则滚动条只反映当前挂载的几行，无法定位到列表中后面的项目。',
    code: `import { useRef, useState } from 'react';\n\nconst items = Array.from({ length: 10000 }, (_, i) => ({\n  id: i + 1, label: '第 ' + (i + 1) + ' 条学习记录'\n}));\nconst rowHeight = 44;\nconst viewportHeight = 220;\nconst overscan = 3;\n\nexport default function VirtualList() {\n  const viewportRef = useRef(null);\n  const [scrollTop, setScrollTop] = useState(0);\n  const first = Math.floor(scrollTop / rowHeight);\n  const start = Math.max(0, first - overscan);\n  const end = Math.min(items.length, first +\n    Math.ceil(viewportHeight / rowHeight) + overscan + 1);\n  const visible = items.slice(start, end);\n\n  function jumpTo(index) {\n    const viewport = viewportRef.current;\n    viewport.scrollTop = (index - 1) * rowHeight;\n    setScrollTop(viewport.scrollTop);\n  }\n\n  return (\n    <>\n      <div ref={viewportRef}\n        onScroll={e => setScrollTop(e.currentTarget.scrollTop)}\n        style={{ height: viewportHeight, overflowY: 'auto' }}>\n        <div style={{ height: items.length * rowHeight,\n          position: 'relative' }}>\n          {visible.map(item => (\n            <div key={item.id} style={{ position: 'absolute',\n              top: (item.id - 1) * rowHeight, height: rowHeight }}>\n              {item.label}\n            </div>\n          ))}\n        </div>\n      </div>\n      <button onClick={() => jumpTo(5000)}>跳到第 5000 条</button>\n    </>\n  );\n}`, Demo: VirtualListDemo,
  },
  env: {
    group: 'vite', number: '15', title: '环境变量与模式', subtitle: '为不同运行环境配置不同数据。', time: '4 min',
    lead: 'Vite 会通过 import.meta.env 暴露内建环境信息，并根据运行模式加载对应的 .env 文件。客户端自定义变量需要 VITE_ 前缀。',
    points: ['import.meta.env.MODE 可读取当前模式。', 'import.meta.env.DEV 与 PROD 用于区分开发与生产。', 'VITE_ 变量会进入客户端构建产物，不能存放密钥。'],
    question: '为什么不能把 API 私钥写在 VITE_ 变量中？', answer: 'VITE_ 变量会被打包进客户端代码，任何访问页面的人都有机会读取。',
    code: `function EnvironmentInfo() {\n  return (\n    <dl>\n      <dt>MODE</dt>\n      <dd>{import.meta.env.MODE}</dd>\n      <dt>DEV</dt>\n      <dd>{String(import.meta.env.DEV)}</dd>\n      <dt>BASE_URL</dt>\n      <dd>{import.meta.env.BASE_URL}</dd>\n    </dl>\n  );\n}\n\n// 自定义客户端变量须以 VITE_ 开头。`, Demo: EnvDemo,
  },
  modules: {
    group: 'vite', number: '16', title: '动态导入与拆包', subtitle: '需要时再加载，让入口更轻。', time: '4 min',
    lead: 'import() 可以异步加载模块。Vite 在构建时会为动态导入创建独立代码块，浏览器在真正需要时再请求。',
    points: ['动态导入返回 Promise，可用 await 读取模块导出。', '适合低频功能、较大的工具模块或路由级拆包。', '加载中与失败状态也应该有清晰反馈。'],
    question: '静态 import 与动态 import() 有什么区别？', answer: '静态 import 在模块加载时就解析；动态 import() 在执行到该语句时才请求，并返回 Promise。',
    code: `// demoMessages.js\nexport const getGreeting = () => '你好，模块已按需加载！';\n\n// App.jsx\nimport { useState } from 'react';\n\nexport default function LazyMessage() {\n  const [message, setMessage] = useState('尚未加载');\n\n  async function load() {\n    const module = await import('./demoMessages.js');\n    setMessage(module.getGreeting());\n  }\n\n  return (\n    <>\n      <p>{message}</p>\n      <button onClick={load}>加载模块</button>\n    </>\n  );\n}`, Demo: ModuleDemo,
  },
}

export const topicOrder = groups.flatMap(group => group.topics)

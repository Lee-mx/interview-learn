import { useState } from 'react'
import { deepClone } from './bytePractice/deepClone.js'
import { findSubstring } from './bytePractice/findSubstring.js'
import { getPath } from './bytePractice/getPath.js'
import { runEventLoopOrder } from './bytePractice/eventLoopOrder.js'
import { runAsyncAwaitOrder } from './bytePractice/asyncAwaitOrder.js'
import { runNestedMicrotasks } from './bytePractice/nestedMicrotasks.js'
import { runPromiseRejectionChain } from './bytePractice/promiseRejectionChain.js'
import { intersectionIndices, intersectionValues } from './bytePractice/intersectionIndices.js'
import './bytePractice/centerUnknownSize.css'

function attempt(work) {
  try { return { output: work(), error: '' } }
  catch (error) { return { output: '', error: error.message } }
}

function Field({ label, value, onChange, type = 'text' }) {
  return <label className="archive-practice-field"><span>{label}</span><input type={type} value={value} onChange={event => onChange(event.target.value)} /></label>
}

function Practice({ children, output, error, hint }) {
  return <div className="archive-practice">
    <div className="archive-practice-head"><strong>动手试一试</strong><span>修改输入，观察参考实现</span></div>
    <div className="archive-practice-fields">{children}</div>
    <div className="archive-practice-output" role="status"><span>运行结果</span><pre>{error || output}</pre></div>
    {hint && <p>{hint}</p>}
  </div>
}

function EventLoopDemo() {
  const [first, setFirst] = useState('promise')
  const [lines, setLines] = useState(['点击运行，查看实际输出顺序'])
  return <Practice output={lines.map((line, index) => `${index + 1}. ${line}`).join('\n')} hint="两个微任务按入队先后执行；setTimeout 回调在后续任务中。">
    <label className="archive-practice-field"><span>先加入哪个微任务</span><select value={first} onChange={event => setFirst(event.target.value)}><option value="promise">Promise.then</option><option value="queueMicrotask">queueMicrotask</option></select></label>
    <button className="archive-practice-run" onClick={() => { setLines(['运行中…']); runEventLoopOrder(first).then(setLines) }}>运行输出题</button>
  </Practice>
}

function AsyncAwaitDemo() {
  const [first, setFirst] = useState('await')
  const [lines, setLines] = useState(['点击运行，查看实际输出顺序'])
  return <Practice output={lines.map((line, index) => `${index + 1}. ${line}`).join('\n')} hint="async 函数在第一个 await 前同步执行；await 后的续体进入微任务队列。">
    <label className="archive-practice-field"><span>先安排哪个后续任务</span><select value={first} onChange={event => setFirst(event.target.value)}><option value="await">await 续体</option><option value="promise">Promise.then</option></select></label>
    <button className="archive-practice-run" onClick={() => { setLines(['运行中…']); runAsyncAwaitOrder(first).then(setLines) }}>运行输出题</button>
  </Practice>
}

function NestedMicrotasksDemo() {
  const [mode, setMode] = useState('nested')
  const [lines, setLines] = useState(['点击运行，查看实际输出顺序'])
  return <Practice output={lines.map((line, index) => `${index + 1}. ${line}`).join('\n')} hint="微任务 3 若在微任务 1 中才入队，会排在已经入队的微任务 2 后面。">
    <label className="archive-practice-field"><span>微任务 3 何时入队</span><select value={mode} onChange={event => setMode(event.target.value)}><option value="nested">微任务 1 执行时</option><option value="direct">同步阶段直接入队</option></select></label>
    <button className="archive-practice-run" onClick={() => { setLines(['运行中…']); runNestedMicrotasks(mode).then(setLines) }}>运行输出题</button>
  </Practice>
}

function PromiseRejectionDemo() {
  const [rethrow, setRethrow] = useState(false)
  const [lines, setLines] = useState(['点击运行，查看 Promise 链的输出'])
  return <Practice output={lines.join(' → ')} hint="原题不再次抛错时只输出 2；失败回调再次 throw 后才会进入 catch，输出 2 → 3。">
    <label className="archive-practice-field"><span>then 的拒绝回调</span><select value={rethrow ? 'throw' : 'handled'} onChange={event => setRethrow(event.target.value === 'throw')}><option value="handled">正常结束（原题）</option><option value="throw">再次抛错</option></select></label>
    <button className="archive-practice-run" onClick={() => { setLines(['运行中…']); runPromiseRejectionChain(rethrow).then(setLines) }}>运行 Promise 链</button>
  </Practice>
}

function IntersectionIndicesDemo() {
  const [aText, setAText] = useState('[1,2,2,3]')
  const [bText, setBText] = useState('[2,4]')
  const [side, setSide] = useState('a')
  const result = attempt(() => {
    const a = JSON.parse(aText)
    const b = JSON.parse(bText)
    if (!Array.isArray(a) || !Array.isArray(b)) throw new Error('A 和 B 都必须是 JSON 数组')
    if (![...a, ...b].every(value => typeof value === 'number' || typeof value === 'string')) throw new Error('数组元素只能是数字或字符串')
    const source = side === 'a' ? a : b
    const other = side === 'a' ? b : a
    const indices = intersectionIndices(source, other)
    return `最终交集数组：${JSON.stringify(intersectionValues(source, other))}\n命中 ${side.toUpperCase()} 的下标：${JSON.stringify(indices)}`
  })
  return <Practice {...result} hint={'最终结果是元素数组，不是下标数组；可试试字符串数组 ["a","b","b"] 与 ["b"]。重复命中会保留。'}>
    <Field label="数组 A（JSON）" value={aText} onChange={setAText} />
    <Field label="数组 B（JSON）" value={bText} onChange={setBText} />
    <label className="archive-practice-field"><span>以哪个数组取最终数据</span><select value={side} onChange={event => setSide(event.target.value)}><option value="a">数组 A</option><option value="b">数组 B</option></select></label>
  </Practice>
}

function DeepCloneDemo() {
  const [originalName, setOriginalName] = useState('Lin')
  const [copyName, setCopyName] = useState('Ming')
  const result = attempt(() => {
    const original = { profile: { name: originalName }, created: new Date('2024-01-01'), tags: new Set(['React']) }
    original.self = original
    const copy = deepClone(original)
    copy.profile.name = copyName
    return `原对象姓名：${original.profile.name}\n副本姓名：${copy.profile.name}\n嵌套引用分离：${original.profile !== copy.profile}\n循环引用正确指向副本：${copy.self === copy}\nDate / Set 类型保留：${copy.created instanceof Date && copy.tags instanceof Set}`
  })
  return <Practice {...result} hint="函数会保留原引用；DOM、Promise、私有字段等不在这个教学实现的支持范围内。">
    <Field label="原对象姓名" value={originalName} onChange={setOriginalName} />
    <Field label="修改副本为" value={copyName} onChange={setCopyName} />
  </Practice>
}

function FindSubstringDemo() {
  const [text, setText] = useState('frontend interview')
  const [needle, setNeedle] = useState('view')
  const [from, setFrom] = useState('0')
  const result = attempt(() => `首次位置：${findSubstring(text, needle, from.trim() === '' ? NaN : Number(from))}`)
  return <Practice {...result} hint="索引从 0 开始；找不到返回 -1，空搜索串返回合法的起始位置。">
    <Field label="原字符串" value={text} onChange={setText} />
    <Field label="要查找的子串" value={needle} onChange={setNeedle} />
    <Field label="开始位置" value={from} onChange={setFrom} type="number" />
  </Practice>
}

function GetPathDemo() {
  const [source, setSource] = useState('{"user":{"profile":{"name":"Lin"}},"items":[{"title":"React"}]}')
  const [path, setPath] = useState('items[0].title')
  const result = attempt(() => {
    const value = getPath(JSON.parse(source), path, '未找到')
    return `读取值：${JSON.stringify(value)}`
  })
  return <Practice {...result} hint="仅支持点路径和数字下标；缺失属性返回默认值，值为 null 时保留 null。">
    <label className="archive-practice-field archive-practice-wide"><span>对象（JSON）</span><textarea value={source} onChange={event => setSource(event.target.value)} rows={2} /></label>
    <Field label="读取路径" value={path} onChange={setPath} />
  </Practice>
}

function CenterDemo() {
  const [content, setContent] = useState('宽高由内容决定')
  return <Practice output="不设置子元素宽高，也不使用 flex；改变内容后仍以中心点对齐。" hint="父元素 position: relative；子元素定位到 50% 后，用自身尺寸的 50% 回移。">
    <Field label="修改盒子内容" value={content} onChange={setContent} />
    <div className="byte-center-stage archive-practice-wide"><div className="byte-center-box">{content || '空内容'}</div></div>
  </Practice>
}

const demos = {
  'event-loop': EventLoopDemo,
  'async-await-order': AsyncAwaitDemo,
  'nested-microtasks': NestedMicrotasksDemo,
  'promise-rejection-chain': PromiseRejectionDemo,
  'intersection-indices': IntersectionIndicesDemo,
  'deep-clone': DeepCloneDemo,
  'find-substring': FindSubstringDemo,
  'get-path': GetPathDemo,
  'css-center': CenterDemo,
}

export default function ByteSocialDemo({ id }) {
  const Demo = demos[id]
  return Demo ? <Demo /> : null
}

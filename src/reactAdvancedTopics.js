import RefDemo from './advancedDemos/RefDemo.jsx'
import refCode from './advancedDemos/RefDemo.jsx?raw'
import ReducerDemo from './advancedDemos/ReducerDemo.jsx'
import reducerCode from './advancedDemos/ReducerDemo.jsx?raw'
import CustomHookDemo from './advancedDemos/CustomHookDemo.jsx'
import hookCode from './advancedDemos/CustomHookDemo.jsx?raw'
import PortalDemo from './advancedDemos/PortalDemo.jsx'
import portalCode from './advancedDemos/PortalDemo.jsx?raw'
import BoundaryDemo from './advancedDemos/BoundaryDemo.jsx'
import boundaryCode from './advancedDemos/BoundaryDemo.jsx?raw'
import SuspenseDemo from './advancedDemos/SuspenseDemo.jsx'
import suspenseCode from './advancedDemos/SuspenseDemo.jsx?raw'
import lazyCode from './advancedDemos/LazyCard.jsx?raw'
import './advancedDemos/advancedDemos.css'

export const reactAdvancedTopics = {
  ref: { title: 'useRef 与 DOM 操作', subtitle: '保存跨渲染引用，区分数据与界面状态。', time: '6 min',
    lead: 'useRef 返回在多次渲染之间保持身份的对象。修改 current 不会触发渲染，适合 DOM 节点、计时器 ID 或无需显示的可变数据；会影响界面的值通常应放进 State。',
    points: ['事件处理函数中可读写 ref；不要随意在渲染期间读写 current。', 'DOM ref 通常在提交阶段赋值，卸载时清空，读取前检查 null。', 'React 18 向自定义组件传 ref 需 forwardRef；可结合 useImperativeHandle 暴露少量命令式能力。'],
    question: 'ref 和 state 如何选择？', answer: '是否需要改变界面是重要判断依据。计时器 ID 可以用 ref 保存；输入值和展示计数应该使用 State。ref 是可变引用，不是自动触发更新的替代品。', code: refCode, Demo: RefDemo, reference: 'https://react.dev/reference/react/useRef',
    followups: [
      ['为什么点击修改 ref 后，页面没有变？', 'React 不追踪 current 的赋值。只有其他状态或属性导致再次渲染时，渲染逻辑才会重新执行；示例显式读取 ref 并写入 State。'],
      ['useImperativeHandle 有什么用途？', '让父组件只得到 focus、scrollTo 等必要方法，而不是依赖子组件内部全部 DOM 结构。React 18 通常与 forwardRef 配合；能用 props 表达的行为优先用 props。'],
    ] },
  reducer: { title: 'useReducer 与状态建模', subtitle: '把分散的更新收拢为可解释的动作。', time: '7 min',
    lead: '当多个字段需要协调变化，或交互包含撤销、重置等动作时，可以用 reducer 集中描述状态转换。业务组件 dispatch 动作，纯函数根据旧状态和动作计算下一状态。',
    points: ['reducer 必须保持纯净，返回新对象；请求、计时器等副作用放在事件或 Effect 中。', 'dispatch 后当前函数里的 state 仍是本次渲染的快照。', 'useReducer 管理组件状态；与 Context 配合可跨层传递，但不等于完整的 Redux 工具链。'],
    question: 'useReducer 一定比 useState 更好吗？', answer: '不一定。简单独立字段用 useState 更直接；关联字段多、动作明确、转换规则复杂时，reducer 更便于测试和复用。它主要改善组织方式，不会自动减少渲染。', code: reducerCode, Demo: ReducerDemo, reference: 'https://react.dev/reference/react/useReducer',
    followups: [
      ['为什么直接修改 state 再返回它可能不更新？', '同一个对象引用可能被 React 的 Object.is 比较判定为未改变，而且会破坏历史快照。应创建新的对象和需要变化的嵌套结构。'],
      ['reducer 里能否发请求？', '不应该。reducer 应是确定的纯计算。先在事件中发请求，再派发 success / error 等动作；复杂异步流程还要处理过期响应和取消。'],
    ] },
  'custom-hooks': { title: '自定义 Hook 与逻辑复用', subtitle: '提取状态逻辑，不是创建隐式全局状态。', time: '7 min',
    lead: '自定义 Hook 把状态、Effect 和清理组合成可复用能力。以 use 开头，仍遵守 Hook 调用规则。多个组件调用同一个 Hook，默认各自拥有状态；共享数据需要另行设计 store 或 Context。',
    points: ['围绕具体能力命名，如 useDebouncedValue，而非掩盖依赖的 useMount。', '对外暴露最小接口，把依赖与清理完整封装。', '防抖只延迟值或触发时机，不自动取消已发送的请求；请求还需处理竞态。'],
    question: '两个组件调用同一个 Hook，会共享里面的 useState 吗？', answer: '不会。Hook 复用的是逻辑，每次调用的状态属于对应组件。示例中两个搜索框有独立的值和计时器。', code: hookCode, Demo: CustomHookDemo, reference: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
    followups: [
      ['防抖 Hook 为什么要清理定时器？', '输入变化时取消旧计时器，确保只有最后一次更新生效；卸载时也应取消，避免残留任务。delay 本身是依赖，改变时同样需要重建。'],
      ['封装请求 Hook 时还要考虑什么？', '包括 loading / error、AbortController、过期响应、缓存与重新验证。不要只把 fetch 包进 Effect 就声称解决了服务端状态管理。'],
    ] },
  portal: { title: 'Portal 与弹窗交互', subtitle: '改变挂载位置，保留 React 组件关系。', time: '6 min',
    lead: 'createPortal 可以把内容渲染到另一个 DOM 容器，常用于弹窗和浮层。它只改变 DOM 放置位置，Context 和 React 事件传播仍按 React 树关联。',
    points: ['Portal 可避开某些祖先 overflow 裁剪，但并不自动解决所有层叠问题。', '弹窗还需处理焦点、键盘、背景交互和关闭后的焦点恢复。', '此示例把原生 dialog Portal 到 body，通过 showModal 提供模态行为。'],
    question: 'Portal 内点击为什么会触发 React 父组件的事件？', answer: 'React 合成事件沿 React 组件树传播，而不是仅由实际 DOM 父子关系决定。不希望冒泡时可以 stopPropagation，或调整 Portal 在 React 树中的位置。', code: portalCode, Demo: PortalDemo, reference: 'https://react.dev/reference/react-dom/createPortal',
    followups: [
      ['Portal 是否会丢失 Context？', '不会。Portal 的内容仍属于原来的 React 子树，能读取该树上方的 Provider。'],
      ['为什么 z-index 很大也可能被遮挡？', '祖先形成的层叠上下文限制了层级比较。应检查定位、transform、opacity、overflow 等条件；原生模态 dialog 进入 top layer，机制又与普通 z-index 不同。'],
    ] },
  'error-boundary': { title: '错误边界与局部降级', subtitle: '让一个区域的渲染错误不拖垮整页。', time: '7 min',
    lead: '错误边界捕获后代组件渲染等生命周期中的错误，并展示替代界面。React 18 内置边界通常用 class 的 getDerivedStateFromError 与 componentDidCatch 实现；普通 try/catch 不能包住后代将来的渲染。',
    points: ['getDerivedStateFromError 用于降级状态；componentDidCatch 可用于错误上报。', '边界不捕获自身错误、普通事件回调或定时器内的异步错误；这些需要单独处理。', '重试前先修复失败条件，再重置边界；仅隐藏错误提示可能立刻再次失败。'],
    question: '按钮事件里的 throw 会被错误边界接住吗？', answer: '普通事件处理函数中的 throw 不会。本示例按钮只更新 broken，真正的 throw 发生在后代组件下一次渲染，所以能被边界捕获。', code: boundaryCode, Demo: BoundaryDemo, reference: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',
    followups: [
      ['错误边界应该放在哪里？', '按用户可独立恢复的区域布置，如路由、仪表盘卡片、编辑器区域；既避免全站只有一个兜底，也避免每个小元素都包边界。'],
      ['边界是否会自动重试失败的网络请求？', '不会。请求异常需显式管理，重试策略、取消和幂等性属于请求层。错误边界也不能代替接口错误提示。'],
    ] },
  suspense: { title: 'lazy、Suspense 与加载边界', subtitle: '把按需加载的等待状态放在合适的位置。', time: '7 min',
    lead: 'React.lazy 把动态 import 返回的模块变成组件，Suspense 在子树等待受支持的资源时显示 fallback。它们适合低频面板或路由模块的延迟加载，等待和错误要分别设计。',
    points: ['lazy 声明在组件外，加载函数应返回带 default 组件导出的模块。', '普通 useEffect 中的 fetch 不会自动被 Suspense 感知。', 'lazy 缓存加载结果；首次加载需要 fallback，加载失败交给错误边界。'],
    question: 'Suspense 和错误边界能互相替代吗？', answer: '不能。Suspense 负责受支持资源的等待状态，错误边界负责渲染错误及 lazy 加载失败等情况。实际业务经常需要同时设计两种边界。',
    files: [{ name: 'SuspenseDemo.jsx', code: suspenseCode }, { name: 'LazyCard.jsx', code: lazyCode }], Demo: SuspenseDemo, reference: 'https://react.dev/reference/react/Suspense',
    followups: [
      ['为什么不能在组件函数里声明 lazy？', '每次渲染都可能创建新的组件类型，导致状态重置和重复加载逻辑。稳定的 lazy 声明应该放在模块作用域。'],
      ['边界包得越大越好吗？', '不是。过大的边界会让已经可用的区域一起变成 fallback，应按用户期望一起显示的内容分组；嵌套边界可逐步揭示内容。'],
    ] },
}
for (const topic of Object.values(reactAdvancedTopics)) topic.group = 'advanced'

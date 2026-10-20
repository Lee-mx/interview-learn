// 每节原有的 question / answer 是第 1 题；这里补充第 2、3 题。
export const interviewQuestions = {
  components: [
    {
      question: 'JSX 为什么通常需要一个根节点？',
      answer: '组件需要返回一个 JSX 值。多个并列元素可包在父元素中，或使用 Fragment（<>...</>）组合，后者不会额外增加 DOM 节点。',
    },
    {
      question: 'onClick={handleClick} 和 onClick={handleClick()} 有什么区别？',
      answer: '前者把函数交给 React，在点击时调用；后者会在渲染时立即调用函数，并把其返回值作为事件处理器。',
    },
  ],
  props: [
    {
      question: '子组件可以直接修改收到的 props 吗？',
      answer: '不应该。Props 是只读输入；需要改变它时，应由拥有该数据的父组件更新状态，再把新值传下来。',
    },
    {
      question: 'children 这个 prop 适合用来做什么？',
      answer: '用于传入组件标签之间的嵌套内容，例如通用卡片、弹窗或布局容器，让外壳组件不必预先知道具体内容。',
    },
  ],
  state: [
    {
      question: '调用 setCount 后，为什么当前函数里读到的 count 仍是旧值？',
      answer: '每次渲染中的 state 是一份快照。setter 会安排下一次渲染，不会改写当前事件处理函数已经拿到的值。',
    },
    {
      question: '更新 state 中的对象或数组时，为什么要创建新值？',
      answer: 'React 通过新旧值比较判断是否需要更新。直接修改原对象会保留相同引用，也容易破坏之前渲染的快照；应复制后更新。',
    },
  ],
  conditional: [
    {
      question: '什么时候用三元表达式，什么时候用 &&？',
      answer: '需要在两种内容中二选一时用三元表达式；只在条件为真时显示一块内容可用 &&，但要注意数字 0 会被渲染。',
    },
    {
      question: '组件返回 null 表示什么？',
      answer: '这次渲染不输出任何界面节点。组件函数仍会执行，因此 Hook 仍需按固定顺序在顶层调用。',
    },
  ],
  lists: [
    {
      question: 'key 的作用范围是什么？子组件能通过 props.key 读取它吗？',
      answer: 'key 只需在同一层兄弟元素中唯一，用于帮助 React 匹配列表项。它不会作为普通 prop 传给子组件；需要 ID 时应另传一个 prop。',
    },
    {
      question: '为什么不建议在渲染时用 Math.random() 生成 key？',
      answer: '每次渲染都会得到不同的 key，React 会把旧项卸载并重新挂载，导致输入状态丢失，也增加不必要的 DOM 工作。',
    },
  ],
  effect: [
    {
      question: 'useEffect 不传依赖数组与传 [] 有什么区别？',
      answer: '不传依赖数组时，每次提交后都会重新执行 Effect；传 [] 时只在挂载后建立，并在卸载时清理。开发环境的 Strict Mode 还会额外执行一次建立与清理检查。',
    },
    {
      question: '为什么开发环境里 Effect 看起来执行了两次？',
      answer: '启用 Strict Mode 时，React 会额外做一次 setup → cleanup → setup，以检查清理逻辑是否完整。这是开发期行为，不应靠移除依赖来规避。',
    },
  ],
  memo: [
    {
      question: 'useMemo 与 React.memo 分别缓存什么？',
      answer: 'useMemo 缓存一次计算的结果；React.memo 在 props 未变化时可以跳过组件重新渲染。两者都是性能优化手段。',
    },
    {
      question: '每个计算都需要包一层 useMemo 吗？',
      answer: '不需要。缓存本身也有成本。先保持代码清晰，只有计算昂贵或稳定引用确实有帮助时，再通过测量决定是否使用。',
    },
  ],
  callback: [
    {
      question: 'useCallback 和 useMemo 分别缓存什么？',
      answer: 'useCallback(fn, deps) 缓存函数引用，useMemo(() => compute(), deps) 缓存计算结果。两者都依赖正确的依赖数组，也都应服务于具体的性能问题，而非无条件使用。',
    },
    {
      question: '为什么把依赖数组写成 [] 可能让回调读到旧 state？',
      answer: '回调会保留创建时闭包中的值。若内部直接读取 count，却把依赖写成 []，后续 count 更新后仍可能读取旧值；应把 count 加入依赖，或在只需基于旧值更新时使用 setCount(current => current + 1)。',
    },
    {
      question: '怎么判断 useCallback 值不值得加？',
      answer: '先用 Profiler 或实际交互定位昂贵的重复渲染，再确认函数引用变化确实让 memo 子组件或依赖该函数的逻辑重复工作。若子组件很轻、没有 memo，或其他 props 每次都变，缓存回调可能没有收益，反而增加理解成本。',
    },
  ],
  transition: [
    {
      question: 'startTransition(() => setQuery(value)) 会延迟执行回调吗？',
      answer: '不会。回调会立即执行，React 把其中同步安排的状态更新标记为非紧急，让渲染可以被输入等紧急更新打断。它不是 setTimeout，也不负责防抖。',
    },
    {
      question: 'useTransition 和 useDeferredValue 该怎么选？',
      answer: '能控制某次状态更新的 setter 时，可用 startTransition 标记它；如果只拿到变化的 prop 或 Hook 返回值，无法控制更新来源，可以用 useDeferredValue 让消费这个值的部分稍后渲染。两者都不负责减少请求次数。',
    },
    {
      question: '异步请求完成后的 setState 会自动属于之前的 Transition 吗？',
      answer: '不会自动属于。在 React 18 中，await 之后的更新需要再用 startTransition 包一层；请求竞态、取消和错误处理也仍需另外设计。',
    },
  ],
  context: [
    {
      question: 'Provider 的 value 改变后，哪些组件会更新？',
      answer: '读取该 Context 的后代组件会收到新值并重新渲染；即使组件使用 React.memo，也不能阻止它响应自己读取的 Context 变化。',
    },
    {
      question: 'createContext 的默认值什么时候会用到？',
      answer: '只有组件上方没有匹配的 Provider 时，useContext 才会读取默认值；Provider 显式传入 undefined 不会退回默认值。',
    },
  ],
  redux: [
    {
      question: 'Redux Toolkit 的 reducer 里为什么可以写 state.completed += 1？',
      answer: 'createSlice 内部使用 Immer 处理这种写法：开发者看起来在修改草稿，最终仍会生成符合 Redux 不可变更新要求的新状态。不要在普通 reducer 中直接修改原状态。',
    },
    {
      question: 'Redux、Context 和 useState 应该如何选择？',
      answer: '组件自己的临时状态优先用 useState。Context 适合向后代传递主题、语言等值；当共享状态有较复杂的更新规则、涉及多个页面或需要集中追踪 action 时，Redux 更有价值。Context 本身不提供 Redux 的 reducer、开发工具和更新约定。',
    },
  ],
  zustand: [
    {
      question: '给一个新项目做状态管理选型：什么时候用 Zustand，什么时候用 Redux Toolkit？',
      answer: '先判断是否真的需要全局客户端状态：只在单个组件使用的输入值优先 useState；远端数据的缓存与失效应单独考虑。若多个组件共享购物车、筛选条件或编辑草稿，更新规则较直接，希望少量代码快速组织 store 和 selector，可选 Zustand。若状态领域多、更新链路复杂、多人协作，需要统一的 action/reducer 约定、可追踪的状态变化和成熟的调试/异步数据工具，可选 Redux Toolkit。已有项目也要考虑团队熟悉度和迁移成本，不因“代码更少”就强行改库。',
    },
    {
      question: 'Zustand 与 Redux Toolkit 在更新流程上有什么不同？',
      answer: 'Zustand 常把状态和 action 放在 create 的 store 中，由 action 调用 set；Redux Toolkit 用 slice 定义 reducer 与 action creator，组件 dispatch(action) 后由 reducer 处理。两者都能共享状态，选型要看团队约定、状态复杂度和调试需求。',
    },
    {
      question: '为什么 Zustand 中的 set({ profile: { name } }) 可能丢失 profile 的其他字段？',
      answer: 'set 默认只浅合并顶层对象，不会深合并 profile。更新嵌套字段时要从旧状态展开该层，例如 set(state => ({ profile: { ...state.profile, name } }))。',
    },
    {
      question: '页面“重置示例”只重挂载 React 组件，模块级 Zustand store 为什么没有自动归零？',
      answer: 'store 创建在模块作用域，不属于该组件实例。组件卸载/重挂载不会销毁它；应显式调用 reset action，或在需要隔离实例时创建按 Provider 作用域管理的 store。',
    },
  ],
  'virtual-list': [
    {
      question: 'overscan 缓冲项越多越好吗？',
      answer: '不是。缓冲项多能降低快速滚动时的空白风险，但会增加同时挂载的 DOM 数量；应根据行复杂度和滚动体验平衡。',
    },
    {
      question: '如果列表项高度不固定，固定行高算法会遇到什么问题？',
      answer: '无法再用索引 × 行高准确定位。通常需要测量实际高度、维护累计偏移量，或使用支持动态高度的虚拟列表方案。',
    },
    {
      question: 'react-window、TanStack Virtual 和 react-virtuoso 如何选？',
      answer: '常规固定或已知尺寸列表可先看 react-window；需要高度自定义、横向或复杂表格时看 TanStack Virtual；希望少配置地处理可变高度列表时看 react-virtuoso。聊天专用 Virtuoso Message List 是独立商业包。',
    },
    {
      question: 'react-window 的 List 最少需要哪些关键参数？v1 示例为何可能不能直接照搬？',
      answer: '当前 v2 List 主要传入 rowComponent、rowCount、rowHeight 和 rowProps，并用 style 给出视口高度。网上常见的 FixedSizeList、itemCount、itemSize 是 v1 写法；面试时先说明版本，避免把两套 API 混用。',
    },
    {
      question: 'TanStack Virtual 为什么还要自己写滚动容器和行的定位样式？',
      answer: '它是无头虚拟化工具，useVirtualizer 负责计算可见项、偏移量和总高度，不规定 DOM 结构。开发者用 getTotalSize 创建滚动空间，用 getVirtualItems 返回的 start 定位行，因此能适配列表、表格和横向布局。',
    },
    {
      question: 'TanStack Virtual 的动态行高如何处理？',
      answer: '先用 estimateSize 给出估计值；把 data-index 和 ref={virtualizer.measureElement} 放在实际行元素上，库测量真实高度后修正偏移。估计值偏差太大时，远距离跳转可能需要进一步校正。',
    },
    {
      question: 'react-virtuoso 为什么能少写很多代码？如何跳到指定项？',
      answer: 'Virtuoso 自带滚动容器并自动跟踪内容高度，通常提供 totalCount、itemContent 和容器高度即可。通过组件 ref 调用 scrollToIndex({ index, align }) 可定位；面对高度未知的远距离项，定位可能随着后续测量微调。',
    },
  ],
  env: [
    {
      question: 'import.meta.env.MODE 与 import.meta.env.DEV 是同一个概念吗？',
      answer: '不是。MODE 是当前模式名称；DEV 表示当前构建是否处于开发环境。自定义模式名称与开发或生产环境可以分别配置。',
    },
    {
      question: '修改 .env 文件后，为什么开发页面可能没有更新？',
      answer: 'Vite 在启动时加载环境变量。修改 .env 文件后通常需要重启开发服务器，再读取新的值。',
    },
  ],
  modules: [
    {
      question: 'import() 返回什么，加载失败该怎么处理？',
      answer: '它返回 Promise，成功后得到模块命名空间对象；网络或加载错误会使 Promise 拒绝，应使用 try/catch 提供失败反馈。',
    },
    {
      question: '动态导入一定会让页面更快吗？',
      answer: '不一定。它能减小入口代码，但会增加使用该功能时的请求与等待。适合低频或较大的功能，是否有效应结合实际加载指标判断。',
    },
  ],
}

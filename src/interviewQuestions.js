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

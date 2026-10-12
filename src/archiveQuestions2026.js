// 根据用户提供的 JS、React 和 AI 岗位资料选题；答案以可核对的官方资料为准。
const q = (category, id, level, title, brief, answer, followUp, refs, example) => ({
  category, id, level, title, brief, answer, followUp, refs, ...(example ? { example } : {}),
})

export const latestReferences = {
  jsExecution: { label: 'MDN · JavaScript 执行模型', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model' },
  jsLexical: { label: 'MDN · 词法语法与声明', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types' },
  jsTimers: { label: 'MDN · 定时器', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout' },
  jsCloneAlgorithm: { label: 'MDN · 结构化克隆算法', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm' },
  react18Release: { label: 'React · React 18 发布说明', url: 'https://react.dev/blog/2022/03/29/react-v18' },
  react19Release: { label: 'React · React 19 发布说明', url: 'https://react.dev/blog/2024/12/05/react-19' },
  reactDeferred: { label: 'React · useDeferredValue', url: 'https://react.dev/reference/react/useDeferredValue' },
  reactId: { label: 'React · useId', url: 'https://react.dev/reference/react/useId' },
  reactExternalStore: { label: 'React · useSyncExternalStore', url: 'https://react.dev/reference/react/useSyncExternalStore' },
  reactInsertion: { label: 'React · useInsertionEffect', url: 'https://react.dev/reference/react/useInsertionEffect' },
  reactActionState: { label: 'React · useActionState', url: 'https://react.dev/reference/react/useActionState' },
  reactFormStatus: { label: 'React DOM · useFormStatus', url: 'https://react.dev/reference/react-dom/hooks/useFormStatus' },
  reactOptimistic: { label: 'React · useOptimistic', url: 'https://react.dev/reference/react/useOptimistic' },
  reactUse: { label: 'React · use API', url: 'https://react.dev/reference/react/use' },
  reactHooksRules: { label: 'React · Hooks 规则', url: 'https://react.dev/reference/rules/rules-of-hooks' },
  reactImperative: { label: 'React · useImperativeHandle', url: 'https://react.dev/reference/react/useImperativeHandle' },
  aiSse: { label: 'MDN · Server-sent events', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events' },
  aiWebSocket: { label: 'MDN · WebSocket API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
  aiStreams: { label: 'MDN · Streams API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams' },
}

export const latestQuestions = [
  q('javascript', 'js-execution-context-2026', '基础', '一段 JavaScript 代码从加载到执行，调用栈、执行上下文和任务队列如何配合？',
    '先区分同步调用栈与宿主环境提供的异步回调，再解释声明提升和暂时性死区。', [
      '每次执行脚本或调用函数都会形成相应的执行上下文；函数调用压入调用栈，返回时出栈。同步代码沿调用栈执行，JavaScript 不会在同一个调用栈中“同时跑”两个回调。',
      '声明的绑定先于逐行执行建立：函数声明可提前调用，var 绑定在初始化前为 undefined；let/const 在初始化前处于暂时性死区。不要把“提升”误解为源码被真的搬动。',
      '浏览器定时器、网络和事件由宿主环境管理；回调准备好后排入相应任务队列，待当前栈清空、微任务检查点完成后再由事件循环调度。',
    ], 'async/await 后半段为什么不会在 await 前的同步代码之前执行？', ['jsExecution', 'jsLexical', 'eventLoop']),

  q('javascript', 'js-event-loop-trace-2026', '进阶', 'Promise 构造器、then、queueMicrotask、setTimeout 混在一起，怎样推导输出顺序？',
    'Promise 执行器同步；then/queueMicrotask 入微任务队列；定时器回调进入后续任务。', [
      '先写出同步输出：Promise 构造器的执行器立即运行，只有 then 回调异步排队。同步代码结束后，按入队顺序执行微任务；微任务内新加入的微任务也会在本次检查点继续处理。',
      'setTimeout(fn, 0) 并非立刻执行，它要等定时器到期、当前任务及微任务处理完，再等待事件循环选中它。不要假定不同类型任务源之间存在统一的严格全局顺序。',
    ], '若第一个 then 内又 queueMicrotask，它与已经排队的第二个 then 谁先执行？', ['eventLoop', 'microtasks', 'jsTimers'],
    'console.log("A");\nsetTimeout(() => console.log("E"), 0);\nnew Promise(resolve => { console.log("B"); resolve(); })\n  .then(() => { console.log("D"); queueMicrotask(() => console.log("F")); });\nqueueMicrotask(() => console.log("C"));\n// A B D C F E'),

  q('javascript', 'js-debounce-handwrite-2026', '手写', '如何手写防抖？搜索输入联想为什么常用它？',
    '连续触发时重置计时器，只在停止触发一段时间后执行最后一次。', [
      '尾触发防抖每次调用都清掉旧定时器，再为当前参数启动新的定时器。搜索联想常用它减少请求次数，但仍要处理旧请求的取消或乱序返回。',
      '面试要先声明边界：下面是尾触发版，保留调用时的 this 和最后一组参数；如需立即触发、取消、flush、返回值或异步结果，需要另行设计。卸载组件时也应清理计时器。',
    ], '如果请求 A 比请求 B 更晚返回，光靠防抖能保证界面显示 B 吗？', ['jsTimers', 'abortController'],
    'function debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = undefined;\n      fn.apply(this, args);\n    }, delay);\n  };\n}'),

  q('javascript', 'js-throttle-handwrite-2026', '手写', '如何手写节流？它和防抖在滚动场景中有什么不同？',
    '节流限制执行频率；防抖等待触发停止，需求不同，不能互相替代。', [
      '下面给出固定时间窗口的“首次立即执行”节流：窗口内重复触发会被忽略，窗口结束后下一次触发才能执行。适合滚动进度、拖拽等持续反馈；若要最后一次事件也执行，应补尾触发逻辑。',
      '高频视觉更新也可以结合 requestAnimationFrame 与被动滚动监听；节流只能减少回调频率，不自动解决回调本身过重的问题。',
    ], '若用户在窗口结束前停止触发，下例会执行最后一次参数吗？怎样补尾触发？', ['jsTimers', 'perfRaf'],
    'function throttle(fn, wait) {\n  let nextAllowed = 0;\n  return function (...args) {\n    const now = Date.now();\n    if (now < nextAllowed) return;\n    nextAllowed = now + wait;\n    return fn.apply(this, args);\n  };\n}'),

  q('javascript', 'js-deep-clone-handwrite-2026', '手写', '浅拷贝和深拷贝有什么区别？怎样手写支持循环引用的深拷贝？',
    '先定义支持范围，再用 WeakMap 记录已经克隆的对象；不要声称一个短函数能复制所有 JS 值。', [
      '展开运算符、Object.assign 和数组 slice 只复制第一层；嵌套对象仍共享引用。structuredClone 能处理许多内建可克隆类型和循环引用，但函数、DOM 节点等不能直接克隆，原型/访问器等语义也不一定保留。JSON 序列化会丢失 undefined、函数等值，且不能处理循环引用。',
      '下面的面试版只处理普通对象、数组及循环引用。WeakMap 在递归前先记录“原对象 → 新对象”，避免循环递归；共享的子对象在结果中仍共享同一个副本。Date、Map、Set、类实例、Symbol 键、属性描述符等要按需求显式扩展。',
    ], 'a.self = a 时为什么要先写入 WeakMap 再递归属性？', ['structuredClone', 'jsCloneAlgorithm', 'jsWeakMap'],
    'function deepClone(value, seen = new WeakMap()) {\n  if (value === null || typeof value !== "object") return value;\n  if (seen.has(value)) return seen.get(value);\n  const copy = Array.isArray(value) ? [] : {};\n  seen.set(value, copy);\n  for (const key of Object.keys(value)) {\n    copy[key] = deepClone(value[key], seen);\n  }\n  return copy;\n}\nconst source = { nested: { count: 1 } };\nsource.self = source;\nconst result = deepClone(source);\n// result !== source; result.self === result'),

  q('react', 'react18-batching-2026', '进阶', 'React 18 的自动批处理扩大到哪些场景？何时需要 flushSync？',
    'React 18 使用 createRoot 时，Promise、定时器和原生事件中的更新也能自动批处理。', [
      'React 18 在 createRoot 下通常会把同一次回调里的多个状态更新合并提交，包括 Promise、setTimeout 和原生事件回调；旧版根节点不完全具备这些新行为。更新仍是状态快照，不应在 setState 后立刻读取旧闭包变量来判断新值。',
      '只有与必须立即更新 DOM 的第三方接口集成等少数情况才考虑 flushSync；它会强制同步提交，可能伤害性能。不要把自动批处理误说成所有异步时刻的更新都会跨回调合并。',
    ], '如何在同一回调中正确连续加两次计数？', ['react18Release', 'reactBatching']),

  q('react', 'react18-deferred-2026', '进阶', 'useDeferredValue 与 useTransition、输入防抖分别解决什么问题？',
    '前两者调整渲染优先级，防抖减少某段逻辑的触发次数。', [
      'useDeferredValue 返回一个允许暂时落后于原值的版本，使输入保持及时、昂贵的结果区域稍后更新；useTransition 则用于把某次状态更新标记为非紧急。二者都不能把重计算移出主线程。',
      '防抖要等安静窗口后才触发逻辑，常用于减少请求；useDeferredValue 没有固定延迟，也不会单独减少每次输入引发的网络请求。输入联想可能同时使用防抖控请求、延迟值控渲染。',
    ], '列表渲染仍然很慢时，除 Transition 外还应考虑什么？', ['reactDeferred', 'reactTransition', 'virtualization']),

  q('react', 'react18-id-2026', '基础', 'React 18 的 useId 适合生成什么？为什么不能拿它当列表 key？',
    '它为可访问性关联生成稳定 ID，不是业务实体身份或列表 key。', [
      'useId 可让 label 与 input、帮助文本与 aria-describedby 等 ID 关联在客户端和服务端渲染时保持一致；同一组件调用多次可得到不同 ID。',
      '列表 key 应来自数据本身的稳定身份，例如数据库 ID。useId 的调用位置和组件树相关，不能替代数据键，也不应用来生成数据库主键。',
    ], '服务器渲染与客户端 hydration 对 ID 一致性有什么要求？', ['reactId', 'reactKeys', 'react18Release']),

  q('react', 'react18-external-store-2026', '进阶', 'useSyncExternalStore 为什么存在？自己封装浏览器外部状态时怎么用？',
    '统一订阅与快照读取，避免并发渲染时读取外部可变状态不一致。', [
      '它接收 subscribe 和 getSnapshot，可选 getServerSnapshot。subscribe 负责订阅变化并返回取消订阅函数；getSnapshot 必须在外部状态没变时返回同一个值，不能每次临时生成新对象。',
      '适合封装浏览器在线状态、外部 store 等由 React 外部维护的状态。服务端渲染时应提供一致的服务端快照；组件内部普通状态优先用 useState/useReducer。',
    ], 'getSnapshot 每次都返回 {...store} 会导致什么问题？', ['reactExternalStore', 'react18Release']),

  q('react', 'react18-insertion-2026', '进阶', 'useInsertionEffect 是给普通业务组件用的吗？',
    '主要是 CSS-in-JS 库在布局 Effect 前插入样式的特殊扩展点。', [
      'React 18 加入 useInsertionEffect，面向需要在布局效果运行前插入动态样式的库作者。它不适合替代 useEffect 做请求，也不适合替代 useLayoutEffect 做 DOM 测量。',
      '面试更重要的是知道选型边界：业务副作用通常 useEffect，需要在浏览器绘制前测量或同步调整布局才考虑 useLayoutEffect，样式库的底层注入才考虑 useInsertionEffect。',
    ], '如果在 useInsertionEffect 里读取 ref 或更新 state，会有哪些限制？', ['reactInsertion', 'reactLayout', 'react18Release']),

  q('react', 'react19-action-state-2026', '进阶', 'React 19 的 useActionState 如何管理表单提交结果和 pending？',
    'Action 返回新状态，Hook 给出当前状态、Action 包装函数和等待状态。', [
      'useActionState(action, initialState) 返回 [state, formAction, isPending]。把 formAction 交给表单 action，action 的第一个参数是前一状态，之后才是 FormData；它可以返回下一状态或异步结果。',
      '适合把提交反馈、校验错误和 pending 放在同一个交互链路中。服务端仍必须做鉴权、校验和幂等处理；前端 Hook 不替代后端约束。本项目当前运行 React 18，本题为 React 19 面试知识，不应直接复制到当前 Demo。',
    ], '为什么 action(state, formData) 的参数顺序与普通表单 action(formData) 不同？', ['reactActionState', 'react19Release']),

  q('react', 'react19-form-status-2026', '进阶', 'useFormStatus 为什么在表单外层调用拿不到当前提交状态？',
    '它读取最近的父级 form 状态，必须放在 form 的后代组件中。', [
      'React DOM 的 useFormStatus 返回 pending、data、method、action 等提交信息。常见做法是把提交按钮抽成子组件，在 form 内渲染，再由按钮调用 useFormStatus() 显示“提交中”或禁用按钮。',
      '调用 Hook 的组件若恰好渲染那个 form，本身不在该 form 的后代上下文里；多个表单也只读取最近父级的提交状态。React 19 面试题，当前仓库 React 18 不能直接运行。',
    ], '页面上两个表单分别提交，子按钮怎样确定自己读的是哪个 form？', ['reactFormStatus', 'react19Release']),

  q('react', 'react19-optimistic-2026', '进阶', 'useOptimistic 怎样做“先显示成功，失败再回退”？',
    '临时乐观状态依附异步 Action；成功以服务端结果落库，失败由基础状态恢复并反馈错误。', [
      'useOptimistic(baseState, updateFn) 返回 optimisticState 和 addOptimistic。提交期间先追加乐观消息或点赞，让 UI 立即响应；Action 完成后以实际数据更新基础状态。',
      '不要把乐观结果当作已经持久化。为临时项设置可追踪 ID，处理重复提交、服务端拒绝、乱序响应及错误提示。React 19 面试题；本项目 React 18 的页面只能阅读题目，不能直接运行该 Hook。',
    ], '两个乐观请求先后提交却逆序返回，怎样避免旧结果覆盖新结果？', ['reactOptimistic', 'react19Release']),

  q('react', 'react19-use-api-2026', '进阶', 'React 19 的 use 与普通 Hook 有什么相同和不同？',
    'use 能读取 Promise 或 Context；它是 API，可以在条件和循环中调用，但仍须处于组件或自定义 Hook 内。', [
      'use(promise) 会在 Promise 等待时触发最近的 Suspense fallback，拒绝时由 Error Boundary 处理；use(context) 读取最近的 Provider。与普通 Hook 不同，use 可以放在条件分支或循环中，但不能放进事件处理器或 try/catch 来接 Promise 的拒绝。',
      '渲染时不要每次都新建 Promise 导致反复挂起，通常让框架或上层缓存数据并传入稳定 Promise。React 19 面试题，本项目依赖 React 18。',
    ], '为什么在事件处理器里调用 use(fetch(...)) 不符合它的使用方式？', ['reactUse', 'reactSuspense', 'react19Release']),

  q('react', 'react-hooks-boundaries-2026', '基础', '自定义 Hook 如何复用逻辑？useRef 与 useImperativeHandle 分别适合什么？',
    '自定义 Hook 复用状态逻辑，ref 保存不参与渲染的数据，Imperative Handle 只暴露必要的命令接口。', [
      '自定义 Hook 是调用其他 Hook 的函数，命名以 use 开头，并遵守普通 Hook 的顶层调用规则。它复用逻辑，不让多个组件自动共享同一份状态；共享状态还需要提升状态、Context 或外部 store。',
      'useRef 的 current 可跨渲染保存定时器、DOM 等，但修改 current 不触发重渲染。useImperativeHandle 可约束父组件经 ref 能调用的命令，如 focus；一般优先用声明式 props，避免把整个子组件内部实现暴露出去。',
    ], '为什么不能在 if 分支里调用 useState，却能在条件分支中调用 React 19 的 use？', ['reactHooksRules', 'reactRef', 'reactImperative', 'reactUse']),

  q('ai', 'ai-transport-sse-ws-2026', '实战', 'AI 对话流式输出为什么常选 SSE？什么时候改用 WebSocket？',
    '按通信方向与交互需求选型；还要区分 EventSource 与 fetch 读取流。', [
      '服务端单向持续推送 token 或事件时，HTTP 流/SSE 很常见。浏览器 EventSource 天然接收 SSE 且支持断线重连，但其原生 API 以 GET 为主；需要 POST 请求体、认证头或 AbortController 时，通常用 fetch 读取响应流并自行解析 SSE 帧、处理重连。',
      'WebSocket 更适合持续双向、低延迟交互，例如实时协作或语音双工；代价是连接保活、鉴权、重连及背压需要明确设计。两者都不能只凭“流式”二字判断优劣。',
    ], '用户点击停止生成时，EventSource 和 fetch 流分别如何关闭？', ['aiSse', 'aiWebSocket', 'aiStreams', 'abortController']),

  q('ai', 'ai-stream-parser-2026', '实战', '流式 AI 回答的 Markdown、代码块被拆成半截时，前端怎样稳定渲染？',
    '网络 chunk 不等于 token、更不等于完整消息；先解码和组帧，再做增量状态与渲染调度。', [
      '用 TextDecoder 的 stream 模式跨 chunk 解码 UTF-8，维护缓冲区，按协议边界解析完整 SSE 事件或消息；JSON 字段、代码围栏和 Markdown 标记可能跨任意网络 chunk。不要对每个 chunk 直接 JSON.parse 或当完整 Markdown 段落。',
      '持续追加原始文本，并以小批次或动画帧更新 UI，减少每个 token 都触发全量解析和重排。完成事件再最终解析；不可信 Markdown/HTML 要做安全处理，代码高亮和长文本可延迟或分段处理。',
    ], '一个 UTF-8 中文字符被分到两个 chunk，普通逐块解码会怎样？', ['aiStreams', 'aiStreaming', 'browserCsp', 'perfRaf']),

  q('ai', 'ai-rag-pipeline-2026', '实战', '企业知识库 RAG 从上传文档到带引用回答，前后端各做什么？',
    '上传与进度只是入口，解析、切块、索引、权限过滤、检索与引用要形成可追踪链路。', [
      '前端负责文件类型/大小预检、上传与索引状态、失败重试、提问交互、答案引用定位；服务端负责鉴权、解析与清洗、切块、向量化及索引、按租户和文档权限过滤检索结果，再把检索片段送入生成流程。',
      '面试应讲清来源元数据和版本：引用要能定位到具体文档/段落；索引更新、删除与权限变更需要同步。回答错误时区分解析、召回、排序、生成或引用映射的问题，不把“加大模型”当万能修复。',
    ], '用户撤销某文档访问权限后，怎样避免旧向量仍被召回？', ['aiPrompt', 'aiEvals', 'aiSafety']),

  q('ai', 'ai-agent-tool-ux-2026', '实战', 'Agent 连续调用工具时，界面怎样呈现步骤并防止越权操作？',
    '把计划、工具请求、等待审批、执行、结果、失败分成明确状态；真正的权限检查在服务端。', [
      'UI 可以按事件 ID 展示“思考/查资料/调用工具/等待确认/完成”，支持停止、重试与错误恢复。危险动作要展示将执行的具体参数和影响范围，让用户确认；不要只给一个笼统的“已授权”开关。',
      '模型给出的工具名与参数都是不可信建议。后端须校验 schema、用户身份、资源权限、幂等键和审计日志，并对外部工具设置超时；前端禁用按钮并不能阻止越权。',
    ], '模型要求删除订单时，用户确认后还要在哪些层再次校验？', ['aiTools', 'aiSafety', 'aiOwasp']),

  q('ai', 'ai-long-chat-performance-2026', '实战', '几千条消息持续流式更新，对话页卡顿怎么定位与优化？',
    '先测渲染与解析开销，再按长列表、流更新和滚动交互分别处理。', [
      '用浏览器性能面板区分网络、Markdown 解析、代码高亮、React 重渲染和布局开销；流式事件可合并后更新，避免每个 token 触发整页重算。',
      '历史消息可虚拟化并缓存稳定消息；长内容解析可移到 Worker 或延后高亮。自动滚动只在用户本来接近底部时启用，用户上滑阅读时不要强行拉回。变高消息、图片加载和流式扩高会影响虚拟列表测量，需专门验证。',
    ], '怎样判断用户“接近底部”，同时避免新 token 到来时滚动位置跳动？', ['virtualization', 'browserWorkers', 'aiStreaming']),

  q('ai', 'ai-quality-observability-2026', '实战', 'AI 功能上线后，如何同时衡量体验、质量、成本与故障？',
    '把请求链路、首字延迟、完整耗时、错误/取消、token 消耗和答案质量分开监控。', [
      '为一次对话关联 requestId、会话 ID、模型/提示词版本、检索版本和工具步骤；统计首字时间、总耗时、流中断率、重试率、token 用量与成本。不要把“首字快”等同于“回答完成快”。',
      '质量需要代表性用例、人工反馈及回归评测：RAG 要测召回、引用是否支持结论；工具调用要测成功率与越权阻断。用户输入可能含隐私，日志应脱敏、限保留并遵守访问控制。',
    ], '首字延迟变短但用户投诉增加，你会先对照哪些指标和样本？', ['aiEvals', 'aiLatency', 'aiCost', 'aiSafety']),

  q('ai', 'ai-multimodal-upload-2026', '实战', 'AI 聊天支持图片、PDF 和语音上传，前端有哪些可靠性与安全边界？',
    '按文件生命周期管理校验、预览、上传、处理、可用与失败；不把前端校验当作安全边界。', [
      '前端需限制类型/大小、展示预览与上传/解析进度，处理取消和重试，并明确“上传完成”与“可被模型检索或理解”是两个不同状态。大文件可分片或直传，但需处理过期凭证与重复提交。',
      '服务端还要验证 MIME 与实际内容、扫描风险文件、隔离租户、控制访问权限和存储生命周期。解析出的文档文字属于不可信外部内容，不能当系统指令使用；预览和渲染也要考虑 XSS。',
    ], 'PDF 已上传成功但解析失败，界面该显示什么，重试从哪一步开始？', ['aiSafety', 'aiOwasp', 'browserCsp']),
]

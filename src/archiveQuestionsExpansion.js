// 扩展题库：每题保留回答路径、面试追问与可核对的官方资料。
export const extraCategories = [
  { id: 'browser', name: '浏览器与网络', short: '浏览器/网络', en: 'BROWSER & NETWORK', description: '把页面加载、缓存、通信和安全边界串成完整链路。' },
  { id: 'typescript', name: 'TypeScript 与工程实践', short: 'TypeScript', en: 'TYPES & TOOLING', description: '从类型收窄到大型项目组织，回答类型设计的取舍。' },
  { id: 'ai', name: 'AI 应用与求职实践', short: 'AI 应用', en: 'AI IN PRACTICE', description: '围绕 AI 功能开发、可靠性、安全与求职项目展开。' },
  { id: 'scenario', name: '场景题与线上排障', short: '场景题', en: 'DEBUG & DESIGN', description: '从真实症状出发，讲清楚定位路径、方案与验收。' },
  { id: 'vue', name: 'Vue 3 与跨框架比较', short: 'Vue', en: 'REACTIVITY & VIEW', description: '补足资料中的 Vue 高频基础，并练习与 React 的机制对照。' },
]

export const extraReferences = {
  jsModules: { label: 'MDN · JavaScript 模块', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' },
  jsEquality: { label: 'MDN · 相等比较', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness' },
  jsMap: { label: 'MDN · Map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map' },
  jsWeakMap: { label: 'MDN · WeakMap', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap' },
  jsAsync: { label: 'MDN · async function', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function' },
  jsIterators: { label: 'MDN · 迭代器与生成器', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators' },
  jsProxy: { label: 'MDN · Proxy', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy' },
  cssSizing: { label: 'MDN · box-sizing', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing' },
  cssPosition: { label: 'MDN · position', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position' },
  cssMedia: { label: 'MDN · 媒体查询', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries' },
  cssLogical: { label: 'MDN · 逻辑属性', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values' },
  cssOverflow: { label: 'MDN · overflow', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/overflow' },
  cssContain: { label: 'MDN · contain', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/contain' },
  cssMotion: { label: 'MDN · 减少动态效果', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
  reactRef: { label: 'React · useRef', url: 'https://react.dev/reference/react/useRef' },
  reactReducer: { label: 'React · useReducer', url: 'https://react.dev/reference/react/useReducer' },
  reactContext: { label: 'React · useContext', url: 'https://react.dev/reference/react/useContext' },
  reactLayout: { label: 'React · useLayoutEffect', url: 'https://react.dev/reference/react/useLayoutEffect' },
  reactInput: { label: 'React · input', url: 'https://react.dev/reference/react-dom/components/input' },
  reactError: { label: 'React · Error Boundary', url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary' },
  reactSuspense: { label: 'React · Suspense', url: 'https://react.dev/reference/react/Suspense' },
  perfNavigation: { label: 'web.dev · Navigation timing', url: 'https://web.dev/articles/navigation-and-resource-timing' },
  perfImages: { label: 'web.dev · 图片优化', url: 'https://web.dev/learn/images' },
  perfFonts: { label: 'web.dev · 字体优化', url: 'https://web.dev/learn/performance/optimize-web-fonts' },
  perfRaf: { label: 'MDN · requestAnimationFrame', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame' },
  perfObserver: { label: 'MDN · PerformanceObserver', url: 'https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver' },
  perfCompression: { label: 'MDN · 压缩', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Compression' },
  webpackAsset: { label: 'Webpack · Asset modules', url: 'https://webpack.js.org/guides/asset-modules/' },
  webpackDevtool: { label: 'Webpack · devtool', url: 'https://webpack.js.org/configuration/devtool/' },
  webpackResolve: { label: 'Webpack · resolve', url: 'https://webpack.js.org/configuration/resolve/' },
  webpackFederation: { label: 'Webpack · Module Federation', url: 'https://webpack.js.org/concepts/module-federation/' },
  webpackExternals: { label: 'Webpack · externals', url: 'https://webpack.js.org/configuration/externals/' },
  webpackDefine: { label: 'Webpack · DefinePlugin', url: 'https://webpack.js.org/plugins/define-plugin/' },
  webpackOutput: { label: 'Webpack · output', url: 'https://webpack.js.org/configuration/output/' },
  viteConfig: { label: 'Vite 6 · 配置', url: 'https://v6.vite.dev/config/' },
  viteAssets: { label: 'Vite 6 · 静态资源', url: 'https://v6.vite.dev/guide/assets' },
  viteGlob: { label: 'Vite 6 · glob 导入', url: 'https://v6.vite.dev/guide/features#glob-import' },
  viteSsr: { label: 'Vite 6 · SSR', url: 'https://v6.vite.dev/guide/ssr' },
  viteTrouble: { label: 'Vite 6 · 故障排查', url: 'https://v6.vite.dev/guide/troubleshooting' },
  viteBuildOptions: { label: 'Vite 6 · 构建选项', url: 'https://v6.vite.dev/config/build-options' },
  browserRender: { label: 'web.dev · 渲染性能', url: 'https://web.dev/articles/rendering-performance' },
  browserCors: { label: 'MDN · CORS', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS' },
  browserCookies: { label: 'MDN · Cookie', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies' },
  browserStorage: { label: 'MDN · Web Storage', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API' },
  browserIdb: { label: 'MDN · IndexedDB', url: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API' },
  browserCsp: { label: 'MDN · CSP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy' },
  browserCsrf: { label: 'OWASP · CSRF 防护', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html' },
  browserWorkers: { label: 'MDN · Web Workers', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers' },
  browserSw: { label: 'MDN · Service Worker', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API' },
  browserHttp2: { label: 'MDN · HTTP/2', url: 'https://developer.mozilla.org/en-US/docs/Glossary/HTTP_2' },
  browserEvents: { label: 'MDN · 事件传播', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling' },
  browserPreload: { label: 'MDN · preload', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload' },
  tsNarrow: { label: 'TypeScript · Narrowing', url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' },
  tsGenerics: { label: 'TypeScript · Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' },
  tsUtility: { label: 'TypeScript · Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' },
  tsConditional: { label: 'TypeScript · Conditional Types', url: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html' },
  tsMapped: { label: 'TypeScript · Mapped Types', url: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html' },
  tsClasses: { label: 'TypeScript · Classes', url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html' },
  tsCompatibility: { label: 'TypeScript · 类型兼容性', url: 'https://www.typescriptlang.org/docs/handbook/type-compatibility.html' },
  tsConfig: { label: 'TypeScript · tsconfig', url: 'https://www.typescriptlang.org/tsconfig/' },
  tsModules: { label: 'TypeScript · Modules', url: 'https://www.typescriptlang.org/docs/handbook/modules/introduction.html' },
  tsProjects: { label: 'TypeScript · Project References', url: 'https://www.typescriptlang.org/docs/handbook/project-references.html' },
  tsSatisfies: { label: 'TypeScript · satisfies', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator' },
  aiStructured: { label: 'OpenAI · 结构化输出', url: 'https://developers.openai.com/api/docs/guides/structured-outputs' },
  aiStreaming: { label: 'OpenAI · 流式响应', url: 'https://developers.openai.com/api/docs/guides/streaming-responses' },
  aiTools: { label: 'OpenAI · 函数调用', url: 'https://developers.openai.com/api/docs/guides/function-calling' },
  aiPrompt: { label: 'OpenAI · 提示词设计', url: 'https://developers.openai.com/api/docs/guides/prompt-engineering' },
  aiEvals: { label: 'OpenAI · 模型优化与评测', url: 'https://developers.openai.com/api/docs/guides/model-optimization' },
  aiLatency: { label: 'OpenAI · 延迟优化', url: 'https://developers.openai.com/api/docs/guides/latency-optimization' },
  aiCost: { label: 'OpenAI · 成本优化', url: 'https://developers.openai.com/api/docs/guides/cost-optimization' },
  aiSafety: { label: 'OpenAI · 安全实践', url: 'https://developers.openai.com/api/docs/guides/safety-best-practices' },
  aiOwasp: { label: 'OWASP · LLM Top 10', url: 'https://genai.owasp.org/llm-top-10/' },
  browserBeacon: { label: 'MDN · sendBeacon', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon' },
  browserBroadcast: { label: 'MDN · BroadcastChannel', url: 'https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel' },
  browserVisibility: { label: 'MDN · Page Visibility', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API' },
  browserMutation: { label: 'MDN · MutationObserver', url: 'https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver' },
  browserIntersection: { label: 'MDN · IntersectionObserver', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API' },
  browserCanvas: { label: 'MDN · Canvas', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API' },
  vueReactivity: { label: 'Vue · 响应式基础', url: 'https://vuejs.org/guide/essentials/reactivity-fundamentals' },
  vueDepth: { label: 'Vue · 响应式原理', url: 'https://vuejs.org/guide/extras/reactivity-in-depth' },
  vueComputed: { label: 'Vue · computed', url: 'https://vuejs.org/guide/essentials/computed' },
  vueWatch: { label: 'Vue · watchers', url: 'https://vuejs.org/guide/essentials/watchers' },
  vueRendering: { label: 'Vue · 渲染机制', url: 'https://vuejs.org/guide/extras/rendering-mechanism' },
  vueComponents: { label: 'Vue · 组件基础', url: 'https://vuejs.org/guide/essentials/component-basics' },
  vueLifecycle: { label: 'Vue · 生命周期', url: 'https://vuejs.org/guide/essentials/lifecycle' },
  vueKeepAlive: { label: 'Vue · KeepAlive', url: 'https://vuejs.org/guide/built-ins/keep-alive' },
  vueConditional: { label: 'Vue · 条件渲染', url: 'https://vuejs.org/guide/essentials/conditional' },
  vueShowIfArticle: { label: '参考文章 · v-show 与 v-if', url: 'https://vue3js.cn/interview/vue/show_if.html' },
  vueList: { label: 'Vue · 列表渲染', url: 'https://vuejs.org/guide/essentials/list' },
  vueModel: { label: 'Vue · 组件 v-model', url: 'https://vuejs.org/guide/components/v-model' },
  vueSlots: { label: 'Vue · 插槽', url: 'https://vuejs.org/guide/components/slots' },
  vueProvide: { label: 'Vue · provide / inject', url: 'https://vuejs.org/guide/components/provide-inject' },
  vueComposables: { label: 'Vue · 组合式函数', url: 'https://vuejs.org/guide/reusability/composables' },
  vueScriptSetup: { label: 'Vue · script setup', url: 'https://vuejs.org/api/sfc-script-setup' },
  vueTeleport: { label: 'Vue · Teleport', url: 'https://vuejs.org/guide/built-ins/teleport' },
  vueSuspense: { label: 'Vue · Suspense', url: 'https://vuejs.org/guide/built-ins/suspense' },
  vueTransition: { label: 'Vue · Transition', url: 'https://vuejs.org/guide/built-ins/transition' },
  vueAsync: { label: 'Vue · 异步组件', url: 'https://vuejs.org/guide/components/async' },
  gitRebase: { label: 'Git · rebase', url: 'https://git-scm.com/docs/git-rebase' },
}

function q(category, id, level, title, brief, answer, followUp, refs, example) {
  return { category, id, level, title, brief, answer, followUp, refs, ...(example ? { example } : {}) }
}

export const extraQuestions = [
  q('javascript', 'js-esm-commonjs', '进阶', 'ESM 与 CommonJS 的导入、执行与打包差异是什么？', '重点看静态依赖分析、绑定语义和运行环境。', [
    'ESM 使用 import/export 声明模块依赖，静态语法有利于构建工具分析依赖图和按需移除未使用导出；CommonJS 通常通过 require 和 module.exports 在运行时加载，Node.js 环境中很常见。',
    'ESM 导入是指向导出绑定的只读视图，不能简单描述为“复制一份值”。循环依赖的行为还受初始化顺序影响。面试回答应先说明运行环境，再讨论互操作、异步加载和打包优化，避免一概而论。',
  ], '动态 import() 与静态 import 在加载时机和错误处理上有什么区别？', ['jsModules']),
  q('javascript', 'js-equality', '基础', '==、=== 与 Object.is 如何比较？NaN 和 -0 是典型陷阱吗？', '先区分类型转换，再讨论特殊数值。', [
    '== 可能先执行类型转换；=== 不做这种跨类型转换，所以通常更适合业务判断。对象比较看引用身份，两个内容相同的独立对象仍不相等。',
    'Object.is(NaN, NaN) 为 true，而 NaN === NaN 为 false；Object.is(-0, 0) 为 false，而 -0 === 0 为 true。不要把 Object.is 误认为“深比较”；比较复杂数据结构时要明确需求。',
  ], 'React 中依赖比较为何可能受到引用变化影响？', ['jsEquality']),
  q('javascript', 'js-map-weakmap', '进阶', 'Object、Map 与 WeakMap 分别适合存什么？', '键类型、迭代需求和引用生命周期决定选择。', [
    '普通对象适合固定结构的记录；Map 支持任意值作键，保留插入顺序，提供 size 和直接迭代 API，适合动态键值集合。把用户输入直接当普通对象键时还要注意原型链和键名碰撞。',
    'WeakMap 的键必须是对象或非注册 Symbol，键是弱引用且不可枚举，适合给对象附加不希望阻止回收的元数据。它并不保证“存进去就立刻回收”，也不能拿来实现可遍历缓存。',
  ], '为何 WeakMap 没有 keys() 和 size？', ['jsMap', 'jsWeakMap']),
  q('javascript', 'js-async-errors', '实战', 'async/await 的异常传播与并发请求如何处理？', 'await 会把拒绝转为抛错；并发由创建 Promise 的时机决定。', [
    'async 函数总是返回 Promise。await 一个拒绝的 Promise 会在该位置抛出异常，可用 try/catch 处理；没有捕获时返回的 Promise 继续拒绝，调用方仍要处理。',
    '两个互不依赖的请求可先同时创建 Promise，再用 Promise.all 等待；若先 await 第一个再创建第二个，就变成串行。Promise.all 一旦有一个拒绝就会拒绝，但其他请求不会自动取消，取消要另用 AbortController。',
  ], '需要保留所有请求的成功与失败结果时，为什么考虑 Promise.allSettled？', ['jsAsync', 'promises', 'abortController']),
  q('javascript', 'js-generator', '进阶', '迭代协议、生成器和 for...of 的关系是什么？', 'for...of 消费可迭代对象，生成器是创建迭代器的便捷方式。', [
    '可迭代对象需要实现 Symbol.iterator，返回具有 next() 的迭代器。for...of 逐次调用 next()，直到结果中的 done 为 true；数组、字符串、Map 等都可参与。',
    'function* 和 yield 可按需产生值，适合惰性序列、遍历和状态机。它不等同于异步执行；异步迭代要用 async generator 与 for await...of。',
  ], '生成器提前结束时，资源清理可以放在哪里？', ['jsIterators']),
  q('javascript', 'js-proxy', '进阶', 'Proxy 与 Object.defineProperty 做拦截时有何取舍？', 'Proxy 面向整个对象的操作；描述符面向单个属性。', [
    'Proxy 可拦截 get、set、has、deleteProperty 等对象操作，适合代理、校验和响应式系统的底层机制。Object.defineProperty 可以为特定属性定义 getter/setter 与可配置性，适合更明确的属性级控制。',
    'Proxy 不是“自动深层响应式”：嵌套对象仍需要按需包装。实现代理时应借助 Reflect 维持默认语义并遵守不变量；它也不会让私有字段等所有内部操作自动兼容。',
  ], '为什么代理一个含私有字段的类实例时，方法调用可能出错？', ['jsProxy']),

  q('css', 'css-box-model', '基础', '标准盒模型与 border-box 如何计算宽度？', 'width 是否包含 padding 和 border 是关键。', [
    '默认 content-box 下，width 指内容盒宽度，总占用还要加左右 padding 与 border；border-box 下，设定的 width 包含内容、padding 和 border。margin 位于盒外，两种模式都不包含。',
    '布局测量还要考虑 min/max-width、百分比基准、滚动条和子元素溢出。全局使用 border-box 常让组件尺寸更容易推算，但面试回答应说清楚计算口径。',
  ], '一个 width: 200px、padding: 20px、border: 2px 的盒子，两种模型的外宽是多少？', ['cssSizing']),
  q('css', 'css-position-sticky', '实战', 'position: sticky 为什么有时不生效？', '检查滚动容器、阈值和包含块范围。', [
    'sticky 先按正常文档流布局，再在滚动到 top/left 等阈值时相对最近的相关滚动容器保持位置，直到达到其包含块边界。没写阈值通常看不出吸附效果。',
    '排查要看祖先的 overflow、实际滚动者、容器高度以及 sticky 元素与容器的尺寸关系。元素不会脱离文档流，这与 fixed 始终相对视口的常见行为不同。',
  ], '表头吸顶但表体横向滚动时，如何定位是哪个祖先创建了滚动容器？', ['cssPosition', 'cssOverflow']),
  q('css', 'css-responsive', '实战', '媒体查询、容器查询与流式布局各解决什么问题？', '按视口、按容器和按可用空间分别建模。', [
    '媒体查询通常依据视口或设备特征切换页面级布局；容器查询依据组件所在容器的尺寸调整组件自身，适合被复用到不同宽度侧栏的卡片。',
    '优先让 Flex/Grid、百分比、minmax 和 clamp 等处理连续变化，再在布局确实需要切换时设置断点。断点应来自内容何时失衡，而不是只按某款设备型号硬编码。',
  ], '同一个卡片在首页宽栏和侧栏同时出现，应如何避免依赖全局视口断点？', ['cssMedia', 'containerQueries', 'grid']),
  q('css', 'css-logical', '进阶', '为什么要使用 margin-inline、padding-block 等逻辑属性？', '让布局跟随书写方向，而非固定左右上下。', [
    '物理属性 left/right 固定指向屏幕方向；逻辑属性 inline-start/end 和 block-start/end 与 writing-mode、direction 相关。国际化布局从左到右切换到从右到左时，逻辑属性可以减少重复覆盖。',
    '例如卡片图标与文字的间距使用 margin-inline-end，可随着文本方向调整。它不代替所有排版审查：图标方向、数字、图片和交互顺序仍需在真实语言环境测试。',
  ], 'RTL 页面中的返回箭头是否也应该翻转？判断依据是什么？', ['cssLogical']),
  q('css', 'css-overflow-minwidth', '实战', 'Flex 子项省略号失效，为什么常需要 min-width: 0？', '自动最小尺寸可能阻止子项收缩。', [
    'Flex 子项的默认自动最小尺寸可能按内容的最小宽度参与计算，长单词或不可换行内容会撑开布局。给需要收缩的子项设置 min-width: 0，允许其低于内容固有宽度。',
    '单行省略还要在实际承载文本的元素上组合 overflow: hidden、white-space: nowrap 和 text-overflow: ellipsis，并确保父级宽度可被约束。只加省略号属性而没有溢出边界不会生效。',
  ], '多行截断的显示与可访问性需要额外注意什么？', ['flex', 'cssOverflow']),
  q('css', 'css-contain', '进阶', 'CSS contain 和 content-visibility 能优化哪些渲染工作？', '告诉浏览器某个区域的布局、绘制或可见性边界。', [
    'contain 可声明元素的布局、绘制、尺寸等相对独立，从而减少部分变化对页面其他区域的影响；content-visibility: auto 可跳过视口外部分内容的渲染工作。它们适合长文档或独立组件。',
    '隔离会影响测量、溢出和包含块等行为，content-visibility 也不能代替真正的列表虚拟化。应用前后应记录滚动流畅度与关键指标，并验证焦点导航和查找功能。',
  ], '大型列表使用 content-visibility 后，何时仍需要虚拟列表？', ['cssContain', 'browserRender']),

  q('react', 'react-ref-state', '基础', 'useRef 和 useState 分别存什么？改 ref.current 会触发渲染吗？', '状态用于影响视图的数据，ref 用于跨渲染保存可变值。', [
    'useState 更新会安排组件重新渲染，适合显示在界面中的数据。useRef 返回稳定的容器，修改 current 不会触发渲染，适合 DOM 节点、计时器 ID 或不参与绘制的实例值。',
    '不要在渲染期间随意读写 ref.current 来驱动 UI，否则视图与内部值可能不一致。若某个值变化应被用户看到，就应放到状态中或由状态计算。',
  ], '防抖定时器 ID 为什么通常适合存 ref？', ['reactRef', 'reactState']),
  q('react', 'react-reducer', '进阶', '何时用 useReducer，而不是很多个 useState？', '状态转移复杂、动作明确时 reducer 更便于约束。', [
    '当多个字段在同一业务动作中协同变化，或更新规则有多种分支时，useReducer 将“发生了什么”表达为 action，将“怎样更新”集中在纯 reducer 中。dispatch 后 React 再根据新状态安排渲染。',
    'reducer 不应直接修改原状态或放入网络请求等副作用；返回新的状态对象。简单独立字段用 useState 往往更直观，不必为了形式统一强行上 reducer。',
  ], '请求加载、成功、失败三种状态如何设计成不易出现矛盾的状态机？', ['reactReducer']),
  q('react', 'react-context', '进阶', 'Context 能替代状态管理库吗？为什么消费者会重渲染？', 'Context 传递值；更新粒度取决于 Provider 的 value。', [
    'Context 让后代组件读取上层 Provider 的值，适合主题、语言或当前用户等跨层信息。Provider 的 value 变化时，使用该 Context 的后代会重新渲染；把频繁变化的大对象整体放入一个 Context，可能扩大更新范围。',
    '可以拆分 Context、稳定 value 中不必要变化的引用，或把状态放到更靠近消费处。复杂场景还要考虑异步缓存、选择器和开发工具，这些不是 Context API 本身提供的。',
  ], '为什么单纯用 memo 包住使用 Context 的子组件，不一定阻止 Context 更新？', ['reactContext', 'reactMemo']),
  q('react', 'react-layout-effect', '进阶', 'useEffect 与 useLayoutEffect 的执行时机怎么选？', '是否需要在浏览器绘制前同步测量和修正布局。', [
    'useLayoutEffect 在 DOM 更新后、浏览器绘制前同步执行，适合必须避免视觉闪动的测量和布局修正；它会阻塞绘制，过多使用会拖慢页面。普通数据订阅和外部系统同步通常用 useEffect。',
    '二者都需要处理清理逻辑和依赖。服务端没有布局信息，因此涉及 SSR 时更要避免把客户端测量当成首屏 HTML 的前提。不要用 layout effect 代替正常 CSS 布局。',
  ], 'Tooltip 需要测量后选择上下位置时，为什么可能用 useLayoutEffect？', ['reactLayout', 'reactEffect']),
  q('react', 'react-controlled', '基础', '受控与非受控表单的差异是什么？', '输入值由 React state 还是 DOM 本身管理。', [
    '受控 input 用 value 与 onChange 把输入值同步到 React 状态，适合实时校验、条件联动和统一提交。非受控输入可使用 defaultValue 初始化，在提交时用 ref 或 FormData 读取当前 DOM 值。',
    '不要让同一个输入在生命周期中从受控切到非受控，例如 value 从字符串变成 undefined。大量输入字段如果每次按键都让整页重渲染，应考虑缩小状态范围、拆分组件或延后昂贵计算。',
  ], '文件输入为什么常按非受控方式处理？', ['reactInput']),
  q('react', 'react-error-boundary', '实战', 'Error Boundary 可以捕获哪些错误？异步请求失败怎么办？', '渲染树错误与异步流程错误要分开处理。', [
    'Error Boundary 可捕获子树渲染、生命周期等阶段抛出的错误，并显示降级界面，避免整个页面白屏。它通常不能直接捕获事件处理函数、异步回调或自身内部抛出的错误。',
    '请求错误要在请求层或组件的异步流程中处理，再根据业务状态展示错误、重试或向边界抛出。边界应按路由或功能区域布置，并记录错误信息，不能把所有异常都吞掉。',
  ], '错误边界放在应用根部和某个独立卡片周围，用户体验有什么差异？', ['reactError']),

  q('performance', 'perf-budget', '实战', '性能优化前如何建立基线与预算？', '先定义用户场景、指标和设备网络条件。', [
    '明确目标是首屏、交互还是长列表滚动，再选 LCP、INP、CLS、资源体积或任务耗时等指标。用真实用户监测看分布与低端设备尾部体验，实验室工具用于复现和定位。',
    '记录优化前基线、测试条件和改动后的对比；预算可以限定关键资源大小、关键路径请求数或长任务阈值。只报告一次本机跑分通常不足以证明线上有效。',
  ], '一个页面 LCP 改善但 INP 变差，应该如何解释和取舍？', ['vitals', 'perfObserver']),
  q('performance', 'perf-waterfall', '实战', '如何读网络瀑布，定位资源请求串行问题？', '区分发现时间、等待时间、下载时间和执行依赖。', [
    '先找首屏关键资源：HTML、CSS、关键图片、字体和入口脚本。请求开始很晚可能是资源发现或 JS 执行依赖；等待长可能涉及网络、服务器处理或连接；下载长则看体积与压缩。',
    '优化可以包括提前声明关键资源、减少链式动态导入、合理缓存与压缩，但 preload 用错会挤占更关键资源。结合 Performance 面板与服务端指标判断瓶颈，避免只看瀑布色块猜结论。',
  ], '首屏图像已经很小却很晚才请求，应该先检查什么？', ['perfNavigation', 'browserPreload']),
  q('performance', 'perf-images', '实战', '图片优化为什么不只是压缩文件？', '正确尺寸、格式、加载优先级和布局稳定性都重要。', [
    '通过 srcset/sizes 让不同视口选择合适尺寸，按内容选择适合的图片格式，并避免给首屏关键图像错误地设置懒加载。非关键图片可延迟加载以减少首屏竞争。',
    '为图片提供 width/height 或 aspect-ratio，避免加载后推开内容造成 CLS。若图像是 LCP 元素，应关注它的发现时间、传输与解码，而不只比较文件大小。',
  ], '一张图片压缩后 LCP 仍无改善，下一步看哪些时间段？', ['perfImages', 'lcp', 'cls']),
  q('performance', 'perf-fonts', '进阶', 'Web 字体加载怎样影响首屏和布局？', '字体请求、替换策略与字形差异共同影响体验。', [
    '字体需要被发现、下载和解析。font-display 决定替代字体与自定义字体切换的行为，不同策略影响文字可见时间和布局变化。首屏仅加载需要的字重、字符集并尽量避免过多字体文件。',
    '可考虑字体子集、预加载真正关键的字体，以及选择度量相近的回退字体来降低切换位移。预加载全部字体可能反而与 LCP 图像争抢带宽。',
  ], '为什么 font-display: swap 可能改善文字可见性却增加布局位移？', ['perfFonts', 'cls']),
  q('performance', 'perf-animation', '进阶', '滚动动画掉帧时如何判断是 JS、布局还是绘制瓶颈？', '用帧时间线定位慢阶段，再改具体工作。', [
    '浏览器通常需要在每帧完成脚本、样式、布局、绘制和合成等工作。用 Performance 面板看主线程长任务与帧分解，避免仅凭“动画卡”认定是 JavaScript。',
    '高频滚动回调可减少同步工作并用 requestAnimationFrame 对齐视觉更新；避免在同一循环交替读布局和写样式导致强制同步布局。transform/opacity 动画常更易合成，但合成层也有内存成本。',
  ], '为什么把所有元素都加 will-change 不是好办法？', ['browserRender', 'perfRaf']),
  q('performance', 'perf-api-cancel', '实战', '搜索联想如何同时处理防抖、竞态与取消？', '减少无效请求与保证结果属于最新输入是两件事。', [
    '防抖减少输入频繁变化时的请求数量，但旧请求仍可能比新请求晚返回。可以在新查询开始时用 AbortController 取消旧请求，并在结果提交前核对请求序号或查询词。',
    '取消不代表服务器一定停止处理，也不能替代错误状态与空结果处理。应在组件卸载或查询变化时清理相关任务，避免旧结果覆盖新界面。',
  ], '如果 fetch 已经返回但解析 JSON 尚未完成，如何保证旧查询不覆盖新结果？', ['abortController', 'reactEffect']),

  q('webpack', 'webpack-asset-modules', '进阶', 'Webpack 5 的 Asset Modules 与旧 file-loader/url-loader 有何关系？', '资源模块把常见静态资源处理纳入内置模块类型。', [
    'Asset Modules 提供 asset/resource、asset/inline、asset/source 和自动选择的 asset 类型，可输出文件、内联 Data URL 或提供源码内容。选择要考虑资源大小、缓存能力与请求数。',
    '迁移旧 Loader 时若两套规则同时处理同一资源，可能产生重复产物或路径错误。应检查 rules 的匹配顺序和最终输出，再通过构建结果验证。',
  ], '把大图片内联进 JS 包会带来什么缓存与解析代价？', ['webpackAsset']),
  q('webpack', 'webpack-source-map', '实战', 'Webpack devtool 如何在调试、构建速度与源码暴露间取舍？', 'source map 选项决定映射质量和生成成本。', [
    '开发环境通常需要可快速定位源码的映射，生产环境则需权衡错误追踪、构建时间与源码是否可被公开访问。不同 devtool 选项在映射粒度、是否生成独立文件上不同。',
    '不要简单认为“生成 source map 就会自动暴露给所有人”：还取决于是否部署了 map 文件及其访问控制。可把生产 map 上传到监控平台而不公开提供。',
  ], '线上堆栈只有压缩代码位置时，如何安全地做源码映射？', ['webpackDevtool']),
  q('webpack', 'webpack-resolve', '进阶', 'resolve.alias、extensions 和 package exports 会怎样影响模块解析？', '解析规则决定导入最终指向哪个文件。', [
    'alias 把导入前缀映射到指定路径，extensions 影响省略扩展名时的尝试顺序；包自己的 exports 字段也可能限定可导入的子路径。解析和构建图直接相关，错误配置可导致重复打包或开发构建差异。',
    '别名应与 TypeScript paths、测试工具、编辑器和运行时约定保持一致。修改解析顺序前先确认依赖确实需要，否则隐藏同名文件会增加维护难度。',
  ], '为什么 TS 能识别路径别名，但 Webpack 构建仍提示找不到模块？', ['webpackResolve', 'tsModules']),
  q('webpack', 'webpack-federation', '进阶', 'Module Federation 解决什么问题，有哪些运行时风险？', '它让独立构建的应用在运行时共享或加载模块。', [
    'Module Federation 可把某个构建暴露为 remote，让另一个构建运行时消费，适合独立部署的前端模块。共享依赖配置可减少重复加载，但需要明确版本和单例约束。',
    '运行时加载会引入网络故障、版本兼容、初始化顺序和回退界面的问题。是否采用微前端还取决于团队边界与部署需求，不应因为页面拆分多就默认需要它。',
  ], '共享 React 版本不兼容时，用户会遇到哪些问题？', ['webpackFederation']),
  q('webpack', 'webpack-externals', '实战', 'externals 与代码拆分有什么区别？', 'externals 排除构建内容，拆包仍属于同一构建产物。', [
    'externals 告诉 Webpack 某依赖由外部环境提供，因此不把它打进该构建。代码拆分则把依赖放入其他 chunk，仍由当前应用的构建和加载机制负责。',
    '使用 externals 要保证运行环境提供兼容版本，并处理加载顺序、缓存与离线失败。包体减小不代表总下载量减小，需测量最终用户需要加载的所有资源。',
  ], '组件库为什么常把 React 设为 peer dependency 或 external？', ['webpackExternals', 'webpackSplitting']),
  q('webpack', 'webpack-define', '实战', 'DefinePlugin 注入变量时有哪些安全与语义误区？', '它做编译时替换，不是秘密存储服务。', [
    'DefinePlugin 在编译时替换源码中的表达式，常用于环境标识和死代码消除。替换值通常要正确序列化，避免把字符串误当变量名。',
    '注入到浏览器 bundle 的令牌与密钥可被用户查看，不能作为服务端秘密。工程上应区分公开配置、构建时参数和仅服务端可见的凭据。',
  ], '为什么把 process.env.API_SECRET 注入构建后，仍不能认为它是安全的？', ['webpackDefine']),
  q('webpack', 'webpack-output-cache', '实战', 'contenthash、缓存策略和发布顺序如何配合？', '让不变资源可长期缓存，同时保证 HTML 指向新版本。', [
    '带 contenthash 的静态资源在内容变化时改变文件名，可配合较长的强缓存；入口 HTML 通常需要较短缓存或重新验证，因为它保存资源引用。',
    '部署时先上传新资源、再切换 HTML，且保留一段时间的旧 chunk，避免已打开的旧页面动态加载时请求到不存在的文件。还要验证 CDN 缓存和回滚策略。',
  ], '为什么更新后用户会遇到 ChunkLoadError，发布流程可以如何缓解？', ['webpackOutput', 'cache']),

  q('vite', 'vite-glob', '进阶', 'import.meta.glob 的懒加载与 eager 模式有什么区别？', '编译期展开匹配路径，默认每项返回动态导入函数。', [
    'Vite 将 import.meta.glob 的字面量模式转换为模块映射；默认值是加载函数，访问时才动态导入。设置 eager: true 则直接静态导入匹配模块，适合需要立即收集元数据的场景。',
    'glob 参数必须是可静态分析的字面量。范围过宽会把意外文件纳入构建；eager 还可能增加首屏代码量，应根据使用时机选择。',
  ], '文章路由需要目录元数据但正文按需加载，应怎样设计导入？', ['viteGlob']),
  q('vite', 'vite-public-assets', '基础', 'Vite 的 public 目录与源码 import 资源有什么区别？', '是否参与模块图、哈希处理和引用路径是核心。', [
    '源码中 import 的资源由 Vite 处理，可参与构建图并获得适合部署的输出路径；public 下资源原样复制到构建根目录，通过绝对路径引用，适合必须保持固定文件名的文件。',
    '优先让普通图片、字体进入模块图以获得处理和引用检查。public 资源要自行管理命名与缓存，部署在非根路径时还要核对 base 配置。',
  ], '为什么对 public/logo.svg 写 import 通常不是预期用法？', ['viteAssets']),
  q('vite', 'vite-base', '实战', 'Vite 部署到子路径后资源 404，应该检查什么？', '构建 base、路由路径与服务器回退规则需要一致。', [
    '应用部署在 /demo/ 之类子路径时，Vite 的 base 会影响构建产物中的资源 URL。若沿用根路径默认值，浏览器可能去 /assets 请求而不是 /demo/assets。',
    '同时检查客户端路由的 basename 或 hash 路由策略，以及服务器对刷新直达页面的回退配置。修好开发服务器访问不代表生产静态托管就能工作，应预览构建结果。',
  ], '为什么 HashRouter 和 BrowserRouter 对服务器回退规则的要求不同？', ['viteConfig', 'viteBuild']),
  q('vite', 'vite-proxy', '实战', 'Vite 开发代理能解决生产跨域吗？', '代理只属于本地开发服务器，请求最终仍受生产部署架构约束。', [
    'server.proxy 可把开发时的指定路径转发给后端，让浏览器向本地同源地址发起请求，便于调试。这一能力只在 Vite 开发服务器工作，并不会自动进入生产静态文件。',
    '生产环境要由反向代理、后端网关或服务端 CORS 策略处理。还要核对 Cookie 的域、SameSite、Secure 和凭证选项，不能只把接口域名写成环境变量就认为跨域解决了。',
  ], '开发正常、上线 CORS 报错时，第一步如何定位请求的实际 Origin？', ['viteConfig', 'browserCors']),
  q('vite', 'vite-library', '进阶', '用 Vite 构建组件库与构建应用有何不同？', '入口、输出格式和外部依赖策略不同。', [
    'Vite 6 的 build.lib 面向浏览器库，可指定入口、库名和输出格式。组件库通常还要考虑类型声明、样式导出、package.json 的 exports，以及把 React 等宿主依赖外部化。',
    '应用构建更关心 HTML 入口和页面运行；库构建更关心被不同项目消费时的模块兼容、重复依赖与 tree shaking。应建立一个消费者示例验证产物，而不只检查 dist 是否生成。',
  ], '为什么把 React 打进组件库可能导致多个 React 实例？', ['viteBuild', 'webpackExternals']),
  q('vite', 'vite-ssr', '进阶', 'Vite 的 SSR 开发与客户端构建分别承担什么？', '服务端渲染、客户端水合和两套模块环境要配合。', [
    'SSR 流程在服务端执行组件渲染生成 HTML，客户端随后加载入口并水合交互。Vite 提供 SSR 模块加载和构建支持，但不替你完成路由、数据获取、响应缓存和部署方案。',
    '排查 SSR 问题时先看只在浏览器存在的 window/document 是否在服务端被访问，以及首屏服务端数据与客户端第一次渲染是否一致。生产环境也需分别验证服务端与客户端产物。',
  ], '服务端生成时间和客户端首次渲染时间不同，可能造成什么水合问题？', ['viteSsr', 'reactHydration']),
  q('vite', 'vite-chunk-control', '实战', 'Vite 构建产物过大时，如何判断是否该配置 manualChunks？', '先找重复依赖与加载时机，再决定拆包边界。', [
    '先用构建报告和浏览器网络面板确认大模块、实际首屏是否加载、缓存复用和压缩后大小。动态 import 按页面或低频功能拆分通常是第一步。',
    'manualChunks 可在 Vite 6 的 Rollup 配置中更细地控制 chunk，但强制把所有依赖塞进一个 vendor 包可能让首屏更重，也可能降低缓存命中。评估应看用户路径上的总请求与交互延迟。',
  ], '入口包缩小一半但首屏时间变慢，可能发生了什么？', ['viteBuildOptions', 'viteBuild']),

  q('browser', 'browser-navigation', '基础', '输入 URL 到页面可交互，大致经过哪些阶段？', '网络、解析、资源加载、渲染和主线程工作共同决定体验。', [
    '浏览器先解析地址并建立连接，发送请求并接收 HTML；解析 HTML 生成 DOM，遇到 CSS、脚本和图片等再发现资源。CSSOM、DOM 和脚本执行共同影响渲染，具体请求顺序还受缓存、preload 和脚本属性影响。',
    'HTML 出现在屏幕上不等于已经可交互：脚本下载、执行、水合与长任务仍可能占据主线程。面试时应结合 TTFB、LCP 和 INP 分段定位，而不是背一个固定的串行流水线。',
  ], '为什么看到页面内容后，点击按钮仍可能很久才响应？', ['browserRender', 'perfNavigation', 'vitals']),
  q('browser', 'browser-cors-preflight', '实战', 'CORS 预检何时出现？前端能否通过设置请求头自行解决跨域？', '浏览器先问服务器是否允许跨源方法和头部。', [
    'CORS 是浏览器对跨源脚本读取响应的控制机制。某些跨源请求需先发 OPTIONS 预检，请求中声明方法与自定义头；服务器需要返回允许的 Origin、方法和头部，实际请求才继续。',
    '前端不能靠随意添加 Access-Control-Allow-Origin 请求头来授权自己，许可要由响应方给出。排查时查看 Origin、预检响应、凭证模式及重定向，不要把所有网络失败都叫作跨域。',
  ], '携带 Cookie 的跨域请求为什么不能使用通配符允许来源？', ['browserCors']),
  q('browser', 'browser-cache-strategy', '实战', '强缓存与协商缓存如何配合带哈希的静态资源？', '文件名版本化适合长期缓存，HTML 应及时获得新引用。', [
    'Cache-Control: max-age 等可让资源在有效期内直接复用；过期后可通过 ETag/If-None-Match 等条件请求重新验证，服务器可返回 304。不同资源的更新频率应采用不同策略。',
    '带内容哈希的 JS/CSS 文件可长时间强缓存，HTML 通常短缓存或需要再验证，以便指向新文件。涉及登录态的响应还要区分 private 与共享缓存，不能套用静态资源规则。',
  ], '为什么资源文件名带 hash 后，仍要关注 HTML 的缓存？', ['cache']),
  q('browser', 'browser-cookies', '实战', 'Cookie 的 SameSite、HttpOnly、Secure 分别防什么？', '三者约束发送场景、脚本访问与传输通道。', [
    'HttpOnly 阻止页面脚本读取 Cookie，有助于降低凭据被 XSS 直接窃取的风险；Secure 限制在安全连接中发送；SameSite 控制跨站请求中 Cookie 的发送。它们作用不同，不能互相替代。',
    '登录方案还应考虑过期、服务端会话失效、CSRF 令牌和子域范围。SameSite 是一道防线，但复杂跨站业务和浏览器策略仍需具体验证。',
  ], 'Cookie 设置 HttpOnly 后，前端如何判断当前登录状态？', ['browserCookies', 'browserCsrf']),
  q('browser', 'browser-storage', '基础', 'localStorage、sessionStorage、IndexedDB 和 Cookie 如何选择？', '容量、同步阻塞、生命周期与是否自动随请求发送都不同。', [
    'localStorage 和 sessionStorage 提供同步键值 API，前者按源持久化，后者与标签页会话相关，适合少量非敏感偏好。IndexedDB 是异步结构化存储，更适合大量离线数据。',
    'Cookie 具有 HTTP 发送语义并可设置 HttpOnly 等属性，常用于会话场景。任何可被页面脚本读取的存储都受 XSS 威胁，不应仅凭“存本地”判断安全；大数据也不要塞进同步存储阻塞主线程。',
  ], '离线保存几万条记录时，为什么更倾向 IndexedDB？', ['browserStorage', 'browserIdb', 'browserCookies']),
  q('browser', 'browser-xss-csp', '实战', 'XSS 如何出现？CSP、转义和富文本清理各做什么？', '把不可信内容变成可执行代码是核心风险。', [
    'XSS 常发生在用户输入或外部数据被当作 HTML、脚本或危险 URL 插入页面时。默认使用框架的文本插值，避免直接拼接 innerHTML；必须渲染富文本时要用可信的清理策略。',
    'CSP 可限制脚本等资源的来源，降低部分攻击后果，但不能替代输出编码、输入校验和依赖审查。还要避免把模型生成内容直接作为 HTML 注入，这也是 AI 页面常见的交叉风险。',
  ], 'Markdown 转 HTML 后用 dangerouslySetInnerHTML 展示，需要补哪些控制？', ['browserCsp', 'aiOwasp']),
  q('browser', 'browser-csrf', '进阶', 'CSRF 与 XSS 的攻击条件和防护重点有何不同？', 'CSRF 借用户身份发请求，XSS 在受害页面执行脚本。', [
    'CSRF 利用浏览器在目标站请求中自动附带身份凭据，诱使已登录用户完成非预期操作。服务端应校验 CSRF token、Origin/Referer，结合 SameSite 等措施，并让敏感操作具备明确的鉴权与确认。',
    'XSS 是攻击者代码在站点上下文执行，可能绕过部分依赖页面脚本的防护。二者不是“用了 token 就全解决”，要分别分析可控输入、自动携带凭据和服务端权限检查。',
  ], '如果站点有 XSS，为什么 CSRF token 的保护也可能被削弱？', ['browserCsrf', 'browserCookies']),
  q('browser', 'browser-event-delegation', '基础', '事件捕获、冒泡和事件委托如何配合？', '委托利用祖先监听冒泡事件来处理动态子项。', [
    '事件从外层进入目标的捕获阶段，再经过目标并向外冒泡。委托在稳定的祖先上注册监听器，通过 event.target 或 closest 找到匹配子项，适合动态列表，减少逐项绑定和清理。',
    '不是所有事件都以相同方式冒泡；stopPropagation 会改变事件链。要核对真正目标、处理嵌套点击区域与可访问性，不应把委托当成能解决所有交互问题的万能技巧。',
  ], '点击按钮内部的 SVG 图标时，如何稳妥判断用户点击的是哪一项？', ['browserEvents']),
  q('browser', 'browser-workers', '进阶', 'Web Worker 能解决主线程卡顿吗？什么时候反而不划算？', '把可并行的计算移出主线程，但有通信和复制成本。', [
    'Worker 在独立线程执行脚本，适合较重的数据计算、解析或变换，避免长期阻塞主线程交互。它不能直接操作 DOM，需要通过消息与主线程通信。',
    '创建、传输大对象和序列化会产生开销。短小任务未必值得搬进 Worker；大型数据可研究 Transferable 等传输方式，并测量端到端耗时与内存。',
  ], '把 100MB 数据传给 Worker 时，如何避免额外复制成本？', ['browserWorkers', 'longTasks']),
  q('browser', 'browser-service-worker', '进阶', 'Service Worker 与 Web Worker 的区别是什么？', '前者可拦截网络并支持离线，后者主要跑后台计算。', [
    'Service Worker 在页面之外运行，可处理受控页面的 fetch 等事件，配合 Cache Storage 提供离线或资源策略；Web Worker 更多用于执行计算并与页面交换消息。',
    'Service Worker 有安装、激活和版本更新生命周期，且通常要求安全上下文。缓存策略错误可能让用户长期看到旧版本，需要把更新、回滚和清缓存路径设计清楚。',
  ], '新 Service Worker 已安装但用户仍在旧页面，为什么？', ['browserSw']),
  q('browser', 'browser-http2', '进阶', 'HTTP/2 多路复用之后，为什么仍需要关注请求瀑布？', '传输并发不消除资源发现、优先级和脚本依赖。', [
    'HTTP/2 允许同一连接上并行处理多个流，减少旧式串行请求的一些限制。但 HTML 必须先发现后续资源，动态脚本执行后才发现的请求仍会形成依赖链。',
    '带宽、服务器调度和主线程执行仍是瓶颈。优化应基于真实瀑布与关键路径，不能以“HTTP/2 已多路复用”为理由无限拆分文件。',
  ], '一个按需模块请求很晚才发起，是网络并发问题还是代码发现问题？', ['browserHttp2', 'perfNavigation']),
  q('browser', 'browser-preload-prefetch', '实战', 'preload、prefetch 与普通懒加载如何选择？', '资源何时需要决定提示方式。', [
    'preload 提前获取当前导航很快会用到的高优先级资源；prefetch 倾向为未来导航准备可能用到的资源；懒加载推迟非关键资源到真正需要时。三者目的不同。',
    '应只对确定关键的字体、LCP 图像或关键脚本考虑 preload，并匹配 as 与跨域属性。滥用预加载可能争抢带宽，还会出现“预加载了却未使用”的警告。',
  ], '路由下一页的数据该立即请求还是等用户点击？如何衡量？', ['browserPreload', 'lazyLoading']),

  q('typescript', 'ts-any-unknown', '基础', 'any 与 unknown 的区别是什么？', 'unknown 要先收窄，any 会跳过多数类型检查。', [
    'any 可以任意调用属性或方法并继续向外传播，适合逐步迁移时的临时边界，但会削弱静态检查。unknown 表示值暂时未知，直接使用会报错，必须通过 typeof、判别字段或自定义类型守卫收窄。',
    '外部 API、JSON 和异常对象都应先在边界验证，再转为领域类型。类型断言只改变编译器看法，不会在运行时验证数据。',
  ], '从 localStorage 解析出的 JSON 为什么不应直接断言为 User？', ['tsNarrow']),
  q('typescript', 'ts-never', '进阶', 'never 与 void、undefined 有何区别？', 'never 表示不可能出现的值或无法正常完成的路径。', [
    'void 常用于不关心返回值的函数；undefined 是一个实际值；never 表示没有可能的值，例如总抛异常的函数或穷尽判别联合后不应到达的分支。',
    '在 switch 的 default 中把剩余变量赋给 never，可让新增联合成员时触发编译错误，帮助保持分支完整。仍要注意运行时输入可能来自不可信外部数据。',
  ], '新增一种订单状态后，如何让遗漏的渲染分支在编译期报错？', ['tsNarrow']),
  q('typescript', 'ts-discriminated-union', '实战', '如何用判别联合避免 loading、error、data 的矛盾状态？', '用单个状态标签表达互斥业务分支。', [
    '若同时有 isLoading、error、data 三个独立字段，可能出现加载中却有旧错误等组合。可定义 type Result = { status: "loading" } | { status: "error"; error: string } | { status: "success"; data: Data }。',
    '通过 status 分支，TypeScript 会收窄各分支可访问字段。它能让渲染逻辑更清晰，但请求竞态、取消和服务端错误仍需运行时处理。',
  ], '如果需要保留上一次成功数据同时刷新，联合类型该如何扩展？', ['tsNarrow']),
  q('typescript', 'ts-generics', '基础', '泛型比直接写联合类型有什么价值？', '泛型保留输入和输出之间的具体类型关系。', [
    '联合类型描述允许出现哪些类型，但常丢失调用时的对应关系。泛型用类型参数表达“一次调用里输入是什么，输出也是什么”，常见于容器、请求封装和复用组件。',
    '泛型约束如 T extends { id: string } 可以说明函数需要哪些能力，而不强迫所有调用方是同一种对象。泛型太多会使 API 难读，应优先从实际关系出发。',
  ], '为什么函数 identity(value: string | number) 不如 identity<T>(value: T): T 精确？', ['tsGenerics']),
  q('typescript', 'ts-keyof', '进阶', 'keyof 与索引访问类型如何写类型安全的取值函数？', '让键参数与返回值类型跟随对象类型。', [
    'keyof T 得到对象类型的键联合；T[K] 表示键 K 对应的值类型。函数 get<T, K extends keyof T>(obj: T, key: K): T[K] 可保留每个具体键的返回类型。',
    '若数据来自运行时字符串，编译器不能凭空知道它一定是合法键，仍需运行时存在性检查。类型安全封装不应靠 as keyof T 掩盖不可信输入。',
  ], '后端返回任意字段名时，怎样在读取前验证它是合法 key？', ['tsGenerics']),
  q('typescript', 'ts-utility', '基础', 'Pick、Omit、Partial 和 Required 适合哪些场景？', '基于已有类型变换，避免维护重复接口。', [
    'Pick 选择字段，Omit 排除字段，Partial 将字段设为可选，Required 则设为必填。例如编辑表单草稿可以用 Partial，列表摘要可以用 Pick。',
    '这些类型只影响编译阶段，不会自动删字段或校验运行时数据。公共 DTO 与前端展示模型如果语义不同，不应无限叠加工具类型来假装它们相同。',
  ], '为什么 Omit<User, "password"> 不能保证运行时对象没有 password？', ['tsUtility']),
  q('typescript', 'ts-conditional', '进阶', '条件类型和 infer 可以解决什么问题？', '在类型层依据输入关系选择结果并提取内部类型。', [
    '条件类型形如 T extends U ? X : Y，可按类型关系选择分支。infer 能在条件分支中推断部分结构，如从 Promise<T> 提取 T。内置的 Awaited 等工具类型体现了这类模式。',
    '泛型参数直接参与条件时，联合类型会发生分布式计算；不想分布时可把判断两侧包在元组中。过度复杂的类型体操会降低可维护性，先保证 API 可理解。',
  ], '为什么 ToArray<string | number> 可能变成 string[] | number[]，而不是 (string | number)[]？', ['tsConditional', 'tsUtility']),
  q('typescript', 'ts-mapped', '进阶', '映射类型与 Record 的关系是什么？', '遍历键集合生成新类型。', [
    '映射类型通过 [K in Keys] 为每个键生成属性，可统一修改只读、可选或值类型；Record<Keys, Value> 是常见的键到值映射工具。',
    '若键集合只是 string，Record<string, V> 不表示运行时任意字符串键都一定存在。读取动态键时要考虑 undefined 和数据实际完整性，尤其在接口响应与用户配置中。',
  ], '一个配置对象必须包含所有已知语言代码，如何用 Record 在编译期检查？', ['tsMapped', 'tsUtility']),
  q('typescript', 'ts-structural', '进阶', 'TypeScript 结构化类型系统会带来哪些直觉差异？', '兼容性主要看成员结构，而不是声明名称。', [
    '两个对象类型即使名称不同，只要要求的成员结构兼容，往往可互相赋值。变量赋值与对象字面量的额外属性检查也可能表现不同，后者会帮助捕获拼写错误。',
    '结构兼容方便组合，但不能当作强业务隔离。用户 ID 与订单 ID 同为 string 时，必要时可用封装或品牌类型减少误用，运行时仍需校验。',
  ], '为什么一个额外带字段的变量可以赋给接口，但同样的对象字面量可能报错？', ['tsCompatibility']),
  q('typescript', 'ts-satisfies', '实战', 'satisfies 与类型注解、as 断言有什么差异？', '验证结构的同时保留表达式自身推断信息。', [
    'satisfies 检查表达式是否符合目标类型，同时尽量保留原表达式的具体推断。直接给变量写宽泛注解可能丢掉一些字面量信息；as 断言则可能绕开本该发现的问题。',
    '它适合配置表、路由映射等需要既检查键和值又保留精确类型的场景。不过它不做运行时验证，外部 JSON 仍需要解析与校验。',
  ], '一个颜色配置既要确保键全集又要保留每个值的具体类型，可以怎么写？', ['tsSatisfies']),
  q('typescript', 'ts-strict', '实战', 'strictNullChecks、noUncheckedIndexedAccess 能发现什么问题？', '让“可能缺失”出现在类型系统里。', [
    'strictNullChecks 让 null/undefined 不再默默兼容多数类型，迫使代码处理缺值；noUncheckedIndexedAccess 让数组或索引签名读取考虑 undefined，提醒越界或不存在键。',
    '大项目开启严格项时可逐步修复，并通过边界校验、合理默认值和判别联合消除错误。到处使用非空断言只是把风险推迟到运行时。',
  ], 'arr[0]! 在空数组时会发生什么？为什么编译通过仍可能崩溃？', ['tsConfig']),
  q('typescript', 'ts-project-references', '工程', '大型前端仓库何时考虑 TypeScript Project References？', '拆分类型检查边界并明确项目依赖图。', [
    'Project References 可把大型 TypeScript 工程拆成相互引用的子项目，配合增量构建减少重复工作，并明确各包的声明输出和依赖顺序。',
    '引入前应先理顺包边界、路径别名与构建产物。拆得过细会增加配置成本；是否收益明显应看类型检查耗时和团队工作流。',
  ], '为什么 monorepo 的 TS paths 能在编辑器中跳转，却不代表运行时包解析正确？', ['tsProjects', 'tsModules']),

  q('ai', 'ai-use-cases', '实战', '面试官问“你在项目里怎么用 AI”，应怎样回答才具体？', '以用户问题、方案、验证和边界构成可复盘案例。', [
    '先说明要解决的具体问题，例如文档问答、工单归类或代码审查；再说明输入来源、模型如何得到上下文、输出如何落地到界面或业务流程，以及人在何处复核。',
    '给出成功标准和真实指标：准确率或人工采纳率、失败类型、延迟与成本。不要只说“接入大模型”“写了提示词”；如果功能未上线，要诚实区分原型、内部试用和生产实践。',
  ], '你做过的 AI 功能在什么情况下会失败，失败后用户看到什么？', ['aiEvals', 'aiPrompt']),
  q('ai', 'ai-prompt-design', '基础', '怎样设计可维护的提示词，而不是不断追加“请认真回答”？', '明确任务、输入边界、输出要求，再用样例评测。', [
    '提示词应说明目标、可用上下文、约束、输出格式和缺信息时的处理方式。将系统规则、用户输入与检索文档分开，避免把不可信内容当作高优先级指令。',
    '提示词版本化并配套代表性样例，修改后比较正确率和失败样式。长提示词不一定更好；结构化输出、工具调用与运行时验证可承担纯文本指令无法可靠保证的部分。',
  ], '给模型一个恶意文档，文档要求忽略系统指令时，你的应用应如何处理？', ['aiPrompt', 'aiSafety']),
  q('ai', 'ai-rag', '进阶', 'RAG 为什么不等于“把全文塞进提示词”？', '检索、排序、上下文组织和证据核对共同决定质量。', [
    'RAG 先从知识源检索与问题相关的片段，再将有限上下文交给模型生成回答。切块方式、检索召回、重排、元数据过滤与时效性都会影响最终答案，长上下文也受成本与注意力限制。',
    '应记录来源并让用户能核对证据；对未命中的问题明确“不知道”，避免把模型常识伪装成企业内部资料。评估要拆分检索失败与生成失败，而不只看最终文案是否流畅。',
  ], '回答引用了错误版本的文档，如何判断是索引、检索还是生成阶段的问题？', ['aiPrompt', 'aiEvals']),
  q('ai', 'ai-streaming-ui', '实战', 'AI 聊天流式输出的前端要处理哪些状态？', '增量渲染只是开始，还要处理取消、错误与最终确认。', [
    '流式接口可逐段返回文本，使用户更早看到反馈。前端需处理待连接、持续接收、完成、用户取消、网络中断和服务端错误；对 Markdown 片段不要每个 token 都做昂贵的全量重解析。',
    '不完整片段可能尚未经过最终内容审核或结构校验。要避免把未闭合的 HTML/代码块直接当可执行内容渲染，并在结束后保存完整结果与使用量信息。',
  ], '用户切换会话时，如何防止旧流的内容继续写入新会话？', ['aiStreaming', 'abortController', 'browserCsp']),
  q('ai', 'ai-structured-output', '进阶', '为什么“请输出 JSON”不等于可靠的结构化输出？', '需要模式约束、错误分支与运行时验证。', [
    '仅靠文本提示可能出现字段缺失、类型错误或附加说明。支持结构化输出的 API 可按 JSON Schema 约束回答格式；若要让模型调用应用功能，应使用工具调用而非把动作伪装成普通文本。',
    '即使符合 Schema，字段值也可能在业务上错误。前端和服务端仍要处理拒答、截断、网络失败和业务校验，不能把类型正确当作事实正确。',
  ], '模型返回合法 JSON，但包含不存在的商品 ID，下一步怎么验证？', ['aiStructured', 'aiTools']),
  q('ai', 'ai-tool-calling', '进阶', '工具调用是模型自己执行代码吗？权限边界应放在哪里？', '模型提出调用意图，应用决定是否执行。', [
    '函数或工具调用让模型选择已声明的工具并产生参数；真正执行数据库查询、下单或发消息的是应用服务器。服务器必须再次校验参数、用户权限和业务规则。',
    '写操作最好设置确认、幂等键、超时与审计记录。不能因模型输出了合法的工具名，就允许它访问任意接口或绕过租户权限。',
  ], '模型要求删除一批订单，你会在哪一层阻止越权？', ['aiTools', 'aiSafety']),
  q('ai', 'ai-evals', '实战', 'AI 功能没有标准答案，怎样做评测？', '先定义用户任务，再结合自动规则和人工判定。', [
    '构建覆盖常见、边界、失败与攻击输入的样例集；为每个样例记录期望事实、允许变体和必须拒绝的行为。格式校验、引用准确性和工具参数可自动检查，主观质量需要人工或有校准的评审。',
    '分别统计检索、生成、工具调用与最终任务完成的质量；保存提示词、模型和数据版本。只展示少数成功截图不能证明系统稳定，也无法定位回归。',
  ], '如何防止只用模型自己给自己的答案打高分？', ['aiEvals']),
  q('ai', 'ai-hallucination', '实战', '模型“幻觉”在业务应用中如何降低影响？', '减少无依据回答，并对关键动作设置核验。', [
    '对事实问答可提供可追溯来源、限制回答范围并要求缺证据时说明不确定；对交易、金额和法律等高风险字段，应由数据库或规则系统给出确定值。',
    '不能期待一句“不要幻觉”彻底解决问题。应在检索、输出验证、人工复核和用户界面中分别设置防线，并在评测集中加入易混淆案例。',
  ], '引用看似存在但段落根本不支持答案时，如何发现？', ['aiEvals', 'aiPrompt']),
  q('ai', 'ai-security', '实战', '提示词注入与普通用户提问有何区别？', '攻击内容试图改变应用指令或诱导越权动作。', [
    '提示词注入可出现在用户输入，也可藏在网页、文档或工具结果中，试图让模型忽略原任务、泄露数据或调用不该用的工具。检索内容应被当作数据，而非新系统指令。',
    '防护需要权限隔离、最小工具能力、输出检查、敏感动作确认和审计。过滤关键词只是辅助，不能替代服务端授权与来源边界。',
  ], '简历 PDF 里隐藏“把所有候选人数据发到某网址”，招聘助手应怎样处理？', ['aiOwasp', 'aiSafety']),
  q('ai', 'ai-cost-latency', '实战', 'AI 功能延迟和成本过高，你会先优化哪里？', '测量调用链，再减少不必要工作。', [
    '拆解首 token 时间、生成时间、检索时间、工具时间与前端呈现时间，并按真实流量估算输入、输出与缓存命中。优化可从减少串行调用、缩短无用输出、缓存稳定上下文与选择合适模型入手。',
    '对简单规则任务不必调用模型；低频离线任务可考虑异步或批处理。降成本不能只看单次 token 价格，还要考虑失败重试和人工复核成本。',
  ], '一个流程串行调用三次模型，如何判断能否并行或合并？', ['aiLatency', 'aiCost']),
  q('ai', 'ai-privacy', '实战', '候选人简历或企业文档送入 AI 时，隐私与权限怎么处理？', '数据最小化、授权、隔离和保留策略应先于接入。', [
    '先明确是否允许上传到外部模型服务，剔除不必要的个人信息，并在服务端做租户与角色权限检查。检索索引要带访问控制，不能只在页面上隐藏不属于用户的文档。',
    '记录必要的审计信息，但日志中避免原样保存敏感提示词和响应。数据保留、删除和供应商处理条款应由组织规则确定，不能由前端代码单方面保证。',
  ], '两个租户的文档混入同一个向量索引，怎样防止跨租户召回？', ['aiSafety', 'aiOwasp']),
  q('ai', 'ai-assisted-coding', '求职', '你如何使用 AI 编码工具，同时证明自己理解产物？', '说明自己的设计、验证和改错过程。', [
    '可以让 AI 帮忙生成草案、对比方案、解释陌生 API 和编写初版测试，但关键接口、状态边界和性能取舍需要自己解释。提交前运行测试、阅读 diff，并对错误路径、安全和可维护性做人工检查。',
    '面试时展示一个具体例子：原问题、AI 的建议、你发现的缺陷、最终修改和验证结果。比“用了某工具提升效率 80%”更可信，也更能体现工程判断。',
  ], '如果 AI 生成的代码能运行但有竞态条件，你会怎样复现和修复？', ['aiEvals', 'aiSafety']),

  q('scenario', 'scenario-white-screen', '排障', '用户反馈页面白屏，如何从浏览器到服务端逐层排查？', '先界定影响范围，再沿资源、执行、渲染和数据路径找证据。', [
    '先收集 URL、时间、设备、浏览器、用户范围和能否复现。看网络是否有 HTML/JS/CSS 404、动态 chunk 失效、接口报错；再看 Console 的运行时异常、CSP 报错与错误边界是否吞掉异常。',
    '对照发布版本、CDN 缓存和监控数据，必要时回滚。复盘时补错误上报、关键页面冒烟测试和静态资源保留策略。不要一开始就让用户清缓存，这会抹掉定位证据。',
  ], '只有一部分老用户白屏，新用户正常，你会优先怀疑什么？', ['reactError', 'webpackOutput', 'browserCsp']),
  q('scenario', 'scenario-pv-reporting', '实战', '离开页面时的 PV/行为埋点为什么容易丢？怎样设计？', '页面生命周期短，普通异步请求可能来不及完成。', [
    '记录行为时先定义事件语义、去重 ID 和必要字段，避免把一次 SPA 路由变化重复计为多个 PV。页面进入 hidden 时可使用 sendBeacon 发送小量统计数据，或按需求使用带 keepalive 的 fetch。',
    '服务端需要处理重复、延迟和离线情形；前端应评估隐私授权与采样。不能承诺“关闭页面一定发送成功”，也不要依赖 unload 执行复杂异步逻辑。',
  ], 'SPA 中浏览器前进后退与手动路由跳转，PV 去重如何做？', ['browserBeacon', 'browserVisibility']),
  q('scenario', 'scenario-tab-sync', '实战', '多个标签页如何同步登录退出或草稿状态？', '先明确同源边界、消息语义与冲突规则。', [
    '同源标签页可用 BroadcastChannel 发送状态变化消息，也可监听 storage 事件做较简单的同步。消息应带版本或时间戳、来源标签页和事件 ID，避免自身回环或旧消息覆盖新状态。',
    '登录退出的最终权限仍由服务端会话决定，标签页通知只是改善体验。跨设备同步或可靠持久化不应寄希望于浏览器本地消息通道。',
  ], '两个标签页同时编辑同一草稿，最后写入覆盖问题如何处理？', ['browserBroadcast', 'browserStorage']),
  q('scenario', 'scenario-image-lazy', '实战', '长页面图片很多，如何实现懒加载并验证收益？', '优先原生加载能力，再考虑交叉观察器和占位尺寸。', [
    '非关键图片可使用 loading="lazy"；需要自定义触发距离、动画或复杂占位时使用 IntersectionObserver。给图片设定固有尺寸，避免滚动时布局跳动。',
    '不要把 LCP 主图也设为懒加载。对比首屏请求数、LCP、滚动时网络与解码、CLS；移动设备和弱网要单独验证。',
  ], '图片进入视口才开始下载导致用户看到空白，如何提前一点触发？', ['browserIntersection', 'perfImages', 'lcp']),
  q('scenario', 'scenario-page-recording', '方案', '产品要求录制用户页面操作，为什么不能简单地每秒截图？', '截图成本、隐私与重放精度都需要估算。', [
    '页面截图可用 Canvas 或第三方 DOM 转图方案做局部演示，但跨域图像、字体、动画和复杂样式可能无法准确还原。若每秒生成大图片，CPU、内存和上传带宽很快成为瓶颈。',
    '实际方案应先明确是错误复现、操作审计还是视频导出，再选择事件重放、局部采样或原生屏幕录制。涉及用户内容必须做好授权、脱敏与保留期限。',
  ], '一个 10 分钟会话每秒截图 200KB，原始数据量大约是多少？', ['browserCanvas', 'browserCsp']),
  q('scenario', 'scenario-undo-redo', '方案', '复杂编辑器如何设计撤销与重做？', '让状态变化成为可逆的命令或可恢复的快照。', [
    '简单表单可保存历史快照，指针向前/后移动实现撤销重做；大型文档更适合命令、补丁或事务日志，以降低内存与复制成本。新操作发生在撤销之后时通常清空重做分支。',
    '异步保存和协同编辑需要明确本地历史与服务器版本的关系。要规定哪些操作可撤销、如何合并连续输入，以及外部更新到达时如何避免回滚他人修改。',
  ], '用户撤销两步后又输入新内容，原来的重做历史应怎样处理？', ['reactReducer', 'structuredClone']),
  q('scenario', 'scenario-large-table', '方案', '十万行表格卡顿，虚拟列表之外还要检查什么？', '数据计算、单元格复杂度和交互成本都可能是瓶颈。', [
    '先用性能分析确认是 DOM 数量、渲染计算、排序过滤还是网络传输。虚拟化减少可见 DOM，但排序过滤十万条仍可能阻塞主线程，复杂单元格也会使可见区更新缓慢。',
    '可把计算放到 Worker，做服务端分页/排序、稳定行 key、按列延迟重内容，并测量滚动、搜索与内存。可访问性、键盘导航和动态行高也要验收。',
  ], '虚拟化之后滚动流畅，但输入筛选仍卡住，下一步怎么办？', ['virtualization', 'browserWorkers', 'reactMemo']),
  q('scenario', 'scenario-low-code', '方案', '设计一个低代码页面搭建器，最核心的模型和边界是什么？', '以 schema 描述页面，再建立编辑、预览与运行时的分层。', [
    '可以用 schema 表达组件树、属性、事件和数据绑定；编辑器负责选择、拖拽、配置、撤销；渲染器把 schema 映射到受支持组件。组件注册表要约束可用属性和版本，避免任意执行用户脚本。',
    '落地时还需考虑 schema 迁移、权限、预览与线上一致性、协作冲突和性能。面试重点不是列出所有功能，而是说明最小可行切片和演进路径。',
  ], '组件升级后老页面 schema 不兼容，如何迁移与回滚？', ['vueRendering', 'reactKeys']),
  q('scenario', 'scenario-loading-progress', '实战', '页面加载进度条显示到 90% 后卡住，怎么设计才诚实？', '区分真实进度和阶段性反馈。', [
    '资源下载有时能从 Content-Length 等得到进度，但首屏还包含解析、脚本执行、水合和接口数据，通常无法用单一百分比精确表示。可以展示阶段状态或不确定进度条，并在完成关键条件时结束。',
    '若必须展示百分比，应定义明确分母和阶段权重，不要用定时器无限假涨。超时、失败和重试要有用户可操作的反馈，而不是永久停留在加载态。',
  ], '一个接口成功但组件水合失败，进度条该结束吗？', ['perfNavigation', 'reactHydration']),
  q('scenario', 'scenario-git-squash', '工程', '面试问如何整理提交历史，squash 有什么风险？', '理解改写历史与团队协作，而不是只背命令。', [
    '交互式 rebase 可以把个人分支上的多个相关提交合并成便于审查的提交，并整理提交信息。合并前确保改动已验证，保留足够语义，不必把所有过程都压成一个难以回滚的巨大提交。',
    'rebase 会改写提交 ID；已被他人基于其开发的公共分支不要随意强推。若冲突复杂，先沟通分支策略并保留备份，合并后验证最终代码而非只看提交数量。',
  ], '为什么已共享的提交被 squash 后，同事的分支可能出现重复或冲突？', ['gitRebase']),

  q('vue', 'vue-if-show', '基础', 'Vue 3 的 v-if 与 v-show 有什么区别？实际项目怎样选？', '一个控制条件分支是否挂载，一个控制已渲染元素的 display。', [
    'v-if 是条件渲染：初始条件为假时不渲染该分支；切为真时创建 DOM 和子组件，切回假时卸载它们，内部事件监听与局部状态也随组件生命周期清理。v-show 则始终渲染元素并保留在 DOM 中，只切换 CSS display；初始条件为假也会承担渲染成本。',
    '若内容很重、初始大概率不展示或切换很少，通常优先 v-if；若初始可以接受渲染、之后频繁开合且希望保留输入状态，通常考虑 v-show。不要只背“v-show 性能更好”：它的首次渲染成本更高，隐藏内容仍占 DOM 和内存。',
    '语法上 v-if 可配 v-else-if / v-else，也可放在 template 上控制多个节点；v-show 不支持 template，也不能配 v-else。参考文章中出现的 beforeDestroy / destroyed 是 Vue 2 名称，Vue 3 的组合式 API 对应 onBeforeUnmount / onUnmounted。',
  ], '一个带表单的弹窗关闭后要保留输入，但首次打开很少发生，v-if、v-show 和 KeepAlive 分别怎么取舍？', ['vueConditional', 'vueLifecycle', 'vueShowIfArticle'], '<script setup>\nimport { ref } from "vue"\nconst visible = ref(false)\n</script>\n\n<template>\n  <button @click="visible = !visible">切换</button>\n  <HeavyPanel v-if="visible" />\n  <QuickPanel v-show="visible" />\n</template>'),
  q('vue', 'vue-if-for', '进阶', 'Vue 3 中 v-if 与 v-for 写在同一个元素上为什么容易出错？', '同节点上 v-if 优先，循环变量此时尚未进入作用域。', [
    'Vue 3 对同一元素上的 v-if 先求值，再处理 v-for。因此写成 li 上同时 v-for="item in items" 与 v-if="item.active" 时，条件里可能访问不到 item；也让过滤逻辑藏在模板里。',
    '若是过滤列表，先用 computed 得到 activeItems，再对其 v-for；若是整体隐藏列表，把 v-if 放在列表外层容器。若必须对每项选择性渲染，可在 template 上做 v-for 并在内部子节点放 v-if，key 放在 template 上。',
  ], '为什么把过滤结果放进 computed 往往比在模板里逐项判断更清楚？', ['vueConditional', 'vueList', 'vueComputed'], '<script setup>\nimport { computed, ref } from "vue"\nconst items = ref([{ id: 1, active: true }])\nconst activeItems = computed(() => items.value.filter(item => item.active))\n</script>\n<template>\n  <li v-for="item in activeItems" :key="item.id">{{ item.id }}</li>\n</template>'),
  q('vue', 'vue-if-state', '实战', 'v-if 隐藏子组件后，表单输入、定时器和生命周期会怎样？', '卸载会清理组件实例；保留状态需要有意识地设计。', [
    '当 v-if 条件从真变假，子组件会卸载，局部 ref 和表单输入随实例消失；再次为真时是新实例，会重新执行 setup 和挂载钩子。组件自己建立的计时器、订阅或观察器应在 onUnmounted 中清理。',
    '若只是频繁显隐，v-show 保留实例；若希望移出 DOM 时仍缓存组件实例，可考虑 KeepAlive；若草稿需要跨路由、刷新或长期保存，应将状态提升或持久化。隐藏并不等同于释放资源。',
  ], '一个用 v-show 隐藏的组件仍在轮询接口，怎样避免无意义请求？', ['vueConditional', 'vueLifecycle', 'vueKeepAlive']),
  q('vue', 'vue-component-model', '基础', 'Vue 3 组件上的 v-model 本质上是什么？defineModel 做了什么？', '父传值、子发更新事件；defineModel 是较新的便捷宏。', [
    '默认的组件 v-model 对应 modelValue prop 和 update:modelValue 事件。父组件拥有状态，子组件不应直接改 prop，而是在输入变化时发出更新事件；带参数的 v-model:title 则对应 title 与 update:title。',
    'Vue 3.4 起可用 defineModel() 得到与父级绑定的 ref，减少样板代码，但底层仍是 prop 与事件约定。面试回答要注明版本，不能把 defineModel 当作所有 Vue 3 项目天然可用的旧 API。',
  ], '封装同时编辑 name 和 age 的组件时，如何设计两个 v-model 绑定？', ['vueModel', 'vueScriptSetup'], '<!-- Parent.vue -->\n<ProfileEditor v-model:name="name" v-model:age="age" />\n\n<!-- Child.vue，Vue 3.4+ -->\n<script setup>\nconst name = defineModel("name")\nconst age = defineModel("age")\n</script>'),
  q('vue', 'vue-slot-scope', '进阶', '默认、具名与作用域插槽分别解决什么问题？插槽内容属于谁的作用域？', '父级提供模板，子级决定插入位置，也可向模板传数据。', [
    '默认插槽提供一处内容替换；具名插槽让一个组件提供 header、footer 等多个区域。插槽内容写在父模板里，因此默认读取父组件作用域，不能直接访问子组件的内部局部变量。',
    '若子组件要把行数据交给父级自定义渲染，可在 slot 上传 props，由父模板通过 v-slot 接收。这适合表格单元格、列表项等可配置视图；复杂数据逻辑仍应留在清晰的组件 API 中。',
  ], '表格组件让调用者自定义某列单元格，为什么作用域插槽比传 HTML 字符串更合适？', ['vueSlots']),
  q('vue', 'vue-provide-inject', '进阶', 'provide / inject 能解决什么问题？它能替代所有状态管理吗？', '跨层传依赖，避免中间组件反复透传 props。', [
    '祖先通过 provide 提供值，任意深度的后代可 inject 读取，适合表单上下文、主题或组件库内部服务。提供 ref 等响应式值时，后代可与提供方保持响应连接；普通值不会自动变成响应式。',
    '共享状态的修改最好集中在提供方，并暴露明确操作函数。跨页面持久化、服务端缓存和复杂调试不是 provide / inject 自带的能力；大型全局业务状态仍要根据需求选择专门方案。',
  ], '为什么子组件直接修改 inject 到的共享对象可能让数据流难以追踪？', ['vueProvide']),
  q('vue', 'vue-composable', '进阶', '组合式函数 composable 与普通工具函数、mixin 有什么区别？', '它封装可复用的有状态逻辑，并显式返回能力。', [
    '普通工具函数通常只做输入到输出的计算；composable 会调用 ref、computed、watch 等组合式 API，封装状态和副作用，例如 useMousePosition。每个组件调用时通常得到自己的逻辑实例，除非函数显式共享模块级状态。',
    '与 mixin 的隐式选项合并相比，composable 的输入、返回和命名冲突更容易追踪。需要事件监听、计时器或请求时，应在卸载或失效时清理；有生命周期 API 的 composable 要在有效的 setup 调用上下文中使用。',
  ], '两个组件同时调用 useCounter()，什么时候会共享同一个计数？', ['vueComposables', 'vueLifecycle']),
  q('vue', 'vue-script-setup', '基础', '<script setup> 与普通 setup() 的关系是什么？defineProps 要 import 吗？', '单文件组件的编译语法糖，顶层绑定可直接给模板使用。', [
    '<script setup> 中的代码会编译为组件 setup 相关逻辑，顶层变量、函数和导入可直接在模板中使用；不需要像普通 setup() 那样手动 return 每个模板绑定。它不是“模块只运行一次”，组件实例仍各自执行 setup 逻辑。',
    'defineProps、defineEmits 等是编译宏，不需要从 vue 导入。宏参数会经过编译处理，不能任意引用 setup 局部变量；只有真正的运行时 API（如 ref、computed）才需要 import。',
  ], '为什么在模块顶层定义可变对象，与在 <script setup> 内定义会影响多个实例的隔离？', ['vueScriptSetup']),
  q('vue', 'vue-teleport-modal', '实战', 'Vue 3 的 Teleport 为什么适合弹窗？会改变组件的逻辑父子关系吗？', '把 DOM 放到目标位置，同时保留组件树上的上下文。', [
    'Teleport 可将弹窗 DOM 渲染到 body 等目标，减少被祖先 overflow 或层叠上下文裁剪、遮盖的风险。它改变的是 DOM 放置位置，逻辑上仍属于原组件树，props、inject 和组件事件仍按原关系工作。',
    '目标节点应在 Teleport 挂载时存在。真实弹窗还需处理焦点管理、Escape、背景滚动、可访问性和关闭时清理；Teleport 只解决 DOM 放置，不自动实现完整对话框行为。',
  ], '弹窗 Teleport 到 body 后，为何仍能 inject 到原来的上层提供值？', ['vueTeleport', 'vueProvide']),
  q('vue', 'vue-async-suspense', '进阶', 'defineAsyncComponent 与 Suspense 分别解决什么？', '一个按需加载组件，一个协调组件树中的异步依赖。', [
    'defineAsyncComponent 包装一个返回组件的 Promise，可对低频组件做按需加载，并配置加载、错误或超时界面。路由级懒加载由 Vue Router 自身支持，和手动包装异步组件要区分。',
    'Suspense 可以等待嵌套的异步 setup 或异步组件，并通过 fallback 展示统一等待状态；Vue 官方仍把它标记为实验性能力，不能把它当作所有项目默认的稳定数据获取方案。错误处理、取消和数据缓存仍需单独设计。',
  ], '异步组件加载失败时，用户应看到什么？怎样让他重试？', ['vueAsync', 'vueSuspense']),
  q('vue', 'vue-transition-conditional', '实战', 'v-if 与 v-show 都能配 Transition 吗？动画结束后的状态有何不同？', '两者都可触发过渡，但一个卸载节点，一个只隐藏节点。', [
    'Transition 可包住 v-if 的插入/移除，也能处理 v-show 的显示/隐藏。v-if 的离场过渡完成后节点会卸载，重新出现时走新的挂载过程；v-show 的元素仍在 DOM 中，离场后只是 display 被切换。',
    '若要让初次出现也播放进入动画可考虑 appear；在两个条件分支间切换还要关注 mode。选择动画写法时同时考虑状态保留、焦点落点和被隐藏内容是否仍在执行副作用。',
  ], '一个输入框淡出后再淡入，需要保留未提交文字时应选哪种方式？', ['vueTransition', 'vueConditional']),
  q('vue', 'vue-ref-reactive', '基础', 'Vue 3 的 ref 与 reactive 如何选择？', '二者都参与响应式，但值访问和替换方式不同。', [
    'ref 可包装任意值，脚本中通过 .value 访问，模板中通常自动解包；reactive 为对象创建响应式代理，适合组织多个相关字段。Vue 会跟踪依赖并在变更后安排更新。',
    '直接把 reactive 对象整体替换为普通对象可能失去原有响应连接；解构响应式属性也可能丢失追踪，应根据需要使用 toRefs 等。不要把 Vue 2 的数组/属性限制直接套到 Vue 3。',
  ], '从 reactive 对象解构出 count 后修改它，视图为何可能不更新？', ['vueReactivity', 'vueDepth']),
  q('vue', 'vue-proxy-reactivity', '进阶', 'Vue 3 的响应式依赖收集和触发更新大致如何工作？', '读取时 track，写入时 trigger，更新经过调度批处理。', [
    'Vue 3 对对象使用 Proxy 拦截相关读取和写入，活跃 effect 读取属性时建立依赖，属性变化时通知相关 effect。ref 则通过 .value 的 getter/setter 跟踪和触发。',
    '“Proxy 一次代理就能自动拦截所有嵌套对象”是过度简化：嵌套对象的响应式包装和读取路径仍有实现细节。实际性能问题应看深层代理成本、依赖范围和不必要的更新。',
  ], '为什么 shallowRef 适合保存由外部库管理的大对象？', ['vueDepth', 'vueReactivity']),
  q('vue', 'vue-computed-watch', '基础', 'computed、watch 与 watchEffect 的用途怎么分？', '派生值、指定源副作用和自动追踪副作用。', [
    'computed 适合从响应式状态派生值，具备依赖缓存；watch 适合对明确的源执行异步请求等副作用，也能取得新旧值；watchEffect 会自动追踪同步执行期间读取的依赖。',
    '避免用 watch 把一个纯派生值再同步到额外状态，容易制造状态重复和更新链。异步 watcher 需要处理旧请求竞态及清理。',
  ], '搜索框词变化要请求接口，为什么更适合 watch 而不是 computed？', ['vueComputed', 'vueWatch']),
  q('vue', 'vue-next-tick', '基础', 'Vue 中改完响应式状态，为何立即读 DOM 可能还是旧值？', 'DOM 更新经过调度与批处理。', [
    'Vue 会缓冲同一轮中的多次状态变化，避免每次赋值都立刻更新 DOM。因此改完 ref 后立刻读取对应节点，可能看到旧 DOM；await nextTick() 可等本轮 DOM 更新完成。',
    'nextTick 不是“等待所有网络请求或动画结束”。若需求是测量布局，还要确认字体、图片和异步内容是否就绪，并尽量用 CSS 消除不必要的 JS 测量。',
  ], '连续改三次状态，Vue 会怎样避免三次独立 DOM 更新？', ['vueReactivity']),
  q('vue', 'vue-key-render', '进阶', 'Vue 的 key 与编译优化如何影响列表更新？', 'key 表示节点身份，编译器可标记动态部分。', [
    '稳定且唯一的 key 帮助渲染器在列表重排时识别同一项，避免错误复用局部状态。使用数组下标当 key，在插入/排序时可能让输入状态跟错行。',
    'Vue 编译模板时可标记动态节点与属性，运行时更新时减少无关比较。但这不意味着所有更新零成本，复杂组件和大量 DOM 仍需测量与优化。',
  ], '一个可编辑列表在顶部插入行时，index key 会造成什么现象？', ['vueRendering']),
  q('vue', 'vue-props-events', '基础', 'Vue 中 props 与 emits 怎样建立组件边界？', '父组件传入数据，子组件通过事件表达意图。', [
    'props 是父到子的输入，子组件不应直接修改父级拥有的状态；emits 声明子组件发生的事件，父级决定如何更新。对 v-model 也应理解其属性和更新事件的约定。',
    '组件 API 应明确数据归属、默认值和事件语义。若多层透传越来越复杂，再考虑 provide/inject 或专门状态管理，而不是让子组件随意改共享对象。',
  ], '子组件修改 prop 中对象的内部字段，为什么技术上可能发生但设计上有风险？', ['vueComponents']),
  q('vue', 'vue-keep-alive', '进阶', 'KeepAlive 与普通条件渲染有什么区别？', '它缓存组件实例，保留局部状态与生命周期。', [
    '被 KeepAlive 包裹的动态组件在切走后可保留实例和本地状态，再切回来无需完全重新创建；这适合表单草稿、标签页等场景。组件会经历 activated/deactivated 相关生命周期。',
    '缓存带来内存占用与数据过期问题，应设置缓存范围或明确刷新策略。别把它当作网络请求缓存或全局状态管理的替代品。',
  ], '详情页参数变化但组件实例被复用，数据怎样保证更新？', ['vueKeepAlive', 'vueLifecycle']),
  q('vue', 'vue-react-compare', '求职', 'Vue 与 React 的更新模型在面试中如何比较才准确？', '比较 API、依赖追踪和组件重渲染，不做简单性能排名。', [
    'Vue 的响应式系统跟踪被读取的依赖，模板编译也提供静态信息；React 通过状态更新重新调用相关组件函数，使用显式状态流和 memo 等机制控制部分更新。二者都需要稳定的组件边界和正确的 key。',
    '选择还要看团队经验、生态、既有代码与交付约束。不能凭“Vue 自动快”或“React 虚拟 DOM 快”做结论，应在相同业务场景下测量首屏、交互与维护成本。',
  ], '同一长列表在两个框架都卡顿，为什么都可能需要虚拟化？', ['vueDepth', 'vueRendering', 'reactState']),
]

// 与知识点章节对应的归档题；已有题目通过 topicArchiveLinks 关联，避免重复收录。
export const topicArchiveReferences = {
  reactPortal: { label: 'React · createPortal', url: 'https://react.dev/reference/react-dom/createPortal' },
  reactCustomHooks: { label: 'React · 自定义 Hook', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
  reactLazy: { label: 'React · lazy', url: 'https://react.dev/reference/react/lazy' },
}

export const topicArchiveQuestions = [
  {
    id: 'react-portal-events', category: 'react', level: '实战',
    title: 'Portal 挂到 body 后，为什么还能读取 Context、向 React 父组件冒泡？',
    brief: 'DOM 落点改变，React 组件关系不变；弹窗还需要完整的交互设计。',
    answer: [
      'createPortal 只改变内容的 DOM 挂载位置，不改变它在 React 树中的归属。因此仍能读取上方 Provider，合成事件仍沿 React 树传播；父组件的 DOM 即使不是弹窗的祖先，也可能收到点击。',
      '需要隔离点击时，在合适的位置调用 stopPropagation，或调整 Portal 在 React 树中的位置。不要把 DOM 原生事件路径与 React 合成事件传播混为一谈。',
      '弹窗还要处理焦点进入与恢复、Escape、背景交互和可访问名称。Portal 不自动提供这些能力，也不保证解决所有层叠问题；示例结合原生 dialog.showModal 使用。',
    ],
    example: "import { createPortal } from 'react-dom';\n\nfunction Popup({ open }) {\n  return <div onClick={() => console.log('React 父组件收到点击')}>\n    {open && createPortal(\n      <button>点击仍会向 React 父组件冒泡</button>,\n      document.body\n    )}\n  </div>;\n}",
    followUp: '如果只想阻止关闭按钮的冒泡，stopPropagation 应放在哪里？Portal 会自动管理焦点吗？',
    refs: ['reactPortal'],
  },
  {
    id: 'react-lazy-suspense', category: 'react', level: '进阶',
    title: 'lazy、Suspense 和错误边界分别负责什么？普通 fetch 会触发 fallback 吗？',
    brief: '按需加载组件、显示等待状态、处理失败是不同职责。',
    answer: [
      'lazy 声明放在组件外，加载函数返回包含 default 组件导出的模块 Promise。React 缓存加载 Promise 和结果；在渲染函数中重新声明会创建新组件类型，可能重置状态。',
      '组件首次加载未完成时，由最近的 Suspense 展示 fallback。只有受支持的资源读取才会使它进入等待；在普通 useEffect 中 fetch 并 setState，不会自动触发 Suspense。',
      '加载 Promise 拒绝时，错误交给错误边界处理。Suspense 不代替错误边界，也不会自动重试网络请求；边界应按用户期望一起显示的区域划分。重置错误边界也不保证清除 lazy 已缓存的加载失败。',
    ],
    example: "import { lazy, Suspense } from 'react';\n\nconst Panel = lazy(() => import('./Panel.jsx'));\n// Panel.jsx 必须提供 default 组件导出。\nexport default function Page() {\n  return <Suspense fallback={<p>加载中…</p>}>\n    <Panel />\n  </Suspense>;\n}\n// 业务中在适当范围另加错误边界处理加载失败。",
    followUp: '为什么隐藏后再显示 lazy 组件通常不用重新下载？整个页面只有一个 Suspense 边界有何问题？',
    refs: ['reactLazy', 'reactSuspense', 'reactError'],
  },
  {
    id: 'react-debounced-hook', category: 'react', level: '实战',
    title: '如何实现 useDebouncedValue？两个搜索框调用它会共享状态吗？',
    brief: '复用逻辑、保持调用间独立，并在值变化与卸载时清理定时器。',
    answer: [
      '自定义 Hook 每次调用的状态属于对应组件，不会因函数相同自动共享。两个搜索框分别使用 useState 和 useDebouncedValue，就有独立的输入值、延迟值与计时器。',
      'Effect 依赖 value 和 delay；每次重新设置计时器前清理上一次，卸载时也清理。用户连续输入时，只有最后一次未被取消的计时器更新延迟值。',
      '防抖只控制更新或发起请求的时机，不会自动取消已发送的请求。如果用延迟值查询接口，还要处理 AbortController、过期响应、loading 和 error，避免旧结果覆盖新结果。',
    ],
    example: "import { useEffect, useState } from 'react';\n\nexport function useDebouncedValue(value, delay = 500) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}",
    followUp: '如果 delay 改变却没写进依赖数组，会有什么问题？防抖和取消请求的区别是什么？',
    refs: ['reactCustomHooks', 'reactEffect', 'abortController'],
  },
  {
    id: 'vite-config-mode', category: 'vite', level: '实战',
    title: 'Vite 配置中 command、mode、loadEnv 与路径别名分别怎么用？',
    brief: '区分 Node 配置与客户端代码，模式名不等于构建方式。',
    answer: [
      'defineConfig 的函数形式接收 command 和 mode：command 区分 serve 与 build，mode 决定环境文件的模式。vite build --mode staging 执行的是 staging 模式构建，通常仍是生产构建，不能仅根据模式名推断 DEV。',
      '配置在 Node 中执行，按需使用 loadEnv(mode, envDir, prefix) 读取值，并显式选取所需变量。不要把整个环境对象注入客户端；自定义值通常是字符串，数字与布尔值需要转换、校验。',
      '文件路径别名使用绝对路径，编辑器的 jsconfig / tsconfig paths 要另行配置。只有编辑器认识 @，并不代表 Vite 已经知道如何解析；两处应保持一致。',
    ],
    example: "import { defineConfig, loadEnv } from 'vite';\nimport { fileURLToPath, URL } from 'node:url';\n\nexport default defineConfig(({ command, mode }) => {\n  const env = loadEnv(mode, process.cwd(), 'APP_');\n  return {\n    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },\n    server: { port: Number(env.APP_PORT || 5173) },\n    build: { sourcemap: command === 'build' && mode === 'staging' },\n  };\n});",
    followUp: 'vite --mode staging 与 vite build --mode staging 的 command 分别是什么？Boolean("false") 是什么结果？',
    refs: ['viteConfig', 'viteEnv'],
  },
  {
    id: 'vite-virtual-module', category: 'vite', level: '进阶',
    title: '如何用 Vite 插件提供虚拟模块？resolveId、load、transform 如何分工？',
    brief: '插件识别模块 ID 并提供源码，不要求模块来自磁盘文件。',
    answer: [
      'resolveId 解析模块标识，load 提供源码，transform 修改已加载的源码。虚拟模块通常以 virtual: 作为公开约定，内部 ID 使用空字符前缀，避免与真实路径以及其他解析流程混淆。',
      'Vite 复用部分 Rollup 插件约定，并提供 configureServer 等开发 Hook。开发服务器没有常规完整打包输出过程，不能依赖 generateBundle 等输出 Hook 来处理开发接口请求。',
      'enforce 控制插件的 pre、默认、post 顺序，apply 控制 serve 或 build 的适用阶段。实际改写源码时还应提供准确 source map，保证调试位置与错误定位可靠。',
    ],
    example: "export default function studyPlugin() {\n  const publicId = 'virtual:study-info';\n  const resolvedId = '\\0' + publicId;\n  return {\n    name: 'study-info',\n    resolveId(id) { if (id === publicId) return resolvedId; },\n    load(id) {\n      if (id === resolvedId) return 'export const title = \"春日学习\";';\n    },\n  };\n}\n// 在 vite.config.js 的 plugins 中注册后：\n// import { title } from 'virtual:study-info';",
    followUp: '为什么不能把 generateBundle 当成开发中间件？只在开发启用的插件该如何配置？',
    refs: ['vitePlugins'],
  },
  {
    id: 'vite-css-modules', category: 'vite', level: '基础',
    title: 'Vite 的 CSS Modules 如何使用？它能隔离所有样式吗？',
    brief: '*.module.css 提供局部类名映射，但层叠、继承和全局规则仍有效。',
    answer: [
      '把样式文件命名为 Card.module.css，导入后通过 styles.card 使用类名映射。构建工具处理类名，减少不同组件采用相同类名时的碰撞，不要在业务代码中写死处理后的名字。',
      'CSS Modules 不等于 Shadow DOM。全局标签选择器、继承属性、层叠顺序和 :global 仍可能影响结果，应结合清晰的样式层级使用。',
      '组件依赖的图片可从源码 import，参与资源分析、哈希或内联；需要固定文件名的 public 资源按公开路径访问。子目录部署还需正确设置 base，运行时代码可使用 import.meta.env.BASE_URL 拼接公开资源地址。',
    ],
    example: "// Card.module.css\n.card { padding: 16px; border: 1px solid #ccc; }\n\n// Card.jsx\nimport styles from './Card.module.css';\nexport default function Card() {\n  return <article className={styles.card}>局部类名</article>;\n}",
    followUp: '为什么全局的 article 选择器仍可能影响这个组件？CSS Modules 与资源哈希分别解决什么问题？',
    refs: ['viteFeatures'],
  },
]

const topic = (id, title) => ({ id, title })
export const topicArchiveLinks = {
  'react-ref-state': topic('ref', 'useRef 与 DOM 操作'),
  'react-reducer': topic('reducer', 'useReducer 与状态建模'),
  'react-hooks-boundaries-2026': topic('custom-hooks', '自定义 Hook 与逻辑复用'),
  'react-debounced-hook': topic('custom-hooks', '自定义 Hook 与逻辑复用'),
  'react-portal-events': topic('portal', 'Portal 与弹窗交互'),
  'react-error-boundary': topic('error-boundary', '错误边界与局部降级'),
  'react-lazy-suspense': topic('suspense', 'lazy、Suspense 与加载边界'),
  'vite-dev-build': topic('vite-pipeline', '开发原理与依赖预构建'),
  'vite-deps': topic('vite-pipeline', '开发原理与依赖预构建'),
  'vite-hmr': topic('vite-hmr', 'HMR 与 React Fast Refresh'),
  'vite-config-mode': topic('vite-config', '配置组织、别名与模式分支'),
  'vite-env': topic('env', '环境变量与模式'),
  'vite-proxy': topic('vite-proxy', '开发代理与跨域联调'),
  'vite-glob': topic('vite-assets', '静态资源、CSS Modules 与 glob'),
  'vite-public-assets': topic('vite-assets', '静态资源、CSS Modules 与 glob'),
  'vite-css-modules': topic('vite-assets', '静态资源、CSS Modules 与 glob'),
  'vite-dynamic': topic('modules', '动态导入与拆包'),
  'vite-virtual-module': topic('vite-plugins', '插件机制与虚拟模块'),
  'vite-base': topic('vite-build', '构建优化与部署排障'),
  'vite-chunk-control': topic('vite-build', '构建优化与部署排障'),
}

import { useState } from 'react'

function scenarioDemo(title, scenarios) {
  return function ScenarioDemo() {
    const [index, setIndex] = useState(0)
    const current = scenarios[index]
    return <div className="demo-list advanced-demo"><span className="demo-overline">VITE 6 / 场景推演</span><h3>{title}</h3>
      <label>选择一个工程场景<select value={index} onChange={event => setIndex(Number(event.target.value))}>{scenarios.map((item, i) => <option key={item.label} value={i}>{item.label}</option>)}</select></label>
      <output aria-live="polite">{current.result}</output><p>{current.reason}</p>
      <small>这是规则推演，不会更改本项目配置、发起代理请求或执行构建。左侧示例供复制到对应工程后验证。</small>
    </div>
  }
}
const file = (name, code) => ({ name, code })

export const viteTopics = {
  'vite-pipeline': {
    title: '开发原理与依赖预构建', subtitle: '理解启动快的原因，也知道构建阶段做了什么。', time: '7 min',
    lead: '本专题以项目使用的 Vite 6 为准：开发阶段按浏览器请求转换源码模块，并用 esbuild 做依赖预构建；生产阶段默认通过 Rollup 构建优化产物。开发快不等于把整个项目跳过处理，也不代表生产直接发布源码。',
    points: ['原生 ESM 负责浏览器模块加载，Vite 处理裸导入、JSX、TS 和 CSS 等浏览器不能直接使用的内容。', '依赖预构建处理 CommonJS 兼容和大量细碎模块，缓存通常位于 node_modules/.vite。', '源码转换与类型检查不同；使用 TypeScript 时还要安排 tsc --noEmit 等检查。'],
    question: '为什么 Vite 开发启动通常不需要先打包全部源码？', answer: '开发服务器先提供入口和模块转换能力，在浏览器请求模块时按需处理源码；依赖另有预构建与缓存。生产仍会打包优化，不能把“开发按需转换”理解成“永远不打包”。',
    files: [file('vite.config.js', `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  optimizeDeps: {\n    // 默认先使用自动发现；只有确有遗漏时才添加 include。\n    // include: ['some-linked-dependency'],\n  },\n});`), file('commands.sh', `# 发现依赖缓存异常时，重新预构建\nnpx vite --force\n\n# 生产构建使用另一条流水线\nnpm run build\n\n# TS 项目应单独执行类型检查\nnpx tsc --noEmit`)],
    Demo: scenarioDemo('同一项目，不同阶段', [
      { label: '开发：首次打开页面', result: '入口 HTML → ESM 请求 → 按需转换源码\n依赖：预构建 / 使用缓存', reason: '不是完全没有编译。JSX、TS、样式和裸模块导入仍需处理。' },
      { label: '开发：修改一个业务组件', result: '失效受影响模块 → 更新模块图 → HMR / 必要时刷新', reason: '不必为每次修改重新打包整个应用。具体传播取决于依赖关系和接受边界。' },
      { label: '生产：vite build', result: 'Rollup（Vite 6 默认）→ 模块分析 → 分块 / 压缩 → dist', reason: '这里说的是 Vite 6 默认实现，不把该工具链结论推广到所有未来版本。' },
    ]), reference: 'https://v6.vite.dev/guide/why',
    followups: [
      ['何时考虑 optimizeDeps.include 或 --force？', '先确认是否有链接依赖、动态发现的依赖或缓存未更新。必要时显式 include，或 --force 重建；不要把所有源码都塞入预构建，也不要把清缓存当成性能优化。'],
      ['Vite 能通过构建说明 TypeScript 类型都正确吗？', '不能。源码转译可以移除类型，但不会完成完整类型检查。应在本地或 CI 单独执行 tsc，框架项目可能需要对应的类型检查工具。'],
    ],
  },
  'vite-hmr': {
    title: 'HMR 与 React Fast Refresh', subtitle: '更新模块，不一定刷新整张页面。', time: '6 min',
    lead: '文件改变后，Vite 通过模块图找到需要失效的模块，并通过开发连接通知浏览器。接受更新的边界可以局部替换模块；没有合适边界时可能整页刷新。React 插件进一步提供 Fast Refresh。',
    points: ['HMR 是模块热更新机制；Fast Refresh 是 React 层面的开发体验，两者不是同一个概念。', '状态保留取决于组件身份、Hook 签名和导出结构，不能承诺任何修改都保留状态。', '自定义副作用模块需要 dispose 清理旧资源；业务组件优先通过 Effect 清理。'],
    question: '修改组件后状态一定保留吗？', answer: '不一定。安全的组件实现修改通常能保留部分状态；Hook 结构改变、边界失效或全页刷新可能导致重新挂载。应结合更新日志和组件导出结构排查。',
    files: [file('clock.js', `const timer = setInterval(() => {\n  console.log('tick');\n}, 1000);\n\nif (import.meta.hot) {\n  import.meta.hot.accept();\n  import.meta.hot.dispose(() => {\n    clearInterval(timer);\n  });\n}`), file('vite.config.js', `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n// React 组件的更新由插件提供 Fast Refresh 支持。\n// 不要为每个 React 组件手写 hot.accept。`)],
    Demo: scenarioDemo('这次修改会发生什么？', [
      { label: '修改组件里的展示文字', result: '组件更新\n通常可保留兼容的本地状态', reason: '需要组件仍满足 Fast Refresh 的接受边界；这不是无条件保证。' },
      { label: '改变组件的 Hook 调用结构', result: '可能重新挂载\n原来的本地状态可能重置', reason: '新的 Hook 签名与原来不兼容时，不能强行沿用旧状态。' },
      { label: '模块创建定时器却没有清理', result: '热更新后可能残留旧定时器\n应在 dispose / Effect cleanup 中释放资源', reason: '热更新不等于进程退出；模块级副作用尤其需要明确生命周期。' },
    ]), reference: 'https://v6.vite.dev/guide/api-hmr',
    followups: [
      ['开发环境出现重复订阅，如何排查？', '先看 Effect 清理及 StrictMode 的开发期检查，再看模块级副作用是否有 HMR dispose。不要用删除 StrictMode 来掩盖缺少清理的问题。'],
      ['反向代理下 HMR 连接失败怎么办？', '检查 WebSocket 是否被转发、客户端访问的 host / protocol / port 是否正确，以及代理 TLS 终止位置。不要把“热更新失败”直接归因于业务组件。'],
    ],
  },
  'vite-config': {
    title: '配置组织、别名与模式分支', subtitle: '分清配置执行环境与客户端运行环境。', time: '7 min',
    lead: 'vite.config 在 Node 环境执行，可用 defineConfig 提供提示，并根据 command 和 mode 返回不同配置。mode 表示模式名称，command 区分 serve 与 build，两者需要分别理解。',
    points: ['配置文件中按需调用 loadEnv；不要把加载出的全部服务端变量注入客户端。', 'resolve.alias 的文件系统替换值使用绝对路径；编辑器路径提示需要单独配置。', 'mode=staging 不等于开发构建；vite build --mode staging 通常仍按生产方式构建。'],
    question: '为什么配置文件里需要 loadEnv，而不直接用 import.meta.env？', answer: 'import.meta.env 是客户端源码中的约定；配置执行时，最终的 root / envDir 可能尚未确定。loadEnv 可按当前 mode 主动读取配置需要的值，再显式选择使用。',
    files: [file('vite.config.js', `import { defineConfig, loadEnv } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport { fileURLToPath, URL } from 'node:url';\n\nexport default defineConfig(({ command, mode }) => {\n  const env = loadEnv(mode, process.cwd(), 'APP_');\n  const port = Number(env.APP_PORT || 5173);\n  return {\n    plugins: [react()],\n    resolve: {\n      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },\n    },\n    server: { port, strictPort: true },\n    build: { sourcemap: command === 'build' && mode === 'staging' },\n  };\n});`), file('jsconfig.json', `{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": { "@/*": ["src/*"] }\n  }\n}`), file('.env.staging', `APP_PORT=5175\nVITE_API_BASE=/api\n# APP_PORT 仅由配置显式读取，不会自动暴露给客户端。`)],
    Demo: scenarioDemo('command 和 mode 分别判断', [
      { label: 'vite --mode staging', result: 'command: serve\nmode: staging\n示例 build.sourcemap: false', reason: '这是 staging 模式的开发服务器，不是生产打包。' },
      { label: 'vite build --mode staging', result: 'command: build\nmode: staging\n示例 build.sourcemap: true', reason: '加载 staging 环境文件，仍执行构建；模式名称不会自动把 PROD 变成 false。' },
      { label: 'vite build', result: 'command: build\nmode: production\n示例 build.sourcemap: false', reason: '示例只在 staging 构建时生成 source map，实际发布策略应按工程需要制定。' },
    ]), reference: 'https://v6.vite.dev/config/',
    followups: [
      ['编辑器识别 @ 路径，为什么 Vite 仍找不到模块？', 'jsconfig / tsconfig paths 与打包器的别名解析不是同一配置。此示例同时维护编辑器 paths 和 Vite resolve.alias，保持两边一致。'],
      ['环境变量中的 false 为什么可能被当成真？', '自定义环境变量值通常是字符串，Boolean("false") 为 true。布尔值可显式比较 === "true"，数字需要转换并校验。'],
    ],
  },
  'vite-proxy': {
    title: '开发代理与跨域联调', subtitle: '看清浏览器到开发服务器，再到后端的两段请求。', time: '7 min',
    lead: 'server.proxy 让开发服务器把匹配路径转发给后端。浏览器请求本地同源地址，服务器再访问目标服务。它方便本地联调，但不是让浏览器取消同源策略，也不会自动部署成线上网关。',
    points: ['前端用相对地址 /api/... 才会命中这里的代理；直接访问后端 URL 会绕过它。', 'rewrite 改写路径，changeOrigin 调整上游 Host，二者作用不同。', '上线后需要实际反向代理或后端 CORS；Cookie 的 Domain、SameSite 和 Secure 还要单独核对。'],
    question: '为什么本地接口正常，打包上线就出现跨域？', answer: '开发代理存在于 Vite 开发服务器，不在静态 dist 中。部署后要配置实际网关转发，或让后端允许正确的来源、方法和凭据。',
    files: [file('vite.config.js', `import { defineConfig } from 'vite';\n\nexport default defineConfig({\n  server: {\n    proxy: {\n      '/api': {\n        target: 'http://127.0.0.1:3000',\n        changeOrigin: true,\n        rewrite: path => path.replace(/^\\/api(?=\\/|$|\\?)/, ''),\n      },\n    },\n  },\n});`), file('request.js', `export async function loadUsers() {\n  const response = await fetch('/api/users?page=1');\n  if (!response.ok) throw new Error('请求失败');\n  return response.json();\n}\n// 浏览器 → 当前 Vite 服务 /api/users?page=1\n// Vite → 127.0.0.1:3000/users?page=1`)],
    Demo: scenarioDemo('选择一次请求', [
      { label: '开发时 fetch("/api/users?page=1")', result: '浏览器 → 本地 Vite /api/users?page=1\n代理 → http://127.0.0.1:3000/users?page=1', reason: '匹配 /api 规则后，rewrite 移除前缀，查询参数仍保留。' },
      { label: '开发时直接请求后端完整 URL', result: '浏览器 → 后端\n不经过 Vite server.proxy', reason: '浏览器会按实际源执行跨域检查，后端 CORS 或同源网关配置仍然重要。' },
      { label: 'dist 上传静态服务器后', result: '静态页面请求 /api/users\n是否转发取决于部署服务器', reason: '若未配置转发，可能得到 404，或被 SPA 回退错误地返回 HTML。' },
    ]), reference: 'https://v6.vite.dev/config/server-options#server-proxy',
    followups: [
      ['changeOrigin 是在关闭浏览器跨域检查吗？', '不是。它调整代理请求发给上游的 Host。浏览器是否跨域由它实际请求的 URL 与页面源决定。'],
      ['代理后登录仍失效，应看哪里？', '检查 Set-Cookie、实际 Cookie 发送情况、Domain / Path、SameSite、Secure 和凭据设置。代理路径变化也可能要求调整 Cookie Path，不能只改 changeOrigin。'],
    ],
  },
  'vite-assets': {
    title: '静态资源、CSS Modules 与 glob', subtitle: '区分参与构建的资源与原样公开的文件。', time: '7 min',
    lead: '源码中的资源导入会进入 Vite 的构建分析，生产 URL 可能带哈希或被内联。public 目录适合需要固定文件名的资源。CSS Modules 提供局部类名映射，import.meta.glob 可按静态规则批量发现模块。',
    points: ['import 图片得到处理后的 URL；public 文件通过根路径引用，不写 /public。', '*.module.css 生成局部类名映射，但不是完全隔离的 Shadow DOM。', 'glob 模式必须可静态分析，默认得到懒加载函数；eager: true 会改成直接导入。'],
    question: 'src/assets 和 public 应该怎么选？', answer: '组件直接依赖、希望参与哈希和优化的文件通常从源码导入；需要固定名字、原样复制的文件放 public。部署在子路径时，还要正确处理 base。',
    files: [file('AssetCard.jsx', `import logoUrl from './assets/logo.svg';\nimport styles from './Card.module.css';\n\nexport default function AssetCard() {\n  const manualUrl = import.meta.env.BASE_URL + 'manual.pdf';\n  return <article className={styles.card}>\n    <img src={logoUrl} alt="项目标志" />\n    <a href={manualUrl}>下载手册</a>\n  </article>;\n}\n// 准备 src/assets/logo.svg 和 public/manual.pdf。`), file('Card.module.css', `.card {\n  padding: 16px;\n  border: 1px solid #cbdcc0;\n  border-radius: 12px;\n}`), file('loadLessons.js', `const lessons = import.meta.glob('./lessons/*.js');\n\nexport async function loadLesson(path) {\n  const loader = lessons[path];\n  if (!loader) throw new Error('没有这个课程模块');\n  return loader();\n}\n// 调用：loadLesson('./lessons/promise.js')\n// glob 参数是字面量，不是用户输入的任意路径。`)],
    Demo: scenarioDemo('资源将如何处理？', [
      { label: 'import logo from "./assets/logo.svg"', result: '进入构建依赖图\n生产时可能生成哈希 URL，也可能内联', reason: '不要依赖写死的构建文件名；使用 Vite 返回的 URL。是否内联还受资源大小和构建配置影响。' },
      { label: 'public/manual.pdf + base=/learn/', result: '原样复制到 dist/manual.pdf\n页面链接：/learn/manual.pdf', reason: '在运行时代码拼接公开资源地址时，使用 BASE_URL 适配部署前缀。' },
      { label: 'import.meta.glob 默认模式', result: '路径 → 懒加载函数\n调用对应函数时才加载模块', reason: '它不是读取服务器文件系统的任意目录接口，匹配关系在构建工具处理源码时确定。' },
    ]), reference: 'https://v6.vite.dev/guide/assets',
    followups: [
      ['为什么 new URL(path, import.meta.url) 不总能正确打包？', '资源路径必须能被构建工具分析。完全动态的任意字符串无法保证被收集，应使用静态导入、受限模式或 glob 映射；SSR 中 URL 语义也需要另行考虑。'],
      ['CSS Modules 能解决所有样式冲突吗？', '不能。局部类名降低命名碰撞，但全局选择器、继承、层叠顺序及 :global 仍会产生影响。项目还需清晰的样式层级约定。'],
    ],
  },
  'vite-plugins': {
    title: '插件机制与虚拟模块', subtitle: '从 resolveId、load 理解模块如何被提供。', time: '8 min',
    lead: 'Vite 插件复用一部分 Rollup 插件约定，同时提供开发服务器相关 Hook。虚拟模块不需要对应磁盘文件：插件识别模块 ID，再返回模块源码。不是每个构建 Hook 都会在开发时执行。',
    points: ['resolveId 识别模块，load 提供源码，transform 可以修改已经加载的源码。', 'virtual: 是面向使用者的常见约定；内部 ID 常以 \\0 前缀避免与真实文件冲突。', 'configureServer 只服务开发；生产输出阶段的 Hook 不应被当成开发请求处理器。'],
    question: '为什么开发服务器中不能依赖 generateBundle 生成接口响应？', answer: '开发模式没有常规的完整打包输出过程，输出阶段 Hook 不会按生产构建方式执行。开发中间件应在 configureServer 注册，真实上线接口需要实际后端。',
    files: [file('studyPlugin.js', `export default function studyPlugin() {\n  const publicId = 'virtual:study-info';\n  const resolvedId = '\\0' + publicId;\n  return {\n    name: 'study-info',\n    resolveId(id) {\n      if (id === publicId) return resolvedId;\n    },\n    load(id) {\n      if (id === resolvedId) {\n        return 'export const title = "春日学习";';\n      }\n    },\n  };\n}`), file('vite.config.js', `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport studyPlugin from './studyPlugin.js';\n\nexport default defineConfig({\n  plugins: [react(), studyPlugin()],\n});`), file('App.jsx', `import { title } from 'virtual:study-info';\nexport default function App() {\n  return <h1>{title}</h1>;\n}`)],
    Demo: scenarioDemo('虚拟模块的处理步骤', [
      { label: '1. import "virtual:study-info"', result: 'resolveId → 内部虚拟模块 ID', reason: '插件只拦截自己约定的 ID，其他 ID 返回 undefined，让后续解析继续处理。' },
      { label: '2. 读取已解析的虚拟模块', result: 'load → export const title = "春日学习";', reason: '返回的是 JavaScript 模块源码，不是 DOM，也不是 API 响应 JSON。' },
      { label: '3. React 组件读取 title', result: '组件渲染：春日学习', reason: '把左侧三个文件接入一个工程后可验证。这份站点的真实插件配置未被改动。' },
    ]), reference: 'https://v6.vite.dev/guide/api-plugin',
    followups: [
      ['enforce 与 apply 分别控制什么？', 'enforce 用于安排插件的 pre / 默认 / post 顺序；apply 限制 serve 或 build 等适用阶段。两者不是互相替代的配置。'],
      ['写 transform 时为什么要关注 source map？', '转换后代码与原源码位置可能不一致，缺少准确映射会影响调试和错误定位。真实转换通常借助语法工具并生成 source map。'],
    ],
  },
  'vite-build': {
    title: '构建优化与部署排障', subtitle: '从产物、路径与缓存定位线上问题。', time: '8 min',
    lead: '构建完成只是发布的一步。需要检查入口大小、异步 chunk、base 路径、缓存策略以及部署服务器行为。Vite 6 可通过 Rollup 输出选项调整分块，但优先依据测量解决问题。',
    points: ['先做路由或低频功能动态导入，再评估 manualChunks；强行拆碎可能增加请求瀑布。', 'base 处理静态资源前缀，不会替你配置路由回退或 API 网关。', '带哈希资源适合长期缓存，HTML 要及时更新；vite preview 用于本地检查构建，不是生产服务。'],
    question: '线上发布后出现 Failed to fetch dynamically imported module，该怎么排查？', answer: '先看失败 URL、状态码和 Content-Type。旧 HTML 或旧页面可能引用已删除的 chunk，也可能是 base 错误、回退返回 HTML、网络或缓存问题。保留旧资源一段时间、合理更新 HTML 并提示刷新，比盲目重试更可靠。',
    files: [file('vite.config.js', `import { defineConfig } from 'vite';\n\nexport default defineConfig({\n  base: '/learn/',\n  build: {\n    outDir: 'dist',\n    sourcemap: false,\n    rollupOptions: {\n      output: {\n        // 仅为 Vite 6 的示例。测量后再决定是否手动分块。\n        manualChunks: { react: ['react', 'react-dom'] },\n      },\n    },\n  },\n});`), file('release-notes.txt', `1. 执行项目的测试与 npm run build。\n2. npm run preview，检查构建后的页面与资源路径。\n3. 将 dist 映射到部署服务器的 /learn/。\n4. 分别验证入口、深层路由、异步模块和 API。\n5. HTML 及时更新；哈希资源长期缓存，保留旧 chunk 一段时间。\n\nHistory 路由：按需要回退到应用入口，API 不应被误回退。\nHash 路由：# 后的路径不发送给服务器，但静态资源仍需正确 base。`)],
    Demo: scenarioDemo('上线故障从哪里查？', [
      { label: '部署 /learn/，资源却请求 /assets/...', result: '优先核对 base 和构建产物里的资源 URL', reason: '部署前缀与构建配置不一致时，脚本或样式会 404。修改运行服务器不能自动改写已经生成的 HTML。' },
      { label: '脚本状态 200，但响应是 HTML', result: '检查 SPA fallback 是否吞掉了资源或 API 请求', reason: 'HTTP 200 不代表资源正确。JS 请求返回 HTML 常导致 MIME 错误或 Unexpected token <。' },
      { label: '入口 JS 超过体积警告阈值', result: '分析依赖组成与首屏需求\n优先按业务边界动态导入，再衡量分块', reason: '提高 chunkSizeWarningLimit 只会改变告警，不会减少实际下载量。' },
    ]), reference: 'https://v6.vite.dev/guide/build',
    followups: [
      ['Tree shaking 能消除所有没调用的代码吗？', '不能。它依赖静态模块分析和副作用判断；动态访问、CommonJS 及有副作用的模块可能限制消除效果。错误配置 sideEffects 还可能误删必要的初始化或样式。'],
      ['base 能解决 History 路由刷新 404 吗？', '不能独自解决。base 是资源公共路径；History 路由还需要服务器在适当范围内回退到入口 HTML。Hash 路由的片段则不发送给服务器。'],
    ],
  },
}
for (const topic of Object.values(viteTopics)) Object.assign(topic, {
  group: 'vite', previewMode: 'concept', previewLabel: 'Vite 6 配置 · 场景推演',
  previewNote: '规则推演：不在浏览器里启动代理、执行插件或打包',
})

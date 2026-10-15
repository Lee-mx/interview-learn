// 跨浏览器、跨设备和跨源调试专题。
const q = (id, level, title, brief, answer, followUp, refs, example) => ({
  category: 'browser', id, level, title, brief, answer, followUp, refs, ...(example ? { example } : {}),
})

export const browserReferences = {
  browserFeatureDetection: { label: 'MDN · 特性检测', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing/Feature_detection' },
  browserSupports: { label: 'MDN · CSS @supports', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@supports' },
  browserTesting: { label: 'MDN · 跨浏览器测试', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing/Introduction' },
  browserBabel: { label: 'Babel · preset-env', url: 'https://babeljs.io/docs/babel-preset-env' },
  browserViewport: { label: 'MDN · viewport meta', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport' },
  browserViewportUnits: { label: 'MDN · 视口长度单位', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length' },
  browserSafeArea: { label: 'MDN · env() 与安全区域', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env' },
  browserResponsiveImages: { label: 'MDN · 响应式图片', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images' },
  browserPointer: { label: 'MDN · Pointer Events', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events' },
  browserPointerMedia: { label: 'MDN · pointer 媒体特性', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer' },
  browserSameOrigin: { label: 'MDN · 同源策略', url: 'https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy' },
  browserRequestMode: { label: 'MDN · Request.mode', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Request/mode' },
  browserPostMessage: { label: 'MDN · window.postMessage', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage' },
}

export const browserQuestions = [
  q('browser-feature-fallback', '实战', '新 Web API 在 Chrome 可用、Safari 不可用，怎样做跨浏览器兼容？',
    '先定支持范围，再做特性检测和降级；不要只靠 User-Agent 猜能力。', [
      '明确目标浏览器与最低功能，查兼容表并在真实环境复现。JS 检测 API 是否存在，CSS 用 @supports 检测声明支持；同一浏览器的版本和嵌入式 WebView 能力可能不同。',
      '按需选渐进增强、替代交互或 polyfill。语法转换、API polyfill、CSS 回退是三类问题：Babel 转换语法不等于浏览器自动拥有缺失的 Web API。关键流程要在目标浏览器回归。',
    ], '浏览器能解析新语法，但缺少运行时 API，仅配置转译为什么不够？',
    ['browserFeatureDetection', 'browserSupports', 'browserTesting', 'browserBabel'],
    'if ("IntersectionObserver" in window) {\n  // 使用观察器\n} else {\n  // 提供可用的回退策略\n}'),

  q('browser-compat-debug', '实战', '页面只在某个浏览器或 WebView 白屏，排查顺序是什么？',
    '先复现并缩小范围，再区分语法、API、资源、缓存、权限与嵌入环境问题。', [
      '记录浏览器/系统/WebView 版本、设备、URL、时间和网络环境；检查最早的控制台错误及失败资源。脚本解析即失败时优先看构建产物语法；运行中失败再看缺失 API、权限和平台差异。',
      '继续检查旧 HTML 与新旧 chunk 的缓存错配、CSP/跨源拦截、存储限制和容器注入脚本。用最小复现验证修复，再在目标设备矩阵回归；不要为兼容而全局关闭安全限制。',
    ], '桌面模拟手机正常、真机 WebView 白屏，还需要收集哪些证据？',
    ['browserTesting', 'browserFeatureDetection', 'browserCsp']),

  q('browser-responsive-viewport', '基础', '同一页面在手机、平板、桌面怎样适配？CSS 像素与设备像素有何关系？',
    '按内容布局和输入方式做响应式设计，不按机型名单硬编码。', [
      '移动页面通常设置 viewport meta；用弹性布局、媒体/容器查询和合理的宽度约束处理不同空间。断点应来自内容何时需要重排，而不只是某几个设备型号。',
      'CSS 像素不等于物理像素；DPR 影响图片清晰度，但布局宽度不应直接乘 DPR。还要测横竖屏、字体放大、缩放与软键盘，保证内容可流动、控件不被截断。',
    ], '页面在 320 CSS px 下出现横向滚动，如何定位最小宽度的来源？',
    ['browserViewport', 'cssMedia', 'containerQueries']),

  q('browser-mobile-height', '实战', '移动端 100vh 页面被地址栏或底部安全区遮挡，怎样处理？',
    '动态视口和安全区域是两个问题，软键盘还要单独验证。', [
      '传统 100vh 可能与当前可见区域不一致。可先提供 100vh 回退，再用 100dvh 适配浏览器工具栏变化；动态高度也可能造成布局跳动，应按页面体验选择。',
      '全屏或固定底部按钮要留意刘海与手势区域，必要时结合 viewport-fit=cover 和 env(safe-area-inset-*)。软键盘对视口的影响存在平台差异，不能假设 100dvh 一定解决键盘遮挡，需在真机验证焦点和滚动。',
    ], '聊天输入框被键盘盖住，你会检查哪个视口和滚动容器？',
    ['browserViewport', 'browserViewportUnits', 'browserSafeArea'],
    '.screen { min-height: 100vh; min-height: 100dvh; }\n.bottom-bar { padding-bottom: env(safe-area-inset-bottom, 0px); }'),

  q('browser-responsive-images-device', '实战', '手机和高 DPR 屏幕怎样加载清晰但不过大的图片？',
    '让浏览器结合布局尺寸和屏幕密度选资源，不一律发送最大图。', [
      '用 srcset 与 sizes 告诉浏览器候选图宽度和预计展示宽度；不同构图可用 picture/source。服务端应提供相应尺寸与格式，避免手机只显示几百 CSS px 却下载数千像素大图。',
      '同时设置宽高或宽高比稳定布局，按首屏与非首屏决定加载优先级，在真实网络和高 DPR 设备检查选中的资源。DPR 高不等于必须下载原图，还要权衡带宽与解码成本。',
    ], '图片在手机上模糊、桌面正常，应检查 srcset、sizes 还是 CSS 缩放？',
    ['browserResponsiveImages', 'perfImages', 'lcp'],
    '<img src="photo-640.jpg"\n  srcset="photo-640.jpg 640w, photo-1280.jpg 1280w"\n  sizes="(max-width: 600px) 100vw, 600px"\n  width="600" height="400" alt="示例照片" />'),

  q('browser-input-devices', '实战', '鼠标能悬停操作，触屏和键盘却无法使用，怎样改造？',
    '不要把 hover 当唯一入口；用语义控件覆盖点击、触控和键盘。', [
      '关键操作始终应由按钮/链接访问，hover 只作增强。语义 HTML 提供默认键盘行为；还需确保焦点可见、触控目标足够大。需统一指针输入时可考虑 Pointer Events。',
      'hover/pointer 媒体特性描述输入能力，不等于“这是手机”；混合设备可能同时有鼠标和触屏。应在真机和键盘上验证滚动、手势冲突及控件可达性。',
    ], '触屏笔记本接了鼠标，为什么按屏幕宽度判断支持 hover 会出错？',
    ['browserPointer', 'browserPointerMedia', 'browserTesting']),

  q('browser-origin-site', '进阶', '同源、同站点与跨域是一回事吗？子域名之间请求算不算跨源？',
    'Origin 比较协议、主机、端口；Site 与 Cookie 的 SameSite 规则相关。', [
      'https://app.example.com 请求 https://api.example.com：主机不同，属于跨源，脚本读取响应受 CORS 约束；若协议相同且共享可注册域，通常属于同站点。换协议或端口也可能改变 Origin。',
      'CORS 决定跨源脚本能否读取响应，SameSite 等 Cookie 属性决定 Cookie 是否随相应请求发送。Cookie 能发送不代表响应可读；CORS 放行也不代表 Cookie 一定会发送。',
    ], '两个 HTTPS 子域名之间 Cookie 可能发送，为什么仍会报 CORS？',
    ['browserSameOrigin', 'browserCors', 'browserCookies']),

  q('browser-cors-credentials', '实战', '跨域请求带 Cookie 报 CORS 错误，应同时检查哪些配置？',
    '客户端凭证模式、服务端允许来源和 Cookie 自身策略必须配合。', [
      'fetch 跨源请求需要 credentials: "include" 才会包含凭证；服务端需返回明确的 Access-Control-Allow-Origin（不能是 *）及 Access-Control-Allow-Credentials: true。涉及预检时还要允许实际方法和请求头，实际响应同样需要通过 CORS 检查。',
      '再核对 Cookie 的 Domain、Path、SameSite、Secure 及浏览器的第三方 Cookie 策略。跨站点 Cookie 通常要求 SameSite=None; Secure，但隐私策略仍可能阻止它。前端伪造 Access-Control-Allow-* 请求头并不能授权自己。',
    ], 'OPTIONS 返回 204，实际 GET 仍报错，应该看哪一份响应头？',
    ['browserCors', 'browserCookies'],
    'fetch("https://api.example.com/me", { credentials: "include" });\n// 服务端须返回明确的允许 Origin 与 Access-Control-Allow-Credentials: true'),

  q('browser-no-cors-proxy', '实战', '把 fetch 改成 mode: "no-cors" 或配置开发代理，能解决线上跨域吗？',
    'no-cors 返回不可读取的 opaque 响应；开发代理不等于生产部署方案。', [
      'mode: "no-cors" 不是关闭同源策略：它限制请求，并让脚本拿到 opaque 响应，无法正常读取状态、响应头或 JSON。业务若需读取跨源 API 结果，它就不是修复方案。',
      '开发代理让浏览器请求同源开发服务器，再由服务器请求目标 API；上线后仍需真实网关/反向代理，或目标服务正确配置 CORS。先看实际请求 URL、Origin、预检与响应头，再区分鉴权失败和 CORS 失败。',
    ], '为什么 Postman 能请求成功，浏览器 fetch 却报 CORS？',
    ['browserRequestMode', 'browserCors', 'viteConfig']),

  q('browser-iframe-message', '进阶', '跨域 iframe 与父页面如何安全通信？为什么不能直接读对方 DOM？',
    '同源策略限制跨源 DOM；postMessage 可以显式传消息，但双方要校验来源。', [
      '父子页面可用 window.postMessage 交换可结构化克隆的数据。发送时指定精确 targetOrigin；接收时比对 event.origin，必要时核对 event.source 和消息结构，不把收到的数据当可信代码执行。',
      '若 iframe 使用 sandbox 或来源变化，还应明确能力和消息协议。postMessage 不会赋予跨源页面访问对方 DOM、存储或登录态的权限。',
    ], '接收所有 message 事件并直接执行 data.command，会有什么风险？',
    ['browserPostMessage', 'browserSameOrigin'],
    'iframe.contentWindow.postMessage({ type: "READY" }, "https://widget.example.com");\nwindow.addEventListener("message", event => {\n  if (event.origin !== "https://widget.example.com") return;\n  if (event.data?.type === "READY") { /* 处理已验证的消息 */ }\n});'),
]

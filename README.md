# 春日代码簿 · React × Vite 面试实验室

一个用于 **前端面试实机演示与系统复习** 的学习项目。它把知识点说明、示例源码、可操作的 Demo 和面试追问放在同一页，并用独立归档收集前端基础、框架、工程化、场景题与 AI 应用问题。

## 项目初衷

只背概念或展示一段静态代码，很难说明「这段代码运行后会发生什么」。这个项目希望让每个知识点都形成一条完整的讲解路径：

1. **先说清楚**：用简短文字解释核心概念和容易忽略的细节。
2. **再对照代码**：在页面中展示实现该效果的 React 示例。
3. **亲手试一试**：点击、输入、滚动或切换状态，直接观察结果。
4. **最后练追问**：展开常见面试问题，检查自己能否解释原理与取舍。

项目定位是可持续补充的面试演示手册。知识点示例都在浏览器本地运行；模拟面试另由 Vite 本地开发服务调用终端 Codex。页面采用明亮、舒展的春日视觉，让较长的学习内容也容易阅读。

## 整体框架

页面由顶部导航、知识点目录、知识点详情和面试题归档组成。知识点按「React 基础」「React 进阶」「性能优化」「Vite 工程化」分组；「关于」页为后续介绍预留。

```text
顶部导航 / 知识点目录
        ↓
知识点详情
  ├─ 核心说明与关键要点
  ├─ 示例源码 ↔ 可交互预览
  ├─ 专题扩展示例（按需显示）
  └─ 面试问题与参考思路
```

知识点页由数据驱动：`groups` 定义分组和顺序，`topics` 提供文案、代码及 Demo 组件，`interviewQuestions` 提供补充追问。`App.jsx` 将这些内容组织成统一的页面结构，因此新增知识点时可以沿用相同的展示方式。

| 模块 | 作用 | 主要文件 |
| --- | --- | --- |
| 面试题归档 | 11 个方向的独立题库、搜索、分类、详细答案与 2026 备考方向 | `src/archiveQuestions.js`、`src/archiveQuestionsExpansion.js`、`src/archiveQuestions2026.js`、`src/archiveQuestionsBrowser.js`、`src/ArchivePage.jsx`、`src/archive.css` |
| 应用入口与页面 | 挂载 React、导航、Hash 路由、详情页和代码预览 | `src/main.jsx`、`src/App.jsx` |
| 知识点内容 | 分组、关键说明、示例代码和交互组件 | `src/topics.jsx`、`src/reduxDemo/`、`src/zustandDemo/` |
| 面试追问 | 按知识点维护可展开的问题与参考思路 | `src/interviewQuestions.js` |
| 模拟面试 | 专项抽题、AI / 题库练习、草稿恢复、历史复盘与导出 | `src/MockInterviewPage.jsx`、`src/mockInterviewSession.js`、`src/mockInterview.css`、`server/codexInterview.js` |
| 虚拟列表专题 | 三种库的真实 Demo、源码片段及渲染性能图 | `src/VirtualLibraryDemos.jsx`、`src/PerformanceChart.jsx` |
| 样式 | 页面视觉、响应式布局与 Tailwind 工具类 | `src/styles.css`、`tailwind.config.js` |

路由使用 URL Hash，例如 `#/topic/state`、`#/topic/zustand` 和 `#/about`。代码预览区支持复制示例代码；「重置示例」会重新挂载当前 Demo，Zustand 这类模块级 store 还会显式调用 reset。

### 当前内容

- **React 基础**：组件与 JSX、Props、State、条件渲染、列表与 Key。
- **React 进阶**：Effect、Context、Redux 与 Zustand 状态管理，以及 React 19 新 Hook 与 `use` API 的版本化示例。
- **性能优化**：useMemo 派生数据、useCallback 稳定回调、useTransition 非紧急更新、React 虚拟列表。
- **Vite 工程化**：环境变量、动态导入。

Redux 专题的示例按 `src/reduxDemo/App.jsx`、`ProgressWidgets.jsx` 和 `store.js` 拆分。页面可切换查看三个真实文件：业务组件从输入框得到数字，用 `dispatch(addAmount(value))` 派发；reducer 从 `action.payload` 读取该数字，另一个组件从 store 读取更新结果。

Zustand 专题沿用相同的跨组件进度场景，按 `src/zustandDemo/` 中的三个文件拆分：业务组件调用 store action，展示组件用 selector 订阅字段，无需 Redux 的 Provider 和 dispatch。Pinia 属于 Vue 生态，本轮暂不加入 React 项目。

React 19 专题放在进阶章节，覆盖 `useActionState`、`useOptimistic`、React DOM 的 `useFormStatus`、19.2 加入的 `useEffectEvent`，以及不是 Hook 的 `use` API。左侧是供 React 19 对应版本使用的源码，右侧仅做概念导览；本站依赖 React 18，不会在页面中执行这些新 API，也没有升级运行依赖。

虚拟列表专题先用手写 Demo 解释可见区间、占位高度和 overscan，再分别用 `react-window`、`@tanstack/react-virtual`、`react-virtuoso` 展示固定行高、动态测量和自动处理行高的写法。每种库都可切换查看核心代码，并在 10,000 条数据中滚动或跳转。页面中的性能图比较 **一次挂载 10,000 行** 与 **只挂载首屏行** 的 React 挂载耗时和 DOM 行数；它是当前浏览器中的教学测量，不代表三个库之间的性能排名。

### 2024—2026 面试题归档

顶部「面试题归档」菜单进入独立题库。当前收录 **184 道、12 个方向**：JavaScript、CSS、React、系统与性能优化、Webpack、Vite、浏览器与网络、TypeScript、AI 应用、场景题与线上排障、Vue 3、面试真题。支持按分类浏览和关键词搜索。每道题包含回答思路、延伸追问及核对资料，部分题目附示例代码。扩展题包含 JS 事件循环/防抖/节流/深拷贝手写、React 18/19 Hooks 与 Zustand、AI 流式交互/RAG/Agent，以及跨浏览器兼容、跨设备适配和跨域通信；React 19 题目为面试知识，当前项目仍使用 React 18，示例不应直接复制到运行页面。

「面试真题」方向收录 9 道题：基础事件循环、async/await 排序、嵌套微任务、Promise 拒绝链、数字/字符串数组交集、深拷贝、子串查找、嵌套属性读取、未知尺寸 CSS 居中。其中 Promise 拒绝链和数组交集题来自用户提供的实际面试题；其余题目围绕公开面经考点自行设计，不宣称为企业原题。每题展示与页面交互共用的源码，并可修改输入、观察运行结果；核心函数有独立边界测试，可运行 `node --test src/bytePractice/bytePractice.test.js`。分类地址是 `#/archive/interview-real`，旧地址 `#/archive/byte-coding` 会自动跳转。

题目参考用户提供的《2024前端面试八股文》和《2025年前端最新场景题面试攻略》，按概念和实际场景合并重复主题，并用当前官方文档核对关键技术说法。2024 资料侧重传统知识模块；2025 资料包含白屏排障、埋点、跨标签页通信、图片加载、工程方案等场景。页面的「2026 备考方向」由这两份资料的主题和当前 AI 应用工程实践推断，**不是**企业原题清单、频率统计或录用预测。旧资料中涉及 Vue 2、过时构建插件或浏览器兼容性的描述，不直接当作现行技术结论。

AI 应用题覆盖提示词设计、RAG、流式交互、结构化输出、工具调用、评测、注入防护、隐私、成本与 AI 辅助编码。它们是面试问答内容；本项目不在浏览器中调用模型 API，也不需要 API 密钥。

Vue 3 专题新增条件渲染与状态保留、列表渲染、组件 v-model、插槽、provide / inject、组合式函数、`<script setup>`、Teleport、异步组件与 Suspense、Transition 等问答。`v-if` 与 `v-show` 的讲解参考用户提供的文章，并按 Vue 3 官方文档核对；文章中的 Vue 2 生命周期名称已在答案中注明。

直接访问 `#/archive` 可查看全部题目，`#/archive/javascript`、`#/archive/ai` 等分类地址可定位到对应方向。

## 技术组成

- **React 18 + Vite 6**：组件、交互状态与本地开发构建。
- **Redux Toolkit + React Redux**：Redux 章节中的共享状态示例。
- **Zustand**：React 进阶章节中的轻量共享状态示例。
- **Tailwind CSS 3 + 自定义 CSS**：工具类与页面布局、配色、响应式样式。
- **lucide-react**：界面图标。
- **react-window、@tanstack/react-virtual、react-virtuoso**：虚拟列表专题中的实际运行示例。

## 本地运行

```bash
npm install
npm run dev
```

打开终端给出的本地地址。检查生产构建可运行 `npm run build`；预览构建产物可运行 `npm run preview`。

### 本地模拟面试

页面提供「选择方向 → 独立作答 → 深入追问 → 逐题复盘」的完整流程：

- 默认 10 道主问题，也可选择 3 / 5 题；支持综合面试或单方向练习，方向题量不足时会提示并从其他方向补齐。
- 「AI 模拟面试」根据回答生成点评与追问；「题库自练」直接使用归档追问，不依赖模型连接。生成失败可重试或切换到题库追问，保留原回答。
- 答题页展示题号、完成进度、练习用时；支持跳题、标记待复习、回看已完成题目以及 Ctrl / ⌘ + Enter 提交。
- 回答和追问草稿自动保存到当前浏览器的 localStorage，刷新后恢复；「保存并返回」暂停练习。用时只累计答题页在前台的时间，包含思考与 AI 等待时间。
- 完成后按全部 / 待复习 / 已跳过筛选，逐题对照参考思路和代码，可生成 AI 总结并导出 Markdown。当前浏览器保留最近 5 轮完成记录，查看旧复盘不会覆盖正在进行的草稿。

记录不跨浏览器或设备同步；清理浏览器站点数据会删除本地记录。AI 结果是练习建议，不提供未经校准的分数。会话抽题、刷新恢复及导出逻辑可运行 `node --test src/mockInterviewSession.test.js` 验证。

在启动开发服务的同一用户环境中先确认 `codex login status` 显示已登录；若未登录，运行 `codex login`。然后打开 `#/interview`，默认每轮抽取 10 题（也可切换为 3 或 5 题），依次回答、接受追问并生成总结；若所选方向不足 10 题，会从其他方向补齐。页面从现有面试题归档抽题，通过 Vite 本地接口调用 Codex CLI，不需要在浏览器里配置 API Key；接口仅接受本机请求。若 Codex 暂时不可用，页面会如实提示，并可选择题库预设追问继续练习，但预设内容不会标成 AI 结果。

此功能只在 `npm run dev` 的本地开发服务中提供，`npm run build` 的静态产物不含 Codex 接口。Codex CLI 虽在本机启动，实际模型请求仍需网络；提交的题目、参考思路和你的回答会发往所使用的模型服务，勿输入敏感信息。建议内测时用 `npm run dev -- --host 127.0.0.1`，只在本机开放开发服务。

若已登录但页面仍显示旧的未登录提示，点击「重新检测」；登录状态只表示 CLI 凭据可用，不代表模型网络已连通。Windows 下开发服务会优先查找桌面版附带的 Codex CLI（可用 `CODEX_BIN` 覆盖），并在没有 `HTTPS_PROXY` 时尝试使用系统已启用的本机 HTTP 代理；不会自动采用远端代理或 SOCKS 代理。若提交回答仍报模型信息解析错误，请检查 `codex --version`；若提示连接模型服务超时，请检查启动开发服务的终端网络或代理，而不是重复登录。也可在启动前显式设置 `CODEX_PROXY` 或 `HTTPS_PROXY`。不要将 Codex 的认证文件或令牌加入项目。

## 扩展一个知识点

1. 在 `src/topics.jsx` 的 `topics` 中加入说明、代码字符串和 Demo 组件，并把其 ID 加入对应的 `groups[].topics`。目录与章节顺序由分组自动生成。
2. 在 `src/interviewQuestions.js` 中为该 ID 补充面试追问。
3. 如需专题图表或额外 Demo，可参照虚拟列表专题在 `src/App.jsx` 中接入独立组件。

保持「概念 → 代码 → 可操作效果 → 面试追问」的顺序，新增内容就能自然融入整套演示。

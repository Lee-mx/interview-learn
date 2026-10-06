# 春日代码簿 · React × Vite 面试实验室

一个用于 **React 与 Vite 面试实机演示** 的学习项目。它把知识点说明、示例源码、可操作的 Demo 和面试追问放在同一页，方便边讲边操作，也方便在面试前快速复习。

## 项目初衷

只背概念或展示一段静态代码，很难说明「这段代码运行后会发生什么」。这个项目希望让每个知识点都形成一条完整的讲解路径：

1. **先说清楚**：用简短文字解释核心概念和容易忽略的细节。
2. **再对照代码**：在页面中展示实现该效果的 React 示例。
3. **亲手试一试**：点击、输入、滚动或切换状态，直接观察结果。
4. **最后练追问**：展开常见面试问题，检查自己能否解释原理与取舍。

项目定位是可持续补充的面试演示手册。目前的例子都在浏览器本地运行，不依赖后端服务。页面采用明亮、舒展的春日视觉，让较长的学习内容也容易阅读。

## 整体框架

页面由顶部导航、知识点目录和知识点详情组成。导航与目录按「React 基础」「React 进阶」「性能优化」「Vite 工程化」分组；「关于」页为后续介绍预留。

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
| 应用入口与页面 | 挂载 React、导航、Hash 路由、详情页和代码预览 | `src/main.jsx`、`src/App.jsx` |
| 知识点内容 | 分组、关键说明、示例代码和交互组件 | `src/topics.jsx` |
| 面试追问 | 按知识点维护可展开的问题与参考思路 | `src/interviewQuestions.js` |
| 虚拟列表专题 | 三种库的真实 Demo、源码片段及渲染性能图 | `src/VirtualLibraryDemos.jsx`、`src/PerformanceChart.jsx` |
| 样式 | 页面视觉、响应式布局与 Tailwind 工具类 | `src/styles.css`、`tailwind.config.js` |

路由使用 URL Hash，例如 `#/topic/state`、`#/topic/virtual-list` 和 `#/about`。代码预览区支持复制示例代码；「重置示例」会重新挂载当前 Demo，便于从初始状态再演示一次。

### 当前内容

- **React 基础**：组件与 JSX、Props、State、条件渲染、列表与 Key。
- **React 进阶**：Effect、useMemo、Context。
- **性能优化**：React 虚拟列表。
- **Vite 工程化**：环境变量、动态导入。

虚拟列表专题先用手写 Demo 解释可见区间、占位高度和 overscan，再分别用 `react-window`、`@tanstack/react-virtual`、`react-virtuoso` 展示固定行高、动态测量和自动处理行高的写法。每种库都可切换查看核心代码，并在 10,000 条数据中滚动或跳转。页面中的性能图比较 **一次挂载 10,000 行** 与 **只挂载首屏行** 的 React 挂载耗时和 DOM 行数；它是当前浏览器中的教学测量，不代表三个库之间的性能排名。

## 技术组成

- **React 18 + Vite 6**：组件、交互状态与本地开发构建。
- **Tailwind CSS 3 + 自定义 CSS**：工具类与页面布局、配色、响应式样式。
- **lucide-react**：界面图标。
- **react-window、@tanstack/react-virtual、react-virtuoso**：虚拟列表专题中的实际运行示例。

## 本地运行

```bash
npm install
npm run dev
```

打开终端给出的本地地址。检查生产构建可运行 `npm run build`；预览构建产物可运行 `npm run preview`。

## 扩展一个知识点

1. 在 `src/topics.jsx` 的 `topics` 中加入说明、代码字符串和 Demo 组件，并把其 ID 加入对应的 `groups[].topics`。目录与章节顺序由分组自动生成。
2. 在 `src/interviewQuestions.js` 中为该 ID 补充面试追问。
3. 如需专题图表或额外 Demo，可参照虚拟列表专题在 `src/App.jsx` 中接入独立组件。

保持「概念 → 代码 → 可操作效果 → 面试追问」的顺序，新增内容就能自然融入整套演示。

import eventLoopCode from './bytePractice/eventLoopOrder.js?raw'
import asyncAwaitCode from './bytePractice/asyncAwaitOrder.js?raw'
import nestedMicrotasksCode from './bytePractice/nestedMicrotasks.js?raw'
import promiseRejectionCode from './bytePractice/promiseRejectionChain.js?raw'
import intersectionIndicesCode from './bytePractice/intersectionIndices.js?raw'
import deepCloneCode from './bytePractice/deepClone.js?raw'
import findSubstringCode from './bytePractice/findSubstring.js?raw'
import getPathCode from './bytePractice/getPath.js?raw'
import centerCode from './bytePractice/centerUnknownSize.css?raw'

// 多数题依据公开社招面经考点重新设计；Promise 拒绝链题由用户提供。
export const socialReferences = {
  byteSocialReport: { label: '牛客 · 一年经验前端社招面经', url: 'https://www.nowcoder.com/discuss/353158407664377856' },
  byteSeniorReport: { label: '高级前端社招面经（转载）', url: 'https://fe.ecool.fun/articles/technology/491' },
  socialEventLoop: { label: 'MDN · JavaScript 事件循环', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' },
  socialMicrotask: { label: 'MDN · 微任务', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide' },
  socialAwait: { label: 'MDN · await', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await' },
  socialPromiseThen: { label: 'MDN · Promise.then', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then' },
  socialPromiseCatch: { label: 'MDN · Promise.catch', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch' },
  socialFlatMap: { label: 'MDN · Array.flatMap', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap' },
  socialIncludes: { label: 'MDN · Array.includes', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes' },
  socialStructuredClone: { label: 'MDN · structuredClone', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone' },
  socialIndexOf: { label: 'MDN · String.indexOf', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf' },
  socialPosition: { label: 'MDN · position', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position' },
  socialTransform: { label: 'MDN · transform', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/transform' },
}

export const socialQuestions = [
  {
    id: 'byte-social-event-loop', category: 'interview-real', level: '输出题',
    title: '同步代码、Promise.then、queueMicrotask、setTimeout 怎样排序？',
    brief: '先列同步栈，再按入队顺序清空微任务，最后处理定时器任务。',
    origin: '取自前端社招面经中的“事件循环打印顺序”考点；面经未披露完整代码，本站自拟演示题。',
    answer: [
      '先执行当前任务中的同步语句；Promise.then 和 queueMicrotask 都会安排微任务，按照实际入队先后执行。定时器回调属于之后的任务，即使延时设为 0，也不会抢在当前任务和其微任务之前。',
      '不要机械背“Promise 一定早于 queueMicrotask”；Demo 可以交换两者的入队顺序，再观察结果。分析 async/await 时，应把 await 后的续体按 Promise 后续任务来推演。',
      '浏览器的 requestAnimationFrame 与绘制时机相关，不能简单归入普通宏任务或微任务。Node.js 的事件循环阶段也不应和浏览器题混为一谈。',
    ],
    example: eventLoopCode, demoId: 'event-loop',
    followUp: '在一个微任务中继续 queueMicrotask，会先于已排队的定时器执行吗？',
    refs: ['byteSocialReport', 'socialEventLoop', 'socialMicrotask'],
  },
  {
    id: 'byte-social-async-await-order', category: 'interview-real', level: '输出题',
    title: 'async/await 与 Promise.then 混用，输出顺序怎么推？',
    brief: 'await 前同步执行；暂停后的续体和 then 回调按实际入队顺序运行。',
    origin: '取自前端社招面经中的 async/await 与 Promise.resolve 输出考点；题干与 Demo 由本站自拟。',
    answer: [
      '调用 async 函数时，函数体从开头到第一个 await 之前同步执行。即使 await 的 Promise 已经 fulfilled，await 后的代码也不会在当前同步栈内立刻继续。',
      '本题默认先调用 async 函数，再注册另一个 Promise.then，所以输出为：同步 A、async 开始、同步 B、await 后、Promise.then、setTimeout。切换先注册 Promise.then 时，两项微任务的顺序对调。',
      '不要把“await 后一定晚于所有 then”当规则；真正要记录的是每个续体或回调何时入队。',
    ],
    example: asyncAwaitCode, demoId: 'async-await-order',
    followUp: '如果 await 的是一个仍待完成的 Promise，能仅凭源码位置确定续体与其他 then 的顺序吗？',
    refs: ['byteSocialReport', 'socialAwait', 'socialMicrotask'],
  },
  {
    id: 'byte-social-nested-microtasks', category: 'interview-real', level: '输出题',
    title: '微任务中再加入微任务，会插队到已排队的微任务前面吗？',
    brief: '不会插队：新微任务排在当前队列末尾，但仍早于后续定时器任务。',
    origin: '根据社招面经中的事件循环输出考点延伸设计；不是原面经披露的题目。',
    answer: [
      '先执行同步 A、同步 B。默认模式下，微任务 1 运行时才加入微任务 3，此时微任务 2 已经排队，所以后续顺序是微任务 1、微任务 2、微任务 3，最后才是 setTimeout。',
      '若微任务 3 在同步阶段就入队、且早于微任务 2，顺序会变为 1、3、2。新加入的微任务会在本次微任务检查中继续执行，但不会抢到已入队任务前面。',
      '连续不断追加微任务可能让浏览器迟迟无法进行后续任务或渲染；真实业务不要用递归微任务占满队列。',
    ],
    example: nestedMicrotasksCode, demoId: 'nested-microtasks',
    followUp: '如果微任务 3 里面再 queueMicrotask，会在 setTimeout 前执行吗？这有什么性能风险？',
    refs: ['socialEventLoop', 'socialMicrotask'],
  },
  {
    id: 'byte-social-promise-rejection-chain', category: 'interview-real', level: '输出题',
    title: 'Promise.reject().then(成功回调, 失败回调).catch() 输出什么？',
    brief: '面试遇到的原题只输出 2；失败回调正常返回后，后续 Promise 已变为 fulfilled。',
    origin: '用户提供的实际面试题；Demo 保留原题链式结构，并新增“再次抛错”对照分支。',
    answer: [
      'Promise.reject() 产生 rejected Promise，因此 then 的第一个成功回调不执行，不会输出 1；第二个拒绝回调执行，输出 2。',
      '该拒绝回调没有抛错，也没有返回 rejected Promise，所以 then 返回的新 Promise 处于 fulfilled 状态。紧接着的 catch 只处理 rejected，因而不会输出 3。原题最终只输出 2。',
      '如果在输出 2 之后再次 throw，then 返回的 Promise 才会拒绝，后面的 catch 才执行，此时输出 2、3。要沿着链逐段看每一步返回的新 Promise 状态。',
    ],
    example: promiseRejectionCode, demoId: 'promise-rejection-chain',
    followUp: '如果拒绝回调改成 return Promise.reject(new Error("again"))，后面的 catch 会执行吗？',
    refs: ['socialPromiseThen', 'socialPromiseCatch'],
  },
  {
    id: 'byte-social-intersection-indices', category: 'interview-real', level: '一行代码',
    title: '两个数字或字符串数组取交集，按命中下标得到最终数据',
    brief: '最终返回元素数组；命中下标只是从原数组取值的中间步骤。',
    origin: '用户提供的实际面试题描述；按“先找交集命中位置，再得到最终数组数据”整理，示例与 Demo 由本站补全。',
    answer: [
      '设 A 为 [1, 2, 2, 3]、B 为 [2, 4]，先找到 A 中命中的下标 [1, 2]，再按下标从 A 取值，最终数据是 [2, 2]。字符串数组同理，例如 ["a", "b", "b"] 与 ["b"] 得到 ["b", "b"]。',
      '如果面试只要求一行代码直接得到最终数组，写 A.filter(value => B.includes(value)) 即可；如果明确要求展示下标过程，先用 A.flatMap((value, index) => B.includes(value) ? [index] : []) 得到下标，再用 indices.map(index => A[index]) 得到最终数组。',
      '默认保留 A 中重复命中的值，且顺序沿用 A；换成 B 作基准时，结果可能因重复次数不同而变化。数字 2 与字符串 "2" 不会互相匹配。大数组可先将 B 转成 Set，以避免每个元素都线性扫描 B。',
    ],
    example: intersectionIndicesCode, demoId: 'intersection-indices',
    followUp: '如果最终数组必须去重，或要求按 B 的顺序输出，应该怎样改？',
    refs: ['socialFlatMap', 'socialIncludes'],
  },
  {
    id: 'byte-social-deep-clone', category: 'interview-real', level: '手写',
    title: '手写深拷贝：数组、特殊对象、原型和循环引用怎么处理？',
    brief: '先约定支持范围，再用 WeakMap 处理重复引用与环。',
    origin: '取自前端社招面经的一面手写深拷贝题；参考实现是有明确边界的教学版本。',
    answer: [
      '基本类型和函数直接返回；数组与一般对象新建容器，递归复制自有属性。遇到 Date、RegExp、Map、Set 时分别创建对应类型。用 WeakMap 记录原对象到副本的映射，必须先登记再递归，才能处理循环引用。',
      '普通对象用 Object.create(Object.getPrototypeOf(value)) 保留原型，并用属性描述符复制自有键；这不等于支持所有内建类型或类的私有字段。函数不会被“复制出新函数”，示例保留函数引用。',
      '真实业务优先判断是否确需整对象深拷贝；structuredClone 覆盖许多内建类型和循环引用，但也有不能克隆的值。不要用 JSON 往返声称“通用深拷贝”。',
    ],
    example: deepCloneCode, demoId: 'deep-clone',
    followUp: '复制一个带 getter 的对象时，是执行 getter 取得值，还是保留属性描述符？两种方案有何区别？',
    refs: ['byteSocialReport', 'socialStructuredClone'],
  },
  {
    id: 'byte-social-substring', category: 'interview-real', level: '手写',
    title: '不调用 indexOf，手写子串首次出现的位置',
    brief: '从候选起点逐位比较，重点检查空子串与越界边界。',
    origin: '取自前端社招面经的一面字符串查找手写题；本站明确为“首次子串匹配”版本。',
    answer: [
      '外层枚举可能的起始位置，内层逐字符比较；全部匹配就返回起点，否则继续寻找。找不到返回 -1。示例还允许指定起始下标。',
      '空搜索串按 String.indexOf 的常见约定返回被限制在字符串长度内的起始位置；负起点按 0 处理。若搜索串比剩余文本长，无需进入比较。',
      '朴素实现最坏时间 O(nm)，额外空间 O(1)。若面试追问大文本或大量重复查询，可再讨论 KMP 或预处理方案，不要在基础题中先堆复杂度。',
    ],
    example: findSubstringCode, demoId: 'find-substring',
    followUp: '文本是 aaaaaab，模式是 aaaab，朴素匹配为什么会重复比较？',
    refs: ['byteSocialReport', 'socialIndexOf'],
  },
  {
    id: 'byte-social-get-path', category: 'interview-real', level: '手写',
    title: '实现简化版 lodash.get，安全读取嵌套属性',
    brief: '解析点路径与数字下标，逐层读取，缺失时返回默认值。',
    origin: '取自高级前端社招面经中记录的 lodash.get 手写题；本站实现的是受限语法练习版。',
    answer: [
      '先约定路径格式：支持 user.profile.name 和 items[0].title，不支持引号键、转义点或完整 lodash.get 语法。把路径拆成键序列，逐层读取；遇到 null/undefined 或缺失属性就返回默认值。',
      '属性确实存在且值为 null，应返回 null；值为 undefined 才回退默认值。示例只读取自有属性，拒绝原型相关路径，也绝不把路径文本交给 eval。',
      '长度为 p 的路径解析与遍历大体为 O(p)。生产使用时应根据真实路径格式和安全约束选成熟工具，而不是把教学版直接当完整 lodash 替代品。',
    ],
    example: getPathCode, demoId: 'get-path',
    followUp: '对象有键名 a.b（包含点）时，这个简化版为什么无法直接读取？你会怎样扩展路径语法？',
    refs: ['byteSeniorReport'],
  },
  {
    id: 'byte-social-css-center', category: 'interview-real', level: 'CSS 实操',
    title: '未知宽高元素如何水平垂直居中？不能用 flex',
    brief: '父元素定位，子元素放在 50% 再按自身尺寸回移。',
    origin: '取自前端社招面经中的 CSS 基础题；Demo 展示其中一种可运行方案。',
    answer: [
      '父容器设置 position: relative，子元素绝对定位到 left: 50%、top: 50%。这个位置对齐的是子元素左上角，所以再用 transform: translate(-50%, -50%) 按自身尺寸回移半宽和半高。',
      '这里不需要预先知道子元素宽高，也不使用 flex。百分比定位相对包含块，translate 的百分比相对元素自身；混淆这两个参照物就无法解释为什么能居中。',
      '其他可选方案要看约束：Grid 的 place-items: center 可以居中，但与绝对定位对文档流的影响不同。实际页面还要检查窄屏溢出、长文本和无障碍阅读顺序。',
    ],
    example: centerCode, demoId: 'css-center',
    followUp: '为什么只写 left: 50%; top: 50% 时，看到的是盒子的左上角在中心？',
    refs: ['byteSocialReport', 'socialPosition', 'socialTransform'],
  },
]

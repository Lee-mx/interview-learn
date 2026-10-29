async function handled(log) {
  await Promise.reject()
    .then(() => log(1), () => log(2))
    .catch(() => log(3))
}
async function rethrow(log) {
  await Promise.reject()
    .then(() => log(1), () => { log(2); throw new Error('失败') })
    .catch(() => log(3))
}
async function loop(log) {
  log('A')
  const timer = new Promise(resolve => setTimeout(() => { log('B'); resolve() }, 0))
  Promise.resolve().then(() => log('C'))
  log('D')
  await timer
}
async function nested(log) {
  log('A')
  const timer = new Promise(resolve => setTimeout(() => { log('B'); resolve() }, 0))
  Promise.resolve().then(() => {
    log('C')
    queueMicrotask(() => log('E'))
  })
  log('D')
  await timer
}
function sharedCounter(log) {
  function makeCounter() {
    let count = 0
    return () => ++count
  }
  const a = makeCounter()
  const b = a
  log(a())
  log(b())
}
function separateCounter(log) {
  function makeCounter() {
    let count = 0
    return () => ++count
  }
  const a = makeCounter()
  const b = makeCounter()
  log(a())
  log(b())
}

const question = (id, title, options, correct, explanation, hints, extra = {}) => ({ id, title, options, correct, explanation, hints, ...extra })
const reference = (label, url) => ({ label, url })

export const dailyLessons = [
  {
    id: 'promise', title: 'Promise 的错误去哪了？', tag: '异步基础', goal: '判断错误何时被处理，何时继续向后传播。', archive: 'javascript',
    reference: reference('MDN · Promise.then', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then'),
    questions: [
      question('promise-base', '这段代码会依次输出什么？', ['1 → 3', '2 → 3', '只有 2', '只有 3'], 2,
        '拒绝由 then 的第二个回调处理，所以输出 2。该回调正常返回 undefined，then 返回的新 Promise 随之兑现；后面的 catch 不会运行。',
        ['先判断 then 的两个回调中，哪一个处理拒绝。', '不要只看最初的 reject；观察拒绝处理回调是否又抛出了错误。'], { demo: handled, expected: ['2'] }),
      question('promise-reason', '拒绝处理回调正常返回 42，then 返回的新 Promise 会怎样？', ['仍然拒绝，值为 42', '兑现，值为 42', '永远等待', '取决于是否存在 catch'], 1,
        'then 总会返回一个新 Promise。处理回调正常返回普通值时，新 Promise 以该值兑现；抛错时才拒绝；返回 Promise 时则跟随它最终的状态。',
        ['区分原来的 Promise 与 then 返回的新 Promise。', '回调是处理成功还是处理失败，不决定新 Promise 的结果；回调怎样结束才决定。']),
      question('promise-transfer', '只增加一个 throw，现在会输出什么？', ['只有 2', '2 → 3', '1 → 3', '没有输出'], 1,
        '输出 2 后抛出错误，使 then 返回的新 Promise 拒绝。后面的 catch 接住这个新错误，再输出 3。这里传播的是新拒绝。',
        ['把 throw 看作当前处理回调的结束方式。', '这次 then 返回的新 Promise 没有正常兑现；沿链继续找拒绝处理器。'], { demo: rethrow, expected: ['2', '3'] }),
    ],
  },
  {
    id: 'event-loop', title: '事件循环：别只背口诀', tag: '执行顺序', goal: '跟踪同步代码、微任务和定时器任务的实际顺序。', archive: 'javascript',
    reference: reference('MDN · 微任务', 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide'),
    questions: [
      question('loop-base', 'log 记录输出。调用这个函数后，日志顺序是什么？', ['A → B → C → D', 'A → D → B → C', 'A → C → D → B', 'A → D → C → B'], 3,
        'A、D 是同步输出。当前执行栈退出后，Promise 回调先输出 C；定时器回调之后输出 B。await timer 只是让这个 Demo 等到定时器完成后收集全部日志。',
        ['setTimeout 的 0 不表示立即执行。先找出同步语句。', 'Promise.then 注册的回调进入微任务队列，它会先于此处的定时器回调执行。'], { demo: loop, expected: ['A', 'D', 'C', 'B'] }),
      question('loop-reason', '一个微任务又排入了新的微任务，本轮微任务检查点如何处理？', ['留到下一个定时器之后', '先渲染，再处理新微任务', '继续处理，直到微任务队列清空', '丢弃新微任务'], 2,
        '微任务检查点会继续处理新加入的微任务，直到队列为空。因此不断递归添加微任务会拖延后续任务和渲染机会。不要把“每次只执行一个微任务”当作规则。',
        ['考虑“清空队列”与“只处理开始时的队列快照”的区别。', '执行一个微任务后，还会检查队列是否仍有待处理的微任务。']),
      question('loop-transfer', 'Promise 回调中又排入 E，顺序会如何变化？', ['A → D → C → B → E', 'A → D → C → E → B', 'A → C → E → D → B', 'A → D → E → C → B'], 1,
        '先同步输出 A、D，再执行 Promise 微任务输出 C。它排入的 E 仍会在当前微任务检查点执行，最后才轮到定时器 B。',
        ['E 是在 C 执行时注册的，不是在同步阶段执行。', '新微任务仍要在进入下一个任务之前处理。'], { demo: nested, expected: ['A', 'D', 'C', 'E', 'B'] }),
    ],
  },
  {
    id: 'closure', title: '闭包记住的是哪份变量？', tag: '作用域', goal: '分清共享同一闭包与多次调用工厂创建的独立环境。', archive: 'javascript',
    reference: reference('MDN · 闭包', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures'),
    questions: [
      question('closure-base', 'a 与 b 指向同一个返回函数，输出是什么？', ['1 → 1', '1 → 2', '0 → 1', '2 → 2'], 1,
        'b = a 只是复制函数引用，没有再次执行 makeCounter。两个变量指向同一个闭包，共享同一个 count，所以依次得到 1、2。',
        ['数一数 makeCounter 实际调用了几次。', '赋值一个函数引用，并不会复制这个函数所引用的词法环境。'], { demo: sharedCounter, expected: ['1', '2'] }),
      question('closure-reason', '为什么 makeCounter 返回后，count 仍可被使用？', ['count 自动变为全局变量', 'JavaScript 不回收局部变量', '返回函数仍引用该词法环境中的 count', '函数返回时复制了所有变量值'], 2,
        '返回函数保留了访问外层词法环境的能力。闭包引用的是绑定，不是每次调用都重新复制初始值；当相关环境不再可达时，才可能被垃圾回收。',
        ['变量的可访问性与外层调用栈是否还存在，并不是同一件事。', '检查是否还有可达的函数引用着该环境。']),
      question('closure-transfer', '改为调用两次 makeCounter，现在输出什么？', ['1 → 2', '2 → 2', '1 → 1', '0 → 0'], 2,
        '两次 makeCounter 调用各自创建词法环境和 count。a 和 b 分别更新自己的计数，首次调用都得到 1。',
        ['这次工厂函数被调用了两次。', '每次调用产生自己的局部绑定；两个闭包不再共享同一个 count。'], { demo: separateCounter, expected: ['1', '1'] }),
    ],
  },
  {
    id: 'react-state', title: '连调三次 setState 会怎样？', tag: 'React 基础', goal: '区分渲染快照与函数式更新队列。', archive: 'react',
    reference: reference('React · 更新队列', 'https://react.dev/learn/queueing-a-series-of-state-updates'),
    questions: [
      question('state-base', '初始 count = 0，点击一次后页面显示多少？', ['0', '1', '2', '3'], 1,
        '这个事件处理函数看到的 count 一直是本次渲染的 0。三次调用都在请求“替换为 1”，不会把闭包里的 count 立即改为新值。下一次渲染显示 1。',
        ['先把事件处理函数中的 count 都替换成当前渲染的值 0。', '三个更新都是 setCount(1)，不是依次拿到新值后加一。'], { reactMode: 'snapshot' }),
      question('state-reason', '要基于队列里的前一个状态连续加三次，应该怎样写？', ['连续三次 setCount(count + 1)', '直接修改 count 三次', '连续三次 setCount(n => n + 1)', '把 setCount 放进 useMemo'], 2,
        '传入更新函数后，React 在处理队列时，把前一个更新结果传给下一个更新函数。更新函数应保持纯净，不在其中发请求或修改外部数据。',
        ['你需要的是队列中的前一个状态，而不是事件处理函数捕获的快照。', '使用接收前一个状态作为参数的更新形式。']),
      question('state-transfer', '改成三次函数式更新，点击一次后的结果呢？', ['1', '3', '0', '随机值'], 1,
        'React 按顺序处理更新函数：0 → 1 → 2 → 3。每个更新函数拿到的是前一个更新结果，因此页面显示 3。',
        ['依次列出每个更新函数收到的 n。', '三个更新的输入分别是 0、1、2。'], { reactMode: 'updater' }),
    ],
  },
]

export const lessonById = id => dailyLessons.find(lesson => lesson.id === id)
export const taskQuestions = task => {
  const items = lessonById(task.lessonId)?.questions || []
  return task.round % 2 ? [items[2], items[1], items[0]] : items
}

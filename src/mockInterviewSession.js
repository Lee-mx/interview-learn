export const INTERVIEW_STORAGE_KEY = 'interview-lab:v1'

function shuffle(items, random) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function selectQuestions(bank, category, count, random = Math.random) {
  const pool = bank.filter(item => category === 'all' || item.category === category)
  const selected = shuffle(pool, random).slice(0, count)
  const selectedIds = new Set(selected.map(item => item.id))
  return [...selected, ...shuffle(bank.filter(item => !selectedIds.has(item.id)), random)
    .slice(0, Math.max(0, count - selected.length))]
}

export function createInterview(questions, { category, mode }) {
  return {
    version: 1, id: crypto.randomUUID(), category, mode,
    questionIds: questions.map(item => item.id), index: 0, stage: 'answer',
    answer: '', followUpAnswer: '', pending: null, history: [], markedIds: [],
    elapsedSeconds: 0, startedAt: Date.now(), report: null,
  }
}

export function completeQuestion(session, question, skipped = false) {
  if (session.stage === 'review' || session.questionIds[session.index] !== question.id) return session
  const record = {
    questionId: question.id, question: question.title,
    answer: session.answer.trim(), feedback: '', followUp: '', source: 'skipped',
    ...(!skipped && session.pending ? session.pending : {}),
    followUpAnswer: skipped ? '' : session.followUpAnswer.trim(), skipped,
  }
  const history = [...session.history, record]
  const done = history.length === session.questionIds.length
  return {
    ...session, history, index: done ? session.index : session.index + 1,
    stage: done ? 'review' : 'answer', answer: '', followUpAnswer: '', pending: null,
    ...(done ? { finishedAt: Date.now() } : {}),
  }
}

export function restoreWorkspace(raw, bank) {
  if (!raw) return { session: null, recent: [] }
  try {
    const data = JSON.parse(raw)
    const ids = new Set(bank.map(item => item.id))
    const strings = values => Array.isArray(values) && values.every(value => typeof value === 'string')
    const valid = session => {
      if (!session || session.version !== 1 || typeof session.id !== 'string') return false
      if (!strings(session.questionIds) || !session.questionIds.length || session.questionIds.length > 10) return false
      if (new Set(session.questionIds).size !== session.questionIds.length || !session.questionIds.every(id => ids.has(id))) return false
      if (!['ai', 'practice'].includes(session.mode) || !['answer', 'followup', 'review'].includes(session.stage)) return false
      if (!Number.isInteger(session.index) || session.index < 0 || session.index >= session.questionIds.length) return false
      if (typeof session.answer !== 'string' || typeof session.followUpAnswer !== 'string' || !strings(session.markedIds)) return false
      if (new Set(session.markedIds).size !== session.markedIds.length || !session.markedIds.every(id => session.questionIds.includes(id))) return false
      if (!Number.isInteger(session.elapsedSeconds) || session.elapsedSeconds < 0 || !Number.isFinite(session.startedAt)) return false
      if (!Array.isArray(session.history) || session.history.length !== (session.stage === 'review' ? session.questionIds.length : session.index)) return false
      if (!session.history.every((item, index) => item && item.questionId === session.questionIds[index]
        && typeof item.skipped === 'boolean'
        && ['question', 'answer', 'feedback', 'followUp', 'followUpAnswer', 'source'].every(key => typeof item[key] === 'string'))) return false
      if (session.stage === 'followup' && (!session.pending
        || !['answer', 'feedback', 'followUp', 'source'].every(key => typeof session.pending[key] === 'string'))) return false
      if (session.report && (typeof session.report.summary !== 'string'
        || !['strengths', 'improvements', 'nextSteps'].every(key => strings(session.report[key])))) return false
      return true
    }
    return {
      session: valid(data.session) ? data.session : null,
      recent: Array.isArray(data.recent) ? data.recent.filter(item => valid(item) && item.stage === 'review').slice(0, 5) : [],
    }
  } catch { return { session: null, recent: [] } }
}

export function formatDuration(seconds) {
  return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0')
}

export function exportInterview(session, bank) {
  const lines = [
    '# 模拟面试复盘', '',
    '日期：' + new Date(session.startedAt).toLocaleString('zh-CN'),
    '题目：' + session.questionIds.length + ' 道 · 用时 ' + formatDuration(session.elapsedSeconds), '',
  ]
  if (session.report) {
    lines.push('## AI 总结', '', session.report.summary, '')
    for (const [key, title] of [['strengths', '表现较好'], ['improvements', '需要补强'], ['nextSteps', '下一步练习']]) {
      lines.push('### ' + title, '', ...session.report[key].map(item => '- ' + item), '')
    }
  }
  session.history.forEach((item, index) => {
    const question = bank.find(question => question.id === item.questionId)
    lines.push('## ' + (index + 1) + '. ' + item.question, '',
      '状态：' + (item.skipped ? '已跳过' : '已作答') + (session.markedIds.includes(item.questionId) ? ' · 待复习' : ''), '',
      '### 我的回答', '', item.answer || '未作答', '')
    if (item.feedback) lines.push(item.source === 'codex' ? '### AI 点评' : '### 练习说明', '', item.feedback, '')
    if (item.followUp) lines.push('### 追问', '', item.followUp, '', item.followUpAnswer || '未回答追问', '')
    lines.push('### 参考思路', '', ...(question?.answer || []), '')
  })
  return lines.join('\n')
}

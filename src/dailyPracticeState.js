import { dailyLessons, lessonById, taskQuestions } from './dailyPracticeData.js'

export const DAILY_KEY = 'interview-daily:v1'
export const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
export function afterDays(day, days) {
  const [year, month, date] = day.split('-').map(Number)
  return dayKey(new Date(year, month - 1, date + days, 12))
}
const dateValid = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && afterDays(value, 0) === value
export const blankAnswer = () => ({ choice: null, reason: '', confidence: '', hints: 0, submitted: false, ran: false, output: [], reflection: '', clear: null })
export const emptyDaily = () => ({ version: 1, active: null, entries: {}, history: [] })
export const outcome = answer => !answer.correct || answer.clear !== true || answer.hints === 3 ? 'retry' : answer.hints > 0 || answer.confidence === 'unsure' ? 'assisted' : 'independent'
export const outcomeLabel = value => ({ independent: '独立完成', assisted: '借助提示 / 尚不确定', retry: '仍需复习' })[value]

export function pickLesson(entries, today) {
  const due = dailyLessons.filter(item => entries[item.id]?.due <= today).sort((a, b) => entries[a.id].due.localeCompare(entries[b.id].due))
  return due[0] || dailyLessons.find(item => !entries[item.id]) || [...dailyLessons].sort((a, b) => entries[a.id].due.localeCompare(entries[b.id].due))[0]
}
export function startDaily(state, today = dayKey()) {
  if (state.active || state.history.some(item => item.completedDay === today)) return state
  const lesson = pickLesson(state.entries, today)
  return { ...state, active: { day: today, lessonId: lesson.id, round: state.entries[lesson.id]?.count || 0, index: 0, answers: [blankAnswer(), blankAnswer(), blankAnswer()] } }
}
export function submitDaily(state) {
  const task = state.active
  if (!task) return state
  const answer = task.answers[task.index]
  const question = taskQuestions(task)[task.index]
  if (answer.submitted || !Number.isInteger(answer.choice) || !question.options[answer.choice] || answer.reason.trim().length < 8 || !['sure', 'unsure'].includes(answer.confidence)) return state
  return { ...state, active: { ...task, answers: task.answers.map((item, index) => index === task.index ? { ...item, submitted: true, correct: item.choice === question.correct } : item) } }
}
export function canAdvance(task) {
  const answer = task.answers[task.index]
  const question = taskQuestions(task)[task.index]
  return answer.submitted && typeof answer.clear === 'boolean' && answer.reflection.trim().length >= 8 && (!(question.demo || question.reactMode) || answer.ran)
}
export function advanceDaily(state, today = dayKey()) {
  const task = state.active
  if (!task || !canAdvance(task)) return state
  if (task.index < 2) return { ...state, active: { ...task, index: task.index + 1 } }
  const independent = task.answers.every(answer => outcome(answer) === 'independent')
  const previous = state.entries[task.lessonId]
  const streak = independent ? (previous?.streak || 0) + 1 : 0
  const delay = independent && previous ? (streak >= 3 ? 7 : 3) : 1
  const entry = { count: (previous?.count || 0) + 1, streak, due: afterDays(today, delay), lastDay: today, level: independent ? 'independent' : 'retry' }
  return { ...state, active: null, entries: { ...state.entries, [task.lessonId]: entry }, history: [{ ...task, completedDay: today, due: entry.due }, ...state.history].slice(0, 30) }
}

function validTask(task, completed = false) {
  if (!task || !lessonById(task.lessonId) || !dateValid(task.day) || !Number.isInteger(task.round) || task.round < 0 || !Number.isInteger(task.index) || task.index < 0 || task.index > 2 || !Array.isArray(task.answers) || task.answers.length !== 3) return false
  return task.answers.every((answer, index) => {
    const question = taskQuestions(task)[index]
    if (!answer || !(answer.choice === null || Number.isInteger(answer.choice) && answer.choice >= 0 && answer.choice < question.options.length)
      || typeof answer.reason !== 'string' || answer.reason.length > 2000 || typeof answer.reflection !== 'string' || answer.reflection.length > 2000
      || !['', 'sure', 'unsure'].includes(answer.confidence) || !Number.isInteger(answer.hints) || answer.hints < 0 || answer.hints > 3
      || typeof answer.submitted !== 'boolean' || typeof answer.ran !== 'boolean' || !Array.isArray(answer.output) || answer.output.length > 20 || !answer.output.every(line => typeof line === 'string' && line.length < 500)
      || ![null, true, false].includes(answer.clear)) return false
    if (answer.submitted && (answer.choice === null || answer.reason.trim().length < 8 || !answer.confidence || answer.correct !== (answer.choice === question.correct))) return false
    if ((completed || index < task.index) && !canAdvance({ ...task, index })) return false
    if (!completed && index > task.index && (answer.submitted || answer.hints || answer.ran)) return false
    return true
  })
}
export function restoreDaily(raw) {
  const empty = emptyDaily()
  try {
    const data = JSON.parse(raw)
    if (data?.version !== 1) return empty
    const entries = Object.fromEntries(dailyLessons.flatMap(lesson => {
      const item = data.entries?.[lesson.id]
      return item && Number.isInteger(item.count) && item.count > 0 && Number.isInteger(item.streak) && item.streak >= 0 && item.streak <= item.count && dateValid(item.due) && dateValid(item.lastDay) && ['independent', 'retry'].includes(item.level) ? [[lesson.id, item]] : []
    }))
    const history = Array.isArray(data.history) ? data.history.filter(task => validTask(task, true) && dateValid(task.completedDay) && dateValid(task.due)).slice(0, 30) : []
    return { version: 1, entries, history, active: validTask(data.active) ? data.active : null }
  } catch { return empty }
}

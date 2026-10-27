import { selectQuestions, validAttempt } from './mockInterviewSession.js'

const DAY = 24 * 60 * 60 * 1000
const reasons = ['marked', 'skipped']
const text = (value, limit = 4000) => typeof value === 'string' ? value.slice(0, limit) : ''

function snapshot(record, session, now) {
  return {
    sessionId: session.id, answeredAt: record.completedAt || session.finishedAt || session.startedAt || now,
    answer: text(record.answer), followUp: text(record.followUp, 350),
    followUpAnswer: text(record.followUpAnswer), skipped: record.skipped === true,
  }
}

export function addWeakQuestion(library, questionId, reason, now = Date.now()) {
  const existing = library[questionId]
  return { ...library, [questionId]: {
    questionId, attempts: [], attemptCount: 0,
    addedAt: now, ...existing, updatedAt: now, dueAt: now,
    status: 'learning', reasons: [...new Set([...(existing?.reasons || []), reason])],
  } }
}

// Called only when a question is completed, not when an old report is viewed.
export function recordReviewAttempt(library, session, record, now = Date.now()) {
  let next = library
  if (record.skipped || session.markedIds.includes(record.questionId)) {
    next = addWeakQuestion(next, record.questionId, record.skipped ? 'skipped' : 'marked', now)
  }
  const entry = next[record.questionId]
  if (!entry || entry.attempts.some(item => item.sessionId === session.id)) return library
  const attempt = snapshot(record, session, now)
  // An older report must not replace a newer answer or undo a mastery decision.
  if (entry.attempts[0]?.answeredAt > attempt.answeredAt) return library
  return { ...next, [record.questionId]: {
    ...entry, updatedAt: now, attemptCount: entry.attemptCount + 1,
    dueAt: record.skipped || !entry.attempts.length ? now : now + 3 * DAY,
    attempts: [attempt, ...entry.attempts].slice(0, 2),
  } }
}

export function setReviewMastery(library, questionId, mastered, now = Date.now(), delayDays = 0) {
  if (!library[questionId]) return library
  return { ...library, [questionId]: {
    ...library[questionId], status: mastered ? 'mastered' : 'learning',
    updatedAt: now, dueAt: now + delayDays * DAY,
  } }
}

export function reviewQueue(library) {
  return Object.values(library).filter(item => item.status === 'learning')
    .sort((a, b) => a.dueAt - b.dueAt || a.addedAt - b.addedAt || a.questionId.localeCompare(b.questionId))
}

export function selectReviewQuestions(bank, library, count, random = Math.random) {
  const byId = new Map(bank.map(item => [item.id, item]))
  const weak = reviewQueue(library).map(item => byId.get(item.questionId)).filter(Boolean).slice(0, count)
  if (!weak.length) return []
  const ids = new Set(weak.map(item => item.id))
  const other = bank.filter(item => !ids.has(item.id))
  const extra = selectQuestions(other.filter(item => library[item.id]?.status !== 'mastered'), 'all', count - weak.length, random)
  const fallback = selectQuestions(other.filter(item => library[item.id]?.status === 'mastered'), 'all', Math.max(0, count - weak.length - extra.length), random)
  return [...weak, ...extra, ...fallback]
}

export function reviewBaselines(library, questions, sessions = []) {
  return Object.fromEntries(questions.flatMap(question => {
    const candidates = [...(library[question.id]?.attempts || [])]
    for (const session of sessions) {
      const record = session.history.find(item => item.questionId === question.id)
      if (record) candidates.push(snapshot(record, session, session.startedAt))
    }
    const previous = candidates.sort((a, b) => b.answeredAt - a.answeredAt)[0]
    return previous ? [[question.id, { ...previous }]] : []
  }))
}

export function restoreReviewLibrary(saved, sessions, bank) {
  const ids = new Set(bank.map(item => item.id))
  if (saved?.version === 1 && Array.isArray(saved.entries)) {
    return Object.fromEntries(saved.entries.filter(entry => entry && ids.has(entry.questionId)
      && ['learning', 'mastered'].includes(entry.status)
      && ['addedAt', 'updatedAt', 'dueAt'].every(key => Number.isFinite(entry[key]))
      && Number.isInteger(entry.attemptCount) && entry.attemptCount >= 0
      && Array.isArray(entry.attempts) && entry.attempts.length <= 2 && entry.attempts.every(validAttempt)
      && Array.isArray(entry.reasons) && entry.reasons.every(reason => reasons.includes(reason)))
      .map(entry => [entry.questionId, entry]))
  }
  // One-time import from older saved sessions; subsequent loads honor saved mastery.
  let library = {}
  const unique = [...new Map(sessions.filter(Boolean).map(session => [session.id, session])).values()]
    .sort((a, b) => a.startedAt - b.startedAt)
  for (const session of unique) {
    const now = session.finishedAt || session.startedAt
    for (const id of session.markedIds) if (ids.has(id)) library = addWeakQuestion(library, id, 'marked', now)
    for (const record of session.history) library = recordReviewAttempt(library, session, record, now)
  }
  return library
}

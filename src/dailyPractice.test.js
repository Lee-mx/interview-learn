import assert from 'node:assert/strict'
import test from 'node:test'
import { dailyLessons, taskQuestions } from './dailyPracticeData.js'
import { advanceDaily, afterDays, blankAnswer, canAdvance, emptyDaily, outcome, pickLesson, restoreDaily, startDaily, submitDaily } from './dailyPracticeState.js'

const day = '2026-10-28'
function fill(state, values) {
  const task = state.active
  return { ...state, active: { ...task, answers: task.answers.map((answer, index) => index === task.index ? { ...answer, ...values } : answer) } }
}
function finish(state, today, extra = {}) {
  for (let index = 0; index < 3; index++) {
    const question = taskQuestions(state.active)[state.active.index]
    state = fill(state, { choice: question.correct, reason: '我根据回调的返回方式判断结果。', confidence: 'sure', ...extra })
    state = submitDaily(state)
    state = fill(state, { ran: true, output: question.expected || [], reflection: '我现在能说明关键规则以及变化后的结果。', clear: true })
    state = advanceDaily(state, today)
  }
  return state
}

test('trusted JavaScript demos actually produce the published expected outputs', async () => {
  for (const lesson of dailyLessons) for (const question of lesson.questions) {
    if (!question.demo) continue
    const output = []
    await question.demo(value => output.push(String(value)))
    assert.deepEqual(output, question.expected, question.id)
  }
})

test('daily flow freezes submitted judgments and requires experiment plus reflection', () => {
  let state = startDaily(emptyDaily(), day)
  assert.equal(submitDaily(state), state)
  state = fill(state, { choice: 2, reason: '失败被第二个回调处理后正常返回。', confidence: 'sure' })
  state = submitDaily(state)
  assert.equal(state.active.answers[0].correct, true)
  assert.equal(submitDaily(state), state)
  assert.equal(advanceDaily(state, day), state)
  state = fill(state, { reflection: '正常返回会让新 Promise 兑现。', clear: true })
  assert.equal(canAdvance(state.active), false)
  state = fill(state, { ran: true, output: ['2'] })
  assert.equal(advanceDaily(state, day).active.index, 1)
})

test('help, confidence and honest self-check affect review classification', () => {
  const answer = { ...blankAnswer(), correct: true, clear: true, confidence: 'sure' }
  assert.equal(outcome(answer), 'independent')
  assert.equal(outcome({ ...answer, hints: 1 }), 'assisted')
  assert.equal(outcome({ ...answer, confidence: 'unsure' }), 'assisted')
  assert.equal(outcome({ ...answer, hints: 3 }), 'retry')
  assert.equal(outcome({ ...answer, clear: false }), 'retry')
  assert.equal(outcome({ ...answer, correct: false }), 'retry')
})

test('first completion schedules tomorrow, completing twice cannot duplicate records', () => {
  const state = finish(startDaily(emptyDaily(), day), day)
  assert.equal(state.entries.promise.due, '2026-10-29')
  assert.equal(state.history.length, 1)
  assert.equal(startDaily(state, day), state)
  assert.equal(advanceDaily(state, day), state)
  assert.equal(startDaily(state, '2026-10-29').active.lessonId, 'promise')
  assert.deepEqual(taskQuestions(startDaily(state, '2026-10-29').active).map(item => item.id), ['promise-transfer', 'promise-reason', 'promise-base'])
})

test('due reviews come first; repeated independent practice spaces out and help resets interval', () => {
  let state = finish(startDaily(emptyDaily(), day), day)
  state = finish(startDaily(state, '2026-10-29'), '2026-10-29')
  assert.equal(state.entries.promise.due, '2026-11-01')
  assert.equal(pickLesson(state.entries, '2026-10-30').id, 'event-loop')
  state = finish(startDaily(state, '2026-11-01'), '2026-11-01')
  assert.equal(state.entries.promise.due, '2026-11-08')
  state = finish(startDaily(state, '2026-11-08'), '2026-11-08', { hints: 1 })
  assert.equal(state.entries.promise.due, '2026-11-09')
  assert.equal(state.entries.promise.streak, 0)
})

test('draft restoration preserves hints and answers; malformed task does not erase history', () => {
  let state = startDaily(emptyDaily(), day)
  state = fill(state, { reason: '尚未提交的草稿', hints: 2, choice: 1 })
  assert.deepEqual(restoreDaily(JSON.stringify(state)), state)
  assert.equal(startDaily(state, '2026-10-29'), state)
  const complete = finish(state, '2026-10-29')
  assert.equal(complete.history[0].completedDay, '2026-10-29')
  assert.deepEqual(restoreDaily(JSON.stringify(complete)), complete)
  const corrupt = { ...complete, active: { ...state.active, index: 2 } }
  const restored = restoreDaily(JSON.stringify(corrupt))
  assert.equal(restored.active, null)
  assert.equal(restored.history.length, 1)
  assert.deepEqual(restoreDaily('invalid'), emptyDaily())
})

test('calendar-day scheduling handles month/year and leap-year boundaries', () => {
  assert.equal(afterDays('2026-12-31', 1), '2027-01-01')
  assert.equal(afterDays('2028-02-28', 1), '2028-02-29')
  assert.equal(afterDays('2026-10-31', 3), '2026-11-03')
})

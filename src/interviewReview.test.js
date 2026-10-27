import assert from 'node:assert/strict'
import test from 'node:test'
import { addWeakQuestion, recordReviewAttempt, restoreReviewLibrary, reviewBaselines, reviewQueue, selectReviewQuestions, setReviewMastery } from './interviewReview.js'
import { createInterview, exportInterview, restoreWorkspace } from './mockInterviewSession.js'

const bank = Array.from({ length: 12 }, (_, index) => ({ id: 'q' + index, title: '题目 ' + index, category: 'js', answer: ['参考思路'] }))
const record = (questionId, answer = '回答', skipped = false, completedAt = 1000) => ({ questionId, question: '题目', answer, skipped, completedAt, feedback: '', followUp: '追问', followUpAnswer: '补充', source: 'question-bank' })
const session = (id, startedAt = 500, history = [], markedIds = []) => ({ id, startedAt, history, markedIds })

test('imports old skipped/marked records once and preserves manual mastery after reload', () => {
  const old = session('first', 500, [record('q0', '未提交思路', true)], ['q1'])
  let library = restoreReviewLibrary(undefined, [old, old], bank)
  assert.equal(Object.keys(library).length, 2)
  assert.equal(library.q0.attemptCount, 1)
  assert.equal(library.q0.attempts[0].skipped, true)
  library = setReviewMastery(library, 'q0', true, 1500)
  const restored = restoreReviewLibrary({ version: 1, entries: Object.values(library) }, [old], bank)
  assert.equal(restored.q0.status, 'mastered')
  assert.equal(recordReviewAttempt(restored, old, old.history[0], 2000), restored)
})

test('retries retain two snapshots, schedule three days later, and do not auto-master', () => {
  let library = addWeakQuestion({}, 'q0', 'marked', 900)
  for (let index = 1; index <= 7; index++) {
    library = recordReviewAttempt(library, session('s' + index), record('q0', '回答' + index, false, index * 1000), index * 1000)
  }
  assert.equal(library.q0.attemptCount, 7)
  assert.equal(library.q0.attempts.length, 2)
  assert.equal(library.q0.attempts[0].answer, '回答7')
  assert.equal(library.q0.status, 'learning')
  assert.equal(library.q0.dueAt, 7000 + 3 * 86400000)
  const restored = restoreReviewLibrary({ version: 1, entries: Object.values(library) }, [], bank)
  assert.deepEqual(restored, library)
  library = setReviewMastery(library, 'q0', true, 8000)
  library = recordReviewAttempt(library, session('s8'), record('q0', '', true, 9000), 9000)
  assert.equal(library.q0.status, 'learning')
  assert.equal(library.q0.dueAt, 9000)
})

test('prioritizes earliest due weak questions, excludes mastered from weak queue, fills without duplicates', () => {
  let library = addWeakQuestion({}, 'q0', 'skipped', 4000)
  library = addWeakQuestion(library, 'q1', 'marked', 1000)
  library = addWeakQuestion(library, 'q2', 'marked', 2000)
  library = setReviewMastery(library, 'q2', true, 3000)
  assert.deepEqual(reviewQueue(library).map(item => item.questionId), ['q1', 'q0'])
  const selected = selectReviewQuestions(bank, library, 10, () => 0.5)
  assert.deepEqual(selected.slice(0, 2).map(item => item.id), ['q1', 'q0'])
  assert.equal(new Set(selected.map(item => item.id)).size, 10)
  assert.equal(selected.some(item => item.id === 'q2'), false)
  assert.deepEqual(selectReviewQuestions(bank, {}, 10), [])
})

test('freezes baseline before retry so later records cannot replace the original comparison', () => {
  const old = session('old', 500, [record('q0', '首次回答', false, 1000)], ['q0'])
  let library = restoreReviewLibrary(undefined, [old], bank)
  const next = createInterview(bank.slice(0, 1), { category: 'weak', mode: 'practice', practiceKind: 'weak', baselines: reviewBaselines(library, bank) })
  library = recordReviewAttempt(library, next, record('q0', '新回答', false, 2000), 2000)
  assert.equal(next.baselines.q0.answer, '首次回答')
  assert.equal(library.q0.attempts[0].answer, '新回答')
  assert.deepEqual(restoreWorkspace(JSON.stringify({ session: next }), bank).session.baselines, next.baselines)
  const newestRecent = session('recent', 2100, [record('q0', '最近的回答', false, 2200)])
  assert.equal(reviewBaselines(library, bank, [newestRecent]).q0.answer, '最近的回答')
})

test('rejects corrupt library entries without losing valid ones and drops broken comparison data', () => {
  const valid = addWeakQuestion({}, 'q0', 'marked', 1000).q0
  const saved = { version: 1, entries: [valid, { ...valid, questionId: 'removed' }, { ...valid, questionId: 'q1', attempts: [{}] }] }
  assert.deepEqual(Object.keys(restoreReviewLibrary(saved, [], bank)), ['q0'])
  const review = { ...createInterview(bank.slice(0, 1), { category: 'js', mode: 'practice' }), stage: 'review', history: [{ ...record('q0'), comparison: { summary: 'broken' } }] }
  assert.equal(restoreWorkspace(JSON.stringify({ session: review }), bank).session.history[0].comparison, undefined)
})

test('exports old skipped drafts honestly alongside comparison advice', () => {
  const review = { ...createInterview(bank.slice(0, 1), { category: 'weak', mode: 'ai' }), history: [record('q0', '正式回答')], baselines: { q0: { ...record('q0', '旧草稿', true), answeredAt: 1000 } } }
  review.history[0].comparison = { summary: '有具体变化', improved: ['解释更完整'], remaining: [], nextSteps: ['补一个例子'] }
  const output = exportInterview(review, bank)
  assert.match(output, /未提交草稿/)
  assert.match(output, /旧草稿/)
  assert.match(output, /解释更完整/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { completeQuestion, createInterview, exportInterview, restoreWorkspace, selectQuestions } from './mockInterviewSession.js'

const bank = Array.from({ length: 12 }, (_, i) => ({ id: 'q' + i, title: '问题 ' + i, category: i < 2 ? 'small' : 'other', answer: ['参考思路'] }))

test('fills a small category without duplicating questions', () => {
  const result = selectQuestions(bank, 'small', 10, () => 0.4)
  assert.equal(result.length, 10)
  assert.equal(new Set(result.map(item => item.id)).size, 10)
  assert.ok(result.slice(0, 2).every(item => item.category === 'small'))
})

test('restores a follow-up draft and rejects inconsistent or stale saved state', () => {
  const session = { ...createInterview(bank.slice(0, 3), { category: 'all', mode: 'practice' }), stage: 'followup', answer: '原回答', followUpAnswer: '追问草稿', pending: { answer: '原回答', feedback: '说明', followUp: '追问', source: 'question-bank' } }
  assert.deepEqual(restoreWorkspace(JSON.stringify({ session }), bank).session, session)
  assert.equal(restoreWorkspace(JSON.stringify({ session: { ...session, index: 9 } }), bank).session, null)
  assert.equal(restoreWorkspace(JSON.stringify({ session: { ...session, questionIds: ['removed'] } }), bank).session, null)
  assert.equal(restoreWorkspace(JSON.stringify({ session: { ...session, pending: {} } }), bank).session, null)
  assert.equal(restoreWorkspace(JSON.stringify({ session: { ...session, markedIds: ['removed'] } }), bank).session, null)
  assert.equal(restoreWorkspace('{broken', bank).session, null)
})

test('records skipped drafts, completes the last question and exports actual sources', () => {
  let session = createInterview(bank.slice(0, 3), { category: 'small', mode: 'practice' })
  session = completeQuestion({ ...session, answer: '未完成的思路' }, bank[0], true)
  assert.equal(session.history[0].answer, '未完成的思路')
  assert.equal(session.history[0].skipped, true)
  assert.equal(completeQuestion(session, bank[0], true), session)
  session = completeQuestion({ ...session, answer: '回答', followUpAnswer: '补充', pending: { feedback: '题库说明', followUp: '追问', source: 'question-bank' } }, bank[1])
  session = completeQuestion(session, bank[2], true)
  assert.equal(session.stage, 'review')
  assert.equal(session.history.length, 3)
  assert.ok(restoreWorkspace(JSON.stringify({ session }), bank).session)
  const markdown = exportInterview(session, bank)
  assert.match(markdown, /题库说明/)
  assert.match(markdown, /参考思路/)
  assert.doesNotMatch(markdown, /AI 点评/)
})

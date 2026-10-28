import assert from 'node:assert/strict'
import test from 'node:test'
import { feedbackLabel, switchSessionProvider } from './interviewProviders.js'
import { completeQuestion, createInterview, exportInterview, restoreWorkspace } from './mockInterviewSession.js'

const bank = [{ id: 'q', title: '问题', category: 'javascript', answer: ['参考'] }]

test('switching and reloading preserve drafts and the original feedback service', () => {
  const initial = { ...createInterview(bank, { mode: 'ai', category: 'all', provider: 'minimax' }),
    stage: 'followup', answer: '我的答案', followUpAnswer: '追问草稿',
    pending: { answer: '我的答案', feedback: '点评', followUp: '追问', source: 'minimax', provider: 'minimax' } }
  const switched = switchSessionProvider(initial, 'codex')
  assert.deepEqual(switched, { ...initial, provider: 'codex' })
  assert.deepEqual(restoreWorkspace(JSON.stringify({ session: switched }), bank).session, switched)
  assert.equal(feedbackLabel(switched.pending), 'AI 点评 · MiniMax')
  const { provider, ...legacy } = switched
  assert.equal(restoreWorkspace(JSON.stringify({ session: legacy }), bank).session.provider, 'codex')
})

test('mixed-service exports keep each actual source after changing the selected service', () => {
  let session = createInterview(bank, { mode: 'ai', category: 'all', provider: 'minimax' })
  session = completeQuestion({ ...session, answer: '答案', pending: { feedback: '点评', followUp: '追问', source: 'minimax' } }, bank[0])
  session.report = { provider: 'codex', summary: '总结', strengths: [], improvements: [], nextSteps: [] }
  session.history[0].comparison = { provider: 'minimax', summary: '对比', improved: [], remaining: [], nextSteps: [] }
  const markdown = exportInterview(switchSessionProvider(session, 'codex'), bank)
  assert.match(markdown, /AI 点评 · MiniMax/)
  assert.match(markdown, /AI 总结 · Codex/)
  assert.match(markdown, /AI 对比建议 · MiniMax/)
})

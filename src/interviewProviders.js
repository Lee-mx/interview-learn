export const AI_PROVIDERS = [
  { id: 'codex', name: 'Codex' },
  { id: 'minimax', name: 'MiniMax' },
]

export const isAIProvider = value => AI_PROVIDERS.some(item => item.id === value)
export const normalizeProvider = value => isAIProvider(value) ? value : 'codex'
export const providerName = value => AI_PROVIDERS.find(item => item.id === normalizeProvider(value)).name
export const resultProviderName = result => providerName(result?.provider || result?.source)
export const feedbackLabel = result => isAIProvider(result?.source) ? `AI 点评 · ${resultProviderName(result)}` : '题库练习'

// Switching the next request must never relabel previously generated results.
export function switchSessionProvider(session, provider) {
  return { ...session, provider: normalizeProvider(provider) }
}

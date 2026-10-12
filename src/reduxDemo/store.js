import { configureStore, createSlice } from '@reduxjs/toolkit'

const progressSlice = createSlice({
  name: 'progress',
  initialState: { completed: 0, lastAdded: 0 },
  reducers: {
    addAmount(state, action) {
      const amount = action.payload
      if (!Number.isInteger(amount) || amount <= 0) return
      state.completed += amount
      state.lastAdded = amount
    },
    reset(state) {
      state.completed = 0
      state.lastAdded = 0
    },
  },
})

export const { addAmount, reset } = progressSlice.actions

export function createProgressStore() {
  return configureStore({ reducer: { progress: progressSlice.reducer } })
}

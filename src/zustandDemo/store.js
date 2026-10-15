import { create } from 'zustand'

const initialProgress = { completed: 0, lastAdded: 0 }

export const useProgressStore = create((set) => ({
  ...initialProgress,
  addAmount: (amount) => {
    if (!Number.isInteger(amount) || amount <= 0) return
    set((state) => ({
      completed: state.completed + amount,
      lastAdded: amount,
    }))
  },
  reset: () => set(initialProgress),
}))

// 供页面“重置示例”使用；重挂载 React 组件不会自动重建模块级 store。
export function resetProgressStore() {
  useProgressStore.getState().reset()
}

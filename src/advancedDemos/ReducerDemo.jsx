import { useReducer } from 'react'

const initialState = { count: 0, history: [] }
export function counterReducer(state, action) {
  switch (action.type) {
    case 'add': return { count: state.count + 1, history: [...state.history, state.count] }
    case 'undo': return state.history.length ? { count: state.history.at(-1), history: state.history.slice(0, -1) } : state
    case 'reset': return initialState
    default: return state
  }
}

export default function ReducerDemo() {
  const [state, dispatch] = useReducer(counterReducer, initialState)
  return <div className="demo-list advanced-demo">
    <h3>把状态变化整理为动作</h3><p>计数：{state.count} · 可撤销 {state.history.length} 步</p>
    <button onClick={() => dispatch({ type: 'add' })}>增加一步</button>
    <button disabled={!state.history.length} onClick={() => dispatch({ type: 'undo' })}>撤销一步</button>
    <button onClick={() => dispatch({ type: 'reset' })}>清空记录</button>
    <small>reducer 同时更新计数和历史；它只计算下一状态，不发请求、不修改旧对象。</small>
  </div>
}

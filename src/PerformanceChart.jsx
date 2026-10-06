import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { BarChart3, RotateCcw } from 'lucide-react'

const totalRows = 10000
const initialVirtualRows = 9
const benchmarkItems = Array.from({ length: totalRows }, (_, index) => ({
  id: index + 1,
  label: `第 ${index + 1} 条学习记录`,
}))

function BenchmarkRows({ count }) {
  return <div>{benchmarkItems.slice(0, count).map(item => <div data-benchmark-row="" key={item.id}>{item.label}</div>)}</div>
}

function measureMount(count) {
  const container = document.createElement('div')
  const root = createRoot(container)
  const start = performance.now()
  flushSync(() => root.render(<BenchmarkRows count={count} />))
  const duration = performance.now() - start
  const rows = container.querySelectorAll('[data-benchmark-row]').length
  root.unmount()
  return { duration, rows }
}

function formatDuration(value) {
  return `${value < 1 ? value.toFixed(3) : value.toFixed(1)} ms`
}

function ChartRow({ label, value, width, variant }) {
  return <div className="perf-chart-row"><span className="perf-chart-label">{label}</span><div className="perf-chart-track"><span className={`perf-chart-fill ${variant}`} style={{ width }} /></div><strong>{value}</strong></div>
}

export default function PerformanceChart() {
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('pending')
  const autoTimer = useRef(null)
  const measureTimer = useRef(null)

  const runBenchmark = useCallback(() => {
    window.clearTimeout(autoTimer.current)
    window.clearTimeout(measureTimer.current)
    setStatus('running')
    measureTimer.current = window.setTimeout(() => {
      try {
        const full = measureMount(totalRows)
        const virtual = measureMount(initialVirtualRows)
        setResult({ full, virtual })
        setStatus('complete')
      } catch {
        setStatus('error')
      }
    }, 30)
  }, [])

  useEffect(() => {
    autoTimer.current = window.setTimeout(runBenchmark, 450)
    return () => {
      window.clearTimeout(autoTimer.current)
      window.clearTimeout(measureTimer.current)
    }
  }, [runBenchmark])

  const maxTime = result ? Math.max(result.full.duration, result.virtual.duration, 0.001) : 1
  const fullWidth = result ? `${Math.max(2, result.full.duration / maxTime * 100)}%` : '0%'
  const virtualWidth = result ? `${Math.max(2, result.virtual.duration / maxTime * 100)}%` : '0%'

  return <section className="performance-panel" aria-label="虚拟列表渲染性能图">
    <div className="performance-panel-head"><div><span className="section-kicker"><span /> PERFORMANCE SNAPSHOT</span><h3><BarChart3 size={21} /> 渲染性能对比</h3><p>同样的 10,000 条数据，比较一次挂载全部行与只挂载首屏可见行。</p></div><button onClick={runBenchmark} disabled={status === 'running'}><RotateCcw size={14} />{status === 'running' ? '测量中…' : '重新测量'}</button></div>
    <div className="performance-charts">
      <div className="performance-chart-card"><div className="perf-card-title"><span>01 / RENDER TIME</span><strong>React 首次挂载耗时</strong></div><div className="perf-chart" role="img" aria-label={result ? `全量渲染 ${formatDuration(result.full.duration)}，虚拟渲染 ${formatDuration(result.virtual.duration)}` : '正在测量 React 首次挂载耗时'}><ChartRow label="全量渲染" value={result ? formatDuration(result.full.duration) : '—'} width={fullWidth} variant="full" /><ChartRow label="虚拟渲染" value={result ? formatDuration(result.virtual.duration) : '—'} width={virtualWidth} variant="virtual" /></div><small>{status === 'error' ? '测量未完成，请点击重新测量。' : status === 'complete' ? '当前浏览器实测 · 单次挂载' : '正在准备当前浏览器的测量…'}</small></div>
      <div className="performance-chart-card"><div className="perf-card-title"><span>02 / DOM FOOTPRINT</span><strong>首次挂载的列表行数</strong></div><div className="perf-chart" role="img" aria-label={`全量渲染 ${result?.full.rows ?? totalRows} 行，虚拟渲染 ${result?.virtual.rows ?? initialVirtualRows} 行`}><ChartRow label="全量渲染" value={`${(result?.full.rows ?? totalRows).toLocaleString()} 行`} width="100%" variant="full" /><ChartRow label="虚拟渲染" value={`${result?.virtual.rows ?? initialVirtualRows} 行`} width="2%" variant="virtual" /></div><small>虚拟列表滚动后通常挂载 8–12 行</small></div>
    </div>
    <p className="performance-footnote">测量的是相同行组件的 React 首次挂载与 DOM 创建时间，不含浏览器绘制或滚动帧率。结果受当前设备和浏览器状态影响。</p>
  </section>
}

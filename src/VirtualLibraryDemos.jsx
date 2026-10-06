import { useRef, useState } from 'react'
import { List } from 'react-window'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Virtuoso } from 'react-virtuoso'

const count = 10000
const rowHeight = 44
const examples = Array.from({ length: count }, (_, index) => ({
  id: index + 1,
  title: `第 ${index + 1} 条学习记录`,
}))

function DemoControls({ range, onJump, note }) {
  return <div className="library-demo-controls">
    <p>{note}</p>
    <div className="library-demo-actions">
      <span aria-live="polite">当前可见：{range}</span>
      <button onClick={() => onJump(0)}>开头</button>
      <button onClick={() => onJump(4999)}>第 5000 条</button>
      <button onClick={() => onJump(9999)}>末尾</button>
    </div>
  </div>
}

function WindowRow({ index, style }) {
  return <div className="library-row" style={style} role="listitem" aria-posinset={index + 1} aria-setsize={count}>
    <span>{String(index + 1).padStart(5, '0')}</span>
    <strong>{examples[index].title}</strong>
  </div>
}

function ReactWindowDemo() {
  const listRef = useRef(null)
  const [range, setRange] = useState('1–6')

  return <div className="library-demo">
    <div className="library-demo-frame">
      <List
        listRef={listRef}
        rowComponent={WindowRow}
        rowCount={count}
        rowHeight={rowHeight}
        rowProps={{}}
        overscanCount={3}
        onRowsRendered={({ startIndex, stopIndex }) => setRange(`${startIndex + 1}–${stopIndex + 1}`)}
        style={{ height: 220, width: '100%' }}
        role="list"
        aria-label="react-window 固定行高列表"
      />
    </div>
    <DemoControls range={range} onJump={index => listRef.current?.scrollToRow({ index, align: 'center' })} note="固定 44px 行高；List 负责定位和复用可见行。" />
  </div>
}

function TanStackDemo() {
  const parentRef = useRef(null)
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 4,
  })
  const rows = virtualizer.getVirtualItems()
  const range = rows.length ? `${rows[0].index + 1}–${rows[rows.length - 1].index + 1}` : '—'

  return <div className="library-demo">
    <div className="library-demo-frame library-tanstack-frame" ref={parentRef} role="list" aria-label="TanStack Virtual 动态高度列表">
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {rows.map(row => <div
          key={row.key}
          ref={virtualizer.measureElement}
          data-index={row.index}
          className="library-row library-row-dynamic"
          role="listitem"
          aria-posinset={row.index + 1}
          aria-setsize={count}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${row.start}px)` }}
        >
          <span>{String(row.index + 1).padStart(5, '0')}</span>
          <div><strong>{examples[row.index].title}</strong>{row.index % 4 === 0 && <small>这行多一段说明，让实际高度由内容决定。</small>}</div>
        </div>)}
      </div>
    </div>
    <DemoControls range={range} onJump={index => virtualizer.scrollToIndex(index, { align: 'center' })} note="行高由内容决定；measureElement 测量后修正偏移。" />
  </div>
}

function VirtuosoDemo() {
  const listRef = useRef(null)
  const [range, setRange] = useState('1–6')

  return <div className="library-demo">
    <div className="library-demo-frame">
      <Virtuoso
        ref={listRef}
        totalCount={count}
        style={{ height: 220 }}
        rangeChanged={({ startIndex, endIndex }) => setRange(`${startIndex + 1}–${endIndex + 1}`)}
        itemContent={index => <div className="library-row library-row-dynamic" role="listitem" aria-posinset={index + 1} aria-setsize={count}>
          <span>{String(index + 1).padStart(5, '0')}</span>
          <div><strong>{examples[index].title}</strong>{index % 4 === 0 && <small>内容长短不同，Virtuoso 会自动追踪行高。</small>}</div>
        </div>}
      />
    </div>
    <DemoControls range={range} onJump={index => listRef.current?.scrollToIndex({ index, align: 'center' })} note="直接提供 itemContent；滚动容器和高度测量由组件处理。" />
  </div>
}

export const virtualLibraryDemos = [
  {
    id: 'react-window',
    name: 'react-window',
    feature: '固定行高 · 组件式',
    takeaway: '把行组件、总条数和行高交给 List；定位由 List 完成。',
    Demo: ReactWindowDemo,
    code: `import { useRef } from 'react';
import { List } from 'react-window';

const items = Array.from({ length: 10000 }, (_, i) => i + 1);

function Row({ index, style }) {
  return <div style={style}>第 {items[index]} 条记录</div>;
}

export default function Example() {
  const listRef = useRef(null);
  return <>
    <List listRef={listRef} rowComponent={Row}
      rowCount={items.length} rowHeight={44}
      rowProps={{}} overscanCount={3}
      style={{ height: 220, width: '100%' }} />
    <button onClick={() => listRef.current?.scrollToRow({
      index: 4999, align: 'center'
    })}>跳到第 5000 条</button>
  </>;
}`,
  },
  {
    id: 'tanstack',
    name: '@tanstack/react-virtual',
    feature: '动态行高 · 无头逻辑',
    takeaway: 'useVirtualizer 只计算可见项；容器和行 DOM 由你自己决定。',
    Demo: TanStackDemo,
    code: `import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export default function Example() {
  const parentRef = useRef(null);
  const v = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 4,
  });
  return <div ref={parentRef}
    style={{ height: 220, overflowY: 'auto' }}>
    <div style={{ height: v.getTotalSize(), position: 'relative' }}>
      {v.getVirtualItems().map(row => <div
        key={row.key} data-index={row.index}
        ref={v.measureElement}
        style={{ position: 'absolute', top: 0,
          width: '100%', transform: 'translateY(' + row.start + 'px)' }}>
        第 {row.index + 1} 条记录
        {row.index % 4 === 0 && <p>这行有更多内容</p>}
      </div>)}
    </div>
  </div>;
}`,
  },
  {
    id: 'virtuoso',
    name: 'react-virtuoso',
    feature: '自动测高 · 开箱即用',
    takeaway: '把内容交给 Virtuoso，组件管理滚动容器与可变高度。',
    Demo: VirtuosoDemo,
    code: `import { useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function Example() {
  const listRef = useRef(null);
  return <>
    <Virtuoso ref={listRef} totalCount={10000}
      style={{ height: 220 }}
      itemContent={index => <div style={{ padding: 12 }}>
        第 {index + 1} 条记录
        {index % 4 === 0 && <p>这行有更多内容</p>}
      </div>} />
    <button onClick={() => listRef.current?.scrollToIndex({
      index: 4999, align: 'center'
    })}>跳到第 5000 条</button>
  </>;
}`,
  },
]

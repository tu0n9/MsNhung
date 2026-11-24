import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/** Ô tìm kiếm có viền sáng theo focus và nút xoá nhanh (#300). */
export function OChiTimKiem({
  value,
  onChange,
  placeholder,
  ariaLabel,
  style,
}: {
  value: string
  onChange: (val: string) => void
  placeholder: string
  ariaLabel: string
  style?: CSSProperties
}) {
  return (
    <label className="ux u300-sb" style={style}>
      <svg viewBox="0 0 15 15" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <input
        className="u300-in"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
      />
      {value.length > 0 && (
        <button
          type="button"
          className="u300-clear"
          aria-label="Xoá từ khoá tìm kiếm"
          onClick={() => onChange('')}
        >
          ×
        </button>
      )}
    </label>
  )
}

/** Huy hiệu đếm số mục đã chọn có hiệu ứng nảy mỗi khi thay đổi số lượng (#300). */
export function HuyHieuDem({ count, icon }: { count: number; icon?: ReactNode }) {
  const [bump, setBump] = useState(false)
  const prevRef = useRef(count)

  useEffect(() => {
    if (count !== prevRef.current) {
      prevRef.current = count
      setBump(false)
      const id = window.requestAnimationFrame(() => setBump(true))
      const timer = window.setTimeout(() => setBump(false), 460)
      return () => {
        window.cancelAnimationFrame(id)
        window.clearTimeout(timer)
      }
    }
  }, [count])

  return (
    <span className="ux u300-ct" aria-label={`Đã chọn ${count}`} role="img">
      {icon ?? (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M3 8.5 6.2 11.5 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <i className={`${count > 0 ? 'is-on' : ''} ${bump ? 'is-bump' : ''}`.trim()}>{count}</i>
    </span>
  )
}

/** Nút chọn nhanh chuyển màu xanh lá khi đã chọn (#300). */
export function NutChonNhanh({
  selected,
  onToggle,
  itemLabel,
  addLabel = 'Chọn',
  addedLabel = 'Đã chọn',
}: {
  selected: boolean
  onToggle: () => void
  itemLabel?: string
  addLabel?: string
  addedLabel?: string
}) {
  return (
    <button
      type="button"
      className="ux u300-ad"
      aria-pressed={selected}
      aria-label={itemLabel ? `${itemLabel}: ${selected ? addedLabel : addLabel}` : undefined}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
    >
      {selected ? addedLabel : addLabel}
    </button>
  )
}

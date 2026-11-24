import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

/** Thanh tiến trình các bước có thanh nối trượt và dấu tích bật lò xo (#444). */
export default function ThanhBuoc({
  steps,
  current,
  ariaLabel = 'Các bước',
  onStepClick,
}: {
  steps: string[]
  /** Chỉ số bước hiện tại (bắt đầu từ 0; truyền steps.length khi đã xong toàn bộ). */
  current: number
  ariaLabel?: string
  onStepClick?: (index: number) => void
}) {
  const [from, setFrom] = useState(current)
  const prevRef = useRef(current)
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    setFrom(prevRef.current)
    prevRef.current = current
  }, [current])

  const rm = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const stepDelay = rm ? 0 : 0.18

  const onKeyDown = (e: KeyboardEvent<HTMLOListElement>) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    const focused = dotRefs.current.indexOf(document.activeElement as HTMLButtonElement)
    if (focused < 0) return
    const next = Math.max(0, Math.min(steps.length - 1, focused + d))
    if (next !== focused) {
      e.preventDefault()
      dotRefs.current[next]?.focus({ preventScroll: true })
    }
  }

  return (
    <ol className="ux u444-st" aria-label={ariaLabel} onKeyDown={onKeyDown}>
      {steps.map((ten, idx) => {
        const done = idx < current
        const isCur = idx === current
        const clickable = !!onStepClick && idx < current
        const lineOn = idx < current
        const lineDelay = lineOn && idx >= from ? (idx - from) * stepDelay : !lineOn && idx < from ? (from - 1 - idx) * stepDelay * 0.6 : 0
        const dotDelay = done && idx >= from ? (idx - from) * stepDelay + stepDelay : 0

        return (
          <li
            key={ten}
            className={`u444-s ${done ? 'is-done' : ''} ${isCur ? 'is-cur' : ''}`.trim()}
            aria-current={isCur ? 'step' : undefined}
            style={{ ['--d' as string]: `${dotDelay}s` }}
          >
            {idx < steps.length - 1 && (
              <span
                className={`u444-ln ${lineOn ? 'is-on' : ''}`.trim()}
                aria-hidden="true"
                style={{ ['--d' as string]: `${lineDelay}s` }}
              >
                <i />
              </span>
            )}
            <button
              ref={(el) => { dotRefs.current[idx] = el }}
              type="button"
              className="u444-dot"
              disabled={!clickable}
              aria-label={`${ten}${done ? ', đã xong' : isCur ? ', bước hiện tại' : ''}`}
              onClick={() => clickable && onStepClick?.(idx)}
            >
              <b>{idx + 1}</b>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5.5 12.5 4 4 9-9.5" />
              </svg>
            </button>
            <span>{ten}</span>
          </li>
        )
      })}
    </ol>
  )
}

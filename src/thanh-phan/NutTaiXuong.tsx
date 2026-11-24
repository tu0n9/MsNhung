import { useEffect, useRef, useState } from 'react'

/** Nút tải xuống biến hình: chạy thanh tiến độ dải màu -> thu tròn tích xanh (#004). */
export default function NutTaiXuong({
  label,
  ariaLabel,
  variant = 'primary',
  loading = false,
  disabled = false,
  doneLabel = 'Đã tải xong',
  onDownload,
}: {
  label: string
  ariaLabel?: string
  variant?: 'primary' | 'secondary'
  loading?: boolean
  disabled?: boolean
  doneLabel?: string
  onDownload: () => Promise<unknown> | unknown
}) {
  const [state, setState] = useState<'idle' | 'run' | 'fold' | 'done'>('idle')
  const [pct, setPct] = useState(0)
  const mountedRef = useRef(true)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      timersRef.current.forEach(window.clearTimeout)
    }
  }, [])

  const rm = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleClick = async () => {
    if (disabled || loading || state !== 'idle') return
    timersRef.current.forEach(window.clearTimeout)
    timersRef.current = []
    setState('run')
    setPct(0.25)

    const ticker = window.setInterval(() => {
      setPct((p) => (p < 0.86 ? Math.min(0.86, p + 0.14) : p))
    }, 100)

    try {
      await onDownload()
      if (!mountedRef.current) return
      setPct(1)
      setState('fold')
      timersRef.current.push(window.setTimeout(() => {
        if (mountedRef.current) setState('done')
      }, rm ? 60 : 320))
      timersRef.current.push(window.setTimeout(() => {
        if (mountedRef.current) {
          setState('idle')
          setPct(0)
        }
      }, rm ? 900 : 1800))
    } catch {
      if (mountedRef.current) {
        setState('idle')
        setPct(0)
      }
    } finally {
      window.clearInterval(ticker)
    }
  }

  return (
    <button
      type="button"
      className={`ux u004-btn ${variant === 'secondary' ? 'is-secondary' : ''}`.trim()}
      data-state={state}
      aria-label={ariaLabel ?? label}
      aria-busy={loading || state === 'run' ? true : undefined}
      disabled={disabled || loading}
      style={{ ['--p' as string]: pct.toFixed(3) }}
      onClick={handleClick}
    >
      <span className="u004-track" aria-hidden="true">
        <span className="u004-bar" />
      </span>
      <span className="u004-idle" aria-hidden="true">
        <span className="u004-arw">
          <svg viewBox="0 0 24 24">
            <g className="u004-a">
              <path d="M12 4.5v11M7 11l5 5 5-5" />
            </g>
            <path d="M5 19.5h14" />
          </svg>
        </span>
        <span>{label}</span>
      </span>
      <span className="u004-run" aria-hidden="true">
        <b>{Math.round(pct * 100)}%</b>
      </span>
      <span className="u004-ok" aria-hidden="true">
        <i>
          <svg viewBox="0 0 16 16">
            <path d="M3.5 8.4l3 3 6-6.4" />
          </svg>
        </i>
        <span>{doneLabel}</span>
      </span>
    </button>
  )
}

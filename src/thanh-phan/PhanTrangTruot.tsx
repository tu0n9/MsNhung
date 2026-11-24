import { useEffect, useRef, useState } from 'react'

type Slot = number | '...'

function taoCuaSoTrang(cur: number, total: number): Slot[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (cur <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (cur >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', cur - 1, cur, cur + 1, '...', total]
}

/** Thanh phân trang có viên thuốc trượt và số lật theo chiều chuyển trang (#449). */
export default function PhanTrangTruot({
  current,
  pageSize,
  total,
  onChange,
  ariaLabel = 'Phân trang',
}: {
  current: number
  pageSize: number
  total: number
  onChange: (page: number) => void
  ariaLabel?: string
}) {
  const tongTrang = Math.ceil(total / pageSize)
  const prevRef = useRef(current)
  const [back, setBack] = useState(false)
  const [squash, setSquash] = useState(false)

  useEffect(() => {
    if (current !== prevRef.current) {
      setBack(current < prevRef.current)
      prevRef.current = current
      setSquash(false)
      const id = window.requestAnimationFrame(() => setSquash(true))
      const t = window.setTimeout(() => setSquash(false), 500)
      return () => {
        window.cancelAnimationFrame(id)
        window.clearTimeout(t)
      }
    }
  }, [current])

  if (tongTrang <= 1) return null

  const slots = taoCuaSoTrang(current, tongTrang)
  const activeIdx = Math.max(0, slots.indexOf(current))

  return (
    <div className="ux u449-wrap">
      <nav className="u449-nav" aria-label={ariaLabel}>
        <button
          type="button"
          className="u449-ar"
          aria-label="Trang trước"
          disabled={current <= 1}
          onClick={() => onChange(Math.max(1, current - 1))}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3.5 5.5 8l4.5 4.5" />
          </svg>
        </button>

        <div className="u449-sl">
          <span
            className={`u449-pill ${squash ? 'is-sq' : ''}`.trim()}
            aria-hidden="true"
            style={{ ['--idx' as string]: activeIdx }}
          />
          {slots.map((v, k) => {
            if (v === '...') {
              return (
                <button
                  key={`dots-${k}`}
                  type="button"
                  className="u449-n is-dots"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <span>…</span>
                </button>
              )
            }
            return (
              <button
                key={`slot-${k}`}
                type="button"
                className={`u449-n ${back ? 'is-back' : ''}`.trim()}
                aria-label={`Trang ${v}`}
                aria-current={v === current ? 'page' : undefined}
                onClick={() => v !== current && onChange(v)}
              >
                <span key={`${k}-${v}`}>{v}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="u449-ar"
          aria-label="Trang sau"
          disabled={current >= tongTrang}
          onClick={() => onChange(Math.min(tongTrang, current + 1))}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 3.5 10.5 8 6 12.5" />
          </svg>
        </button>
      </nav>
    </div>
  )
}

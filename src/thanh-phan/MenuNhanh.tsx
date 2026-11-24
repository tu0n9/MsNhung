import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface MucMenuNhanh {
  key: string
  label: string
  moTa?: string
  icon: ReactNode
  mau?: 'c1' | 'c2' | 'c3' | 'c4'
  onClick: () => void
}

/** Menu thả xuống có hiệu ứng bật lò xo và dải nền trượt theo mục đang chọn (#413). */
export default function MenuNhanh({ label, items, ariaLabel }: {
  label: string
  items: MucMenuNhanh[]
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState(-1)
  const [hlStyle, setHlStyle] = useState<{ y: number; h: number }>({ y: 6, h: 50 })
  const [panelOffset, setPanelOffset] = useState<{ left: string; originX: string }>({ left: 'auto', originX: '85%' })
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tOpenRef = useRef<number | undefined>(undefined)
  const tCloseRef = useRef<number | undefined>(undefined)
  const hoverAtRef = useRef(0)
  const panelId = useId()

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return
    const updatePos = () => {
      if (!rootRef.current) return
      const rect = rootRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const panelW = Math.min(272, vw - 24)
      const idealLeft = rect.right - panelW
      const clampedLeft = Math.max(12, Math.min(vw - 12 - panelW, idealLeft))
      const relLeft = clampedLeft - rect.left
      const triggerCenter = rect.width / 2 - relLeft
      const originPct = Math.max(12, Math.min(88, Math.round((triggerCenter / Math.max(1, panelW)) * 100)))
      setPanelOffset({ left: `${relLeft.toFixed(1)}px`, originX: `${originPct}%` })
    }
    updatePos()
    window.addEventListener('resize', updatePos)
    return () => window.removeEventListener('resize', updatePos)
  }, [open])

  useEffect(() => {
    const onOutside = (e: PointerEvent) => {
      if (open && rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setCur(-1)
      }
    }
    document.addEventListener('pointerdown', onOutside, true)
    return () => document.removeEventListener('pointerdown', onOutside, true)
  }, [open])

  useEffect(() => () => {
    window.clearTimeout(tOpenRef.current)
    window.clearTimeout(tCloseRef.current)
  }, [])

  const mark = (idx: number, focus = false) => {
    setCur(idx)
    if (idx >= 0) {
      const btn = itemRefs.current[idx]
      if (btn) setHlStyle({ y: btn.offsetTop + 6, h: btn.offsetHeight })
      if (focus) btn?.focus({ preventScroll: true })
    }
  }

  const toggle = (next: boolean, backFocus = false) => {
    window.clearTimeout(tOpenRef.current)
    window.clearTimeout(tCloseRef.current)
    setOpen(next)
    if (!next) {
      setCur(-1)
      if (backFocus) triggerRef.current?.focus({ preventScroll: true })
    }
  }

  const enter = () => {
    window.clearTimeout(tCloseRef.current)
    if (!open) {
      window.clearTimeout(tOpenRef.current)
      tOpenRef.current = window.setTimeout(() => {
        hoverAtRef.current = Date.now()
        toggle(true)
      }, 120)
    }
  }

  const leave = () => {
    window.clearTimeout(tOpenRef.current)
    if (open) {
      window.clearTimeout(tCloseRef.current)
      tCloseRef.current = window.setTimeout(() => toggle(false), 240)
    }
  }

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      toggle(true)
      const target = e.key === 'ArrowDown' ? 0 : items.length - 1
      window.requestAnimationFrame(() => mark(target, true))
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      e.stopPropagation()
      toggle(false, true)
    }
  }

  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      toggle(false, true)
      return
    }
    const n = items.length
    if (!n) return
    const activeIdx = cur >= 0 ? cur : itemRefs.current.indexOf(document.activeElement as HTMLButtonElement)
    const to = e.key === 'ArrowDown' ? activeIdx + 1
      : e.key === 'ArrowUp' ? activeIdx - 1
        : e.key === 'Home' ? 0
          : e.key === 'End' ? n - 1 : null
    if (to === null) return
    e.preventDefault()
    mark((to + n) % n, true)
  }

  if (!items.length) return null

  return (
    <div
      ref={rootRef}
      className={`ux u413 ${open ? 'is-open' : ''}`.trim()}
      onBlur={(e) => {
        if (open && e.relatedTarget && rootRef.current && !rootRef.current.contains(e.relatedTarget as Node)) {
          toggle(false)
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="u413-tr"
        aria-expanded={open}
        aria-controls={panelId}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') enter() }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') leave() }}
        onClick={() => {
          if (open && Date.now() - hoverAtRef.current < 450) return
          toggle(!open)
        }}
        onKeyDown={onTriggerKey}
      >
        <span>{label}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 4.8 6 7.8l3-3" />
        </svg>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        className={`u413-pn ${cur >= 0 ? 'is-hl' : ''}`.trim()}
        role="region"
        aria-label={ariaLabel ?? label}
        aria-hidden={!open}
        style={{ left: panelOffset.left, right: 'auto', transformOrigin: `${panelOffset.originX} -8px` }}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') enter() }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') leave(); setCur(-1) }}
        onKeyDown={onPanelKey}
      >
        <span
          className="u413-hl"
          aria-hidden="true"
          style={{
            ['--hy' as string]: `${hlStyle.y}px`,
            ['--hh' as string]: `${hlStyle.h}px`,
          }}
        />
        <ul className="u413-ls">
          {items.map((item, idx) => (
            <li key={item.key}>
              <button
                ref={(el) => { itemRefs.current[idx] = el }}
                type="button"
                tabIndex={open ? 0 : -1}
                className={`u413-it ${cur === idx ? 'is-on' : ''}`.trim()}
                style={{ ['--i' as string]: idx }}
                onPointerEnter={() => mark(idx)}
                onFocus={() => mark(idx)}
                onClick={() => {
                  toggle(false, true)
                  item.onClick()
                }}
              >
                <span className={`u413-ic u413-${item.mau ?? `c${(idx % 4) + 1}`}`} aria-hidden="true">
                  {item.icon}
                </span>
                <span className="u413-tx">
                  <b>{item.label}</b>
                  {item.moTa && <small>{item.moTa}</small>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

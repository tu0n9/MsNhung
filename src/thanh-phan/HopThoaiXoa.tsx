import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface HopThoaiXoaProps {
  open: boolean
  title: string
  description?: ReactNode
  okText?: string
  cancelText?: string
  onConfirm: () => Promise<unknown> | unknown
  onCancel: () => void
}

/** Hộp thoại xác nhận xoá / thao tác cần cẩn trọng với hoạt ảnh thùng rác (#436). */
export default function HopThoaiXoa({
  open,
  title,
  description,
  okText = 'Xoá',
  cancelText = 'Thôi',
  onConfirm,
  onCancel,
}: HopThoaiXoaProps) {
  const [phase, setPhase] = useState<'idle' | 'del' | 'gone'>('idle')
  const [busy, setBusy] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const okRef = useRef<HTMLButtonElement>(null)
  const mountedRef = useRef(true)
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (open) {
      setPhase('idle')
      setBusy(false)
      const id = window.requestAnimationFrame(() => cancelRef.current?.focus({ preventScroll: true }))
      return () => window.cancelAnimationFrame(id)
    }
  }, [open])

  if (!open) return null

  const rm = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const closeWithFade = () => {
    setPhase('gone')
    window.setTimeout(() => {
      if (!mountedRef.current) return
      setBusy(false)
      setPhase('idle')
      onCancel()
    }, rm ? 60 : 250)
  }

  const handleConfirm = async () => {
    if (busy) return
    setBusy(true)
    setPhase('del')
    const start = Date.now()
    try {
      await onConfirm()
    } catch {
      if (!mountedRef.current) return
      setBusy(false)
      setPhase('idle')
      return
    }
    const elapsed = Date.now() - start
    const minBeat = rm ? 80 : 880
    if (elapsed < minBeat) {
      await new Promise((r) => window.setTimeout(r, minBeat - elapsed))
    }
    if (!mountedRef.current) return
    closeWithFade()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && !busy && phase !== 'gone') {
      e.preventDefault()
      e.stopPropagation()
      closeWithFade()
      return
    }
    if (e.key === 'Tab') {
      const a = document.activeElement
      if (e.shiftKey && a === cancelRef.current) {
        e.preventDefault()
        okRef.current?.focus({ preventScroll: true })
      } else if (!e.shiftKey && a === okRef.current) {
        e.preventDefault()
        cancelRef.current?.focus({ preventScroll: true })
      }
    }
  }

  return createPortal(
    <div
      className={`ux u436-backdrop ${phase === 'del' ? 'is-del' : phase === 'gone' ? 'is-gone' : ''}`.trim()}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) closeWithFade()
      }}
      onKeyDown={onKeyDown}
    >
      <div
        className="u436-d"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${uid}-t`}
        aria-describedby={description ? `${uid}-p` : undefined}
        tabIndex={-1}
      >
        <div className="u436-ic" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <defs>
              <clipPath id={`${uid}-clip`}>
                <rect x="-10" y="-30" width="52" height="40.5" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${uid}-clip)`}>
              <g className="doc">
                <path d="M12.5 -1.5h5l3 3v8h-8z" />
                <path d="M14.5 3.5h3.5M14.5 6h3.5" strokeWidth="1.2" />
              </g>
            </g>
            <g className="lid">
              <path d="M5.5 9.5h21" />
              <path d="M12.5 9V7a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 19.5 7v2" />
            </g>
            <g className="bd">
              <path d="M8 10.5l1.3 14.6a2.4 2.4 0 0 0 2.4 2.2h8.6a2.4 2.4 0 0 0 2.4-2.2L24 10.5" />
              <path d="M13.5 15v7.5M18.5 15v7.5" />
            </g>
          </svg>
        </div>
        <h3 id={`${uid}-t`}>{title}</h3>
        {description && <p id={`${uid}-p`}>{description}</p>}
        {!description && <div style={{ height: 14 }} />}
        <div className="u436-bs">
          <button
            ref={cancelRef}
            type="button"
            className="u436-no"
            aria-disabled={busy ? 'true' : undefined}
            onClick={() => { if (!busy) closeWithFade() }}
          >
            {cancelText}
          </button>
          <button
            ref={okRef}
            type="button"
            className="u436-ok"
            aria-disabled={busy ? 'true' : undefined}
            onClick={handleConfirm}
          >
            {okText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

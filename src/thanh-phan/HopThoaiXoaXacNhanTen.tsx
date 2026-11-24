import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Modal } from 'antd'

/** Hiệu ứng mảnh vỡ nhẹ khi xoá xong khối nguy hiểm (#269). */
export function bungManhVo(rect: DOMRect | null | undefined) {
  if (!rect || typeof document === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;pointer-events:none;z-index:1300;`
  document.body.appendChild(host)
  const stepX = Math.max(22, Math.round(rect.width / 12))
  const stepY = Math.max(18, Math.round(rect.height / 6))
  for (let y = 0; y < rect.height; y += stepY) {
    for (let x = 0; x < rect.width; x += stepX) {
      const piece = document.createElement('span')
      piece.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${stepX - 2}px;height:${stepY - 2}px;border-radius:4px;background:var(--ux-surface-3, #F5D8E2);`
      host.appendChild(piece)
      piece.animate?.(
        [
          { transform: 'none', opacity: 0.9 },
          {
            transform: `translate(${((Math.random() - 0.4) * 90).toFixed(0)}px, ${(35 + Math.random() * 110).toFixed(0)}px) rotate(${((Math.random() - 0.5) * 180).toFixed(0)}deg) scale(.35)`,
            opacity: 0,
          },
        ],
        {
          duration: 650 + Math.random() * 250,
          delay: (x / Math.max(1, rect.width)) * 160 + Math.random() * 60,
          easing: 'cubic-bezier(.5,0,.8,.6)',
          fill: 'forwards',
        },
      )
    }
  }
  window.setTimeout(() => host.remove(), 1200)
}

/** Hộp thoại vùng nguy hiểm: gõ đúng tên đối tượng (tô đỏ từng ký tự khớp) mới cho xoá (#269). */
export function HopThoaiXoaXacNhanTen({
  open,
  title,
  description,
  tenCanGo,
  nhanOInput = 'Gõ lại tên lớp',
  placeholder = 'Gõ lại tên lớp để xác nhận',
  okText = 'Xoá lớp',
  cancelText = 'Thôi',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  description: ReactNode
  tenCanGo: string
  nhanOInput?: string
  placeholder?: string
  okText?: string
  cancelText?: string
  onConfirm: () => Promise<unknown> | unknown
  onCancel: () => void
}) {
  const [giaTri, setGiaTri] = useState('')
  const [dang, setDang] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const lastLenRef = useRef(0)

  const mucTieu = tenCanGo.trim()

  useEffect(() => {
    if (open) {
      setGiaTri('')
      setDang(false)
      setShaking(false)
      lastLenRef.current = 0
      const timer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 140)
      return () => window.clearTimeout(timer)
    }
  }, [open])

  let matchCount = 0
  while (matchCount < giaTri.length && matchCount < mucTieu.length && giaTri[matchCount] === mucTieu[matchCount]) {
    matchCount++
  }
  const hopLe = mucTieu.length > 0 && giaTri.trim() === mucTieu

  const handleChange = (v: string) => {
    let k = 0
    while (k < v.length && k < mucTieu.length && v[k] === mucTieu[k]) k++
    if (v.length > lastLenRef.current && k < v.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShaking(false)
      window.requestAnimationFrame(() => setShaking(true))
    }
    lastLenRef.current = v.length
    setGiaTri(v)
  }

  const handleConfirm = async () => {
    if (!hopLe || dang) return
    const rect = boxRef.current?.closest('.ant-modal-content')?.getBoundingClientRect()
    setDang(true)
    try {
      await onConfirm()
      bungManhVo(rect)
    } finally {
      setDang(false)
    }
  }

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width={420}
      destroyOnHidden
      className="ant-modal-confirm u269-modal"
      onCancel={dang ? undefined : onCancel}
    >
      <div ref={boxRef} className="ux">
        <h4 className="u269-ht">
          <i aria-hidden="true">!</i>
          <span>{title}</span>
        </h4>
        <div className="u269-desc">{description}</div>
        <div className="u269-nm" aria-hidden="true">
          {mucTieu.split('').map((ch, idx) => (
            <span key={idx} className={idx < matchCount ? 'is-ok' : undefined}>{ch}</span>
          ))}
        </div>
        <input
          ref={inputRef}
          className={`u269-in ${shaking ? 'is-shake' : ''}`.trim()}
          aria-label={nhanOInput}
          placeholder={placeholder}
          value={giaTri}
          disabled={dang}
          autoComplete="off"
          spellCheck={false}
          onAnimationEnd={() => setShaking(false)}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && hopLe) handleConfirm()
          }}
        />
        <div className="u269-bs">
          <button type="button" className="u269-cx" disabled={dang} onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className="u269-go" disabled={!hopLe || dang} onClick={handleConfirm}>
            {dang ? 'Đang xoá...' : okText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

/** Thanh thông báo đáy màn hình kèm thanh tiến độ thu hẹp (#269). */
export function ThongBaoThanhTienDo({
  text,
  durationMs = 4500,
  onDone,
}: {
  text: string | null
  durationMs?: number
  onDone: () => void
}) {
  const barRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!text) return
    const bar = barRef.current
    const anim = bar?.animate?.(
      [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }],
      { duration: durationMs, fill: 'forwards', easing: 'linear' },
    )
    const timer = window.setTimeout(onDone, durationMs)
    return () => {
      anim?.cancel()
      window.clearTimeout(timer)
    }
  }, [text, durationMs, onDone])

  return (
    <div className={`ux u269-tt ${text ? 'is-on' : ''}`.trim()} role="status" aria-live="polite">
      <span>{text ?? ''}</span>
      <i ref={barRef} aria-hidden="true" />
    </div>
  )
}

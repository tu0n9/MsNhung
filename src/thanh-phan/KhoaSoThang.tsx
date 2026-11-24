import { useEffect, useRef, useState } from 'react'
import { Button, Tag } from 'antd'

/** Thanh trạng thái Chốt sổ / Mở khoá tháng với ổ khoá SVG hoạt ảnh (#350). */
export default function KhoaSoThang({
  daChot,
  thang,
  onChot,
  onMoKhoa,
}: {
  daChot: boolean
  thang: string
  onChot: () => void
  onMoKhoa: () => void
}) {
  const shackleRef = useRef<SVGPathElement>(null)
  const bodyRef = useRef<SVGGElement>(null)
  const keyholeRef = useRef<SVGGElement>(null)
  const mountedRef = useRef(false)
  const [pulse, setPulse] = useState(false)

  const open = !daChot
  const thangHien = thang.includes('-') ? `${thang.slice(5)}/${thang.slice(0, 4)}` : thang

  useEffect(() => {
    const sh = shackleRef.current
    const bd = bodyRef.current
    const kh = keyholeRef.current
    if (!sh || !bd || !kh) return
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const UP = 'translateY(-15px)'

    if (!mountedRef.current) {
      mountedRef.current = true
      sh.style.transform = open ? UP : 'none'
      kh.style.transform = open ? 'rotate(-90deg)' : 'none'
      return
    }

    if (rm || !sh.animate) {
      sh.style.transform = open ? UP : 'none'
      kh.style.transform = open ? 'rotate(-90deg)' : 'none'
      return
    }

    const anims: Animation[] = []
    if (open) {
      anims.push(kh.animate([{ transform: 'none' }, { transform: 'rotate(-90deg)' }], { duration: 220, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }))
      anims.push(sh.animate([{ transform: 'none' }, { transform: 'translateY(-19px)', offset: 0.55 }, { transform: UP }], { duration: 480, delay: 180, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'forwards' }))
      anims.push(bd.animate([{ transform: 'none' }, { transform: 'translateY(2px) scale(1.02,.97)', offset: 0.3 }, { transform: 'none' }], { duration: 360, delay: 180, easing: 'ease-out', fill: 'forwards' }))
    } else {
      anims.push(sh.animate([{ transform: UP }, { transform: 'translateY(-21px)', offset: 0.25 }, { transform: 'translateY(1.5px)', offset: 0.75 }, { transform: 'none' }], { duration: 440, fill: 'forwards', easing: 'cubic-bezier(.5,0,.4,1)' }))
      anims.push(bd.animate([{ transform: 'none', offset: 0 }, { transform: 'none', offset: 0.62 }, { transform: 'translateY(2px) scale(1.04,.94)', offset: 0.78 }, { transform: 'none' }], { duration: 560, fill: 'forwards' }))
      anims.push(kh.animate([{ transform: 'rotate(-90deg)' }, { transform: 'none' }], { duration: 220, delay: 360, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }))
    }
    setPulse(true)
    const timer = window.setTimeout(() => setPulse(false), 760)
    return () => {
      window.clearTimeout(timer)
      anims.forEach((a) => a.cancel())
    }
  }, [open])

  return (
    <div className={`ux u350-bar ${open ? 'is-open' : ''} ${pulse ? 'is-pulse' : ''}`.trim()}>
      <button
        type="button"
        className="u350-lk"
        aria-label={daChot ? `Mở khoá tháng ${thangHien}` : `Chốt sổ tháng ${thangHien}`}
        aria-pressed={daChot}
        onClick={daChot ? onMoKhoa : onChot}
      >
        <span className="u350-ring" aria-hidden="true" />
        <svg viewBox="0 0 96 112" aria-hidden="true">
          <path ref={shackleRef} className="u350-sh" d="M28 70 V40 a20 20 0 0 1 40 0 V60" />
          <g ref={bodyRef} className="u350-bd">
            <rect x="12" y="52" width="72" height="56" rx="16" />
            <g ref={keyholeRef} className="u350-kh">
              <circle cx="48" cy="76" r="7" />
              <rect x="45" y="78" width="6" height="13" rx="3" />
            </g>
          </g>
        </svg>
      </button>

      <div className="u350-info">
        <div className="u350-info-top">
          <b>Sổ tháng {thangHien}</b>
          {daChot ? <Tag color="green" style={{ margin: 0 }}>Đã chốt sổ</Tag> : <Tag style={{ margin: 0 }}>Đang mở sổ</Tag>}
        </div>
        <small>
          {daChot
            ? 'Đã khoá sửa điểm danh, phiếu thu và chi phí đến hết tháng này.'
            : 'Vẫn có thể ghi điểm danh, thu tiền và chỉnh sửa số liệu trong tháng.'}
        </small>
      </div>

      {daChot ? (
        <Button onClick={onMoKhoa}>Mở khoá</Button>
      ) : (
        <Button onClick={onChot}>Chốt sổ tháng</Button>
      )}
    </div>
  )
}

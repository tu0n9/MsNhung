import type { CSSProperties, MouseEvent } from 'react'
import type { CheDo } from '../giao-dien'

/** Nút chuyển đổi giao diện Sáng / Tối kèm SVG mặt trời / mặt trăng xoay mượt (#219). */
export default function NutDoiGiaoDien({ cheDo, onClick, className = '', style }: {
  cheDo: CheDo
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
  style?: CSSProperties
}) {
  const toi = cheDo === 'toi'
  return (
    <button
      type="button"
      className={`u219-tg ${className}`.trim()}
      style={style}
      onClick={onClick}
      aria-label={toi ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      aria-pressed={toi}
      title={toi ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
    >
      <svg className="u219-sun" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
        </g>
      </svg>
      <svg className="u219-moon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M13.5 9.8A5.6 5.6 0 0 1 6.2 2.5a5.6 5.6 0 1 0 7.3 7.3z" fill="currentColor" />
      </svg>
    </button>
  )
}

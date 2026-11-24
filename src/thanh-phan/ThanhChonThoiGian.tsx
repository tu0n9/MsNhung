import type { ReactNode } from 'react'
import dayjs from 'dayjs'

/** Thanh chọn ngày có nút tiến/lùi nhanh từng ngày và nhảy về Hôm nay. */
export function BoChonNgayNhanh({
  ngay,
  homNay,
  onChange,
  children,
}: {
  ngay: string
  homNay: string
  onChange: (ngayMoi: string) => void
  children: ReactNode
}) {
  return (
    <div className="ux ux-time-nav">
      <button
        type="button"
        className="ux-time-step"
        aria-label="Ngày trước"
        title="Ngày trước"
        onClick={() => onChange(dayjs(ngay).subtract(1, 'day').format('YYYY-MM-DD'))}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14.5 6-6 6 6 6" />
        </svg>
      </button>
      {children}
      <button
        type="button"
        className="ux-time-step"
        aria-label="Ngày sau"
        title="Ngày sau"
        onClick={() => onChange(dayjs(ngay).add(1, 'day').format('YYYY-MM-DD'))}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9.5 6 6 6-6 6" />
        </svg>
      </button>
      {ngay !== homNay && (
        <button
          type="button"
          className="ux-today-btn"
          onClick={() => onChange(homNay)}
        >
          Hôm nay
        </button>
      )}
    </div>
  )
}

/** Thanh chọn tháng có nút tiến/lùi nhanh từng tháng và nhảy về Tháng này. */
export function BoChonThangNhanh({
  thang,
  onChange,
  children,
}: {
  thang: string
  onChange: (thangMoi: string) => void
  children: ReactNode
}) {
  const thangNay = dayjs().format('YYYY-MM')
  return (
    <div className="ux ux-time-nav">
      <button
        type="button"
        className="ux-time-step"
        aria-label="Tháng trước"
        title="Tháng trước"
        onClick={() => onChange(dayjs(`${thang}-01`).subtract(1, 'month').format('YYYY-MM'))}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14.5 6-6 6 6 6" />
        </svg>
      </button>
      {children}
      <button
        type="button"
        className="ux-time-step"
        aria-label="Tháng sau"
        title="Tháng sau"
        onClick={() => onChange(dayjs(`${thang}-01`).add(1, 'month').format('YYYY-MM'))}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9.5 6 6 6-6 6" />
        </svg>
      </button>
      {thang !== thangNay && (
        <button
          type="button"
          className="ux-today-btn"
          onClick={() => onChange(thangNay)}
        >
          Tháng này
        </button>
      )}
    </div>
  )
}

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import dayjs from 'dayjs'
import { MAU } from '../giao-dien'
import { congThang, type Thang } from '../hoc-phi'
import type { ONgay, TrangThaiO } from '../diem-danh-thang'
import type { Lop } from '../supabase'

const TRANG_THAI: Record<TrangThaiO, { ten: string; style: CSSProperties }> = {
  co_mat: { ten: 'Có mặt', style: { background: MAU.totNhat, color: MAU.tot, fontWeight: 600 } },
  vang: { ten: 'Vắng', style: { background: MAU.doNhat, color: MAU.do, fontWeight: 600 } },
  hoc_bu: { ten: 'Học bù', style: { background: MAU.xanhNhat, color: MAU.xanh, fontWeight: 600 } },
  lop_nghi: { ten: 'Lớp nghỉ', style: { background: MAU.xam, color: MAU.chuMo, textDecoration: 'line-through' } },
  chua_diem_danh: { ten: 'Chưa điểm danh', style: { background: MAU.vang, color: MAU.chu, borderColor: MAU.vangDam } },
  sap_toi: { ten: 'Có lịch học', style: { color: MAU.chu, borderColor: MAU.vien } },
  trong: { ten: 'Không có buổi', style: { color: MAU.chuMo, opacity: 0.6 } },
}

const LOAI_BUOI = { lich: '', phu: 'Buổi phụ: ', bu: 'Buổi bù: ' }

/** Lưới điểm danh tháng có nút chuyển tháng và viền chọn trượt mượt giữa các ngày (#431). */
export default function LichDiemDanhThang({
  thang,
  onDoiThang,
  o,
  lopMap,
  lopIdsEm,
}: {
  thang: Thang
  onDoiThang: (thangMoi: Thang) => void
  o: (ONgay | null)[]
  lopMap: Map<string, Lop>
  lopIdsEm: Set<string>
}) {
  const [chonNgay, setChonNgay] = useState<string | undefined>(() => o.find((x) => x?.hom_nay)?.ngay)
  const [slideDir, setSlideDir] = useState<'l' | 'r' | ''>('')
  const prevThangRef = useRef<Thang>(thang)
  const gridRef = useRef<HTMLDivElement>(null)
  const selRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (thang !== prevThangRef.current) {
      const dir = thang > prevThangRef.current ? 'l' : 'r'
      prevThangRef.current = thang
      setChonNgay(o.find((x) => x?.hom_nay)?.ngay)
      setSlideDir(dir)
      const timer = window.setTimeout(() => setSlideDir(''), 400)
      return () => window.clearTimeout(timer)
    }
  }, [thang, o])

  const syncSel = useCallback((jump = false) => {
    const grid = gridRef.current
    const sel = selRef.current
    if (!grid || !sel) return
    const btn = chonNgay ? grid.querySelector<HTMLElement>(`[data-ngay="${chonNgay}"]`) : null
    if (jump) sel.classList.add('is-jump')
    if (btn) {
      sel.style.setProperty('--sx', `${btn.offsetLeft}px`)
      sel.style.setProperty('--sy', `${btn.offsetTop}px`)
      sel.style.setProperty('--sw', `${btn.offsetWidth}px`)
      sel.style.setProperty('--sh', `${btn.offsetHeight}px`)
      sel.style.setProperty('--ss', '1')
    } else {
      sel.style.setProperty('--ss', '0')
    }
    if (jump) {
      void sel.offsetWidth
      sel.classList.remove('is-jump')
    }
  }, [chonNgay])

  useLayoutEffect(() => {
    syncSel(false)
  }, [syncSel, thang, o])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || typeof ResizeObserver === 'undefined') return
    const obs = new ResizeObserver(() => syncSel(true))
    obs.observe(grid)
    return () => obs.disconnect()
  }, [syncSel])

  const chon = o.find((x) => x?.ngay === chonNgay) ?? null

  return (
    <div className="ux">
      <div className="u431-hd">
        <b>Tháng {thang.slice(5)}/{thang.slice(0, 4)}</b>
        <button
          type="button"
          className="u431-nav"
          aria-label="Tháng trước"
          onClick={() => onDoiThang(congThang(thang, -1))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.5 6-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          className="u431-nav"
          aria-label="Tháng sau"
          onClick={() => onDoiThang(congThang(thang, 1))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9.5 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="u431-wk" aria-hidden="true">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <div className="u431-gw">
        <div
          ref={gridRef}
          className={`u431-g ${slideDir === 'l' ? 'is-l' : slideDir === 'r' ? 'is-r' : ''}`.trim()}
        >
          <i ref={selRef} className="u431-sel" aria-hidden="true" />
          {o.map((x, i) => x === null ? <span key={`empty-${i}`} /> : (
            <button
              key={x.ngay}
              type="button"
              className="u431-d"
              data-ngay={x.ngay}
              data-trang-thai={x.trang_thai}
              onClick={() => setChonNgay(x.ngay)}
              aria-label={`${dayjs(x.ngay).format('DD/MM')}: ${TRANG_THAI[x.trang_thai].ten}`}
              aria-pressed={chon?.ngay === x.ngay}
              style={{
                ...TRANG_THAI[x.trang_thai].style,
                ...(x.hom_nay && { outline: `2px solid ${MAU.chu}`, outlineOffset: 1 }),
              }}
            >
              {Number(x.ngay.slice(8))}
              {x.trang_thai === 'hoc_bu' && (
                <span style={{ position: 'absolute', top: 1, right: 3, fontSize: 9, lineHeight: 1 }}>bù</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 0', borderTop: `1px solid ${MAU.vien}`, minHeight: 40 }} data-chi-tiet-ngay>
        {!chon ? <span style={{ color: MAU.chuPhu }}>Chạm vào một ngày để xem chi tiết</span> : <>
          <b style={{ textTransform: 'capitalize' }}>{dayjs(chon.ngay).format('dddd DD/MM')}</b>
          {chon.buoi.length === 0 && <div style={{ color: MAU.chuPhu }}>Không có buổi học</div>}
          {chon.buoi.map((b) => (
            <div key={b.buoi.id}>
              {lopMap.get(b.buoi.lop_id)?.ten ? <b>{lopMap.get(b.buoi.lop_id)!.ten} · </b> : null}
              {LOAI_BUOI[b.buoi.loai]}
              <span style={{ color: TRANG_THAI[b.trang_thai].style.color }}>{TRANG_THAI[b.trang_thai].ten}</span>
              {!lopIdsEm.has(b.buoi.lop_id) && ' (ở lớp khác)'}
              {(b.trang_thai === 'co_mat' || b.trang_thai === 'hoc_bu') && ` · ⭐ ${b.sticker}`}
            </div>
          ))}
        </>}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', fontSize: 12, color: MAU.chuPhu }}>
        {(['co_mat', 'vang', 'hoc_bu', 'lop_nghi', 'chua_diem_danh'] as const).map((k) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <i style={{ width: 14, height: 14, borderRadius: 4, border: '2px solid transparent', ...TRANG_THAI[k].style }} />
            {TRANG_THAI[k].ten}
          </span>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <i style={{ width: 14, height: 14, borderRadius: 4, border: `2px solid ${MAU.chu}` }} />
          Hôm nay
        </span>
      </div>
    </div>
  )
}

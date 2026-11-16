// Giờ học theo thứ và gom buổi cùng giờ (lớp gộp). Thuần, có test (gio-hoc.test.ts); không import supabase.ts để
// test không tạo client. Quy tắc ở docs/YEU-CAU.md mục "Giờ học theo thứ, lương trợ giảng theo ca, điểm danh gộp".

/** Khoá là getDay() (0 = Chủ nhật) như cột lop.lich; giờ dạng 'HH:MM'. */
export type GioThu = Record<string, { bd: string; kt: string }>

const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const THU_TU = [1, 2, 3, 4, 5, 6, 0]
const hai = (n: number) => String(n).padStart(2, '0')

/** Postgres trả cột time dạng '16:45:00'. */
export const hhmm = (t: string) => t.slice(0, 5)

/** Một ca mặc định 2 tiếng (người dùng chốt 2026-11-16). */
export function cong2Gio(bd: string): string {
  const [h, m] = bd.split(':').map(Number)
  const p = (h * 60 + m + 120) % (24 * 60)
  return `${hai(Math.floor(p / 60))}:${hai(p % 60)}`
}

type LichLop = { lich: number[]; gio_thu: GioThu }
const khoang = (g?: { bd: string; kt: string }) => g && `${g.bd}–${g.kt}`

/** "T2-T4-T6 17:30–19:00" khi mọi thứ cùng giờ, ngược lại "T7 08:00–09:30 · CN 09:30–11:00". */
export function moTaLich(lop: LichLop): string {
  const thu = THU_TU.filter((t) => lop.lich.includes(t))
  const gio = thu.map((t) => khoang(lop.gio_thu[t]))
  if (gio.length && gio[0] && gio.every((g) => g === gio[0])) return `${thu.map((t) => THU[t]).join('-')} ${gio[0]}`
  return thu.map((t, i) => `${THU[t]} ${gio[i] ?? 'chưa có giờ'}`).join(' · ')
}

export const thieuGio = (lop: LichLop) => lop.lich.some((t) => !lop.gio_thu[t])

/** Ô giờ trong file import: "8:00-9:30", "08:00–09:30", "8h00 - 9h30". Sai dạng hoặc kết thúc không sau bắt đầu → null. */
export function docOGio(v: string): { bd: string; kt: string } | null {
  const m = v.trim().match(/^(\d{1,2})[:hH](\d{2})\s*[-–—]\s*(\d{1,2})[:hH](\d{2})$/)
  if (!m) return null
  const [h1, p1, h2, p2] = m.slice(1).map(Number)
  if (h1 > 23 || h2 > 23 || p1 > 59 || p2 > 59) return null
  const bd = `${hai(h1)}:${hai(p1)}`, kt = `${hai(h2)}:${hai(p2)}`
  return kt > bd ? { bd, kt } : null
}

type CoGio = { id: string; ngay: string; bat_dau: string | null; ket_thuc?: string | null }

export const gioBuoi = (b: Omit<CoGio, 'id' | 'ngay'>) => (b.bat_dau && b.ket_thuc ? `${hhmm(b.bat_dau)}–${hhmm(b.ket_thuc)}` : '')

/**
 * Các buổi cùng ngày + cùng giờ bắt đầu là một nhóm (lớp dạy gộp, trợ giảng tính 1 ca); buổi chưa có giờ đứng riêng.
 * Nhóm xếp theo giờ, nhóm không giờ xuống cuối.
 */
export function nhomBuoi<B extends CoGio>(buois: B[]): B[][] {
  const nhom = new Map<string, B[]>()
  for (const b of buois) {
    const k = b.bat_dau ? `${b.ngay} ${hhmm(b.bat_dau)}` : b.id
    nhom.set(k, [...(nhom.get(k) ?? []), b])
  }
  return [...nhom.values()].sort((a, b) => (a[0].bat_dau ?? '99').localeCompare(b[0].bat_dau ?? '99'))
}

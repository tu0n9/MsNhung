import { describe, expect, it } from 'vitest'
import { luoiThang, type BuoiLich, type DiemDanhEm } from './diem-danh-thang'

const buoi = (ngay: string, b: Partial<BuoiLich> = {}): BuoiLich => ({ id: `${ngay}-${b.loai ?? 'lich'}`, lop_id: 'L', ngay, loai: 'lich', lop_nghi: false, ...b })
const dd = (b: BuoiLich, trang_thai: DiemDanhEm['trang_thai'], sticker = 0): DiemDanhEm => ({ trang_thai, sticker, buoi_hoc: b })
const o = (luoi: ReturnType<typeof luoiThang>, ngay: string) => luoi.find((x) => x?.ngay === ngay)!

describe('luoiThang', () => {
  it('tháng 11/2026 bắt đầu Chủ nhật: đệm 6 ô (T2 → T7), đủ 30 ngày', () => {
    const l = luoiThang('2026-11', [], [], '2026-01-01', true, '2026-11-15')
    expect(l.slice(0, 6)).toEqual(Array(6).fill(null))
    expect(l[6]?.ngay).toBe('2026-11-01')
    expect(luoiThang('2026-06', [], [], '2026-01-01', true, '2026-11-15')[0]?.ngay).toBe('2026-06-01') // 1/6/2026 là thứ Hai
    expect(l.filter(Boolean)).toHaveLength(30)
  })

  it('có mặt / vắng / chưa điểm danh / sắp tới / hôm nay / ngày không có buổi', () => {
    const b = ['02', '03', '04', '15', '20'].map((d) => buoi(`2026-11-${d}`))
    const l = luoiThang('2026-11', b, [dd(b[0], 'co_mat', 2), dd(b[1], 'vang')], '2026-01-01', true, '2026-11-15')
    expect(o(l, '2026-11-02')).toMatchObject({ trang_thai: 'co_mat', buoi: [{ sticker: 2 }] })
    expect(o(l, '2026-11-03').trang_thai).toBe('vang')
    expect(o(l, '2026-11-04').trang_thai).toBe('chua_diem_danh')
    // hôm nay chưa điểm danh chưa phải quên
    expect(o(l, '2026-11-15')).toMatchObject({ trang_thai: 'sap_toi', hom_nay: true })
    expect(o(l, '2026-11-20').trang_thai).toBe('sap_toi')
    expect(o(l, '2026-11-05')).toMatchObject({ trang_thai: 'trong', hom_nay: false, buoi: [] })
  })

  it('lớp nghỉ; buổi trước ngày vào học và buổi bù riêng em không đến thì bỏ qua', () => {
    const l = luoiThang('2026-11', [
      buoi('2026-11-02', { lop_nghi: true }), buoi('2026-11-03'), buoi('2026-11-10', { loai: 'bu' }),
    ], [], '2026-11-03', true, '2026-11-15')
    expect(o(l, '2026-11-02').trang_thai).toBe('trong') // trước ngày vào học, kể cả lớp nghỉ
    expect(o(l, '2026-11-10').trang_thai).toBe('trong')
    const l2 = luoiThang('2026-11', [buoi('2026-11-02', { lop_nghi: true })], [], '2026-01-01', true, '2026-11-15')
    expect(o(l2, '2026-11-02').trang_thai).toBe('lop_nghi')
  })

  it('học bù ở lớp khác hiện dù lớp mình không có buổi hôm đó', () => {
    const khac = buoi('2026-11-06', { lop_id: 'K' })
    const l = luoiThang('2026-11', [], [dd(khac, 'hoc_bu')], '2026-01-01', true, '2026-11-15')
    expect(o(l, '2026-11-06').trang_thai).toBe('hoc_bu')
  })

  it('ngày nhiều buổi: Vắng > Chưa điểm danh > Học bù > Có mặt', () => {
    const lich = buoi('2026-11-02'), bu = buoi('2026-11-02', { loai: 'bu' })
    expect(o(luoiThang('2026-11', [lich, bu], [dd(lich, 'co_mat'), dd(bu, 'hoc_bu')], '2026-01-01', true, '2026-11-15'), '2026-11-02'))
      .toMatchObject({ trang_thai: 'hoc_bu', buoi: [{ trang_thai: 'hoc_bu' }, { trang_thai: 'co_mat' }] })
    expect(o(luoiThang('2026-11', [lich, bu], [dd(lich, 'vang'), dd(bu, 'hoc_bu')], '2026-01-01', true, '2026-11-15'), '2026-11-02').trang_thai).toBe('vang')
    expect(o(luoiThang('2026-11', [lich, bu], [dd(bu, 'hoc_bu')], '2026-01-01', true, '2026-11-15'), '2026-11-02').trang_thai).toBe('chua_diem_danh')
  })

  it('học sinh đã ngừng học: buổi chưa điểm danh không báo, buổi đã điểm danh vẫn hiện', () => {
    const b = [buoi('2026-11-02'), buoi('2026-11-03')]
    const l = luoiThang('2026-11', b, [dd(b[0], 'co_mat')], '2026-01-01', false, '2026-11-15')
    expect(o(l, '2026-11-02').trang_thai).toBe('co_mat')
    expect(o(l, '2026-11-03').trang_thai).toBe('trong')
  })
})

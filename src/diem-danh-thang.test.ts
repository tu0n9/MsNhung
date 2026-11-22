import { describe, expect, it } from 'vitest'
import { dsHocSinhBuoi, luoiThang, type BuoiLich, type DiemDanhEm, type GhiDanhBuoi } from './diem-danh-thang'

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

describe('dsHocSinhBuoi (10a)', () => {
  const tatCaHs = [
    { id: 'h-dang', ho_ten: 'Em Đang Học' },
    { id: 'h-ngung', ho_ten: 'Em Đã Ngừng' },
    { id: 'h-bu', ho_ten: 'Em Học Bù Lớp Khác' },
  ]
  const ghiDanh: GhiDanhBuoi[] = [
    { hoc_sinh_id: 'h-dang', lop_id: 'L1', ngay_vao: '2026-11-01', trang_thai: 'dang_hoc' },
    { hoc_sinh_id: 'h-ngung', lop_id: 'L1', ngay_vao: '2026-11-01', trang_thai: 'ngung' },
    { hoc_sinh_id: 'h-bu', lop_id: 'L2', ngay_vao: '2026-11-01', trang_thai: 'dang_hoc' },
  ]

  it('buổi cũ có điểm danh của em ngừng học: giữ trong danh sách và KHÔNG gắn học bù', () => {
    const kq = dsHocSinhBuoi(tatCaHs, ghiDanh, 'L1', '2026-11-10', {
      'h-dang': { trang_thai: 'co_mat' },
      'h-ngung': { trang_thai: 'co_mat' },
      'h-bu': { trang_thai: 'hoc_bu' },
    })
    expect(kq.ds.map((x) => x.id)).toEqual(['h-dang', 'h-ngung', 'h-bu'])
    expect(kq.cuaLopTatCaIds.has('h-dang')).toBe(true)
    expect(kq.cuaLopTatCaIds.has('h-ngung')).toBe(true)
    expect(kq.cuaLopTatCaIds.has('h-bu')).toBe(false)
  })

  it('buổi mới chưa điểm danh: em ngừng học không tự hiện, chỉ hiện em đang học và em học bù (nếu có)', () => {
    const kq = dsHocSinhBuoi(tatCaHs, ghiDanh, 'L1', '2026-11-23', {})
    expect(kq.ds.map((x) => x.id)).toEqual(['h-dang'])
  })

  it('học sinh chuyển vào lớp sau ngày buổi diễn ra mà trước đó qua học bù vẫn tính là học bù ở buổi cũ', () => {
    const gdSau: GhiDanhBuoi[] = [
      { hoc_sinh_id: 'h-bu', lop_id: 'L1', ngay_vao: '2026-11-20', trang_thai: 'dang_hoc' },
    ]
    const kq = dsHocSinhBuoi(tatCaHs, gdSau, 'L1', '2026-11-10', { 'h-bu': { trang_thai: 'hoc_bu' } })
    expect(kq.ds.map((x) => x.id)).toEqual(['h-bu'])
    expect(kq.cuaLopTatCaIds.has('h-bu')).toBe(false)
  })
})

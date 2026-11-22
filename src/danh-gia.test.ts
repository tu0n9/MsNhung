import { describe, expect, it } from 'vitest'
import { hanNhan, thongKeDaGui, tongHop, type DiemTroGiang, type PhieuDanhGia } from './danh-gia'

const tg = (id: string, d: [number, number, number], nhan_xet: string | null = null): DiemTroGiang =>
  ({ id, ten: id === 'a' ? 'Cô An' : 'Thầy Bình', kien_thuc: d[0], tuong_tac: d[1], ho_tro: d[2], nhan_xet, chua_bai: null })
const phieu = (lop: string, hs: string, t: DiemTroGiang[], khoa_hoc: string | null = null): PhieuDanhGia => ({
  id: hs, thang: '2026-11-01', lop_id: lop, ten_lop: `Lớp ${lop}`, hoc_sinh_id: hs, ten_hoc_sinh: hs,
  khoa_hoc, kho_khan: null, tro_giang: t, gui_luc: '2026-11-30T10:00:00Z',
})

const ds = [
  phieu('1', 'Minh', [tg('a', [5, 4, 4], 'Cô vui'), tg('b', [3, 3, 3])], 'Hay'),
  phieu('1', 'Lan', [tg('a', [4, 4, 5])]),
  phieu('2', 'Hùng', []), // không có trợ giảng
]

describe('tongHop', () => {
  it('trung bình từng trợ giảng, một phiếu chấm nhiều người', () => {
    const k = tongHop(ds)
    expect(k.soPhieu).toBe(3)
    expect(k.troGiang.map((t) => [t.ten, t.soPhieu, t.kien_thuc, t.tuong_tac, t.ho_tro, t.chung])).toEqual([
      ['Cô An', 2, 4.5, 4, 4.5, 4.3],
      ['Thầy Bình', 1, 3, 3, 3, 3],
    ])
    expect(k.theoLop).toEqual([['Lớp 1', 2], ['Lớp 2', 1]])
    expect(k.nhanXet.khoa_hoc).toEqual([{ noiDung: 'Hay', hocSinh: 'Minh', lop: 'Lớp 1' }])
    expect(k.nhanXet.nhan_xet).toEqual([{ noiDung: 'Cô vui', hocSinh: 'Minh', lop: 'Lớp 1', troGiang: 'Cô An' }])
  })
  it('lọc theo lớp; lớp chỉ có phiếu không trợ giảng thì bảng trợ giảng rỗng', () => {
    expect(tongHop(ds, '2')).toMatchObject({ soPhieu: 1, troGiang: [] })
  })
})

it('hạn nhận phiếu là ngày 5 tháng sau, qua năm', () => {
  expect(hanNhan('2026-11')).toBe('2026-12-05')
  expect(hanNhan('2026-12')).toBe('2027-01-05')
})

describe('thongKeDaGui (10b)', () => {
  const lops = [
    { id: 'A', ten: 'Lớp A', hoat_dong: true },
    { id: 'B', ten: 'Lớp B', hoat_dong: true },
    { id: 'C', ten: 'Lớp C đã nghỉ', hoat_dong: false },
  ]
  const hss = [
    { id: 'hs1', ho_ten: 'An Nhiều Lớp' },
    { id: 'hs2', ho_ten: 'Bình Lớp B' },
    { id: 'hs3', ho_ten: 'Chi Đã Ngừng' },
  ]
  const gds = [
    { hoc_sinh_id: 'hs1', lop_id: 'A', trang_thai: 'dang_hoc' as const },
    { hoc_sinh_id: 'hs1', lop_id: 'B', trang_thai: 'dang_hoc' as const },
    { hoc_sinh_id: 'hs2', lop_id: 'B', trang_thai: 'dang_hoc' as const },
    { hoc_sinh_id: 'hs3', lop_id: 'A', trang_thai: 'ngung' as const },
    { hoc_sinh_id: 'hs3', lop_id: 'C', trang_thai: 'dang_hoc' as const },
  ]
  const phieus: Pick<PhieuDanhGia, 'hoc_sinh_id' | 'lop_id'>[] = [
    { hoc_sinh_id: 'hs1', lop_id: 'A' },
  ]

  it('xem tất cả lớp: mỗi em học nhiều lớp chỉ đếm 1 trong tongEm và soEmDaGui', () => {
    const kq = thongKeDaGui(phieus, lops, hss, gds)
    expect(kq.tongEm).toBe(2)
    expect(kq.soEmDaGui).toBe(1)
    expect(kq.nhomLop.map((x) => ({ lop: x.l.id, tong: x.tong, chua: x.chua.map((h) => h.id) }))).toEqual([
      { lop: 'B', tong: 2, chua: ['hs2'] },
      { lop: 'A', tong: 1, chua: [] },
    ])
  })

  it('lọc theo lớp B: em học cả A & B gửi qua A vẫn tính soEmDaGui = 1, khớp dòng chi tiết 1/2', () => {
    const kq = thongKeDaGui(phieus, lops, hss, gds, 'B')
    expect(kq.tongEm).toBe(2)
    expect(kq.soEmDaGui).toBe(1)
    expect(kq.nhomLop).toHaveLength(1)
    expect(kq.nhomLop[0].tong - kq.nhomLop[0].chua.length).toBe(kq.soEmDaGui)
  })

  it('không cộng phiếu của em đã ngừng học hoặc lớp ngừng hoạt động vào soEmDaGui vượt quá tongEm', () => {
    const phieuCoNgung = [...phieus, { hoc_sinh_id: 'hs3', lop_id: 'A' }, { hoc_sinh_id: null, lop_id: 'B' }]
    const kq = thongKeDaGui(phieuCoNgung, lops, hss, gds)
    expect(kq.tongEm).toBe(2)
    expect(kq.soEmDaGui).toBe(1)
  })
})

import { describe, expect, it } from 'vitest'
import { hanNhan, tongHop, type DiemTroGiang, type PhieuDanhGia } from './danh-gia'

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

import { describe, expect, it } from 'vitest'
import ExcelJS from 'exceljs'
import { chuanNgay, chuanSdt, chuanTien, docFile, kiemTra, type DongHsTho, type DongLopTho } from './import-excel'
import type { HocSinh, Lop } from './supabase'

const HOM_NAY = '2026-11-15'
const lopCo: Lop[] = [{ id: 'l1', ten: 'Starters 1', don_gia: 100000, lich: [1, 3], hoat_dong: true }]
const hsCo = [{ id: 'h1', ho_ten: 'Trần Khánh Linh', lop_id: 'l1', sdt_phu_huynh: '0903615240' }] as HocSinh[]
const hs = (so: number, o: Partial<DongHsTho>): DongHsTho => ({
  so, hoTen: 'Lê Minh Châu', lop: 'Starters 1', tenPh: '', sdt: '', ngayVao: '', donGiaRieng: '', sticker: '', ghiChu: '', ...o,
})
const lop = (so: number, ten: string, donGia: unknown, thu: string): DongLopTho =>
  ({ so, ten, donGia, thu: [...thu].map((c) => (c === 'x' ? 'x' : c === '.' ? '' : c)) })

describe('chuẩn hoá ô', () => {
  it('SĐT: bỏ ký tự thừa, +84 thành 0, số mất 0 đầu do ô kiểu số, báo lỗi khi thiếu số', () => {
    expect(chuanSdt('0912 487.305').sdt).toBe('0912487305')
    expect(chuanSdt('+84 912 487 305').sdt).toBe('0912487305')
    expect(chuanSdt(912487305).sdt).toBe('0912487305')
    expect(chuanSdt('091248730').loi).toMatch(/10 số/)
    expect(chuanSdt('').sdt).toBeNull()
  })
  it('tiền: "150.000", số, âm, chữ', () => {
    expect(chuanTien('150.000', 'Đơn giá', true).so).toBe(150000)
    expect(chuanTien(120000, 'Đơn giá', true).so).toBe(120000)
    expect(chuanTien('-50000', 'Đơn giá', true).loi).toMatch(/âm/)
    expect(chuanTien('', 'Đơn giá', true).loi).toMatch(/Thiếu/)
    expect(chuanTien('', 'Đơn giá riêng', false).so).toBeNull()
  })
  it('ngày: ô ngày, chữ dd/mm/yyyy, trống = hôm nay, ngày không có thật', () => {
    expect(chuanNgay(new Date(Date.UTC(2026, 10, 1)), HOM_NAY).ngay).toBe('2026-11-01')
    expect(chuanNgay('3/9/2026', HOM_NAY).ngay).toBe('2026-09-03')
    expect(chuanNgay('', HOM_NAY).ngay).toBe(HOM_NAY)
    expect(chuanNgay('31/02/2026', HOM_NAY).loi).toMatch(/không có thật/)
  })
})

describe('kiemTra', () => {
  it('lớp: đã có thì bỏ qua (không phân biệt hoa thường), lớp mới cần đơn giá và ít nhất một thứ', () => {
    const { lops } = kiemTra([
      lop(2, 'starters 1', 999, 'x......'),
      lop(3, 'Movers 2', '120.000', '.x.x.x.'),
      lop(4, 'Flyers A', '', 'x......'),
      lop(5, 'Flyers B', 100000, '.......'),
      lop(6, 'Flyers C', 100000, 'v......'),
    ], [], lopCo, [], HOM_NAY)
    expect(lops.map((l) => l.trangThai)).toEqual(['da_co', 'moi', 'loi', 'loi', 'loi'])
    expect(lops[1].lich).toEqual([2, 4, 6])
    expect(lops[1].don_gia).toBe(120000)
  })

  it('học sinh: trùng (tên + lớp + SĐT) thì bỏ qua; lớp mới trong cùng file dùng được; trùng trong file bỏ qua', () => {
    const { hss } = kiemTra([lop(2, 'Movers 2', 120000, '.x.....')], [
      hs(2, { hoTen: 'Trần Khánh Linh', sdt: '0903 615 240' }),
      hs(3, { lop: 'Movers 2', sdt: '0987220413', sticker: 12 }),
      hs(4, { lop: 'Movers 2', sdt: '0987220413' }),
      hs(5, { hoTen: 'Trần Khánh Linh', sdt: '0909000000' }),
    ], lopCo, hsCo, HOM_NAY)
    expect(hss.map((h) => h.trangThai)).toEqual(['da_co', 'moi', 'da_co', 'moi'])
    expect(hss[1].sticker_dau_ky).toBe(12)
    expect(hss[1].ngay_vao).toBe(HOM_NAY)
  })

  it('học sinh lỗi: thiếu tên, thiếu lớp, lớp không có, SĐT sai', () => {
    const { hss } = kiemTra([], [
      hs(2, { hoTen: '' }), hs(3, { lop: '' }), hs(4, { lop: 'Lớp ma' }), hs(5, { sdt: '091248730' }),
    ], lopCo, [], HOM_NAY)
    expect(hss.every((h) => h.trangThai === 'loi')).toBe(true)
    expect(hss.map((h) => h.loi)).toEqual([
      'Thiếu họ tên', 'Chưa chọn lớp', 'Lớp "Lớp ma" chưa có (hoặc dòng lớp đó đang lỗi)',
      'SĐT phụ huynh "091248730" phải có 10 số, bắt đầu bằng 0',
    ])
  })
})

describe('docFile', () => {
  it('đọc đúng trang Lớp và Học sinh, bỏ dòng "Ví dụ" và dòng trống', async () => {
    const wb = new ExcelJS.Workbook()
    const l = wb.addWorksheet('Lớp')
    l.addRow(['Tên lớp *', 'Đơn giá/buổi *', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'])
    l.addRow(['Ví dụ: Movers 2', 120000, '', 'x'])
    l.addRow(['Flyers A', 150000, 'x', '', 'x'])
    const h = wb.addWorksheet('Học sinh')
    h.addRow(['Họ tên *', 'Lớp *', 'Tên phụ huynh', 'SĐT phụ huynh', 'Ngày vào học', 'Đơn giá riêng', 'Sticker đã có', 'Ghi chú'])
    h.addRow(['Ví dụ: Nguyễn Gia Bảo', 'Movers 2'])
    h.addRow([])
    h.addRow(['Đỗ Hải Yến', 'Flyers A', 'Chị Mai', '0911222333', new Date(Date.UTC(2026, 9, 5)), '', 4, ''])
    const buf = await wb.xlsx.writeBuffer()
    const { lopTho, hsTho } = await docFile(buf as ArrayBuffer)
    expect(lopTho.map((x) => x.so)).toEqual([3])
    expect(hsTho.map((x) => x.so)).toEqual([4])
    const { lops, hss } = kiemTra(lopTho, hsTho, [], [], HOM_NAY)
    expect(lops[0]).toMatchObject({ trangThai: 'moi', ten: 'Flyers A', lich: [1, 3] })
    expect(hss[0]).toMatchObject({ trangThai: 'moi', ngay_vao: '2026-10-05', sdt_phu_huynh: '0911222333', sticker_dau_ky: 4 })
  })

  it('file thiếu trang thì báo rõ', async () => {
    const wb = new ExcelJS.Workbook()
    wb.addWorksheet('Sheet1')
    await expect(docFile((await wb.xlsx.writeBuffer()) as ArrayBuffer)).rejects.toThrow(/Lớp/)
  })
})

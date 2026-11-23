import { describe, expect, it } from 'vitest'
import { chuanSdtTim, coCanHienGiaRieng, conHocSauSua, dsHocSinhCoTheThemVaoLop, ghiDanhCanDongBoNgay, locGoiYHocSinh, locHocSinh, phanLoaiHocSinh, trangThaiHsSauGhiDanh, trangThaiHsSauSua } from './lop-hoc'
import { O_TIEN } from './giao-dien'

const dsMau = [
  { id: '1', ho_ten: 'Nguyễn Bảo An', ma_hs: 'HS001', sdt_phu_huynh: '0911223344' },
  { id: '2', ho_ten: 'Trần Gia Huy', ma_hs: 'HS002', sdt_phu_huynh: '0988 777 666' },
  { id: '3', ho_ten: 'Lê Minh Khôi', ma_hs: 'HS003', sdt_phu_huynh: null },
]

describe('chuanSdtTim', () => {
  it('loại bỏ dấu cách, dấu chấm, dấu gạch để giữ lại chữ số', () => {
    expect(chuanSdtTim('0911 223 344')).toBe('0911223344')
    expect(chuanSdtTim('0911.223.344')).toBe('0911223344')
    expect(chuanSdtTim('0911-223-344')).toBe('0911223344')
  })
})

describe('locGoiYHocSinh (7j)', () => {
  it('khớp SĐT phụ huynh ngay cả khi gõ dấu cách, dấu chấm hoặc dấu gạch', () => {
    expect(locGoiYHocSinh(dsMau, '0911 223 344').ketQua.map((x) => x.id)).toEqual(['1'])
    expect(locGoiYHocSinh(dsMau, '0911.223.344').ketQua.map((x) => x.id)).toEqual(['1'])
    expect(locGoiYHocSinh(dsMau, '0988-777-666').ketQua.map((x) => x.id)).toEqual(['2'])
  })

  it('tìm theo tên không dấu và theo mã HS không khớp nhầm vào SĐT', () => {
    expect(locGoiYHocSinh(dsMau, 'nguyen bao an').ketQua.map((x) => x.id)).toEqual(['1'])
    const dsMaTrungSo = [
      { id: 'a', ho_ten: 'Em A', ma_hs: 'HS001', sdt_phu_huynh: null },
      { id: 'b', ho_ten: 'Em B', ma_hs: 'HS099', sdt_phu_huynh: '0900100199' },
    ]
    expect(locGoiYHocSinh(dsMaTrungSo, 'HS001').ketQua.map((x) => x.id)).toEqual(['a'])
  })

  it('báo biCat = true và giữ đúng tong khi số kết quả khớp vượt quá giới hạn 12', () => {
    const nhieuHs = Array.from({ length: 15 }, (_, i) => ({
      id: `id-${i + 1}`,
      ho_ten: `Học sinh ${i + 1}`,
      ma_hs: `HS${String(i + 1).padStart(3, '0')}`,
      sdt_phu_huynh: null,
    }))
    const kq = locGoiYHocSinh(nhieuHs, '')
    expect(kq.ketQua).toHaveLength(12)
    expect(kq.tong).toBe(15)
    expect(kq.biCat).toBe(true)

    const kqDu = locGoiYHocSinh(nhieuHs.slice(0, 12), '')
    expect(kqDu.ketQua).toHaveLength(12)
    expect(kqDu.tong).toBe(12)
    expect(kqDu.biCat).toBe(false)
  })
})

describe('coCanHienGiaRieng (7b)', () => {
  it('hiện ô giá riêng khi emDaChon đã có 1 lớp cũ và chọn thêm 1 lớp mới', () => {
    expect(coCanHienGiaRieng(['lop-b'], ['lop-a'], {})).toBe(true)
  })

  it('không hiện khi chỉ chọn lại đúng 1 lớp cũ hoặc em mới chỉ học 1 lớp và chưa có giá riêng', () => {
    expect(coCanHienGiaRieng(['lop-a'], ['lop-a'], {})).toBe(false)
    expect(coCanHienGiaRieng(['lop-a'], [], {})).toBe(false)
  })

  it('vẫn hiện nếu đã nhập giá riêng hoặc chọn từ 2 lớp trở lên', () => {
    expect(coCanHienGiaRieng(['lop-a'], [], { 'lop-a': 120000 })).toBe(true)
    expect(coCanHienGiaRieng(['lop-a', 'lop-b'], [], {})).toBe(true)
  })
})

describe('conHocSauSua (7f)', () => {
  it('trả false khi bỏ lớp đang học cuối cùng và chỉ còn lớp ngừng', () => {
    const cuGds = [
      { lop_id: 'lop-a', trang_thai: 'ngung' as const },
      { lop_id: 'lop-b', trang_thai: 'dang_hoc' as const },
    ]
    expect(conHocSauSua(cuGds, ['lop-a'])).toBe(false)
  })

  it('trả true khi học sinh đang ngừng được tick thêm lớp mới', () => {
    const cuGds = [{ lop_id: 'lop-a', trang_thai: 'ngung' as const }]
    expect(conHocSauSua(cuGds, ['lop-a', 'lop-b'])).toBe(true)
  })

  it('trả true khi còn ít nhất một lớp giữ lại đang học', () => {
    const cuGds = [
      { lop_id: 'lop-a', trang_thai: 'dang_hoc' as const },
      { lop_id: 'lop-b', trang_thai: 'dang_hoc' as const },
    ]
    expect(conHocSauSua(cuGds, ['lop-a'])).toBe(true)
  })
})

describe('ghiDanhCanDongBoNgay (7d)', () => {
  it('cập nhật ghi_danh cùng ngày vào cũ hoặc học 1 lớp khi đổi Ngày vào học', () => {
    const cuGds = [
      { id: 'g1', lop_id: 'lop-a', ngay_vao: '2026-11-01' },
      { id: 'g2', lop_id: 'lop-b', ngay_vao: '2026-11-15' },
    ]
    expect(ghiDanhCanDongBoNgay(cuGds, ['lop-a', 'lop-b'], '2026-11-01', '2026-11-05').map((g) => g.id)).toEqual(['g1'])
    expect(ghiDanhCanDongBoNgay([{ id: 'g1', lop_id: 'lop-a', ngay_vao: '2026-10-20' }], ['lop-a'], '2026-11-01', '2026-11-05').map((g) => g.id)).toEqual(['g1'])
  })

  it('không cập nhật khi Ngày vào học không đổi hoặc bỏ qua lớp vừa bị bỏ tick', () => {
    const cuGds = [{ id: 'g1', lop_id: 'lop-a', ngay_vao: '2026-11-01' }]
    expect(ghiDanhCanDongBoNgay(cuGds, ['lop-a'], '2026-11-01', '2026-11-01')).toEqual([])
    expect(ghiDanhCanDongBoNgay(cuGds, [], '2026-11-01', '2026-11-05')).toEqual([])
  })
})

describe('quản lý học sinh độc lập (chưa xếp lớp, thêm vào lớp, định dạng đơn giá)', () => {
  it('phanLoaiHocSinh phân biệt đúng dang_hoc, chua_xep và ngung', () => {
    const gds = [
      { hoc_sinh_id: 'h1', trang_thai: 'dang_hoc' as const },
      { hoc_sinh_id: 'h2', trang_thai: 'ngung' as const },
      { hoc_sinh_id: 'h3', trang_thai: 'ngung' as const },
      { hoc_sinh_id: 'h3', trang_thai: 'dang_hoc' as const },
    ]
    expect(phanLoaiHocSinh('h1', gds)).toBe('dang_hoc')
    expect(phanLoaiHocSinh('h2', gds)).toBe('ngung')
    expect(phanLoaiHocSinh('h3', gds)).toBe('dang_hoc')
    expect(phanLoaiHocSinh('h4', gds)).toBe('chua_xep')
  })

  it('trangThaiHsSauGhiDanh & trangThaiHsSauSua giữ dang_hoc khi học sinh chuyển về Chưa xếp lớp (0 lớp)', () => {
    expect(trangThaiHsSauGhiDanh([])).toBe('dang_hoc')
    expect(trangThaiHsSauGhiDanh([{ trang_thai: 'ngung' }])).toBe('ngung')
    expect(trangThaiHsSauGhiDanh([{ trang_thai: 'ngung' }, { trang_thai: 'dang_hoc' }])).toBe('dang_hoc')
    expect(trangThaiHsSauSua([{ lop_id: 'l1', trang_thai: 'dang_hoc' }], [])).toBe('dang_hoc')
    expect(trangThaiHsSauSua([{ lop_id: 'l1', trang_thai: 'ngung' }], ['l1'])).toBe('ngung')
  })

  it('dsHocSinhCoTheThemVaoLop bỏ qua em đang học lớp đó, giữ em chưa xếp lớp và đánh dấu em từng học (ngung)', () => {
    const gds = [
      { hoc_sinh_id: '1', lop_id: 'l1', trang_thai: 'dang_hoc' as const },
      { hoc_sinh_id: '2', lop_id: 'l1', trang_thai: 'ngung' as const },
    ]
    const kq = dsHocSinhCoTheThemVaoLop(dsMau, gds, 'l1')
    expect(kq.map((x) => [x.h.id, x.chuaXep, x.tungHoc])).toEqual([
      ['3', true, false],
      ['2', false, true],
    ])
    expect(locHocSinh(dsMau, '0988777666').map((x) => x.id)).toEqual(['2'])
  })

  it('O_TIEN định dạng dấu phẩy mỗi 3 chữ số và đọc được cả dấu phẩy lẫn dấu chấm', () => {
    expect(O_TIEN.formatter(150000)).toBe('150,000')
    expect(O_TIEN.formatter(1000000)).toBe('1,000,000')
    expect(O_TIEN.formatter(0)).toBe('0')
    expect(O_TIEN.parser('150,000')).toBe('150000')
    expect(O_TIEN.parser('150.000')).toBe('150000')
    expect(O_TIEN.parser('')).toBe('')
  })
})

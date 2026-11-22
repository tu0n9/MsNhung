import { describe, expect, it } from 'vitest'
import { chuanSdtTim, coCanHienGiaRieng, conHocSauSua, ghiDanhCanDongBoNgay, locGoiYHocSinh } from './lop-hoc'

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

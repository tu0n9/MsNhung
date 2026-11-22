import { describe, expect, it } from 'vitest'
import {
  conNoGoi, demBuoiDuKien, demBuoiDuKienNhieuLop, demChuaBu, demNghiPhu, duConLai, duConLaiNhieuLop, goiCuaThang,
  hocPhiGocThang, tenGoi, tienDuGoiNhieuLop, tinhTienThangNhieuLop, tinhTrangGoi, tinhTrangGoiNhieuLop, tinNhanGiaHan, vnd,
  type PhieuThu, phaiThuTheoThang, tienDu, tongGoi, tongHopHocSinh,
  trangThaiThang, type BuoiDacBiet, type BuoiDacBietLop, type Goi,
} from './hoc-phi'

const goi = (g: Partial<Goi>): Goi => ({
  id: 'g1', hoc_sinh_id: 'hs', thang_bat_dau: '2026-04-01', so_thang: 1, don_gia: 100_000,
  buoi_du_kien: { '2026-04': 12 }, tien_du_tru: 0, dieu_chinh: 0, ...g,
})

describe('demBuoiDuKien', () => {
  it('đếm thứ 2-4-6 của tháng 11/2026, và từ ngày vào học giữa tháng', () => {
    expect(demBuoiDuKien([1, 3, 5], '2026-11', 1)).toEqual({ '2026-11': 13 })
    expect(demBuoiDuKien([1, 3, 5], '2026-11', 1, '2026-11-15')).toEqual({ '2026-11': 7 })
  })
  it('gói 3 tháng ra từng tháng một', () => {
    expect(Object.keys(demBuoiDuKien([1], '2026-11', 3))).toEqual(['2026-11', '2026-12', '2027-01'])
  })
})

describe('gói 3 tháng đóng một lần', () => {
  const g = goi({ so_thang: 3, buoi_du_kien: { '2026-04': 12, '2026-05': 12, '2026-06': 12 } })
  const phieu = [{ goi_id: 'g1', so_tien: 3_600_000, ngay_thu: '2026-04-05' }]

  it('tháng 5 đã đủ nhờ đóng trước', () => {
    expect(tongHopHocSinh([g], phieu, '2026-05')).toEqual(
      { phaiThu: 1_200_000, noKyTruoc: 0, daThu: 1_200_000, conPhaiThu: 0, thucThu: 0, dongTruoc: 1_200_000 })
  })
  it('tháng 4: thực thu cả gói nhưng đã thu chỉ tính phần tháng 4', () => {
    const th = tongHopHocSinh([g], phieu, '2026-04')
    expect(th.thucThu).toBe(3_600_000)
    expect(th.daThu).toBe(1_200_000)
    expect(th.conPhaiThu).toBe(0)
  })
})

describe('thu nhiều đợt và trả nợ cũ', () => {
  const g = goi({})
  const phieu = [
    { goi_id: 'g1', so_tien: 500_000, ngay_thu: '2026-04-10' },
    { goi_id: 'g1', so_tien: 300_000, ngay_thu: '2026-04-20' },
    { goi_id: 'g1', so_tien: 400_000, ngay_thu: '2026-05-03' },
  ]
  it('tháng 4 còn nợ 400k, và không đổi khi tháng 5 trả nợ (tháng đã chốt giữ nguyên số)', () => {
    expect(tongHopHocSinh([g], phieu, '2026-04')).toMatchObject({ phaiThu: 1_200_000, daThu: 800_000, conPhaiThu: 400_000 })
  })
  it('tháng 5: nợ kỳ trước 400k, thu nợ trong tháng, hết nợ', () => {
    expect(tongHopHocSinh([g], phieu, '2026-05')).toEqual(
      { phaiThu: 0, noKyTruoc: 400_000, daThu: 400_000, conPhaiThu: 0, thucThu: 400_000, dongTruoc: 0 })
  })
})

describe('tiền dư (ví dụ trong yêu cầu)', () => {
  it('gói 1-3 có 2 buổi lớp nghỉ thì gói 4-6 trừ 200k vào tháng đầu', () => {
    const du = tienDu({ don_gia: 100_000 }, 2, 0)
    expect(du).toBe(200_000)
    const g2 = goi({ so_thang: 3, tien_du_tru: du, buoi_du_kien: { '2026-04': 12, '2026-05': 12, '2026-06': 12 } })
    expect(phaiThuTheoThang(g2)).toEqual({ '2026-04': 1_000_000, '2026-05': 1_200_000, '2026-06': 1_200_000 })
  })
  it('buổi phụ bù lại buổi lớp nghỉ thì không còn dư; học sinh tự nghỉ không sinh dư', () => {
    expect(tienDu({ don_gia: 100_000 }, 2, 2)).toBe(0)
    expect(tienDu({ don_gia: 100_000 }, 0, 3)).toBe(0)
  })
  it('điều chỉnh âm lớn hơn tháng đầu thì tràn sang tháng sau', () => {
    const g = goi({ so_thang: 2, dieu_chinh: -1_500_000, buoi_du_kien: { '2026-04': 12, '2026-05': 12 } })
    expect(phaiThuTheoThang(g)).toEqual({ '2026-04': 0, '2026-05': 900_000 })
  })
})

describe('sau review: tiền dư, học phí gốc, đóng trước', () => {
  const buoi = (ngay: string, lopNghi = false, loai: BuoiDacBiet['loai'] = 'lich'): BuoiDacBiet => ({ ngay, loai, lop_nghi: lopNghi })

  it('demNghiPhu chỉ đếm trong khoảng gói và từ ngày vào học', () => {
    const g = goi({ thang_bat_dau: '2026-04-01', so_thang: 1 })
    const ds = [buoi('2026-03-30', true), buoi('2026-04-02', true), buoi('2026-04-20', true), buoi('2026-04-25', false, 'phu'), buoi('2026-05-01', true)]
    expect(demNghiPhu(g, ds, '2026-04-01')).toEqual({ nghi: 2, phu: 1 })
    expect(demNghiPhu(g, ds, '2026-04-10')).toEqual({ nghi: 1, phu: 1 })
  })

  it('duConLai: buổi nghỉ đánh dấu muộn vẫn được tính; khoản đã trừ hoặc đã hoàn không tính lại', () => {
    const g1 = goi({ id: 'a', thang_bat_dau: '2026-01-01', so_thang: 3, buoi_du_kien: { '2026-01': 12, '2026-02': 12, '2026-03': 12 } })
    const ds = [buoi('2026-02-10', true), buoi('2026-03-10', true)]
    expect(duConLai([g1], ds, '2026-01-01', 0, '2026-04')).toBe(200_000)
    // gói 4-6 trừ 100k (lúc tạo mới biết 1 buổi nghỉ), buổi thứ hai đánh dấu sau đó → còn 100k chưa dùng
    const g2 = goi({ id: 'b', thang_bat_dau: '2026-04-01', so_thang: 3, tien_du_tru: 100_000, buoi_du_kien: { '2026-04': 12, '2026-05': 12, '2026-06': 12 } })
    expect(duConLai([g1, g2], ds, '2026-01-01', 0, '2026-07')).toBe(100_000)
    expect(duConLai([g1, g2], ds, '2026-01-01', 100_000, '2026-07')).toBe(0)
    // gói chưa kết thúc thì dư chưa chốt
    expect(duConLai([g1], ds, '2026-01-01', 0, '2026-03')).toBe(0)
  })

  it('học phí gốc + điều chỉnh = phải thu, kể cả khi trừ dư lớn hơn tháng đầu (lỗi cột Excel cũ)', () => {
    const g = goi({ so_thang: 2, tien_du_tru: 1_500_000, buoi_du_kien: { '2026-04': 12, '2026-05': 12 } })
    expect(phaiThuTheoThang(g)).toEqual({ '2026-04': 0, '2026-05': 900_000 })
    expect(hocPhiGocThang([g], '2026-04')).toBe(1_200_000)
    expect(hocPhiGocThang([g], '2026-05')).toBe(1_200_000)
    // cột Điều chỉnh = phải thu − học phí gốc: -1.200.000 tháng 4, -300.000 tháng 5; tổng bằng đúng -1.500.000
    const dc = ['2026-04', '2026-05'].map((t) => tongHopHocSinh([g], [], t).phaiThu - hocPhiGocThang([g], t))
    expect(dc).toEqual([-1_200_000, -300_000])
  })

  it('trạng thái "đóng trước" khi tháng được trả từ tiền đóng trước khi tháng bắt đầu', () => {
    const g = goi({ so_thang: 3, buoi_du_kien: { '2026-04': 12, '2026-05': 12, '2026-06': 12 } })
    const du = [{ goi_id: 'g1', so_tien: 3_600_000, ngay_thu: '2026-04-05' }]
    expect(trangThaiThang(tongHopHocSinh([g], du, '2026-04'))).toBe('du')
    expect(trangThaiThang(tongHopHocSinh([g], du, '2026-05'))).toBe('dong_truoc')
    const thieu = [{ ...du[0], so_tien: 1_000_000 }]
    expect(trangThaiThang(tongHopHocSinh([g], thieu, '2026-04'))).toBe('con_no')
    expect(tongGoi(g)).toBe(3_600_000)
    expect(conNoGoi(g, thieu)).toBe(2_600_000)
  })
})

describe('buổi chưa học bù (Q1)', () => {
  it('vắng buổi thường/phụ cộng 1, học bù trừ 1; vắng buổi bù riêng không tính; không âm', () => {
    expect(demChuaBu([{ trang_thai: 'vang', loai: 'lich' }, { trang_thai: 'vang', loai: 'phu' }])).toBe(2)
    expect(demChuaBu([{ trang_thai: 'vang', loai: 'lich' }, { trang_thai: 'hoc_bu', loai: 'bu' }])).toBe(0)
    expect(demChuaBu([{ trang_thai: 'vang', loai: 'bu' }])).toBe(0)
    expect(demChuaBu([{ trang_thai: 'hoc_bu', loai: 'lich' }])).toBe(0)
  })
})

describe('tenGoi, goiCuaThang', () => {
  it('ghi tên gói 1 tháng, trong năm, vắt sang năm', () => {
    expect(tenGoi(goi({}))).toBe('1 tháng · 04/2026')
    expect(tenGoi(goi({ so_thang: 3 }))).toBe('3 tháng · 04→06/2026')
    expect(tenGoi(goi({ thang_bat_dau: '2026-11-01', so_thang: 3 }))).toBe('3 tháng · 11/2026→01/2027')
  })
  it('tìm gói phủ tháng, ngoài gói thì không có', () => {
    const ds = [goi({ id: 'a', so_thang: 2 }), goi({ id: 'b', thang_bat_dau: '2026-06-01' })]
    expect(goiCuaThang(ds, '2026-05')?.id).toBe('a')
    expect(goiCuaThang(ds, '2026-06')?.id).toBe('b')
    expect(goiCuaThang(ds, '2026-03')).toBeUndefined()
    expect(goiCuaThang(ds, '2026-07')).toBeUndefined()
  })
})

describe('tinhTrangGoi, tinNhanGiaHan', () => {
  // lớp T2-T4-T6; tháng 11/2026 có 13 buổi, buổi cuối 30/11
  const L = [1, 3, 5]
  const g11 = goi({ thang_bat_dau: '2026-11-01' })
  it('đếm buổi còn lại theo lịch từ hôm nay, ngưỡng 4', () => {
    expect(tinhTrangGoi([g11], L, '2026-01-01', '2026-11-20')).toMatchObject({ loai: 'con', conBuoi: 5 })
    expect(tinhTrangGoi([g11], L, '2026-01-01', '2026-11-23')).toMatchObject({ loai: 'sap_het', conBuoi: 4, buoiCuoi: '2026-11-30', thangKe: '2026-12' })
    expect(tinhTrangGoi([g11], L, '2026-01-01', '2026-12-01')).toMatchObject({ loai: 'het', conBuoi: 0, buoiCuoi: '2026-11-30' })
  })
  it('vào học giữa chừng thì đếm từ ngày vào học', () => {
    expect(tinhTrangGoi([g11], L, '2026-11-25', '2026-11-02')).toMatchObject({ loai: 'sap_het', conBuoi: 3 })
  })
  it('đã đóng trước gói sau thì tính theo gói sau', () => {
    expect(tinhTrangGoi([g11, goi({ id: 'g2', thang_bat_dau: '2026-12-01' })], L, '2026-01-01', '2026-11-23')).toMatchObject({ loai: 'con' })
  })
  it('chưa có gói: tháng cần đóng là tháng muộn hơn giữa tháng vào học và tháng này', () => {
    expect(tinhTrangGoi([], L, '2026-10-05', '2026-11-16')).toEqual({ loai: 'chua_co', conBuoi: 0, thangKe: '2026-11' })
    expect(tinhTrangGoi([], L, '2026-12-03', '2026-11-16').thangKe).toBe('2026-12')
  })
  it('tin nhắn ghi học phí 1 tháng kế tiếp, chưa có gói thì bỏ dòng gói', () => {
    const t = tinNhanGiaHan('An', tinhTrangGoi([g11], L, '2026-01-01', '2026-11-23'), 13, 150_000)
    expect(t).toContain('(1 tháng · 11/2026) còn 4 buổi, kết thúc ngày 30/11/2026')
    expect(t).toContain(`Học phí tháng 12/2026: 13 buổi × ${vnd(150_000)} = ${vnd(1_950_000)}`)
    const c = tinNhanGiaHan('An', tinhTrangGoi([], L, '2026-10-05', '2026-11-16'), 13, 150_000)
    expect(c).not.toContain('gói học')
    expect(c).toContain('đóng học phí')
  })
})

// Các ví dụ số trong docs/HUONG-DAN-SU-DUNG.md mục 5 (lớp T2-T4-T6, 120.000 đ/buổi, 13 buổi mỗi tháng 11, 12, 1).
// Sửa cách tính tiền mà làm lệch tài liệu thì test này báo.
describe('ví dụ trong hướng dẫn sử dụng', () => {
  const ba = goi({ thang_bat_dau: '2026-11-01', so_thang: 3, don_gia: 120_000, buoi_du_kien: { '2026-11': 13, '2026-12': 13, '2027-01': 13 } })
  const mot = goi({ thang_bat_dau: '2026-11-01', don_gia: 120_000, buoi_du_kien: { '2026-11': 13 } })
  const thu = (so_tien: number, ngay_thu: string, goi_id = 'g1'): PhieuThu => ({ goi_id, so_tien, ngay_thu })

  it('5.4 gói 1 tháng = 1.560.000', () => expect(tongGoi(mot)).toBe(1_560_000))

  it('5.5 gói 3 tháng đóng nhiều đợt: tiền dồn tháng đầu trước', () => {
    expect(tongGoi(ba)).toBe(4_680_000)
    const p = [thu(2_000_000, '2026-11-05')]
    expect(tongHopHocSinh([ba], p, '2026-11').conPhaiThu).toBe(0)
    expect(tongHopHocSinh([ba], p, '2026-12')).toMatchObject({ phaiThu: 1_560_000, conPhaiThu: 1_120_000 })
    const p2 = [...p, thu(2_680_000, '2026-12-10')]
    expect(trangThaiThang(tongHopHocSinh([ba], p2, '2026-12'))).toBe('du')
    expect(trangThaiThang(tongHopHocSinh([ba], p2, '2027-01'))).toBe('dong_truoc')
  })

  it('5.6 đóng hết một lần: thực thu nằm ở tháng đóng', () => {
    const p = [thu(4_680_000, '2026-11-01')]
    expect(tongHopHocSinh([ba], p, '2026-11').thucThu).toBe(4_680_000)
    expect(tongHopHocSinh([ba], p, '2026-12').thucThu).toBe(0)
    expect(trangThaiThang(tongHopHocSinh([ba], p, '2026-12'))).toBe('dong_truoc')
  })

  it('5.7 lớp nghỉ 2, buổi phụ 1: dư 120.000, gói tháng 12 còn 1.440.000', () => {
    expect(tienDu(mot, 2, 1)).toBe(120_000)
    expect(tongGoi(goi({ thang_bat_dau: '2026-12-01', don_gia: 120_000, buoi_du_kien: { '2026-12': 13 }, tien_du_tru: 120_000 }))).toBe(1_440_000)
  })

  it('5.9 vào học 18/11: tháng 11 còn 6 buổi', () => {
    expect(demBuoiDuKien([1, 3, 5], '2026-11', 1, '2026-11-18')).toEqual({ '2026-11': 6 })
  })

  it('5.11 giảm nhiều hơn tháng đầu thì phần thừa trừ sang tháng sau', () => {
    expect(tongGoi({ ...mot, dieu_chinh: -100_000 })).toBe(1_460_000)
    expect(phaiThuTheoThang({ ...ba, dieu_chinh: -2_000_000 })).toEqual({ '2026-11': 0, '2026-12': 1_120_000, '2027-01': 1_560_000 })
  })

  it('5.13 đóng thừa 100.000: nợ kỳ trước tháng sau là -100.000', () => {
    expect(tongHopHocSinh([mot], [thu(1_660_000, '2026-11-03')], '2026-12').noKyTruoc).toBe(-100_000)
  })

  it('5.16 trả nợ tháng 11 vào 05/12: tháng 11 vẫn còn nợ, tháng 12 tính vào đã thu', () => {
    const p = [thu(1_560_000, '2026-12-05')]
    expect(tongHopHocSinh([mot], p, '2026-11').conPhaiThu).toBe(1_560_000)
    expect(tongHopHocSinh([mot], p, '2026-12')).toMatchObject({ noKyTruoc: 1_560_000, daThu: 1_560_000, conPhaiThu: 0, thucThu: 1_560_000 })
  })
})

describe('học sinh học nhiều lớp', () => {
  const lA = { lop_id: 'A', lich: [1], ngay_vao: '2026-10-01' } // Thứ 2: tháng 11/2026 có 5 buổi (2,9,16,23,30)
  const lB = { lop_id: 'B', lich: [3], ngay_vao: '2026-10-01' } // Thứ 4: tháng 11/2026 có 4 buổi (4,11,18,25)

  it('demBuoiDuKienNhieuLop: cộng 2 lớp khác thứ và cùng thứ không bị gộp trùng ngày', () => {
    expect(demBuoiDuKienNhieuLop([lA, lB], '2026-11', 1)).toEqual({ '2026-11': 9 })
    expect(demBuoiDuKienNhieuLop([lA, lB], '2026-11', 3)).toEqual({ '2026-11': 9, '2026-12': 9, '2027-01': 8 })
    // hai lớp cùng học T7 sáng + T7 chiều trong tháng 11/2026 (4 ngày T7 -> 8 buổi)
    const sangT7 = { lop_id: 'S', lich: [6], ngay_vao: '2026-11-01' }
    const chieuT7 = { lop_id: 'C', lich: [6], ngay_vao: '2026-11-01' }
    expect(demBuoiDuKienNhieuLop([sangT7, chieuT7], '2026-11', 1)).toEqual({ '2026-11': 8 })
  })

  it('demBuoiDuKienNhieuLop: tôn trọng ngày vào học riêng từng lớp', () => {
    // lớp B vào ngày 15/11 -> tháng 11 chỉ còn 18, 25 (2 buổi), cộng lớp A 5 buổi = 7; tháng 12 đủ 9 buổi
    const bMuon = { lop_id: 'B', lich: [3], ngay_vao: '2026-11-15' }
    expect(demBuoiDuKienNhieuLop([lA, bMuon], '2026-11', 2)).toEqual({ '2026-11': 7, '2026-12': 9 })
    // lớp B vào ở tháng 12 (ngày 05/12): tháng 11 chỉ tính lớp A (5 buổi), tháng 12 tính A (4) + B từ 05/12 (4) = 8
    const bThangSau = { lop_id: 'B', lich: [3], ngay_vao: '2026-12-05' }
    expect(demBuoiDuKienNhieuLop([lA, bThangSau], '2026-11', 2)).toEqual({ '2026-11': 5, '2026-12': 8 })
  })

  it('tienDuGoiNhieuLop & duConLaiNhieuLop: buổi phụ lớp B không bù chéo cho lớp A và bỏ buổi trước ngay_vao', () => {
    const g = goi({ thang_bat_dau: '2026-10-01', so_thang: 1, don_gia: 150_000, buoi_du_kien: { '2026-10': 8 } })
    const bMuon = { lop_id: 'B', ngay_vao: '2026-10-15' }
    const buoi: BuoiDacBietLop[] = [
      { lop_id: 'A', ngay: '2026-10-12', loai: 'lich', lop_nghi: true }, // dư 1 buổi lớp A
      { lop_id: 'B', ngay: '2026-10-07', loai: 'lich', lop_nghi: true }, // trước ngày vào B -> bỏ qua
      { lop_id: 'B', ngay: '2026-10-24', loai: 'phu', lop_nghi: false }, // buổi phụ ở B -> không triệt tiêu nghỉ ở A
    ]
    expect(tienDuGoiNhieuLop(g, buoi, [lA, bMuon])).toBe(150_000)
    expect(duConLaiNhieuLop([g], buoi, [lA, bMuon], 0, '2026-11')).toBe(150_000)
    expect(duConLaiNhieuLop([g], buoi, [lA, bMuon], 50_000, '2026-11')).toBe(100_000)
    expect(duConLaiNhieuLop([g], buoi, [lA, bMuon], 0, '2026-10')).toBe(0)
  })

  it('tinhTrangGoiNhieuLop: cộng buổi còn lại trên các lớp và lấy ngày buổi cuối muộn nhất', () => {
    const g11 = goi({ thang_bat_dau: '2026-11-01', so_thang: 1 })
    // Từ 2026-11-20: lA còn 23, 30 (2); lB còn 25 (1) -> tổng 3 buổi <= ngưỡng 4 ('sap_het'), buổi cuối 30/11
    expect(tinhTrangGoiNhieuLop([g11], [lA, lB], '2026-11-20')).toMatchObject({
      loai: 'sap_het', conBuoi: 3, buoiCuoi: '2026-11-30', thangKe: '2026-12',
    })
    // Từ 2026-11-10: lA còn 16, 23, 30 (3); lB còn 11, 18, 25 (3) -> tổng 6 buổi ('con')
    expect(tinhTrangGoiNhieuLop([g11], [lA, lB], '2026-11-10')).toMatchObject({ loai: 'con', conBuoi: 6 })
    // Chưa có gói: dùng ngày vào học sớm nhất
    expect(tinhTrangGoiNhieuLop([], [
      { lop_id: 'A', lich: [1], ngay_vao: '2026-10-05' },
      { lop_id: 'B', lich: [3], ngay_vao: '2026-12-02' },
    ], '2026-11-16')).toEqual({ loai: 'chua_co', conBuoi: 0, thangKe: '2026-11' })
  })

  it('tinhTienThangNhieuLop & tien_thang: trường hợp Minh Trang (T6 500k + CN 1.000k)', () => {
    // T6 (5) trong 11/2026: 6,13,20,27 = 4 buổi × 500k = 2.000.000; CN (0): 1,8,15,22,29 = 5 buổi × 1.000k = 5.000.000 -> 7.000.000
    const l1h = { lop_id: 'T6', lich: [5], ngay_vao: '2026-11-01', don_gia: 500_000 }
    const l2h = { lop_id: 'CN', lich: [0], ngay_vao: '2026-11-01', don_gia: 1_000_000 }
    expect(tinhTienThangNhieuLop([lA, lB], 150_000, '2026-11', 1)).toBeNull()
    expect(tinhTienThangNhieuLop([l1h, l2h], 500_000, '2026-11', 2)).toEqual({
      '2026-11': 7_000_000,
      '2026-12': 6_000_000, // T6: 4,11,18,25 (4×500k=2M) + CN: 6,13,20,27 (4×1M=4M)
    })

    const gHonHop = goi({
      thang_bat_dau: '2026-11-01', so_thang: 2, don_gia: 500_000,
      buoi_du_kien: { '2026-11': 9, '2026-12': 8 },
      tien_thang: { '2026-11': 7_000_000, '2026-12': 6_000_000 },
      tien_du_tru: 500_000, dieu_chinh: -200_000,
    })
    expect(phaiThuTheoThang(gHonHop)).toEqual({ '2026-11': 6_300_000, '2026-12': 6_000_000 })
    expect(hocPhiGocThang([gHonHop], '2026-11')).toBe(7_000_000)
    expect(tongGoi(gHonHop)).toBe(12_300_000)
    expect(tongHopHocSinh([gHonHop], [{ goi_id: 'g1', so_tien: 7_000_000, ngay_thu: '2026-11-05' }], '2026-12')).toMatchObject({
      noKyTruoc: 0, phaiThu: 6_000_000, dongTruoc: 700_000, conPhaiThu: 5_300_000,
    })
  })

  it('tienDuGoiNhieuLop & tinNhanGiaHan với lớp có giá riêng', () => {
    const g = goi({ thang_bat_dau: '2026-11-01', so_thang: 1, don_gia: 500_000, buoi_du_kien: { '2026-11': 9 } })
    const buoi: BuoiDacBietLop[] = [
      { lop_id: 'T6', ngay: '2026-11-06', loai: 'lich', lop_nghi: true }, // 500k
      { lop_id: 'CN', ngay: '2026-11-08', loai: 'lich', lop_nghi: true }, // 1.000k
    ]
    const dsGia = [
      { lop_id: 'T6', ngay_vao: '2026-11-01', don_gia: undefined },
      { lop_id: 'CN', ngay_vao: '2026-11-01', don_gia: 1_000_000 },
    ]
    expect(tienDuGoiNhieuLop(g, buoi, dsGia)).toBe(1_500_000)
    // gói cũ chốt 150k: dù hs.don_gia hiện tại đổi lên 200k, lớp không có don_gia_rieng vẫn tính dư theo g.don_gia (150k)
    const gCu = goi({ thang_bat_dau: '2026-10-01', so_thang: 1, don_gia: 150_000, buoi_du_kien: { '2026-10': 8 } })
    expect(tienDuGoiNhieuLop(gCu, [{ lop_id: 'T6', ngay: '2026-10-09', loai: 'lich', lop_nghi: true }], [{ lop_id: 'T6', ngay_vao: '2026-10-01' }])).toBe(150_000)
    const msg = tinNhanGiaHan('Minh Trang', { loai: 'het', goi: g, conBuoi: 0, buoiCuoi: '2026-11-29', thangKe: '2026-12' }, 8, 500_000, 6_000_000)
    expect(msg).toContain('8 buổi = ' + vnd(6_000_000))
    expect(msg).not.toContain('8 buổi ×')
  })
})

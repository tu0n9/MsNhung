import { describe, expect, it } from 'vitest'
import {
  conNoGoi, demBuoiDuKien, demChuaBu, demNghiPhu, duConLai, goiCuaThang, hocPhiGocThang, tenGoi, phaiThuTheoThang, tienDu, tongGoi, tongHopHocSinh,
  trangThaiThang, type BuoiDacBiet, type Goi,
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

import { describe, expect, it } from 'vitest'
import { demBuoiDuKien, phaiThuTheoThang, tienDu, tongHopHocSinh, type Goi } from './hoc-phi'

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
      { phaiThu: 1_200_000, noKyTruoc: 0, daThu: 1_200_000, conPhaiThu: 0, thucThu: 0 })
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
      { phaiThu: 0, noKyTruoc: 400_000, daThu: 400_000, conPhaiThu: 0, thucThu: 400_000 })
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

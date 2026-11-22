import { describe, expect, it } from 'vitest'
import { trangThaiTruyCap } from './truy-cap'

describe('trangThaiTruyCap (10c)', () => {
  it('tài khoản bị khoá (hoat_dong=false) bị chặn kể cả khi phai_doi_mat_khau=false hoặc true', () => {
    expect(trangThaiTruyCap({ vai_tro: 'tro_giang', hoat_dong: false, phai_doi_mat_khau: false })).toBe('bi_khoa')
    expect(trangThaiTruyCap({ vai_tro: 'tro_giang', hoat_dong: false, phai_doi_mat_khau: true })).toBe('bi_khoa')
    expect(trangThaiTruyCap({ vai_tro: 'giao_vien', hoat_dong: false, phai_doi_mat_khau: false })).toBe('bi_khoa')
    expect(trangThaiTruyCap({ vai_tro: 'admin', hoat_dong: false, phai_doi_mat_khau: true })).toBe('bi_khoa')
  })

  it('tài khoản phụ huynh bị chặn kể cả khi phai_doi_mat_khau=true hoặc hoat_dong=false/true', () => {
    expect(trangThaiTruyCap({ vai_tro: 'phu_huynh', hoat_dong: true, phai_doi_mat_khau: false })).toBe('phu_huynh')
    expect(trangThaiTruyCap({ vai_tro: 'phu_huynh', hoat_dong: true, phai_doi_mat_khau: true })).toBe('phu_huynh')
    expect(trangThaiTruyCap({ vai_tro: 'phu_huynh', hoat_dong: false, phai_doi_mat_khau: true })).toBe('phu_huynh')
    expect(trangThaiTruyCap({ vai_tro: 'phu_huynh', hoat_dong: false, phai_doi_mat_khau: false })).toBe('phu_huynh')
  })

  it('tài khoản nhân viên đang hoạt động (hoat_dong=true): bắt đổi mật khẩu hoặc hợp lệ', () => {
    expect(trangThaiTruyCap({ vai_tro: 'tro_giang', hoat_dong: true, phai_doi_mat_khau: true })).toBe('doi_mat_khau')
    expect(trangThaiTruyCap({ vai_tro: 'giao_vien', hoat_dong: true, phai_doi_mat_khau: true })).toBe('doi_mat_khau')
    expect(trangThaiTruyCap({ vai_tro: 'tro_giang', hoat_dong: true, phai_doi_mat_khau: false })).toBe('hop_le')
    expect(trangThaiTruyCap({ vai_tro: 'giao_vien', hoat_dong: true, phai_doi_mat_khau: false })).toBe('hop_le')
    expect(trangThaiTruyCap({ vai_tro: 'admin', hoat_dong: true, phai_doi_mat_khau: false })).toBe('hop_le')
  })
})

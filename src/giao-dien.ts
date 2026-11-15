// Phong cách 3 "Sổ tay giáo viên" (docs/YEU-CAU.md, mẫu docs/mau-giao-dien/phong-cach-toan-app.html).
// Màu dùng ngoài theme của Ant Design (nền dòng, chữ số tiền) lấy từ đây để đổi một chỗ là đổi cả app.
import type { ThemeConfig } from 'antd'

export const MAU = {
  chinh: '#0f7a5c', chinhDam: '#0b5e47', chinhNhat: '#e3f3ed',
  do: '#b3261e', doNhat: '#fbe9e7', vang: '#fff8e1',
  chu: '#1b1f1d', chuPhu: '#4a524e', chuMo: '#79817d', vien: '#e4e7e5', nen: '#fbfbf9',
}

export const THEME: ThemeConfig = {
  token: {
    colorPrimary: MAU.chinh, colorLink: MAU.chinh, colorSuccess: MAU.chinh, colorError: MAU.do,
    colorText: MAU.chu, colorTextSecondary: MAU.chuPhu, colorBorderSecondary: MAU.vien, colorBgLayout: MAU.nen,
    fontFamily: "'Lexend Variable', -apple-system, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 4, borderRadiusLG: 6, borderRadiusSM: 3,
  },
  components: {
    Layout: { headerBg: MAU.chinh, headerHeight: 56, headerPadding: '0 12px' },
    Menu: { darkItemBg: MAU.chinh, darkItemSelectedBg: MAU.chinhDam, darkPopupBg: MAU.chinhDam },
    Card: { headerFontSize: 15 },
  },
}

/** Ô nhập tiền: số nguyên VND (precision 0), hiện dấu chấm nghìn. Dùng `{...O_TIEN}` cho mọi InputNumber tiền. */
export const O_TIEN = {
  min: 0, step: 50000, precision: 0, style: { width: '100%' },
  formatter: (s?: number | string) => `${s ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
  parser: (s?: string) => Number(s?.replace(/\./g, '') || 0),
}

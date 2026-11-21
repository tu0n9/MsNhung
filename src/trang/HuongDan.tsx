import { Button, Card, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useToi } from '../App'
import { laQuanLy } from '../supabase'
import { MAU } from '../giao-dien'

// Video nằm ở public/huong-dan/ (quay bằng tests/video/chuong.py), Vercel phục vụ như file tĩnh: không tốn bộ nhớ Supabase.
// Mỗi vai trò chỉ thấy video về việc mình làm được.
const VIDEO: { file: string; ten: string; mo_ta: string; ai: ('ql' | 'tg' | 'ph')[] }[] = [
  { file: '01-dang-nhap', ten: '1. Đăng nhập và làm quen', mo_ta: 'Đăng nhập lần đầu, đổi mật khẩu, các mục chính, giao diện sáng / tối, cài lên điện thoại.', ai: ['ql', 'tg'] },
  { file: '02-lop-va-hoc-sinh', ten: '2. Lớp và học sinh', mo_ta: 'Tạo lớp, lịch tuần có giờ từng thứ, thêm học sinh có ảnh và số phụ huynh, sửa, ngừng học. Cộng / trừ sticker ngoài buổi: bấm nút ⭐ cạnh tên em ở trang Lớp (trợ giảng cũng làm được).', ai: ['ql'] },
  { file: '03-import-excel', ten: '3. Import bằng Excel', mo_ta: 'Tải file mẫu, điền, chọn file, xem lỗi, nhập.', ai: ['ql'] },
  { file: '04-diem-danh', ten: '4. Điểm danh', mo_ta: 'Lớp gộp cùng giờ, có mặt / vắng, sticker, trợ giảng, ảnh lớp, lớp nghỉ, buổi bù, lưới điểm danh tháng.', ai: ['ql', 'tg'] },
  { file: '05-thu-hoc-phi', ten: '5. Học phí và thu tiền', mo_ta: 'Nguyên tắc tính tiền, gói 1 / 2 / 3 tháng, thu nhiều đợt, đóng trước, tiền dư lớp nghỉ, điều chỉnh, các trường hợp khác.', ai: ['ql'] },
  { file: '06-chi-phi', ten: '6. Chi phí', mo_ta: 'Lương trợ giảng tự tính theo ca, thêm khoản chi, hoàn học phí.', ai: ['ql'] },
  { file: '07-hoc-phi-chot-so-excel', ten: '7. Tab Học phí, chốt sổ, Excel', mo_ta: 'Đã thu và thực thu, lọc còn nợ, sắp hết gói, nhắn phụ huynh, xuất Excel, chốt và mở khoá sổ. Nhật ký thao tác (ai sửa gì, lúc nào): trang Tài khoản → Nhật ký thao tác.', ai: ['ql'] },
  { file: '08-phu-huynh', ten: '8. Dành cho phụ huynh', mo_ta: 'Đăng nhập bằng số điện thoại, gói còn mấy buổi, lưới điểm danh tháng, sticker, ảnh lớp, học phí.', ai: ['ql', 'ph'] },
]

export default function HuongDan() {
  const v = useToi().vai_tro
  const nav = useNavigate()
  const toi = laQuanLy(v) ? 'ql' : v === 'phu_huynh' ? 'ph' : 'tg'
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* phụ huynh trên điện thoại không có thanh điều hướng, phải có đường về */}
      <Space><Button onClick={() => nav('/')}>← Quay lại</Button><b style={{ fontSize: 18 }}>Video hướng dẫn</b></Space>
      {VIDEO.filter((x) => x.ai.includes(toi)).map((x) => (
        <Card key={x.file} size="small" title={x.ten}>
          <div style={{ color: MAU.chuPhu, fontSize: 13, marginBottom: 8 }}>{x.mo_ta}</div>
          <video controls preload="metadata" src={`${import.meta.env.BASE_URL}huong-dan/${x.file}.mp4`} style={{ width: '100%', maxHeight: 520, background: '#000', borderRadius: 4 }} />
        </Card>
      ))}
    </Space>
  )
}

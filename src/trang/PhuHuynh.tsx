import { useEffect, useState } from 'react'
import { Button, Empty, Result, Space, Spin, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { q, sb, type HocSinh, type Lop } from '../supabase'
import HocSinhChiTiet from './HocSinhChiTiet'

// RLS chỉ trả về con của chính phụ huynh đang đăng nhập, nên không cần lọc ở đây
export default function PhuHuynh() {
  const nav = useNavigate()
  // null = đang tải: không hiện "chưa có học sinh" trong lúc chờ
  const [con, setCon] = useState<HocSinh[] | null>(null)
  const [lops, setLops] = useState<Lop[]>([])
  const [loi, setLoi] = useState<string | null>(null)
  const tai = () => {
    setLoi(null)
    Promise.all([q(sb.from('hoc_sinh').select('*').order('ho_ten')), q(sb.from('lop').select('*'))])
      .then(([h, l]) => { setCon(h as HocSinh[]); setLops(l as Lop[]) }).catch((e: Error) => setLoi(e.message))
  }
  useEffect(tai, [])
  // App ẩn thanh điều hướng và nút Hướng dẫn với phụ huynh, nên 2 link này phải hiện ở mọi trạng thái
  const lienKet = <Space size="large"><a onClick={() => nav('/doi-mat-khau')}>Đổi mật khẩu</a><a onClick={() => nav('/huong-dan')}>Xem hướng dẫn</a></Space>
  if (loi) return <><Result status="warning" title="Không tải được dữ liệu" subTitle={`Kiểm tra mạng rồi thử lại. (${loi})`}
    extra={<Button type="primary" onClick={tai}>Thử lại</Button>} />{lienKet}</>
  if (!con) return <Spin style={{ display: 'block', margin: 40 }} />
  if (!con.length) return <><Empty description="Chưa có học sinh nào gắn với số điện thoại này" />{lienKet}</>
  return (
    <>
      <Tabs items={con.map((h) => ({ key: h.id, label: h.ho_ten, children: <HocSinhChiTiet hs={h} lop={lops.find((l) => l.id === h.lop_id)!} chiXem /> }))} />
      {lienKet}
    </>
  )
}

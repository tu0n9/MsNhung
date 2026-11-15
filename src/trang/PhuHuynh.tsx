import { useEffect, useState } from 'react'
import { Empty, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { q, sb, type HocSinh, type Lop } from '../supabase'
import HocSinhChiTiet from './HocSinhChiTiet'

// RLS chỉ trả về con của chính phụ huynh đang đăng nhập, nên không cần lọc ở đây
export default function PhuHuynh() {
  const nav = useNavigate()
  const [con, setCon] = useState<HocSinh[]>([])
  const [lops, setLops] = useState<Lop[]>([])
  useEffect(() => {
    Promise.all([q(sb.from('hoc_sinh').select('*').order('ho_ten')), q(sb.from('lop').select('*'))])
      .then(([h, l]) => { setCon(h as HocSinh[]); setLops(l as Lop[]) })
  }, [])
  if (!con.length) return <Empty description="Chưa có học sinh nào gắn với số điện thoại này" />
  return (
    <>
      <Tabs items={con.map((h) => ({ key: h.id, label: h.ho_ten, children: <HocSinhChiTiet hs={h} lop={lops.find((l) => l.id === h.lop_id)!} chiXem /> }))} />
      <a onClick={() => nav('/doi-mat-khau')}>Đổi mật khẩu</a>
    </>
  )
}

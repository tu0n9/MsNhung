// Màn import kiểu A (docs/mau-giao-dien/import-excel.html): trang riêng 3 bước, lỗi gom ở đầu, lọc theo kết quả.
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, App, Button, Card, Grid, List, Progress, Result, Segmented, Space, Tag, Upload } from 'antd'
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons'
import { docFile, kiemTra, taiDanhSachLoi, taiFileMau, type KqHs, type KqLop } from '../import-excel'
import { nhapDuLieu, type KetQuaNhap, type TienDo } from '../nhap-du-lieu'
import { homNay, q, sb, THU, type HocSinh, type Lop } from '../supabase'
import { vnd } from '../hoc-phi'
import { MAU } from '../giao-dien'

type Dong = KqLop | KqHs
type Loc = 'tat_ca' | 'loi' | 'da_co' | 'moi'
const NHAN = { moi: ['Mới', 'green'], da_co: ['Đã có', 'default'], loi: ['Lỗi', 'red'] } as const
const idDong = (d: Dong) => `dong-${d.loai}-${d.so}`

export default function ImportExcel() {
  const { message } = App.useApp()
  const nav = useNavigate()
  const dienThoai = !Grid.useBreakpoint().md
  const [lopCo, setLopCo] = useState<Lop[]>([])
  const [hsCo, setHsCo] = useState<HocSinh[]>([])
  const [tenFile, setTenFile] = useState<string>()
  const [kq, setKq] = useState<{ lops: KqLop[]; hss: KqHs[] }>()
  const [loc, setLoc] = useState<Loc>('tat_ca')
  const [tienDo, setTienDo] = useState<TienDo>()
  const [ketQua, setKetQua] = useState<KetQuaNhap>()

  const taiCo = async () => {
    const [l, h] = await Promise.all([q(sb.from('lop').select('*').order('ten')), q(sb.from('hoc_sinh').select('*'))])
    setLopCo(l as Lop[]); setHsCo(h as HocSinh[])
  }
  useEffect(() => { taiCo().catch((e) => message.error(e.message)) }, [])

  const chonFile = async (f: File) => {
    try {
      const { lopTho, hsTho } = await docFile(await f.arrayBuffer())
      if (!lopTho.length && !hsTho.length) return message.warning('File không có dòng nào để nhập')
      setTenFile(f.name); setLoc('tat_ca'); setKq(kiemTra(lopTho, hsTho, lopCo, hsCo, homNay()))
    } catch (e) { message.error((e as Error).message) }
  }

  const dong: Dong[] = useMemo(() => (kq ? [...kq.lops, ...kq.hss] : []), [kq])
  const dem = (t: Exclude<Loc, 'tat_ca'>) => dong.filter((d) => d.trangThai === t).length
  const loi = dong.filter((d) => d.trangThai === 'loi')

  const nhap = async () => {
    if (!kq) return
    setTienDo({ xong: 0, tong: dem('moi'), dang: 'Bắt đầu' })
    try { setKetQua(await nhapDuLieu(kq.lops, kq.hss, lopCo, setTienDo)) }
    catch (e) { message.error((e as Error).message); setTienDo(undefined) }
  }

  const buoc = ketQua || tienDo ? 4 : kq ? 3 : 2
  const chan = { position: 'sticky' as const, bottom: dienThoai ? 60 : 0, background: '#fff', padding: '10px 0', borderTop: `1px solid ${MAU.vien}` }

  return (
    <Space direction="vertical" style={{ width: '100%', maxWidth: 720 }} size={12}>
      <a onClick={() => nav('/lop')}>← Lớp và học sinh</a>
      <h2 style={{ margin: 0 }}>Import từ Excel</h2>
      <ol aria-label="Các bước" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {['1. Tải mẫu', '2. Chọn file', '3. Kiểm tra'].map((t, i) => (
          <li key={t} aria-current={buoc === i + 1 ? 'step' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12,
            color: buoc >= i + 1 ? MAU.chu : MAU.chuMo, fontWeight: buoc === i + 1 ? 600 : 400 }}>
            <span style={{ height: 4, borderRadius: 2, background: buoc >= i + 1 ? MAU.chinh : MAU.vien }} />{t}
          </li>
        ))}
      </ol>

      {ketQua ? (
        <Result status={ketQua.loi.length ? 'warning' : 'success'} title={`Đã thêm ${ketQua.lopMoi} lớp và ${ketQua.hsMoi} học sinh`}
          subTitle={<>
            Tạo {ketQua.phMoi} tài khoản phụ huynh mới, {ketQua.phDungChung} em dùng chung tài khoản đã có.<br />
            Bỏ qua {dem('da_co')} dòng đã có, {loi.length + ketQua.loi.length} dòng chưa nhập.<br />
            Phụ huynh đăng nhập bằng số điện thoại, mật khẩu đầu là chính số điện thoại.
          </>}
          extra={<Space direction="vertical">
            {ketQua.loi.map((x) => <Alert key={x.so} type="error" showIcon message={`Dòng ${x.so}, ${x.ten}: ${x.loi}`} />)}
            {loi.length > 0 && <Button icon={<DownloadOutlined />} onClick={() => taiDanhSachLoi(kq!.lops, kq!.hss)}>Tải danh sách lỗi để sửa</Button>}
            <Button type="primary" onClick={() => nav('/lop')}>Về trang Lớp</Button>
          </Space>} />
      ) : tienDo ? (
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Đang nhập</span><b>{tienDo.xong} / {tienDo.tong}</b></div>
            <Progress percent={tienDo.tong ? Math.round((tienDo.xong / tienDo.tong) * 100) : 0} strokeColor={MAU.chinh} />
            <span style={{ color: MAU.chuPhu, fontSize: 13 }}>{tienDo.dang}</span>
            <span style={{ color: MAU.do, fontSize: 13 }}>Giữ trang này mở cho đến khi xong.</span>
          </Space>
        </Card>
      ) : !kq ? (
        <>
          <Card size="small" title="1. Tải file mẫu">
            <p style={{ marginTop: 0, color: MAU.chuPhu }}>File có 3 trang: Hướng dẫn, Lớp (đã điền sẵn các lớp đang có), Học sinh. Cột có dấu * là bắt buộc.</p>
            <Button icon={<DownloadOutlined />} onClick={() => taiFileMau(lopCo).catch((e) => message.error(e.message))}>Tải file mẫu</Button>
          </Card>
          <Card size="small" title="2. Chọn file đã điền">
            <Upload.Dragger accept=".xlsx" showUploadList={false} beforeUpload={(f) => { chonFile(f); return false }}>
              <FileExcelOutlined style={{ fontSize: 32, color: MAU.chinh }} />
              <p style={{ margin: '8px 0 0' }}>Chạm để chọn file .xlsx</p>
            </Upload.Dragger>
          </Card>
        </>
      ) : (
        <>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileExcelOutlined style={{ fontSize: 22, color: MAU.chinh }} />
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tenFile}</div>
                <div style={{ fontSize: 12, color: MAU.chuPhu }}>{kq.lops.length} lớp, {kq.hss.length} học sinh</div>
              </div>
              <Button type="link" onClick={() => setKq(undefined)}>Đổi file</Button>
            </div>
          </Card>

          {loi.length > 0 && (
            <div role="alert" style={{ padding: 12, border: `1px solid ${MAU.do}33`, background: MAU.doNhat, borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <b style={{ color: MAU.do }}>{loi.length} dòng cần sửa, sẽ không được nhập</b>
              {loi.slice(0, 8).map((d) => (
                <a key={idDong(d)} href={`#${idDong(d)}`} onClick={(e) => { e.preventDefault(); setLoc('tat_ca'); setTimeout(() => document.getElementById(idDong(d))?.scrollIntoView({ block: 'center' })) }}>
                  {d.loai === 'lop' ? `Trang Lớp, dòng ${d.so}, ${d.ten || '(chưa có tên)'}` : `Dòng ${d.so}, ${d.ho_ten || '(chưa có tên)'}`}: {d.loi}
                </a>
              ))}
              {loi.length > 8 && <span style={{ fontSize: 13 }}>và {loi.length - 8} dòng khác, xem bằng bộ lọc "Lỗi" hoặc tải danh sách lỗi.</span>}
            </div>
          )}

          <Segmented value={loc} onChange={(v) => setLoc(v as Loc)} options={[
            { value: 'tat_ca', label: `Tất cả ${dong.length}` }, { value: 'loi', label: `Lỗi ${dem('loi')}` },
            { value: 'da_co', label: `Đã có ${dem('da_co')}` }, { value: 'moi', label: `Mới ${dem('moi')}` },
          ]} />

          <List bordered style={{ background: '#fff' }} dataSource={dong.filter((d) => loc === 'tat_ca' || d.trangThai === loc)} renderItem={(d) => (
            <List.Item id={idDong(d)} style={{ alignItems: 'flex-start', background: d.trangThai === 'loi' ? MAU.doNhat : undefined }}>
              <span style={{ width: 40, flexShrink: 0, fontSize: 12, color: MAU.chuMo }}>{d.loai === 'lop' ? 'Lớp' : d.so}</span>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                {d.loai === 'lop' ? <>
                  <b>{d.ten || '(chưa có tên)'}</b>
                  <div style={{ fontSize: 12, color: MAU.chuPhu }}>{vnd(d.don_gia)}/buổi, {d.lich.map((t) => THU[t]).join(' ') || 'chưa có lịch'}</div>
                </> : <>
                  <b>{d.ho_ten || '(chưa có tên)'}</b>
                  <div style={{ fontSize: 12, color: MAU.chuPhu }}>
                    {[d.tenLop, d.ten_phu_huynh, d.sdt_phu_huynh, d.sticker_dau_ky ? `${d.sticker_dau_ky} sticker` : ''].filter(Boolean).join(', ')}
                  </div>
                </>}
                {d.loi && <div style={{ fontSize: 12, color: d.trangThai === 'loi' ? MAU.do : MAU.chuPhu, marginTop: 2 }}>{d.loi}</div>}
              </div>
              <Tag color={NHAN[d.trangThai][1]} style={{ marginInlineEnd: 0 }}>{NHAN[d.trangThai][0]}</Tag>
            </List.Item>
          )} />

          <div style={chan}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" size="large" block disabled={!dem('moi')} onClick={nhap}>Nhập {dem('moi')} dòng mới</Button>
              {loi.length > 0 && <Button type="link" block icon={<DownloadOutlined />} onClick={() => taiDanhSachLoi(kq.lops, kq.hss)}>Tải danh sách lỗi (.xlsx)</Button>}
            </Space>
          </div>
        </>
      )}
    </Space>
  )
}

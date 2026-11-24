import { useEffect, useMemo, useState } from 'react'
import { App, Avatar, Button, Card, DatePicker, Descriptions, Form, Input, InputNumber, Modal, Popconfirm, Radio, Select, Space, Statistic, Table, Tag } from 'antd'
import dayjs from 'dayjs'
import { useToi } from '../App'
import { MAU, O_TIEN } from '../giao-dien'
import { homNay, laQuanLy, lopCuaHs, giaGhiDanh, q, sb, taiTongSticker, useMotLan, urlAnh, type BuoiHoc, type GhiDanh, type HocSinh, type Lop, type StickerCongTru } from '../supabase'
import {
  congThang, daDongGoi, demBuoiDuKien, demBuoiDuKienNhieuLop, demChuaBu, duConLaiNhieuLop, noThucCuaGoi, tenGoi, thangHetGoi, tienDuGoiNhieuLop,
  tinhTienThangNhieuLop, tinhTrangGoiNhieuLop, tinNhanPhuHuynh, tongGoi, tongHopHocSinh, vnd, type BuoiDacBietLop, type Goi, type PhieuThu, type Thang,
} from '../hoc-phi'
import { moTaLich } from '../gio-hoc'
import { luoiThang } from '../diem-danh-thang'
import { chuanLinkZalo } from '../import-excel'
import { phanLoaiHocSinh, thongTinTrangThaiChiTiet } from '../lop-hoc'
import LichDiemDanhThang from '../thanh-phan/LichDiemDanhThang'
import HopThoaiXoa from '../thanh-phan/HopThoaiXoa'
import { BoChonThangNhanh } from '../thanh-phan/ThanhChonThoiGian'
import NutSaoChep from '../thanh-phan/NutSaoChep'

type Phieu = PhieuThu & { id: string; hinh_thuc: string; ghi_chu: string | null }

export default function HocSinhChiTiet({ hs, lops, ghiDanh, quayLai }: { hs: HocSinh; lops: Lop[]; ghiDanh: GhiDanh[]; quayLai?: () => void }) {
  const { message } = App.useApp()
  const toi = useToi()
  const ql = laQuanLy(toi.vai_tro)
  const [thang, setThang] = useState<Thang>(dayjs().format('YYYY-MM'))
  const [dd, setDd] = useState<{ trang_thai: 'co_mat' | 'vang' | 'hoc_bu'; sticker: number; buoi_hoc: BuoiHoc }[]>([])
  const [buoiThang, setBuoiThang] = useState<BuoiHoc[]>([])
  const [goi, setGoi] = useState<(Goi & { ly_do_dieu_chinh: string | null })[]>([])
  const [phieu, setPhieu] = useState<Phieu[]>([])
  const [buoiDb, setBuoiDb] = useState<BuoiHoc[]>([])
  const [avatar, setAvatar] = useState<string>()
  const [thuTien, setThuTien] = useState(false)
  const [xoaMuc, setXoaMuc] = useState<{ loai: 'goi' | 'phieu'; id: string; ten: string } | null>(null)
  const [daHoan, setDaHoan] = useState(0)
  const [congTru, setCongTru] = useState<StickerCongTru[]>([])
  const [tongSticker, setTongSticker] = useState(0)
  const [link, setLink] = useState(hs.link_zalo)
  const [oLink, setOLink] = useState(hs.link_zalo ?? '')

  const gdEm = useMemo(() => lopCuaHs(ghiDanh, hs.id), [ghiDanh, hs.id])
  const gdDangHoc = useMemo(() => gdEm.filter((g) => g.trang_thai === 'dang_hoc'), [gdEm])
  const lopMap = useMemo(() => new Map(lops.map((l) => [l.id, l])), [lops])
  const gdMap = useMemo(() => new Map(gdEm.map((g) => [g.lop_id, g])), [gdEm])
  const lopIdsTatCa = useMemo(() => gdEm.map((g) => g.lop_id), [gdEm])
  const lopIdsEm = useMemo(() => new Set(lopIdsTatCa), [lopIdsTatCa])
  const dsLopDangHoc = useMemo(() => gdDangHoc.flatMap((g) => {
    const l = lopMap.get(g.lop_id)
    return l ? [{ lop_id: l.id, ten: l.ten, lich: l.lich, ngay_vao: g.ngay_vao, don_gia: giaGhiDanh(hs, g) }] : []
  }), [gdDangHoc, lopMap, hs])
  // chỉ truyền don_gia_rieng thực sự của lớp: lớp đồng giá phải dùng g.don_gia đã chốt lúc tạo gói, không bị đổi khi sửa hs.don_gia
  const dsLopDu = useMemo(() => gdEm.map((g) => ({ lop_id: g.lop_id, ngay_vao: g.ngay_vao, don_gia: g.don_gia_rieng ?? undefined })), [gdEm])

  const luuLink = async () => {
    const { link: moi, loi } = chuanLinkZalo(oLink)
    if (loi) return message.error(loi)
    const { error } = await sb.from('hoc_sinh').update({ link_zalo: moi }).eq('id', hs.id)
    if (error) return message.error(error.message)
    setLink(moi); setOLink(moi ?? '')
    message.success(moi ? 'Đã lưu link nhóm Zalo' : 'Đã xoá link nhóm Zalo')
  }

  const tai = async () => {
    const [d, g, h, ct, tong] = await Promise.all([
      q(sb.from('diem_danh').select('trang_thai, sticker, buoi_hoc(*)').eq('hoc_sinh_id', hs.id)),
      q(sb.from('goi_hoc').select('*').eq('hoc_sinh_id', hs.id).order('thang_bat_dau')),
      // khoản đã hoàn tiền dư cho em này (chỉ giáo viên đọc được chi_phi; trợ giảng nhận về rỗng)
      q(sb.from('chi_phi').select('so_tien').eq('hoc_sinh_id', hs.id).eq('danh_muc', 'Hoàn học phí')),
      q(sb.from('sticker_cong_tru').select('*').eq('hoc_sinh_id', hs.id).order('tao_luc', { ascending: false })),
      taiTongSticker([hs.id]),
    ])
    const goiList = g as (Goi & { ly_do_dieu_chinh: string | null })[]
    // Lấy thêm buổi của các lớp nằm trong ảnh chụp `lop_gia` phòng trường hợp ghi_danh lớp đó đã bị xoá.
    const lopIdsBuoi = [...new Set([...lopIdsTatCa, ...goiList.flatMap((x) => x.lop_gia?.map((l) => l.lop_id) ?? [])])]
    const b = lopIdsBuoi.length
      ? await q(sb.from('buoi_hoc').select('*').in('lop_id', lopIdsBuoi).or('lop_nghi.eq.true,loai.eq.phu'))
      : []
    setCongTru(ct as StickerCongTru[]); setTongSticker(tong[hs.id] ?? 0)
    setDd(d as never); setGoi(goiList); setBuoiDb(b as BuoiHoc[])
    setDaHoan((h as { so_tien: number }[]).reduce((s, x) => s + x.so_tien, 0))
    const ids = goiList.map((x) => x.id)
    setPhieu(ids.length ? await q(sb.from('phieu_thu').select('*').in('goi_id', ids).order('ngay_thu')) as Phieu[] : [])
    if (hs.avatar) setAvatar((await urlAnh([hs.avatar]))[hs.avatar])
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [hs.id, lopIdsTatCa.join()])

  // cần cả buổi em chưa có điểm danh của mọi lớp em học để biết ngày có lịch, lớp nghỉ, buổi quên điểm danh
  useEffect(() => {
    if (!lopIdsTatCa.length) { setBuoiThang([]); return }
    q(sb.from('buoi_hoc').select('*').in('lop_id', lopIdsTatCa).gte('ngay', `${thang}-01`).lt('ngay', `${congThang(thang, 1)}-01`))
      .then((b) => setBuoiThang(b as BuoiHoc[])).catch((e) => message.error(e.message))
  }, [hs.id, thang, lopIdsTatCa.join()])

  // lọc trước buổi theo ngày vào học & trạng thái từng lớp để luoiThang không báo "chưa điểm danh" nhầm cho lớp vào sau / đã ngừng
  const buoiHien = useMemo(() => buoiThang.filter((b) => {
    const g = gdMap.get(b.lop_id)
    if (!g || b.ngay < g.ngay_vao) return false
    return g.trang_thai === 'dang_hoc' || b.lop_nghi
  }), [buoiThang, gdMap])
  // Ưu tiên ngày vào sớm nhất của các lớp đang học; chỉ lùi về mọi lớp khi em đã ngừng toàn bộ
  const ngayVaoMin = (gdDangHoc.length ? gdDangHoc : gdEm).map((g) => g.ngay_vao).sort()[0] ?? hs.ngay_vao

  const trongThang = dd.filter((x) => x.buoi_hoc.ngay.startsWith(thang)).sort((a, b) => a.buoi_hoc.ngay.localeCompare(b.buoi_hoc.ngay))
  const soCoMat = trongThang.filter((x) => x.trang_thai !== 'vang').length
  const chuaBu = demChuaBu(dd.map((x) => ({ trang_thai: x.trang_thai, loai: x.buoi_hoc.loai })))
  const th = useMemo(() => tongHopHocSinh(goi, phieu, thang), [goi, phieu, thang])
  const noTheoGoi = useMemo(() => noThucCuaGoi(goi, phieu), [goi, phieu])
  const dangNo = useMemo(() => goi.filter((g) => (noTheoGoi[g.id] ?? 0) > 0), [goi, noTheoGoi])
  const loaiHs = useMemo(() => phanLoaiHocSinh(hs.id, ghiDanh), [hs.id, ghiDanh])
  const trangThaiCt = thongTinTrangThaiChiTiet(loaiHs, dangNo.length > 0)
  const tinNhan = tinNhanPhuHuynh(hs.ho_ten, thang, th, soCoMat)
  const tt = tinhTrangGoiNhieuLop(goi, dsLopDangHoc, homNay())
  const ngayNgan = (n?: string) => n ? `${n.slice(8)}/${n.slice(5, 7)}` : ''

  return (
    <Space orientation="vertical" style={{ width: '100%' }}>
      <div className="ux-profile-card">
        <Space wrap align="center">
          {quayLai && <Button onClick={quayLai}>← Quay lại</Button>}
          <Avatar shape="square" size={64} src={avatar}>{hs.ho_ten.split(' ').pop()?.[0]}</Avatar>
          <div>
            <Space wrap size={6}>
              <b style={{ fontSize: 18 }}>{hs.ho_ten}</b>
              <Tag>{hs.ma_hs}</Tag>
              {ql && <Tag color="pink">{vnd(hs.don_gia)}/buổi</Tag>}
              {trangThaiCt.nhanTag && <Tag color={trangThaiCt.mauTag}>{trangThaiCt.nhanTag}</Tag>}
            </Space>
            <div style={{ fontSize: 13, color: MAU.chuPhu }}>
              {(gdDangHoc.length ? gdDangHoc : gdEm).map((g) => {
                const l = lopMap.get(g.lop_id)
                if (!l) return null
                return `${l.ten}${l.lich.length ? ` (${moTaLich(l)})` : ''}${g.don_gia_rieng != null && g.don_gia_rieng !== hs.don_gia ? ` · riêng ${vnd(g.don_gia_rieng)}/buổi` : ''}${g.trang_thai === 'ngung' ? ' [Đã ngừng]' : ''}`
              }).filter(Boolean).join(' · ')}
            </div>
          </div>
        </Space>
        <BoChonThangNhanh thang={thang} onChange={setThang}>
          <DatePicker picker="month" value={dayjs(thang)} onChange={(d) => d && setThang(d.format('YYYY-MM'))} format="MM/YYYY" allowClear={false} />
        </BoChonThangNhanh>
      </div>

      {ql && <Card size="small" title="Link nhóm Zalo">
        <Space.Compact style={{ width: '100%' }}>
          <Input value={oLink} onChange={(e) => setOLink(e.target.value)} placeholder="https://zalo.me/g/..." allowClear aria-label="Link nhóm Zalo" />
          <Button type="primary" disabled={oLink.trim() === (link ?? '')} onClick={luuLink}>Lưu</Button>
        </Space.Compact>
      </Card>}

      <div className="ux-kpi-grid">
        <div className="ux-kpi-card"><Statistic title="Buổi đi học tháng này" value={soCoMat} /></div>
        <div className="ux-kpi-card"><Statistic title="Tổng sticker" value={tongSticker} prefix="⭐" /></div>
        <div className="ux-kpi-card"><Statistic title="Buổi chưa học bù" value={chuaBu} /></div>
        {ql && <div className="ux-kpi-card"><Statistic title="Cần nộp" value={vnd(Math.max(th.conPhaiThu, 0))} /></div>}
      </div>

      <Card size="small" title={`Điểm danh tháng ${thang.slice(5)}/${thang.slice(0, 4)}`}>
        <LichDiemDanhThang
          thang={thang}
          onDoiThang={setThang}
          o={luoiThang(thang, buoiHien, dd, ngayVaoMin, gdDangHoc.length > 0, homNay())}
          lopMap={lopMap}
          lopIdsEm={lopIdsEm}
        />
      </Card>

      {congTru.length > 0 && <Card size="small" title="Sticker ngoài buổi">
        <Table size="small" rowKey="id" pagination={false} dataSource={congTru} scroll={{ x: true }} columns={[
          { title: 'Ngày', render: (_, x) => dayjs(x.ngay).format('DD/MM/YYYY') },
          { title: 'Sticker', render: (_, x) => <b style={{ color: x.so > 0 ? MAU.tot : MAU.do }}>{x.so > 0 ? `+${x.so}` : x.so}</b> },
          { title: 'Lý do', dataIndex: 'ly_do' },
          { title: 'Người ghi', dataIndex: 'ten_nguoi' },
          { title: '', render: (_: unknown, x: StickerCongTru) => <Popconfirm title="Xoá lần cộng/trừ này?" onConfirm={async () => {
            const { error } = await sb.from('sticker_cong_tru').delete().eq('id', x.id); if (error) message.error(error.message); else tai()
          }}><a style={{ color: 'red' }}>Xoá</a></Popconfirm> },
        ]} />
      </Card>}

      {ql && <Card size="small" title="Học phí" extra={
        <Button type="primary" disabled={trangThaiCt.chanThuTien}
          title={trangThaiCt.lyDoChanThuTien}
          onClick={() => setThuTien(true)}>Thu tiền</Button>
      }>
        {gdDangHoc.length > 0 && <div style={{ marginBottom: 8, color: tt.loai === 'con' ? undefined : MAU.do }} data-goi-hien-tai>
          {!tt.goi ? 'Chưa có gói' : tt.loai === 'het' ? `Gói: ${tenGoi(tt.goi)} · đã hết ngày ${ngayNgan(tt.buoiCuoi)}`
            : `Gói: ${tenGoi(tt.goi)} · còn ${tt.conBuoi} buổi`}
        </div>}
        <Descriptions size="small" column={{ xs: 1, sm: 2 }} items={[
          { label: 'Học phí tháng này', children: vnd(th.phaiThu) },
          { label: 'Nợ kỳ trước', children: vnd(th.noKyTruoc) },
          { label: 'Đã thu', children: vnd(th.daThu) },
          { label: 'Còn phải thu', children: <b>{vnd(th.conPhaiThu)}</b> },
        ]} />
        <Space wrap style={{ marginTop: 8 }}>
          <NutSaoChep label="Sao chép tin nhắn" text={tinNhan} />
          {hs.sdt_phu_huynh && <Button href={`https://zalo.me/${hs.sdt_phu_huynh}`} target="_blank">Mở Zalo PH</Button>}
          {link && <Button href={link} target="_blank" rel="noreferrer">Mở nhóm Zalo</Button>}
          {hs.sdt_phu_huynh && <Button href={`sms:${hs.sdt_phu_huynh}?body=${encodeURIComponent(tinNhan)}`}>Gửi SMS</Button>}
        </Space>

        <Table size="small" style={{ marginTop: 12 }} rowKey="id" pagination={false} dataSource={goi} scroll={{ x: true }} columns={[
          { title: 'Gói', render: (_, g) => tenGoi(g) },
          { title: 'Buổi', render: (_, g) => Object.values(g.buoi_du_kien).reduce((s, x) => s + x, 0) },
          { title: 'Phải thu', render: (_, g) => vnd(tongGoi(g)) },
          { title: 'Đã đóng', render: (_, g) => vnd(daDongGoi(g, phieu)) },
          { title: 'Dư phát sinh', render: (_, g) => vnd(tienDuGoiNhieuLop(g, buoiDb as BuoiDacBietLop[], dsLopDu)) },
          { title: '', render: (_: unknown, g: Goi) => <a style={{ color: 'red' }} onClick={() => setXoaMuc({ loai: 'goi', id: g.id, ten: tenGoi(g) })}>Xoá</a> },
        ]} />
        {goi.length > 0 && <div style={{ marginTop: 6, fontSize: 13 }}>
          {/* chỉ tính tiền dư khả dụng từ các gói đã kết thúc tính tới tháng hiện tại, tránh cộng gói đang học */}
          Tiền dư còn lại chưa trừ / chưa hoàn: <b>{vnd(duConLaiNhieuLop(goi, buoiDb as BuoiDacBietLop[], dsLopDu, daHoan, dayjs().format('YYYY-MM')))}</b>
        </div>}

        <Table size="small" style={{ marginTop: 12 }} rowKey="id" pagination={false} dataSource={phieu} scroll={{ x: true }}
          title={() => 'Các lần thu'} columns={[
            { title: 'Ngày', render: (_, p) => dayjs(p.ngay_thu).format('DD/MM/YYYY') },
            { title: 'Số tiền', render: (_, p) => vnd(p.so_tien) },
            { title: 'Hình thức', render: (_, p) => p.hinh_thuc === 'tien_mat' ? 'Tiền mặt' : 'Chuyển khoản' },
            { title: 'Ghi chú', dataIndex: 'ghi_chu' },
            { title: '', render: (_: unknown, p: Phieu) => <a style={{ color: 'red' }} onClick={() => setXoaMuc({ loai: 'phieu', id: p.id, ten: `${vnd(p.so_tien)} (${dayjs(p.ngay_thu).format('DD/MM/YYYY')})` })}>Xoá</a> },
          ]} />
      </Card>}

      <HopThoaiXoa
        open={!!xoaMuc}
        title={xoaMuc?.loai === 'goi' ? `Xoá gói ${xoaMuc.ten}?` : `Xoá phiếu thu ${xoaMuc?.ten ?? ''}?`}
        description={xoaMuc?.loai === 'goi' ? 'Chỉ xoá được khi gói chưa có phiếu thu.' : 'Hành động này sẽ xoá phiếu thu khỏi hệ thống.'}
        okText="Xoá"
        cancelText="Thôi"
        onCancel={() => setXoaMuc(null)}
        onConfirm={async () => {
          if (!xoaMuc) return
          const bang = xoaMuc.loai === 'goi' ? 'goi_hoc' : 'phieu_thu'
          const { error } = await sb.from(bang).delete().eq('id', xoaMuc.id)
          if (error) message.error(error.message)
          else tai()
        }}
      />

      {thuTien && <ThuTien hs={hs} dsLopDangHoc={dsLopDangHoc} dsLopDu={dsLopDu} ngayVaoMin={ngayVaoMin}
        goi={goi} phieu={phieu} buoiDb={buoiDb} daHoan={daHoan} dong={() => { setThuTien(false); tai() }} />}
    </Space>
  )
}

function ThuTien({ hs, dsLopDangHoc, dsLopDu, ngayVaoMin, goi, phieu, buoiDb, daHoan, dong }: {
  hs: HocSinh; dsLopDangHoc: { lop_id: string; ten: string; lich: number[]; ngay_vao: string; don_gia: number }[]
  dsLopDu: { lop_id: string; ngay_vao: string; don_gia?: number }[]; ngayVaoMin: string
  goi: Goi[]; phieu: Phieu[]; buoiDb: BuoiHoc[]; daHoan: number; dong: () => void
}) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const noTheoGoi = noThucCuaGoi(goi, phieu)
  const dangNo = goi.filter((g) => (noTheoGoi[g.id] ?? 0) > 0)
  const cuoi = goi[goi.length - 1]
  // chưa có gói nào: lấy tháng muộn hơn giữa tháng vào học và tháng này
  const thangKe = cuoi ? thangHetGoi(cuoi) : [dayjs(ngayVaoMin).format('YYYY-MM'), dayjs().format('YYYY-MM')].sort()[1]
  const duConBanDau = duConLaiNhieuLop(goi, buoiDb as BuoiDacBietLop[], dsLopDu, daHoan, thangKe)
  const buoiBanDau = demBuoiDuKienNhieuLop(dsLopDangHoc, thangKe, 1)
  const tienThangBanDau = tinhTienThangNhieuLop(dsLopDangHoc, hs.don_gia, thangKe, 1)
  const tongBanDau = tongGoi({
    id: '', hoc_sinh_id: hs.id, thang_bat_dau: `${thangKe}-01`, so_thang: 1, don_gia: hs.don_gia,
    buoi_du_kien: buoiBanDau, tien_thang: tienThangBanDau, tien_du_tru: 0, dieu_chinh: 0,
  })
  const truBanDau = Math.max(0, Math.min(duConBanDau, tongBanDau))

  const v = Form.useWatch([], form) ?? {}
  const coGiaOverride = typeof v.don_gia === 'number' && !Number.isNaN(v.don_gia)
  const donGia = coGiaOverride ? v.don_gia : hs.don_gia
  const thangBd: Thang = v.thang?.format?.('YYYY-MM') ?? thangKe
  const soThang = v.so_thang ?? 1
  const duCon = duConLaiNhieuLop(goi, buoiDb as BuoiDacBietLop[], dsLopDu, daHoan, thangBd)
  const buoi = demBuoiDuKienNhieuLop(dsLopDangHoc, thangBd, soThang)
  const coGiaRiengLop = dsLopDangHoc.some((x) => x.don_gia !== hs.don_gia)
  const tienThang = coGiaOverride ? null : tinhTienThangNhieuLop(dsLopDangHoc, hs.don_gia, thangBd, soThang)
  const chiTietLop = tienThang
    ? dsLopDangHoc.map((x) => {
        const tu = x.ngay_vao > `${thangBd}-01` ? x.ngay_vao : undefined
        const sbLop = Object.values(demBuoiDuKien(x.lich, thangBd, soThang, tu)).reduce((s, n) => s + n, 0)
        return `${x.ten}: ${sbLop}b × ${vnd(x.don_gia)}`
      }).join(' + ')
    : null
  const tongTruocDu = tongGoi({
    id: '', hoc_sinh_id: hs.id, thang_bat_dau: `${thangBd}-01`, so_thang: soThang, don_gia: donGia,
    buoi_du_kien: buoi, tien_thang: tienThang, tien_du_tru: 0, dieu_chinh: v.dieu_chinh ?? 0,
  })
  // trừ tiền dư không quá tổng gói, không thì gói âm
  const truToiDa = Math.max(0, Math.min(duCon, tongTruocDu))
  const tongGoiMoi = tongGoi({
    id: '', hoc_sinh_id: hs.id, thang_bat_dau: `${thangBd}-01`, so_thang: soThang, don_gia: donGia,
    buoi_du_kien: buoi, tien_thang: tienThang, tien_du_tru: v.tien_du_tru ?? 0, dieu_chinh: v.dieu_chinh ?? 0,
  })
  const noGoi = v.loai === 'no' ? (noTheoGoi[(goi.find((g) => g.id === v.goi_id) ?? dangNo[0])?.id ?? ''] ?? 0) : 0

  useEffect(() => {
    if ((v.don_gia === 0 || truToiDa === 0) && (form.getFieldValue('tien_du_tru') ?? 0) > 0) {
      form.setFieldValue('tien_du_tru', 0)
    }
  }, [v.don_gia, truToiDa, form])

  const [luu, dangLuu] = useMotLan(async () => {
    const x = await form.validateFields().catch(() => null)
    if (!x) return
    let goiId = x.goi_id
    if (x.loai === 'moi') {
      if (!dsLopDangHoc.length) { message.error('Học sinh không có lớp đang học để đóng gói mới'); return }
      try {
        const g = await q(sb.from('goi_hoc').insert({
          hoc_sinh_id: hs.id, thang_bat_dau: `${thangBd}-01`, so_thang: x.so_thang, don_gia: donGia, buoi_du_kien: buoi,
          tien_thang: tienThang,
          lop_gia: dsLopDangHoc.map((l) => ({ lop_id: l.lop_id, ngay_vao: l.ngay_vao, don_gia: coGiaOverride ? donGia : l.don_gia })),
          tien_du_tru: x.tien_du_tru ?? 0, dieu_chinh: x.dieu_chinh ?? 0, ly_do_dieu_chinh: x.ly_do || null,
        }).select().single()) as Goi
        goiId = g.id
      } catch (e) { message.error((e as Error).message); return }
    }
    if (x.so_tien > 0) {
      try {
        await q(sb.from('phieu_thu').insert({
          goi_id: goiId, so_tien: x.so_tien, ngay_thu: x.ngay_thu.format('YYYY-MM-DD'), hinh_thuc: x.hinh_thuc, ghi_chu: x.ghi_chu || null,
        }))
      } catch (e) {
        if (x.loai === 'moi') { message.error(`Đã tạo gói nhưng chưa ghi được tiền thu: ${(e as Error).message}`); dong(); return }
        message.error((e as Error).message); return
      }
    }
    message.success('Đã lưu'); dong()
  })

  const tien = O_TIEN
  return (
    <Modal open title={`Thu tiền: ${hs.ho_ten}`} onCancel={dong} onOk={() => luu()} okText="Lưu" confirmLoading={dangLuu}>
      <Form form={form} layout="vertical" initialValues={{
        loai: dangNo.length ? 'no' : 'moi', goi_id: dangNo[0]?.id, so_thang: 1, thang: dayjs(thangKe),
        tien_du_tru: truBanDau, ngay_thu: dayjs(), hinh_thuc: 'tien_mat',
      }}>
        <Form.Item name="loai"><Radio.Group optionType="button" options={[
          { value: 'moi', label: 'Đóng gói mới', disabled: !dsLopDangHoc.length },
          { value: 'no', label: 'Trả gói đang nợ', disabled: !dangNo.length },
        ]} /></Form.Item>
        {v.loai === 'no' ? (
          <Form.Item name="goi_id" label="Gói"><Select options={dangNo.map((g) => ({ value: g.id, label: `${tenGoi(g)} · còn nợ ${vnd(noTheoGoi[g.id] ?? 0)}` }))} /></Form.Item>
        ) : <>
          <Form.Item name="so_thang" label="Số tháng"><Radio.Group optionType="button" options={[1, 2, 3].map((n) => ({ value: n, label: `${n} tháng` }))} /></Form.Item>
          <Form.Item name="thang" label="Từ tháng"><DatePicker picker="month" format="MM/YYYY" allowClear={false} /></Form.Item>
          <Form.Item name="don_gia"
            label={coGiaRiengLop ? 'Đơn giá/buổi chung (để trống = tính theo từng lớp)' : `Đơn giá/buổi (mặc định ${vnd(hs.don_gia)})`}
            extra={v.don_gia === 0 && <span style={{ color: MAU.do }}>0 = gói này 0đ. Để trống để dùng giá mặc định.</span>}>
            <InputNumber {...tien} placeholder={coGiaRiengLop ? 'Theo từng lớp' : `${donGia}`} />
          </Form.Item>
          <Form.Item name="tien_du_tru" label={`Trừ tiền dư (còn lại ${vnd(duCon)})`}
            rules={[{ validator: (_, so) => (so ?? 0) >= 0 && (so ?? 0) <= truToiDa ? Promise.resolve() : Promise.reject(new Error(`Chỉ trừ tối đa ${vnd(truToiDa)}`)) }]}
            extra={!duCon && 'Chưa có tiền dư: tiền dư chỉ sinh từ buổi lớp nghỉ của gói đã kết thúc. Tiền dư ngoài app (sổ cũ) nhập ở ô Điều chỉnh bằng số âm.'}>
            <InputNumber {...tien} max={truToiDa} disabled={!duCon} />
          </Form.Item>
          <Form.Item name="dieu_chinh" label="Điều chỉnh (giảm thì nhập số âm)"
            dependencies={['don_gia', 'so_thang', 'thang', 'tien_du_tru']}
            rules={[{
              validator: (_, dc) => {
                const tongThu = tongGoi({
                  id: '', hoc_sinh_id: hs.id, thang_bat_dau: `${thangBd}-01`, so_thang: soThang, don_gia: donGia,
                  buoi_du_kien: buoi, tien_thang: tienThang, tien_du_tru: form.getFieldValue('tien_du_tru') ?? 0, dieu_chinh: dc ?? 0,
                })
                return tongThu >= 0 ? Promise.resolve() : Promise.reject(new Error('Tổng tiền gói học không được âm'))
              },
            }]}><InputNumber {...tien} min={undefined} /></Form.Item>
          {!!v.dieu_chinh && <Form.Item name="ly_do" label="Lý do điều chỉnh" rules={[{ required: true }]}><Input /></Form.Item>}
          <p>
            Buổi dự kiến: {Object.entries(buoi).map(([t, n]) => `T${t.slice(5)}: ${n}`).join(', ')}
            {chiTietLop && <span style={{ display: 'block', fontSize: 12, color: MAU.chuPhu }}>({chiTietLop})</span>}
            {' → '}<b>Tổng gói: {vnd(tongGoiMoi)}</b>
          </p>
        </>}
        {v.loai === 'no'
          ? <Form.Item name="so_tien" label={`Số tiền thu lần này (còn nợ ${vnd(noGoi)})`} rules={[{ required: true, message: 'Nhập số tiền thu' },
            { validator: (_, so) => so > 0 && so <= noGoi ? Promise.resolve() : Promise.reject(new Error(`Số tiền từ 1 đến ${vnd(noGoi)}`)) }]}>
            <InputNumber {...tien} /></Form.Item>
          : <Form.Item name="so_tien" label="Số tiền thu lần này (để 0 nếu chỉ ghi gói, chưa thu)"><InputNumber {...tien} /></Form.Item>}
        <Space>
          <Form.Item name="ngay_thu" label="Ngày thu"><DatePicker format="DD/MM/YYYY" allowClear={false} /></Form.Item>
          <Form.Item name="hinh_thuc" label="Hình thức"><Select style={{ width: 140 }} options={[{ value: 'tien_mat', label: 'Tiền mặt' }, { value: 'chuyen_khoan', label: 'Chuyển khoản' }]} /></Form.Item>
        </Space>
        <Form.Item name="ghi_chu" label="Ghi chú"><Input /></Form.Item>
      </Form>
    </Modal>
  )
}

import { useEffect, useRef, useState } from 'react'
import { App, Avatar, Button, Card, Checkbox, DatePicker, Empty, Image, Input, InputNumber, List, Modal, Popconfirm, Radio, Segmented, Select, Space, Switch, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { CHU_SO, MAU } from '../giao-dien'
import { dsHocSinhBuoi } from '../diem-danh-thang'
import { cong2Gio, gioBuoi, nhomBuoi } from '../gio-hoc'
import { homNay, hsDangHoc, q, taiHet, useMotLan, sb, taiAnhLen, taiTongSticker, urlAnh, type BuoiHoc, type DiemDanh as DD, type GhiDanh, type HocSinh, type Lop, type TaiKhoan } from '../supabase'
import VungTaiFile from '../thanh-phan/VungTaiFile'
import HopThoaiXoa from '../thanh-phan/HopThoaiXoa'

const LOAI = { lich: 'Theo lịch', phu: 'Buổi phụ', bu: 'Buổi bù' }

type ThemBuoi = { lop_id?: string; loai: 'phu' | 'bu'; bd: string; kt: string }

export default function DiemDanh() {
  const { message } = App.useApp()
  const [ngay, setNgay] = useState(homNay())
  const [lops, setLops] = useState<Lop[]>([])
  const [buois, setBuois] = useState<BuoiHoc[]>([])
  const [mo, setMo] = useState<BuoiHoc[] | null>(null)
  const [themBuoi, setThemBuoi] = useState<ThemBuoi | null>(null)

  // daHuy: đổi ngày nhanh thì kết quả của ngày cũ về muộn không được ghi đè danh sách ngày mới
  const tai = async (daHuy = () => false) => {
    await q(sb.rpc('sinh_buoi_thang', { thang: ngay }))
    const [l, b] = await Promise.all([
      q(sb.from('lop').select('*').order('ten')),
      q(sb.from('buoi_hoc').select('*').eq('ngay', ngay)),
    ])
    if (daHuy()) return
    setLops(l as Lop[]); setBuois(b as BuoiHoc[])
  }
  useEffect(() => {
    let huy = false
    tai(() => huy).catch((e) => message.error(e.message))
    return () => { huy = true }
  }, [ngay])

  const [luuBuoi, dangLuuBuoi] = useMotLan(async () => {
    try {
      const t = themBuoi!
      await q(sb.from('buoi_hoc').insert({ lop_id: t.lop_id, ngay, loai: t.loai, bat_dau: t.bd, ket_thuc: t.kt }))
      setThemBuoi(null); tai()
    } catch (e) { message.error((e as Error).message) }
  })
  // chọn lớp thì điền sẵn giờ của lớp vào thứ của ngày đang xem (nếu thứ đó có lịch)
  const chonLop = (lop_id: string) => {
    const g = lops.find((l) => l.id === lop_id)?.gio_thu[dayjs(ngay).day()]
    setThemBuoi({ ...themBuoi!, lop_id, ...(g && { bd: g.bd, kt: g.kt }) })
  }
  const gioHopLe = !!themBuoi?.bd && !!themBuoi.kt && themBuoi.kt > themBuoi.bd
  const tenLop = (id: string) => lops.find((l) => l.id === id)?.ten ?? ''
  if (mo) return <NhomBuoi buois={mo} lops={lops} quayLai={() => { setMo(null); tai() }} />

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <DatePicker value={dayjs(ngay)} onChange={(d) => d && setNgay(d.format('YYYY-MM-DD'))} format="dddd DD/MM/YYYY" allowClear={false} />
        <Button icon={<PlusOutlined />} onClick={() => setThemBuoi({ loai: 'phu', bd: '', kt: '' })}>Thêm buổi phụ / bù</Button>
      </Space>
      {buois.length === 0 ? <Empty description="Hôm nay không có buổi học nào theo lịch" /> : (
        // các buổi cùng giờ bắt đầu là lớp dạy gộp: một dòng, một màn điểm danh
        <List bordered dataSource={nhomBuoi(buois)} renderItem={(g) => (
          <List.Item onClick={() => setMo(g)} style={{ cursor: 'pointer' }}
            extra={g.every((b) => b.lop_nghi) ? <Tag color="red">Lớp nghỉ</Tag> : <Button type="primary">Điểm danh</Button>}>
            <List.Item.Meta title={g.map((b) => tenLop(b.lop_id)).join(' + ')}
              description={[gioBuoi(g[0]), ...new Set(g.map((b) => LOAI[b.loai]))].filter(Boolean).join(' · ')} />
          </List.Item>
        )} />
      )}
      <Modal open={!!themBuoi} title="Thêm buổi" onCancel={() => setThemBuoi(null)} onOk={() => luuBuoi()} confirmLoading={dangLuuBuoi}
        okButtonProps={{ disabled: !themBuoi?.lop_id || !gioHopLe }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Segmented value={themBuoi?.loai} onChange={(v) => setThemBuoi({ ...themBuoi!, loai: v as 'phu' | 'bu' })}
            options={[{ value: 'phu', label: 'Buổi phụ (bù cho lớp nghỉ)' }, { value: 'bu', label: 'Buổi bù riêng' }]} />
          <Select placeholder="Lớp" style={{ width: '100%' }} value={themBuoi?.lop_id}
            onChange={chonLop} options={lops.map((l) => ({ value: l.id, label: l.ten }))} />
          <Space>
            <Input type="time" aria-label="Giờ bắt đầu" value={themBuoi?.bd} style={{ width: 120 }}
              onChange={(e) => setThemBuoi({ ...themBuoi!, bd: e.target.value, kt: themBuoi?.kt || (e.target.value ? cong2Gio(e.target.value) : '') })} />
            <span>→</span>
            <Input type="time" aria-label="Giờ kết thúc" value={themBuoi?.kt} style={{ width: 120 }}
              onChange={(e) => setThemBuoi({ ...themBuoi!, kt: e.target.value })} />
          </Space>
          <small style={{ color: MAU.chuPhu }}>Buổi trùng giờ bắt đầu với lớp khác sẽ điểm danh chung và trợ giảng tính 1 ca.</small>
        </Space>
      </Modal>
    </Space>
  )
}

const tenFile = (duong: string) => duong.split('/').pop()!

/**
 * Một ca: các buổi cùng ngày + cùng giờ bắt đầu (lớp gộp) hoặc một buổi lẻ. Trợ giảng và ảnh chọn một lần cho cả ca;
 * học sinh và "Lớp nghỉ" vẫn tách theo lớp vì học phí, tiền dư tính theo lớp.
 */
function NhomBuoi({ buois: b0, lops, quayLai }: { buois: BuoiHoc[]; lops: Lop[]; quayLai: () => void }) {
  const { message } = App.useApp()
  const [buois, setBuois] = useState(b0)
  const [tgs, setTgs] = useState<TaiKhoan[]>([])
  const [tgCo, setTgCo] = useState<string[]>([])
  const [xacNhanNghi, setXacNhanNghi] = useState<{ buoi: BuoiHoc; soEm: number; soTg: number } | null>(null)
  const tgRef = useRef(tgCo)
  tgRef.current = tgCo
  const hangDoiTg = useRef<Promise<void>>(Promise.resolve())
  const [anh, setAnh] = useState<{ id: string; duong_dan: string }[]>([])
  const [url, setUrl] = useState<Record<string, string>>({})
  // null = chưa tải: thẻ học sinh chỉ dựng khi đã có, để mỗi thẻ tải đúng một lần. Tải hai lần (lần đầu với danh sách
  // rỗng) thì lần sau về muộn có thể ghi đè dấu "Học bù" vừa bấm, làm nút "Không đến" bấm không ăn.
  const [tatCaHs, setTatCaHs] = useState<HocSinh[] | null>(null)
  const [ghiDanh, setGhiDanh] = useState<GhiDanh[]>([])
  const ids = buois.map((b) => b.id)
  const dangHoc = buois.filter((b) => !b.lop_nghi)

  const tai = async () => {
    const [tg, tgb, a, tatCa, gd] = await Promise.all([
      q(sb.rpc('ds_tro_giang')),  // chỉ tên, không đơn giá: trợ giảng không xem được lương nhau
      q(sb.from('tro_giang_buoi').select('tro_giang_id').in('buoi_id', ids)),
      q(sb.from('anh_buoi').select('id, duong_dan').in('buoi_id', ids).order('tao_luc')),
      taiHet((x, y) => sb.from('hoc_sinh').select('*').order('ho_ten').order('id').range(x, y)),
      // Tải cả ghi_danh đã ngừng để buổi cũ không gắn nhầm "· học bù" cho học sinh từng học lớp này
      taiHet((x, y) => sb.from('ghi_danh').select('*').order('id').range(x, y)),
    ])
    setTgs(tg as TaiKhoan[]); setTgCo([...new Set((tgb as { tro_giang_id: string }[]).map((x) => x.tro_giang_id))])
    // ảnh lớp gộp được chép sang từng buổi cùng tên file: chỉ hiện một lần
    const daCo = new Set<string>()
    const ds = (a as { id: string; duong_dan: string }[]).filter((x) => !daCo.has(tenFile(x.duong_dan)) && daCo.add(tenFile(x.duong_dan)))
    setAnh(ds); setGhiDanh(gd as GhiDanh[]); setTatCaHs(tatCa as HocSinh[])
    setUrl(await urlAnh(ds.map((x) => x.duong_dan)))
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [])

  const ghiNghi = async (b: BuoiHoc, v: boolean) => {
    try {
      await q(sb.from('buoi_hoc').update({ lop_nghi: v }).eq('id', b.id))
      setBuois((ds) => ds.map((x) => (x.id === b.id ? { ...x, lop_nghi: v } : x)))
      // database đã xoá trợ giảng của buổi vừa nghỉ: tải lại để ô trợ giảng khớp
      if (v) tai().catch((e) => message.error(e.message))
    } catch (e) { message.error((e as Error).message) }
  }
  // Đánh lớp nghỉ xoá điểm danh, sticker, trợ giảng của buổi (trigger lop_nghi_xoa): buổi đã điểm danh thì hỏi lại trước
  const doiNghi = async (b: BuoiHoc, v: boolean) => {
    if (!v) return ghiNghi(b, v)
    try {
      const [{ count: soEm }, { count: soTg }] = await Promise.all([
        sb.from('diem_danh').select('hoc_sinh_id', { count: 'exact', head: true }).eq('buoi_id', b.id),
        sb.from('tro_giang_buoi').select('tro_giang_id', { count: 'exact', head: true }).eq('buoi_id', b.id),
      ])
      if (!soEm && !soTg) return ghiNghi(b, v)
      setXacNhanNghi({ buoi: b, soEm: soEm ?? 0, soTg: soTg ?? 0 })
    } catch (e) { message.error((e as Error).message) }
  }
  const lopCua = (b: BuoiHoc) => lops.find((l) => l.id === b.lop_id)!

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <Button onClick={quayLai}>← Quay lại</Button>
        <b>{buois.map((b) => lopCua(b).ten).join(' + ')} · {dayjs(buois[0].ngay).format('dddd DD/MM/YYYY')}</b>
        {gioBuoi(buois[0]) && <b style={{ fontFamily: CHU_SO, fontSize: 22, color: MAU.chinh }}>{gioBuoi(buois[0])}</b>}
      </Space>

      {dangHoc.length > 0 && <Card size="small" title="Trợ giảng có mặt">
        <Checkbox.Group value={tgCo} options={tgs.map((t) => ({ value: t.id, label: t.ho_ten }))} onChange={(v) => {
          // tick nhanh liên tiếp: so với bản mới nhất (ref) chứ không phải state cũ của lần render trước, hiện ngay, rồi
          // ghi lần lượt qua hàng đợi để "tick rồi bỏ" không bị lệnh xoá chạy trước lệnh thêm
          const them = v.filter((x) => !tgRef.current.includes(x)), bot = tgRef.current.filter((x) => !v.includes(x))
          tgRef.current = v; setTgCo(v)
          hangDoiTg.current = hangDoiTg.current.then(async () => {
            // ghi cho mọi lớp đang học trong ca; lương tính theo (ngày, giờ bắt đầu) nên lớp gộp vẫn chỉ 1 ca
            if (them.length) await q(sb.from('tro_giang_buoi').insert(dangHoc.flatMap((b) => them.map((id) => ({ buoi_id: b.id, tro_giang_id: id })))))
            if (bot.length) await q(sb.from('tro_giang_buoi').delete().in('buoi_id', ids).in('tro_giang_id', bot))
          }).catch((e) => { message.error((e as Error).message); tai().catch((x) => message.error(x.message)) })
        }} />
        {tgs.length === 0 && <i>Chưa có tài khoản trợ giảng</i>}
      </Card>}

      {/* key theo cả lop_nghi: bỏ nghỉ thì dựng lại thẻ, không hiện lại dấu tick cũ (đã bị xoá) còn trong state */}
      {tatCaHs && buois.map((b) => <DsHocSinh key={`${b.id}-${b.lop_nghi}`} buoi={b} lop={lopCua(b)} tatCaHs={tatCaHs} ghiDanh={ghiDanh}
        nhieuLop={buois.length > 1} doiNghi={(v) => doiNghi(b, v)} />)}

      <Card size="small" title="Ảnh lớp (minh chứng)">
        <Image.PreviewGroup>
          {/* ảnh đã được workflow don-anh cất lên GitHub thì không còn file, không ký được link: ẩn thay vì hiện ảnh vỡ */}
          <Space wrap style={{ marginBottom: anh.some((a) => url[a.duong_dan]) ? 10 : 0 }}>
            {anh.filter((a) => url[a.duong_dan]).map((a) => <Image key={a.id} width={100} height={100} style={{ objectFit: 'cover', borderRadius: 10 }} src={url[a.duong_dan]} />)}
          </Space>
        </Image.PreviewGroup>
        <VungTaiFile
          compact
          accept="image/*"
          multiple
          title="Chụp / chọn ảnh lớp"
          browseLabel="tải ảnh lên"
          subtitle="JPG, PNG"
          ariaLabel="Chụp hoặc chọn ảnh lớp"
          onChonFile={async (files) => {
            for (const file of files) {
              try {
                const ten = `${crypto.randomUUID()}.jpg`
                const duong = await taiAnhLen(`buoi/${buois[0].id}/${ten}`, file)
                await q(sb.from('anh_buoi').insert({ buoi_id: buois[0].id, duong_dan: duong }))
                // chép file sang từng buổi khác của ca thay vì cho nhiều dòng dùng chung một file: tốn gấp đôi
                // dung lượng cho ảnh lớp gộp, nhưng giữ nguyên anh_buoi.duong_dan unique, quyền xem ảnh của phụ huynh,
                // xoa_lop và workflow don-anh. Đổi sang dùng chung file nếu ảnh gộp làm đầy bộ nhớ.
                for (const b of buois.slice(1)) {
                  await q(sb.storage.from('anh').copy(duong, `buoi/${b.id}/${ten}`))
                  await q(sb.from('anh_buoi').insert({ buoi_id: b.id, duong_dan: `buoi/${b.id}/${ten}` }))
                }
              } catch (e) {
                message.error((e as Error).message)
                throw e
              }
            }
            await tai()
          }}
        />
      </Card>

      <HopThoaiXoa
        open={!!xacNhanNghi}
        title={xacNhanNghi ? `Đánh lớp nghỉ cho ${lopCua(xacNhanNghi.buoi).ten}?` : ''}
        description={xacNhanNghi ? `Buổi này đã điểm danh ${xacNhanNghi.soEm} em, ${xacNhanNghi.soTg} trợ giảng. Đánh lớp nghỉ sẽ xoá điểm danh, sticker và trợ giảng của buổi.` : undefined}
        okText="Đánh lớp nghỉ"
        cancelText="Thôi"
        onCancel={() => setXacNhanNghi(null)}
        onConfirm={() => ghiNghi(xacNhanNghi!.buoi, true)}
      />
    </Space>
  )
}

function DsHocSinh({ buoi, lop, tatCaHs, ghiDanh, nhieuLop, doiNghi }: {
  buoi: BuoiHoc; lop: Lop; tatCaHs: HocSinh[]; ghiDanh: GhiDanh[]; nhieuLop: boolean; doiNghi: (v: boolean) => void
}) {
  const { message } = App.useApp()
  const [hs, setHs] = useState<HocSinh[]>([])
  const [dd, setDd] = useState<Record<string, DD>>({})
  const [boDdHs, setBoDdHs] = useState<{ h: HocSinh; sticker: number } | null>(null)
  // sticker đã có + các buổi KHÁC + cộng/trừ ngoài buổi; tổng hiện = số này + sticker buổi đang chấm. Không cộng dồn từng lần chấm vì
  // chấm trước khi số này tải xong sẽ cộng vào số 0 tạm thời (tổng sai).
  const [stickerKhac, setStickerKhac] = useState<Record<string, number>>({})
  const [url, setUrl] = useState<Record<string, string>>({})

  const { cuaLopTatCaIds } = dsHocSinhBuoi(tatCaHs, ghiDanh, lop.id, buoi.ngay, dd)

  const tai = async () => {
    const d = await q(sb.from('diem_danh').select('*').eq('buoi_id', buoi.id))
    const ddMap = Object.fromEntries((d as DD[]).map((x) => [x.hoc_sinh_id, x]))
    const { ds } = dsHocSinhBuoi(tatCaHs, ghiDanh, lop.id, buoi.ngay, ddMap)
    setHs(ds); setDd(ddMap)
    const ids = ds.map((h) => h.id)
    if (ids.length) {
      const tong = await taiTongSticker(ids)
      setStickerKhac(Object.fromEntries(ids.map((id) => [id, (tong[id] ?? 0) - (ddMap[id]?.sticker ?? 0)])))
    }
    setUrl(await urlAnh(ds.map((h) => h.avatar!).filter(Boolean)))
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [])

  // đọc bản mới nhất qua ref: bấm "Vắng" rồi gõ sticker liền tay thì lần lưu sau vẫn thấy "Vắng", không ghi đè thành "Có mặt"
  const ddRef = useRef(dd)
  ddRef.current = dd
  // buổi bù riêng: có dòng điểm danh = đã học bù; không đến thì không có dòng nào (không sinh thêm buổi chưa bù)
  const buoiBu = buoi.loai === 'bu'
  // ghi lần lượt: gõ sticker "12" sinh 2 lần lưu (1 rồi 12), chạy song song thì lần "1" về sau có thể đè mất "12"
  const hangDoi = useRef<Promise<unknown>>(Promise.resolve())
  const ghi = (viec: () => PromiseLike<unknown>) => {
    hangDoi.current = hangDoi.current.then(viec).catch((e) => { message.error((e as Error).message); return tai() })
  }
  const luu = (hsId: string, thayDoi: Partial<DD>) => {
    const cu = ddRef.current[hsId] ?? { buoi_id: buoi.id, hoc_sinh_id: hsId, trang_thai: buoiBu ? 'hoc_bu' : 'co_mat', sticker: 0 }
    const moi = { ...cu, ...thayDoi } as DD
    ddRef.current = { ...ddRef.current, [hsId]: moi }
    setDd(ddRef.current)
    ghi(() => q(sb.from('diem_danh').upsert(moi)))
  }

  const boDiemDanh = (hsId: string) => {
    const { [hsId]: _bo, ...con } = ddRef.current
    ddRef.current = con
    setDd(con)
    ghi(() => q(sb.from('diem_danh').delete().eq('buoi_id', buoi.id).eq('hoc_sinh_id', hsId)))
  }

  // "–": bấm nhầm Có mặt / Vắng thì quay về chưa điểm danh. Xoá cả sticker của buổi, nên em đã có sticker thì hỏi lại.
  const veChua = (h: HocSinh) => {
    const x = ddRef.current[h.id]
    if (!x) return
    if (!x.sticker) return boDiemDanh(h.id)
    setBoDdHs({ h, sticker: x.sticker })
  }

  const nghi = <span style={{ fontWeight: 'normal' }}>Lớp nghỉ <Switch size="small" checked={buoi.lop_nghi} onChange={doiNghi} /></span>
  if (buoi.lop_nghi) return <Card size="small" title={nhieuLop ? lop.ten : 'Lớp nghỉ'} extra={nghi} />

  // không có nút "Tất cả có mặt" (người dùng chốt 2026-11-21): tick từng em, tránh bấm nhầm đánh có mặt cả lớp
  const dem = `(${Object.values(dd).filter((x) => x.trang_thai !== 'vang').length}/${hs.length} ${buoiBu ? 'học bù' : 'có mặt'})`
  return (
    <Card size="small" title={nhieuLop ? `${lop.ten} ${dem}` : `Học sinh ${dem}`}
      extra={nghi}>
      {buoiBu && <p style={{ marginTop: 0, color: MAU.chuPhu, fontSize: 13 }}>Buổi bù riêng: em nào đến thì chọn "Học bù" (trừ 1 buổi chưa bù). Em không đến thì để "Không đến", không bị tính thêm buổi chưa bù.</p>}
      <List dataSource={hs} renderItem={(h) => {
        const x = dd[h.id]
        const laBu = !cuaLopTatCaIds.has(h.id)
        return (
          <List.Item style={{ flexWrap: 'wrap', gap: 8, background: x || buoiBu ? undefined : MAU.vang }}>
            <Space>
              <Avatar shape="square" size={56} src={h.avatar && url[h.avatar]}>{h.ho_ten.split(' ').pop()?.[0]}</Avatar>
              <div><b>{h.ho_ten}</b><br /><small>⭐ {(stickerKhac[h.id] ?? h.sticker_dau_ky ?? 0) + (x?.sticker ?? 0)} sticker{laBu && ' · học bù'}</small></div>
            </Space>
            <Space wrap>
              {buoiBu ? (
                <Segmented value={x ? 'hoc_bu' : 'khong'} onChange={(v) => (v === 'khong' ? boDiemDanh(h.id) : luu(h.id, { trang_thai: 'hoc_bu' }))}
                  options={[{ value: 'hoc_bu', label: 'Học bù' }, { value: 'khong', label: 'Không đến' }]} />
              ) : (
                // Radio thay Segmented: Segmented chưa có giá trị thì tự hiện chọn sẵn ô đầu ("Có mặt") và bấm vào
                // ô đó không gọi onChange, nên em chưa điểm danh bấm "Có mặt" không được lưu. '' = chưa chọn ô nào.
                // Ô "–" ở giữa là hành động quay về chưa điểm danh, không bao giờ ở trạng thái được chọn.
                // Em lớp khác sang học bù không có "–": đã có nút Gỡ.
                <Radio.Group optionType="button" buttonStyle="solid" value={x?.trang_thai ?? ''}
                  onChange={(e) => (e.target.value === 'chua' ? veChua(h) : luu(h.id, { trang_thai: e.target.value as DD['trang_thai'] }))}
                  options={laBu ? [{ value: 'hoc_bu', label: 'Học bù' }, { value: 'vang', label: 'Vắng' }]
                    : [{ value: 'co_mat', label: 'Có mặt' },
                      { value: 'chua', label: <span aria-label="Chưa điểm danh" title="Chưa điểm danh">–</span> },
                      { value: 'vang', label: 'Vắng' }]} />
              )}
              <InputNumber addonBefore="⭐" style={{ width: 110 }} precision={0} value={x?.sticker ?? 0}
                onChange={(v) => v !== null && luu(h.id, { sticker: v })} />
              {/* em lớp khác thêm nhầm: "Vắng" sẽ cộng buổi chưa bù sai, nên phải xoá hẳn dòng điểm danh */}
              {laBu && (
                <Popconfirm title={`Gỡ ${h.ho_ten} khỏi buổi này?`} okText="Gỡ" cancelText="Thôi"
                  onConfirm={async () => {
                    try { await q(sb.from('diem_danh').delete().eq('buoi_id', buoi.id).eq('hoc_sinh_id', h.id)); tai() }
                    catch (e) { message.error((e as Error).message) }
                  }}>
                  <Button size="small" danger>Gỡ</Button>
                </Popconfirm>
              )}
            </Space>
          </List.Item>
        )
      }} />
      <Select showSearch optionFilterProp="label" placeholder="+ Thêm học sinh lớp khác học bù buổi này" style={{ width: '100%', marginTop: 8 }}
        value={null} options={tatCaHs.filter((h) => hsDangHoc(ghiDanh, h.id) && !hs.some((x) => x.id === h.id)).map((h) => ({ value: h.id, label: `${h.ho_ten} (${h.ma_hs})` }))}
        onChange={async (id) => {
          try { await q(sb.from('diem_danh').insert({ buoi_id: buoi.id, hoc_sinh_id: id, trang_thai: 'hoc_bu' })); tai() }
          catch (e) { message.error((e as Error).message) }
        }} />
      <HopThoaiXoa
        open={!!boDdHs}
        title={boDdHs ? `Bỏ điểm danh ${boDdHs.h.ho_ten}?` : ''}
        description={boDdHs ? `Sẽ xoá ${boDdHs.sticker} sticker của em ở buổi này.` : undefined}
        okText="Bỏ điểm danh"
        cancelText="Thôi"
        onCancel={() => setBoDdHs(null)}
        onConfirm={() => boDiemDanh(boDdHs!.h.id)}
      />
    </Card>
  )
}

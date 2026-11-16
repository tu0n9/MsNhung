import { useEffect, useRef, useState } from 'react'
import { App, Avatar, Button, Card, Checkbox, DatePicker, Empty, Image, Input, InputNumber, List, Modal, Radio, Segmented, Select, Space, Switch, Tag, Upload } from 'antd'
import { CameraOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { MAU } from '../giao-dien'
import { cong2Gio, gioBuoi, nhomBuoi } from '../gio-hoc'
import { homNay, q, useMotLan, sb, taiAnhLen, urlAnh, type BuoiHoc, type DiemDanh as DD, type HocSinh, type Lop, type TaiKhoan } from '../supabase'

const LOAI = { lich: 'Theo lịch', phu: 'Buổi phụ', bu: 'Buổi bù' }

type ThemBuoi = { lop_id?: string; loai: 'phu' | 'bu'; bd: string; kt: string }

export default function DiemDanh() {
  const { message } = App.useApp()
  const [ngay, setNgay] = useState(homNay())
  const [lops, setLops] = useState<Lop[]>([])
  const [buois, setBuois] = useState<BuoiHoc[]>([])
  const [mo, setMo] = useState<BuoiHoc[] | null>(null)
  const [themBuoi, setThemBuoi] = useState<ThemBuoi | null>(null)

  const tai = async () => {
    await sb.rpc('sinh_buoi_thang', { thang: ngay })
    const [l, b] = await Promise.all([
      q(sb.from('lop').select('*').order('ten')),
      q(sb.from('buoi_hoc').select('*').eq('ngay', ngay)),
    ])
    setLops(l as Lop[]); setBuois(b as BuoiHoc[])
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [ngay])

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
  const [anh, setAnh] = useState<{ id: string; duong_dan: string }[]>([])
  const [url, setUrl] = useState<Record<string, string>>({})
  // null = chưa tải: thẻ học sinh chỉ dựng khi đã có, để mỗi thẻ tải đúng một lần. Tải hai lần (lần đầu với danh sách
  // rỗng) thì lần sau về muộn có thể ghi đè dấu "Học bù" vừa bấm, làm nút "Không đến" bấm không ăn.
  const [tatCaHs, setTatCaHs] = useState<HocSinh[] | null>(null)
  const [tatCaLan, setTatCaLan] = useState(0)
  const ids = buois.map((b) => b.id)
  const dangHoc = buois.filter((b) => !b.lop_nghi)

  const tai = async () => {
    const [tg, tgb, a, tatCa] = await Promise.all([
      q(sb.rpc('ds_tro_giang')),  // chỉ tên, không đơn giá: trợ giảng không xem được lương nhau
      q(sb.from('tro_giang_buoi').select('tro_giang_id').in('buoi_id', ids)),
      q(sb.from('anh_buoi').select('id, duong_dan').in('buoi_id', ids).order('tao_luc')),
      q(sb.from('hoc_sinh').select('*').eq('trang_thai', 'dang_hoc').order('ho_ten')),
    ])
    setTgs(tg as TaiKhoan[]); setTgCo([...new Set((tgb as { tro_giang_id: string }[]).map((x) => x.tro_giang_id))])
    // ảnh lớp gộp được chép sang từng buổi cùng tên file: chỉ hiện một lần
    const daCo = new Set<string>()
    const ds = (a as { id: string; duong_dan: string }[]).filter((x) => !daCo.has(tenFile(x.duong_dan)) && daCo.add(tenFile(x.duong_dan)))
    setAnh(ds); setTatCaHs(tatCa as HocSinh[])
    setUrl(await urlAnh(ds.map((x) => x.duong_dan)))
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [])

  const doiNghi = async (b: BuoiHoc, v: boolean) => {
    try { await q(sb.from('buoi_hoc').update({ lop_nghi: v }).eq('id', b.id)); setBuois(buois.map((x) => (x.id === b.id ? { ...x, lop_nghi: v } : x))) }
    catch (e) { message.error((e as Error).message) }
  }
  const lopCua = (b: BuoiHoc) => lops.find((l) => l.id === b.lop_id)!

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <Button onClick={quayLai}>← Quay lại</Button>
        <b>{buois.map((b) => lopCua(b).ten).join(' + ')} · {dayjs(buois[0].ngay).format('dddd DD/MM/YYYY')}{gioBuoi(buois[0]) && ` · ${gioBuoi(buois[0])}`}</b>
        {/* nhiều lớp: nút chung cho cả ca; một lớp thì nút nằm ở thẻ học sinh như trước */}
        {buois.length > 1 && dangHoc.some((b) => b.loai !== 'bu') && <Button onClick={() => setTatCaLan(tatCaLan + 1)}>Tất cả có mặt (cả ca)</Button>}
      </Space>

      {dangHoc.length > 0 && <Card size="small" title="Trợ giảng có mặt">
        <Checkbox.Group value={tgCo} options={tgs.map((t) => ({ value: t.id, label: t.ho_ten }))} onChange={async (v) => {
          const them = v.filter((x) => !tgCo.includes(x)), bot = tgCo.filter((x) => !v.includes(x))
          try {
            // ghi cho mọi lớp đang học trong ca; lương tính theo (ngày, giờ bắt đầu) nên lớp gộp vẫn chỉ 1 ca
            if (them.length) await q(sb.from('tro_giang_buoi').insert(dangHoc.flatMap((b) => them.map((id) => ({ buoi_id: b.id, tro_giang_id: id })))))
            if (bot.length) await q(sb.from('tro_giang_buoi').delete().in('buoi_id', ids).in('tro_giang_id', bot))
            setTgCo(v)
          } catch (e) { message.error((e as Error).message) }
        }} />
        {tgs.length === 0 && <i>Chưa có tài khoản trợ giảng</i>}
      </Card>}

      {tatCaHs && buois.map((b) => <DsHocSinh key={b.id} buoi={b} lop={lopCua(b)} tatCaHs={tatCaHs} tatCaLan={tatCaLan}
        nhieuLop={buois.length > 1} doiNghi={(v) => doiNghi(b, v)} />)}

      <Card size="small" title="Ảnh lớp (minh chứng)">
        <Image.PreviewGroup>
          {/* ảnh đã được workflow don-anh cất lên GitHub thì không còn file, không ký được link: ẩn thay vì hiện ảnh vỡ */}
          <Space wrap>{anh.filter((a) => url[a.duong_dan]).map((a) => <Image key={a.id} width={100} height={100} style={{ objectFit: 'cover' }} src={url[a.duong_dan]} />)}</Space>
        </Image.PreviewGroup>
        <Upload accept="image/*" multiple showUploadList={false} customRequest={async ({ file, onSuccess, onError }) => {
          try {
            const ten = `${crypto.randomUUID()}.jpg`
            const duong = await taiAnhLen(`buoi/${buois[0].id}/${ten}`, file as File)
            await q(sb.from('anh_buoi').insert({ buoi_id: buois[0].id, duong_dan: duong }))
            // ponytail: chép file sang từng buổi khác của ca thay vì cho nhiều dòng dùng chung một file: tốn gấp đôi
            // dung lượng cho ảnh lớp gộp, nhưng giữ nguyên anh_buoi.duong_dan unique, quyền xem ảnh của phụ huynh,
            // xoa_lop và workflow don-anh. Đổi sang dùng chung file nếu ảnh gộp làm đầy bộ nhớ.
            for (const b of buois.slice(1)) {
              await q(sb.storage.from('anh').copy(duong, `buoi/${b.id}/${ten}`))
              await q(sb.from('anh_buoi').insert({ buoi_id: b.id, duong_dan: `buoi/${b.id}/${ten}` }))
            }
            onSuccess?.(null); tai()
          } catch (e) { message.error((e as Error).message); onError?.(e as Error) }
        }}>
          <Button icon={<CameraOutlined />} style={{ marginTop: 8 }}>Chụp / chọn ảnh</Button>
        </Upload>
      </Card>
    </Space>
  )
}

function DsHocSinh({ buoi, lop, tatCaHs, tatCaLan, nhieuLop, doiNghi }: {
  buoi: BuoiHoc; lop: Lop; tatCaHs: HocSinh[]; tatCaLan: number; nhieuLop: boolean; doiNghi: (v: boolean) => void
}) {
  const { message } = App.useApp()
  const [hs, setHs] = useState<HocSinh[]>([])
  const [dd, setDd] = useState<Record<string, DD>>({})
  // sticker đã có + các buổi KHÁC; tổng hiện = số này + sticker buổi đang chấm. Không cộng dồn từng lần chấm vì
  // chấm trước khi số này tải xong sẽ cộng vào số 0 tạm thời (tổng sai).
  const [stickerKhac, setStickerKhac] = useState<Record<string, number>>({})
  const [url, setUrl] = useState<Record<string, string>>({})

  const tai = async () => {
    const [cuaLop, d] = await Promise.all([
      q(sb.from('hoc_sinh').select('*').eq('lop_id', lop.id).eq('trang_thai', 'dang_hoc').lte('ngay_vao', buoi.ngay).order('ho_ten')),
      q(sb.from('diem_danh').select('*').eq('buoi_id', buoi.id)),
    ])
    const ddMap = Object.fromEntries((d as DD[]).map((x) => [x.hoc_sinh_id, x]))
    // học sinh lớp khác sang học bù cũng hiện trong danh sách buổi này
    const ngoai = tatCaHs.filter((h) => ddMap[h.id] && h.lop_id !== lop.id)
    const ds = [...(cuaLop as HocSinh[]), ...ngoai]
    setHs(ds); setDd(ddMap)
    const ids = ds.map((h) => h.id)
    if (ids.length) {
      const st = await q(sb.from('diem_danh').select('hoc_sinh_id, sticker').in('hoc_sinh_id', ids).neq('buoi_id', buoi.id))
      const khac: Record<string, number> = Object.fromEntries(ds.map((h) => [h.id, h.sticker_dau_ky ?? 0]))
      for (const x of st as { hoc_sinh_id: string; sticker: number }[]) khac[x.hoc_sinh_id] = (khac[x.hoc_sinh_id] ?? 0) + x.sticker
      setStickerKhac(khac)
    }
    setUrl(await urlAnh(ds.map((h) => h.avatar!).filter(Boolean)))
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [])

  // đọc bản mới nhất qua ref: bấm "Vắng" rồi gõ sticker liền tay thì lần lưu sau vẫn thấy "Vắng", không ghi đè thành "Có mặt"
  const ddRef = useRef(dd)
  ddRef.current = dd
  // buổi bù riêng: có dòng điểm danh = đã học bù; không đến thì không có dòng nào (không sinh thêm buổi chưa bù)
  const buoiBu = buoi.loai === 'bu'
  const luu = async (hsId: string, thayDoi: Partial<DD>) => {
    const cu = ddRef.current[hsId] ?? { buoi_id: buoi.id, hoc_sinh_id: hsId, trang_thai: buoiBu ? 'hoc_bu' : 'co_mat', sticker: 0 }
    const moi = { ...cu, ...thayDoi } as DD
    ddRef.current = { ...ddRef.current, [hsId]: moi }
    setDd(ddRef.current)
    try {
      await q(sb.from('diem_danh').upsert(moi))
    } catch (e) { message.error((e as Error).message); tai() }
  }

  const boDiemDanh = async (hsId: string) => {
    const { [hsId]: _bo, ...con } = ddRef.current
    ddRef.current = con
    setDd(con)
    try { await q(sb.from('diem_danh').delete().eq('buoi_id', buoi.id).eq('hoc_sinh_id', hsId)) }
    catch (e) { message.error((e as Error).message); tai() }
  }

  const tatCaCoMat = () => Promise.all(hs.filter((h) => !ddRef.current[h.id]).map((h) =>
    q(sb.from('diem_danh').upsert({ buoi_id: buoi.id, hoc_sinh_id: h.id, trang_thai: 'co_mat', sticker: 0 })))).then(tai)
  // nút "Tất cả có mặt (cả ca)" ở đầu màn tăng tatCaLan
  useEffect(() => { if (tatCaLan && !buoi.lop_nghi && !buoiBu) tatCaCoMat().catch((e) => message.error(e.message)) }, [tatCaLan])

  const nghi = <span style={{ fontWeight: 'normal' }}>Lớp nghỉ <Switch size="small" checked={buoi.lop_nghi} onChange={doiNghi} /></span>
  if (buoi.lop_nghi) return <Card size="small" title={nhieuLop ? lop.ten : 'Lớp nghỉ'} extra={nghi} />

  // nhiều lớp trong ca: thẻ ghi tên lớp, nút "Tất cả có mặt" dùng nút chung ở đầu màn (điện thoại không đủ chỗ cho cả hai)
  const dem = `(${Object.values(dd).filter((x) => x.trang_thai !== 'vang').length}/${hs.length} ${buoiBu ? 'học bù' : 'có mặt'})`
  return (
    <Card size="small" title={nhieuLop ? `${lop.ten} ${dem}` : `Học sinh ${dem}`}
      extra={<Space>{nghi}{!buoiBu && !nhieuLop && <Button size="small" onClick={() => tatCaCoMat()}>Tất cả có mặt</Button>}</Space>}>
      {buoiBu && <p style={{ marginTop: 0, color: MAU.chuPhu, fontSize: 13 }}>Buổi bù riêng: em nào đến thì chọn "Học bù" (trừ 1 buổi chưa bù). Em không đến thì để "Không đến", không bị tính thêm buổi chưa bù.</p>}
      <List dataSource={hs} renderItem={(h) => {
        const x = dd[h.id]
        const laBu = h.lop_id !== lop.id
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
                <Radio.Group optionType="button" buttonStyle="solid" value={x?.trang_thai ?? ''}
                  onChange={(e) => luu(h.id, { trang_thai: e.target.value as DD['trang_thai'] })}
                  options={laBu ? [{ value: 'hoc_bu', label: 'Học bù' }, { value: 'vang', label: 'Vắng' }]
                    : [{ value: 'co_mat', label: 'Có mặt' }, { value: 'vang', label: 'Vắng' }]} />
              )}
              <InputNumber addonBefore="⭐" style={{ width: 110 }} value={x?.sticker ?? 0}
                onChange={(v) => v !== null && luu(h.id, { sticker: v })} />
            </Space>
          </List.Item>
        )
      }} />
      <Select showSearch optionFilterProp="label" placeholder="+ Thêm học sinh lớp khác học bù buổi này" style={{ width: '100%', marginTop: 8 }}
        value={null} options={tatCaHs.filter((h) => !hs.some((x) => x.id === h.id)).map((h) => ({ value: h.id, label: h.ho_ten }))}
        onChange={async (id) => {
          try { await q(sb.from('diem_danh').insert({ buoi_id: buoi.id, hoc_sinh_id: id, trang_thai: 'hoc_bu' })); tai() }
          catch (e) { message.error((e as Error).message) }
        }} />
    </Card>
  )
}

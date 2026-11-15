import { useEffect, useState } from 'react'
import { App, Avatar, Button, Card, Checkbox, DatePicker, Empty, Image, InputNumber, List, Modal, Segmented, Select, Space, Switch, Tag, Upload } from 'antd'
import { CameraOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { MAU } from '../giao-dien'
import { homNay, q, sb, taiAnhLen, urlAnh, type BuoiHoc, type DiemDanh as DD, type HocSinh, type Lop, type TaiKhoan } from '../supabase'

const LOAI = { lich: 'Theo lịch', phu: 'Buổi phụ', bu: 'Buổi bù' }

export default function DiemDanh() {
  const { message } = App.useApp()
  const [ngay, setNgay] = useState(homNay())
  const [lops, setLops] = useState<Lop[]>([])
  const [buois, setBuois] = useState<BuoiHoc[]>([])
  const [mo, setMo] = useState<BuoiHoc | null>(null)
  const [themBuoi, setThemBuoi] = useState<{ lop_id?: string; loai: 'phu' | 'bu' } | null>(null)

  const tai = async () => {
    await sb.rpc('sinh_buoi_thang', { thang: ngay })
    const [l, b] = await Promise.all([
      q(sb.from('lop').select('*').order('ten')),
      q(sb.from('buoi_hoc').select('*').eq('ngay', ngay)),
    ])
    setLops(l as Lop[]); setBuois(b as BuoiHoc[])
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [ngay])

  const tenLop = (id: string) => lops.find((l) => l.id === id)?.ten ?? ''
  if (mo) return <BuoiChiTiet buoi={mo} lop={lops.find((l) => l.id === mo.lop_id)!} quayLai={() => { setMo(null); tai() }} />

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <DatePicker value={dayjs(ngay)} onChange={(d) => d && setNgay(d.format('YYYY-MM-DD'))} format="dddd DD/MM/YYYY" allowClear={false} />
        <Button icon={<PlusOutlined />} onClick={() => setThemBuoi({ loai: 'phu' })}>Thêm buổi phụ / bù</Button>
      </Space>
      {buois.length === 0 ? <Empty description="Hôm nay không có buổi học nào theo lịch" /> : (
        <List bordered dataSource={buois} renderItem={(b) => (
          <List.Item onClick={() => setMo(b)} style={{ cursor: 'pointer' }}
            extra={b.lop_nghi ? <Tag color="red">Lớp nghỉ</Tag> : <Button type="primary">Điểm danh</Button>}>
            <List.Item.Meta title={tenLop(b.lop_id)} description={LOAI[b.loai]} />
          </List.Item>
        )} />
      )}
      <Modal open={!!themBuoi} title="Thêm buổi" onCancel={() => setThemBuoi(null)} onOk={async () => {
        try {
          await q(sb.from('buoi_hoc').insert({ lop_id: themBuoi!.lop_id, ngay, loai: themBuoi!.loai }))
          setThemBuoi(null); tai()
        } catch (e) { message.error((e as Error).message) }
      }} okButtonProps={{ disabled: !themBuoi?.lop_id }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Segmented value={themBuoi?.loai} onChange={(v) => setThemBuoi({ ...themBuoi!, loai: v as 'phu' | 'bu' })}
            options={[{ value: 'phu', label: 'Buổi phụ (bù cho lớp nghỉ)' }, { value: 'bu', label: 'Buổi bù riêng' }]} />
          <Select placeholder="Lớp" style={{ width: '100%' }} value={themBuoi?.lop_id}
            onChange={(v) => setThemBuoi({ ...themBuoi!, lop_id: v })} options={lops.map((l) => ({ value: l.id, label: l.ten }))} />
        </Space>
      </Modal>
    </Space>
  )
}

function BuoiChiTiet({ buoi: b0, lop, quayLai }: { buoi: BuoiHoc; lop: Lop; quayLai: () => void }) {
  const { message } = App.useApp()
  const [buoi, setBuoi] = useState(b0)
  const [hs, setHs] = useState<HocSinh[]>([])
  const [dd, setDd] = useState<Record<string, DD>>({})
  const [stickerTong, setStickerTong] = useState<Record<string, number>>({})
  const [tgs, setTgs] = useState<TaiKhoan[]>([])
  const [tgCo, setTgCo] = useState<string[]>([])
  const [anh, setAnh] = useState<{ id: string; duong_dan: string }[]>([])
  const [url, setUrl] = useState<Record<string, string>>({})
  const [tatCaHs, setTatCaHs] = useState<HocSinh[]>([])

  const tai = async () => {
    const [cuaLop, d, tg, tgb, a, tatCa] = await Promise.all([
      q(sb.from('hoc_sinh').select('*').eq('lop_id', lop.id).eq('trang_thai', 'dang_hoc').lte('ngay_vao', buoi.ngay).order('ho_ten')),
      q(sb.from('diem_danh').select('*').eq('buoi_id', buoi.id)),
      q(sb.rpc('ds_tro_giang')),  // chỉ tên, không đơn giá: trợ giảng không xem được lương nhau
      q(sb.from('tro_giang_buoi').select('tro_giang_id').eq('buoi_id', buoi.id)),
      q(sb.from('anh_buoi').select('id, duong_dan').eq('buoi_id', buoi.id).order('tao_luc')),
      q(sb.from('hoc_sinh').select('*').eq('trang_thai', 'dang_hoc').order('ho_ten')),
    ])
    const ddMap = Object.fromEntries((d as DD[]).map((x) => [x.hoc_sinh_id, x]))
    // học sinh lớp khác sang học bù cũng hiện trong danh sách buổi này
    const ngoai = (tatCa as HocSinh[]).filter((h) => ddMap[h.id] && h.lop_id !== lop.id)
    const ds = [...(cuaLop as HocSinh[]), ...ngoai]
    setHs(ds); setDd(ddMap); setTatCaHs(tatCa as HocSinh[])
    setTgs(tg as TaiKhoan[]); setTgCo((tgb as { tro_giang_id: string }[]).map((x) => x.tro_giang_id))
    setAnh(a as { id: string; duong_dan: string }[])
    const ids = ds.map((h) => h.id)
    if (ids.length) {
      const st = await q(sb.from('diem_danh').select('hoc_sinh_id, sticker').in('hoc_sinh_id', ids))
      const tong: Record<string, number> = Object.fromEntries(ds.map((h) => [h.id, h.sticker_dau_ky ?? 0]))
      for (const x of st as { hoc_sinh_id: string; sticker: number }[]) tong[x.hoc_sinh_id] = (tong[x.hoc_sinh_id] ?? 0) + x.sticker
      setStickerTong(tong)
    }
    setUrl(await urlAnh([...ds.map((h) => h.avatar!).filter(Boolean), ...(a as { duong_dan: string }[]).map((x) => x.duong_dan)]))
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [])

  const luu = async (hsId: string, thayDoi: Partial<DD>) => {
    const cu = dd[hsId] ?? { buoi_id: buoi.id, hoc_sinh_id: hsId, trang_thai: 'co_mat', sticker: 0 }
    const moi = { ...cu, ...thayDoi } as DD
    setDd({ ...dd, [hsId]: moi })
    try {
      await q(sb.from('diem_danh').upsert(moi))
      if (thayDoi.sticker !== undefined) setStickerTong({ ...stickerTong, [hsId]: (stickerTong[hsId] ?? 0) + moi.sticker - cu.sticker })
    } catch (e) { message.error((e as Error).message); tai() }
  }

  const daLuu = (hsId: string) => !!dd[hsId]

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <Button onClick={quayLai}>← Quay lại</Button>
        <b>{lop.ten} · {dayjs(buoi.ngay).format('dddd DD/MM/YYYY')}</b>
        <span>Lớp nghỉ <Switch checked={buoi.lop_nghi} onChange={async (v) => {
          try { await q(sb.from('buoi_hoc').update({ lop_nghi: v }).eq('id', buoi.id)); setBuoi({ ...buoi, lop_nghi: v }) }
          catch (e) { message.error((e as Error).message) }
        }} /></span>
      </Space>

      {!buoi.lop_nghi && <>
        <Card size="small" title="Trợ giảng có mặt">
          <Checkbox.Group value={tgCo} options={tgs.map((t) => ({ value: t.id, label: t.ho_ten }))} onChange={async (v) => {
            const them = v.filter((x) => !tgCo.includes(x)), bot = tgCo.filter((x) => !v.includes(x))
            try {
              if (them.length) await q(sb.from('tro_giang_buoi').insert(them.map((id) => ({ buoi_id: buoi.id, tro_giang_id: id }))))
              if (bot.length) await q(sb.from('tro_giang_buoi').delete().eq('buoi_id', buoi.id).in('tro_giang_id', bot))
              setTgCo(v)
            } catch (e) { message.error((e as Error).message) }
          }} />
          {tgs.length === 0 && <i>Chưa có tài khoản trợ giảng</i>}
        </Card>

        <Card size="small" title={`Học sinh (${Object.values(dd).filter((x) => x.trang_thai !== 'vang').length}/${hs.length} có mặt)`}
          extra={<Button size="small" onClick={() => Promise.all(hs.filter((h) => !daLuu(h.id)).map((h) =>
            q(sb.from('diem_danh').upsert({ buoi_id: buoi.id, hoc_sinh_id: h.id, trang_thai: 'co_mat', sticker: 0 })))).then(tai)}>
            Tất cả có mặt</Button>}>
          <List dataSource={hs} renderItem={(h) => {
            const x = dd[h.id]
            const laBu = h.lop_id !== lop.id
            return (
              <List.Item style={{ flexWrap: 'wrap', gap: 8, background: x ? undefined : MAU.vang }}>
                <Space>
                  <Avatar shape="square" size={56} src={h.avatar && url[h.avatar]}>{h.ho_ten.split(' ').pop()?.[0]}</Avatar>
                  <div><b>{h.ho_ten}</b><br /><small>⭐ {stickerTong[h.id] ?? 0} sticker{laBu && ' · học bù'}</small></div>
                </Space>
                <Space wrap>
                  <Segmented value={x?.trang_thai} onChange={(v) => luu(h.id, { trang_thai: v as DD['trang_thai'] })}
                    options={laBu ? [{ value: 'hoc_bu', label: 'Học bù' }, { value: 'vang', label: 'Vắng' }]
                      : [{ value: 'co_mat', label: 'Có mặt' }, { value: 'vang', label: 'Vắng' }]} />
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
      </>}

      <Card size="small" title="Ảnh lớp (minh chứng)">
        <Image.PreviewGroup>
          <Space wrap>{anh.map((a) => <Image key={a.id} width={100} height={100} style={{ objectFit: 'cover' }} src={url[a.duong_dan]} />)}</Space>
        </Image.PreviewGroup>
        <Upload accept="image/*" multiple showUploadList={false} customRequest={async ({ file, onSuccess, onError }) => {
          try {
            const duong = await taiAnhLen(`buoi/${buoi.id}/${crypto.randomUUID()}.jpg`, file as File)
            await q(sb.from('anh_buoi').insert({ buoi_id: buoi.id, duong_dan: duong }))
            onSuccess?.(null); tai()
          } catch (e) { message.error((e as Error).message); onError?.(e as Error) }
        }}>
          <Button icon={<CameraOutlined />} style={{ marginTop: 8 }}>Chụp / chọn ảnh</Button>
        </Upload>
      </Card>
    </Space>
  )
}

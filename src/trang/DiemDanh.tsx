import { useEffect, useRef, useState } from 'react'
import { App, Avatar, Button, Card, Checkbox, DatePicker, Empty, Image, InputNumber, List, Modal, Segmented, Select, Space, Switch, Tag, Upload } from 'antd'
import { CameraOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { MAU } from '../giao-dien'
import { useToi } from '../App'
import { homNay, laQuanLy, q, useMotLan, sb, taiAnhLen, urlAnh, type BuoiHoc, type DiemDanh as DD, type HocSinh, type Lop, type TaiKhoan } from '../supabase'

const LOAI = { lich: 'Theo lịch', phu: 'Buổi phụ', bu: 'Buổi bù' }

export default function DiemDanh() {
  const { message } = App.useApp()
  const ql = laQuanLy(useToi().vai_tro)
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

  const [luuBuoi, dangLuuBuoi] = useMotLan(async () => {
    try {
      await q(sb.from('buoi_hoc').insert({ lop_id: themBuoi!.lop_id, ngay, loai: themBuoi!.loai }))
      setThemBuoi(null); tai()
    } catch (e) { message.error((e as Error).message) }
  })
  const tenLop = (id: string) => lops.find((l) => l.id === id)?.ten ?? ''
  if (mo) return <BuoiChiTiet buoi={mo} lop={lops.find((l) => l.id === mo.lop_id)!} quayLai={() => { setMo(null); tai() }} />

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <DatePicker value={dayjs(ngay)} onChange={(d) => d && setNgay(d.format('YYYY-MM-DD'))} format="dddd DD/MM/YYYY" allowClear={false} />
        {ql && <Button icon={<PlusOutlined />} onClick={() => setThemBuoi({ loai: 'phu' })}>Thêm buổi phụ / bù</Button>}
      </Space>
      {buois.length === 0 ? <Empty description="Hôm nay không có buổi học nào theo lịch" /> : (
        <List bordered dataSource={buois} renderItem={(b) => (
          <List.Item onClick={() => setMo(b)} style={{ cursor: 'pointer' }}
            extra={b.lop_nghi ? <Tag color="red">Lớp nghỉ</Tag> : <Button type="primary">Điểm danh</Button>}>
            <List.Item.Meta title={tenLop(b.lop_id)} description={LOAI[b.loai]} />
          </List.Item>
        )} />
      )}
      <Modal open={!!themBuoi} title="Thêm buổi" onCancel={() => setThemBuoi(null)} onOk={() => luuBuoi()} confirmLoading={dangLuuBuoi}
        okButtonProps={{ disabled: !themBuoi?.lop_id }}>
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
  const ql = laQuanLy(useToi().vai_tro)
  const [buoi, setBuoi] = useState(b0)
  const [hs, setHs] = useState<HocSinh[]>([])
  const [dd, setDd] = useState<Record<string, DD>>({})
  // sticker đã có + các buổi KHÁC; tổng hiện = số này + sticker buổi đang chấm. Không cộng dồn từng lần chấm vì
  // chấm trước khi số này tải xong sẽ cộng vào số 0 tạm thời (tổng sai).
  const [stickerKhac, setStickerKhac] = useState<Record<string, number>>({})
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
      const st = await q(sb.from('diem_danh').select('hoc_sinh_id, sticker').in('hoc_sinh_id', ids).neq('buoi_id', buoi.id))
      const khac: Record<string, number> = Object.fromEntries(ds.map((h) => [h.id, h.sticker_dau_ky ?? 0]))
      for (const x of st as { hoc_sinh_id: string; sticker: number }[]) khac[x.hoc_sinh_id] = (khac[x.hoc_sinh_id] ?? 0) + x.sticker
      setStickerKhac(khac)
    }
    setUrl(await urlAnh([...ds.map((h) => h.avatar!).filter(Boolean), ...(a as { duong_dan: string }[]).map((x) => x.duong_dan)]))
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

  const daLuu = (hsId: string) => !!dd[hsId]

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <Button onClick={quayLai}>← Quay lại</Button>
        <b>{lop.ten} · {dayjs(buoi.ngay).format('dddd DD/MM/YYYY')}</b>
        {/* chỉ giáo viên: buổi lớp nghỉ sinh tiền dư (database cũng chặn trợ giảng) */}
        {ql && <span>Lớp nghỉ <Switch checked={buoi.lop_nghi} onChange={async (v) => {
          try { await q(sb.from('buoi_hoc').update({ lop_nghi: v }).eq('id', buoi.id)); setBuoi({ ...buoi, lop_nghi: v }) }
          catch (e) { message.error((e as Error).message) }
        }} /></span>}
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

        <Card size="small" title={`Học sinh (${Object.values(dd).filter((x) => x.trang_thai !== 'vang').length}/${hs.length} ${buoiBu ? 'học bù' : 'có mặt'})`}
          extra={!buoiBu && <Button size="small" onClick={() => Promise.all(hs.filter((h) => !daLuu(h.id)).map((h) =>
            q(sb.from('diem_danh').upsert({ buoi_id: buoi.id, hoc_sinh_id: h.id, trang_thai: 'co_mat', sticker: 0 })))).then(tai)}>
            Tất cả có mặt</Button>}>
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
                    <Segmented value={x?.trang_thai} onChange={(v) => luu(h.id, { trang_thai: v as DD['trang_thai'] })}
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

// Tóm tắt phiếu đánh giá của một lớp trong một tháng bằng Gemini (docs/YEU-CAU.md mục "Đánh giá từ học sinh").
// Key Gemini chỉ nằm ở secret của Supabase, không lộ ra trình duyệt. Chỉ giáo viên gọi được.
// Gói free của Gemini có thể dùng dữ liệu để huấn luyện, nên trợ giảng đổi thành mã TG1, TG2… và không gửi tên học sinh.
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const tra = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const dsChu = { type: 'ARRAY', items: { type: 'STRING' } }
const SCHEMA = {
  type: 'OBJECT',
  properties: {
    khoa_hoc: { type: 'OBJECT', properties: { y_chinh: dsChu, kho_khan: dsChu, de_xuat: dsChu }, required: ['y_chinh', 'kho_khan', 'de_xuat'] },
    tro_giang: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { ma: { type: 'STRING' }, diem_manh: dsChu, can_cai_thien: dsChu }, required: ['ma', 'diem_manh', 'can_cai_thien'] },
    },
  },
  required: ['khoa_hoc', 'tro_giang'],
}

const HUONG_DAN = `Bạn giúp giáo viên một trung tâm tiếng Anh đọc phiếu đánh giá cuối tháng của học sinh một lớp.
Dữ liệu là danh sách phiếu (JSON). Mỗi phiếu có: khoa_hoc (nhận xét chung về khoá học), kho_khan (khó khăn khi học),
tro_giang (các trợ giảng em đó chấm, gọi bằng mã TG1, TG2…; điểm 1–5: kien_thuc = kiến thức chuyên môn,
tuong_tac = tương tác và điều phối lớp, ho_tro = hỗ trợ ngoài giờ; nhan_xet = nhận xét riêng; chua_bai = góp ý về chữa bài tập).
Viết tiếng Việt, mỗi ý một câu ngắn. Chỉ dựa vào dữ liệu, không bịa. Ý nào nhiều em cùng nêu thì ghi rõ (ví dụ "3 em").
Bỏ qua câu trả lời vô nghĩa như "không", "ko có". Mục nào không có dữ liệu thì để mảng rỗng.
khoa_hoc.y_chinh: nhận xét chính về khoá học; khoa_hoc.kho_khan: khó khăn học sinh gặp; khoa_hoc.de_xuat: việc cụ thể trung tâm nên làm, rút ra từ mong muốn và khó khăn
học sinh nêu (ví dụ em kêu nghe khó thì đề xuất thêm bài luyện nghe chậm).
tro_giang: mỗi mã một mục, diem_manh và can_cai_thien dựa vào cả điểm (điểm thấp là cần cải thiện) và nhận xét.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const jwt = req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
  const { data: u } = await sb.auth.getUser(jwt)
  if (!u.user) return tra({ loi: 'Chưa đăng nhập' }, 401)
  const { data: toi } = await sb.from('tai_khoan').select('vai_tro, hoat_dong').eq('id', u.user.id).single()
  if (!toi?.hoat_dong || !['admin', 'giao_vien'].includes(toi.vai_tro)) return tra({ loi: 'Chỉ giáo viên được tóm tắt' }, 403)

  let thang, lop_id
  try { ({ thang, lop_id } = await req.json()) } catch { return tra({ loi: 'Dữ liệu gửi lên không hợp lệ' }, 400) }
  if (!/^\d{4}-\d{2}$/.test(thang ?? '') || !lop_id) return tra({ loi: 'Thiếu tháng hoặc lớp' }, 400)
  const { data: phieus, error } = await sb.from('danh_gia').select('khoa_hoc, kho_khan, tro_giang').eq('thang', `${thang}-01`).eq('lop_id', lop_id)
  if (error) return tra({ loi: error.message }, 400)
  if (!phieus.length) return tra({ loi: 'Lớp chưa có phiếu' }, 400)

  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) return tra({ loi: 'Chưa cài GEMINI_API_KEY' }, 500)

  // id trợ giảng → mã; tên thật giữ lại ở đây để đổi ngược khi nhận kết quả
  const ma = new Map<string, { ma: string; ten: string }>()
  const anDanh = phieus.map((p) => ({
    khoa_hoc: p.khoa_hoc, kho_khan: p.kho_khan,
    tro_giang: (p.tro_giang as { id: string; ten: string; kien_thuc: number; tuong_tac: number; ho_tro: number; nhan_xet: string | null; chua_bai: string | null }[]).map((t) => {
      if (!ma.has(t.id)) ma.set(t.id, { ma: `TG${ma.size + 1}`, ten: t.ten })
      return { ma: ma.get(t.id)!.ma, kien_thuc: t.kien_thuc, tuong_tac: t.tuong_tac, ho_tro: t.ho_tro, nhan_xet: t.nhan_xet, chua_bai: t.chua_bai }
    }),
  }))

  // alias "-latest" luôn trỏ bản mới nhất nên Google đổi model không phải sửa code. Flash hay báo 503 quá tải lúc
  // đông người dùng (gặp ngày 18/11), khi đó và khi model không còn (404) thì thử sang Flash-Lite.
  const models = [Deno.env.get('GEMINI_MODEL') || 'gemini-flash-latest', 'gemini-flash-lite-latest']
  // Edge Function bị cắt ở 150 giây (gặp ngày 18/11 khi Gemini treo), nên mỗi model chỉ chờ 55 giây
  let r = new Response(null, { status: 503 }), kq: any
  const vet: string[] = []
  for (const model of models) {
    const t0 = Date.now()
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        signal: AbortSignal.timeout(55_000),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: HUONG_DAN }] },
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(anDanh) }] }],
          generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA, temperature: 0.2 },
        }),
      })
      kq = await r.json().catch(() => null)
    } catch {
      r = new Response(null, { status: 503 }) // hết giờ chờ: coi như quá tải, thử model sau
    }
    vet.push(`${model} ${r.status} ${((Date.now() - t0) / 1000).toFixed(0)}s`)
    if (r.status !== 503 && r.status !== 404) break
  }
  console.log(vet.join(' | '))
  if (r.status === 429) return tra({ loi: 'Gemini đang hết lượt miễn phí, thử lại sau ít phút' }, 429)
  if (r.status === 503) return tra({ loi: 'Gemini đang quá tải, thử lại sau ít phút' }, 503)
  if (!r.ok) return tra({ loi: `Gemini báo lỗi: ${kq?.error?.message ?? r.status}` }, 502)
  const chu: string | undefined = kq?.candidates?.[0]?.content?.parts?.map((x: { text?: string }) => x.text ?? '').join('')
  if (!chu) return tra({ loi: 'Gemini không trả lời, thử lại sau' }, 502)

  // đổi mã về tên thật, kể cả chỗ "TG1" nằm trong câu; TG10 thay trước TG1 để không ăn nhầm
  // thay trên chuỗi JSON nên tên phải escape (tên có " hoặc \ làm vỡ JSON)
  const doiTen = (s: string) => [...ma.values()].sort((a, b) => b.ma.length - a.ma.length)
    .reduce((x, m) => x.replaceAll(m.ma, JSON.stringify(m.ten).slice(1, -1)), s)
  let noiDung
  try {
    const x = JSON.parse(chu)
    noiDung = JSON.parse(doiTen(JSON.stringify(x)))
    // giữ lại mã gốc để sắp đúng thứ tự, tên lấy từ phiếu chứ không tin chữ AI viết lại
    noiDung.tro_giang = (x.tro_giang ?? []).map((t: { ma: string }, i: number) => ({
      ...noiDung.tro_giang[i], ten: [...ma.values()].find((m) => m.ma === t.ma)?.ten ?? t.ma,
    }))
  } catch {
    return tra({ loi: 'Gemini trả về sai định dạng, thử lại' }, 502)
  }

  const dong = { thang: `${thang}-01`, lop_id, noi_dung: noiDung, so_phieu: phieus.length, tao_luc: new Date().toISOString() }
  const { error: e2 } = await sb.from('tom_tat_danh_gia').upsert(dong)
  if (e2) return tra({ loi: e2.message }, 400)
  return tra(dong)
})

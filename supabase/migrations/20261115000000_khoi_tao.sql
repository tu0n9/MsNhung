-- Khởi tạo toàn bộ schema. Quyết định nghiệp vụ ở docs/YEU-CAU.md.
-- Tiền là số nguyên VND. Phân quyền nằm ở RLS vì trình duyệt gọi thẳng database.

-- ============ Tài khoản ============
create table tai_khoan (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,             -- email nội bộ, chỉ để Supabase Auth đăng nhập
  ten_dang_nhap text unique,
  so_dien_thoai text unique,
  ho_ten text not null,
  vai_tro text not null check (vai_tro in ('admin', 'giao_vien', 'tro_giang', 'phu_huynh')),
  phai_doi_mat_khau boolean not null default true,
  don_gia_buoi integer not null default 0 check (don_gia_buoi >= 0),  -- chỉ dùng cho trợ giảng
  hoat_dong boolean not null default true,
  check (ten_dang_nhap is not null or so_dien_thoai is not null)
);

-- security definer để policy của các bảng khác đọc được vai trò mà không vướng RLS của tai_khoan
create function vai_tro() returns text language sql stable security definer set search_path = public as $$
  select vai_tro from tai_khoan where id = auth.uid() and hoat_dong
$$;
create function la_quan_ly() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(vai_tro() in ('admin', 'giao_vien'), false)
$$;
create function la_nhan_vien() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(vai_tro() in ('admin', 'giao_vien', 'tro_giang'), false)
$$;

-- Supabase Auth chỉ đăng nhập bằng email; hàm này đổi tên đăng nhập hoặc số điện thoại ra email nội bộ.
create function email_dang_nhap(dinh_danh text) returns text language sql stable security definer set search_path = public as $$
  select email from tai_khoan
  where hoat_dong
    and (ten_dang_nhap = lower(trim(dinh_danh))
         or so_dien_thoai = nullif(regexp_replace(dinh_danh, '\D', '', 'g'), ''))
  limit 1
$$;

create function da_doi_mat_khau() returns void language sql security definer set search_path = public as $$
  update tai_khoan set phai_doi_mat_khau = false where id = auth.uid()
$$;

-- ============ Lớp, học sinh, buổi học ============
create table lop (
  id uuid primary key default gen_random_uuid(),
  ten text not null,
  don_gia integer not null check (don_gia >= 0),
  lich smallint[] not null default '{}',  -- thứ trong tuần theo getDay() của JS: 0 = Chủ nhật
  hoat_dong boolean not null default true,
  tao_luc timestamptz not null default now()
);

create table hoc_sinh (
  id uuid primary key default gen_random_uuid(),
  ho_ten text not null,
  lop_id uuid not null references lop,
  avatar text,                              -- đường dẫn trong bucket 'anh'
  ten_phu_huynh text,
  sdt_phu_huynh text,
  phu_huynh_id uuid references tai_khoan on delete set null,
  ngay_vao date not null default current_date,
  don_gia_rieng integer check (don_gia_rieng >= 0),
  trang_thai text not null default 'dang_hoc' check (trang_thai in ('dang_hoc', 'ngung')),
  ghi_chu text,
  tao_luc timestamptz not null default now()
);

create table buoi_hoc (
  id uuid primary key default gen_random_uuid(),
  lop_id uuid not null references lop,
  ngay date not null,
  loai text not null default 'lich' check (loai in ('lich', 'phu', 'bu')),
  lop_nghi boolean not null default false,
  ghi_chu text
);
create unique index buoi_hoc_lich_duy_nhat on buoi_hoc (lop_id, ngay) where loai = 'lich';

-- Khoá ngoại để mặc định (restrict): xoá buổi hay học sinh đã có điểm danh sẽ bị từ chối, sổ cũ không bị sai.
create table diem_danh (
  buoi_id uuid not null references buoi_hoc,
  hoc_sinh_id uuid not null references hoc_sinh,
  trang_thai text not null check (trang_thai in ('co_mat', 'vang', 'hoc_bu')),
  sticker integer not null default 0,
  primary key (buoi_id, hoc_sinh_id)
);

create table tro_giang_buoi (
  buoi_id uuid not null references buoi_hoc,
  tro_giang_id uuid not null references tai_khoan,
  don_gia integer not null default 0,  -- chốt giá lúc điểm danh để đổi đơn giá sau này không làm sai tháng cũ
  primary key (buoi_id, tro_giang_id)
);

create function trg_gia_tro_giang() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.don_gia := (select don_gia_buoi from tai_khoan where id = new.tro_giang_id);
  return new;
end $$;
create trigger gia_tro_giang before insert on tro_giang_buoi for each row execute function trg_gia_tro_giang();

create table anh_buoi (
  id uuid primary key default gen_random_uuid(),
  buoi_id uuid not null references buoi_hoc,
  duong_dan text not null unique,
  tao_luc timestamptz not null default now()
);

-- ============ Tiền ============
create table goi_hoc (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh,
  thang_bat_dau date not null check (extract(day from thang_bat_dau) = 1),
  so_thang smallint not null check (so_thang between 1 and 3),
  don_gia integer not null check (don_gia >= 0),          -- chốt lúc đóng gói
  buoi_du_kien jsonb not null,                             -- {"2026-04": 12, "2026-05": 13, ...}
  tien_du_tru integer not null default 0 check (tien_du_tru >= 0),  -- tiền dư của gói trước trừ vào gói này
  dieu_chinh integer not null default 0,
  ly_do_dieu_chinh text,
  tao_luc timestamptz not null default now()
);

create table phieu_thu (
  id uuid primary key default gen_random_uuid(),
  goi_id uuid not null references goi_hoc,
  so_tien integer not null check (so_tien > 0),
  ngay_thu date not null default current_date,
  hinh_thuc text not null check (hinh_thuc in ('tien_mat', 'chuyen_khoan')),
  ghi_chu text,
  nguoi_thu uuid default auth.uid() references tai_khoan,
  tao_luc timestamptz not null default now()
);

create table chi_phi (
  id uuid primary key default gen_random_uuid(),
  ngay date not null default current_date,
  danh_muc text not null,
  so_tien integer not null check (so_tien > 0),
  ghi_chu text,
  hoc_sinh_id uuid references hoc_sinh  -- khi là khoản hoàn học phí
);

-- ============ Chốt sổ ============
-- Chốt tháng M khoá mọi thứ đến hết tháng M. Khoá theo mốc thay vì từng tháng vì nợ kỳ trước của tháng sau
-- tính từ mọi tháng trước đó: để một tháng cũ còn mở thì tháng đã chốt vẫn đổi số.
create table khoa_so (
  id boolean primary key default true check (id),
  khoa_den date  -- ngày 1 của tháng cuối đã chốt; null = chưa chốt tháng nào
);
insert into khoa_so default values;

create table nhat_ky_chot_so (
  id bigint generated always as identity primary key,
  thang date not null,
  hanh_dong text not null check (hanh_dong in ('chot', 'mo_khoa')),
  ly_do text,
  nguoi uuid default auth.uid(),
  luc timestamptz not null default now()
);

create function ngay_cua(bang text, r jsonb) returns date language sql stable security definer set search_path = public as $$
  select case bang
    when 'buoi_hoc' then (r->>'ngay')::date
    when 'chi_phi' then (r->>'ngay')::date
    when 'phieu_thu' then (r->>'ngay_thu')::date
    when 'goi_hoc' then (r->>'thang_bat_dau')::date
    else (select ngay from buoi_hoc where id = (r->>'buoi_id')::uuid)
  end
$$;

create function kiem_tra_khoa(ngay date) returns void language plpgsql stable security definer set search_path = public as $$
declare k date;
begin
  select khoa_den into k from khoa_so;
  if k is not null and ngay < k + interval '1 month' then
    raise exception 'Tháng %/% đã chốt sổ, không sửa được', extract(month from ngay), extract(year from ngay);
  end if;
end $$;

create function trg_khoa_so() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op <> 'INSERT' then perform kiem_tra_khoa(ngay_cua(tg_table_name, to_jsonb(old))); end if;
  if tg_op <> 'DELETE' then perform kiem_tra_khoa(ngay_cua(tg_table_name, to_jsonb(new))); end if;
  return coalesce(new, old);
end $$;

create trigger khoa_so before insert or update or delete on buoi_hoc for each row execute function trg_khoa_so();
create trigger khoa_so before insert or update or delete on diem_danh for each row execute function trg_khoa_so();
create trigger khoa_so before insert or update or delete on tro_giang_buoi for each row execute function trg_khoa_so();
create trigger khoa_so before insert or update or delete on anh_buoi for each row execute function trg_khoa_so();
create trigger khoa_so before insert or update or delete on goi_hoc for each row execute function trg_khoa_so();
create trigger khoa_so before insert or update or delete on phieu_thu for each row execute function trg_khoa_so();
create trigger khoa_so before insert or update or delete on chi_phi for each row execute function trg_khoa_so();

create function chot_so(thang date) returns void language plpgsql security definer set search_path = public as $$
begin
  if not la_quan_ly() then raise exception 'Chỉ giáo viên được chốt sổ'; end if;
  update khoa_so set khoa_den = greatest(khoa_den, date_trunc('month', thang)::date);
  insert into nhat_ky_chot_so (thang, hanh_dong) values (date_trunc('month', thang), 'chot');
end $$;

create function mo_khoa(thang date, ly_do text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not la_quan_ly() then raise exception 'Chỉ giáo viên được mở khoá'; end if;
  if coalesce(trim(ly_do), '') = '' then raise exception 'Phải ghi lý do mở khoá'; end if;
  -- mở tháng M thì các tháng sau M cũng mở, vì chúng phụ thuộc số liệu của M
  -- least() bỏ qua null, nên phải giữ null tường minh khi chưa chốt tháng nào
  update khoa_so set khoa_den = case when khoa_den is null then null
    else least(khoa_den, (date_trunc('month', thang) - interval '1 month')::date) end;
  insert into nhat_ky_chot_so (thang, hanh_dong, ly_do) values (date_trunc('month', thang), 'mo_khoa', ly_do);
end $$;

-- Sinh các buổi theo lịch tuần của tháng; gọi mỗi lần mở tháng, chạy lại không tạo trùng.
create function sinh_buoi_thang(thang date) returns void language plpgsql security invoker set search_path = public as $$
declare k date;
begin
  select khoa_den into k from khoa_so;
  if k is not null and date_trunc('month', thang)::date <= k then return; end if;
  insert into buoi_hoc (lop_id, ngay, loai)
  select l.id, d::date, 'lich'
  from lop l
  cross join generate_series(date_trunc('month', thang), date_trunc('month', thang) + interval '1 month - 1 day', interval '1 day') d
  where l.hoat_dong and extract(dow from d)::smallint = any (l.lich)
  on conflict (lop_id, ngay) where loai = 'lich' do nothing;
end $$;

-- ============ RLS ============
alter table tai_khoan enable row level security;
alter table lop enable row level security;
alter table hoc_sinh enable row level security;
alter table buoi_hoc enable row level security;
alter table diem_danh enable row level security;
alter table tro_giang_buoi enable row level security;
alter table anh_buoi enable row level security;
alter table goi_hoc enable row level security;
alter table phieu_thu enable row level security;
alter table chi_phi enable row level security;
alter table khoa_so enable row level security;
alter table nhat_ky_chot_so enable row level security;

create policy doc on tai_khoan for select using (id = auth.uid() or la_nhan_vien());
create policy sua on tai_khoan for update using (la_quan_ly() and vai_tro <> 'admin');

create policy doc on lop for select using (
  la_nhan_vien() or exists (select 1 from hoc_sinh h where h.lop_id = lop.id and h.phu_huynh_id = auth.uid()));
create policy ghi on lop for all using (la_quan_ly()) with check (la_quan_ly());

create policy doc on hoc_sinh for select using (la_nhan_vien() or phu_huynh_id = auth.uid());
create policy ghi on hoc_sinh for all using (la_quan_ly()) with check (la_quan_ly());

create policy doc on buoi_hoc for select using (
  la_nhan_vien() or exists (
    select 1 from hoc_sinh h where h.phu_huynh_id = auth.uid()
      and (h.lop_id = buoi_hoc.lop_id
           or exists (select 1 from diem_danh d where d.buoi_id = buoi_hoc.id and d.hoc_sinh_id = h.id))));
create policy ghi on buoi_hoc for all using (la_nhan_vien()) with check (la_nhan_vien());

create policy doc on diem_danh for select using (
  la_nhan_vien() or hoc_sinh_id in (select id from hoc_sinh where phu_huynh_id = auth.uid()));
create policy ghi on diem_danh for all using (la_nhan_vien()) with check (la_nhan_vien());

create policy nv on tro_giang_buoi for all using (la_nhan_vien()) with check (la_nhan_vien());

create policy doc on anh_buoi for select using (
  la_nhan_vien() or exists (
    select 1 from diem_danh d join hoc_sinh h on h.id = d.hoc_sinh_id
    where d.buoi_id = anh_buoi.buoi_id and h.phu_huynh_id = auth.uid() and d.trang_thai <> 'vang'));
create policy ghi on anh_buoi for all using (la_nhan_vien()) with check (la_nhan_vien());

create policy doc on goi_hoc for select using (
  la_quan_ly() or hoc_sinh_id in (select id from hoc_sinh where phu_huynh_id = auth.uid()));
create policy ghi on goi_hoc for all using (la_quan_ly()) with check (la_quan_ly());

create policy doc on phieu_thu for select using (
  la_quan_ly() or goi_id in (select g.id from goi_hoc g join hoc_sinh h on h.id = g.hoc_sinh_id where h.phu_huynh_id = auth.uid()));
create policy ghi on phieu_thu for all using (la_quan_ly()) with check (la_quan_ly());

create policy ql on chi_phi for all using (la_quan_ly()) with check (la_quan_ly());
create policy doc on khoa_so for select using (auth.uid() is not null);
create policy doc on nhat_ky_chot_so for select using (la_quan_ly());

-- Project tắt "tự expose bảng mới", nên cấp quyền tường minh; RLS lọc từng dòng.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on lop, hoc_sinh, buoi_hoc, diem_danh, tro_giang_buoi, anh_buoi,
  goi_hoc, phieu_thu, chi_phi to authenticated;
grant select on tai_khoan, khoa_so, nhat_ky_chot_so to authenticated;
grant update (ho_ten, don_gia_buoi, hoat_dong) on tai_khoan to authenticated;

revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function email_dang_nhap(text) to anon, authenticated;
grant execute on function vai_tro(), la_quan_ly(), la_nhan_vien(), da_doi_mat_khau(), chot_so(date),
  mo_khoa(date, text), sinh_buoi_thang(date) to authenticated;

-- ============ Ảnh (avatar, ảnh lớp) ============
insert into storage.buckets (id, name, public) values ('anh', 'anh', false) on conflict (id) do nothing;

create policy "anh: nhan vien" on storage.objects for all to authenticated
  using (bucket_id = 'anh' and public.la_nhan_vien())
  with check (bucket_id = 'anh' and public.la_nhan_vien());
-- Phụ huynh: truy vấn con chạy dưới RLS của chính họ, nên chỉ khớp ảnh buổi con có mặt và avatar của con.
create policy "anh: phu huynh xem" on storage.objects for select to authenticated
  using (bucket_id = 'anh' and (
    exists (select 1 from public.anh_buoi a where a.duong_dan = objects.name)
    or exists (select 1 from public.hoc_sinh h where h.avatar = objects.name)));

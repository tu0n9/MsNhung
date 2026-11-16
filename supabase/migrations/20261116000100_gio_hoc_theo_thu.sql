-- Giờ học theo từng thứ, mỗi buổi lưu giờ riêng, lương trợ giảng tính theo ca (người dùng chốt 2026-11-16,
-- docs/YEU-CAU.md mục "Giờ học theo thứ, lương trợ giảng theo ca, điểm danh gộp").

-- {"6": {"bd": "08:00", "kt": "09:30"}}: khoá là getDay() như cột lich. Giữ lich (nhiều chỗ đọc) và cột gio cũ (không
-- xoá dữ liệu); app thôi dùng gio.
alter table lop add column gio_thu jsonb not null default '{}';
alter table buoi_hoc add column bat_dau time, add column ket_thuc time;
alter table buoi_hoc add constraint buoi_hoc_gio_hop_le check (ket_thuc > bat_dau);

-- Giờ chữ dạng "17:30–19:00" áp cho mọi thứ trong lịch; dạng khác (ví dụ "T7 8:00, CN 9:30") để trống, nhập lại ở form.
update lop set gio_thu = x.g
from (
  select l.id, jsonb_object_agg(t::text, jsonb_build_object(
    'bd', to_char(m[1]::time, 'HH24:MI'), 'kt', to_char(m[2]::time, 'HH24:MI'))) as g
  from lop l
  cross join regexp_match(l.gio, '^\s*(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})\s*$') as m
  cross join unnest(l.lich) as t
  where m is not null
  group by l.id
) x
where x.id = lop.id;

-- Buổi theo lịch đã sinh của tháng chưa chốt lấy giờ của lớp; tháng đã chốt giữ nguyên (trigger khoa_so cũng chặn).
update buoi_hoc b set
  bat_dau = (l.gio_thu -> extract(dow from b.ngay)::int::text ->> 'bd')::time,
  ket_thuc = (l.gio_thu -> extract(dow from b.ngay)::int::text ->> 'kt')::time
from lop l
where l.id = b.lop_id and b.loai = 'lich' and b.bat_dau is null
  and l.gio_thu ? extract(dow from b.ngay)::int::text
  and b.ngay >= (select coalesce((khoa_den + interval '1 month')::date, date '0001-01-01') from khoa_so);

-- Sinh buổi kèm giờ. Đổi giờ lớp thì buổi từ hôm nay trở đi theo giờ mới, buổi đã qua giữ giờ cũ: lớp nhập giờ muộn
-- vẫn có giờ cho các buổi còn lại của tháng.
create or replace function sinh_buoi_thang(thang date) returns void language plpgsql security definer set search_path = public as $$
declare k date;
begin
  if not la_nhan_vien() then raise exception 'Không có quyền'; end if;
  select khoa_den into k from khoa_so;
  if k is not null and date_trunc('month', thang)::date <= k then return; end if;
  insert into buoi_hoc (lop_id, ngay, loai, bat_dau, ket_thuc)
  select l.id, d::date, 'lich',
    (l.gio_thu -> extract(dow from d)::int::text ->> 'bd')::time,
    (l.gio_thu -> extract(dow from d)::int::text ->> 'kt')::time
  from lop l
  cross join generate_series(date_trunc('month', thang), date_trunc('month', thang) + interval '1 month - 1 day', interval '1 day') d
  where l.hoat_dong and extract(dow from d)::smallint = any (l.lich)
  on conflict (lop_id, ngay) where loai = 'lich' do update set bat_dau = excluded.bat_dau, ket_thuc = excluded.ket_thuc
    where buoi_hoc.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date
      and (buoi_hoc.bat_dau, buoi_hoc.ket_thuc) is distinct from (excluded.bat_dau, excluded.ket_thuc);
end $$;

-- Lương theo ca: một trợ giảng không thể ở hai lớp khác giờ, nên các buổi cùng ngày + cùng giờ bắt đầu (lớp gộp) là
-- một ca. Buổi chưa có giờ tính riêng như trước, nên các tháng cũ (không có giờ) ra đúng số cũ. so_buoi giờ là số ca.
create or replace function luong_tro_giang(tu date, den date)
returns table (tro_giang_id uuid, ho_ten text, so_buoi bigint, thanh_tien bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not la_quan_ly() then raise exception 'Chỉ giáo viên xem được lương trợ giảng'; end if;
  return query
    with ca as (
      select t.tro_giang_id, b.ngay, coalesce(b.bat_dau::text, b.id::text) as gio, max(t.don_gia) as don_gia
      from tro_giang_buoi t join buoi_hoc b on b.id = t.buoi_id
      where b.ngay >= tu and b.ngay < den
      group by 1, 2, 3
    )
    select c.tro_giang_id, k.ho_ten, count(*), sum(c.don_gia)::bigint
    from ca c join tai_khoan k on k.id = c.tro_giang_id
    group by c.tro_giang_id, k.ho_ten
    order by k.ho_ten;
end $$;

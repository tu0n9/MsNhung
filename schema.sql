


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."chot_so"("thang" "date") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if not la_quan_ly() then raise exception 'Chỉ giáo viên được chốt sổ'; end if;
  update khoa_so set khoa_den = greatest(khoa_den, date_trunc('month', thang)::date) where id;
  insert into nhat_ky_chot_so (thang, hanh_dong) values (date_trunc('month', thang), 'chot');
end $$;


ALTER FUNCTION "public"."chot_so"("thang" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."da_doi_mat_khau"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions'
    AS $$
begin
  if exists (
    select 1 from auth.users u join tai_khoan t on t.id = u.id
    where u.id = auth.uid() and t.so_dien_thoai is not null
      and u.encrypted_password = crypt(t.so_dien_thoai, u.encrypted_password)
  ) then
    raise exception 'Mật khẩu mới không được trùng số điện thoại';
  end if;
  update tai_khoan set phai_doi_mat_khau = false where id = auth.uid();
end $$;


ALTER FUNCTION "public"."da_doi_mat_khau"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ds_tro_giang"() RETURNS TABLE("id" "uuid", "ho_ten" "text")
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select id, ho_ten from tai_khoan
  where vai_tro = 'tro_giang' and hoat_dong and la_nhan_vien()
  order by ho_ten
$$;


ALTER FUNCTION "public"."ds_tro_giang"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."dung_luong_anh"() RETURNS bigint
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  return (select coalesce(sum((metadata->>'size')::bigint), 0) from storage.objects where bucket_id = 'anh');
end $$;


ALTER FUNCTION "public"."dung_luong_anh"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."email_dang_nhap"("dinh_danh" "text") RETURNS "text"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select email from tai_khoan
  where hoat_dong
    and (ten_dang_nhap = lower(trim(dinh_danh))
         or so_dien_thoai = nullif(regexp_replace(dinh_danh, '\D', '', 'g'), ''))
  limit 1
$$;


ALTER FUNCTION "public"."email_dang_nhap"("dinh_danh" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ghi_dang_nhap"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if auth.uid() is null then raise exception 'Chưa đăng nhập'; end if;
  insert into nhat_ky (nguoi, ten_nguoi, bang, hanh_dong, doi_tuong)
  select id, ho_ten, 'tai_khoan', 'dang_nhap', ho_ten from tai_khoan where id = auth.uid();
  delete from nhat_ky where luc < now() - interval '6 months';
end $$;


ALTER FUNCTION "public"."ghi_dang_nhap"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."gop_hoc_sinh"("p_giu" "uuid", "p_bo" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  giu hoc_sinh%rowtype;
  bo hoc_sinh%rowtype;
  k date;
  anh_thua text;
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  if p_giu is null or p_bo is null or p_giu = p_bo then raise exception 'Chọn hai học sinh khác nhau để gộp'; end if;

  perform 1 from hoc_sinh where id in (p_giu, p_bo) order by id for update;
  select * into giu from hoc_sinh where id = p_giu;
  select * into bo from hoc_sinh where id = p_bo;
  if giu.id is null or bo.id is null then raise exception 'Không tìm thấy học sinh'; end if;

  if exists (
    select 1 from goi_hoc g1 join goi_hoc g2 on g1.hoc_sinh_id = p_giu and g2.hoc_sinh_id = p_bo
    where g1.thang_bat_dau < (g2.thang_bat_dau + make_interval(months => g2.so_thang))
      and g2.thang_bat_dau < (g1.thang_bat_dau + make_interval(months => g1.so_thang))
  ) then
    raise exception 'Hai học sinh đều có gói học phủ chung tháng. Hãy kiểm tra hoặc xoá gói trùng trước khi gộp';
  end if;

  select khoa_den into k from khoa_so;
  if k is not null and exists (
    select 1 from diem_danh d1
    join diem_danh d2 on d1.buoi_id = d2.buoi_id
    join buoi_hoc b on b.id = d1.buoi_id
    where d1.hoc_sinh_id = p_giu and d2.hoc_sinh_id = p_bo
      and not b.lop_nghi and b.ngay < k + interval '1 month'
  ) then
    raise exception 'Hai hồ sơ đều có điểm danh trùng buổi ở tháng đã chốt sổ, không gộp được';
  end if;

  perform set_config('msnhung.dang_gop_hs', '1', true);

  -- Dọn điểm danh rác (nếu có) trên các buổi lớp nghỉ trước khi dồn điểm danh để không vướng trigger chan_buoi_nghi
  delete from diem_danh d using buoi_hoc b
  where d.buoi_id = b.id and b.lop_nghi and d.hoc_sinh_id in (p_giu, p_bo);

  -- Gộp ghi danh trùng lớp: giữ ngày vào sớm hơn, ưu tiên đang học và giữ giá áp dụng nếu g1 đang ngừng mà g2 đang học
  update ghi_danh g1 set
    ngay_vao = least(g1.ngay_vao, g2.ngay_vao),
    trang_thai = case when g1.trang_thai = 'dang_hoc' or g2.trang_thai = 'dang_hoc' then 'dang_hoc' else 'ngung' end,
    don_gia_rieng = coalesce(
      g1.don_gia_rieng,
      g2.don_gia_rieng,
      case when g1.trang_thai <> 'dang_hoc' and g2.trang_thai = 'dang_hoc' and bo.don_gia <> giu.don_gia then bo.don_gia end
    )
  from ghi_danh g2
  where g1.hoc_sinh_id = p_giu and g2.hoc_sinh_id = p_bo and g1.lop_id = g2.lop_id;

  delete from ghi_danh g2
  where g2.hoc_sinh_id = p_bo
    and exists (select 1 from ghi_danh g1 where g1.hoc_sinh_id = p_giu and g1.lop_id = g2.lop_id);

  -- Lớp chỉ p_bo có: giữ đúng giá p_bo đang đóng (chép bo.don_gia vào don_gia_rieng nếu trước đó null và khác giu.don_gia)
  update ghi_danh set
    hoc_sinh_id = p_giu,
    don_gia_rieng = coalesce(don_gia_rieng, case when bo.don_gia <> giu.don_gia then bo.don_gia end)
  where hoc_sinh_id = p_bo;

  -- Gộp điểm danh: buổi trùng cộng sticker và ưu tiên có mặt / học bù
  update diem_danh d1 set
    trang_thai = case
      when d1.trang_thai = 'co_mat' or d2.trang_thai = 'co_mat' then 'co_mat'
      when d1.trang_thai = 'hoc_bu' or d2.trang_thai = 'hoc_bu' then 'hoc_bu'
      else 'vang'
    end,
    sticker = d1.sticker + d2.sticker
  from diem_danh d2
  where d1.hoc_sinh_id = p_giu and d2.hoc_sinh_id = p_bo and d1.buoi_id = d2.buoi_id;

  delete from diem_danh d2
  where d2.hoc_sinh_id = p_bo
    and exists (select 1 from diem_danh d1 where d1.hoc_sinh_id = p_giu and d1.buoi_id = d2.buoi_id);

  update diem_danh set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;

  update sticker_cong_tru set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;
  update goi_hoc set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;
  update chi_phi set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;

  -- Phiếu đánh giá cùng tháng giữ liên kết của hồ sơ chính, phiếu còn lại bỏ liên kết học sinh để giữ lịch sử
  update danh_gia d2 set hoc_sinh_id = null
  where d2.hoc_sinh_id = p_bo
    and exists (select 1 from danh_gia d1 where d1.hoc_sinh_id = p_giu and d1.thang = d2.thang);

  update danh_gia set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;

  anh_thua := case when giu.avatar is not null and bo.avatar is not null and giu.avatar <> bo.avatar then bo.avatar else null end;

  update hoc_sinh set
    sticker_dau_ky = giu.sticker_dau_ky + bo.sticker_dau_ky,
    avatar = coalesce(giu.avatar, bo.avatar),
    ten_phu_huynh = coalesce(nullif(trim(giu.ten_phu_huynh), ''), bo.ten_phu_huynh),
    sdt_phu_huynh = coalesce(nullif(trim(giu.sdt_phu_huynh), ''), bo.sdt_phu_huynh),
    link_zalo = coalesce(giu.link_zalo, bo.link_zalo),
    ghi_chu = case
      when coalesce(trim(giu.ghi_chu), '') = '' then bo.ghi_chu
      when coalesce(trim(bo.ghi_chu), '') = '' or trim(bo.ghi_chu) = trim(giu.ghi_chu) then giu.ghi_chu
      else giu.ghi_chu || E'\n' || bo.ghi_chu
    end,
    ngay_vao = least(giu.ngay_vao, bo.ngay_vao),
    trang_thai = case
      when exists (select 1 from ghi_danh where hoc_sinh_id = p_giu) then (
        case when exists (select 1 from ghi_danh where hoc_sinh_id = p_giu and trang_thai = 'dang_hoc') then 'dang_hoc' else 'ngung' end
      )
      when giu.trang_thai = 'dang_hoc' or bo.trang_thai = 'dang_hoc' then 'dang_hoc'
      else 'ngung'
    end
  where id = p_giu;

  delete from hoc_sinh where id = p_bo;
  perform set_config('msnhung.dang_gop_hs', '0', true);
  return anh_thua;
exception when others then
  perform set_config('msnhung.dang_gop_hs', '0', true);
  raise;
end $$;


ALTER FUNCTION "public"."gop_hoc_sinh"("p_giu" "uuid", "p_bo" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."gui_danh_gia"("p_ma" "text", "p_lop" "uuid", "p_hoc_sinh" "uuid", "p_khoa_hoc" "text", "p_kho_khan" "text", "p_tro_giang" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  t date := thang_cua_ma(p_ma);
  tl text; th text; x jsonb; tg jsonb := '[]'; ten text; diem int;
begin
  select l.ten, h.ho_ten into tl, th
  from ghi_danh gd join hoc_sinh h on h.id = gd.hoc_sinh_id join lop l on l.id = gd.lop_id
  where gd.hoc_sinh_id = p_hoc_sinh and gd.lop_id = p_lop and l.hoat_dong and gd.trang_thai = 'dang_hoc';
  if th is null then raise exception 'Học sinh không thuộc lớp này'; end if;
  if length(p_khoa_hoc) > 1000 or length(p_kho_khan) > 1000 then raise exception 'Nhận xét quá dài'; end if;
  if jsonb_typeof(p_tro_giang) <> 'array' or jsonb_array_length(p_tro_giang) > 20 then raise exception 'Dữ liệu trợ giảng sai'; end if;
  if (select count(distinct e->>'id') from jsonb_array_elements(p_tro_giang) e) <> jsonb_array_length(p_tro_giang) then
    raise exception 'Trợ giảng bị chọn trùng';
  end if;
  for x in select * from jsonb_array_elements(p_tro_giang) loop
    select ho_ten into ten from tai_khoan where id::text = x->>'id' and vai_tro = 'tro_giang' and hoat_dong;
    if ten is null then raise exception 'Trợ giảng không tồn tại'; end if;
    foreach diem in array array[(x->>'kien_thuc')::int, (x->>'tuong_tac')::int, (x->>'ho_tro')::int] loop
      if diem is null or diem not between 1 and 5 then raise exception 'Điểm phải từ 1 đến 5'; end if;
    end loop;
    if length(x->>'nhan_xet') > 1000 or length(x->>'chua_bai') > 1000 then raise exception 'Nhận xét quá dài'; end if;
    tg := tg || jsonb_build_object('id', x->>'id', 'ten', ten,
      'kien_thuc', (x->>'kien_thuc')::int, 'tuong_tac', (x->>'tuong_tac')::int, 'ho_tro', (x->>'ho_tro')::int,
      'nhan_xet', nullif(trim(x->>'nhan_xet'), ''), 'chua_bai', nullif(trim(x->>'chua_bai'), ''));
  end loop;
  insert into danh_gia (thang, lop_id, ten_lop, hoc_sinh_id, ten_hoc_sinh, khoa_hoc, kho_khan, tro_giang)
  values (t, p_lop, tl, p_hoc_sinh, th, nullif(trim(p_khoa_hoc), ''), nullif(trim(p_kho_khan), ''), tg);
exception when unique_violation then
  raise exception 'Em đã gửi phiếu tháng này rồi';
end $$;


ALTER FUNCTION "public"."gui_danh_gia"("p_ma" "text", "p_lop" "uuid", "p_hoc_sinh" "uuid", "p_khoa_hoc" "text", "p_kho_khan" "text", "p_tro_giang" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."kiem_tra_khoa"("ngay" "date") RETURNS "void"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare k date;
begin
  select khoa_den into k from khoa_so;
  if k is not null and ngay < k + interval '1 month' then
    raise exception 'Tháng %/% đã chốt sổ, không sửa được', extract(month from ngay), extract(year from ngay);
  end if;
end $$;


ALTER FUNCTION "public"."kiem_tra_khoa"("ngay" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."la_nhan_vien"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select coalesce(vai_tro() in ('admin', 'giao_vien', 'tro_giang'), false)
$$;


ALTER FUNCTION "public"."la_nhan_vien"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."la_quan_ly"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select coalesce(vai_tro() in ('admin', 'giao_vien'), false)
$$;


ALTER FUNCTION "public"."la_quan_ly"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."luong_tro_giang"("tu" "date", "den" "date") RETURNS TABLE("tro_giang_id" "uuid", "ho_ten" "text", "so_buoi" bigint, "thanh_tien" bigint)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."luong_tro_giang"("tu" "date", "den" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ma_hs_tu_stt"("n" bigint) RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    SET "search_path" TO 'public'
    AS $$
  select case
    when n is null or n < 1 then null
    when n < 1000 then 'HS' || lpad(n::text, 3, '0')
    else 'HS' || n::text
  end
$$;


ALTER FUNCTION "public"."ma_hs_tu_stt"("n" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mo_khoa"("thang" "date", "ly_do" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if not la_quan_ly() then raise exception 'Chỉ giáo viên được mở khoá'; end if;
  if coalesce(trim(ly_do), '') = '' then raise exception 'Phải ghi lý do mở khoá'; end if;
  -- mở tháng M thì các tháng sau M cũng mở, vì chúng phụ thuộc số liệu của M; least() bỏ qua null nên giữ null tường minh
  update khoa_so set khoa_den = case when khoa_den is null then null
    else least(khoa_den, (date_trunc('month', thang) - interval '1 month')::date) end where id;
  insert into nhat_ky_chot_so (thang, hanh_dong, ly_do) values (date_trunc('month', thang), 'mo_khoa', ly_do);
end $$;


ALTER FUNCTION "public"."mo_khoa"("thang" "date", "ly_do" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ngay_cua"("bang" "text", "r" "jsonb") RETURNS "date"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select case bang
    when 'buoi_hoc' then (r->>'ngay')::date
    when 'chi_phi' then (r->>'ngay')::date
    when 'phieu_thu' then (r->>'ngay_thu')::date
    when 'goi_hoc' then (r->>'thang_bat_dau')::date
    when 'sticker_cong_tru' then (r->>'ngay')::date
    else (select ngay from buoi_hoc where id = (r->>'buoi_id')::uuid)
  end
$$;


ALTER FUNCTION "public"."ngay_cua"("bang" "text", "r" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."phieu_danh_gia"("p_ma" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare t date := thang_cua_ma(p_ma);
begin
  return jsonb_build_object(
    'thang', to_char(t, 'YYYY-MM'),
    'han', (t + interval '1 month 4 days')::date,
    'lops', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'ten', ten) order by ten) from lop where hoat_dong), '[]'),
    'hoc_sinhs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'lop_id', gd.lop_id,
        'da_gui', exists (select 1 from danh_gia d where d.thang = t and d.hoc_sinh_id = h.id)
      ) order by h.ho_ten, h.ma_hs)
      from ghi_danh gd
      join hoc_sinh h on h.id = gd.hoc_sinh_id
      join lop l on l.id = gd.lop_id
      where l.hoat_dong and gd.trang_thai = 'dang_hoc'
    ), '[]'),
    'tro_giangs', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'ho_ten', ho_ten) order by ho_ten)
      from tai_khoan where vai_tro = 'tro_giang' and hoat_dong), '[]'));
end $$;


ALTER FUNCTION "public"."phieu_danh_gia"("p_ma" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
  tbl name;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        SELECT c.relname INTO tbl FROM pg_catalog.pg_class c WHERE c.oid = cmd.objid;
        EXECUTE format('alter table if exists %I.%I enable row level security', cmd.schema_name, tbl);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sinh_buoi_thang"("thang" "date") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."sinh_buoi_thang"("thang" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sinh_ma_hs"() RETURNS "text"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select ma_hs_tu_stt(nextval('hoc_sinh_ma_seq'))
$$;


ALTER FUNCTION "public"."sinh_ma_hs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."thang_cua_ma"("p_ma" "text") RETURNS "date"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare t date;
begin
  select thang into t from link_danh_gia where ma = p_ma;
  if t is null or (now() at time zone 'Asia/Ho_Chi_Minh')::date >= (t + interval '1 month 5 days')::date then
    raise exception 'Link không còn hiệu lực';
  end if;
  return t;
end $$;


ALTER FUNCTION "public"."thang_cua_ma"("p_ma" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_chan_buoi_nghi"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if exists (select 1 from buoi_hoc where id = new.buoi_id and lop_nghi) then
    raise exception 'Buổi này lớp nghỉ, không điểm danh được. Bỏ "Lớp nghỉ" trước.';
  end if;
  return new;
end $$;


ALTER FUNCTION "public"."trg_chan_buoi_nghi"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_gia_tro_giang"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  new.don_gia := (select don_gia_buoi from tai_khoan where id = new.tro_giang_id);
  return new;
end $$;


ALTER FUNCTION "public"."trg_gia_tro_giang"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_goi_khong_am"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  goc bigint := 0;
  tong bigint;
begin
  select coalesce(sum(coalesce((new.tien_thang->>k)::bigint, (new.buoi_du_kien->>k)::bigint * new.don_gia)), 0)
  into goc
  from jsonb_object_keys(coalesce(new.buoi_du_kien, '{}'::jsonb)) k;

  tong := goc + coalesce(new.dieu_chinh, 0) - coalesce(new.tien_du_tru, 0);
  if tong < 0 then
    raise exception 'Tổng tiền gói học không được âm (% đ)', tong;
  end if;
  return new;
end $$;


ALTER FUNCTION "public"."trg_goi_khong_am"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_goi_khong_chong"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if exists (
    select 1 from goi_hoc g
    where g.hoc_sinh_id = new.hoc_sinh_id and g.id <> new.id
      and g.thang_bat_dau < (new.thang_bat_dau + make_interval(months => new.so_thang))
      and new.thang_bat_dau < (g.thang_bat_dau + make_interval(months => g.so_thang))
  ) then
    raise exception 'Học sinh đã có gói phủ một trong các tháng này';
  end if;
  return new;
end $$;


ALTER FUNCTION "public"."trg_goi_khong_chong"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_khoa_so"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if current_setting('msnhung.dang_gop_hs', true) = '1' then
    return coalesce(new, old);
  end if;
  if tg_op <> 'INSERT' then perform kiem_tra_khoa(ngay_cua(tg_table_name, to_jsonb(old))); end if;
  if tg_op <> 'DELETE' then perform kiem_tra_khoa(ngay_cua(tg_table_name, to_jsonb(new))); end if;
  return coalesce(new, old);
end $$;


ALTER FUNCTION "public"."trg_khoa_so"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_lop_nghi_xoa"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  delete from diem_danh where buoi_id = new.id;
  delete from tro_giang_buoi where buoi_id = new.id;
  return null;
end $$;


ALTER FUNCTION "public"."trg_lop_nghi_xoa"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_nguoi_ghi_sticker"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  new.nguoi := auth.uid();
  new.ten_nguoi := (select ho_ten from tai_khoan where id = auth.uid());
  return new;
end $$;


ALTER FUNCTION "public"."trg_nguoi_ghi_sticker"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_nhat_ky"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  cu jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  moi jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  r jsonb := coalesce(moi, cu);
  doi jsonb := r;
  hd text := case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end;
begin
  if tg_table_name = 'buoi_hoc' and tg_op = 'INSERT' and r->>'loai' = 'lich' then return null; end if;
  if tg_op = 'UPDATE' then
    select jsonb_object_agg(k, jsonb_build_array(cu->k, moi->k)) into doi
    from jsonb_object_keys(moi) k where cu->k is distinct from moi->k;
    if doi is null then return null; end if;
  end if;
  if tg_table_name = 'nhat_ky_chot_so' then
    hd := r->>'hanh_dong';
    doi := jsonb_build_object('ly_do', r->'ly_do');
  end if;
  insert into nhat_ky (nguoi, ten_nguoi, bang, hanh_dong, doi_tuong, thay_doi)
  values (auth.uid(), (select ho_ten from tai_khoan where id = auth.uid()), tg_table_name, hd,
    case tg_table_name
      when 'hoc_sinh' then r->>'ho_ten'
      when 'lop' then r->>'ten'
      when 'tai_khoan' then r->>'ho_ten'
      when 'chi_phi' then r->>'danh_muc'
      when 'ghi_danh' then concat_ws(' · ',
        (select ho_ten from hoc_sinh where id = (r->>'hoc_sinh_id')::uuid),
        (select ten from lop where id = (r->>'lop_id')::uuid))
      when 'sticker_cong_tru' then (select ho_ten from hoc_sinh where id = (r->>'hoc_sinh_id')::uuid)
      when 'goi_hoc' then (select ho_ten from hoc_sinh where id = (r->>'hoc_sinh_id')::uuid)
      when 'phieu_thu' then (select h.ho_ten from goi_hoc g join hoc_sinh h on h.id = g.hoc_sinh_id where g.id = (r->>'goi_id')::uuid)
      when 'buoi_hoc' then (select ten from lop where id = (r->>'lop_id')::uuid) || ' · ' || to_char((r->>'ngay')::date, 'DD/MM/YYYY')
      when 'tro_giang_buoi' then (select concat_ws(' · ', k.ho_ten, l.ten, to_char(b.ngay, 'DD/MM/YYYY'))
        from buoi_hoc b join lop l on l.id = b.lop_id left join tai_khoan k on k.id = (r->>'tro_giang_id')::uuid
        where b.id = (r->>'buoi_id')::uuid)
      when 'nhat_ky_chot_so' then 'Tháng ' || to_char((r->>'thang')::date, 'MM/YYYY')
    end,
    doi);
  return null;
end $$;


ALTER FUNCTION "public"."trg_nhat_ky"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."vai_tro"() RETURNS "text"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select vai_tro from tai_khoan where id = auth.uid() and hoat_dong
$$;


ALTER FUNCTION "public"."vai_tro"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."xoa_lop"("p_lop" "uuid", "p_ten" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare hs_anh_huong uuid[]; bh uuid[]; anh text[];
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  if not exists (select 1 from lop where id = p_lop and ten = p_ten) then raise exception 'Tên lớp gõ lại không khớp'; end if;

  select coalesce(array_agg(distinct gd.hoc_sinh_id), '{}') into hs_anh_huong
  from ghi_danh gd
  where gd.lop_id = p_lop;

  select coalesce(array_agg(id), '{}') into bh from buoi_hoc where lop_id = p_lop;
  select coalesce(array_agg(duong_dan), '{}') into anh from anh_buoi where buoi_id = any(bh);

  delete from diem_danh where buoi_id = any(bh);
  delete from tro_giang_buoi where buoi_id = any(bh);
  delete from anh_buoi where buoi_id = any(bh);
  delete from ghi_danh where lop_id = p_lop;
  delete from buoi_hoc where id = any(bh);
  delete from lop where id = p_lop;

  -- Đồng bộ trạng thái các học sinh từng thuộc lớp vừa xoá:
  -- còn lớp đang học -> dang_hoc; không còn lớp nào (chuyển về Chưa xếp lớp) -> dang_hoc; chỉ còn lớp ngừng -> ngung.
  update hoc_sinh h set
    trang_thai = case
      when exists (select 1 from ghi_danh g where g.hoc_sinh_id = h.id and g.trang_thai = 'dang_hoc') then 'dang_hoc'
      when not exists (select 1 from ghi_danh g where g.hoc_sinh_id = h.id) then 'dang_hoc'
      else 'ngung'
    end
  where h.id = any(hs_anh_huong);

  return anh;
end $$;


ALTER FUNCTION "public"."xoa_lop"("p_lop" "uuid", "p_ten" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."anh_buoi" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "buoi_id" "uuid" NOT NULL,
    "duong_dan" "text" NOT NULL,
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."anh_buoi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."buoi_hoc" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lop_id" "uuid" NOT NULL,
    "ngay" "date" NOT NULL,
    "loai" "text" DEFAULT 'lich'::"text" NOT NULL,
    "lop_nghi" boolean DEFAULT false NOT NULL,
    "ghi_chu" "text",
    "bat_dau" time without time zone,
    "ket_thuc" time without time zone,
    CONSTRAINT "buoi_hoc_gio_hop_le" CHECK (("ket_thuc" > "bat_dau")),
    CONSTRAINT "buoi_hoc_loai_check" CHECK (("loai" = ANY (ARRAY['lich'::"text", 'phu'::"text", 'bu'::"text"])))
);


ALTER TABLE "public"."buoi_hoc" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chi_phi" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ngay" "date" DEFAULT CURRENT_DATE NOT NULL,
    "danh_muc" "text" NOT NULL,
    "so_tien" integer NOT NULL,
    "ghi_chu" "text",
    "hoc_sinh_id" "uuid",
    CONSTRAINT "chi_phi_so_tien_check" CHECK (("so_tien" > 0))
);


ALTER TABLE "public"."chi_phi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."danh_gia" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "thang" "date" NOT NULL,
    "lop_id" "uuid",
    "ten_lop" "text" NOT NULL,
    "hoc_sinh_id" "uuid",
    "ten_hoc_sinh" "text" NOT NULL,
    "khoa_hoc" "text",
    "kho_khan" "text",
    "tro_giang" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "gui_luc" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."danh_gia" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."diem_danh" (
    "buoi_id" "uuid" NOT NULL,
    "hoc_sinh_id" "uuid" NOT NULL,
    "trang_thai" "text" NOT NULL,
    "sticker" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "diem_danh_trang_thai_check" CHECK (("trang_thai" = ANY (ARRAY['co_mat'::"text", 'vang'::"text", 'hoc_bu'::"text"])))
);


ALTER TABLE "public"."diem_danh" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ghi_danh" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hoc_sinh_id" "uuid" NOT NULL,
    "lop_id" "uuid" NOT NULL,
    "ngay_vao" "date" DEFAULT CURRENT_DATE NOT NULL,
    "trang_thai" "text" DEFAULT 'dang_hoc'::"text" NOT NULL,
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    "don_gia_rieng" integer,
    CONSTRAINT "ghi_danh_don_gia_rieng_check" CHECK (("don_gia_rieng" >= 0)),
    CONSTRAINT "ghi_danh_trang_thai_check" CHECK (("trang_thai" = ANY (ARRAY['dang_hoc'::"text", 'ngung'::"text"])))
);


ALTER TABLE "public"."ghi_danh" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."goi_hoc" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hoc_sinh_id" "uuid" NOT NULL,
    "thang_bat_dau" "date" NOT NULL,
    "so_thang" smallint NOT NULL,
    "don_gia" integer NOT NULL,
    "buoi_du_kien" "jsonb" NOT NULL,
    "tien_du_tru" integer DEFAULT 0 NOT NULL,
    "dieu_chinh" integer DEFAULT 0 NOT NULL,
    "ly_do_dieu_chinh" "text",
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tien_thang" "jsonb",
    "lop_gia" "jsonb",
    CONSTRAINT "goi_hoc_don_gia_check" CHECK (("don_gia" >= 0)),
    CONSTRAINT "goi_hoc_so_thang_check" CHECK ((("so_thang" >= 1) AND ("so_thang" <= 3))),
    CONSTRAINT "goi_hoc_thang_bat_dau_check" CHECK ((EXTRACT("day" FROM "thang_bat_dau") = (1)::numeric)),
    CONSTRAINT "goi_hoc_tien_du_tru_check" CHECK (("tien_du_tru" >= 0))
);


ALTER TABLE "public"."goi_hoc" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hoc_sinh" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ho_ten" "text" NOT NULL,
    "avatar" "text",
    "ten_phu_huynh" "text",
    "sdt_phu_huynh" "text",
    "phu_huynh_id" "uuid",
    "ngay_vao" "date" DEFAULT CURRENT_DATE NOT NULL,
    "don_gia_rieng" integer,
    "trang_thai" "text" DEFAULT 'dang_hoc'::"text" NOT NULL,
    "ghi_chu" "text",
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sticker_dau_ky" integer DEFAULT 0 NOT NULL,
    "link_zalo" "text",
    "ma_hs" "text" DEFAULT "public"."sinh_ma_hs"() NOT NULL,
    "don_gia" integer NOT NULL,
    CONSTRAINT "hoc_sinh_don_gia_check" CHECK (("don_gia" >= 0)),
    CONSTRAINT "hoc_sinh_don_gia_rieng_check" CHECK (("don_gia_rieng" >= 0)),
    CONSTRAINT "hoc_sinh_link_zalo_check" CHECK (("link_zalo" ~ '^https://zalo\.me/\S+$'::"text")),
    CONSTRAINT "hoc_sinh_sticker_dau_ky_check" CHECK (("sticker_dau_ky" >= 0)),
    CONSTRAINT "hoc_sinh_trang_thai_check" CHECK (("trang_thai" = ANY (ARRAY['dang_hoc'::"text", 'ngung'::"text"])))
);


ALTER TABLE "public"."hoc_sinh" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hoc_sinh_ma_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."hoc_sinh_ma_seq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."khoa_so" (
    "id" boolean DEFAULT true NOT NULL,
    "khoa_den" "date",
    CONSTRAINT "khoa_so_id_check" CHECK ("id")
);


ALTER TABLE "public"."khoa_so" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."link_danh_gia" (
    "thang" "date" NOT NULL,
    "ma" "text" NOT NULL,
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "link_danh_gia_ma_check" CHECK (("length"("ma") >= 10)),
    CONSTRAINT "link_danh_gia_thang_check" CHECK ((EXTRACT("day" FROM "thang") = (1)::numeric))
);


ALTER TABLE "public"."link_danh_gia" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lop" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ten" "text" NOT NULL,
    "don_gia" integer NOT NULL,
    "lich" smallint[] DEFAULT '{}'::smallint[] NOT NULL,
    "hoat_dong" boolean DEFAULT true NOT NULL,
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    "gio" "text",
    "gio_thu" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    CONSTRAINT "lop_don_gia_check" CHECK (("don_gia" >= 0))
);


ALTER TABLE "public"."lop" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nhat_ky" (
    "id" bigint NOT NULL,
    "luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    "nguoi" "uuid",
    "ten_nguoi" "text",
    "bang" "text" NOT NULL,
    "hanh_dong" "text" NOT NULL,
    "doi_tuong" "text",
    "thay_doi" "jsonb",
    CONSTRAINT "nhat_ky_hanh_dong_check" CHECK (("hanh_dong" = ANY (ARRAY['them'::"text", 'sua'::"text", 'xoa'::"text", 'dang_nhap'::"text", 'chot'::"text", 'mo_khoa'::"text"])))
);


ALTER TABLE "public"."nhat_ky" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nhat_ky_chot_so" (
    "id" bigint NOT NULL,
    "thang" "date" NOT NULL,
    "hanh_dong" "text" NOT NULL,
    "ly_do" "text",
    "nguoi" "uuid" DEFAULT "auth"."uid"(),
    "luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "nhat_ky_chot_so_hanh_dong_check" CHECK (("hanh_dong" = ANY (ARRAY['chot'::"text", 'mo_khoa'::"text"])))
);


ALTER TABLE "public"."nhat_ky_chot_so" OWNER TO "postgres";


ALTER TABLE "public"."nhat_ky_chot_so" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."nhat_ky_chot_so_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."nhat_ky" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."nhat_ky_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."phieu_thu" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "goi_id" "uuid" NOT NULL,
    "so_tien" integer NOT NULL,
    "ngay_thu" "date" DEFAULT CURRENT_DATE NOT NULL,
    "hinh_thuc" "text" NOT NULL,
    "ghi_chu" "text",
    "nguoi_thu" "uuid" DEFAULT "auth"."uid"(),
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "phieu_thu_hinh_thuc_check" CHECK (("hinh_thuc" = ANY (ARRAY['tien_mat'::"text", 'chuyen_khoan'::"text"]))),
    CONSTRAINT "phieu_thu_so_tien_check" CHECK (("so_tien" > 0))
);


ALTER TABLE "public"."phieu_thu" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sticker_cong_tru" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hoc_sinh_id" "uuid" NOT NULL,
    "so" integer NOT NULL,
    "ly_do" "text",
    "ngay" "date" DEFAULT (("now"() AT TIME ZONE 'Asia/Ho_Chi_Minh'::"text"))::"date" NOT NULL,
    "nguoi" "uuid",
    "ten_nguoi" "text",
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "sticker_cong_tru_check" CHECK ((("so" > 0) OR (COALESCE(TRIM(BOTH FROM "ly_do"), ''::"text") <> ''::"text"))),
    CONSTRAINT "sticker_cong_tru_so_check" CHECK (("so" <> 0))
);


ALTER TABLE "public"."sticker_cong_tru" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tai_khoan" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "ten_dang_nhap" "text",
    "so_dien_thoai" "text",
    "ho_ten" "text" NOT NULL,
    "vai_tro" "text" NOT NULL,
    "phai_doi_mat_khau" boolean DEFAULT true NOT NULL,
    "don_gia_buoi" integer DEFAULT 0 NOT NULL,
    "hoat_dong" boolean DEFAULT true NOT NULL,
    CONSTRAINT "tai_khoan_check" CHECK ((("ten_dang_nhap" IS NOT NULL) OR ("so_dien_thoai" IS NOT NULL))),
    CONSTRAINT "tai_khoan_don_gia_buoi_check" CHECK (("don_gia_buoi" >= 0)),
    CONSTRAINT "tai_khoan_vai_tro_check" CHECK (("vai_tro" = ANY (ARRAY['admin'::"text", 'giao_vien'::"text", 'tro_giang'::"text", 'phu_huynh'::"text"])))
);


ALTER TABLE "public"."tai_khoan" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tom_tat_danh_gia" (
    "thang" "date" NOT NULL,
    "lop_id" "uuid" NOT NULL,
    "noi_dung" "jsonb" NOT NULL,
    "so_phieu" integer NOT NULL,
    "tao_luc" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tom_tat_danh_gia" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."tong_sticker" WITH ("security_invoker"='true') AS
 SELECT "id" AS "hoc_sinh_id",
    (("sticker_dau_ky" + COALESCE(( SELECT "sum"("d"."sticker") AS "sum"
           FROM "public"."diem_danh" "d"
          WHERE ("d"."hoc_sinh_id" = "h"."id")), (0)::bigint)) + COALESCE(( SELECT "sum"("s"."so") AS "sum"
           FROM "public"."sticker_cong_tru" "s"
          WHERE ("s"."hoc_sinh_id" = "h"."id")), (0)::bigint)) AS "tong"
   FROM "public"."hoc_sinh" "h";


ALTER VIEW "public"."tong_sticker" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tro_giang_buoi" (
    "buoi_id" "uuid" NOT NULL,
    "tro_giang_id" "uuid" NOT NULL,
    "don_gia" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."tro_giang_buoi" OWNER TO "postgres";


ALTER TABLE ONLY "public"."anh_buoi"
    ADD CONSTRAINT "anh_buoi_duong_dan_key" UNIQUE ("duong_dan");



ALTER TABLE ONLY "public"."anh_buoi"
    ADD CONSTRAINT "anh_buoi_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."buoi_hoc"
    ADD CONSTRAINT "buoi_hoc_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chi_phi"
    ADD CONSTRAINT "chi_phi_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."danh_gia"
    ADD CONSTRAINT "danh_gia_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."danh_gia"
    ADD CONSTRAINT "danh_gia_thang_hoc_sinh_id_key" UNIQUE ("thang", "hoc_sinh_id");



ALTER TABLE ONLY "public"."diem_danh"
    ADD CONSTRAINT "diem_danh_pkey" PRIMARY KEY ("buoi_id", "hoc_sinh_id");



ALTER TABLE ONLY "public"."ghi_danh"
    ADD CONSTRAINT "ghi_danh_hoc_sinh_id_lop_id_key" UNIQUE ("hoc_sinh_id", "lop_id");



ALTER TABLE ONLY "public"."ghi_danh"
    ADD CONSTRAINT "ghi_danh_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."goi_hoc"
    ADD CONSTRAINT "goi_hoc_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hoc_sinh"
    ADD CONSTRAINT "hoc_sinh_ma_hs_key" UNIQUE ("ma_hs");



ALTER TABLE ONLY "public"."hoc_sinh"
    ADD CONSTRAINT "hoc_sinh_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."khoa_so"
    ADD CONSTRAINT "khoa_so_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."link_danh_gia"
    ADD CONSTRAINT "link_danh_gia_ma_key" UNIQUE ("ma");



ALTER TABLE ONLY "public"."link_danh_gia"
    ADD CONSTRAINT "link_danh_gia_pkey" PRIMARY KEY ("thang");



ALTER TABLE ONLY "public"."lop"
    ADD CONSTRAINT "lop_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nhat_ky_chot_so"
    ADD CONSTRAINT "nhat_ky_chot_so_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nhat_ky"
    ADD CONSTRAINT "nhat_ky_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."phieu_thu"
    ADD CONSTRAINT "phieu_thu_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sticker_cong_tru"
    ADD CONSTRAINT "sticker_cong_tru_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tai_khoan"
    ADD CONSTRAINT "tai_khoan_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."tai_khoan"
    ADD CONSTRAINT "tai_khoan_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tai_khoan"
    ADD CONSTRAINT "tai_khoan_so_dien_thoai_key" UNIQUE ("so_dien_thoai");



ALTER TABLE ONLY "public"."tai_khoan"
    ADD CONSTRAINT "tai_khoan_ten_dang_nhap_key" UNIQUE ("ten_dang_nhap");



ALTER TABLE ONLY "public"."tom_tat_danh_gia"
    ADD CONSTRAINT "tom_tat_danh_gia_pkey" PRIMARY KEY ("thang", "lop_id");



ALTER TABLE ONLY "public"."tro_giang_buoi"
    ADD CONSTRAINT "tro_giang_buoi_pkey" PRIMARY KEY ("buoi_id", "tro_giang_id");



CREATE UNIQUE INDEX "buoi_hoc_lich_duy_nhat" ON "public"."buoi_hoc" USING "btree" ("lop_id", "ngay") WHERE ("loai" = 'lich'::"text");



CREATE INDEX "danh_gia_thang_idx" ON "public"."danh_gia" USING "btree" ("thang");



CREATE INDEX "diem_danh_hoc_sinh_id_idx" ON "public"."diem_danh" USING "btree" ("hoc_sinh_id");



CREATE INDEX "ghi_danh_hoc_sinh_id_idx" ON "public"."ghi_danh" USING "btree" ("hoc_sinh_id");



CREATE INDEX "ghi_danh_lop_id_idx" ON "public"."ghi_danh" USING "btree" ("lop_id");



CREATE INDEX "nhat_ky_luc_idx" ON "public"."nhat_ky" USING "btree" ("luc" DESC);



CREATE INDEX "sticker_cong_tru_hoc_sinh_id_idx" ON "public"."sticker_cong_tru" USING "btree" ("hoc_sinh_id");



CREATE OR REPLACE TRIGGER "chan_buoi_nghi" BEFORE INSERT OR UPDATE ON "public"."diem_danh" FOR EACH ROW EXECUTE FUNCTION "public"."trg_chan_buoi_nghi"();



CREATE OR REPLACE TRIGGER "chan_buoi_nghi" BEFORE INSERT OR UPDATE ON "public"."tro_giang_buoi" FOR EACH ROW EXECUTE FUNCTION "public"."trg_chan_buoi_nghi"();



CREATE OR REPLACE TRIGGER "gia_tro_giang" BEFORE INSERT ON "public"."tro_giang_buoi" FOR EACH ROW EXECUTE FUNCTION "public"."trg_gia_tro_giang"();



CREATE OR REPLACE TRIGGER "goi_khong_am" BEFORE INSERT OR UPDATE ON "public"."goi_hoc" FOR EACH ROW EXECUTE FUNCTION "public"."trg_goi_khong_am"();



CREATE OR REPLACE TRIGGER "goi_khong_chong" BEFORE INSERT OR UPDATE ON "public"."goi_hoc" FOR EACH ROW EXECUTE FUNCTION "public"."trg_goi_khong_chong"();



CREATE OR REPLACE TRIGGER "khoa_so" BEFORE INSERT OR DELETE OR UPDATE ON "public"."anh_buoi" FOR EACH ROW EXECUTE FUNCTION "public"."trg_khoa_so"();



CREATE OR REPLACE TRIGGER "khoa_so" BEFORE INSERT OR DELETE OR UPDATE ON "public"."buoi_hoc" FOR EACH ROW EXECUTE FUNCTION "public"."trg_khoa_so"();



CREATE OR REPLACE TRIGGER "khoa_so" BEFORE INSERT OR DELETE OR UPDATE ON "public"."chi_phi" FOR EACH ROW EXECUTE FUNCTION "public"."trg_khoa_so"();



CREATE OR REPLACE TRIGGER "khoa_so" BEFORE INSERT OR DELETE OR UPDATE ON "public"."diem_danh" FOR EACH ROW EXECUTE FUNCTION "public"."trg_khoa_so"();



CREATE OR REPLACE TRIGGER "khoa_so" BEFORE INSERT OR DELETE OR UPDATE ON "public"."goi_hoc" FOR EACH ROW EXECUTE FUNCTION "public"."trg_khoa_so"();



CREATE OR REPLACE TRIGGER "khoa_so" BEFORE INSERT OR DELETE OR UPDATE ON "public"."phieu_thu" FOR EACH ROW EXECUTE FUNCTION "public"."trg_khoa_so"();



CREATE OR REPLACE TRIGGER "khoa_so" BEFORE INSERT OR DELETE OR UPDATE ON "public"."sticker_cong_tru" FOR EACH ROW EXECUTE FUNCTION "public"."trg_khoa_so"();



CREATE OR REPLACE TRIGGER "khoa_so" BEFORE INSERT OR DELETE OR UPDATE ON "public"."tro_giang_buoi" FOR EACH ROW EXECUTE FUNCTION "public"."trg_khoa_so"();



CREATE OR REPLACE TRIGGER "lop_nghi_xoa" AFTER UPDATE OF "lop_nghi" ON "public"."buoi_hoc" FOR EACH ROW WHEN (("new"."lop_nghi" AND (NOT "old"."lop_nghi"))) EXECUTE FUNCTION "public"."trg_lop_nghi_xoa"();



CREATE OR REPLACE TRIGGER "nguoi_ghi" BEFORE INSERT ON "public"."sticker_cong_tru" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nguoi_ghi_sticker"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."buoi_hoc" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."chi_phi" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."ghi_danh" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."goi_hoc" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."hoc_sinh" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."lop" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT ON "public"."nhat_ky_chot_so" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."phieu_thu" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."sticker_cong_tru" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."tai_khoan" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



CREATE OR REPLACE TRIGGER "nhat_ky" AFTER INSERT OR DELETE OR UPDATE ON "public"."tro_giang_buoi" FOR EACH ROW EXECUTE FUNCTION "public"."trg_nhat_ky"();



ALTER TABLE ONLY "public"."anh_buoi"
    ADD CONSTRAINT "anh_buoi_buoi_id_fkey" FOREIGN KEY ("buoi_id") REFERENCES "public"."buoi_hoc"("id");



ALTER TABLE ONLY "public"."buoi_hoc"
    ADD CONSTRAINT "buoi_hoc_lop_id_fkey" FOREIGN KEY ("lop_id") REFERENCES "public"."lop"("id");



ALTER TABLE ONLY "public"."chi_phi"
    ADD CONSTRAINT "chi_phi_hoc_sinh_id_fkey" FOREIGN KEY ("hoc_sinh_id") REFERENCES "public"."hoc_sinh"("id");



ALTER TABLE ONLY "public"."danh_gia"
    ADD CONSTRAINT "danh_gia_hoc_sinh_id_fkey" FOREIGN KEY ("hoc_sinh_id") REFERENCES "public"."hoc_sinh"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."danh_gia"
    ADD CONSTRAINT "danh_gia_lop_id_fkey" FOREIGN KEY ("lop_id") REFERENCES "public"."lop"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."diem_danh"
    ADD CONSTRAINT "diem_danh_buoi_id_fkey" FOREIGN KEY ("buoi_id") REFERENCES "public"."buoi_hoc"("id");



ALTER TABLE ONLY "public"."diem_danh"
    ADD CONSTRAINT "diem_danh_hoc_sinh_id_fkey" FOREIGN KEY ("hoc_sinh_id") REFERENCES "public"."hoc_sinh"("id");



ALTER TABLE ONLY "public"."ghi_danh"
    ADD CONSTRAINT "ghi_danh_hoc_sinh_id_fkey" FOREIGN KEY ("hoc_sinh_id") REFERENCES "public"."hoc_sinh"("id");



ALTER TABLE ONLY "public"."ghi_danh"
    ADD CONSTRAINT "ghi_danh_lop_id_fkey" FOREIGN KEY ("lop_id") REFERENCES "public"."lop"("id");



ALTER TABLE ONLY "public"."goi_hoc"
    ADD CONSTRAINT "goi_hoc_hoc_sinh_id_fkey" FOREIGN KEY ("hoc_sinh_id") REFERENCES "public"."hoc_sinh"("id");



ALTER TABLE ONLY "public"."hoc_sinh"
    ADD CONSTRAINT "hoc_sinh_phu_huynh_id_fkey" FOREIGN KEY ("phu_huynh_id") REFERENCES "public"."tai_khoan"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."phieu_thu"
    ADD CONSTRAINT "phieu_thu_goi_id_fkey" FOREIGN KEY ("goi_id") REFERENCES "public"."goi_hoc"("id");



ALTER TABLE ONLY "public"."phieu_thu"
    ADD CONSTRAINT "phieu_thu_nguoi_thu_fkey" FOREIGN KEY ("nguoi_thu") REFERENCES "public"."tai_khoan"("id");



ALTER TABLE ONLY "public"."sticker_cong_tru"
    ADD CONSTRAINT "sticker_cong_tru_hoc_sinh_id_fkey" FOREIGN KEY ("hoc_sinh_id") REFERENCES "public"."hoc_sinh"("id");



ALTER TABLE ONLY "public"."sticker_cong_tru"
    ADD CONSTRAINT "sticker_cong_tru_nguoi_fkey" FOREIGN KEY ("nguoi") REFERENCES "public"."tai_khoan"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tai_khoan"
    ADD CONSTRAINT "tai_khoan_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tom_tat_danh_gia"
    ADD CONSTRAINT "tom_tat_danh_gia_lop_id_fkey" FOREIGN KEY ("lop_id") REFERENCES "public"."lop"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tro_giang_buoi"
    ADD CONSTRAINT "tro_giang_buoi_buoi_id_fkey" FOREIGN KEY ("buoi_id") REFERENCES "public"."buoi_hoc"("id");



ALTER TABLE ONLY "public"."tro_giang_buoi"
    ADD CONSTRAINT "tro_giang_buoi_tro_giang_id_fkey" FOREIGN KEY ("tro_giang_id") REFERENCES "public"."tai_khoan"("id");



ALTER TABLE "public"."anh_buoi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."buoi_hoc" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chi_phi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."danh_gia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."diem_danh" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "doc" ON "public"."anh_buoi" FOR SELECT USING ("public"."la_nhan_vien"());



CREATE POLICY "doc" ON "public"."buoi_hoc" FOR SELECT USING ("public"."la_nhan_vien"());



CREATE POLICY "doc" ON "public"."danh_gia" FOR SELECT USING ("public"."la_quan_ly"());



CREATE POLICY "doc" ON "public"."diem_danh" FOR SELECT USING ("public"."la_nhan_vien"());



CREATE POLICY "doc" ON "public"."ghi_danh" FOR SELECT USING ("public"."la_nhan_vien"());



CREATE POLICY "doc" ON "public"."goi_hoc" FOR SELECT USING ("public"."la_quan_ly"());



CREATE POLICY "doc" ON "public"."hoc_sinh" FOR SELECT USING ("public"."la_nhan_vien"());



CREATE POLICY "doc" ON "public"."khoa_so" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "doc" ON "public"."lop" FOR SELECT USING ("public"."la_nhan_vien"());



CREATE POLICY "doc" ON "public"."nhat_ky" FOR SELECT USING ("public"."la_quan_ly"());



CREATE POLICY "doc" ON "public"."nhat_ky_chot_so" FOR SELECT USING ("public"."la_quan_ly"());



CREATE POLICY "doc" ON "public"."phieu_thu" FOR SELECT USING ("public"."la_quan_ly"());



CREATE POLICY "doc" ON "public"."sticker_cong_tru" FOR SELECT USING ("public"."la_nhan_vien"());



CREATE POLICY "doc" ON "public"."tai_khoan" FOR SELECT USING ((("id" = "auth"."uid"()) OR "public"."la_quan_ly"()));



CREATE POLICY "doc" ON "public"."tom_tat_danh_gia" FOR SELECT USING ("public"."la_quan_ly"());



CREATE POLICY "ghi" ON "public"."diem_danh" USING ("public"."la_nhan_vien"()) WITH CHECK ("public"."la_nhan_vien"());



CREATE POLICY "ghi" ON "public"."ghi_danh" USING ("public"."la_quan_ly"()) WITH CHECK ("public"."la_quan_ly"());



CREATE POLICY "ghi" ON "public"."goi_hoc" USING ("public"."la_quan_ly"()) WITH CHECK ("public"."la_quan_ly"());



CREATE POLICY "ghi" ON "public"."hoc_sinh" USING ("public"."la_quan_ly"()) WITH CHECK ("public"."la_quan_ly"());



CREATE POLICY "ghi" ON "public"."lop" USING ("public"."la_quan_ly"()) WITH CHECK ("public"."la_quan_ly"());



CREATE POLICY "ghi" ON "public"."phieu_thu" USING ("public"."la_quan_ly"()) WITH CHECK ("public"."la_quan_ly"());



ALTER TABLE "public"."ghi_danh" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."goi_hoc" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hoc_sinh" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."khoa_so" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."link_danh_gia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lop" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nhat_ky" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nhat_ky_chot_so" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "nv" ON "public"."tro_giang_buoi" USING ("public"."la_nhan_vien"()) WITH CHECK ("public"."la_nhan_vien"());



ALTER TABLE "public"."phieu_thu" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ql" ON "public"."chi_phi" USING ("public"."la_quan_ly"()) WITH CHECK ("public"."la_quan_ly"());



CREATE POLICY "ql" ON "public"."link_danh_gia" USING ("public"."la_quan_ly"()) WITH CHECK ("public"."la_quan_ly"());



ALTER TABLE "public"."sticker_cong_tru" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sua" ON "public"."buoi_hoc" FOR UPDATE USING ("public"."la_nhan_vien"()) WITH CHECK ("public"."la_nhan_vien"());



CREATE POLICY "sua" ON "public"."tai_khoan" FOR UPDATE USING ((("vai_tro" = ANY (ARRAY['giao_vien'::"text", 'tro_giang'::"text"])) AND (("public"."vai_tro"() = 'admin'::"text") OR ("public"."la_quan_ly"() AND ("vai_tro" = 'tro_giang'::"text")))));



ALTER TABLE "public"."tai_khoan" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "them" ON "public"."anh_buoi" FOR INSERT WITH CHECK ("public"."la_nhan_vien"());



CREATE POLICY "them" ON "public"."buoi_hoc" FOR INSERT WITH CHECK ("public"."la_nhan_vien"());



CREATE POLICY "them" ON "public"."sticker_cong_tru" FOR INSERT WITH CHECK (("public"."la_nhan_vien"() AND ("ngay" = (("now"() AT TIME ZONE 'Asia/Ho_Chi_Minh'::"text"))::"date")));



ALTER TABLE "public"."tom_tat_danh_gia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tro_giang_buoi" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "xoa" ON "public"."anh_buoi" FOR DELETE USING ("public"."la_quan_ly"());



CREATE POLICY "xoa" ON "public"."buoi_hoc" FOR DELETE USING ("public"."la_quan_ly"());



CREATE POLICY "xoa" ON "public"."danh_gia" FOR DELETE USING ("public"."la_quan_ly"());



CREATE POLICY "xoa" ON "public"."sticker_cong_tru" FOR DELETE USING ("public"."la_nhan_vien"());





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































REVOKE ALL ON FUNCTION "public"."chot_so"("thang" "date") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."chot_so"("thang" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."chot_so"("thang" "date") TO "service_role";



REVOKE ALL ON FUNCTION "public"."da_doi_mat_khau"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."da_doi_mat_khau"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."da_doi_mat_khau"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."ds_tro_giang"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."ds_tro_giang"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ds_tro_giang"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."dung_luong_anh"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."dung_luong_anh"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."dung_luong_anh"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."email_dang_nhap"("dinh_danh" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."email_dang_nhap"("dinh_danh" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."email_dang_nhap"("dinh_danh" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."email_dang_nhap"("dinh_danh" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."ghi_dang_nhap"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."ghi_dang_nhap"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ghi_dang_nhap"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."gop_hoc_sinh"("p_giu" "uuid", "p_bo" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."gop_hoc_sinh"("p_giu" "uuid", "p_bo" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gop_hoc_sinh"("p_giu" "uuid", "p_bo" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."gui_danh_gia"("p_ma" "text", "p_lop" "uuid", "p_hoc_sinh" "uuid", "p_khoa_hoc" "text", "p_kho_khan" "text", "p_tro_giang" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."gui_danh_gia"("p_ma" "text", "p_lop" "uuid", "p_hoc_sinh" "uuid", "p_khoa_hoc" "text", "p_kho_khan" "text", "p_tro_giang" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."gui_danh_gia"("p_ma" "text", "p_lop" "uuid", "p_hoc_sinh" "uuid", "p_khoa_hoc" "text", "p_kho_khan" "text", "p_tro_giang" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gui_danh_gia"("p_ma" "text", "p_lop" "uuid", "p_hoc_sinh" "uuid", "p_khoa_hoc" "text", "p_kho_khan" "text", "p_tro_giang" "jsonb") TO "service_role";



REVOKE ALL ON FUNCTION "public"."kiem_tra_khoa"("ngay" "date") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."kiem_tra_khoa"("ngay" "date") TO "service_role";



REVOKE ALL ON FUNCTION "public"."la_nhan_vien"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."la_nhan_vien"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."la_nhan_vien"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."la_quan_ly"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."la_quan_ly"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."la_quan_ly"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."luong_tro_giang"("tu" "date", "den" "date") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."luong_tro_giang"("tu" "date", "den" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."luong_tro_giang"("tu" "date", "den" "date") TO "service_role";



REVOKE ALL ON FUNCTION "public"."ma_hs_tu_stt"("n" bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."ma_hs_tu_stt"("n" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."ma_hs_tu_stt"("n" bigint) TO "service_role";



REVOKE ALL ON FUNCTION "public"."mo_khoa"("thang" "date", "ly_do" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."mo_khoa"("thang" "date", "ly_do" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mo_khoa"("thang" "date", "ly_do" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."ngay_cua"("bang" "text", "r" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."ngay_cua"("bang" "text", "r" "jsonb") TO "service_role";



REVOKE ALL ON FUNCTION "public"."phieu_danh_gia"("p_ma" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."phieu_danh_gia"("p_ma" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."phieu_danh_gia"("p_ma" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."phieu_danh_gia"("p_ma" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."sinh_buoi_thang"("thang" "date") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."sinh_buoi_thang"("thang" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sinh_buoi_thang"("thang" "date") TO "service_role";



REVOKE ALL ON FUNCTION "public"."sinh_ma_hs"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."sinh_ma_hs"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sinh_ma_hs"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."thang_cua_ma"("p_ma" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."thang_cua_ma"("p_ma" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."trg_chan_buoi_nghi"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "public"."trg_gia_tro_giang"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."trg_gia_tro_giang"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."trg_goi_khong_am"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "public"."trg_khoa_so"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."trg_khoa_so"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."trg_lop_nghi_xoa"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "public"."trg_nguoi_ghi_sticker"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "public"."trg_nhat_ky"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "public"."vai_tro"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."vai_tro"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."vai_tro"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."xoa_lop"("p_lop" "uuid", "p_ten" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."xoa_lop"("p_lop" "uuid", "p_ten" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."xoa_lop"("p_lop" "uuid", "p_ten" "text") TO "service_role";


















GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."anh_buoi" TO "anon";
GRANT ALL ON TABLE "public"."anh_buoi" TO "authenticated";
GRANT ALL ON TABLE "public"."anh_buoi" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."buoi_hoc" TO "anon";
GRANT ALL ON TABLE "public"."buoi_hoc" TO "authenticated";
GRANT ALL ON TABLE "public"."buoi_hoc" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."chi_phi" TO "anon";
GRANT ALL ON TABLE "public"."chi_phi" TO "authenticated";
GRANT ALL ON TABLE "public"."chi_phi" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."danh_gia" TO "anon";
GRANT SELECT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."danh_gia" TO "authenticated";
GRANT ALL ON TABLE "public"."danh_gia" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."diem_danh" TO "anon";
GRANT ALL ON TABLE "public"."diem_danh" TO "authenticated";
GRANT ALL ON TABLE "public"."diem_danh" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."ghi_danh" TO "anon";
GRANT ALL ON TABLE "public"."ghi_danh" TO "authenticated";
GRANT ALL ON TABLE "public"."ghi_danh" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."goi_hoc" TO "anon";
GRANT ALL ON TABLE "public"."goi_hoc" TO "authenticated";
GRANT ALL ON TABLE "public"."goi_hoc" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hoc_sinh" TO "anon";
GRANT ALL ON TABLE "public"."hoc_sinh" TO "authenticated";
GRANT ALL ON TABLE "public"."hoc_sinh" TO "service_role";



GRANT SELECT,USAGE ON SEQUENCE "public"."hoc_sinh_ma_seq" TO "authenticated";
GRANT SELECT,USAGE ON SEQUENCE "public"."hoc_sinh_ma_seq" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."khoa_so" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."khoa_so" TO "authenticated";
GRANT ALL ON TABLE "public"."khoa_so" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."link_danh_gia" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."link_danh_gia" TO "authenticated";
GRANT ALL ON TABLE "public"."link_danh_gia" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lop" TO "anon";
GRANT ALL ON TABLE "public"."lop" TO "authenticated";
GRANT ALL ON TABLE "public"."lop" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."nhat_ky" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."nhat_ky" TO "authenticated";
GRANT ALL ON TABLE "public"."nhat_ky" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."nhat_ky_chot_so" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."nhat_ky_chot_so" TO "authenticated";
GRANT ALL ON TABLE "public"."nhat_ky_chot_so" TO "service_role";



GRANT SELECT,USAGE ON SEQUENCE "public"."nhat_ky_chot_so_id_seq" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."phieu_thu" TO "anon";
GRANT ALL ON TABLE "public"."phieu_thu" TO "authenticated";
GRANT ALL ON TABLE "public"."phieu_thu" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."sticker_cong_tru" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."sticker_cong_tru" TO "authenticated";
GRANT ALL ON TABLE "public"."sticker_cong_tru" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tai_khoan" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tai_khoan" TO "authenticated";
GRANT ALL ON TABLE "public"."tai_khoan" TO "service_role";



GRANT UPDATE("ho_ten") ON TABLE "public"."tai_khoan" TO "authenticated";



GRANT UPDATE("don_gia_buoi") ON TABLE "public"."tai_khoan" TO "authenticated";



GRANT UPDATE("hoat_dong") ON TABLE "public"."tai_khoan" TO "authenticated";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tom_tat_danh_gia" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tom_tat_danh_gia" TO "authenticated";
GRANT ALL ON TABLE "public"."tom_tat_danh_gia" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tong_sticker" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tong_sticker" TO "authenticated";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tong_sticker" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tro_giang_buoi" TO "anon";
GRANT ALL ON TABLE "public"."tro_giang_buoi" TO "service_role";
GRANT DELETE ON TABLE "public"."tro_giang_buoi" TO "authenticated";



GRANT SELECT("buoi_id"),INSERT("buoi_id") ON TABLE "public"."tro_giang_buoi" TO "authenticated";



GRANT SELECT("tro_giang_id"),INSERT("tro_giang_id") ON TABLE "public"."tro_giang_buoi" TO "authenticated";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";




































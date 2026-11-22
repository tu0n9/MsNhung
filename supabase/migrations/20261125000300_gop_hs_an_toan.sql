-- Siết an toàn gop_hoc_sinh:
-- 1. Khoá 2 hồ sơ theo thứ tự id tăng dần để tránh deadlock AB-BA.
-- 2. Chặn gộp nếu 2 hồ sơ có điểm danh trùng cùng buổi ở tháng đã chốt sổ (tránh sửa/xoá điểm danh tháng đã chốt).
-- 3. Dọn điểm danh rác còn sót trên buổi lop_nghi = true trước khi gộp để không vướng trigger chan_buoi_nghi.
-- 4. Luôn hạ cờ msnhung.dang_gop_hs về '0' trước khi thoát (cả khi thành công lẫn khi văng lỗi).
create or replace function gop_hoc_sinh(p_giu uuid, p_bo uuid) returns text language plpgsql security definer set search_path = public as $$
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

  -- Gộp ghi danh: lớp trùng giữ ngày vào sớm hơn, ưu tiên đang học và giữ giá riêng nếu có
  update ghi_danh g1 set
    ngay_vao = least(g1.ngay_vao, g2.ngay_vao),
    trang_thai = case when g1.trang_thai = 'dang_hoc' or g2.trang_thai = 'dang_hoc' then 'dang_hoc' else 'ngung' end,
    don_gia_rieng = coalesce(g1.don_gia_rieng, g2.don_gia_rieng)
  from ghi_danh g2
  where g1.hoc_sinh_id = p_giu and g2.hoc_sinh_id = p_bo and g1.lop_id = g2.lop_id;

  delete from ghi_danh g2
  where g2.hoc_sinh_id = p_bo
    and exists (select 1 from ghi_danh g1 where g1.hoc_sinh_id = p_giu and g1.lop_id = g2.lop_id);

  update ghi_danh set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;

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
    trang_thai = case when giu.trang_thai = 'dang_hoc' or bo.trang_thai = 'dang_hoc' then 'dang_hoc' else 'ngung' end
  where id = p_giu;

  delete from hoc_sinh where id = p_bo;
  perform set_config('msnhung.dang_gop_hs', '0', true);
  return anh_thua;
exception when others then
  perform set_config('msnhung.dang_gop_hs', '0', true);
  raise;
end $$;

revoke execute on function gop_hoc_sinh(uuid, uuid) from public, anon;
grant execute on function gop_hoc_sinh(uuid, uuid) to authenticated, service_role;

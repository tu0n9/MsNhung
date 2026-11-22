-- Gộp 128 hồ sơ trùng tên thành 65 học sinh, áp bảng đơn giá chuẩn trung tâm,
-- đồng thời hỗ trợ tuỳ chọn ghi đè đơn giá riêng theo từng ghi_danh (trường hợp ca đặc biệt như Minh Trang)
-- và lưu tổng tiền từng tháng cố định trên goi_hoc khi học sinh học nhiều lớp khác giá.

-- ============ 1. Mở rộng schema tương thích ngược ============
alter table ghi_danh add column don_gia_rieng int check (don_gia_rieng >= 0);
alter table goi_hoc add column tien_thang jsonb;

-- ============ 2. Cập nhật RPC gop_hoc_sinh giữ don_gia_rieng khi gộp cùng lớp ============
create or replace function gop_hoc_sinh(p_giu uuid, p_bo uuid) returns text language plpgsql security definer set search_path = public as $$
declare
  giu hoc_sinh%rowtype;
  bo hoc_sinh%rowtype;
  anh_thua text;
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  if p_giu is null or p_bo is null or p_giu = p_bo then raise exception 'Chọn hai học sinh khác nhau để gộp'; end if;
  select * into giu from hoc_sinh where id = p_giu for update;
  select * into bo from hoc_sinh where id = p_bo for update;
  if giu.id is null or bo.id is null then raise exception 'Không tìm thấy học sinh'; end if;

  if exists (
    select 1 from goi_hoc g1 join goi_hoc g2 on g1.hoc_sinh_id = p_giu and g2.hoc_sinh_id = p_bo
    where g1.thang_bat_dau < (g2.thang_bat_dau + make_interval(months => g2.so_thang))
      and g2.thang_bat_dau < (g1.thang_bat_dau + make_interval(months => g1.so_thang))
  ) then
    raise exception 'Hai học sinh đều có gói học phủ chung tháng. Hãy kiểm tra hoặc xoá gói trùng trước khi gộp';
  end if;

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
  return anh_thua;
end $$;

revoke execute on function gop_hoc_sinh(uuid, uuid) from public, anon;
grant execute on function gop_hoc_sinh(uuid, uuid) to authenticated, service_role;

-- ============ 3. Gộp hồ sơ trùng tên & cập nhật bảng đơn giá chuẩn (tắt tạm trigger nhat_ky trên 5 bảng) ============
alter table hoc_sinh disable trigger nhat_ky;
alter table ghi_danh disable trigger nhat_ky;
alter table goi_hoc disable trigger nhat_ky;
alter table chi_phi disable trigger nhat_ky;
alter table sticker_cong_tru disable trigger nhat_ky;

do $$
declare
  nhom record;
  bo_id uuid;
  giu hoc_sinh%rowtype;
  bo hoc_sinh%rowtype;
begin
  -- Chuẩn hoá khoảng trắng họ tên
  update hoc_sinh set ho_ten = trim(regexp_replace(ho_ten, '\s+', ' ', 'g'))
  where ho_ten <> trim(regexp_replace(ho_ten, '\s+', ' ', 'g'));

  -- Gộp mọi nhóm trùng họ tên (dữ liệu hiện tại không có ai trùng tên khác người)
  for nhom in
    select
      replace(lower(trim(regexp_replace(ho_ten, '\s+', ' ', 'g'))), 'uỳ', 'ùy') as ten_chuan,
      (array_agg(id order by (trang_thai = 'dang_hoc') desc, (avatar is not null) desc, (link_zalo is not null) desc, ngay_vao asc, ma_hs asc, id asc))[1] as id_giu,
      (array_agg(id order by (trang_thai = 'dang_hoc') desc, (avatar is not null) desc, (link_zalo is not null) desc, ngay_vao asc, ma_hs asc, id asc))[2:] as ds_bo
    from hoc_sinh
    group by 1
    having count(*) > 1
  loop
    foreach bo_id in array nhom.ds_bo loop
      -- Bỏ qua nếu 2 hồ sơ đều có gói học chồng tháng (an toàn khi chạy lại / dữ liệu thật khác)
      if exists (
        select 1 from goi_hoc g1 join goi_hoc g2 on g1.hoc_sinh_id = nhom.id_giu and g2.hoc_sinh_id = bo_id
        where g1.thang_bat_dau < (g2.thang_bat_dau + make_interval(months => g2.so_thang))
          and g2.thang_bat_dau < (g1.thang_bat_dau + make_interval(months => g1.so_thang))
      ) then
        continue;
      end if;

      select * into giu from hoc_sinh where id = nhom.id_giu for update;
      select * into bo from hoc_sinh where id = bo_id for update;
      if giu.id is null or bo.id is null then continue; end if;

      update ghi_danh g1 set
        ngay_vao = least(g1.ngay_vao, g2.ngay_vao),
        trang_thai = case when g1.trang_thai = 'dang_hoc' or g2.trang_thai = 'dang_hoc' then 'dang_hoc' else 'ngung' end,
        don_gia_rieng = coalesce(g1.don_gia_rieng, g2.don_gia_rieng)
      from ghi_danh g2
      where g1.hoc_sinh_id = giu.id and g2.hoc_sinh_id = bo.id and g1.lop_id = g2.lop_id;

      delete from ghi_danh g2
      where g2.hoc_sinh_id = bo.id
        and exists (select 1 from ghi_danh g1 where g1.hoc_sinh_id = giu.id and g1.lop_id = g2.lop_id);

      update ghi_danh set hoc_sinh_id = giu.id where hoc_sinh_id = bo.id;

      update diem_danh d1 set
        trang_thai = case
          when d1.trang_thai = 'co_mat' or d2.trang_thai = 'co_mat' then 'co_mat'
          when d1.trang_thai = 'hoc_bu' or d2.trang_thai = 'hoc_bu' then 'hoc_bu'
          else 'vang'
        end,
        sticker = d1.sticker + d2.sticker
      from diem_danh d2
      where d1.hoc_sinh_id = giu.id and d2.hoc_sinh_id = bo.id and d1.buoi_id = d2.buoi_id;

      delete from diem_danh d2
      where d2.hoc_sinh_id = bo.id
        and exists (select 1 from diem_danh d1 where d1.hoc_sinh_id = giu.id and d1.buoi_id = d2.buoi_id);

      update diem_danh set hoc_sinh_id = giu.id where hoc_sinh_id = bo.id;
      update sticker_cong_tru set hoc_sinh_id = giu.id where hoc_sinh_id = bo.id;
      update goi_hoc set hoc_sinh_id = giu.id where hoc_sinh_id = bo.id;
      update chi_phi set hoc_sinh_id = giu.id where hoc_sinh_id = bo.id;

      update danh_gia d2 set hoc_sinh_id = null
      where d2.hoc_sinh_id = bo.id
        and exists (select 1 from danh_gia d1 where d1.hoc_sinh_id = giu.id and d1.thang = d2.thang);

      update danh_gia set hoc_sinh_id = giu.id where hoc_sinh_id = bo.id;

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
      where id = giu.id;

      delete from hoc_sinh where id = bo.id;
    end loop;
  end loop;

  -- Áp đơn giá chuẩn theo bảng trung tâm (65 học sinh)
  update hoc_sinh set don_gia = case replace(lower(trim(regexp_replace(ho_ten, '\s+', ' ', 'g'))), 'uỳ', 'ùy')
    when 'ánh long' then 150000
    when 'bảo hân' then 150000
    when 'bùi ngọc hà' then 150000
    when 'đặng an bình' then 150000
    when 'đặng bảo an' then 150000
    when 'đinh bá quang anh' then 150000
    when 'đỗ hoàng tùy' then 150000
    when 'đỗ hoàng thùy' then 150000
    when 'đỗ kim ngân' then 150000
    when 'đỗ phương thu' then 150000
    when 'đỗ thùy linh' then 150000
    when 'hà đoàn nhật hoàng' then 150000
    when 'hoàng mai phương' then 150000
    when 'hoàng trung đức' then 150000
    when 'hoàng trung hải' then 150000
    when 'khuất hoàng an' then 150000
    when 'lê danh gia bảo' then 150000
    when 'lê duy anh' then 150000
    when 'lê minh huy' then 150000
    when 'lê tiến anh' then 150000
    when 'lương minh quân' then 150000
    when 'nguyễn gia bảo' then 150000
    when 'nguyễn hà giang' then 150000
    when 'nguyễn hải đăng' then 150000
    when 'nguyễn ngọc châu an' then 150000
    when 'nguyễn ngọc quân' then 150000
    when 'nguyễn tự huy' then 150000
    when 'nhật duy' then 150000
    when 'phạm bảo anh' then 150000
    when 'phạm minh khôi' then 150000
    when 'phạm ngọc anh' then 150000
    when 'phạm nhật linh (sam)' then 150000
    when 'trần gia bảo' then 150000
    when 'trần gia khiêm (voi)' then 150000
    when 'trần gia minh' then 150000
    when 'trần gia nghĩa (ỉn)' then 150000
    when 'trịnh ngọc bảo anh' then 150000
    when 'trịnh ngọc bảo trân' then 150000
    when 'tú anh' then 150000
    when 'tùng lâm' then 150000
    when 'vũ dương bảo an' then 150000
    when 'vũ hải hà' then 150000
    when 'vũ quốc tùng' then 150000
    when 'chu bảo ngân' then 200000
    when 'hoàng diệu linh' then 200000
    when 'lê anh thư' then 200000
    when 'lê thị anh thư' then 200000
    when 'lê hồng ngọc' then 200000
    when 'nguyễn đăng dương' then 200000
    when 'nguyễn hải sơn' then 200000
    when 'nguyễn thế hiếu' then 200000
    when 'nguyễn thị ngọc' then 200000
    when 'phạm sương mai' then 200000
    when 'phạm thị vân anh' then 200000
    when 'phạm trí thành' then 200000
    when 'thảo chi' then 200000
    when 'ngô thảo chi' then 200000
    when 'vũ hải long' then 200000
    when 'bùi bách' then 400000
    when 'gia khánh' then 400000
    when 'gia minh' then 400000
    when 'hải hiếu' then 400000
    when 'hoàng anh tuấn' then 400000
    when 'hoàng tuấn' then 400000
    when 'lâm tùng' then 400000
    when 'nam phong' then 400000
    when 'ngọc minh' then 400000
    when 'minh trang' then 500000
    when 'nguyễn trung dũng' then 1000000
    when 'trung dũng' then 1000000
    else don_gia
  end
  where true;

  -- Giá riêng từng lớp cho 2 học sinh học ca đặc biệt khác mức giá chính
  update ghi_danh gd set don_gia_rieng = 1000000
  from hoc_sinh h, lop l
  where gd.hoc_sinh_id = h.id and gd.lop_id = l.id
    and lower(trim(h.ho_ten)) = 'minh trang' and trim(l.ten) = '1-1 Minh Trang (1)';

  update ghi_danh gd set don_gia_rieng = 1000000
  from hoc_sinh h, lop l
  where gd.hoc_sinh_id = h.id and gd.lop_id = l.id
    and lower(trim(h.ho_ten)) = 'ngọc minh' and trim(l.ten) = '1-1 Ngọc Minh';
end $$;

alter table hoc_sinh enable trigger nhat_ky;
alter table ghi_danh enable trigger nhat_ky;
alter table goi_hoc enable trigger nhat_ky;
alter table chi_phi enable trigger nhat_ky;
alter table sticker_cong_tru enable trigger nhat_ky;

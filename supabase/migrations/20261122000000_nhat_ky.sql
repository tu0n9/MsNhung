-- Nhật ký thao tác (người dùng chốt 2026-11-20, docs/YEU-CAU.md mục "Nhật ký thao tác").
-- Ghi bằng trigger nên không phụ thuộc client: thêm / sửa / xoá qua app, Edge Function hay script đều có dòng.

create table nhat_ky (
  id bigint generated always as identity primary key,
  luc timestamptz not null default now(),
  nguoi uuid,      -- null = Hệ thống (service role: Edge Function, script); không khoá ngoại để xoá tài khoản vẫn giữ vết
  ten_nguoi text,  -- chụp lúc ghi, như sticker_cong_tru
  bang text not null,
  hanh_dong text not null check (hanh_dong in ('them', 'sua', 'xoa', 'dang_nhap', 'chot', 'mo_khoa')),
  doi_tuong text,  -- nhãn cho người đọc: tên học sinh, lớp + ngày buổi, mục chi...
  thay_doi jsonb   -- thêm / xoá: cả dòng; sửa: chỉ cột đổi {cot: [cu, moi]}
);
create index on nhat_ky (luc desc);

create function trg_nhat_ky() returns trigger language plpgsql security definer set search_path = public as $$
declare
  cu jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  moi jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  r jsonb := coalesce(moi, cu);
  doi jsonb := r;
  hd text := case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end;
begin
  -- buổi theo lịch do sinh_buoi_thang tự sinh mỗi tháng, không phải thao tác của ai
  if tg_table_name = 'buoi_hoc' and tg_op = 'INSERT' and r->>'loai' = 'lich' then return null; end if;
  if tg_op = 'UPDATE' then
    select jsonb_object_agg(k, jsonb_build_array(cu->k, moi->k)) into doi
    from jsonb_object_keys(moi) k where cu->k is distinct from moi->k;
    if doi is null then return null; end if;  -- update không đổi gì
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

create trigger nhat_ky after insert or update or delete on sticker_cong_tru for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert or update or delete on tro_giang_buoi for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert or update or delete on buoi_hoc for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert or update or delete on lop for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert or update or delete on hoc_sinh for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert or update or delete on goi_hoc for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert or update or delete on phieu_thu for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert or update or delete on chi_phi for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert or update or delete on tai_khoan for each row execute function trg_nhat_ky();
create trigger nhat_ky after insert on nhat_ky_chot_so for each row execute function trg_nhat_ky();

-- Đăng nhập: client gọi sau khi đăng nhập thành công. Dọn dòng cũ hơn 6 tháng luôn ở đây vì ngày nào cũng có người
-- đăng nhập, khỏi cần job riêng.
-- ponytail: cả tháng không ai đăng nhập thì dòng cũ ở lại lâu hơn 6 tháng một chút, không sai gì; cần đúng hạn thì dùng pg_cron.
create function ghi_dang_nhap() returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Chưa đăng nhập'; end if;
  insert into nhat_ky (nguoi, ten_nguoi, bang, hanh_dong, doi_tuong)
  select id, ho_ten, 'tai_khoan', 'dang_nhap', ho_ten from tai_khoan where id = auth.uid();
  delete from nhat_ky where luc < now() - interval '6 months';
end $$;

-- Chỉ giáo viên đọc; không ai thêm / sửa / xoá qua API (chỉ trigger và hàm trên ghi được).
alter table nhat_ky enable row level security;
create policy doc on nhat_ky for select using (la_quan_ly());
grant select on nhat_ky to authenticated;
grant all on nhat_ky to service_role;

revoke execute on function trg_nhat_ky(), ghi_dang_nhap() from public, anon, authenticated;
grant execute on function ghi_dang_nhap() to authenticated, service_role;

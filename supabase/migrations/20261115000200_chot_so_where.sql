-- Supabase bật pg_safeupdate: UPDATE không có WHERE bị từ chối, kể cả với bảng một dòng khoa_so.
create or replace function chot_so(thang date) returns void language plpgsql security definer set search_path = public as $$
begin
  if not la_quan_ly() then raise exception 'Chỉ giáo viên được chốt sổ'; end if;
  update khoa_so set khoa_den = greatest(khoa_den, date_trunc('month', thang)::date) where id;
  insert into nhat_ky_chot_so (thang, hanh_dong) values (date_trunc('month', thang), 'chot');
end $$;

create or replace function mo_khoa(thang date, ly_do text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not la_quan_ly() then raise exception 'Chỉ giáo viên được mở khoá'; end if;
  if coalesce(trim(ly_do), '') = '' then raise exception 'Phải ghi lý do mở khoá'; end if;
  -- mở tháng M thì các tháng sau M cũng mở, vì chúng phụ thuộc số liệu của M; least() bỏ qua null nên giữ null tường minh
  update khoa_so set khoa_den = case when khoa_den is null then null
    else least(khoa_den, (date_trunc('month', thang) - interval '1 month')::date) end where id;
  insert into nhat_ky_chot_so (thang, hanh_dong, ly_do) values (date_trunc('month', thang), 'mo_khoa', ly_do);
end $$;

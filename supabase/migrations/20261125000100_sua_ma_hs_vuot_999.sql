-- Sửa lỗi lpad(..., 3, '0') cắt chuỗi từ STT 1000 thành '100', gây trùng mã 'HS100' (unique_violation).
-- Giữ đệm 3 chữ số với STT 1..999 (HS001..HS999), từ 1000 trở lên giữ nguyên đủ chữ số (HS1000+).
create or replace function ma_hs_tu_stt(n bigint) returns text language sql immutable set search_path = public as $$
  select case
    when n is null or n < 1 then null
    when n < 1000 then 'HS' || lpad(n::text, 3, '0')
    else 'HS' || n::text
  end
$$;

-- Sinh mã học sinh kế tiếp từ sequence cho DEFAULT cột hoc_sinh.ma_hs mà không phụ thuộc quyền trực tiếp lên sequence.
create or replace function sinh_ma_hs() returns text language sql security definer set search_path = public as $$
  select ma_hs_tu_stt(nextval('hoc_sinh_ma_seq'))
$$;

revoke execute on function ma_hs_tu_stt(bigint), sinh_ma_hs() from public, anon;
grant execute on function ma_hs_tu_stt(bigint), sinh_ma_hs() to authenticated, service_role;

alter table hoc_sinh alter column ma_hs set default sinh_ma_hs();

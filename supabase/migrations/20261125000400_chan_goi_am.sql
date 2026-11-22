-- Chặn lưu gói học có tổng tiền phải thu âm (do tien_du_tru hoặc dieu_chinh âm vượt tổng học phí gốc).
-- Vẫn cho phép gói 0đ hoặc gói có tổng sau giảm trừ đúng bằng 0đ.
create or replace function trg_goi_khong_am() returns trigger language plpgsql security definer set search_path = public as $$
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

drop trigger if exists goi_khong_am on goi_hoc;
create trigger goi_khong_am before insert or update on goi_hoc for each row execute function trg_goi_khong_am();

revoke execute on function trg_goi_khong_am() from public, anon, authenticated;

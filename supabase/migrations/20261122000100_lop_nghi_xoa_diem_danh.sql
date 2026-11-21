-- Lớp nghỉ thì không ai có mặt (người dùng chốt 2026-11-21): đánh "Lớp nghỉ" xoá điểm danh, sticker và trợ giảng của
-- buổi, nếu không thì trợ giảng vẫn được tính lương và học sinh vẫn tính có mặt (lương, số buổi, lưới tháng đều đếm từ
-- các dòng này mà không xét lop_nghi). Làm trong database để app, script hay API đều như nhau. App hỏi lại trước.

create function trg_lop_nghi_xoa() returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from diem_danh where buoi_id = new.id;
  delete from tro_giang_buoi where buoi_id = new.id;
  return null;
end $$;
create trigger lop_nghi_xoa after update of lop_nghi on buoi_hoc
  for each row when (new.lop_nghi and not old.lop_nghi) execute function trg_lop_nghi_xoa();

-- Buổi đang nghỉ thì không ghi điểm danh / trợ giảng mới (màn điểm danh đã ẩn, đây là chốt chặn cuối).
create function trg_chan_buoi_nghi() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from buoi_hoc where id = new.buoi_id and lop_nghi) then
    raise exception 'Buổi này lớp nghỉ, không điểm danh được. Bỏ "Lớp nghỉ" trước.';
  end if;
  return new;
end $$;
create trigger chan_buoi_nghi before insert or update on diem_danh for each row execute function trg_chan_buoi_nghi();
create trigger chan_buoi_nghi before insert or update on tro_giang_buoi for each row execute function trg_chan_buoi_nghi();

revoke execute on function trg_lop_nghi_xoa(), trg_chan_buoi_nghi() from public, anon, authenticated;

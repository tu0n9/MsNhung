-- Bản tóm tắt AI phiếu đánh giá theo (tháng, lớp) (người dùng chốt 2026-11-18, docs/YEU-CAU.md mục "Đánh giá từ
-- học sinh"). Edge Function tom-tat-danh-gia ghi bằng service role; bấm lại thì ghi đè.
-- Xoá lớp thì xoá theo: bản tóm tắt chỉ suy ra từ phiếu, phiếu gốc vẫn giữ trong danh_gia.
create table tom_tat_danh_gia (
  thang date not null,
  lop_id uuid not null references lop on delete cascade,
  noi_dung jsonb not null,
  so_phieu int not null,
  tao_luc timestamptz not null default now(),
  primary key (thang, lop_id)
);

alter table tom_tat_danh_gia enable row level security;
-- không có policy ghi: chỉ Edge Function (service role) ghi
create policy doc on tom_tat_danh_gia for select using (la_quan_ly());
grant select on tom_tat_danh_gia to authenticated;
grant all on tom_tat_danh_gia to service_role;

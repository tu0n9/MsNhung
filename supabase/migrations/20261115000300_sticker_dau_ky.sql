-- Học sinh chuyển từ sổ giấy sang đã có sticker tích luỹ; tổng sticker = sticker_dau_ky + tổng sticker các buổi.
alter table hoc_sinh add column sticker_dau_ky integer not null default 0 check (sticker_dau_ky >= 0);

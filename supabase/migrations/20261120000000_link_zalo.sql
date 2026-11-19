-- Link nhóm Zalo của từng học sinh (docs/YEU-CAU.md mục "Link nhóm Zalo"). Ghi theo policy sẵn có: chỉ quản lý.
alter table hoc_sinh add column link_zalo text check (link_zalo ~ '^https://zalo\.me/\S+$');

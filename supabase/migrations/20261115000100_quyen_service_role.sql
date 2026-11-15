-- Project tắt tự cấp quyền bảng mới, nên service_role (script tạo admin, Edge Function tài khoản) cũng cần cấp tay.
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Dftljq24dyy92NsuQgK8ugwdqM1WuGDR1TwfZLLZzENS9ahAO0Zv2lzNTImrhsl

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at", "custom_claims_allowlist") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	43d2ab0d-e902-49d7-9e81-a3696d296ad2	authenticated	authenticated	admin@msnhung.local	$2a$10$BCdkciwG3PPPv4yCMa50oefbpbFKmU9xlXou.UTQCXONcdSKZxnAO	2026-11-15 10:27:58.76274+00	\N		\N		\N			\N	2026-11-17 02:36:52.543077+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:27:58.741954+00	2026-11-17 06:47:22.788412+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
43d2ab0d-e902-49d7-9e81-a3696d296ad2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{"sub": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "email": "admin@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-15 10:27:58.754339+00	2026-11-15 10:27:58.754416+00	2026-11-15 10:27:58.754416+00	b50362a3-6fb0-4a13-ae11-da1f5fee0d56
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
746cbfea-3770-48fc-a471-2ebe09672757	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-16 17:01:48.31819+00	2026-11-17 04:56:36.967614+00	\N	aal1	\N	2026-11-17 04:56:36.967486	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	183.80.97.88	\N	\N	\N	\N	\N
c2460055-c65b-4426-9ff8-78c2cbd04b23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 02:36:52.549361+00	2026-11-17 06:47:22.81433+00	\N	aal1	\N	2026-11-17 06:47:22.814205	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Mobile/15E148 Safari/604.1	117.1.90.139	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
746cbfea-3770-48fc-a471-2ebe09672757	2026-11-16 17:01:48.338265+00	2026-11-16 17:01:48.338265+00	password	769fe5b6-ebfa-458f-8bd3-c58c844d5263
c2460055-c65b-4426-9ff8-78c2cbd04b23	2026-11-17 02:36:52.610111+00	2026-11-17 02:36:52.610111+00	password	951c392b-ac07-409d-99c1-7640a5dd9ea2
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: mfa_recovery_code_sets; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_recovery_code_sets" ("id", "user_id", "mfa_factor_id", "failed_verification_count", "verification_locked_until", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: mfa_recovery_codes; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_recovery_codes" ("id", "mfa_recovery_code_set_id", "code_hash", "consumed_at", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at", "expires_at", "link_token_hash") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	446	ee33q3c2kstf	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-16 17:01:48.328941+00	2026-11-17 03:20:59.122192+00	\N	746cbfea-3770-48fc-a471-2ebe09672757
00000000-0000-0000-0000-000000000000	448	p7x5r6hjhitb	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 03:20:59.145368+00	2026-11-17 04:56:36.910637+00	ee33q3c2kstf	746cbfea-3770-48fc-a471-2ebe09672757
00000000-0000-0000-0000-000000000000	449	plvijggxiuog	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-17 04:56:36.929061+00	2026-11-17 04:56:36.929061+00	p7x5r6hjhitb	746cbfea-3770-48fc-a471-2ebe09672757
00000000-0000-0000-0000-000000000000	447	svwlk4kblrxy	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 02:36:52.582688+00	2026-11-17 06:47:22.764265+00	\N	c2460055-c65b-4426-9ff8-78c2cbd04b23
00000000-0000-0000-0000-000000000000	450	4ny2vw54cjom	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-17 06:47:22.781046+00	2026-11-17 06:47:22.781046+00	svwlk4kblrxy	c2460055-c65b-4426-9ff8-78c2cbd04b23
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format", "dedicated_scope") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: scim_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."scim_tokens" ("id", "sso_provider_id", "token_hash", "prefix", "created_at", "expires_at", "revoked_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: scim_users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."scim_users" ("id", "sso_provider_id", "user_id", "resource", "created_at", "updated_at", "deleted_at") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_challenges" ("id", "user_id", "challenge_type", "session_data", "created_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_credentials" ("id", "user_id", "credential_id", "public_key", "attestation_type", "aaguid", "sign_count", "transports", "backup_eligible", "backed_up", "friendly_name", "created_at", "updated_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: lop; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."lop" ("id", "ten", "don_gia", "lich", "hoat_dong", "tao_luc", "gio", "gio_thu") FROM stdin;
\.


--
-- Data for Name: buoi_hoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."buoi_hoc" ("id", "lop_id", "ngay", "loai", "lop_nghi", "ghi_chu", "bat_dau", "ket_thuc") FROM stdin;
\.


--
-- Data for Name: anh_buoi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."anh_buoi" ("id", "buoi_id", "duong_dan", "tao_luc") FROM stdin;
\.


--
-- Data for Name: tai_khoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tai_khoan" ("id", "email", "ten_dang_nhap", "so_dien_thoai", "ho_ten", "vai_tro", "phai_doi_mat_khau", "don_gia_buoi", "hoat_dong") FROM stdin;
43d2ab0d-e902-49d7-9e81-a3696d296ad2	admin@msnhung.local	admin	\N	Quản trị	admin	f	0	t
\.


--
-- Data for Name: hoc_sinh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."hoc_sinh" ("id", "ho_ten", "lop_id", "avatar", "ten_phu_huynh", "sdt_phu_huynh", "phu_huynh_id", "ngay_vao", "don_gia_rieng", "trang_thai", "ghi_chu", "tao_luc", "sticker_dau_ky") FROM stdin;
\.


--
-- Data for Name: chi_phi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."chi_phi" ("id", "ngay", "danh_muc", "so_tien", "ghi_chu", "hoc_sinh_id") FROM stdin;
\.


--
-- Data for Name: diem_danh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."diem_danh" ("buoi_id", "hoc_sinh_id", "trang_thai", "sticker") FROM stdin;
\.


--
-- Data for Name: goi_hoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."goi_hoc" ("id", "hoc_sinh_id", "thang_bat_dau", "so_thang", "don_gia", "buoi_du_kien", "tien_du_tru", "dieu_chinh", "ly_do_dieu_chinh", "tao_luc") FROM stdin;
\.


--
-- Data for Name: khoa_so; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."khoa_so" ("id", "khoa_den") FROM stdin;
t	\N
\.


--
-- Data for Name: nhat_ky_chot_so; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."nhat_ky_chot_so" ("id", "thang", "hanh_dong", "ly_do", "nguoi", "luc") FROM stdin;
\.


--
-- Data for Name: phieu_thu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."phieu_thu" ("id", "goi_id", "so_tien", "ngay_thu", "hinh_thuc", "ghi_chu", "nguoi_thu", "tao_luc") FROM stdin;
\.


--
-- Data for Name: tro_giang_buoi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tro_giang_buoi" ("buoi_id", "tro_giang_id", "don_gia") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type", "versioning_status", "lifecycle_configuration", "lifecycle_configuration_generation") FROM stdin;
anh	anh	\N	2026-11-15 10:27:45.666885+00	2026-11-15 10:27:45.666885+00	f	f	\N	\N	\N	STANDARD	DISABLED	\N	\N
\.


--
-- Data for Name: bucket_lifecycle_states; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."bucket_lifecycle_states" ("bucket_id", "generation", "next_run_at", "claim_id", "claim_until", "continuation", "last_started_at", "last_completed_at", "last_success_at", "last_result", "failure_count", "last_error", "updated_at") FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: lifecycle_abandoned_artifacts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."lifecycle_abandoned_artifacts" ("bucket_id", "key", "name", "version", "attempted_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "archived_at", "is_delete_marker", "is_versioned") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata", "metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 450, true);


--
-- Name: nhat_ky_chot_so_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nhat_ky_chot_so_id_seq"', 110, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict Dftljq24dyy92NsuQgK8ugwdqM1WuGDR1TwfZLLZzENS9ahAO0Zv2lzNTImrhsl

RESET ALL;

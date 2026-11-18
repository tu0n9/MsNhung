SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 4dZMgRHlpgxQoufgGemudvTPdN1LOzrbXhynla1cZLVfdFNEQhWsSL4flrL4k2V

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
00000000-0000-0000-0000-000000000000	43d2ab0d-e902-49d7-9e81-a3696d296ad2	authenticated	authenticated	admin@msnhung.local	$2a$10$BCdkciwG3PPPv4yCMa50oefbpbFKmU9xlXou.UTQCXONcdSKZxnAO	2026-11-15 10:27:58.76274+00	\N		\N		\N			\N	2026-11-17 15:42:02.703463+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:27:58.741954+00	2026-11-17 17:33:42.294683+00	\N	\N			\N		0	\N		\N	f	\N	f
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
c2460055-c65b-4426-9ff8-78c2cbd04b23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 02:36:52.549361+00	2026-11-17 09:06:27.326016+00	\N	aal1	\N	2026-11-17 09:06:27.325883	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Mobile/15E148 Safari/604.1	117.1.90.139	\N	\N	\N	\N	\N
0195eace-3807-4800-bf59-60f53413fd0f	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:18:58.881474+00	2026-11-17 13:18:58.881474+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0.1 Mobile/15E148 Safari/604.1	14.226.20.201	\N	\N	\N	\N	\N
2f4437ba-02f4-4fb9-978e-7eb08064df4c	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 15:42:02.704151+00	2026-11-17 15:42:02.704151+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	42.113.16.7	\N	\N	\N	\N	\N
746cbfea-3770-48fc-a471-2ebe09672757	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-16 17:01:48.31819+00	2026-11-17 17:33:42.318889+00	\N	aal1	\N	2026-11-17 17:33:42.318756	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	183.80.97.88	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
746cbfea-3770-48fc-a471-2ebe09672757	2026-11-16 17:01:48.338265+00	2026-11-16 17:01:48.338265+00	password	769fe5b6-ebfa-458f-8bd3-c58c844d5263
c2460055-c65b-4426-9ff8-78c2cbd04b23	2026-11-17 02:36:52.610111+00	2026-11-17 02:36:52.610111+00	password	951c392b-ac07-409d-99c1-7640a5dd9ea2
0195eace-3807-4800-bf59-60f53413fd0f	2026-11-17 13:18:58.934566+00	2026-11-17 13:18:58.934566+00	password	f27f2afe-77cf-4f92-afcd-04ae777d18f8
2f4437ba-02f4-4fb9-978e-7eb08064df4c	2026-11-17 15:42:02.730934+00	2026-11-17 15:42:02.730934+00	password	f2117415-6c4a-47e0-9766-8b939a7b83d9
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
00000000-0000-0000-0000-000000000000	447	svwlk4kblrxy	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 02:36:52.582688+00	2026-11-17 06:47:22.764265+00	\N	c2460055-c65b-4426-9ff8-78c2cbd04b23
00000000-0000-0000-0000-000000000000	450	4ny2vw54cjom	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 06:47:22.781046+00	2026-11-17 09:06:27.271685+00	svwlk4kblrxy	c2460055-c65b-4426-9ff8-78c2cbd04b23
00000000-0000-0000-0000-000000000000	451	oootony4ln45	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-17 09:06:27.287184+00	2026-11-17 09:06:27.287184+00	4ny2vw54cjom	c2460055-c65b-4426-9ff8-78c2cbd04b23
00000000-0000-0000-0000-000000000000	449	plvijggxiuog	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 04:56:36.929061+00	2026-11-17 09:50:33.851628+00	p7x5r6hjhitb	746cbfea-3770-48fc-a471-2ebe09672757
00000000-0000-0000-0000-000000000000	453	gvb6xfbvt5sx	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-17 13:18:58.914844+00	2026-11-17 13:18:58.914844+00	\N	0195eace-3807-4800-bf59-60f53413fd0f
00000000-0000-0000-0000-000000000000	452	rvzkq3oeafzc	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 09:50:33.867105+00	2026-11-17 13:55:24.667217+00	plvijggxiuog	746cbfea-3770-48fc-a471-2ebe09672757
00000000-0000-0000-0000-000000000000	454	tb2hlepenpxu	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 13:55:24.678994+00	2026-11-17 15:13:29.267691+00	rvzkq3oeafzc	746cbfea-3770-48fc-a471-2ebe09672757
00000000-0000-0000-0000-000000000000	456	hilygpfsjmmm	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-17 15:42:02.717497+00	2026-11-17 15:42:02.717497+00	\N	2f4437ba-02f4-4fb9-978e-7eb08064df4c
00000000-0000-0000-0000-000000000000	455	hsfimpferrmu	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 15:13:29.285819+00	2026-11-17 16:14:03.349733+00	tb2hlepenpxu	746cbfea-3770-48fc-a471-2ebe09672757
00000000-0000-0000-0000-000000000000	457	wrz6liz3e3ga	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-17 16:14:03.366257+00	2026-11-17 17:33:42.263085+00	hsfimpferrmu	746cbfea-3770-48fc-a471-2ebe09672757
00000000-0000-0000-0000-000000000000	458	r6dalxiabtpm	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-17 17:33:42.284841+00	2026-11-17 17:33:42.284841+00	wrz6liz3e3ga	746cbfea-3770-48fc-a471-2ebe09672757
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
bafc8fee-b143-40b2-a06b-ae9a461c8e5a	Lớp Ielts nâng cao	400000	{4,6}	t	2026-11-17 13:21:21.512336+00	\N	{"4": {"bd": "18:30", "kt": "20:30"}, "6": {"bd": "09:00", "kt": "11:30"}}
\.


--
-- Data for Name: buoi_hoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."buoi_hoc" ("id", "lop_id", "ngay", "loai", "lop_nghi", "ghi_chu", "bat_dau", "ket_thuc") FROM stdin;
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-05	lich	f	\N	18:30:00	20:30:00
5d355ba0-130a-4159-8ab3-2e1464e17e50	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-07	lich	f	\N	09:00:00	11:30:00
a572b44b-9082-49d3-b823-1b64a2e2139e	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-12	lich	f	\N	18:30:00	20:30:00
2ffd70cd-0afb-4874-9fd2-27de085d7225	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-14	lich	f	\N	09:00:00	11:30:00
7546fba6-4be9-440e-9ab2-c379d4c471e9	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-19	lich	f	\N	18:30:00	20:30:00
2d39d3bf-403a-4add-b335-932f3f0f7f67	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-21	lich	f	\N	09:00:00	11:30:00
95891a84-ae6b-474c-b54b-452bf5debda7	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-26	lich	f	\N	18:30:00	20:30:00
2b6dc9e8-8717-4df8-95b4-17773a38faff	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-28	lich	f	\N	09:00:00	11:30:00
f6e57378-f553-452e-9d0c-3cd5920181c2	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-17	phu	f	\N	18:30:00	20:30:00
\.


--
-- Data for Name: anh_buoi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."anh_buoi" ("id", "buoi_id", "duong_dan", "tao_luc") FROM stdin;
205627d0-8772-4e5f-9b8b-34c5b0e4773b	f6e57378-f553-452e-9d0c-3cd5920181c2	buoi/f6e57378-f553-452e-9d0c-3cd5920181c2/90519080-c18d-407c-a4ea-b97c733a9440.jpg	2026-11-17 13:36:49.533277+00
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
09426ac0-e7af-47bc-a029-195fcee72b46	Bùi Bách	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/09426ac0-e7af-47bc-a029-195fcee72b46-1794921820760.jpg	\N	\N	\N	2026-11-01	0	dang_hoc	\N	2026-11-17 13:23:40.619385+00	0
2a71aebf-2868-4496-8c0d-26a9c5fdac6d	Gia Khánh	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/2a71aebf-2868-4496-8c0d-26a9c5fdac6d-1794921883142.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:24:43.072064+00	0
6125884c-53f0-45ee-a303-3d03bc111254	Gia Minh	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/6125884c-53f0-45ee-a303-3d03bc111254-1794921934570.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:25:34.500012+00	0
98deb901-bd60-4e1a-94c1-0ab944440ecb	Hải Hiếu	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/98deb901-bd60-4e1a-94c1-0ab944440ecb-1794921993396.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:26:33.273193+00	0
1b364415-27c0-4528-b772-6f9331702874	Hoàng Tuấn	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/1b364415-27c0-4528-b772-6f9331702874-1794922033355.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:27:13.282976+00	0
9c5e27df-2361-46d3-9551-92dc6109c2f5	Lâm Tùng	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/9c5e27df-2361-46d3-9551-92dc6109c2f5-1794922065703.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:27:45.537928+00	0
b3065572-cd6a-4131-bae6-4f0b9ed4f46f	Nam Phong	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/b3065572-cd6a-4131-bae6-4f0b9ed4f46f-1794922100871.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:28:20.821969+00	0
e561c6d5-6fbc-462a-ab2e-e1423f3b692f	Ngọc Minh	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/e561c6d5-6fbc-462a-ab2e-e1423f3b692f-1794922166340.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:29:26.274078+00	0
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
f6e57378-f553-452e-9d0c-3cd5920181c2	09426ac0-e7af-47bc-a029-195fcee72b46	co_mat	8
f6e57378-f553-452e-9d0c-3cd5920181c2	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	co_mat	6
f6e57378-f553-452e-9d0c-3cd5920181c2	6125884c-53f0-45ee-a303-3d03bc111254	co_mat	10
f6e57378-f553-452e-9d0c-3cd5920181c2	98deb901-bd60-4e1a-94c1-0ab944440ecb	co_mat	6
f6e57378-f553-452e-9d0c-3cd5920181c2	1b364415-27c0-4528-b772-6f9331702874	co_mat	6
f6e57378-f553-452e-9d0c-3cd5920181c2	9c5e27df-2361-46d3-9551-92dc6109c2f5	co_mat	8
f6e57378-f553-452e-9d0c-3cd5920181c2	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	co_mat	10
f6e57378-f553-452e-9d0c-3cd5920181c2	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	8
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
032614d0-9319-464f-8ea7-dad6ceb7e9c6	anh	avatar/b3065572-cd6a-4131-bae6-4f0b9ed4f46f-1794922100871.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:28:21.162517+00	2026-11-17 13:28:21.162517+00	2026-11-17 13:28:21.162517+00	{"eTag": "\\"cc9be7468024621dfee89e0ccd901b0a\\"", "size": 66138, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:28:22.000Z", "contentLength": 66138, "httpStatusCode": 200}	9472197d-cbbb-4798-bc6f-1f32c45ec955	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
da331209-373c-4e67-988f-3705213411ce	anh	avatar/e561c6d5-6fbc-462a-ab2e-e1423f3b692f-1794922166340.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:29:26.55453+00	2026-11-17 13:29:26.55453+00	2026-11-17 13:29:26.55453+00	{"eTag": "\\"37c383c52df93dfade9f5cd18b8d6d1c\\"", "size": 31871, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:29:27.000Z", "contentLength": 31871, "httpStatusCode": 200}	541c4b5f-aa92-4574-a2fc-0906ab05f3ac	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
66330ff4-1eb2-4a28-b7ee-c34326daf455	anh	buoi/f6e57378-f553-452e-9d0c-3cd5920181c2/90519080-c18d-407c-a4ea-b97c733a9440.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:36:49.224042+00	2026-11-17 13:36:49.224042+00	2026-11-17 13:36:49.224042+00	{"eTag": "\\"c4517f2c1fc1fc4aaf3f9b6e5b31aade\\"", "size": 519296, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:36:50.000Z", "contentLength": 519296, "httpStatusCode": 200}	77ed8b9f-38d4-4e61-9920-53d810327588	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
6c738786-5fc0-4583-8a0d-ba0ee364c4fb	anh	avatar/09426ac0-e7af-47bc-a029-195fcee72b46-1794921820760.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:23:41.263151+00	2026-11-17 13:23:41.263151+00	2026-11-17 13:23:41.263151+00	{"eTag": "\\"af664b57be1ffcd181441f47b255b0bc\\"", "size": 29581, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:23:42.000Z", "contentLength": 29581, "httpStatusCode": 200}	414fdadb-e697-4f5f-94df-34dded287fde	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
cb0fdf70-da6b-4389-aa9b-14f4914db27d	anh	avatar/2a71aebf-2868-4496-8c0d-26a9c5fdac6d-1794921883142.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:24:43.360443+00	2026-11-17 13:24:43.360443+00	2026-11-17 13:24:43.360443+00	{"eTag": "\\"ec06d6c193de9b68544745b1a4ba9d01\\"", "size": 27786, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:24:44.000Z", "contentLength": 27786, "httpStatusCode": 200}	3aa7df80-697e-4384-9c74-840b56035a86	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
9a930db9-6a42-4e88-a6c7-400228817384	anh	avatar/6125884c-53f0-45ee-a303-3d03bc111254-1794921934570.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:25:34.918926+00	2026-11-17 13:25:34.918926+00	2026-11-17 13:25:34.918926+00	{"eTag": "\\"7e5447db38a6128e82d50c27666b3fea\\"", "size": 61998, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:25:35.000Z", "contentLength": 61998, "httpStatusCode": 200}	8a01a39c-a2b2-4bbf-8bc8-53cf6f09d729	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
1635fd4c-74cc-416e-b363-0b1b63fe4f14	anh	avatar/98deb901-bd60-4e1a-94c1-0ab944440ecb-1794921993396.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:26:33.652882+00	2026-11-17 13:26:33.652882+00	2026-11-17 13:26:33.652882+00	{"eTag": "\\"4954bafc7818a1c79515c8f7f40c05cb\\"", "size": 49024, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:26:34.000Z", "contentLength": 49024, "httpStatusCode": 200}	28225600-b907-473d-8e0d-6177f232c176	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
f5345400-d925-48f5-9a02-3694909f3d8a	anh	avatar/1b364415-27c0-4528-b772-6f9331702874-1794922033355.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:27:13.56512+00	2026-11-17 13:27:13.56512+00	2026-11-17 13:27:13.56512+00	{"eTag": "\\"1f384a634367b343c7fa9b4f2da9a05d\\"", "size": 22690, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:27:14.000Z", "contentLength": 22690, "httpStatusCode": 200}	e4a7ddec-0a11-4cfe-8666-cb918cbfddb5	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
31841a69-d1fd-46d3-8b68-826877ad34b9	anh	avatar/9c5e27df-2361-46d3-9551-92dc6109c2f5-1794922065703.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:27:46.01517+00	2026-11-17 13:27:46.01517+00	2026-11-17 13:27:46.01517+00	{"eTag": "\\"104ac3a775c1f2850f04dd989c6771b8\\"", "size": 62037, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:27:46.000Z", "contentLength": 62037, "httpStatusCode": 200}	4afaed50-abef-4747-8574-513c8dbae2b8	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 458, true);


--
-- Name: nhat_ky_chot_so_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nhat_ky_chot_so_id_seq"', 110, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 4dZMgRHlpgxQoufgGemudvTPdN1LOzrbXhynla1cZLVfdFNEQhWsSL4flrL4k2V

RESET ALL;

SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 1GKXzHpYmOvyNxpNV5PjkIZdjy4rwFxgjVD4sm5jrLvkgbguKqNWng8eg6Ey8dk

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

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
00000000-0000-0000-0000-000000000000	769db48b-ba66-4966-814b-087cf859c802	authenticated	authenticated	2f523f60-c93a-4a0d-b812-0c6ba9e17a08@msnhung.local	$2a$10$ZkIG3JsFZ1pDnT3EqTGIteos2ANPbgCyRxxHA.kmoRSvTHnJ8Dp/6	2026-11-15 10:58:46.848536+00	\N		\N		\N			\N	2026-11-15 16:59:24.971184+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:58:46.8455+00	2026-11-15 16:59:25.032381+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	43d2ab0d-e902-49d7-9e81-a3696d296ad2	authenticated	authenticated	admin@msnhung.local	$2a$10$BCdkciwG3PPPv4yCMa50oefbpbFKmU9xlXou.UTQCXONcdSKZxnAO	2026-11-15 10:27:58.76274+00	\N		\N		\N			\N	2026-11-15 17:00:13.573536+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:27:58.741954+00	2026-11-15 17:00:13.587131+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	eea097e1-f720-4e73-aa73-00c2f454515f	authenticated	authenticated	92f52996-8f53-480c-9330-94b3e2dfeea5@msnhung.local	$2a$10$Rclu/6EsE8IQkcdJ0O5p3OH7cuj/BjZwHPSVT9oXnsOCd4q1PnOhG	2026-11-15 10:56:59.347606+00	\N		\N		\N			\N	2026-11-15 11:11:24.685736+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:56:59.322099+00	2026-11-15 11:11:35.854563+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
43d2ab0d-e902-49d7-9e81-a3696d296ad2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{"sub": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "email": "admin@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-15 10:27:58.754339+00	2026-11-15 10:27:58.754416+00	2026-11-15 10:27:58.754416+00	b50362a3-6fb0-4a13-ae11-da1f5fee0d56
eea097e1-f720-4e73-aa73-00c2f454515f	eea097e1-f720-4e73-aa73-00c2f454515f	{"sub": "eea097e1-f720-4e73-aa73-00c2f454515f", "email": "92f52996-8f53-480c-9330-94b3e2dfeea5@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-15 10:56:59.334453+00	2026-11-15 10:56:59.33451+00	2026-11-15 10:56:59.33451+00	bc8075c1-9aa4-4247-8a08-26c476db0c85
769db48b-ba66-4966-814b-087cf859c802	769db48b-ba66-4966-814b-087cf859c802	{"sub": "769db48b-ba66-4966-814b-087cf859c802", "email": "2f523f60-c93a-4a0d-b812-0c6ba9e17a08@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-15 10:58:46.846787+00	2026-11-15 10:58:46.846853+00	2026-11-15 10:58:46.846853+00	42f0201f-e5b0-4ce3-8c37-a9dcadd52a1c
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
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
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

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
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

COPY "public"."lop" ("id", "ten", "don_gia", "lich", "hoat_dong", "tao_luc", "gio") FROM stdin;
85c61e68-f656-451b-9a37-5cc4042786e1	Test	150000	{1,2,3,4,5,6,0}	t	2026-11-15 10:56:12.353282+00	\N
eefd1528-bb2c-4729-a4f4-1e45c14603ee	Starters 1	120000	{1,3,5}	t	2026-11-15 16:32:42.549429+00	17:30–19:00
baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	Movers 2	150000	{2,4}	t	2026-11-15 16:32:42.549429+00	18:00–19:30
ff52a33a-b42f-4b4d-9b9d-3c36a3469456	Flyers A	180000	{6,0}	t	2026-11-15 16:32:42.549429+00	T7 8:00, CN 9:30
\.


--
-- Data for Name: buoi_hoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."buoi_hoc" ("id", "lop_id", "ngay", "loai", "lop_nghi", "ghi_chu") FROM stdin;
cd66ddfb-0fbe-4d17-b00c-0df0f8e996b0	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-01	lich	f	\N
97ee85da-ff8b-4147-b2c7-264555e10523	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-02	lich	f	\N
1dd5b523-9361-42c0-8114-edf3d04d37c7	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-03	lich	f	\N
4831f09a-36c3-46c3-9fce-e23581f9d1a8	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-04	lich	f	\N
962f755a-2759-4693-a976-eee9a840f2c1	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-05	lich	f	\N
c640c88e-2676-49d0-9b5a-9470159d6804	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-06	lich	f	\N
6dbb2ff3-926e-471c-9281-baa39eb22da9	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-07	lich	f	\N
a47c4b31-3c2f-4ff0-9522-55b4728e646f	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-08	lich	f	\N
b14bd56d-0902-487e-b7c4-92ba053a0b9f	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-09	lich	f	\N
41d446c8-ffe1-4bb6-bf5f-bf5f46d37eda	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-10	lich	f	\N
54388fbc-23a1-430e-8ab0-4c786da309e5	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-11	lich	f	\N
95889fcb-ffe2-4c5c-a438-7017c2742653	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-12	lich	f	\N
bb8925f2-49b6-497e-8578-c7ab3600157b	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-13	lich	f	\N
09299505-9bf5-4d1f-8dfa-de9367725193	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-14	lich	f	\N
2c4e3705-9e27-4fd7-9952-8e36e8c9530a	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-16	lich	f	\N
395d04d0-238e-4e29-8e61-e43b4d3ddf7d	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-17	lich	f	\N
74e27b7d-8b59-4748-bc61-51d987551a3d	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-18	lich	f	\N
43b44371-de5d-42de-8c41-bbfb71734270	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-19	lich	f	\N
4472ce84-63c6-4827-92ab-fe37448a456a	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-20	lich	f	\N
0aff11ed-6036-464d-bd9b-6eb2907b73f0	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-21	lich	f	\N
c664b502-c719-40e1-afd7-1709a7381c1f	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-22	lich	f	\N
b415b59b-82c2-4bad-a2c1-a33892217b4c	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-23	lich	f	\N
0f6eff23-7407-4056-a3f6-caaef28ad867	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-24	lich	f	\N
0005f49a-020e-4b2e-a17d-023e7329a015	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-25	lich	f	\N
bfd7e7a8-262f-49ef-80ba-e6e671395782	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-26	lich	f	\N
81185efa-68e7-4fea-ab56-566eb6df8cfc	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-27	lich	f	\N
a9855224-70df-47be-a23c-090fa6968d2d	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-28	lich	f	\N
266fc490-11cf-44a1-a2dc-535e6b868c9d	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-29	lich	f	\N
40f97e86-f330-4d40-ae37-6df4136e3034	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-30	lich	f	\N
37632d25-b954-4091-aee3-e0c388193fcf	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-15	lich	f	\N
f63caf96-5dc5-4915-aa09-dc7f8cd83f5f	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-02	lich	f	\N
bde31345-8218-4cba-bba8-d4fbd3928779	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-04	lich	f	\N
946a34fa-fb85-487f-931a-0a65bd6e3cea	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-07	lich	f	\N
316f4374-1576-41df-b265-6f94a3dd53fd	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-09	lich	f	\N
82eea5f6-e3c3-4a7f-b9a1-505ae714b088	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-11	lich	f	\N
2ddffd81-f824-4b9e-84fa-86a7ae21f913	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-14	lich	f	\N
abdaefd8-45fe-49dc-8392-769816a81a3b	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-16	lich	f	\N
549ec5b0-fc41-4446-8a6f-e271c745437d	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-18	lich	f	\N
1c1b62f1-4397-4d53-8f54-37810acedd4c	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-21	lich	f	\N
45efd996-4102-42c8-a864-41905f4ee319	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-23	lich	f	\N
f5277ac7-f1c2-49da-87e0-e862afbc2c31	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-25	lich	f	\N
2f2ca267-cba1-4e3e-99fa-433b6397726b	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-28	lich	f	\N
1fc0ec06-cc82-4d35-8c67-675140743b5f	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-16	phu	f	\N
d391b807-7440-4c84-898c-33d3f5692d34	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-09-30	lich	f	\N
14af2fb9-02b7-4735-b63f-69b4ff440e28	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-02	lich	f	\N
4f76c82c-ea52-40b3-9891-1f0bdc50ea24	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-05	lich	f	\N
3c7350cf-fc0b-4312-beb5-f045532ec450	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-07	lich	f	\N
5499cfb1-bee2-4895-a8c2-05eeab25c638	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-09	lich	f	\N
5d0abe0e-d858-4a6a-9fea-be8b4852840e	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-12	lich	f	\N
923d2487-149c-45cb-8bb9-292740c32ac1	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-14	lich	f	\N
1c643604-9c9b-4ae6-b69d-64de6c34a78f	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-16	lich	f	\N
8d09f870-736c-4fa8-a627-f6e365e6be39	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-19	lich	f	\N
5fa74153-623c-4beb-9209-138a43f7c13c	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-21	lich	f	\N
8a8702d9-7bd9-42da-98b4-b710e2d8420b	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-23	lich	f	\N
06a4276e-d149-4ef6-8083-9fba9ad692d0	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-26	lich	f	\N
457f8ae1-db17-4cb2-ba60-40fcd78d080a	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-28	lich	f	\N
94105ead-7f8c-43a7-9750-36714b674ea8	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-10-30	lich	f	\N
bc8c6ff7-0600-4d21-9018-73938255cbb8	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-02	lich	f	\N
d9508564-6175-447c-9cbb-32b80c31cc63	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-04	lich	f	\N
61adcf33-64b2-413b-8a28-1dc2788b44df	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-06	lich	f	\N
4058c048-f55d-415e-83dd-f3ebed4276ff	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-09	lich	f	\N
1b9897b0-affa-4c67-be5a-eb922fd4d044	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-11	lich	f	\N
af81524d-ccb3-420d-9a3f-4cb976e2cff3	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-13	lich	f	\N
f31c7277-9922-49f3-9749-698b7ea4a790	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-16	lich	f	\N
2da0bf83-2e85-461e-b7c6-7006cf50d65a	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-18	lich	f	\N
2e042955-1832-40de-9372-fef65352096c	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-20	lich	f	\N
543f2432-f3a9-439c-bfb2-8a552d5097b8	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-23	lich	f	\N
55847328-6c50-4237-8143-2832ca245922	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-25	lich	f	\N
4233e2fd-f972-4160-a870-e0f31ffc376b	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-27	lich	f	\N
20bcb91e-8391-4992-b188-92e73bb5b20d	eefd1528-bb2c-4729-a4f4-1e45c14603ee	2026-11-30	lich	f	\N
d47af40a-7bd4-4866-ab91-438c6648c51e	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-01	lich	f	\N
9350e893-e978-48c0-bf46-561a562ebfe6	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-03	lich	f	\N
26976bae-8173-4112-b645-97dcd70e4998	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-08	lich	f	\N
544d8372-ed4d-423c-b143-600a050705b1	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-10	lich	f	\N
e77d778f-7a3f-44fa-8fad-621e8969b277	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-15	lich	f	\N
9c4ed9f5-22f2-4b13-b56e-ec1ce0de8616	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-17	lich	f	\N
b7f8f541-7c1d-44ed-b39f-d02066c52a4a	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-22	lich	f	\N
29c806a9-dd9e-41b5-a580-76c1b2205708	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-24	lich	f	\N
296830ce-85cb-420e-b50b-0c54977a47f6	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-09-29	lich	f	\N
9163cf9a-40f1-4d2b-b54e-9305eb9d384a	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-01	lich	f	\N
538cfcc0-9abf-4086-97b8-8220b0653c5d	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-08	lich	f	\N
118fd238-ad8d-4205-99aa-da0ae0915128	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-13	lich	f	\N
f477cc64-0361-4e8b-9e1e-0effe1c696ec	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-15	lich	f	\N
a6e0c06b-79df-496a-866d-4f580d7b9f2f	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-20	lich	f	\N
961d83a6-3586-47aa-83a9-f4b86dc855fa	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-22	lich	f	\N
660aafe7-dfc8-46a2-a2c2-3a42dc215d9e	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-27	lich	f	\N
b8742cd1-c766-4a16-b238-31206e4de024	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-29	lich	f	\N
c05ec7b2-3e4e-4514-a4e8-f20707e57ba9	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-03	lich	f	\N
beeec584-c0dd-4634-abb0-df4d554ce80a	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-05	lich	f	\N
d06b71f5-9bd0-4490-a3f9-c3cb6af387b5	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-10	lich	f	\N
e513448d-ef13-4ad3-9f1a-6d96edb6059c	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-12	lich	f	\N
d28ca3b5-14c8-4cec-a10f-c122196f5b99	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-17	lich	f	\N
061c68c0-1762-4e8d-8647-cbe153066669	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-19	lich	f	\N
97c103b6-e663-41b9-b5c5-5643c7abd659	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-24	lich	f	\N
77d38888-cfe3-4c35-9f91-4f05fcec114b	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-11-26	lich	f	\N
76c5594d-2ef2-483c-8c91-50449bd098be	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-09-05	lich	f	\N
a60565b6-e210-4df4-8629-c4381b640ef6	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-09-06	lich	f	\N
e9e6881c-4b54-4f45-88f6-db9cc3c73f93	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-09-12	lich	f	\N
e233e012-29dc-4d8f-9239-9b601e99e3c4	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-09-13	lich	f	\N
ee2df810-585e-4022-9ef9-576bc1fac5bd	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-09-19	lich	f	\N
702ba7ac-14dd-4582-a427-e255671dd845	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-09-20	lich	f	\N
2c6ae5b0-8a7f-4ff9-956f-2caa58dedf61	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-09-26	lich	f	\N
7036d174-99a8-4110-b803-3bbb729f224f	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-09-27	lich	f	\N
f4f827e9-77ab-41a9-8227-d2a5caec0797	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-03	lich	f	\N
71298cc1-1b73-45b3-b156-7442e6898e5b	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-04	lich	f	\N
9e609f04-af94-45f9-93d0-4d502cf81baf	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-10	lich	f	\N
8a04e233-81d2-4a48-8378-3f63a2be15c1	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-11	lich	f	\N
973de647-4e2d-4e65-a6a3-44a1b2998a88	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-17	lich	f	\N
84c7149a-aa45-43fd-89ad-eea1e7f0df65	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-18	lich	f	\N
5eeb65e0-eb96-4fd5-bb8f-d682ecc924a8	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-24	lich	f	\N
2048421f-2b90-433e-a5c7-681599c7ee76	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-25	lich	f	\N
867a4c8f-6181-42c7-9afe-10c935e85d3b	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-10-31	lich	f	\N
8470fe43-0a89-4fe1-ae07-e9c11dda3413	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-01	lich	f	\N
c59f7a15-af34-4b91-9f41-7f1468132de8	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-07	lich	f	\N
f87bcaeb-b83e-4a16-ab83-35289a1c128f	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-08	lich	f	\N
418d532d-0f67-4401-87c3-fb52b1c5307b	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-14	lich	f	\N
cedecea1-a56a-489f-a7a5-c6801ed12214	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-21	lich	f	\N
3789d066-edca-4cd2-b189-2a1248cf7ace	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-22	lich	f	\N
16c0129f-66b0-4580-ba1b-db3268de7181	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-28	lich	f	\N
496f54b6-5ea3-4e78-9f7d-a9736a770aa6	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-29	lich	f	\N
ff47136d-228c-4ad0-acb9-28b7b06eb540	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	2026-10-06	lich	t	Nghỉ lễ
5040527e-f083-44ae-a480-6e5c072fe2e0	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	2026-11-15	lich	f	\N
\.


--
-- Data for Name: anh_buoi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."anh_buoi" ("id", "buoi_id", "duong_dan", "tao_luc") FROM stdin;
116eec1a-ab3d-48c3-b202-be48a7cbacec	37632d25-b954-4091-aee3-e0c388193fcf	buoi/37632d25-b954-4091-aee3-e0c388193fcf/a57a1df7-8799-4e75-91f7-03649bb91af6.jpg	2026-11-15 11:02:39.539899+00
3303d8dd-80a5-4a16-b2a2-c03a156e03b8	37632d25-b954-4091-aee3-e0c388193fcf	buoi/37632d25-b954-4091-aee3-e0c388193fcf/56ea5e19-3772-4b7a-9769-59d144ebf4e0.jpg	2026-11-15 11:06:00.132001+00
751120ad-6d00-44e2-8809-0323010c2cbd	61adcf33-64b2-413b-8a28-1dc2788b44df	buoi/61adcf33-64b2-413b-8a28-1dc2788b44df/demo.jpg	2026-11-15 16:32:46.437157+00
fa962e05-6baa-445d-a985-a07fd2eae7c3	4058c048-f55d-415e-83dd-f3ebed4276ff	buoi/4058c048-f55d-415e-83dd-f3ebed4276ff/demo.jpg	2026-11-15 16:32:46.771986+00
629f6b5b-d3c5-4c1c-b25f-fe02f457b131	1b9897b0-affa-4c67-be5a-eb922fd4d044	buoi/1b9897b0-affa-4c67-be5a-eb922fd4d044/demo.jpg	2026-11-15 16:32:47.151066+00
a7a22080-7fe9-443f-a509-83819dac2360	beeec584-c0dd-4634-abb0-df4d554ce80a	buoi/beeec584-c0dd-4634-abb0-df4d554ce80a/demo.jpg	2026-11-15 16:32:47.532636+00
a8a17074-8e1f-483a-8cf1-045520c8b0ca	d06b71f5-9bd0-4490-a3f9-c3cb6af387b5	buoi/d06b71f5-9bd0-4490-a3f9-c3cb6af387b5/demo.jpg	2026-11-15 16:32:47.882739+00
f39155d3-ba5d-4de5-8de7-790254425e87	e513448d-ef13-4ad3-9f1a-6d96edb6059c	buoi/e513448d-ef13-4ad3-9f1a-6d96edb6059c/demo.jpg	2026-11-15 16:32:48.501677+00
d3efd249-1b6c-45f9-888f-00acbfbf2563	c59f7a15-af34-4b91-9f41-7f1468132de8	buoi/c59f7a15-af34-4b91-9f41-7f1468132de8/demo.jpg	2026-11-15 16:32:48.886613+00
e79a1193-e084-4673-90c0-0c243ac47ab9	f87bcaeb-b83e-4a16-ab83-35289a1c128f	buoi/f87bcaeb-b83e-4a16-ab83-35289a1c128f/demo.jpg	2026-11-15 16:32:49.271258+00
a8a08224-726e-4fb2-a895-bb0a4b1ad815	418d532d-0f67-4401-87c3-fb52b1c5307b	buoi/418d532d-0f67-4401-87c3-fb52b1c5307b/demo.jpg	2026-11-15 16:32:49.836376+00
24486a9d-8f09-4193-86eb-6c0ff237d156	5040527e-f083-44ae-a480-6e5c072fe2e0	buoi/5040527e-f083-44ae-a480-6e5c072fe2e0/3f37b948-0dbd-4c77-8bd5-83f4d2a82f49.jpg	2026-11-15 16:55:18.925572+00
\.


--
-- Data for Name: tai_khoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tai_khoan" ("id", "email", "ten_dang_nhap", "so_dien_thoai", "ho_ten", "vai_tro", "phai_doi_mat_khau", "don_gia_buoi", "hoat_dong") FROM stdin;
43d2ab0d-e902-49d7-9e81-a3696d296ad2	admin@msnhung.local	admin	\N	Quản trị	admin	f	0	t
eea097e1-f720-4e73-aa73-00c2f454515f	92f52996-8f53-480c-9330-94b3e2dfeea5@msnhung.local	\N	0356998740	test_ph	phu_huynh	f	0	t
769db48b-ba66-4966-814b-087cf859c802	2f523f60-c93a-4a0d-b812-0c6ba9e17a08@msnhung.local	tg01	\N	test_tg	tro_giang	f	150000	t
\.


--
-- Data for Name: hoc_sinh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."hoc_sinh" ("id", "ho_ten", "lop_id", "avatar", "ten_phu_huynh", "sdt_phu_huynh", "phu_huynh_id", "ngay_vao", "don_gia_rieng", "trang_thai", "ghi_chu", "tao_luc", "sticker_dau_ky") FROM stdin;
099fe129-1356-46fb-b289-d496e63a72a3	Test_student	85c61e68-f656-451b-9a37-5cc4042786e1	avatar/099fe129-1356-46fb-b289-d496e63a72a3-1794740220703.jpg	test_ph	0356998740	eea097e1-f720-4e73-aa73-00c2f454515f	2026-11-15	150000	dang_hoc	\N	2026-11-15 10:56:59.953407+00	0
a484e84a-d443-475d-b1e9-e65f96a515a1	Trần Bảo Ngọc	eefd1528-bb2c-4729-a4f4-1e45c14603ee	\N	Phụ huynh Ngọc	0900200001	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	8
7e9dd687-332e-4b27-a9a1-98c2873da765	Lê Gia Huy	eefd1528-bb2c-4729-a4f4-1e45c14603ee	\N	Phụ huynh Huy	0900200002	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	0
f19d56b8-4771-4bec-97bd-45e440757ffc	Phạm Thảo Vy	eefd1528-bb2c-4729-a4f4-1e45c14603ee	\N	Phụ huynh Vy	0900200003	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	0
9b9432ad-734f-4958-bd37-908979347dd4	Nguyễn Minh Khôi	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	\N	test_ph	0356998740	eea097e1-f720-4e73-aa73-00c2f454515f	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	0
3bf22b3c-483c-41dc-8988-c1578979c554	Vũ Khánh Linh	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	\N	Phụ huynh Linh	0900200006	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	2
b5234079-0af2-415d-997a-53d2d6f6cdcf	Hoàng Nhật Nam	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	\N	Phụ huynh Nam	0900200007	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	2
7b5ba111-f852-47e3-a6fb-eae16b186b42	Đặng Quốc Bảo	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	\N	Phụ huynh Bảo	0900200009	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	3
59a0d872-c7fc-4a34-91fc-5781e6e23383	Ngô Thanh Trúc	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	\N	Phụ huynh Trúc	0900200010	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	9
2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	Phan Anh Tuấn	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	\N	Phụ huynh Tuấn	0900200011	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	6
b8770b5f-91aa-42b8-91e4-9503ed18ac34	Trịnh Hoàng Long	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	\N	Phụ huynh Long	0900200013	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	2
11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	Mai Phương Thảo	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	\N	Phụ huynh Thảo	0900200014	\N	2026-10-15	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	4
a54f015a-f0ac-44ff-997b-a691b76d6b0d	Nguyễn Minh Anh	eefd1528-bb2c-4729-a4f4-1e45c14603ee	avatar/a54f015a-f0ac-44ff-997b-a691b76d6b0d-demo.jpg	test_ph	0356998740	eea097e1-f720-4e73-aa73-00c2f454515f	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	2
1b68e7ce-a63f-4c48-90fa-f6496fed014d	Đỗ Đức Minh	eefd1528-bb2c-4729-a4f4-1e45c14603ee	avatar/1b68e7ce-a63f-4c48-90fa-f6496fed014d-demo.jpg	Phụ huynh Minh	0900200004	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	4
e3b9fccd-9607-42dc-a78b-1a8d74bf4490	Bùi Hà My	baa60e4f-83a1-4fc5-8bcc-6259f1bf47ee	avatar/e3b9fccd-9607-42dc-a78b-1a8d74bf4490-demo.jpg	Phụ huynh My	0900200008	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	7
2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	Lý Mai Chi	ff52a33a-b42f-4b4d-9b9d-3c36a3469456	avatar/2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2-demo.jpg	Phụ huynh Chi	0900200012	\N	2026-09-01	\N	dang_hoc	\N	2026-11-15 16:32:42.734277+00	3
\.


--
-- Data for Name: chi_phi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."chi_phi" ("id", "ngay", "danh_muc", "so_tien", "ghi_chu", "hoc_sinh_id") FROM stdin;
674d6ef2-f629-4895-ad9d-8192b1ee7d6b	2026-09-01	Thuê phòng	3000000	\N	\N
6acb4f5f-ea54-4103-b0c9-914ae71646d5	2026-09-25	Điện nước	400000	\N	\N
b5658e45-53f7-4bc3-822f-7f2d7e1fc70f	2026-10-01	Thuê phòng	3000000	\N	\N
8428bd58-b0e7-4912-98b4-0ac48147254e	2026-10-25	Điện nước	450000	\N	\N
dfb99ef0-fd6b-4826-8cf7-f24876c44437	2026-10-08	Tài liệu	650000	Sách Movers	\N
e4c32381-e9f0-4b77-8643-b1a68a61df4e	2026-11-01	Thuê phòng	3000000	\N	\N
ed99858d-cb36-48cb-a5ed-25fa5045f903	2026-11-15	Điện nước	500000	\N	\N
fa53c408-5aff-4174-b04d-69dc3c5ba48a	2026-11-03	Sticker / quà	200000	\N	\N
\.


--
-- Data for Name: diem_danh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."diem_danh" ("buoi_id", "hoc_sinh_id", "trang_thai", "sticker") FROM stdin;
f63caf96-5dc5-4915-aa09-dc7f8cd83f5f	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	3
f63caf96-5dc5-4915-aa09-dc7f8cd83f5f	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	3
f63caf96-5dc5-4915-aa09-dc7f8cd83f5f	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	1
f63caf96-5dc5-4915-aa09-dc7f8cd83f5f	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	0
f63caf96-5dc5-4915-aa09-dc7f8cd83f5f	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	0
bde31345-8218-4cba-bba8-d4fbd3928779	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	3
bde31345-8218-4cba-bba8-d4fbd3928779	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	0
bde31345-8218-4cba-bba8-d4fbd3928779	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	0
bde31345-8218-4cba-bba8-d4fbd3928779	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	3
bde31345-8218-4cba-bba8-d4fbd3928779	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	0
946a34fa-fb85-487f-931a-0a65bd6e3cea	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	1
946a34fa-fb85-487f-931a-0a65bd6e3cea	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	1
946a34fa-fb85-487f-931a-0a65bd6e3cea	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	2
946a34fa-fb85-487f-931a-0a65bd6e3cea	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
946a34fa-fb85-487f-931a-0a65bd6e3cea	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	2
316f4374-1576-41df-b265-6f94a3dd53fd	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	1
316f4374-1576-41df-b265-6f94a3dd53fd	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	3
316f4374-1576-41df-b265-6f94a3dd53fd	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	2
316f4374-1576-41df-b265-6f94a3dd53fd	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	3
316f4374-1576-41df-b265-6f94a3dd53fd	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	2
82eea5f6-e3c3-4a7f-b9a1-505ae714b088	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
82eea5f6-e3c3-4a7f-b9a1-505ae714b088	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	2
82eea5f6-e3c3-4a7f-b9a1-505ae714b088	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	1
82eea5f6-e3c3-4a7f-b9a1-505ae714b088	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
37632d25-b954-4091-aee3-e0c388193fcf	099fe129-1356-46fb-b289-d496e63a72a3	co_mat	0
82eea5f6-e3c3-4a7f-b9a1-505ae714b088	1b68e7ce-a63f-4c48-90fa-f6496fed014d	vang	0
2ddffd81-f824-4b9e-84fa-86a7ae21f913	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	1
2ddffd81-f824-4b9e-84fa-86a7ae21f913	a484e84a-d443-475d-b1e9-e65f96a515a1	vang	0
2ddffd81-f824-4b9e-84fa-86a7ae21f913	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
2ddffd81-f824-4b9e-84fa-86a7ae21f913	f19d56b8-4771-4bec-97bd-45e440757ffc	vang	0
2ddffd81-f824-4b9e-84fa-86a7ae21f913	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	0
abdaefd8-45fe-49dc-8392-769816a81a3b	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	1
abdaefd8-45fe-49dc-8392-769816a81a3b	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	1
abdaefd8-45fe-49dc-8392-769816a81a3b	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	1
abdaefd8-45fe-49dc-8392-769816a81a3b	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	2
abdaefd8-45fe-49dc-8392-769816a81a3b	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	0
549ec5b0-fc41-4446-8a6f-e271c745437d	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	3
549ec5b0-fc41-4446-8a6f-e271c745437d	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	1
549ec5b0-fc41-4446-8a6f-e271c745437d	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	2
549ec5b0-fc41-4446-8a6f-e271c745437d	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
549ec5b0-fc41-4446-8a6f-e271c745437d	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	2
1c1b62f1-4397-4d53-8f54-37810acedd4c	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
1c1b62f1-4397-4d53-8f54-37810acedd4c	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	3
1c1b62f1-4397-4d53-8f54-37810acedd4c	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
1c1b62f1-4397-4d53-8f54-37810acedd4c	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
1c1b62f1-4397-4d53-8f54-37810acedd4c	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	2
45efd996-4102-42c8-a864-41905f4ee319	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	0
45efd996-4102-42c8-a864-41905f4ee319	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	3
45efd996-4102-42c8-a864-41905f4ee319	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	1
45efd996-4102-42c8-a864-41905f4ee319	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
45efd996-4102-42c8-a864-41905f4ee319	1b68e7ce-a63f-4c48-90fa-f6496fed014d	vang	0
f5277ac7-f1c2-49da-87e0-e862afbc2c31	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
f5277ac7-f1c2-49da-87e0-e862afbc2c31	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	0
f5277ac7-f1c2-49da-87e0-e862afbc2c31	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	2
f5277ac7-f1c2-49da-87e0-e862afbc2c31	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	3
f5277ac7-f1c2-49da-87e0-e862afbc2c31	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	0
2f2ca267-cba1-4e3e-99fa-433b6397726b	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
2f2ca267-cba1-4e3e-99fa-433b6397726b	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	3
2f2ca267-cba1-4e3e-99fa-433b6397726b	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	1
2f2ca267-cba1-4e3e-99fa-433b6397726b	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	3
2f2ca267-cba1-4e3e-99fa-433b6397726b	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	1
d391b807-7440-4c84-898c-33d3f5692d34	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
d391b807-7440-4c84-898c-33d3f5692d34	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	3
d391b807-7440-4c84-898c-33d3f5692d34	7e9dd687-332e-4b27-a9a1-98c2873da765	vang	0
d391b807-7440-4c84-898c-33d3f5692d34	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	2
d391b807-7440-4c84-898c-33d3f5692d34	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	1
14af2fb9-02b7-4735-b63f-69b4ff440e28	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
14af2fb9-02b7-4735-b63f-69b4ff440e28	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	2
14af2fb9-02b7-4735-b63f-69b4ff440e28	7e9dd687-332e-4b27-a9a1-98c2873da765	vang	0
14af2fb9-02b7-4735-b63f-69b4ff440e28	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	2
14af2fb9-02b7-4735-b63f-69b4ff440e28	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	1
4f76c82c-ea52-40b3-9891-1f0bdc50ea24	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	0
4f76c82c-ea52-40b3-9891-1f0bdc50ea24	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	2
4f76c82c-ea52-40b3-9891-1f0bdc50ea24	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	2
4f76c82c-ea52-40b3-9891-1f0bdc50ea24	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	0
4f76c82c-ea52-40b3-9891-1f0bdc50ea24	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	2
3c7350cf-fc0b-4312-beb5-f045532ec450	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	1
3c7350cf-fc0b-4312-beb5-f045532ec450	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	3
3c7350cf-fc0b-4312-beb5-f045532ec450	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
3c7350cf-fc0b-4312-beb5-f045532ec450	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
3c7350cf-fc0b-4312-beb5-f045532ec450	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	0
5499cfb1-bee2-4895-a8c2-05eeab25c638	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	3
5499cfb1-bee2-4895-a8c2-05eeab25c638	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	1
5499cfb1-bee2-4895-a8c2-05eeab25c638	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
5499cfb1-bee2-4895-a8c2-05eeab25c638	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	0
5499cfb1-bee2-4895-a8c2-05eeab25c638	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	2
5d0abe0e-d858-4a6a-9fea-be8b4852840e	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
5d0abe0e-d858-4a6a-9fea-be8b4852840e	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	0
5d0abe0e-d858-4a6a-9fea-be8b4852840e	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	2
5d0abe0e-d858-4a6a-9fea-be8b4852840e	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	2
5d0abe0e-d858-4a6a-9fea-be8b4852840e	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	1
923d2487-149c-45cb-8bb9-292740c32ac1	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	0
923d2487-149c-45cb-8bb9-292740c32ac1	a484e84a-d443-475d-b1e9-e65f96a515a1	vang	0
923d2487-149c-45cb-8bb9-292740c32ac1	7e9dd687-332e-4b27-a9a1-98c2873da765	vang	0
923d2487-149c-45cb-8bb9-292740c32ac1	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	3
923d2487-149c-45cb-8bb9-292740c32ac1	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	3
1c643604-9c9b-4ae6-b69d-64de6c34a78f	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	1
1c643604-9c9b-4ae6-b69d-64de6c34a78f	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	1
1c643604-9c9b-4ae6-b69d-64de6c34a78f	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	2
1c643604-9c9b-4ae6-b69d-64de6c34a78f	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	0
1c643604-9c9b-4ae6-b69d-64de6c34a78f	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	3
8d09f870-736c-4fa8-a627-f6e365e6be39	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
8d09f870-736c-4fa8-a627-f6e365e6be39	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	2
8d09f870-736c-4fa8-a627-f6e365e6be39	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
8d09f870-736c-4fa8-a627-f6e365e6be39	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	3
8d09f870-736c-4fa8-a627-f6e365e6be39	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	0
5fa74153-623c-4beb-9209-138a43f7c13c	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	3
5fa74153-623c-4beb-9209-138a43f7c13c	a484e84a-d443-475d-b1e9-e65f96a515a1	vang	0
5fa74153-623c-4beb-9209-138a43f7c13c	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
5fa74153-623c-4beb-9209-138a43f7c13c	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
5fa74153-623c-4beb-9209-138a43f7c13c	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	2
8a8702d9-7bd9-42da-98b4-b710e2d8420b	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
8a8702d9-7bd9-42da-98b4-b710e2d8420b	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	1
8a8702d9-7bd9-42da-98b4-b710e2d8420b	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
8a8702d9-7bd9-42da-98b4-b710e2d8420b	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
8a8702d9-7bd9-42da-98b4-b710e2d8420b	1b68e7ce-a63f-4c48-90fa-f6496fed014d	vang	0
06a4276e-d149-4ef6-8083-9fba9ad692d0	a54f015a-f0ac-44ff-997b-a691b76d6b0d	vang	0
06a4276e-d149-4ef6-8083-9fba9ad692d0	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	0
06a4276e-d149-4ef6-8083-9fba9ad692d0	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
06a4276e-d149-4ef6-8083-9fba9ad692d0	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	0
06a4276e-d149-4ef6-8083-9fba9ad692d0	1b68e7ce-a63f-4c48-90fa-f6496fed014d	vang	0
457f8ae1-db17-4cb2-ba60-40fcd78d080a	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	1
457f8ae1-db17-4cb2-ba60-40fcd78d080a	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	2
457f8ae1-db17-4cb2-ba60-40fcd78d080a	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
457f8ae1-db17-4cb2-ba60-40fcd78d080a	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	2
457f8ae1-db17-4cb2-ba60-40fcd78d080a	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	1
94105ead-7f8c-43a7-9750-36714b674ea8	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	1
94105ead-7f8c-43a7-9750-36714b674ea8	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	0
94105ead-7f8c-43a7-9750-36714b674ea8	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	0
94105ead-7f8c-43a7-9750-36714b674ea8	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	2
94105ead-7f8c-43a7-9750-36714b674ea8	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	1
bc8c6ff7-0600-4d21-9018-73938255cbb8	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	3
bc8c6ff7-0600-4d21-9018-73938255cbb8	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	1
bc8c6ff7-0600-4d21-9018-73938255cbb8	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	2
bc8c6ff7-0600-4d21-9018-73938255cbb8	f19d56b8-4771-4bec-97bd-45e440757ffc	vang	0
bc8c6ff7-0600-4d21-9018-73938255cbb8	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	3
d9508564-6175-447c-9cbb-32b80c31cc63	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	3
d9508564-6175-447c-9cbb-32b80c31cc63	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	0
d9508564-6175-447c-9cbb-32b80c31cc63	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	3
d9508564-6175-447c-9cbb-32b80c31cc63	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	1
d9508564-6175-447c-9cbb-32b80c31cc63	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	3
61adcf33-64b2-413b-8a28-1dc2788b44df	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	3
61adcf33-64b2-413b-8a28-1dc2788b44df	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	1
61adcf33-64b2-413b-8a28-1dc2788b44df	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	0
61adcf33-64b2-413b-8a28-1dc2788b44df	f19d56b8-4771-4bec-97bd-45e440757ffc	vang	0
61adcf33-64b2-413b-8a28-1dc2788b44df	1b68e7ce-a63f-4c48-90fa-f6496fed014d	vang	0
4058c048-f55d-415e-83dd-f3ebed4276ff	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	0
4058c048-f55d-415e-83dd-f3ebed4276ff	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	3
4058c048-f55d-415e-83dd-f3ebed4276ff	7e9dd687-332e-4b27-a9a1-98c2873da765	vang	0
4058c048-f55d-415e-83dd-f3ebed4276ff	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	3
4058c048-f55d-415e-83dd-f3ebed4276ff	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	1
1b9897b0-affa-4c67-be5a-eb922fd4d044	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	2
1b9897b0-affa-4c67-be5a-eb922fd4d044	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	2
1b9897b0-affa-4c67-be5a-eb922fd4d044	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	0
1b9897b0-affa-4c67-be5a-eb922fd4d044	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	2
1b9897b0-affa-4c67-be5a-eb922fd4d044	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	3
d47af40a-7bd4-4866-ab91-438c6648c51e	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	1
d47af40a-7bd4-4866-ab91-438c6648c51e	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	1
d47af40a-7bd4-4866-ab91-438c6648c51e	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	2
d47af40a-7bd4-4866-ab91-438c6648c51e	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	0
d47af40a-7bd4-4866-ab91-438c6648c51e	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	1
9350e893-e978-48c0-bf46-561a562ebfe6	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	0
9350e893-e978-48c0-bf46-561a562ebfe6	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	0
9350e893-e978-48c0-bf46-561a562ebfe6	b5234079-0af2-415d-997a-53d2d6f6cdcf	vang	0
9350e893-e978-48c0-bf46-561a562ebfe6	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	0
9350e893-e978-48c0-bf46-561a562ebfe6	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	3
26976bae-8173-4112-b645-97dcd70e4998	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	0
26976bae-8173-4112-b645-97dcd70e4998	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	2
26976bae-8173-4112-b645-97dcd70e4998	b5234079-0af2-415d-997a-53d2d6f6cdcf	vang	0
26976bae-8173-4112-b645-97dcd70e4998	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	vang	0
26976bae-8173-4112-b645-97dcd70e4998	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	3
544d8372-ed4d-423c-b143-600a050705b1	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
544d8372-ed4d-423c-b143-600a050705b1	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	0
544d8372-ed4d-423c-b143-600a050705b1	b5234079-0af2-415d-997a-53d2d6f6cdcf	vang	0
544d8372-ed4d-423c-b143-600a050705b1	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	1
544d8372-ed4d-423c-b143-600a050705b1	7b5ba111-f852-47e3-a6fb-eae16b186b42	vang	0
e77d778f-7a3f-44fa-8fad-621e8969b277	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	0
e77d778f-7a3f-44fa-8fad-621e8969b277	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	3
e77d778f-7a3f-44fa-8fad-621e8969b277	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	0
e77d778f-7a3f-44fa-8fad-621e8969b277	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	2
e77d778f-7a3f-44fa-8fad-621e8969b277	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	1
9c4ed9f5-22f2-4b13-b56e-ec1ce0de8616	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
9c4ed9f5-22f2-4b13-b56e-ec1ce0de8616	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	1
9c4ed9f5-22f2-4b13-b56e-ec1ce0de8616	b5234079-0af2-415d-997a-53d2d6f6cdcf	vang	0
9c4ed9f5-22f2-4b13-b56e-ec1ce0de8616	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	2
9c4ed9f5-22f2-4b13-b56e-ec1ce0de8616	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	2
b7f8f541-7c1d-44ed-b39f-d02066c52a4a	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
b7f8f541-7c1d-44ed-b39f-d02066c52a4a	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	3
b7f8f541-7c1d-44ed-b39f-d02066c52a4a	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	3
b7f8f541-7c1d-44ed-b39f-d02066c52a4a	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	vang	0
b7f8f541-7c1d-44ed-b39f-d02066c52a4a	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	3
29c806a9-dd9e-41b5-a580-76c1b2205708	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
29c806a9-dd9e-41b5-a580-76c1b2205708	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	2
29c806a9-dd9e-41b5-a580-76c1b2205708	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	0
29c806a9-dd9e-41b5-a580-76c1b2205708	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	2
29c806a9-dd9e-41b5-a580-76c1b2205708	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	0
296830ce-85cb-420e-b50b-0c54977a47f6	9b9432ad-734f-4958-bd37-908979347dd4	vang	0
296830ce-85cb-420e-b50b-0c54977a47f6	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	1
296830ce-85cb-420e-b50b-0c54977a47f6	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	2
296830ce-85cb-420e-b50b-0c54977a47f6	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	2
296830ce-85cb-420e-b50b-0c54977a47f6	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	2
9163cf9a-40f1-4d2b-b54e-9305eb9d384a	9b9432ad-734f-4958-bd37-908979347dd4	vang	0
9163cf9a-40f1-4d2b-b54e-9305eb9d384a	3bf22b3c-483c-41dc-8988-c1578979c554	vang	0
9163cf9a-40f1-4d2b-b54e-9305eb9d384a	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	0
9163cf9a-40f1-4d2b-b54e-9305eb9d384a	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	0
9163cf9a-40f1-4d2b-b54e-9305eb9d384a	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	2
538cfcc0-9abf-4086-97b8-8220b0653c5d	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
538cfcc0-9abf-4086-97b8-8220b0653c5d	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	3
538cfcc0-9abf-4086-97b8-8220b0653c5d	b5234079-0af2-415d-997a-53d2d6f6cdcf	vang	0
538cfcc0-9abf-4086-97b8-8220b0653c5d	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	1
538cfcc0-9abf-4086-97b8-8220b0653c5d	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	3
118fd238-ad8d-4205-99aa-da0ae0915128	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	2
118fd238-ad8d-4205-99aa-da0ae0915128	3bf22b3c-483c-41dc-8988-c1578979c554	vang	0
118fd238-ad8d-4205-99aa-da0ae0915128	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	2
118fd238-ad8d-4205-99aa-da0ae0915128	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	3
118fd238-ad8d-4205-99aa-da0ae0915128	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	2
f477cc64-0361-4e8b-9e1e-0effe1c696ec	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
f477cc64-0361-4e8b-9e1e-0effe1c696ec	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	0
f477cc64-0361-4e8b-9e1e-0effe1c696ec	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	0
f477cc64-0361-4e8b-9e1e-0effe1c696ec	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	1
f477cc64-0361-4e8b-9e1e-0effe1c696ec	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	0
a6e0c06b-79df-496a-866d-4f580d7b9f2f	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
a6e0c06b-79df-496a-866d-4f580d7b9f2f	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	2
a6e0c06b-79df-496a-866d-4f580d7b9f2f	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	0
a6e0c06b-79df-496a-866d-4f580d7b9f2f	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	0
a6e0c06b-79df-496a-866d-4f580d7b9f2f	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	2
961d83a6-3586-47aa-83a9-f4b86dc855fa	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
961d83a6-3586-47aa-83a9-f4b86dc855fa	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	0
961d83a6-3586-47aa-83a9-f4b86dc855fa	b5234079-0af2-415d-997a-53d2d6f6cdcf	vang	0
961d83a6-3586-47aa-83a9-f4b86dc855fa	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	vang	0
961d83a6-3586-47aa-83a9-f4b86dc855fa	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	0
660aafe7-dfc8-46a2-a2c2-3a42dc215d9e	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	3
660aafe7-dfc8-46a2-a2c2-3a42dc215d9e	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	2
660aafe7-dfc8-46a2-a2c2-3a42dc215d9e	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	3
660aafe7-dfc8-46a2-a2c2-3a42dc215d9e	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	1
660aafe7-dfc8-46a2-a2c2-3a42dc215d9e	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	2
b8742cd1-c766-4a16-b238-31206e4de024	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	1
b8742cd1-c766-4a16-b238-31206e4de024	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	0
b8742cd1-c766-4a16-b238-31206e4de024	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	3
b8742cd1-c766-4a16-b238-31206e4de024	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	0
b8742cd1-c766-4a16-b238-31206e4de024	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	3
c05ec7b2-3e4e-4514-a4e8-f20707e57ba9	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	2
c05ec7b2-3e4e-4514-a4e8-f20707e57ba9	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	2
c05ec7b2-3e4e-4514-a4e8-f20707e57ba9	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	0
c05ec7b2-3e4e-4514-a4e8-f20707e57ba9	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	2
c05ec7b2-3e4e-4514-a4e8-f20707e57ba9	7b5ba111-f852-47e3-a6fb-eae16b186b42	vang	0
beeec584-c0dd-4634-abb0-df4d554ce80a	9b9432ad-734f-4958-bd37-908979347dd4	vang	0
beeec584-c0dd-4634-abb0-df4d554ce80a	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	1
beeec584-c0dd-4634-abb0-df4d554ce80a	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	1
beeec584-c0dd-4634-abb0-df4d554ce80a	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	0
beeec584-c0dd-4634-abb0-df4d554ce80a	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	3
d06b71f5-9bd0-4490-a3f9-c3cb6af387b5	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	2
d06b71f5-9bd0-4490-a3f9-c3cb6af387b5	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	1
d06b71f5-9bd0-4490-a3f9-c3cb6af387b5	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	3
d06b71f5-9bd0-4490-a3f9-c3cb6af387b5	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	2
d06b71f5-9bd0-4490-a3f9-c3cb6af387b5	7b5ba111-f852-47e3-a6fb-eae16b186b42	vang	0
e513448d-ef13-4ad3-9f1a-6d96edb6059c	9b9432ad-734f-4958-bd37-908979347dd4	co_mat	1
e513448d-ef13-4ad3-9f1a-6d96edb6059c	3bf22b3c-483c-41dc-8988-c1578979c554	co_mat	1
e513448d-ef13-4ad3-9f1a-6d96edb6059c	b5234079-0af2-415d-997a-53d2d6f6cdcf	co_mat	2
e513448d-ef13-4ad3-9f1a-6d96edb6059c	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	co_mat	2
e513448d-ef13-4ad3-9f1a-6d96edb6059c	7b5ba111-f852-47e3-a6fb-eae16b186b42	co_mat	2
76c5594d-2ef2-483c-8c91-50449bd098be	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	2
76c5594d-2ef2-483c-8c91-50449bd098be	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	3
76c5594d-2ef2-483c-8c91-50449bd098be	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	2
76c5594d-2ef2-483c-8c91-50449bd098be	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	2
a60565b6-e210-4df4-8629-c4381b640ef6	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	1
a60565b6-e210-4df4-8629-c4381b640ef6	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	1
a60565b6-e210-4df4-8629-c4381b640ef6	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	2
a60565b6-e210-4df4-8629-c4381b640ef6	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	2
e9e6881c-4b54-4f45-88f6-db9cc3c73f93	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	1
e9e6881c-4b54-4f45-88f6-db9cc3c73f93	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	3
e9e6881c-4b54-4f45-88f6-db9cc3c73f93	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
e9e6881c-4b54-4f45-88f6-db9cc3c73f93	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	3
e233e012-29dc-4d8f-9239-9b601e99e3c4	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	3
e233e012-29dc-4d8f-9239-9b601e99e3c4	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	3
e233e012-29dc-4d8f-9239-9b601e99e3c4	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	2
e233e012-29dc-4d8f-9239-9b601e99e3c4	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	1
ee2df810-585e-4022-9ef9-576bc1fac5bd	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	3
ee2df810-585e-4022-9ef9-576bc1fac5bd	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	vang	0
ee2df810-585e-4022-9ef9-576bc1fac5bd	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
ee2df810-585e-4022-9ef9-576bc1fac5bd	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	0
702ba7ac-14dd-4582-a427-e255671dd845	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	0
702ba7ac-14dd-4582-a427-e255671dd845	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	vang	0
702ba7ac-14dd-4582-a427-e255671dd845	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	2
702ba7ac-14dd-4582-a427-e255671dd845	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	2
2c6ae5b0-8a7f-4ff9-956f-2caa58dedf61	59a0d872-c7fc-4a34-91fc-5781e6e23383	vang	0
2c6ae5b0-8a7f-4ff9-956f-2caa58dedf61	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	2
2c6ae5b0-8a7f-4ff9-956f-2caa58dedf61	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	0
2c6ae5b0-8a7f-4ff9-956f-2caa58dedf61	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	0
7036d174-99a8-4110-b803-3bbb729f224f	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	3
7036d174-99a8-4110-b803-3bbb729f224f	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	1
7036d174-99a8-4110-b803-3bbb729f224f	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
7036d174-99a8-4110-b803-3bbb729f224f	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	2
f4f827e9-77ab-41a9-8227-d2a5caec0797	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	2
f4f827e9-77ab-41a9-8227-d2a5caec0797	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	1
f4f827e9-77ab-41a9-8227-d2a5caec0797	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	3
f4f827e9-77ab-41a9-8227-d2a5caec0797	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	2
71298cc1-1b73-45b3-b156-7442e6898e5b	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	0
71298cc1-1b73-45b3-b156-7442e6898e5b	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	3
71298cc1-1b73-45b3-b156-7442e6898e5b	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	0
71298cc1-1b73-45b3-b156-7442e6898e5b	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	2
9e609f04-af94-45f9-93d0-4d502cf81baf	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	0
9e609f04-af94-45f9-93d0-4d502cf81baf	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	2
9e609f04-af94-45f9-93d0-4d502cf81baf	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
9e609f04-af94-45f9-93d0-4d502cf81baf	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	3
8a04e233-81d2-4a48-8378-3f63a2be15c1	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	3
8a04e233-81d2-4a48-8378-3f63a2be15c1	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	2
8a04e233-81d2-4a48-8378-3f63a2be15c1	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
8a04e233-81d2-4a48-8378-3f63a2be15c1	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	1
973de647-4e2d-4e65-a6a3-44a1b2998a88	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	1
973de647-4e2d-4e65-a6a3-44a1b2998a88	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	2
973de647-4e2d-4e65-a6a3-44a1b2998a88	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
973de647-4e2d-4e65-a6a3-44a1b2998a88	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	0
973de647-4e2d-4e65-a6a3-44a1b2998a88	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	vang	0
84c7149a-aa45-43fd-89ad-eea1e7f0df65	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	2
84c7149a-aa45-43fd-89ad-eea1e7f0df65	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	3
84c7149a-aa45-43fd-89ad-eea1e7f0df65	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	2
84c7149a-aa45-43fd-89ad-eea1e7f0df65	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	1
84c7149a-aa45-43fd-89ad-eea1e7f0df65	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	0
5eeb65e0-eb96-4fd5-bb8f-d682ecc924a8	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	3
5eeb65e0-eb96-4fd5-bb8f-d682ecc924a8	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	2
5eeb65e0-eb96-4fd5-bb8f-d682ecc924a8	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	3
5eeb65e0-eb96-4fd5-bb8f-d682ecc924a8	b8770b5f-91aa-42b8-91e4-9503ed18ac34	vang	0
5eeb65e0-eb96-4fd5-bb8f-d682ecc924a8	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	2
2048421f-2b90-433e-a5c7-681599c7ee76	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	1
2048421f-2b90-433e-a5c7-681599c7ee76	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	0
2048421f-2b90-433e-a5c7-681599c7ee76	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	0
2048421f-2b90-433e-a5c7-681599c7ee76	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	1
2048421f-2b90-433e-a5c7-681599c7ee76	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	1
867a4c8f-6181-42c7-9afe-10c935e85d3b	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	0
867a4c8f-6181-42c7-9afe-10c935e85d3b	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	3
867a4c8f-6181-42c7-9afe-10c935e85d3b	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	vang	0
867a4c8f-6181-42c7-9afe-10c935e85d3b	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	3
867a4c8f-6181-42c7-9afe-10c935e85d3b	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	3
8470fe43-0a89-4fe1-ae07-e9c11dda3413	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	3
8470fe43-0a89-4fe1-ae07-e9c11dda3413	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	vang	0
8470fe43-0a89-4fe1-ae07-e9c11dda3413	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
8470fe43-0a89-4fe1-ae07-e9c11dda3413	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	3
8470fe43-0a89-4fe1-ae07-e9c11dda3413	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	2
c59f7a15-af34-4b91-9f41-7f1468132de8	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	2
c59f7a15-af34-4b91-9f41-7f1468132de8	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	vang	0
c59f7a15-af34-4b91-9f41-7f1468132de8	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
c59f7a15-af34-4b91-9f41-7f1468132de8	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	1
c59f7a15-af34-4b91-9f41-7f1468132de8	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	1
f87bcaeb-b83e-4a16-ab83-35289a1c128f	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	0
f87bcaeb-b83e-4a16-ab83-35289a1c128f	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	1
f87bcaeb-b83e-4a16-ab83-35289a1c128f	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	1
f87bcaeb-b83e-4a16-ab83-35289a1c128f	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	2
f87bcaeb-b83e-4a16-ab83-35289a1c128f	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	2
418d532d-0f67-4401-87c3-fb52b1c5307b	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	1
418d532d-0f67-4401-87c3-fb52b1c5307b	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	2
418d532d-0f67-4401-87c3-fb52b1c5307b	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	3
418d532d-0f67-4401-87c3-fb52b1c5307b	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	3
418d532d-0f67-4401-87c3-fb52b1c5307b	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	2
e9e6881c-4b54-4f45-88f6-db9cc3c73f93	1b68e7ce-a63f-4c48-90fa-f6496fed014d	hoc_bu	1
e77d778f-7a3f-44fa-8fad-621e8969b277	a484e84a-d443-475d-b1e9-e65f96a515a1	hoc_bu	1
e77d778f-7a3f-44fa-8fad-621e8969b277	f19d56b8-4771-4bec-97bd-45e440757ffc	hoc_bu	1
29c806a9-dd9e-41b5-a580-76c1b2205708	1b68e7ce-a63f-4c48-90fa-f6496fed014d	hoc_bu	1
9163cf9a-40f1-4d2b-b54e-9305eb9d384a	7e9dd687-332e-4b27-a9a1-98c2873da765	hoc_bu	1
f4f827e9-77ab-41a9-8227-d2a5caec0797	7e9dd687-332e-4b27-a9a1-98c2873da765	hoc_bu	1
5040527e-f083-44ae-a480-6e5c072fe2e0	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	co_mat	0
5040527e-f083-44ae-a480-6e5c072fe2e0	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	co_mat	0
5040527e-f083-44ae-a480-6e5c072fe2e0	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	co_mat	0
5040527e-f083-44ae-a480-6e5c072fe2e0	59a0d872-c7fc-4a34-91fc-5781e6e23383	co_mat	1
5040527e-f083-44ae-a480-6e5c072fe2e0	b8770b5f-91aa-42b8-91e4-9503ed18ac34	co_mat	0
f31c7277-9922-49f3-9749-698b7ea4a790	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	hoc_bu	0
f31c7277-9922-49f3-9749-698b7ea4a790	a54f015a-f0ac-44ff-997b-a691b76d6b0d	co_mat	0
f31c7277-9922-49f3-9749-698b7ea4a790	7e9dd687-332e-4b27-a9a1-98c2873da765	co_mat	0
f31c7277-9922-49f3-9749-698b7ea4a790	a484e84a-d443-475d-b1e9-e65f96a515a1	co_mat	0
f31c7277-9922-49f3-9749-698b7ea4a790	f19d56b8-4771-4bec-97bd-45e440757ffc	co_mat	0
f31c7277-9922-49f3-9749-698b7ea4a790	1b68e7ce-a63f-4c48-90fa-f6496fed014d	co_mat	0
\.


--
-- Data for Name: goi_hoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."goi_hoc" ("id", "hoc_sinh_id", "thang_bat_dau", "so_thang", "don_gia", "buoi_du_kien", "tien_du_tru", "dieu_chinh", "ly_do_dieu_chinh", "tao_luc") FROM stdin;
a14e85ab-aea2-47a0-9269-913d00e73d06	a54f015a-f0ac-44ff-997b-a691b76d6b0d	2026-09-01	3	120000	{"2026-09": 13, "2026-10": 13, "2026-11": 13}	0	0	\N	2026-11-15 16:32:50.100441+00
0036725e-0000-4373-b324-f02cf8210aee	a484e84a-d443-475d-b1e9-e65f96a515a1	2026-09-01	1	120000	{"2026-09": 13}	0	0	\N	2026-11-15 16:32:50.664104+00
eb8c9aa1-915e-470a-a572-461b6c3e53e4	a484e84a-d443-475d-b1e9-e65f96a515a1	2026-10-01	1	120000	{"2026-10": 13}	0	0	\N	2026-11-15 16:32:50.965276+00
d29fecbd-ea7d-408a-b9ff-1201793fefff	a484e84a-d443-475d-b1e9-e65f96a515a1	2026-11-01	1	120000	{"2026-11": 13}	0	0	\N	2026-11-15 16:32:51.307688+00
3c32c14a-fefb-4719-a859-7f140c4938d7	7e9dd687-332e-4b27-a9a1-98c2873da765	2026-09-01	1	120000	{"2026-09": 13}	0	0	\N	2026-11-15 16:32:51.711311+00
fe8ffb51-dc96-477d-9dfb-d010042dd795	7e9dd687-332e-4b27-a9a1-98c2873da765	2026-10-01	1	120000	{"2026-10": 13}	0	0	\N	2026-11-15 16:32:51.954071+00
c14e6d2b-b47f-4753-adad-644a8908d60f	7e9dd687-332e-4b27-a9a1-98c2873da765	2026-11-01	1	120000	{"2026-11": 13}	0	0	\N	2026-11-15 16:32:52.269095+00
37171f75-d6b0-440e-b066-a6c517940201	f19d56b8-4771-4bec-97bd-45e440757ffc	2026-09-01	1	120000	{"2026-09": 13}	0	0	\N	2026-11-15 16:32:52.435958+00
cfca1f2b-eb9c-4f88-9f67-91110f3d1b52	f19d56b8-4771-4bec-97bd-45e440757ffc	2026-10-01	1	120000	{"2026-10": 13}	0	0	\N	2026-11-15 16:32:52.732494+00
345be8d8-c68f-4a6f-affb-f3372e6f9fc5	f19d56b8-4771-4bec-97bd-45e440757ffc	2026-11-01	1	120000	{"2026-11": 13}	0	0	\N	2026-11-15 16:32:53.022986+00
bcf939a3-eed9-4dcb-9648-200e60d3129b	1b68e7ce-a63f-4c48-90fa-f6496fed014d	2026-09-01	1	120000	{"2026-09": 13}	0	0	\N	2026-11-15 16:32:53.315524+00
70bd6fce-f25b-4495-aca5-91c01bb71b0e	1b68e7ce-a63f-4c48-90fa-f6496fed014d	2026-10-01	1	120000	{"2026-10": 13}	0	0	\N	2026-11-15 16:32:53.57659+00
9af63e14-f0ed-4576-85f7-4da172d8dd3b	1b68e7ce-a63f-4c48-90fa-f6496fed014d	2026-11-01	1	120000	{"2026-11": 13}	0	0	\N	2026-11-15 16:32:53.892789+00
a44aa760-639e-4bb2-839c-41f901597010	9b9432ad-734f-4958-bd37-908979347dd4	2026-09-01	3	150000	{"2026-09": 9, "2026-10": 9, "2026-11": 8}	0	0	\N	2026-11-15 16:32:54.189911+00
a3283d91-ec1c-41e2-957d-88d6d8012734	3bf22b3c-483c-41dc-8988-c1578979c554	2026-09-01	1	150000	{"2026-09": 9}	0	0	\N	2026-11-15 16:32:54.62205+00
08337e92-e9cb-47c1-b01d-c5884a24c32c	3bf22b3c-483c-41dc-8988-c1578979c554	2026-10-01	1	150000	{"2026-10": 9}	0	0	\N	2026-11-15 16:32:54.93623+00
cc8d1b50-29f2-4a34-85bd-a626743524f9	3bf22b3c-483c-41dc-8988-c1578979c554	2026-11-01	1	150000	{"2026-11": 8}	150000	0	\N	2026-11-15 16:32:55.179213+00
db7a171c-50b3-4ff8-85c5-4e722aaf51eb	b5234079-0af2-415d-997a-53d2d6f6cdcf	2026-09-01	1	150000	{"2026-09": 9}	0	0	\N	2026-11-15 16:32:55.488175+00
7df182b3-6797-4746-b833-f09c46a1cb52	b5234079-0af2-415d-997a-53d2d6f6cdcf	2026-10-01	1	150000	{"2026-10": 9}	0	0	\N	2026-11-15 16:32:55.779507+00
a88d9e1e-dc9f-401d-b99f-f23e2569b0ab	b5234079-0af2-415d-997a-53d2d6f6cdcf	2026-11-01	1	150000	{"2026-11": 8}	150000	0	\N	2026-11-15 16:32:56.11533+00
0254c91e-5893-44a3-9a1a-81aadf843b98	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	2026-09-01	1	150000	{"2026-09": 9}	0	0	\N	2026-11-15 16:32:56.284124+00
78b918cf-5709-45c3-b387-7a1882b562bf	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	2026-10-01	1	150000	{"2026-10": 9}	0	0	\N	2026-11-15 16:32:56.596578+00
a8d26ff2-e132-4c17-8d8c-71eaf796d931	e3b9fccd-9607-42dc-a78b-1a8d74bf4490	2026-11-01	1	150000	{"2026-11": 8}	150000	0	\N	2026-11-15 16:32:56.862973+00
e4ab076d-1e54-4fb3-a212-e375a0cdfd90	7b5ba111-f852-47e3-a6fb-eae16b186b42	2026-09-01	1	150000	{"2026-09": 9}	0	0	\N	2026-11-15 16:32:57.161791+00
3a797f11-0bf0-4d31-8317-b207a1e4187d	7b5ba111-f852-47e3-a6fb-eae16b186b42	2026-10-01	1	150000	{"2026-10": 9}	0	0	\N	2026-11-15 16:32:57.476394+00
7ebf09d6-281a-4a0e-b02a-398bcb91833a	7b5ba111-f852-47e3-a6fb-eae16b186b42	2026-11-01	1	150000	{"2026-11": 8}	150000	0	\N	2026-11-15 16:32:58.003809+00
cebc31cb-5e6a-4b52-aa80-30f06c33c53e	59a0d872-c7fc-4a34-91fc-5781e6e23383	2026-09-01	3	180000	{"2026-09": 8, "2026-10": 9, "2026-11": 9}	0	0	\N	2026-11-15 16:32:58.28534+00
d686022a-07d3-4799-8bbf-beec799ff0a3	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	2026-09-01	1	180000	{"2026-09": 8}	0	0	\N	2026-11-15 16:32:58.594116+00
cf9d3417-9f9e-4183-87ca-c310171c0747	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	2026-10-01	1	180000	{"2026-10": 9}	0	0	\N	2026-11-15 16:32:58.875086+00
0e03455f-790d-4381-b7c0-440073245e7e	2a95f08c-8ca3-40ba-8ab9-3403e18f0c0c	2026-11-01	1	180000	{"2026-11": 9}	0	0	\N	2026-11-15 16:32:59.189241+00
d0cb0113-761b-4c39-8ec1-389ca89a163d	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	2026-09-01	1	180000	{"2026-09": 8}	0	0	\N	2026-11-15 16:32:59.539674+00
dce7a663-7566-496c-b941-4f2e78ac960a	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	2026-10-01	1	180000	{"2026-10": 9}	0	0	\N	2026-11-15 16:33:00.104811+00
c3de66ad-8da6-44fc-9c54-88be22514629	2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2	2026-11-01	1	180000	{"2026-11": 9}	0	0	\N	2026-11-15 16:33:00.912643+00
68a1eec8-08dd-4767-a42c-03e60e73883e	b8770b5f-91aa-42b8-91e4-9503ed18ac34	2026-09-01	1	180000	{"2026-09": 8}	0	0	\N	2026-11-15 16:33:01.04757+00
fa1fe788-399b-4ea3-a14f-1cead1ffbd5a	b8770b5f-91aa-42b8-91e4-9503ed18ac34	2026-10-01	1	180000	{"2026-10": 9}	0	0	\N	2026-11-15 16:33:01.458977+00
dbf7b4ac-1e4b-493c-9b52-8c4b12610c32	b8770b5f-91aa-42b8-91e4-9503ed18ac34	2026-11-01	1	180000	{"2026-11": 9}	0	0	\N	2026-11-15 16:33:01.883684+00
60e00586-17e9-4074-8885-104a6b8b84d6	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	2026-10-01	1	180000	{"2026-10": 5}	0	0	\N	2026-11-15 16:33:02.213954+00
30ba861b-f67a-4b50-a045-f7edd580cddb	11b0202b-8a4b-4e71-a7c9-cdf5e6d79efc	2026-11-01	1	180000	{"2026-11": 9}	0	0	\N	2026-11-15 16:33:02.535661+00
\.


--
-- Data for Name: khoa_so; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."khoa_so" ("id", "khoa_den") FROM stdin;
t	2026-10-01
\.


--
-- Data for Name: nhat_ky_chot_so; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."nhat_ky_chot_so" ("id", "thang", "hanh_dong", "ly_do", "nguoi", "luc") FROM stdin;
52	2026-09-01	chot	\N	\N	2026-11-15 16:33:03.021739+00
53	2026-10-01	chot	\N	\N	2026-11-15 16:33:03.021739+00
60	2026-11-01	chot	\N	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 17:01:55.849762+00
61	2026-11-01	mo_khoa	tét	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 17:02:07.661683+00
\.


--
-- Data for Name: phieu_thu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."phieu_thu" ("id", "goi_id", "so_tien", "ngay_thu", "hinh_thuc", "ghi_chu", "nguoi_thu", "tao_luc") FROM stdin;
c0432cf8-0820-45e0-b9fc-562bf51c2228	a14e85ab-aea2-47a0-9269-913d00e73d06	4680000	2026-09-05	tien_mat	\N	\N	2026-11-15 16:32:50.459812+00
fc8d23c2-7c94-48cf-9e79-f9ac263b5089	0036725e-0000-4373-b324-f02cf8210aee	1560000	2026-09-05	tien_mat	\N	\N	2026-11-15 16:32:50.83566+00
b7d9bddc-5ede-4375-a7fa-09bc408f5488	eb8c9aa1-915e-470a-a572-461b6c3e53e4	1560000	2026-10-05	tien_mat	\N	\N	2026-11-15 16:32:51.13743+00
069824e4-9a5b-47fd-8a32-b645426ebf4d	d29fecbd-ea7d-408a-b9ff-1201793fefff	800000	2026-11-05	tien_mat	\N	\N	2026-11-15 16:32:51.537585+00
12a0ce65-60e1-4dad-b650-b66e3f530e65	3c32c14a-fefb-4719-a859-7f140c4938d7	1560000	2026-09-05	chuyen_khoan	\N	\N	2026-11-15 16:32:51.828221+00
f8731637-e56b-44dd-8e90-ca3672a04889	fe8ffb51-dc96-477d-9dfb-d010042dd795	1560000	2026-10-05	chuyen_khoan	\N	\N	2026-11-15 16:32:52.132121+00
aaa175df-66c6-45bc-9242-b06670732f33	37171f75-d6b0-440e-b066-a6c517940201	1560000	2026-09-05	chuyen_khoan	\N	\N	2026-11-15 16:32:52.56443+00
ca8a4e78-7f90-4b34-bd82-da7519136190	cfca1f2b-eb9c-4f88-9f67-91110f3d1b52	950000	2026-10-05	chuyen_khoan	\N	\N	2026-11-15 16:32:52.854689+00
4a1a8bd1-8ba6-42cc-8aca-d7b2ef78f192	345be8d8-c68f-4a6f-affb-f3372e6f9fc5	1560000	2026-11-05	chuyen_khoan	\N	\N	2026-11-15 16:32:53.157996+00
a0fa159e-b7ab-41cf-a59b-dfba15992255	bcf939a3-eed9-4dcb-9648-200e60d3129b	1560000	2026-09-05	tien_mat	\N	\N	2026-11-15 16:32:53.446285+00
01703953-7af1-45d4-97d1-1f124f76b18b	70bd6fce-f25b-4495-aca5-91c01bb71b0e	1560000	2026-10-05	tien_mat	\N	\N	2026-11-15 16:32:53.753126+00
cf64c8cc-1b65-432a-8791-9496c0fcfae1	9af63e14-f0ed-4576-85f7-4da172d8dd3b	1560000	2026-11-05	tien_mat	\N	\N	2026-11-15 16:32:54.060562+00
a1804a31-66ed-430d-a914-21b8375539eb	a44aa760-639e-4bb2-839c-41f901597010	3900000	2026-09-05	chuyen_khoan	\N	\N	2026-11-15 16:32:54.490766+00
04c5ee9a-dc59-46e4-859e-27aba236a6a9	a3283d91-ec1c-41e2-957d-88d6d8012734	1350000	2026-09-05	tien_mat	\N	\N	2026-11-15 16:32:54.751548+00
3da64839-fb82-4343-81a9-6ebd325a9596	08337e92-e9cb-47c1-b01d-c5884a24c32c	1350000	2026-10-05	tien_mat	\N	\N	2026-11-15 16:32:55.057403+00
f329255f-b40f-4ba5-b918-7352d00e5627	cc8d1b50-29f2-4a34-85bd-a626743524f9	550000	2026-11-05	tien_mat	\N	\N	2026-11-15 16:32:55.307756+00
68e1c6dd-36ad-46f1-bb40-7b84065a8f3c	db7a171c-50b3-4ff8-85c5-4e722aaf51eb	1350000	2026-09-05	chuyen_khoan	\N	\N	2026-11-15 16:32:55.609948+00
0ea43db4-e987-46ce-941c-df0682d9eca8	7df182b3-6797-4746-b833-f09c46a1cb52	1350000	2026-10-05	chuyen_khoan	\N	\N	2026-11-15 16:32:55.946961+00
a60dd73e-7da2-440b-a0a0-14a70940a277	0254c91e-5893-44a3-9a1a-81aadf843b98	1350000	2026-09-05	tien_mat	\N	\N	2026-11-15 16:32:56.4568+00
2d8696d5-862d-4c3c-900c-a6612b132ae3	78b918cf-5709-45c3-b387-7a1882b562bf	800000	2026-10-05	tien_mat	\N	\N	2026-11-15 16:32:56.730564+00
cb2e4214-89f8-4ffc-bce3-09c8e5cf07da	a8d26ff2-e132-4c17-8d8c-71eaf796d931	1050000	2026-11-05	tien_mat	\N	\N	2026-11-15 16:32:56.994028+00
ab64bb38-3b3f-4122-a2f5-10f24e490e70	e4ab076d-1e54-4fb3-a212-e375a0cdfd90	1350000	2026-09-05	tien_mat	\N	\N	2026-11-15 16:32:57.341638+00
cea31663-084a-4f84-a1b0-0cd162f634da	3a797f11-0bf0-4d31-8317-b207a1e4187d	1350000	2026-10-05	tien_mat	\N	\N	2026-11-15 16:32:57.699562+00
1f371980-23c0-4a36-85e4-7d72d71a7f50	7ebf09d6-281a-4a0e-b02a-398bcb91833a	1050000	2026-11-05	tien_mat	\N	\N	2026-11-15 16:32:58.159215+00
c6955de8-df4a-41f4-a834-f1c3b51b3be8	cebc31cb-5e6a-4b52-aa80-30f06c33c53e	4680000	2026-09-05	chuyen_khoan	\N	\N	2026-11-15 16:32:58.46594+00
b29433e5-3312-4da3-97d9-88ef9fe7b133	d686022a-07d3-4799-8bbf-beec799ff0a3	1440000	2026-09-05	tien_mat	\N	\N	2026-11-15 16:32:58.75283+00
aef3b6ac-4378-427c-8c2d-c0cf9d4ee76e	cf9d3417-9f9e-4183-87ca-c310171c0747	1620000	2026-10-05	tien_mat	\N	\N	2026-11-15 16:32:58.997618+00
d587eb4b-7792-40ce-81dc-b32f7972a208	0e03455f-790d-4381-b7c0-440073245e7e	800000	2026-11-05	tien_mat	\N	\N	2026-11-15 16:32:59.368092+00
e4322652-77d9-4c86-a917-d19cf3236b26	d0cb0113-761b-4c39-8ec1-389ca89a163d	1440000	2026-09-05	chuyen_khoan	\N	\N	2026-11-15 16:32:59.693028+00
e1c64a63-1e81-4734-9748-497a4808db64	dce7a663-7566-496c-b941-4f2e78ac960a	1620000	2026-10-05	chuyen_khoan	\N	\N	2026-11-15 16:33:00.416644+00
a505d991-2043-4982-a714-f1b008914bbe	68a1eec8-08dd-4767-a42c-03e60e73883e	1440000	2026-09-05	chuyen_khoan	\N	\N	2026-11-15 16:33:01.288657+00
bb928c2a-703c-4834-8a30-b21efbe6f80c	fa1fe788-399b-4ea3-a14f-1cead1ffbd5a	950000	2026-10-05	chuyen_khoan	\N	\N	2026-11-15 16:33:01.754839+00
63a39dc8-dc1a-43f9-85db-7f0d23b66cc6	dbf7b4ac-1e4b-493c-9b52-8c4b12610c32	1620000	2026-11-05	chuyen_khoan	\N	\N	2026-11-15 16:33:02.051123+00
d07277cf-0238-45d2-bb39-34e23e1c47b9	60e00586-17e9-4074-8885-104a6b8b84d6	900000	2026-10-05	tien_mat	\N	\N	2026-11-15 16:33:02.359601+00
9bb37d69-8eaf-4c95-8812-4ab3747333ec	30ba861b-f67a-4b50-a045-f7edd580cddb	1620000	2026-11-05	tien_mat	\N	\N	2026-11-15 16:33:02.715454+00
\.


--
-- Data for Name: tro_giang_buoi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tro_giang_buoi" ("buoi_id", "tro_giang_id", "don_gia") FROM stdin;
f63caf96-5dc5-4915-aa09-dc7f8cd83f5f	769db48b-ba66-4966-814b-087cf859c802	150000
bde31345-8218-4cba-bba8-d4fbd3928779	769db48b-ba66-4966-814b-087cf859c802	150000
946a34fa-fb85-487f-931a-0a65bd6e3cea	769db48b-ba66-4966-814b-087cf859c802	150000
316f4374-1576-41df-b265-6f94a3dd53fd	769db48b-ba66-4966-814b-087cf859c802	150000
82eea5f6-e3c3-4a7f-b9a1-505ae714b088	769db48b-ba66-4966-814b-087cf859c802	150000
2ddffd81-f824-4b9e-84fa-86a7ae21f913	769db48b-ba66-4966-814b-087cf859c802	150000
abdaefd8-45fe-49dc-8392-769816a81a3b	769db48b-ba66-4966-814b-087cf859c802	150000
549ec5b0-fc41-4446-8a6f-e271c745437d	769db48b-ba66-4966-814b-087cf859c802	150000
1c1b62f1-4397-4d53-8f54-37810acedd4c	769db48b-ba66-4966-814b-087cf859c802	150000
45efd996-4102-42c8-a864-41905f4ee319	769db48b-ba66-4966-814b-087cf859c802	150000
f5277ac7-f1c2-49da-87e0-e862afbc2c31	769db48b-ba66-4966-814b-087cf859c802	150000
2f2ca267-cba1-4e3e-99fa-433b6397726b	769db48b-ba66-4966-814b-087cf859c802	150000
d391b807-7440-4c84-898c-33d3f5692d34	769db48b-ba66-4966-814b-087cf859c802	150000
14af2fb9-02b7-4735-b63f-69b4ff440e28	769db48b-ba66-4966-814b-087cf859c802	150000
4f76c82c-ea52-40b3-9891-1f0bdc50ea24	769db48b-ba66-4966-814b-087cf859c802	150000
3c7350cf-fc0b-4312-beb5-f045532ec450	769db48b-ba66-4966-814b-087cf859c802	150000
5499cfb1-bee2-4895-a8c2-05eeab25c638	769db48b-ba66-4966-814b-087cf859c802	150000
5d0abe0e-d858-4a6a-9fea-be8b4852840e	769db48b-ba66-4966-814b-087cf859c802	150000
923d2487-149c-45cb-8bb9-292740c32ac1	769db48b-ba66-4966-814b-087cf859c802	150000
1c643604-9c9b-4ae6-b69d-64de6c34a78f	769db48b-ba66-4966-814b-087cf859c802	150000
8d09f870-736c-4fa8-a627-f6e365e6be39	769db48b-ba66-4966-814b-087cf859c802	150000
5fa74153-623c-4beb-9209-138a43f7c13c	769db48b-ba66-4966-814b-087cf859c802	150000
8a8702d9-7bd9-42da-98b4-b710e2d8420b	769db48b-ba66-4966-814b-087cf859c802	150000
06a4276e-d149-4ef6-8083-9fba9ad692d0	769db48b-ba66-4966-814b-087cf859c802	150000
457f8ae1-db17-4cb2-ba60-40fcd78d080a	769db48b-ba66-4966-814b-087cf859c802	150000
94105ead-7f8c-43a7-9750-36714b674ea8	769db48b-ba66-4966-814b-087cf859c802	150000
bc8c6ff7-0600-4d21-9018-73938255cbb8	769db48b-ba66-4966-814b-087cf859c802	150000
d9508564-6175-447c-9cbb-32b80c31cc63	769db48b-ba66-4966-814b-087cf859c802	150000
61adcf33-64b2-413b-8a28-1dc2788b44df	769db48b-ba66-4966-814b-087cf859c802	150000
4058c048-f55d-415e-83dd-f3ebed4276ff	769db48b-ba66-4966-814b-087cf859c802	150000
1b9897b0-affa-4c67-be5a-eb922fd4d044	769db48b-ba66-4966-814b-087cf859c802	150000
d47af40a-7bd4-4866-ab91-438c6648c51e	769db48b-ba66-4966-814b-087cf859c802	150000
9350e893-e978-48c0-bf46-561a562ebfe6	769db48b-ba66-4966-814b-087cf859c802	150000
26976bae-8173-4112-b645-97dcd70e4998	769db48b-ba66-4966-814b-087cf859c802	150000
544d8372-ed4d-423c-b143-600a050705b1	769db48b-ba66-4966-814b-087cf859c802	150000
e77d778f-7a3f-44fa-8fad-621e8969b277	769db48b-ba66-4966-814b-087cf859c802	150000
9c4ed9f5-22f2-4b13-b56e-ec1ce0de8616	769db48b-ba66-4966-814b-087cf859c802	150000
b7f8f541-7c1d-44ed-b39f-d02066c52a4a	769db48b-ba66-4966-814b-087cf859c802	150000
29c806a9-dd9e-41b5-a580-76c1b2205708	769db48b-ba66-4966-814b-087cf859c802	150000
296830ce-85cb-420e-b50b-0c54977a47f6	769db48b-ba66-4966-814b-087cf859c802	150000
9163cf9a-40f1-4d2b-b54e-9305eb9d384a	769db48b-ba66-4966-814b-087cf859c802	150000
538cfcc0-9abf-4086-97b8-8220b0653c5d	769db48b-ba66-4966-814b-087cf859c802	150000
118fd238-ad8d-4205-99aa-da0ae0915128	769db48b-ba66-4966-814b-087cf859c802	150000
f477cc64-0361-4e8b-9e1e-0effe1c696ec	769db48b-ba66-4966-814b-087cf859c802	150000
a6e0c06b-79df-496a-866d-4f580d7b9f2f	769db48b-ba66-4966-814b-087cf859c802	150000
961d83a6-3586-47aa-83a9-f4b86dc855fa	769db48b-ba66-4966-814b-087cf859c802	150000
660aafe7-dfc8-46a2-a2c2-3a42dc215d9e	769db48b-ba66-4966-814b-087cf859c802	150000
b8742cd1-c766-4a16-b238-31206e4de024	769db48b-ba66-4966-814b-087cf859c802	150000
c05ec7b2-3e4e-4514-a4e8-f20707e57ba9	769db48b-ba66-4966-814b-087cf859c802	150000
beeec584-c0dd-4634-abb0-df4d554ce80a	769db48b-ba66-4966-814b-087cf859c802	150000
d06b71f5-9bd0-4490-a3f9-c3cb6af387b5	769db48b-ba66-4966-814b-087cf859c802	150000
e513448d-ef13-4ad3-9f1a-6d96edb6059c	769db48b-ba66-4966-814b-087cf859c802	150000
5040527e-f083-44ae-a480-6e5c072fe2e0	769db48b-ba66-4966-814b-087cf859c802	150000
f31c7277-9922-49f3-9749-698b7ea4a790	769db48b-ba66-4966-814b-087cf859c802	150000
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
c2daf17a-cb8b-4ea2-bee4-fa02d0343e16	anh	avatar/099fe129-1356-46fb-b289-d496e63a72a3-1794740220703.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 10:57:00.342+00	2026-11-15 10:57:00.342+00	2026-11-15 10:57:00.342+00	{"eTag": "\\"c27a4add6327cf043b3fcc1a72978a89\\"", "size": 16472, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T10:57:01.000Z", "contentLength": 16472, "httpStatusCode": 200}	6e59f673-d7e5-4028-a1e8-8bd613a3b154	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
7978051a-d854-42f4-807f-dfe36b853d50	anh	buoi/37632d25-b954-4091-aee3-e0c388193fcf/a57a1df7-8799-4e75-91f7-03649bb91af6.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 11:02:39.336199+00	2026-11-15 11:02:39.336199+00	2026-11-15 11:02:39.336199+00	{"eTag": "\\"536bb2169435a1ec051e5385c09f71cf\\"", "size": 47664, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T11:02:40.000Z", "contentLength": 47664, "httpStatusCode": 200}	cc40ba41-a49c-4b42-8e67-1740899f6a31	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
a2548b21-3c3c-4c00-9098-39c6bdedf467	anh	buoi/37632d25-b954-4091-aee3-e0c388193fcf/56ea5e19-3772-4b7a-9769-59d144ebf4e0.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 11:05:59.032028+00	2026-11-15 11:05:59.032028+00	2026-11-15 11:05:59.032028+00	{"eTag": "\\"8e4d4170cab2a247bd728563e0b048bb\\"", "size": 11752, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T11:05:59.000Z", "contentLength": 11752, "httpStatusCode": 200}	6bf07281-930b-4b00-80cd-46547b47ac27	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
a263bd6d-823f-4c87-8007-58fb5c799305	anh	buoi/8f9d24d1-5a78-40b1-9213-20af479825cf/57251683-4fcb-4247-abbe-233f0b1ca813.jpg	91c34799-6fbc-46c7-9b80-88151c2b5867	2026-11-15 13:35:34.206014+00	2026-11-15 13:35:34.206014+00	2026-11-15 13:35:34.206014+00	{"eTag": "\\"8d3f5d6ca3e5c44b0ead49f327ed2837\\"", "size": 14639, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T13:35:35.000Z", "contentLength": 14639, "httpStatusCode": 200}	5eac9a57-b1bd-4c38-b9c9-67d11d233965	91c34799-6fbc-46c7-9b80-88151c2b5867	{}	\N	f	f
79b02fe2-f7a4-494e-8e08-3ce799f7ced3	anh	avatar/a54f015a-f0ac-44ff-997b-a691b76d6b0d-demo.jpg	\N	2026-11-15 16:32:43.044187+00	2026-11-15 16:32:43.044187+00	2026-11-15 16:32:43.044187+00	{"eTag": "\\"74e00224963b86ddfdf0b6894ad60f72\\"", "size": 3126, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:44.000Z", "contentLength": 3126, "httpStatusCode": 200}	84d51561-9aa9-4de5-bc8a-4dbf6cb10961	\N	{}	\N	f	f
44a9a872-9b84-460f-a046-a6e7ce073e3e	anh	avatar/1b68e7ce-a63f-4c48-90fa-f6496fed014d-demo.jpg	\N	2026-11-15 16:32:43.471913+00	2026-11-15 16:32:43.471913+00	2026-11-15 16:32:43.471913+00	{"eTag": "\\"74e00224963b86ddfdf0b6894ad60f72\\"", "size": 3126, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:44.000Z", "contentLength": 3126, "httpStatusCode": 200}	a3991d24-8d7f-420a-9c88-51255f7354ec	\N	{}	\N	f	f
79de6894-467f-4a77-a41c-e7ea8b86e361	anh	avatar/e3b9fccd-9607-42dc-a78b-1a8d74bf4490-demo.jpg	\N	2026-11-15 16:32:43.890865+00	2026-11-15 16:32:43.890865+00	2026-11-15 16:32:43.890865+00	{"eTag": "\\"74e00224963b86ddfdf0b6894ad60f72\\"", "size": 3126, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:44.000Z", "contentLength": 3126, "httpStatusCode": 200}	656f9ca1-81b3-425d-9f77-b9bb013430c1	\N	{}	\N	f	f
9cc71422-79e8-454b-866d-4c4dfeb9d633	anh	avatar/2aa6b87f-6f5f-4b53-ac81-ef13a98af5a2-demo.jpg	\N	2026-11-15 16:32:44.927289+00	2026-11-15 16:32:44.927289+00	2026-11-15 16:32:44.927289+00	{"eTag": "\\"74e00224963b86ddfdf0b6894ad60f72\\"", "size": 3126, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:45.000Z", "contentLength": 3126, "httpStatusCode": 200}	2fdb5d28-1152-450a-9f22-1d168de2c598	\N	{}	\N	f	f
18bae2c5-f3f0-4d5f-8736-ec7d03f58f42	anh	buoi/61adcf33-64b2-413b-8a28-1dc2788b44df/demo.jpg	\N	2026-11-15 16:32:46.280565+00	2026-11-15 16:32:46.280565+00	2026-11-15 16:32:46.280565+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:47.000Z", "contentLength": 25993, "httpStatusCode": 200}	8e76e865-65cc-42d4-b498-42bfb1e143dd	\N	{}	\N	f	f
6d22fd18-23ac-4e3d-a003-80277c3ae81a	anh	buoi/5040527e-f083-44ae-a480-6e5c072fe2e0/3f37b948-0dbd-4c77-8bd5-83f4d2a82f49.jpg	769db48b-ba66-4966-814b-087cf859c802	2026-11-15 16:55:18.742923+00	2026-11-15 16:55:18.742923+00	2026-11-15 16:55:18.742923+00	{"eTag": "\\"3694b07d2cf4d11af3410188e25cddab\\"", "size": 606849, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:55:19.000Z", "contentLength": 606849, "httpStatusCode": 200}	f9030c01-ff5b-4433-9bf4-766ab42ba92d	769db48b-ba66-4966-814b-087cf859c802	{}	\N	f	f
cb9fff59-ce8b-4fcd-b905-ead387f4b081	anh	buoi/4058c048-f55d-415e-83dd-f3ebed4276ff/demo.jpg	\N	2026-11-15 16:32:46.615384+00	2026-11-15 16:32:46.615384+00	2026-11-15 16:32:46.615384+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:47.000Z", "contentLength": 25993, "httpStatusCode": 200}	36e45197-a09f-4016-9132-81719e637e6e	\N	{}	\N	f	f
a601ef7d-6d85-4823-a978-70272bb7b754	anh	buoi/1b9897b0-affa-4c67-be5a-eb922fd4d044/demo.jpg	\N	2026-11-15 16:32:47.000459+00	2026-11-15 16:32:47.000459+00	2026-11-15 16:32:47.000459+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:47.000Z", "contentLength": 25993, "httpStatusCode": 200}	51ac18c8-8ac2-403d-8def-3dd365bccd55	\N	{}	\N	f	f
4e9f0647-0ed7-489f-9f53-bd5340b520b7	anh	buoi/beeec584-c0dd-4634-abb0-df4d554ce80a/demo.jpg	\N	2026-11-15 16:32:47.319344+00	2026-11-15 16:32:47.319344+00	2026-11-15 16:32:47.319344+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:48.000Z", "contentLength": 25993, "httpStatusCode": 200}	14c0ce41-79eb-4a89-8f37-bf6c2f214360	\N	{}	\N	f	f
55f389ae-6713-41f6-ac63-191990c66156	anh	buoi/d06b71f5-9bd0-4490-a3f9-c3cb6af387b5/demo.jpg	\N	2026-11-15 16:32:47.739187+00	2026-11-15 16:32:47.739187+00	2026-11-15 16:32:47.739187+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:48.000Z", "contentLength": 25993, "httpStatusCode": 200}	3a95181b-7bb6-4069-bca5-cbbb04cb8b3e	\N	{}	\N	f	f
2134e621-ad32-4316-9d9b-167e27dc9198	anh	buoi/e513448d-ef13-4ad3-9f1a-6d96edb6059c/demo.jpg	\N	2026-11-15 16:32:48.234273+00	2026-11-15 16:32:48.234273+00	2026-11-15 16:32:48.234273+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:49.000Z", "contentLength": 25993, "httpStatusCode": 200}	4613449e-d9ae-46e8-ace4-e2ada3e23473	\N	{}	\N	f	f
061de9bf-c77c-49ce-add9-e17a370e789c	anh	buoi/c59f7a15-af34-4b91-9f41-7f1468132de8/demo.jpg	\N	2026-11-15 16:32:48.747679+00	2026-11-15 16:32:48.747679+00	2026-11-15 16:32:48.747679+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:49.000Z", "contentLength": 25993, "httpStatusCode": 200}	361ab802-91c9-4316-a069-9b82b5fa5d13	\N	{}	\N	f	f
965fcac3-c1ba-47fb-93b7-23f7f03ca8c9	anh	buoi/f87bcaeb-b83e-4a16-ab83-35289a1c128f/demo.jpg	\N	2026-11-15 16:32:49.104182+00	2026-11-15 16:32:49.104182+00	2026-11-15 16:32:49.104182+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:50.000Z", "contentLength": 25993, "httpStatusCode": 200}	175c37bf-a025-4039-a008-afdeef38e94e	\N	{}	\N	f	f
7a6ed359-5a88-4224-97fa-5db911659777	anh	buoi/418d532d-0f67-4401-87c3-fb52b1c5307b/demo.jpg	\N	2026-11-15 16:32:49.444727+00	2026-11-15 16:32:49.444727+00	2026-11-15 16:32:49.444727+00	{"eTag": "\\"6b21bfc501665c7f3464e9bbd636a4ef\\"", "size": 25993, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T16:32:50.000Z", "contentLength": 25993, "httpStatusCode": 200}	03b6be26-4958-40ac-8777-000be4e9919e	\N	{}	\N	f	f
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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 265, true);


--
-- Name: nhat_ky_chot_so_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nhat_ky_chot_so_id_seq"', 61, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 1GKXzHpYmOvyNxpNV5PjkIZdjy4rwFxgjVD4sm5jrLvkgbguKqNWng8eg6Ey8dk

RESET ALL;

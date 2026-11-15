SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict K8h73XGfXGl4D3w5J4uC3lbf6T6UDK570LvYwE3uvRGKY7Ye6EGgTVF296WCJcd

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
00000000-0000-0000-0000-000000000000	43d2ab0d-e902-49d7-9e81-a3696d296ad2	authenticated	authenticated	admin@msnhung.local	$2a$10$BCdkciwG3PPPv4yCMa50oefbpbFKmU9xlXou.UTQCXONcdSKZxnAO	2026-11-15 10:27:58.76274+00	\N		\N		\N			\N	2026-11-15 10:44:14.882944+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:27:58.741954+00	2026-11-15 10:44:14.889049+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	eea097e1-f720-4e73-aa73-00c2f454515f	authenticated	authenticated	92f52996-8f53-480c-9330-94b3e2dfeea5@msnhung.local	$2a$10$Y7u1vzt4B/rV.VcQ/loNuO0P53xNLbASKEUdp7myZS5bspiTeQl6C	2026-11-15 10:56:59.347606+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:56:59.322099+00	2026-11-15 10:56:59.349552+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	769db48b-ba66-4966-814b-087cf859c802	authenticated	authenticated	2f523f60-c93a-4a0d-b812-0c6ba9e17a08@msnhung.local	$2a$10$lZa97cxfK/02UPkswEkFXuGtiptdwlp78GLRBRrsBSfani9O0gO4u	2026-11-15 10:58:46.848536+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:58:46.8455+00	2026-11-15 10:58:46.849399+00	\N	\N			\N		0	\N		\N	f	\N	f
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
571f4594-58dc-439b-80d9-884a432881a4	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 10:40:40.2848+00	2026-11-15 10:40:40.2848+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/145.0.7632.6 Safari/537.36	42.113.16.7	\N	\N	\N	\N	\N
effc74f0-a667-487a-9efb-5946ae0d5035	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 10:40:55.91314+00	2026-11-15 10:40:55.91314+00	\N	aal1	\N	\N	curl/8.18.0	42.113.16.7	\N	\N	\N	\N	\N
85636cc3-851e-4b12-9a78-2645965ec9d2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 10:41:15.267456+00	2026-11-15 10:41:15.267456+00	\N	aal1	\N	\N	curl/8.18.0	42.113.16.7	\N	\N	\N	\N	\N
3665d257-a99b-46d9-b9b5-ce881420c700	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 10:41:38.067646+00	2026-11-15 10:41:38.067646+00	\N	aal1	\N	\N	curl/8.18.0	42.113.16.7	\N	\N	\N	\N	\N
5f4acd64-7ee0-4d85-97f6-8ae8d828cccc	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 10:44:14.883682+00	2026-11-15 10:44:14.883682+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	42.113.16.7	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
571f4594-58dc-439b-80d9-884a432881a4	2026-11-15 10:40:40.288168+00	2026-11-15 10:40:40.288168+00	password	5889f7f7-8e39-49b8-a77f-d72a3984d43a
effc74f0-a667-487a-9efb-5946ae0d5035	2026-11-15 10:40:55.927726+00	2026-11-15 10:40:55.927726+00	password	5e856e28-9579-4552-be75-42522d023246
85636cc3-851e-4b12-9a78-2645965ec9d2	2026-11-15 10:41:15.276451+00	2026-11-15 10:41:15.276451+00	password	0f2f008d-bd05-4c75-89df-9e1202d93f23
3665d257-a99b-46d9-b9b5-ce881420c700	2026-11-15 10:41:38.070684+00	2026-11-15 10:41:38.070684+00	password	fbdefb13-51b3-43b7-970b-4f4b62cd8f2a
5f4acd64-7ee0-4d85-97f6-8ae8d828cccc	2026-11-15 10:44:14.890767+00	2026-11-15 10:44:14.890767+00	password	742b75f3-3225-4005-90d0-0ef2d3fe9655
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
00000000-0000-0000-0000-000000000000	8	4kyx2nkaorc6	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-15 10:40:40.286101+00	2026-11-15 10:40:40.286101+00	\N	571f4594-58dc-439b-80d9-884a432881a4
00000000-0000-0000-0000-000000000000	9	exd733rttrni	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-15 10:40:55.921059+00	2026-11-15 10:40:55.921059+00	\N	effc74f0-a667-487a-9efb-5946ae0d5035
00000000-0000-0000-0000-000000000000	10	64spqtes2dwb	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-15 10:41:15.269097+00	2026-11-15 10:41:15.269097+00	\N	85636cc3-851e-4b12-9a78-2645965ec9d2
00000000-0000-0000-0000-000000000000	11	7kj2torok5lq	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-15 10:41:38.069058+00	2026-11-15 10:41:38.069058+00	\N	3665d257-a99b-46d9-b9b5-ce881420c700
00000000-0000-0000-0000-000000000000	12	lg465iz4662s	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-15 10:44:14.886475+00	2026-11-15 10:44:14.886475+00	\N	5f4acd64-7ee0-4d85-97f6-8ae8d828cccc
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

COPY "public"."lop" ("id", "ten", "don_gia", "lich", "hoat_dong", "tao_luc") FROM stdin;
85c61e68-f656-451b-9a37-5cc4042786e1	Test	150000	{1,2,3,4,5,6,0}	t	2026-11-15 10:56:12.353282+00
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
37632d25-b954-4091-aee3-e0c388193fcf	85c61e68-f656-451b-9a37-5cc4042786e1	2026-11-15	lich	f	\N
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
eea097e1-f720-4e73-aa73-00c2f454515f	92f52996-8f53-480c-9330-94b3e2dfeea5@msnhung.local	\N	0356998740	test_ph	phu_huynh	t	0	t
769db48b-ba66-4966-814b-087cf859c802	2f523f60-c93a-4a0d-b812-0c6ba9e17a08@msnhung.local	tg01	\N	test_tg	tro_giang	t	150000	t
\.


--
-- Data for Name: hoc_sinh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."hoc_sinh" ("id", "ho_ten", "lop_id", "avatar", "ten_phu_huynh", "sdt_phu_huynh", "phu_huynh_id", "ngay_vao", "don_gia_rieng", "trang_thai", "ghi_chu", "tao_luc") FROM stdin;
099fe129-1356-46fb-b289-d496e63a72a3	Test_student	85c61e68-f656-451b-9a37-5cc4042786e1	avatar/099fe129-1356-46fb-b289-d496e63a72a3-1794740220703.jpg	test_ph	0356998740	eea097e1-f720-4e73-aa73-00c2f454515f	2026-11-15	150000	dang_hoc	\N	2026-11-15 10:56:59.953407+00
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
37632d25-b954-4091-aee3-e0c388193fcf	099fe129-1356-46fb-b289-d496e63a72a3	vang	6
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
c2daf17a-cb8b-4ea2-bee4-fa02d0343e16	anh	avatar/099fe129-1356-46fb-b289-d496e63a72a3-1794740220703.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-15 10:57:00.342+00	2026-11-15 10:57:00.342+00	2026-11-15 10:57:00.342+00	{"eTag": "\\"c27a4add6327cf043b3fcc1a72978a89\\"", "size": 16472, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-15T10:57:01.000Z", "contentLength": 16472, "httpStatusCode": 200}	6e59f673-d7e5-4028-a1e8-8bd613a3b154	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 12, true);


--
-- Name: nhat_ky_chot_so_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nhat_ky_chot_so_id_seq"', 4, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict K8h73XGfXGl4D3w5J4uC3lbf6T6UDK570LvYwE3uvRGKY7Ye6EGgTVF296WCJcd

RESET ALL;

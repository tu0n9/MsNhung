SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict v9yJqgqZFaBfPuPbjq8GpR848bpCd9f8JkTpEV4MeyYtURDDWF5ahIf0U8iuRFd

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
00000000-0000-0000-0000-000000000000	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	authenticated	authenticated	19f38f04-61b3-43ca-8335-d6f1b809a252@msnhung.local	$2a$10$/d5jbvE1Q5z7R3bauuwKj.nild4IT38Y91YL0fmLwd/foL.l0zsay	2026-11-18 10:49:19.499215+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:49:19.494982+00	2026-11-18 10:49:19.50072+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	877e2be5-c648-4abe-b7a6-8ceff0df9d68	authenticated	authenticated	b3a2e022-4ac8-4e39-bf92-8eb8929f8818@msnhung.local	$2a$10$Qs1dEePeo9NfuXobIUwD5uPgQYkTbuNobiZr9KdEJUN45D6hgYzWS	2026-11-18 10:51:52.198234+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:51:52.194016+00	2026-11-18 10:51:52.202419+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d45793f2-33af-41bf-91e4-410cf31087cc	authenticated	authenticated	f11afff5-2031-4c08-8ed1-1fb7a6e992b6@msnhung.local	$2a$10$3qL3UVR8xbLh.LD.BgmOu.BiYDs0rU2kNfqFwIP/yHVfeAnRyMBp6	2026-11-18 10:49:48.026277+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:49:48.022325+00	2026-11-18 10:49:48.027809+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	7925dcdb-7311-4634-896a-b4b6386b2df2	authenticated	authenticated	8ebb1955-2bf2-40c6-98fd-94c9104c1119@msnhung.local	$2a$10$.qKVyn44KDMq/QbVRuTwdO3arECmyPF2h0itwWyd/CfXAhMtW0bIq	2026-11-18 10:51:11.090954+00	\N		\N		\N			\N	2026-11-19 15:33:10.474457+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:51:11.085776+00	2026-11-19 15:33:19.891315+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	906a5d63-7289-4b55-a279-ff8db9b1a5c4	authenticated	authenticated	fcc895cd-f026-4e3f-81d1-1544acf6f727@msnhung.local	$2a$10$fk7lu2GZgnCeo8pi.fU9FOcvyaorYm2xYyyHDFwwDcs5.K2upZ5ia	2026-11-18 10:50:37.366255+00	\N		\N		\N			\N	2026-11-19 15:35:11.822744+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:50:37.354077+00	2026-11-19 15:35:11.855499+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	authenticated	authenticated	8a80fc97-4996-4655-afee-8eac991e9a12@msnhung.local	$2a$10$97fyKO0vuMQfYkBUWS32X.Q56vy5lBsfCC.aooYX7mAnGjFJmA3xW	2026-11-18 10:48:28.317304+00	\N		\N		\N			\N	2026-11-19 13:09:30.603649+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:48:28.280417+00	2026-11-19 16:31:49.537419+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8b0b82af-8eee-477b-bc50-b5c72837c2f7	authenticated	authenticated	9b44af75-9759-4353-8276-9a34385879ac@msnhung.local	$2a$10$8vao8LW315Dfkchm1MBos.ijJyY9XJ1wNm.MG.jh30CoYiaS2ng2a	2026-11-18 10:58:11.97509+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:58:11.951136+00	2026-11-18 10:58:11.976631+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9b8a626d-c10d-443e-adcf-8b152a9b6c90	authenticated	authenticated	ac70b571-f88b-4b91-910e-2056e06887f5@msnhung.local	$2a$10$L6Hx8GBRQb3UJP0RgrP49uzhjOQobgfNWJ4h4I/xunR7cf5q/sRSW	2026-11-18 11:01:13.795726+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 11:01:13.775131+00	2026-11-18 11:01:13.797193+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	43d2ab0d-e902-49d7-9e81-a3696d296ad2	authenticated	authenticated	admin@msnhung.local	$2a$10$BCdkciwG3PPPv4yCMa50oefbpbFKmU9xlXou.UTQCXONcdSKZxnAO	2026-11-15 10:27:58.76274+00	\N		\N		\N			\N	2026-11-19 17:59:08.483688+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:27:58.741954+00	2026-11-19 17:59:08.489424+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
43d2ab0d-e902-49d7-9e81-a3696d296ad2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{"sub": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "email": "admin@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-15 10:27:58.754339+00	2026-11-15 10:27:58.754416+00	2026-11-15 10:27:58.754416+00	b50362a3-6fb0-4a13-ae11-da1f5fee0d56
69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	{"sub": "69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed", "email": "8a80fc97-4996-4655-afee-8eac991e9a12@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-18 10:48:28.305073+00	2026-11-18 10:48:28.305156+00	2026-11-18 10:48:28.305156+00	7bd58406-0c7c-4af1-aacf-c3f8b1ee9001
77ffcb33-c53a-41b3-a728-f1fdb13cc37b	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	{"sub": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b", "email": "19f38f04-61b3-43ca-8335-d6f1b809a252@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-18 10:49:19.496745+00	2026-11-18 10:49:19.496809+00	2026-11-18 10:49:19.496809+00	10bb2e34-e574-4019-bd4a-51d46911f99c
d45793f2-33af-41bf-91e4-410cf31087cc	d45793f2-33af-41bf-91e4-410cf31087cc	{"sub": "d45793f2-33af-41bf-91e4-410cf31087cc", "email": "f11afff5-2031-4c08-8ed1-1fb7a6e992b6@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-18 10:49:48.023678+00	2026-11-18 10:49:48.023752+00	2026-11-18 10:49:48.023752+00	e686dbe3-8ad0-43d7-abcd-b5138e318b09
906a5d63-7289-4b55-a279-ff8db9b1a5c4	906a5d63-7289-4b55-a279-ff8db9b1a5c4	{"sub": "906a5d63-7289-4b55-a279-ff8db9b1a5c4", "email": "fcc895cd-f026-4e3f-81d1-1544acf6f727@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-18 10:50:37.362288+00	2026-11-18 10:50:37.362367+00	2026-11-18 10:50:37.362367+00	9242fe6f-60d0-437d-8f06-91fe7628a53d
7925dcdb-7311-4634-896a-b4b6386b2df2	7925dcdb-7311-4634-896a-b4b6386b2df2	{"sub": "7925dcdb-7311-4634-896a-b4b6386b2df2", "email": "8ebb1955-2bf2-40c6-98fd-94c9104c1119@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-18 10:51:11.088121+00	2026-11-18 10:51:11.088274+00	2026-11-18 10:51:11.088274+00	0fcf79ef-d0f0-4338-aeda-641b6ad99325
877e2be5-c648-4abe-b7a6-8ceff0df9d68	877e2be5-c648-4abe-b7a6-8ceff0df9d68	{"sub": "877e2be5-c648-4abe-b7a6-8ceff0df9d68", "email": "b3a2e022-4ac8-4e39-bf92-8eb8929f8818@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-18 10:51:52.196137+00	2026-11-18 10:51:52.196204+00	2026-11-18 10:51:52.196204+00	4d52f81d-b8a0-4bb1-8761-11d8ec3a78bc
8b0b82af-8eee-477b-bc50-b5c72837c2f7	8b0b82af-8eee-477b-bc50-b5c72837c2f7	{"sub": "8b0b82af-8eee-477b-bc50-b5c72837c2f7", "email": "9b44af75-9759-4353-8276-9a34385879ac@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-18 10:58:11.968717+00	2026-11-18 10:58:11.968795+00	2026-11-18 10:58:11.968795+00	ca7a4aa3-fa51-46e0-a352-4901712e65b5
9b8a626d-c10d-443e-adcf-8b152a9b6c90	9b8a626d-c10d-443e-adcf-8b152a9b6c90	{"sub": "9b8a626d-c10d-443e-adcf-8b152a9b6c90", "email": "ac70b571-f88b-4b91-910e-2056e06887f5@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-18 11:01:13.789586+00	2026-11-18 11:01:13.789683+00	2026-11-18 11:01:13.789683+00	c3e44f03-a4bd-412e-aae0-f61f0f845858
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
138b0991-bade-4ac1-99f0-d5b4e29bfcce	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	2026-11-18 11:15:04.570018+00	2026-11-19 09:28:18.636381+00	\N	aal1	\N	2026-11-19 09:28:18.636189	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.2 Mobile/15E148 Safari/604.1	171.251.153.178	\N	\N	\N	\N	\N
a4f49e36-4306-410d-9f04-b23e11e86a0f	906a5d63-7289-4b55-a279-ff8db9b1a5c4	2026-11-18 11:43:23.634035+00	2026-11-19 13:04:04.894628+00	\N	aal1	\N	2026-11-19 13:04:04.894502	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.1 Mobile/15E148 Safari/604.1	171.255.123.110	\N	\N	\N	\N	\N
eeb51907-2ea4-4b83-ac18-4d4d82e61ad1	7925dcdb-7311-4634-896a-b4b6386b2df2	2026-11-19 15:33:10.47744+00	2026-11-19 15:33:10.47744+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	183.80.74.68	\N	\N	\N	\N	\N
0b5f5220-9718-46f0-ac89-fdb7950d083e	906a5d63-7289-4b55-a279-ff8db9b1a5c4	2026-11-19 15:35:11.823551+00	2026-11-19 15:35:11.823551+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	104.28.222.73	\N	\N	\N	\N	\N
c0d0a073-5f8e-45d2-b701-61fb6aee22fd	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	2026-11-19 13:09:30.604521+00	2026-11-19 16:31:49.563857+00	\N	aal1	\N	2026-11-19 16:31:49.563726	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.2 Mobile/15E148 Safari/604.1	118.68.111.181	\N	\N	\N	\N	\N
6ee5fbd4-1327-4c1f-bb0c-6d5adcb1540c	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-19 17:59:08.483825+00	2026-11-19 17:59:08.483825+00	\N	aal1	\N	\N	Python-urllib/3.12	104.28.222.73	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
138b0991-bade-4ac1-99f0-d5b4e29bfcce	2026-11-18 11:15:04.66948+00	2026-11-18 11:15:04.66948+00	password	0e8bcbd4-b605-4f8d-92ef-a09f44104bec
a4f49e36-4306-410d-9f04-b23e11e86a0f	2026-11-18 11:43:23.662095+00	2026-11-18 11:43:23.662095+00	password	f04701af-705f-4e0d-9fa8-f70a51ccee56
c0d0a073-5f8e-45d2-b701-61fb6aee22fd	2026-11-19 13:09:30.662961+00	2026-11-19 13:09:30.662961+00	password	af8deb5d-c21a-41f3-832b-e2efa8a9f085
eeb51907-2ea4-4b83-ac18-4d4d82e61ad1	2026-11-19 15:33:10.569478+00	2026-11-19 15:33:10.569478+00	password	f9153c04-47e8-4095-9108-0105f4f831fa
0b5f5220-9718-46f0-ac89-fdb7950d083e	2026-11-19 15:35:11.8588+00	2026-11-19 15:35:11.8588+00	password	c4a85f2d-4074-4d4b-89da-a88f87957951
6ee5fbd4-1327-4c1f-bb0c-6d5adcb1540c	2026-11-19 17:59:08.490995+00	2026-11-19 17:59:08.490995+00	password	5e132481-2f04-47d4-a44d-85e5b8ee195c
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
00000000-0000-0000-0000-000000000000	523	jlbd2ocuqilc	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-19 17:59:08.488124+00	2026-11-19 17:59:08.488124+00	\N	6ee5fbd4-1327-4c1f-bb0c-6d5adcb1540c
00000000-0000-0000-0000-000000000000	492	4ar5dq6mxsrv	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-18 11:15:04.612498+00	2026-11-18 12:20:21.000342+00	\N	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	494	yop7s75def6u	906a5d63-7289-4b55-a279-ff8db9b1a5c4	t	2026-11-18 11:43:23.652022+00	2026-11-18 13:04:56.804141+00	\N	a4f49e36-4306-410d-9f04-b23e11e86a0f
00000000-0000-0000-0000-000000000000	497	oiucqvgppb62	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-18 12:20:21.012121+00	2026-11-18 13:22:21.165498+00	4ar5dq6mxsrv	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	499	he4pscw7nv4q	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-18 13:22:21.175637+00	2026-11-18 16:34:59.646129+00	oiucqvgppb62	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	502	hk4ftmgehg54	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-18 16:34:59.669286+00	2026-11-19 09:28:18.584226+00	he4pscw7nv4q	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	511	4b3s52br5fd3	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	f	2026-11-19 09:28:18.60024+00	2026-11-19 09:28:18.60024+00	hk4ftmgehg54	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	498	d46sligcrtxe	906a5d63-7289-4b55-a279-ff8db9b1a5c4	t	2026-11-18 13:04:56.822369+00	2026-11-19 11:59:46.963383+00	yop7s75def6u	a4f49e36-4306-410d-9f04-b23e11e86a0f
00000000-0000-0000-0000-000000000000	512	gxviiezsbur7	906a5d63-7289-4b55-a279-ff8db9b1a5c4	t	2026-11-19 11:59:46.977167+00	2026-11-19 13:04:04.842797+00	d46sligcrtxe	a4f49e36-4306-410d-9f04-b23e11e86a0f
00000000-0000-0000-0000-000000000000	513	z5v4ivlqh4va	906a5d63-7289-4b55-a279-ff8db9b1a5c4	f	2026-11-19 13:04:04.852987+00	2026-11-19 13:04:04.852987+00	gxviiezsbur7	a4f49e36-4306-410d-9f04-b23e11e86a0f
00000000-0000-0000-0000-000000000000	515	tez5ezxmlo7a	7925dcdb-7311-4634-896a-b4b6386b2df2	f	2026-11-19 15:33:10.535556+00	2026-11-19 15:33:10.535556+00	\N	eeb51907-2ea4-4b83-ac18-4d4d82e61ad1
00000000-0000-0000-0000-000000000000	516	2vr7brehe4xk	906a5d63-7289-4b55-a279-ff8db9b1a5c4	f	2026-11-19 15:35:11.849644+00	2026-11-19 15:35:11.849644+00	\N	0b5f5220-9718-46f0-ac89-fdb7950d083e
00000000-0000-0000-0000-000000000000	514	uqzjyb2jzeez	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-19 13:09:30.633872+00	2026-11-19 16:31:49.504555+00	\N	c0d0a073-5f8e-45d2-b701-61fb6aee22fd
00000000-0000-0000-0000-000000000000	517	5aimmp2svbp6	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	f	2026-11-19 16:31:49.525176+00	2026-11-19 16:31:49.525176+00	uqzjyb2jzeez	c0d0a073-5f8e-45d2-b701-61fb6aee22fd
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
0d76975d-4f18-47de-adb8-3992850432eb	Ielts pre chiều t7	200000	{6}	t	2026-11-18 11:05:43.398604+00	\N	{"6": {"bd": "15:15", "kt": "17:15"}}
1d80e3bc-dfb1-4398-b242-bf46211e8e80	Cấp 1 Ca 18-20 t5	150000	{4}	t	2026-11-19 12:40:30.425366+00	\N	{"4": {"bd": "18:00", "kt": "20:00"}}
73c5a4e8-0c09-4062-a397-b56f9351b685	Lớp ielts cơ bản chiều t7 ca 2 	200000	{6}	t	2026-11-18 11:43:35.614655+00	18:00-20:00	{"6": {"bd": "18:00", "kt": "20:00"}}
633443ce-1a36-49f5-80c2-24a8eaf5e22e	1-1 Ngọc Linh 	1000000	{5}	t	2026-11-19 12:50:22.155933+00	\N	{"5": {"bd": "13:00", "kt": "15:00"}}
4df112a4-8db9-4c78-a747-5ab93c497a19	1-1 Trung Dũng 	1000000	{5}	t	2026-11-19 12:51:37.855395+00	\N	{"5": {"bd": "15:00", "kt": "17:00"}}
4e49d265-ef05-4457-8c75-ff435e266182	Ca 18-20 T4	150000	{3}	t	2026-11-18 10:38:23.726462+00	18:00-20:00	{"3": {"bd": "18:00", "kt": "20:00"}}
04be4e4f-b69a-4443-b1a1-61ff6eee57cb	Ca 1 tối t6 	150000	{5}	t	2026-11-19 13:04:57.355675+00	\N	{"5": {"bd": "18:00", "kt": "20:00"}}
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
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-04	lich	f	\N	\N	\N
a1c02c20-6317-4d61-ba6b-656c1156c884	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-11	lich	f	\N	\N	\N
92b3cab2-5ac5-48d8-a4a8-9b189028353a	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-18	lich	f	\N	\N	\N
828c679c-152f-4e56-a36d-69158139863f	0d76975d-4f18-47de-adb8-3992850432eb	2026-11-07	lich	f	\N	15:15:00	17:15:00
c8f1d446-55a0-41fa-8553-827903f3aab7	0d76975d-4f18-47de-adb8-3992850432eb	2026-11-14	lich	f	\N	15:15:00	17:15:00
1c00f3c5-b4b9-4095-b86c-100d576579e3	0d76975d-4f18-47de-adb8-3992850432eb	2026-11-21	lich	f	\N	15:15:00	17:15:00
256eace7-fc21-4c4f-b5f7-9688da6a1291	0d76975d-4f18-47de-adb8-3992850432eb	2026-11-28	lich	f	\N	15:15:00	17:15:00
50b1f68a-fb37-4b70-ba5c-7ba6ee715129	73c5a4e8-0c09-4062-a397-b56f9351b685	2026-11-07	lich	f	\N	\N	\N
2da115bc-1518-4359-a7e2-f524f536ba42	73c5a4e8-0c09-4062-a397-b56f9351b685	2026-11-14	lich	f	\N	\N	\N
eea2018b-766f-4172-aefc-f89454e11876	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-05	lich	f	\N	18:00:00	20:00:00
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-12	lich	f	\N	18:00:00	20:00:00
71e54043-f25e-48e8-873d-9f249bd6150c	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-19	lich	f	\N	18:00:00	20:00:00
c15f4437-b842-4c90-afa8-6ef3d96900a6	73c5a4e8-0c09-4062-a397-b56f9351b685	2026-11-21	lich	f	\N	18:00:00	20:00:00
804fbd08-2178-4c1a-9c0a-293b1ca0462a	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-25	lich	f	\N	18:00:00	20:00:00
ceb1cfa4-71bf-44bb-8697-f8fa4958502b	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-26	lich	f	\N	18:00:00	20:00:00
6f0c4e19-2edb-4f30-a26b-fad2581c21cc	73c5a4e8-0c09-4062-a397-b56f9351b685	2026-11-28	lich	f	\N	18:00:00	20:00:00
3e8c80ca-802a-4b44-95ea-f9f1b274fb7e	633443ce-1a36-49f5-80c2-24a8eaf5e22e	2026-11-06	lich	f	\N	13:00:00	15:00:00
c510b585-9651-4983-976c-9c4af08cd484	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-06	lich	f	\N	15:00:00	17:00:00
33376ba3-08e6-4509-a001-d4f6d0898b26	633443ce-1a36-49f5-80c2-24a8eaf5e22e	2026-11-13	lich	f	\N	13:00:00	15:00:00
4d50f71f-4d1d-4be0-a868-093fd1896077	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-13	lich	f	\N	15:00:00	17:00:00
60bd6335-c8dd-40c3-9fed-be5893431eeb	633443ce-1a36-49f5-80c2-24a8eaf5e22e	2026-11-20	lich	f	\N	13:00:00	15:00:00
1dc15fdd-fa0f-47e7-b22c-8e44dc54cd1b	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-20	lich	f	\N	15:00:00	17:00:00
14c61656-86ac-4ed2-b712-4349c7d908af	633443ce-1a36-49f5-80c2-24a8eaf5e22e	2026-11-27	lich	f	\N	13:00:00	15:00:00
67e5ca37-7a1e-4f4d-90f9-66edc5d2bdb0	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-27	lich	f	\N	15:00:00	17:00:00
88e99a85-3d79-46e3-b5f4-e5caa7817535	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-06	lich	f	\N	18:00:00	20:00:00
45a23d78-e0da-44ae-9568-b0865bd1bc0f	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-13	lich	f	\N	18:00:00	20:00:00
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-20	lich	f	\N	18:00:00	20:00:00
1a2bdf87-fb6d-4b4e-a660-5517e4efd474	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-27	lich	f	\N	18:00:00	20:00:00
\.


--
-- Data for Name: anh_buoi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."anh_buoi" ("id", "buoi_id", "duong_dan", "tao_luc") FROM stdin;
205627d0-8772-4e5f-9b8b-34c5b0e4773b	f6e57378-f553-452e-9d0c-3cd5920181c2	buoi/f6e57378-f553-452e-9d0c-3cd5920181c2/90519080-c18d-407c-a4ea-b97c733a9440.jpg	2026-11-17 13:36:49.533277+00
b7761556-cb3c-4fd4-961e-61b735250d1a	92b3cab2-5ac5-48d8-a4a8-9b189028353a	buoi/92b3cab2-5ac5-48d8-a4a8-9b189028353a/2c9ad16e-8d97-4db5-9b10-a08643e38e86.jpg	2026-11-18 12:20:49.956401+00
73d1ef3a-4bd1-438a-baf5-4ec5ec7aa055	71e54043-f25e-48e8-873d-9f249bd6150c	buoi/71e54043-f25e-48e8-873d-9f249bd6150c/d65e8130-864b-4a59-b33b-326b36931b00.jpg	2026-11-19 13:05:42.199715+00
1dff6559-51dd-43e3-9128-df1d47346d8c	7546fba6-4be9-440e-9ab2-c379d4c471e9	buoi/7546fba6-4be9-440e-9ab2-c379d4c471e9/4bed649d-8156-4425-86ef-d2f0b9c42959.jpg	2026-11-19 13:48:19.147381+00
\.


--
-- Data for Name: tai_khoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tai_khoan" ("id", "email", "ten_dang_nhap", "so_dien_thoai", "ho_ten", "vai_tro", "phai_doi_mat_khau", "don_gia_buoi", "hoat_dong") FROM stdin;
43d2ab0d-e902-49d7-9e81-a3696d296ad2	admin@msnhung.local	admin	\N	Quản trị	admin	f	0	t
77ffcb33-c53a-41b3-a728-f1fdb13cc37b	19f38f04-61b3-43ca-8335-d6f1b809a252@msnhung.local	ngan	\N	Ngân	tro_giang	t	100000	t
d45793f2-33af-41bf-91e4-410cf31087cc	f11afff5-2031-4c08-8ed1-1fb7a6e992b6@msnhung.local	thanh	\N	Thành	tro_giang	t	100000	t
877e2be5-c648-4abe-b7a6-8ceff0df9d68	b3a2e022-4ac8-4e39-bf92-8eb8929f8818@msnhung.local	duong	\N	Minh Dương	tro_giang	t	100000	t
8b0b82af-8eee-477b-bc50-b5c72837c2f7	9b44af75-9759-4353-8276-9a34385879ac@msnhung.local	thanhielts	\N	Thành lớp ielts nâng cao 	tro_giang	t	50000	t
9b8a626d-c10d-443e-adcf-8b152a9b6c90	ac70b571-f88b-4b91-910e-2056e06887f5@msnhung.local	tuanielts	\N	Tuấn lớp ielts nâng cao 	tro_giang	t	50000	t
69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	8a80fc97-4996-4655-afee-8eac991e9a12@msnhung.local	tuan	\N	Anh Tuấn	tro_giang	f	100000	t
906a5d63-7289-4b55-a279-ff8db9b1a5c4	fcc895cd-f026-4e3f-81d1-1544acf6f727@msnhung.local	nga	\N	Thiên Nga	tro_giang	f	100000	t
7925dcdb-7311-4634-896a-b4b6386b2df2	8ebb1955-2bf2-40c6-98fd-94c9104c1119@msnhung.local	manh	\N	Trần Mạnh	tro_giang	f	100000	t
\.


--
-- Data for Name: hoc_sinh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."hoc_sinh" ("id", "ho_ten", "lop_id", "avatar", "ten_phu_huynh", "sdt_phu_huynh", "phu_huynh_id", "ngay_vao", "don_gia_rieng", "trang_thai", "ghi_chu", "tao_luc", "sticker_dau_ky", "link_zalo") FROM stdin;
a6071b67-2130-479d-9960-be9b713e379d	Lê Duy Anh	4e49d265-ef05-4457-8c75-ff435e266182	avatar/a6071b67-2130-479d-9960-be9b713e379d-1794998592009.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:43:11.843234+00	0	\N
09426ac0-e7af-47bc-a029-195fcee72b46	Bùi Bách	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/09426ac0-e7af-47bc-a029-195fcee72b46-1794921820760.jpg	\N	\N	\N	2026-11-01	0	dang_hoc	\N	2026-11-17 13:23:40.619385+00	0	\N
2a71aebf-2868-4496-8c0d-26a9c5fdac6d	Gia Khánh	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/2a71aebf-2868-4496-8c0d-26a9c5fdac6d-1794921883142.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:24:43.072064+00	0	\N
6125884c-53f0-45ee-a303-3d03bc111254	Gia Minh	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/6125884c-53f0-45ee-a303-3d03bc111254-1794921934570.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:25:34.500012+00	0	\N
98deb901-bd60-4e1a-94c1-0ab944440ecb	Hải Hiếu	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/98deb901-bd60-4e1a-94c1-0ab944440ecb-1794921993396.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:26:33.273193+00	0	\N
1b364415-27c0-4528-b772-6f9331702874	Hoàng Tuấn	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/1b364415-27c0-4528-b772-6f9331702874-1794922033355.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:27:13.282976+00	0	\N
9c5e27df-2361-46d3-9551-92dc6109c2f5	Lâm Tùng	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/9c5e27df-2361-46d3-9551-92dc6109c2f5-1794922065703.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:27:45.537928+00	0	\N
b3065572-cd6a-4131-bae6-4f0b9ed4f46f	Nam Phong	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/b3065572-cd6a-4131-bae6-4f0b9ed4f46f-1794922100871.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:28:20.821969+00	0	\N
e561c6d5-6fbc-462a-ab2e-e1423f3b692f	Ngọc Minh	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	avatar/e561c6d5-6fbc-462a-ab2e-e1423f3b692f-1794922166340.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:29:26.274078+00	0	\N
800d8814-bc3d-460b-827b-97ef5dc49eda	Nguyễn Đăng Dương	4e49d265-ef05-4457-8c75-ff435e266182	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:44:09.588667+00	0	\N
e3906889-be7a-483c-a548-52c80afb47e7	Nguyễn Tự Huy	4e49d265-ef05-4457-8c75-ff435e266182	avatar/e3906889-be7a-483c-a548-52c80afb47e7-1794998686016.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:44:45.767249+00	0	\N
eaff414d-ac8c-44a0-9ed3-483992927fb9	Ánh Long	4e49d265-ef05-4457-8c75-ff435e266182	avatar/eaff414d-ac8c-44a0-9ed3-483992927fb9-1794998386874.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:39:46.828145+00	0	\N
bc4166c1-2a49-43d1-9769-f752dcc2d91c	Bùi Ngọc Hà	4e49d265-ef05-4457-8c75-ff435e266182	avatar/bc4166c1-2a49-43d1-9769-f752dcc2d91c-1794998426835.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:40:26.742895+00	0	\N
a409e2ce-01c6-49e8-bbdf-5caf4477db1e	Đinh Bá Quang Anh	4e49d265-ef05-4457-8c75-ff435e266182	avatar/a409e2ce-01c6-49e8-bbdf-5caf4477db1e-1794998465030.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:41:04.952525+00	0	\N
47286437-2fcd-451e-b01f-c19e8cbbcbef	Đỗ Phương Thu	4e49d265-ef05-4457-8c75-ff435e266182	avatar/47286437-2fcd-451e-b01f-c19e8cbbcbef-1794998506091.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:41:46.019686+00	0	\N
33a3cfe1-6ebb-46fb-b851-4282d579a315	Hoàng Diệu Linh	4e49d265-ef05-4457-8c75-ff435e266182	avatar/33a3cfe1-6ebb-46fb-b851-4282d579a315-1794998542956.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:42:22.881958+00	0	\N
94c6acd3-4c22-405e-a976-d9cd63a72345	Trần Gia Bảo	4e49d265-ef05-4457-8c75-ff435e266182	avatar/94c6acd3-4c22-405e-a976-d9cd63a72345-1794998722264.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:45:22.118529+00	0	\N
04c0644a-6490-4551-9b84-2b3e606b2f11	Trịnh Ngọc Bảo Anh	4e49d265-ef05-4457-8c75-ff435e266182	avatar/04c0644a-6490-4551-9b84-2b3e606b2f11-1794998765684.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:46:05.536913+00	0	\N
7c7fc404-3d84-4d6b-8972-3926976216f4	Trịnh Ngọc Bảo Trân	4e49d265-ef05-4457-8c75-ff435e266182	avatar/7c7fc404-3d84-4d6b-8972-3926976216f4-1794998800089.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:46:39.986746+00	0	\N
d2c38a11-b7b8-41da-9cf9-9f5808755c9b	Tùng Lâm	4e49d265-ef05-4457-8c75-ff435e266182	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:47:01.711591+00	0	\N
0377768d-cc45-49f5-a96d-8d170c3bf41f	Vũ Hải Hà	4e49d265-ef05-4457-8c75-ff435e266182	avatar/0377768d-cc45-49f5-a96d-8d170c3bf41f-1794998858970.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:47:38.903246+00	0	\N
ad4eb7e3-ef7e-442e-9e18-766284275ff7	Chu Bảo Ngân	0d76975d-4f18-47de-adb8-3992850432eb	avatar/ad4eb7e3-ef7e-442e-9e18-766284275ff7-1794999976075.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:06:16.031289+00	0	\N
e57f5ae7-1615-43da-89c0-af87f74cdc97	Hoàng Diệu Linh	0d76975d-4f18-47de-adb8-3992850432eb	avatar/e57f5ae7-1615-43da-89c0-af87f74cdc97-1795000028815.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:07:08.678948+00	0	\N
e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af	Lê Thị Anh Thư	0d76975d-4f18-47de-adb8-3992850432eb	avatar/e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af-1795003669718.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:08:14.94948+00	0	\N
a7a4a0fd-b313-4cc7-a91a-43726d34edc9	Lê Hồng Ngọc	0d76975d-4f18-47de-adb8-3992850432eb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:08:40.036682+00	0	\N
4f80d2ff-fc12-472d-8330-f9d4eba659ab	Nguyễn Hải Sơn	0d76975d-4f18-47de-adb8-3992850432eb	avatar/4f80d2ff-fc12-472d-8330-f9d4eba659ab-1795000166855.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:09:26.774658+00	0	\N
d52ba56a-1453-4315-8de9-75f0bbe3c7b4	Nguyễn Thị Ngọc	0d76975d-4f18-47de-adb8-3992850432eb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:09:51.735342+00	0	\N
d33f6ef4-92f6-4de1-bde4-d15d6f1dc5c7	Phạm Sương Mai	0d76975d-4f18-47de-adb8-3992850432eb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:10:09.65974+00	0	\N
ef8b67df-fbeb-4c52-ba94-4be8fdb8053b	Phạm Thị Vân Anh	0d76975d-4f18-47de-adb8-3992850432eb	avatar/ef8b67df-fbeb-4c52-ba94-4be8fdb8053b-1795000241808.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:10:41.735205+00	0	\N
fa327d0b-f6b8-4d58-b67a-74eafeea4798	Phạm Trí Thành	0d76975d-4f18-47de-adb8-3992850432eb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:11:04.707612+00	0	\N
b20830c3-0747-45aa-bba0-0efd2f0cd32e	Ngô Thảo Chi	0d76975d-4f18-47de-adb8-3992850432eb	avatar/b20830c3-0747-45aa-bba0-0efd2f0cd32e-1795003682982.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:11:47.747478+00	0	\N
3f7ce3c1-adc5-4a3c-b88e-5f6cd8aeac91	Vũ Hải Long	0d76975d-4f18-47de-adb8-3992850432eb	avatar/3f7ce3c1-adc5-4a3c-b88e-5f6cd8aeac91-1795000346567.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:12:26.51448+00	0	\N
3706e8ca-a8c3-47ea-8629-73c3c62ab4f6	Chu Bảo Ngân	73c5a4e8-0c09-4062-a397-b56f9351b685	avatar/3706e8ca-a8c3-47ea-8629-73c3c62ab4f6-1795002295550.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:44:55.50174+00	0	\N
d8534bf8-c1b6-4b40-8ce2-2e4c4407ee0c	Hoàng Diệu Linh	73c5a4e8-0c09-4062-a397-b56f9351b685	avatar/d8534bf8-c1b6-4b40-8ce2-2e4c4407ee0c-1795002323128.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:45:22.925537+00	0	\N
6e534433-03c4-452e-ab68-988e6cceb111	Lê Thị Anh Thư	73c5a4e8-0c09-4062-a397-b56f9351b685	avatar/6e534433-03c4-452e-ab68-988e6cceb111-1795002416126.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:46:55.983237+00	0	\N
08b349c7-6d97-465f-97dd-f3437e6227e1	Lê Hồng Ngọc	73c5a4e8-0c09-4062-a397-b56f9351b685	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:47:20.356878+00	0	\N
1ef16544-19ec-4e43-9f9c-c4d8eb485b29	Nguyễn Hải Sơn	73c5a4e8-0c09-4062-a397-b56f9351b685	avatar/1ef16544-19ec-4e43-9f9c-c4d8eb485b29-1795002468641.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:47:48.496603+00	0	\N
d624703f-7d65-4ba6-8d6e-501b919bff4b	Nguyễn Thế Hiếu	73c5a4e8-0c09-4062-a397-b56f9351b685	avatar/d624703f-7d65-4ba6-8d6e-501b919bff4b-1795002510421.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:48:30.247223+00	0	\N
5758ae90-4154-4dcf-a4df-94abedf1e033	Nguyễn Thị Ngọc	73c5a4e8-0c09-4062-a397-b56f9351b685	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:48:53.076187+00	0	\N
80a446ab-7ca6-4ee5-9df7-1d9e267e4d25	Phạm Sương Mai	73c5a4e8-0c09-4062-a397-b56f9351b685	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:49:07.854985+00	0	\N
437e3823-c23f-494c-82ef-7866580d5abe	Phạm Thị Vân Anh	73c5a4e8-0c09-4062-a397-b56f9351b685	avatar/437e3823-c23f-494c-82ef-7866580d5abe-1795002570430.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:49:30.368548+00	0	\N
668df112-f3f0-4267-8b54-6cbb43ae966c	Phạm Trí Thành	73c5a4e8-0c09-4062-a397-b56f9351b685	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:49:51.342652+00	0	\N
6dfcd269-b65d-46e0-9734-6708c3bff15d	Ngô Thảo Chi	73c5a4e8-0c09-4062-a397-b56f9351b685	avatar/6dfcd269-b65d-46e0-9734-6708c3bff15d-1795002611697.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:50:11.643741+00	0	\N
b799cd61-1a93-47d7-b390-66f48d357a1d	Vũ Hải Long	73c5a4e8-0c09-4062-a397-b56f9351b685	avatar/b799cd61-1a93-47d7-b390-66f48d357a1d-1795002648049.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 11:50:47.889282+00	0	\N
8449f57a-28fa-40e2-b016-52d8fdfb1a1a	Đặng Bảo An	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:42:37.088899+00	0	\N
127cf384-4ac0-4a57-8d3e-7f3755cf5e76	Đỗ Thùy Linh 	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:42:53.079265+00	0	\N
47de7f3c-c311-44a9-b8e9-d535f63909c5	Hoàng Mai Phương 	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:43:07.199964+00	0	\N
a5df955d-2040-41d3-a691-2a9526050dba	Hoàng Trung Đức 	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:43:24.654764+00	0	\N
703a8acd-02b0-4f08-8151-7504f51802c1	Hoàng Trung Hải 	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:43:38.416812+00	0	\N
4d36c077-ad54-4671-8a64-3c7d297faca3	Lê Tiến Anh 	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:44:12.041399+00	0	\N
d96f705a-caed-4aed-8c5a-2f729630dd64	Phạm Bảo Anh 	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:44:44.198055+00	0	\N
10e6b491-c559-4087-bbc6-d6520f6d21f5	Phạm Ngọc Anh 	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:45:09.048392+00	0	\N
64a37c23-5108-4025-bcb3-e7ea6b1fe979	Phạm Nhật Linh (Sam)	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:45:26.515177+00	0	\N
b218ff29-82e7-4386-8eae-0dd472b1894b	Trần Gia Nghĩa (Ỉn)	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:46:09.638888+00	0	\N
da8f3b69-bcb6-46d7-b324-e5f61183d270	Vũ Dương Bảo An 	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:46:49.705307+00	0	\N
e1d9c6da-9520-433a-9485-201be17d736d	Lê Danh Gia Bảo	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:43:54.430225+00	0	\N
e6af6149-70f4-4687-8390-4f3886b7a42e	Trần Gia Khiêm (Voi)	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:45:50.826526+00	0	\N
3e45fe76-7884-4e40-8f60-d54cb47ea033	Tú Anh	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:46:22.947966+00	0	\N
e5d63dee-19fe-4ae1-a741-08a03111eb1d	Nguyễn Ngọc Châu An	1d80e3bc-dfb1-4398-b242-bf46211e8e80	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:44:30.250637+00	0	\N
3fa5c3fb-712e-45c0-bfce-5124fe4c7c73	Ngọc Minh	633443ce-1a36-49f5-80c2-24a8eaf5e22e	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:50:38.442405+00	0	\N
7dd34d24-cee2-4506-98f3-90bc27e293a9	Trung Dũng 	4df112a4-8db9-4c78-a747-5ab93c497a19	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:00:43.008932+00	0	\N
93923906-397a-4ecc-bfce-af2b834f4d98	Bùi Ngọc Hà	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:05:39.234021+00	0	\N
552de5e9-d599-4a8e-ace8-d80518dfe059	Hà Đoàn Nhật Hoàng 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:06:01.175745+00	0	\N
55328067-088a-4f1b-ae66-507f6d56aa15	Hoàng Trung Hải 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:07:09.119992+00	0	\N
1555600c-8358-42eb-b9f3-611dbeab3641	Khuất Hoàng An 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:07:23.152836+00	0	\N
ff386fd8-15b5-42a0-b103-536c60684008	Lê Minh Huy	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:07:37.094095+00	0	\N
892394ca-8163-4263-9b19-957de160996b	Nguyễn Đăng Dương 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:08:08.684126+00	0	\N
242f8971-c4c0-44d1-8f4e-c26d77efd8ef	Nguyễn Hà Giang 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:08:26.674575+00	0	\N
dbe5da5f-5458-4023-abe1-26fa2dc82c1c	Nguyễn Hải Đăng 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:09:18.770597+00	0	\N
60cdb4a9-3025-44d3-8086-b14612242c76	Nguyễn Hải Đăng 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:09:53.691685+00	0	\N
f85931d6-9ede-45a1-acde-ba4789c6e853	Nguyễn Ngọc Quân 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:10:15.639752+00	0	\N
78e11889-7937-481d-8234-98df5fc25ddc	Phạm Minh Khôi 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:10:55.593686+00	0	\N
4478a3b0-0dad-4ade-aff7-f4009e2fe568	Tùng Lâm 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:13:09.146202+00	0	\N
8c90a7ae-70a0-4941-9048-bb64789516ad	Vũ Hải Hà 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:13:34.90197+00	0	\N
6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	Vũ Quốc Tùng 	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:13:57.036645+00	0	\N
\.


--
-- Data for Name: chi_phi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."chi_phi" ("id", "ngay", "danh_muc", "so_tien", "ghi_chu", "hoc_sinh_id") FROM stdin;
\.


--
-- Data for Name: danh_gia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."danh_gia" ("id", "thang", "lop_id", "ten_lop", "hoc_sinh_id", "ten_hoc_sinh", "khoa_hoc", "kho_khan", "tro_giang", "gui_luc") FROM stdin;
9e064250-8093-43eb-9b41-3afbe5cc61cb	2026-11-01	4e49d265-ef05-4457-8c75-ff435e266182	Ca 18-20 T4	eaff414d-ac8c-44a0-9ed3-483992927fb9	Ánh Long	\N	\N	[{"id": "69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed", "ten": "Anh Tuấn", "ho_tro": 4, "chua_bai": "fer", "nhan_xet": "ntgcj", "kien_thuc": 4, "tuong_tac": 4}, {"id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68", "ten": "Minh Dương", "ho_tro": 5, "chua_bai": "td", "nhan_xet": "xgyt", "kien_thuc": 5, "tuong_tac": 5}]	2026-11-19 09:01:54.724921+00
\.


--
-- Data for Name: diem_danh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."diem_danh" ("buoi_id", "hoc_sinh_id", "trang_thai", "sticker") FROM stdin;
71e54043-f25e-48e8-873d-9f249bd6150c	64a37c23-5108-4025-bcb3-e7ea6b1fe979	co_mat	7
71e54043-f25e-48e8-873d-9f249bd6150c	4d36c077-ad54-4671-8a64-3c7d297faca3	co_mat	7
71e54043-f25e-48e8-873d-9f249bd6150c	d96f705a-caed-4aed-8c5a-2f729630dd64	co_mat	4
92b3cab2-5ac5-48d8-a4a8-9b189028353a	7c7fc404-3d84-4d6b-8972-3926976216f4	vang	0
92b3cab2-5ac5-48d8-a4a8-9b189028353a	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	vang	0
92b3cab2-5ac5-48d8-a4a8-9b189028353a	800d8814-bc3d-460b-827b-97ef5dc49eda	vang	0
71e54043-f25e-48e8-873d-9f249bd6150c	10e6b491-c559-4087-bbc6-d6520f6d21f5	co_mat	4
71e54043-f25e-48e8-873d-9f249bd6150c	b218ff29-82e7-4386-8eae-0dd472b1894b	co_mat	5
f6e57378-f553-452e-9d0c-3cd5920181c2	e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af	hoc_bu	10
f6e57378-f553-452e-9d0c-3cd5920181c2	b20830c3-0747-45aa-bba0-0efd2f0cd32e	hoc_bu	10
92b3cab2-5ac5-48d8-a4a8-9b189028353a	04c0644a-6490-4551-9b84-2b3e606b2f11	co_mat	5
92b3cab2-5ac5-48d8-a4a8-9b189028353a	a6071b67-2130-479d-9960-be9b713e379d	co_mat	4
f6e57378-f553-452e-9d0c-3cd5920181c2	09426ac0-e7af-47bc-a029-195fcee72b46	co_mat	8
f6e57378-f553-452e-9d0c-3cd5920181c2	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	co_mat	6
f6e57378-f553-452e-9d0c-3cd5920181c2	6125884c-53f0-45ee-a303-3d03bc111254	co_mat	10
f6e57378-f553-452e-9d0c-3cd5920181c2	98deb901-bd60-4e1a-94c1-0ab944440ecb	co_mat	6
f6e57378-f553-452e-9d0c-3cd5920181c2	1b364415-27c0-4528-b772-6f9331702874	co_mat	6
f6e57378-f553-452e-9d0c-3cd5920181c2	9c5e27df-2361-46d3-9551-92dc6109c2f5	co_mat	8
f6e57378-f553-452e-9d0c-3cd5920181c2	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	co_mat	10
f6e57378-f553-452e-9d0c-3cd5920181c2	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	8
92b3cab2-5ac5-48d8-a4a8-9b189028353a	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	co_mat	2
92b3cab2-5ac5-48d8-a4a8-9b189028353a	94c6acd3-4c22-405e-a976-d9cd63a72345	co_mat	5
92b3cab2-5ac5-48d8-a4a8-9b189028353a	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	5
92b3cab2-5ac5-48d8-a4a8-9b189028353a	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	5
92b3cab2-5ac5-48d8-a4a8-9b189028353a	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	2
92b3cab2-5ac5-48d8-a4a8-9b189028353a	47286437-2fcd-451e-b01f-c19e8cbbcbef	co_mat	6
92b3cab2-5ac5-48d8-a4a8-9b189028353a	bc4166c1-2a49-43d1-9769-f752dcc2d91c	co_mat	8
92b3cab2-5ac5-48d8-a4a8-9b189028353a	e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af	hoc_bu	15
92b3cab2-5ac5-48d8-a4a8-9b189028353a	b20830c3-0747-45aa-bba0-0efd2f0cd32e	hoc_bu	15
92b3cab2-5ac5-48d8-a4a8-9b189028353a	fa327d0b-f6b8-4d58-b67a-74eafeea4798	hoc_bu	15
92b3cab2-5ac5-48d8-a4a8-9b189028353a	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	15
71e54043-f25e-48e8-873d-9f249bd6150c	a5df955d-2040-41d3-a691-2a9526050dba	co_mat	0
71e54043-f25e-48e8-873d-9f249bd6150c	e6af6149-70f4-4687-8390-4f3886b7a42e	co_mat	0
71e54043-f25e-48e8-873d-9f249bd6150c	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	co_mat	7
71e54043-f25e-48e8-873d-9f249bd6150c	e5d63dee-19fe-4ae1-a741-08a03111eb1d	co_mat	9
71e54043-f25e-48e8-873d-9f249bd6150c	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	co_mat	1
71e54043-f25e-48e8-873d-9f249bd6150c	e1d9c6da-9520-433a-9485-201be17d736d	co_mat	5
71e54043-f25e-48e8-873d-9f249bd6150c	3e45fe76-7884-4e40-8f60-d54cb47ea033	co_mat	4
71e54043-f25e-48e8-873d-9f249bd6150c	47de7f3c-c311-44a9-b8e9-d535f63909c5	co_mat	9
71e54043-f25e-48e8-873d-9f249bd6150c	da8f3b69-bcb6-46d7-b324-e5f61183d270	co_mat	3
71e54043-f25e-48e8-873d-9f249bd6150c	703a8acd-02b0-4f08-8151-7504f51802c1	co_mat	2
7546fba6-4be9-440e-9ab2-c379d4c471e9	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	6125884c-53f0-45ee-a303-3d03bc111254	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	98deb901-bd60-4e1a-94c1-0ab944440ecb	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	1b364415-27c0-4528-b772-6f9331702874	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	9c5e27df-2361-46d3-9551-92dc6109c2f5	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	09426ac0-e7af-47bc-a029-195fcee72b46	co_mat	10
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
-- Data for Name: link_danh_gia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."link_danh_gia" ("thang", "ma", "tao_luc") FROM stdin;
2026-11-01	46dc2343ef48	2026-11-18 09:52:48.37222+00
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
-- Data for Name: tom_tat_danh_gia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tom_tat_danh_gia" ("thang", "lop_id", "noi_dung", "so_phieu", "tao_luc") FROM stdin;
\.


--
-- Data for Name: tro_giang_buoi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tro_giang_buoi" ("buoi_id", "tro_giang_id", "don_gia") FROM stdin;
f6e57378-f553-452e-9d0c-3cd5920181c2	8b0b82af-8eee-477b-bc50-b5c72837c2f7	50000
92b3cab2-5ac5-48d8-a4a8-9b189028353a	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	100000
92b3cab2-5ac5-48d8-a4a8-9b189028353a	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
71e54043-f25e-48e8-873d-9f249bd6150c	d45793f2-33af-41bf-91e4-410cf31087cc	100000
71e54043-f25e-48e8-873d-9f249bd6150c	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
7546fba6-4be9-440e-9ab2-c379d4c471e9	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	100000
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
8cb11a9e-30d2-44f6-b5f6-05c85f3426cd	anh	avatar/0377768d-cc45-49f5-a96d-8d170c3bf41f-1794998858970.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:47:39.43919+00	2026-11-18 10:47:39.43919+00	2026-11-18 10:47:39.43919+00	{"eTag": "\\"481a33e1b2d536ff4c5dcf8df33d5d78\\"", "size": 37245, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:47:40.000Z", "contentLength": 37245, "httpStatusCode": 200}	871549b7-a538-435d-9d9b-70a06fec0c58	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
da331209-373c-4e67-988f-3705213411ce	anh	avatar/e561c6d5-6fbc-462a-ab2e-e1423f3b692f-1794922166340.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:29:26.55453+00	2026-11-17 13:29:26.55453+00	2026-11-17 13:29:26.55453+00	{"eTag": "\\"37c383c52df93dfade9f5cd18b8d6d1c\\"", "size": 31871, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:29:27.000Z", "contentLength": 31871, "httpStatusCode": 200}	541c4b5f-aa92-4574-a2fc-0906ab05f3ac	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
b2171f29-7831-4cbf-9a5c-194cd8cb2fec	anh	avatar/ad4eb7e3-ef7e-442e-9e18-766284275ff7-1794999976075.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:06:17.385745+00	2026-11-18 11:06:17.385745+00	2026-11-18 11:06:17.385745+00	{"eTag": "\\"18535c9d20999cdf13c43ec75dd74b27\\"", "size": 40852, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:06:18.000Z", "contentLength": 40852, "httpStatusCode": 200}	84f5da64-10d8-44c4-bd8a-10c046a99f96	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
66330ff4-1eb2-4a28-b7ee-c34326daf455	anh	buoi/f6e57378-f553-452e-9d0c-3cd5920181c2/90519080-c18d-407c-a4ea-b97c733a9440.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:36:49.224042+00	2026-11-17 13:36:49.224042+00	2026-11-17 13:36:49.224042+00	{"eTag": "\\"c4517f2c1fc1fc4aaf3f9b6e5b31aade\\"", "size": 519296, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:36:50.000Z", "contentLength": 519296, "httpStatusCode": 200}	77ed8b9f-38d4-4e61-9920-53d810327588	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
d7b51017-3ef4-42d6-8c5f-ec250851393b	anh	avatar/eaff414d-ac8c-44a0-9ed3-483992927fb9-1794998386874.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:39:47.476031+00	2026-11-18 10:39:47.476031+00	2026-11-18 10:39:47.476031+00	{"eTag": "\\"be1dad01a7d2110eae8f05b10462a840\\"", "size": 32325, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:39:48.000Z", "contentLength": 32325, "httpStatusCode": 200}	2a4805ad-64af-449e-bf76-cf8c3b143c0a	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
04ff0e5c-432a-425a-b419-964802d57adb	anh	avatar/bc4166c1-2a49-43d1-9769-f752dcc2d91c-1794998426835.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:40:27.278732+00	2026-11-18 10:40:27.278732+00	2026-11-18 10:40:27.278732+00	{"eTag": "\\"d5d0b6710da7bda234c727bc0ed7e1e2\\"", "size": 34809, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:40:28.000Z", "contentLength": 34809, "httpStatusCode": 200}	044db24d-8daa-4bb2-8739-68bbb64b92cd	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
b47269c4-29bd-4a10-b4a1-a9740bdd1d66	anh	avatar/a409e2ce-01c6-49e8-bbdf-5caf4477db1e-1794998465030.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:41:05.606162+00	2026-11-18 10:41:05.606162+00	2026-11-18 10:41:05.606162+00	{"eTag": "\\"e24c1585b6f5a94deafdcd2edd2638c1\\"", "size": 31377, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:41:06.000Z", "contentLength": 31377, "httpStatusCode": 200}	e0f6d570-1471-4fd7-9250-f6fcc6875b9f	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
3434da4c-8418-4710-bf8f-99e493548075	anh	avatar/47286437-2fcd-451e-b01f-c19e8cbbcbef-1794998506091.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:41:46.434226+00	2026-11-18 10:41:46.434226+00	2026-11-18 10:41:46.434226+00	{"eTag": "\\"320a6cdd3b38484b6c1090a5ff33479d\\"", "size": 45661, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:41:47.000Z", "contentLength": 45661, "httpStatusCode": 200}	616723e6-430b-4e46-a15a-61e998cb8448	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
46be671c-dc44-44c9-9e04-74a057f46de0	anh	avatar/e57f5ae7-1615-43da-89c0-af87f74cdc97-1795000028815.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:07:09.24996+00	2026-11-18 11:07:09.24996+00	2026-11-18 11:07:09.24996+00	{"eTag": "\\"bb56442ffeaf3b4a669ba5525a8dbad0\\"", "size": 43084, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:07:10.000Z", "contentLength": 43084, "httpStatusCode": 200}	e50cd6d1-9265-4248-b2f5-c49b027c57ad	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
8cfc351b-0dd8-493c-9f17-e0f5a57fa85f	anh	avatar/e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af-1795000095271.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:08:16.349002+00	2026-11-18 11:08:16.349002+00	2026-11-18 11:08:16.349002+00	{"eTag": "\\"c38a1368930413b39808bfe9302dbde2\\"", "size": 60865, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:08:17.000Z", "contentLength": 60865, "httpStatusCode": 200}	efbde369-3292-4cc9-83b1-901f7bffcb91	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
e7890f99-a825-43e3-917e-acbbce1857a7	anh	avatar/4f80d2ff-fc12-472d-8330-f9d4eba659ab-1795000166855.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:09:27.931531+00	2026-11-18 11:09:27.931531+00	2026-11-18 11:09:27.931531+00	{"eTag": "\\"0781e2d2fe30b567e05e43e243dbc775\\"", "size": 44010, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:09:28.000Z", "contentLength": 44010, "httpStatusCode": 200}	414cb1b5-6ec4-4b30-9c40-c2c7edbf28a2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
6c738786-5fc0-4583-8a0d-ba0ee364c4fb	anh	avatar/09426ac0-e7af-47bc-a029-195fcee72b46-1794921820760.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:23:41.263151+00	2026-11-17 13:23:41.263151+00	2026-11-17 13:23:41.263151+00	{"eTag": "\\"af664b57be1ffcd181441f47b255b0bc\\"", "size": 29581, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:23:42.000Z", "contentLength": 29581, "httpStatusCode": 200}	414fdadb-e697-4f5f-94df-34dded287fde	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
cb0fdf70-da6b-4389-aa9b-14f4914db27d	anh	avatar/2a71aebf-2868-4496-8c0d-26a9c5fdac6d-1794921883142.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:24:43.360443+00	2026-11-17 13:24:43.360443+00	2026-11-17 13:24:43.360443+00	{"eTag": "\\"ec06d6c193de9b68544745b1a4ba9d01\\"", "size": 27786, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:24:44.000Z", "contentLength": 27786, "httpStatusCode": 200}	3aa7df80-697e-4384-9c74-840b56035a86	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
9a930db9-6a42-4e88-a6c7-400228817384	anh	avatar/6125884c-53f0-45ee-a303-3d03bc111254-1794921934570.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:25:34.918926+00	2026-11-17 13:25:34.918926+00	2026-11-17 13:25:34.918926+00	{"eTag": "\\"7e5447db38a6128e82d50c27666b3fea\\"", "size": 61998, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:25:35.000Z", "contentLength": 61998, "httpStatusCode": 200}	8a01a39c-a2b2-4bbf-8bc8-53cf6f09d729	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
1635fd4c-74cc-416e-b363-0b1b63fe4f14	anh	avatar/98deb901-bd60-4e1a-94c1-0ab944440ecb-1794921993396.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:26:33.652882+00	2026-11-17 13:26:33.652882+00	2026-11-17 13:26:33.652882+00	{"eTag": "\\"4954bafc7818a1c79515c8f7f40c05cb\\"", "size": 49024, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:26:34.000Z", "contentLength": 49024, "httpStatusCode": 200}	28225600-b907-473d-8e0d-6177f232c176	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
f5345400-d925-48f5-9a02-3694909f3d8a	anh	avatar/1b364415-27c0-4528-b772-6f9331702874-1794922033355.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:27:13.56512+00	2026-11-17 13:27:13.56512+00	2026-11-17 13:27:13.56512+00	{"eTag": "\\"1f384a634367b343c7fa9b4f2da9a05d\\"", "size": 22690, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:27:14.000Z", "contentLength": 22690, "httpStatusCode": 200}	e4a7ddec-0a11-4cfe-8666-cb918cbfddb5	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
31841a69-d1fd-46d3-8b68-826877ad34b9	anh	avatar/9c5e27df-2361-46d3-9551-92dc6109c2f5-1794922065703.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:27:46.01517+00	2026-11-17 13:27:46.01517+00	2026-11-17 13:27:46.01517+00	{"eTag": "\\"104ac3a775c1f2850f04dd989c6771b8\\"", "size": 62037, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:27:46.000Z", "contentLength": 62037, "httpStatusCode": 200}	4afaed50-abef-4747-8574-513c8dbae2b8	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
aae1fd4b-fe1c-4180-ac25-c0926feaa062	anh	avatar/33a3cfe1-6ebb-46fb-b851-4282d579a315-1794998542956.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:42:23.382259+00	2026-11-18 10:42:23.382259+00	2026-11-18 10:42:23.382259+00	{"eTag": "\\"6a22dfe46447998b929cbe9dca758718\\"", "size": 42188, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:42:24.000Z", "contentLength": 42188, "httpStatusCode": 200}	283e3c06-1867-4d03-bbda-f75825f9d20c	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
6c8dc777-c47f-4473-91c7-a26257ecc63f	anh	avatar/ef8b67df-fbeb-4c52-ba94-4be8fdb8053b-1795000241808.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:10:42.19977+00	2026-11-18 11:10:42.19977+00	2026-11-18 11:10:42.19977+00	{"eTag": "\\"afd43b1cd8c59d446698aaeb5b5885b3\\"", "size": 33762, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:10:43.000Z", "contentLength": 33762, "httpStatusCode": 200}	de0a6f93-6a58-4849-9594-81a674a11672	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
2330d943-fed7-464d-b9ec-b73687edc7cd	anh	avatar/a6071b67-2130-479d-9960-be9b713e379d-1794998592009.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:43:12.462365+00	2026-11-18 10:43:12.462365+00	2026-11-18 10:43:12.462365+00	{"eTag": "\\"7f1d08d51a47a50983637868a5bf7a25\\"", "size": 44575, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:43:13.000Z", "contentLength": 44575, "httpStatusCode": 200}	6d383ff7-c865-45b7-949d-eb52728e64c8	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
e9fbdc1c-cf74-41e8-9e32-5c32b2635195	anh	avatar/e3906889-be7a-483c-a548-52c80afb47e7-1794998686016.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:44:46.651832+00	2026-11-18 10:44:46.651832+00	2026-11-18 10:44:46.651832+00	{"eTag": "\\"bdad5cdb7d86c96195e0f1d428b3efa6\\"", "size": 37287, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:44:47.000Z", "contentLength": 37287, "httpStatusCode": 200}	ca951f6e-b905-4ffc-a3eb-c029ea088b0b	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
effde8df-5396-47ec-b2ca-cbe1f80d7d89	anh	avatar/b20830c3-0747-45aa-bba0-0efd2f0cd32e-1795000307959.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:11:49.292144+00	2026-11-18 11:11:49.292144+00	2026-11-18 11:11:49.292144+00	{"eTag": "\\"c38a1368930413b39808bfe9302dbde2\\"", "size": 60865, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:11:50.000Z", "contentLength": 60865, "httpStatusCode": 200}	7a011c10-c7f5-47cd-850d-bf1eb5ff6015	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
bcab6efb-aae5-4f48-a906-c78972584dfe	anh	avatar/94c6acd3-4c22-405e-a976-d9cd63a72345-1794998722264.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:45:23.081068+00	2026-11-18 10:45:23.081068+00	2026-11-18 10:45:23.081068+00	{"eTag": "\\"8b68c58d1a31b1c8b7186e9fbb3cb4ec\\"", "size": 27748, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:45:24.000Z", "contentLength": 27748, "httpStatusCode": 200}	c6843625-61ac-40c0-bc7b-57826a3d0962	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
30af69ef-a62b-4908-8212-ca4ce8b919da	anh	avatar/3f7ce3c1-adc5-4a3c-b88e-5f6cd8aeac91-1795000346567.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:12:27.534207+00	2026-11-18 11:12:27.534207+00	2026-11-18 11:12:27.534207+00	{"eTag": "\\"0c6672b5951021964edf0b9b36a36d8e\\"", "size": 59926, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:12:28.000Z", "contentLength": 59926, "httpStatusCode": 200}	579e46c4-231c-4360-930e-7df6f9416aca	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
c8732a09-8bc1-4f71-ad97-a026db691dc3	anh	avatar/04c0644a-6490-4551-9b84-2b3e606b2f11-1794998765684.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:46:06.439564+00	2026-11-18 10:46:06.439564+00	2026-11-18 10:46:06.439564+00	{"eTag": "\\"1b2fcdcacb62cfa6c667692cbb58d27c\\"", "size": 40478, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:46:07.000Z", "contentLength": 40478, "httpStatusCode": 200}	997674db-a944-43d1-9d48-01839ec943e3	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
8e1e902a-05e2-4c6c-a0ab-d2dc34092112	anh	avatar/7c7fc404-3d84-4d6b-8972-3926976216f4-1794998800089.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:46:40.592421+00	2026-11-18 10:46:40.592421+00	2026-11-18 10:46:40.592421+00	{"eTag": "\\"f68352affe7f8ba939aa54cf61c33e20\\"", "size": 39961, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:46:41.000Z", "contentLength": 39961, "httpStatusCode": 200}	49eca5f8-f981-4665-88ef-c63be0b5d763	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
65edcf8f-df0c-4601-9d84-f285613b5557	anh	avatar/3706e8ca-a8c3-47ea-8629-73c3c62ab4f6-1795002295550.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:44:56.682932+00	2026-11-18 11:44:56.682932+00	2026-11-18 11:44:56.682932+00	{"eTag": "\\"18535c9d20999cdf13c43ec75dd74b27\\"", "size": 40852, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:44:57.000Z", "contentLength": 40852, "httpStatusCode": 200}	6b321b2e-a6bc-491c-9492-919dabccded3	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
5dbd77ae-b6fa-4702-9a7d-77a4987c1231	anh	avatar/d8534bf8-c1b6-4b40-8ce2-2e4c4407ee0c-1795002323128.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:45:23.874157+00	2026-11-18 11:45:23.874157+00	2026-11-18 11:45:23.874157+00	{"eTag": "\\"bb56442ffeaf3b4a669ba5525a8dbad0\\"", "size": 43084, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:45:24.000Z", "contentLength": 43084, "httpStatusCode": 200}	e6f6f5f1-8698-4de2-8ade-6bb5697228a4	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
4ccfda57-3acd-4f47-b4f0-0dfcaba5506a	anh	avatar/6e534433-03c4-452e-ab68-988e6cceb111-1795002416126.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:46:56.821763+00	2026-11-18 11:46:56.821763+00	2026-11-18 11:46:56.821763+00	{"eTag": "\\"2d942f8823ec48e3232be887fd4556fe\\"", "size": 30340, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:46:57.000Z", "contentLength": 30340, "httpStatusCode": 200}	52dda98c-61b7-47e5-b7fd-60411eec5cea	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
5bfac264-837b-4cb2-9cc3-43a75620eacf	anh	avatar/1ef16544-19ec-4e43-9f9c-c4d8eb485b29-1795002468641.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:47:49.462615+00	2026-11-18 11:47:49.462615+00	2026-11-18 11:47:49.462615+00	{"eTag": "\\"0781e2d2fe30b567e05e43e243dbc775\\"", "size": 44010, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:47:50.000Z", "contentLength": 44010, "httpStatusCode": 200}	c6e21ff7-d8f4-442a-9fac-b58e08687feb	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
cc0e8fb2-4c63-4d91-a2c7-4a42549abb15	anh	avatar/d624703f-7d65-4ba6-8d6e-501b919bff4b-1795002510421.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:48:31.931499+00	2026-11-18 11:48:31.931499+00	2026-11-18 11:48:31.931499+00	{"eTag": "\\"ca46f21a8ee6d7b7b1e4b1a13104dbf9\\"", "size": 66029, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:48:32.000Z", "contentLength": 66029, "httpStatusCode": 200}	f93e1632-2f4d-486a-8280-bc375014f982	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
3b67867e-90c0-4164-92dd-5552685409b0	anh	avatar/437e3823-c23f-494c-82ef-7866580d5abe-1795002570430.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:49:31.29818+00	2026-11-18 11:49:31.29818+00	2026-11-18 11:49:31.29818+00	{"eTag": "\\"afd43b1cd8c59d446698aaeb5b5885b3\\"", "size": 33762, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:49:32.000Z", "contentLength": 33762, "httpStatusCode": 200}	880926be-4082-4b41-b740-e6d0ae0c007b	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
47df90c6-87b9-4eee-98e6-71bbcdff58ff	anh	avatar/6dfcd269-b65d-46e0-9734-6708c3bff15d-1795002611697.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:50:12.551227+00	2026-11-18 11:50:12.551227+00	2026-11-18 11:50:12.551227+00	{"eTag": "\\"507deffb33fca921ae6dc89491278407\\"", "size": 27283, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:50:13.000Z", "contentLength": 27283, "httpStatusCode": 200}	4c809e29-9725-498f-831e-9c63fb8ad1b1	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
7e0e56fd-4dba-43ab-93c0-6159f29dedb9	anh	avatar/b799cd61-1a93-47d7-b390-66f48d357a1d-1795002648049.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:50:49.387509+00	2026-11-18 11:50:49.387509+00	2026-11-18 11:50:49.387509+00	{"eTag": "\\"0c6672b5951021964edf0b9b36a36d8e\\"", "size": 59926, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:50:50.000Z", "contentLength": 59926, "httpStatusCode": 200}	05aa0ba7-4f1b-493a-b64a-08253901468a	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
43fe21f9-5124-4408-82f8-0d490aa69544	anh	avatar/e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af-1795003669718.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 12:07:51.149743+00	2026-11-18 12:07:51.149743+00	2026-11-18 12:07:51.149743+00	{"eTag": "\\"2d942f8823ec48e3232be887fd4556fe\\"", "size": 30340, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T12:07:52.000Z", "contentLength": 30340, "httpStatusCode": 200}	40d9adb5-080a-437d-9744-50a2094d8d68	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
71c814ca-f2d5-4e44-9b46-884cc71afcda	anh	avatar/b20830c3-0747-45aa-bba0-0efd2f0cd32e-1795003682982.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 12:08:04.187829+00	2026-11-18 12:08:04.187829+00	2026-11-18 12:08:04.187829+00	{"eTag": "\\"507deffb33fca921ae6dc89491278407\\"", "size": 27283, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T12:08:05.000Z", "contentLength": 27283, "httpStatusCode": 200}	77cc96ac-f921-4cb7-aca8-6bfb11bf8980	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
a9971b81-8c50-4a67-9657-eb125038e646	anh	buoi/92b3cab2-5ac5-48d8-a4a8-9b189028353a/2c9ad16e-8d97-4db5-9b10-a08643e38e86.jpg	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	2026-11-18 12:20:49.658409+00	2026-11-18 12:20:49.658409+00	2026-11-18 12:20:49.658409+00	{"eTag": "\\"1bbc5df55c60290e44ba41c8bae027aa\\"", "size": 576396, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T12:20:50.000Z", "contentLength": 576396, "httpStatusCode": 200}	3b343f0a-95ce-46e1-9da4-9b961203b945	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	{}	\N	f	f
8037db5f-1bc1-4b80-a216-5765d99fffc7	anh	buoi/71e54043-f25e-48e8-873d-9f249bd6150c/d65e8130-864b-4a59-b33b-326b36931b00.jpg	906a5d63-7289-4b55-a279-ff8db9b1a5c4	2026-11-19 13:05:41.780632+00	2026-11-19 13:05:41.780632+00	2026-11-19 13:05:41.780632+00	{"eTag": "\\"da22bb5c3c352d42b461d6032ba44f6e\\"", "size": 523990, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-19T13:05:42.000Z", "contentLength": 523990, "httpStatusCode": 200}	b3f0992c-eec2-42df-90b9-f4ada59945d1	906a5d63-7289-4b55-a279-ff8db9b1a5c4	{}	\N	f	f
85471116-1cea-47cc-97f9-9642ee0f404a	anh	buoi/7546fba6-4be9-440e-9ab2-c379d4c471e9/4bed649d-8156-4425-86ef-d2f0b9c42959.jpg	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	2026-11-19 13:48:18.88731+00	2026-11-19 13:48:18.88731+00	2026-11-19 13:48:18.88731+00	{"eTag": "\\"2ee6acacbcc316630376ce6401806341\\"", "size": 436214, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-19T13:48:19.000Z", "contentLength": 436214, "httpStatusCode": 200}	2681e8ad-7646-4392-8c9c-c9796512ce0f	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	{}	\N	f	f
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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 526, true);


--
-- Name: nhat_ky_chot_so_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nhat_ky_chot_so_id_seq"', 122, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict v9yJqgqZFaBfPuPbjq8GpR848bpCd9f8JkTpEV4MeyYtURDDWF5ahIf0U8iuRFd

RESET ALL;

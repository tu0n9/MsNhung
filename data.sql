SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict YNsDQfLRdrzh3bD2kiJ0PXlslWjwIBmvobt7m9nXXSqftO0dMiVWdRydCxXd70a

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

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at", "custom_claims_allowlist", "client_auth_method", "client_assertion_audience") FROM stdin;
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
00000000-0000-0000-0000-000000000000	43d2ab0d-e902-49d7-9e81-a3696d296ad2	authenticated	authenticated	admin@msnhung.local	$2a$10$BCdkciwG3PPPv4yCMa50oefbpbFKmU9xlXou.UTQCXONcdSKZxnAO	2026-11-15 10:27:58.76274+00	\N		\N		\N			\N	2026-11-25 15:00:52.242106+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-15 10:27:58.741954+00	2026-11-25 16:32:19.249549+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	877e2be5-c648-4abe-b7a6-8ceff0df9d68	authenticated	authenticated	b3a2e022-4ac8-4e39-bf92-8eb8929f8818@msnhung.local	$2a$10$Qs1dEePeo9NfuXobIUwD5uPgQYkTbuNobiZr9KdEJUN45D6hgYzWS	2026-11-18 10:51:52.198234+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:51:52.194016+00	2026-11-18 10:51:52.202419+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d45793f2-33af-41bf-91e4-410cf31087cc	authenticated	authenticated	f11afff5-2031-4c08-8ed1-1fb7a6e992b6@msnhung.local	$2a$10$3qL3UVR8xbLh.LD.BgmOu.BiYDs0rU2kNfqFwIP/yHVfeAnRyMBp6	2026-11-18 10:49:48.026277+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:49:48.022325+00	2026-11-18 10:49:48.027809+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	7925dcdb-7311-4634-896a-b4b6386b2df2	authenticated	authenticated	8ebb1955-2bf2-40c6-98fd-94c9104c1119@msnhung.local	$2a$10$.qKVyn44KDMq/QbVRuTwdO3arECmyPF2h0itwWyd/CfXAhMtW0bIq	2026-11-18 10:51:11.090954+00	\N		\N		\N			\N	2026-11-19 15:33:10.474457+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:51:11.085776+00	2026-11-19 15:33:19.891315+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8b0b82af-8eee-477b-bc50-b5c72837c2f7	authenticated	authenticated	9b44af75-9759-4353-8276-9a34385879ac@msnhung.local	$2a$10$8vao8LW315Dfkchm1MBos.ijJyY9XJ1wNm.MG.jh30CoYiaS2ng2a	2026-11-18 10:58:11.97509+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:58:11.951136+00	2026-11-18 10:58:11.976631+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9b8a626d-c10d-443e-adcf-8b152a9b6c90	authenticated	authenticated	ac70b571-f88b-4b91-910e-2056e06887f5@msnhung.local	$2a$10$L6Hx8GBRQb3UJP0RgrP49uzhjOQobgfNWJ4h4I/xunR7cf5q/sRSW	2026-11-18 11:01:13.795726+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 11:01:13.775131+00	2026-11-18 11:01:13.797193+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	906a5d63-7289-4b55-a279-ff8db9b1a5c4	authenticated	authenticated	fcc895cd-f026-4e3f-81d1-1544acf6f727@msnhung.local	$2a$10$fk7lu2GZgnCeo8pi.fU9FOcvyaorYm2xYyyHDFwwDcs5.K2upZ5ia	2026-11-18 10:50:37.366255+00	\N		\N		\N			\N	2026-11-20 10:26:49.265772+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:50:37.354077+00	2026-11-21 11:04:35.736881+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	authenticated	authenticated	8a80fc97-4996-4655-afee-8eac991e9a12@msnhung.local	$2a$10$97fyKO0vuMQfYkBUWS32X.Q56vy5lBsfCC.aooYX7mAnGjFJmA3xW	2026-11-18 10:48:28.317304+00	\N		\N		\N			\N	2026-11-19 13:09:30.603649+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:48:28.280417+00	2026-11-20 06:20:35.317963+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8f2ca2fa-e36b-4f1c-89a0-aade2484f779	authenticated	authenticated	ed73e7b8-d79a-4f34-9401-1efaf3f11565@msnhung.local	$2a$10$8n65S02U/HG.Rmr2jAcy8u1QE2e0D1Naf88B10Ns8/hPfAOOt6zTO	2026-11-21 04:24:05.344258+00	\N		\N		\N			\N	2026-11-23 12:10:29.947206+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-21 04:24:05.328421+00	2026-11-23 12:10:29.976939+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	authenticated	authenticated	19f38f04-61b3-43ca-8335-d6f1b809a252@msnhung.local	$2a$10$tgJwaw/JFI4E7hab8YRaGOOclde/9PSkhcngbqfe6d7aeED.Crtfm	2026-11-18 10:49:19.499215+00	\N		\N		\N			\N	2026-11-20 09:39:16.892235+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-11-18 10:49:19.494982+00	2026-11-23 20:18:50.030844+00	\N	\N			\N		0	\N		\N	f	\N	f
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
8f2ca2fa-e36b-4f1c-89a0-aade2484f779	8f2ca2fa-e36b-4f1c-89a0-aade2484f779	{"sub": "8f2ca2fa-e36b-4f1c-89a0-aade2484f779", "email": "ed73e7b8-d79a-4f34-9401-1efaf3f11565@msnhung.local", "email_verified": false, "phone_verified": false}	email	2026-11-21 04:24:05.337875+00	2026-11-21 04:24:05.337947+00	2026-11-21 04:24:05.337947+00	e58baaa3-aa1f-4af4-a634-b182909f4702
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
67172279-b1b1-4f95-a2c0-034c8b76e19b	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-23 14:17:18.498688+00	2026-11-25 13:42:07.179844+00	\N	aal1	\N	2026-11-25 13:42:07.179721	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.2 Mobile/15E148 Safari/604.1	116.106.99.207	\N	\N	\N	\N	\N
eeb51907-2ea4-4b83-ac18-4d4d82e61ad1	7925dcdb-7311-4634-896a-b4b6386b2df2	2026-11-19 15:33:10.47744+00	2026-11-19 15:33:10.47744+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0	183.80.74.68	\N	\N	\N	\N	\N
98d9f79f-0ff0-4861-aa57-09ae20073ef4	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	2026-11-20 09:39:16.892389+00	2026-11-23 20:18:50.056325+00	\N	aal1	\N	2026-11-23 20:18:50.056192	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Mobile Safari/537.36	117.0.94.101	\N	\N	\N	\N	\N
d40337c9-7ace-4e7c-9156-892f185cfddd	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-25 15:00:52.244087+00	2026-11-25 15:00:52.244087+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36 Edg/158.0.0.0	116.96.46.150	\N	\N	\N	\N	\N
8e6a1d94-8892-4b24-b5bd-4cad592d6538	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-23 13:32:50.022516+00	2026-11-24 08:23:09.659108+00	\N	aal1	\N	2026-11-24 08:23:09.65898	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	104.28.84.125	\N	\N	\N	\N	\N
3d0177fd-b2ed-422f-9811-5f8032ad5fac	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-23 13:23:32.976327+00	2026-11-25 15:06:04.730437+00	\N	aal1	\N	2026-11-25 15:06:04.730319	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.1 Mobile/15E148 Safari/604.1	171.255.57.153	\N	\N	\N	\N	\N
c0d0a073-5f8e-45d2-b701-61fb6aee22fd	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	2026-11-19 13:09:30.604521+00	2026-11-20 06:20:35.345899+00	\N	aal1	\N	2026-11-20 06:20:35.345772	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.2 Mobile/15E148 Safari/604.1	118.68.111.181	\N	\N	\N	\N	\N
fe85c6d8-5568-466a-820f-1825a509392b	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-23 13:26:54.228971+00	2026-11-24 12:24:17.294219+00	\N	aal1	\N	2026-11-24 12:24:17.294056	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36 Edg/158.0.0.0	42.113.16.7	\N	\N	\N	\N	\N
2c82d461-3acd-4170-a5ec-b2ae40a1acb7	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-24 13:30:31.326893+00	2026-11-25 16:32:19.274058+00	\N	aal1	\N	2026-11-25 16:32:19.27389	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36 Edg/158.0.0.0	183.80.97.88	\N	\N	\N	\N	\N
91e47d3a-53bd-4429-a0f2-dc4534030f14	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-24 05:00:06.048452+00	2026-11-25 13:13:54.712797+00	\N	aal1	\N	2026-11-25 13:13:54.711039	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Zalo iOS/261101802 ZaloTheme/dark ZaloLanguage/vn	42.118.51.176	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
3d0177fd-b2ed-422f-9811-5f8032ad5fac	2026-11-23 13:23:32.988116+00	2026-11-23 13:23:32.988116+00	password	5fcc87e5-b489-4189-9454-12d70835bab7
fe85c6d8-5568-466a-820f-1825a509392b	2026-11-23 13:26:54.240047+00	2026-11-23 13:26:54.240047+00	password	53ac350d-b65c-4470-9706-a756ea693ff7
8e6a1d94-8892-4b24-b5bd-4cad592d6538	2026-11-23 13:32:50.045869+00	2026-11-23 13:32:50.045869+00	password	aa45d792-597d-4b64-8543-a00774dc7690
67172279-b1b1-4f95-a2c0-034c8b76e19b	2026-11-23 14:17:18.583067+00	2026-11-23 14:17:18.583067+00	password	2e94c93a-2ae5-4879-b3fb-cbf1ac6bb6b5
91e47d3a-53bd-4429-a0f2-dc4534030f14	2026-11-24 05:00:06.133358+00	2026-11-24 05:00:06.133358+00	password	3d7c0cf6-706f-4710-9fb1-e51ec4091e0f
2c82d461-3acd-4170-a5ec-b2ae40a1acb7	2026-11-24 13:30:31.378601+00	2026-11-24 13:30:31.378601+00	password	216ab173-79d2-445c-a4e0-6d221a0b5394
d40337c9-7ace-4e7c-9156-892f185cfddd	2026-11-25 15:00:52.298577+00	2026-11-25 15:00:52.298577+00	password	1314207e-8154-47be-accd-24e5d71ad8d4
138b0991-bade-4ac1-99f0-d5b4e29bfcce	2026-11-18 11:15:04.66948+00	2026-11-18 11:15:04.66948+00	password	0e8bcbd4-b605-4f8d-92ef-a09f44104bec
c0d0a073-5f8e-45d2-b701-61fb6aee22fd	2026-11-19 13:09:30.662961+00	2026-11-19 13:09:30.662961+00	password	af8deb5d-c21a-41f3-832b-e2efa8a9f085
eeb51907-2ea4-4b83-ac18-4d4d82e61ad1	2026-11-19 15:33:10.569478+00	2026-11-19 15:33:10.569478+00	password	f9153c04-47e8-4095-9108-0105f4f831fa
98d9f79f-0ff0-4861-aa57-09ae20073ef4	2026-11-20 09:39:16.896264+00	2026-11-20 09:39:16.896264+00	password	da5d062e-4f09-4350-8fbb-d9456f1a1731
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
00000000-0000-0000-0000-000000000000	730	fb66bcnm4y6s	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	t	2026-11-21 10:06:35.983043+00	2026-11-21 12:01:34.47202+00	4hswtw7g2mpu	98d9f79f-0ff0-4861-aa57-09ae20073ef4
00000000-0000-0000-0000-000000000000	517	5aimmp2svbp6	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-19 16:31:49.525176+00	2026-11-20 06:20:35.280109+00	uqzjyb2jzeez	c0d0a073-5f8e-45d2-b701-61fb6aee22fd
00000000-0000-0000-0000-000000000000	528	6hom4mlbwosb	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	f	2026-11-20 06:20:35.301906+00	2026-11-20 06:20:35.301906+00	5aimmp2svbp6	c0d0a073-5f8e-45d2-b701-61fb6aee22fd
00000000-0000-0000-0000-000000000000	771	cyxp33prnu5n	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-23 13:26:54.235951+00	2026-11-23 15:13:03.439605+00	\N	fe85c6d8-5568-466a-820f-1825a509392b
00000000-0000-0000-0000-000000000000	541	vdo4zwc6q2dr	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	t	2026-11-20 12:34:38.272158+00	2026-11-20 15:05:28.547244+00	em3biwnp7sp4	98d9f79f-0ff0-4861-aa57-09ae20073ef4
00000000-0000-0000-0000-000000000000	734	cohzw6uh3o6y	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	t	2026-11-21 12:01:34.491139+00	2026-11-23 20:18:50.001746+00	fb66bcnm4y6s	98d9f79f-0ff0-4861-aa57-09ae20073ef4
00000000-0000-0000-0000-000000000000	775	3j3s4wqkpwhq	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	f	2026-11-23 20:18:50.022918+00	2026-11-23 20:18:50.022918+00	cohzw6uh3o6y	98d9f79f-0ff0-4861-aa57-09ae20073ef4
00000000-0000-0000-0000-000000000000	773	cj36at7kpnzf	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-23 14:17:18.547192+00	2026-11-24 01:17:42.151762+00	\N	67172279-b1b1-4f95-a2c0-034c8b76e19b
00000000-0000-0000-0000-000000000000	772	pfuibytawvgm	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-23 13:32:50.038984+00	2026-11-24 07:06:15.839325+00	\N	8e6a1d94-8892-4b24-b5bd-4cad592d6538
00000000-0000-0000-0000-000000000000	774	6w46xecyrjb2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-23 15:13:03.460045+00	2026-11-24 07:31:16.898535+00	cyxp33prnu5n	fe85c6d8-5568-466a-820f-1825a509392b
00000000-0000-0000-0000-000000000000	778	4okxji2ju5y7	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-24 07:06:15.862001+00	2026-11-24 08:23:09.603782+00	pfuibytawvgm	8e6a1d94-8892-4b24-b5bd-4cad592d6538
00000000-0000-0000-0000-000000000000	780	6bogfh3lmmxk	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-24 08:23:09.624765+00	2026-11-24 08:23:09.624765+00	4okxji2ju5y7	8e6a1d94-8892-4b24-b5bd-4cad592d6538
00000000-0000-0000-0000-000000000000	779	hfphlqdptzm2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-24 07:31:16.914951+00	2026-11-24 08:49:14.216872+00	6w46xecyrjb2	fe85c6d8-5568-466a-820f-1825a509392b
00000000-0000-0000-0000-000000000000	533	em3biwnp7sp4	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	t	2026-11-20 09:39:16.893934+00	2026-11-20 12:34:38.26187+00	\N	98d9f79f-0ff0-4861-aa57-09ae20073ef4
00000000-0000-0000-0000-000000000000	781	v6jf67hdpyv3	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-24 08:49:14.227847+00	2026-11-24 12:24:17.235691+00	hfphlqdptzm2	fe85c6d8-5568-466a-820f-1825a509392b
00000000-0000-0000-0000-000000000000	782	7ywwv35yje6w	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-24 12:24:17.259981+00	2026-11-24 12:24:17.259981+00	v6jf67hdpyv3	fe85c6d8-5568-466a-820f-1825a509392b
00000000-0000-0000-0000-000000000000	492	4ar5dq6mxsrv	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-18 11:15:04.612498+00	2026-11-18 12:20:21.000342+00	\N	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	783	yzabqihb3bit	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-24 13:30:31.353041+00	2026-11-24 14:34:38.123659+00	\N	2c82d461-3acd-4170-a5ec-b2ae40a1acb7
00000000-0000-0000-0000-000000000000	770	h4icwc74mfh2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-23 13:23:32.981884+00	2026-11-25 03:09:29.534271+00	\N	3d0177fd-b2ed-422f-9811-5f8032ad5fac
00000000-0000-0000-0000-000000000000	497	oiucqvgppb62	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-18 12:20:21.012121+00	2026-11-18 13:22:21.165498+00	4ar5dq6mxsrv	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	784	x6xsnz5jujak	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-24 14:34:38.146601+00	2026-11-25 10:03:05.4346+00	yzabqihb3bit	2c82d461-3acd-4170-a5ec-b2ae40a1acb7
00000000-0000-0000-0000-000000000000	777	ctvgqquosaut	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-24 05:00:06.088971+00	2026-11-25 13:13:54.65545+00	\N	91e47d3a-53bd-4429-a0f2-dc4534030f14
00000000-0000-0000-0000-000000000000	499	he4pscw7nv4q	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-18 13:22:21.175637+00	2026-11-18 16:34:59.646129+00	oiucqvgppb62	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	787	tsthrkv2eynv	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-25 13:13:54.676344+00	2026-11-25 13:13:54.676344+00	ctvgqquosaut	91e47d3a-53bd-4429-a0f2-dc4534030f14
00000000-0000-0000-0000-000000000000	776	hhfysgx5bp7d	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-24 01:17:42.166294+00	2026-11-25 13:42:07.138613+00	cj36at7kpnzf	67172279-b1b1-4f95-a2c0-034c8b76e19b
00000000-0000-0000-0000-000000000000	788	k6kx4wfjf7k2	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-25 13:42:07.147164+00	2026-11-25 13:42:07.147164+00	hhfysgx5bp7d	67172279-b1b1-4f95-a2c0-034c8b76e19b
00000000-0000-0000-0000-000000000000	785	qg2lfblhay7g	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-25 03:09:29.560455+00	2026-11-25 14:03:34.428818+00	h4icwc74mfh2	3d0177fd-b2ed-422f-9811-5f8032ad5fac
00000000-0000-0000-0000-000000000000	790	hsotyow23exc	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-25 15:00:52.27218+00	2026-11-25 15:00:52.27218+00	\N	d40337c9-7ace-4e7c-9156-892f185cfddd
00000000-0000-0000-0000-000000000000	786	riewycxz7jve	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-25 10:03:05.453308+00	2026-11-25 15:05:57.165842+00	x6xsnz5jujak	2c82d461-3acd-4170-a5ec-b2ae40a1acb7
00000000-0000-0000-0000-000000000000	789	a3eplq6sctoz	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-25 14:03:34.442292+00	2026-11-25 15:06:04.726361+00	qg2lfblhay7g	3d0177fd-b2ed-422f-9811-5f8032ad5fac
00000000-0000-0000-0000-000000000000	792	o5ammvn4525u	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-25 15:06:04.72725+00	2026-11-25 15:06:04.72725+00	a3eplq6sctoz	3d0177fd-b2ed-422f-9811-5f8032ad5fac
00000000-0000-0000-0000-000000000000	791	cs22g7esjn4u	43d2ab0d-e902-49d7-9e81-a3696d296ad2	t	2026-11-25 15:05:57.173405+00	2026-11-25 16:32:19.213526+00	riewycxz7jve	2c82d461-3acd-4170-a5ec-b2ae40a1acb7
00000000-0000-0000-0000-000000000000	793	4qx33b3j3dze	43d2ab0d-e902-49d7-9e81-a3696d296ad2	f	2026-11-25 16:32:19.236427+00	2026-11-25 16:32:19.236427+00	cs22g7esjn4u	2c82d461-3acd-4170-a5ec-b2ae40a1acb7
00000000-0000-0000-0000-000000000000	502	hk4ftmgehg54	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-18 16:34:59.669286+00	2026-11-19 09:28:18.584226+00	he4pscw7nv4q	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	511	4b3s52br5fd3	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	f	2026-11-19 09:28:18.60024+00	2026-11-19 09:28:18.60024+00	hk4ftmgehg54	138b0991-bade-4ac1-99f0-d5b4e29bfcce
00000000-0000-0000-0000-000000000000	515	tez5ezxmlo7a	7925dcdb-7311-4634-896a-b4b6386b2df2	f	2026-11-19 15:33:10.535556+00	2026-11-19 15:33:10.535556+00	\N	eeb51907-2ea4-4b83-ac18-4d4d82e61ad1
00000000-0000-0000-0000-000000000000	514	uqzjyb2jzeez	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	t	2026-11-19 13:09:30.633872+00	2026-11-19 16:31:49.504555+00	\N	c0d0a073-5f8e-45d2-b701-61fb6aee22fd
00000000-0000-0000-0000-000000000000	584	4hswtw7g2mpu	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	t	2026-11-20 15:05:28.582283+00	2026-11-21 10:06:35.968768+00	vdo4zwc6q2dr	98d9f79f-0ff0-4861-aa57-09ae20073ef4
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
1d80e3bc-dfb1-4398-b242-bf46211e8e80	Cấp 1 Ca 18-20 t5	150000	{4}	t	2026-11-19 12:40:30.425366+00	\N	{"4": {"bd": "18:00", "kt": "20:00"}}
4e49d265-ef05-4457-8c75-ff435e266182	Ca 18-20 T4	150000	{3}	t	2026-11-18 10:38:23.726462+00	18:00-20:00	{"3": {"bd": "18:00", "kt": "20:00"}}
633443ce-1a36-49f5-80c2-24a8eaf5e22e	1-1 Ngọc Minh 	1000000	{5}	t	2026-11-19 12:50:22.155933+00	\N	{"5": {"bd": "13:00", "kt": "15:00"}}
929bc9ea-dc44-4f17-8473-edf75de7d63b	Pre-A1+Ielts bổ trợ	150000	{6}	t	2026-11-20 12:03:04.266769+00	\N	{"6": {"bd": "15:15", "kt": "17:15"}}
0a6a5510-3d31-4b1c-96ca-09889eef3bc1	Lớp ielts cơ bản t7	200000	{6}	t	2026-11-20 12:03:04.266769+00	\N	{"6": {"bd": "18:00", "kt": "20:00"}}
3aec8da8-00ec-454d-bfb1-d63fb936e5f9	Ca tối t2: 18-20	150000	{1}	t	2026-11-20 12:03:04.266769+00	\N	{"1": {"bd": "18:00", "kt": "22:00"}}
76d237de-b44c-46bf-ba95-e3233ccf528c	1-1 Minh Trang	500000	{5}	t	2026-11-20 12:03:04.266769+00	\N	{"5": {"bd": "20:30", "kt": "21:30"}}
9267894b-0000-4fa0-9931-9b300d5f1238	1-1 Minh Trang (1)	1000000	{0}	t	2026-11-20 12:03:04.266769+00	\N	{"0": {"bd": "08:30", "kt": "10:30"}}
c4a9644d-37b9-42f9-9466-a36f0b4af57c	Lớp ielts cơ bản cn	200000	{0}	t	2026-11-20 12:03:04.266769+00	\N	{"0": {"bd": "13:15", "kt": "15:15"}}
ff5bdfec-e718-4912-bf1b-877186b3f8e8	Lớp mix chiều cn	150000	{0}	t	2026-11-20 12:03:04.266769+00	\N	{"0": {"bd": "15:15", "kt": "17:15"}}
4df112a4-8db9-4c78-a747-5ab93c497a19	1-1 Trung Dũng 	1000000	{1,5}	t	2026-11-19 12:51:37.855395+00	\N	{"1": {"bd": "14:00", "kt": "16:00"}, "5": {"bd": "15:00", "kt": "17:00"}}
04be4e4f-b69a-4443-b1a1-61ff6eee57cb	Ca 1 tối t6	0	{5}	t	2026-11-19 13:04:57.355675+00	\N	{"5": {"bd": "18:00", "kt": "20:00"}}
\.


--
-- Data for Name: buoi_hoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."buoi_hoc" ("id", "lop_id", "ngay", "loai", "lop_nghi", "ghi_chu", "bat_dau", "ket_thuc") FROM stdin;
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-05	lich	f	\N	18:30:00	20:30:00
a572b44b-9082-49d3-b823-1b64a2e2139e	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-12	lich	f	\N	18:30:00	20:30:00
2ffd70cd-0afb-4874-9fd2-27de085d7225	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-14	lich	f	\N	09:00:00	11:30:00
7546fba6-4be9-440e-9ab2-c379d4c471e9	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-19	lich	f	\N	18:30:00	20:30:00
2d39d3bf-403a-4add-b335-932f3f0f7f67	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-21	lich	f	\N	09:00:00	11:30:00
95891a84-ae6b-474c-b54b-452bf5debda7	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-26	lich	f	\N	18:30:00	20:30:00
2b6dc9e8-8717-4df8-95b4-17773a38faff	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-28	lich	f	\N	09:00:00	11:30:00
f6e57378-f553-452e-9d0c-3cd5920181c2	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-17	phu	f	\N	18:30:00	20:30:00
729bac19-c0d8-469d-89fc-b9e0f37385fd	9267894b-0000-4fa0-9931-9b300d5f1238	2026-11-01	lich	f	\N	08:30:00	10:30:00
62dbfa7c-dc48-49a3-b20b-1fee55d37758	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	lich	f	\N	13:15:00	15:15:00
8779134c-3ec1-43b0-9894-355f8396c452	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	lich	f	\N	15:15:00	17:15:00
0eba43b0-5e48-4b58-ab43-c4a54bb92958	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-02	lich	f	\N	18:00:00	22:00:00
4f692829-ff0d-4dd0-83d2-74fc0103fcf5	76d237de-b44c-46bf-ba95-e3233ccf528c	2026-11-06	lich	f	\N	20:30:00	21:30:00
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-07	lich	f	\N	15:15:00	17:15:00
e23c926a-8834-4a87-97aa-f4b23f53bb49	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-07	lich	f	\N	18:00:00	20:00:00
22086756-3ad4-4f3b-a145-8d0239ef3e04	9267894b-0000-4fa0-9931-9b300d5f1238	2026-11-08	lich	f	\N	08:30:00	10:30:00
fee61361-bad6-4261-9696-09b6fcdc5209	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-08	lich	f	\N	13:15:00	15:15:00
fe2e618b-207f-4e12-85a5-869a5a678c89	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-08	lich	f	\N	15:15:00	17:15:00
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-09	lich	f	\N	18:00:00	22:00:00
c4327a19-e1d2-4db4-8e8f-7dc9794288c7	76d237de-b44c-46bf-ba95-e3233ccf528c	2026-11-13	lich	f	\N	20:30:00	21:30:00
e06f0275-a6f0-42f0-9f1d-963713a5120a	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-14	lich	f	\N	15:15:00	17:15:00
d5358c27-17ab-4613-937d-1e122c6dd555	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-14	lich	f	\N	18:00:00	20:00:00
d3cdec5a-6719-4abd-a70f-edf6d94ff3e7	9267894b-0000-4fa0-9931-9b300d5f1238	2026-11-15	lich	f	\N	08:30:00	10:30:00
152f232d-a41b-49ba-906c-68151d28d4a1	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-15	lich	f	\N	13:15:00	15:15:00
78ddc48c-fcce-40b2-a990-7881b7cebe73	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-15	lich	f	\N	15:15:00	17:15:00
6b2d9128-7127-45f0-8f82-081aa3ff0759	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-16	lich	f	\N	18:00:00	22:00:00
b58e02fa-a696-449e-bdab-8586041d5620	76d237de-b44c-46bf-ba95-e3233ccf528c	2026-11-20	lich	f	\N	20:30:00	21:30:00
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-21	lich	f	\N	15:15:00	17:15:00
81a08445-8690-4ba5-9fc5-2331ede97bb5	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-21	lich	f	\N	18:00:00	20:00:00
997fe90e-6a07-4050-a18e-2c2e251643cd	9267894b-0000-4fa0-9931-9b300d5f1238	2026-11-22	lich	f	\N	08:30:00	10:30:00
896a645c-e7c4-4117-940f-d49b23298936	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-22	lich	f	\N	13:15:00	15:15:00
7e26a780-214a-4c13-8a28-7f897936eec2	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-22	lich	f	\N	15:15:00	17:15:00
da811ac9-8644-4249-acb0-be74e6bdaa81	76d237de-b44c-46bf-ba95-e3233ccf528c	2026-11-27	lich	f	\N	20:30:00	21:30:00
a34f0a00-a6a8-488c-94f1-eec2b4152f15	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-28	lich	f	\N	15:15:00	17:15:00
74ec8d91-929c-44a1-8549-b2eec1bf32fc	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-28	lich	f	\N	18:00:00	20:00:00
e2474fe4-d9cb-4fff-86ba-951433d4a7d1	9267894b-0000-4fa0-9931-9b300d5f1238	2026-11-29	lich	f	\N	08:30:00	10:30:00
47b14bad-6ca8-41c1-8d57-07fbcba3524e	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-29	lich	f	\N	13:15:00	15:15:00
13015f7d-24cb-4083-8cdd-c4d0e92a6738	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-29	lich	f	\N	15:15:00	17:15:00
f993b035-3db7-4fa8-9bcf-3e703ea9d602	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-30	lich	f	\N	18:00:00	22:00:00
2923c476-222a-4733-84a2-3a26aa7f7adf	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-02	lich	f	\N	14:00:00	16:00:00
f5b9a39c-174b-477b-8ba2-45a68f53b660	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-09	lich	f	\N	14:00:00	16:00:00
feea60a9-496d-42ca-8fac-579b7e045401	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-16	lich	f	\N	14:00:00	16:00:00
01d029a9-b0f8-47b3-867a-008624e4ed9d	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-23	lich	f	\N	14:00:00	16:00:00
dd8801a9-5732-4854-bd3a-733bb042357f	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-30	lich	f	\N	14:00:00	16:00:00
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-04	lich	f	\N	\N	\N
a1c02c20-6317-4d61-ba6b-656c1156c884	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-11	lich	f	\N	\N	\N
92b3cab2-5ac5-48d8-a4a8-9b189028353a	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-18	lich	f	\N	\N	\N
8ac83685-f5d9-4b1f-8dd4-d7bc387ad24f	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-16	bu	f	\N	09:00:00	11:00:00
eea2018b-766f-4172-aefc-f89454e11876	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-05	lich	f	\N	18:00:00	20:00:00
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-12	lich	f	\N	18:00:00	20:00:00
71e54043-f25e-48e8-873d-9f249bd6150c	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-19	lich	f	\N	18:00:00	20:00:00
804fbd08-2178-4c1a-9c0a-293b1ca0462a	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-25	lich	f	\N	18:00:00	20:00:00
ceb1cfa4-71bf-44bb-8697-f8fa4958502b	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-26	lich	f	\N	18:00:00	20:00:00
f2baa976-58d4-4609-9331-5947c40c4df7	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-23	lich	f	\N	18:00:00	22:00:00
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
5d355ba0-130a-4159-8ab3-2e1464e17e50	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-07	lich	f	\N	09:00:00	11:30:00
c1bd29b8-3283-4974-804c-48118046b64f	76d237de-b44c-46bf-ba95-e3233ccf528c	2026-11-23	phu	f	\N	20:30:00	21:30:00
\.


--
-- Data for Name: anh_buoi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."anh_buoi" ("id", "buoi_id", "duong_dan", "tao_luc") FROM stdin;
205627d0-8772-4e5f-9b8b-34c5b0e4773b	f6e57378-f553-452e-9d0c-3cd5920181c2	buoi/f6e57378-f553-452e-9d0c-3cd5920181c2/90519080-c18d-407c-a4ea-b97c733a9440.jpg	2026-11-17 13:36:49.533277+00
b7761556-cb3c-4fd4-961e-61b735250d1a	92b3cab2-5ac5-48d8-a4a8-9b189028353a	buoi/92b3cab2-5ac5-48d8-a4a8-9b189028353a/2c9ad16e-8d97-4db5-9b10-a08643e38e86.jpg	2026-11-18 12:20:49.956401+00
73d1ef3a-4bd1-438a-baf5-4ec5ec7aa055	71e54043-f25e-48e8-873d-9f249bd6150c	buoi/71e54043-f25e-48e8-873d-9f249bd6150c/d65e8130-864b-4a59-b33b-326b36931b00.jpg	2026-11-19 13:05:42.199715+00
1dff6559-51dd-43e3-9128-df1d47346d8c	7546fba6-4be9-440e-9ab2-c379d4c471e9	buoi/7546fba6-4be9-440e-9ab2-c379d4c471e9/4bed649d-8156-4425-86ef-d2f0b9c42959.jpg	2026-11-19 13:48:19.147381+00
90671469-2cac-4e24-879f-112e2a6cf67b	b58e02fa-a696-449e-bdab-8586041d5620	buoi/b58e02fa-a696-449e-bdab-8586041d5620/141820af-28e8-457a-b1e4-a411095c240a.jpg	2026-11-20 14:42:39.950608+00
40eb5f7a-b3a1-457e-816e-5f570defaa10	c0f883fc-0857-4b2b-bc18-2e057ddde6a7	buoi/c0f883fc-0857-4b2b-bc18-2e057ddde6a7/7ee96fbf-f995-40cf-b4b4-507406311607.jpg	2026-11-20 15:05:36.342868+00
0770f0a4-bf9e-43a7-a026-32019fcdc0d1	2d39d3bf-403a-4add-b335-932f3f0f7f67	buoi/2d39d3bf-403a-4add-b335-932f3f0f7f67/176a4a28-14b5-453c-9076-57de30913a5e.jpg	2026-11-21 04:29:22.798871+00
5fcc1b6e-186e-482d-a04d-8c823ea9db2e	2a9b49fe-888a-4327-9b2b-92cf74c0ffad	buoi/2a9b49fe-888a-4327-9b2b-92cf74c0ffad/0d11d290-af2d-40e7-8448-eef0256e935f.jpg	2026-11-21 10:09:21.613192+00
c8cd1910-9af1-45e6-8e3c-684680078a79	81a08445-8690-4ba5-9fc5-2331ede97bb5	buoi/81a08445-8690-4ba5-9fc5-2331ede97bb5/36ed64de-d62b-47f1-b3d6-f48e23b3a534.jpg	2026-11-21 13:09:28.245786+00
08d0c3bc-36a9-45d6-9d44-9113b8281844	f2baa976-58d4-4609-9331-5947c40c4df7	buoi/f2baa976-58d4-4609-9331-5947c40c4df7/63caa467-acdf-4480-af0b-0ad9c8463d98.jpg	2026-11-23 13:24:05.187597+00
97da4e06-2ed2-43b5-853e-e70ef67a0de4	c1bd29b8-3283-4974-804c-48118046b64f	buoi/c1bd29b8-3283-4974-804c-48118046b64f/708c9599-0f0c-4e7f-b221-2dcbc27b4d32.jpg	2026-11-23 14:18:13.620384+00
7fb6fbf7-532a-493e-913d-47886949f06c	804fbd08-2178-4c1a-9c0a-293b1ca0462a	buoi/804fbd08-2178-4c1a-9c0a-293b1ca0462a/febd7102-68da-47bb-8408-7436b9bcd9cb.jpg	2026-11-25 13:15:23.153103+00
1707b397-1447-4b57-9e99-359ee58bb868	997fe90e-6a07-4050-a18e-2c2e251643cd	buoi/997fe90e-6a07-4050-a18e-2c2e251643cd/e3b51695-d754-4a97-a83b-bd76ef994726.jpg	2026-11-25 14:39:26.83147+00
8d25eefd-72b9-451e-9870-4e4108dbe1e6	896a645c-e7c4-4117-940f-d49b23298936	buoi/896a645c-e7c4-4117-940f-d49b23298936/e83f827a-e74b-4cac-960b-e484948b3cab.jpg	2026-11-25 14:50:31.973069+00
9525a1da-ae6c-4cdd-a67a-7062f0d1b0cc	7e26a780-214a-4c13-8a28-7f897936eec2	buoi/7e26a780-214a-4c13-8a28-7f897936eec2/0dfced6d-88ed-448f-95a1-10a8282b5b43.jpg	2026-11-25 14:54:23.767908+00
9b2e34bd-90c0-46c8-80cb-2c0407e31bd7	7e26a780-214a-4c13-8a28-7f897936eec2	buoi/7e26a780-214a-4c13-8a28-7f897936eec2/2b7f49a9-15ec-4d5f-964e-0869d1c13a88.jpg	2026-11-25 14:54:47.172102+00
\.


--
-- Data for Name: tai_khoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tai_khoan" ("id", "email", "ten_dang_nhap", "so_dien_thoai", "ho_ten", "vai_tro", "phai_doi_mat_khau", "don_gia_buoi", "hoat_dong") FROM stdin;
43d2ab0d-e902-49d7-9e81-a3696d296ad2	admin@msnhung.local	admin	\N	Quản trị	admin	f	0	t
7925dcdb-7311-4634-896a-b4b6386b2df2	8ebb1955-2bf2-40c6-98fd-94c9104c1119@msnhung.local	manh	\N	Trần Mạnh	tro_giang	f	100000	f
d45793f2-33af-41bf-91e4-410cf31087cc	f11afff5-2031-4c08-8ed1-1fb7a6e992b6@msnhung.local	thanh	\N	Thành	tro_giang	t	100000	t
877e2be5-c648-4abe-b7a6-8ceff0df9d68	b3a2e022-4ac8-4e39-bf92-8eb8929f8818@msnhung.local	duong	\N	Minh Dương	tro_giang	t	100000	t
8b0b82af-8eee-477b-bc50-b5c72837c2f7	9b44af75-9759-4353-8276-9a34385879ac@msnhung.local	thanhielts	\N	Thành lớp ielts nâng cao 	tro_giang	t	50000	t
9b8a626d-c10d-443e-adcf-8b152a9b6c90	ac70b571-f88b-4b91-910e-2056e06887f5@msnhung.local	tuanielts	\N	Tuấn lớp ielts nâng cao 	tro_giang	t	50000	t
69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	8a80fc97-4996-4655-afee-8eac991e9a12@msnhung.local	tuan	\N	Anh Tuấn	tro_giang	f	100000	t
906a5d63-7289-4b55-a279-ff8db9b1a5c4	fcc895cd-f026-4e3f-81d1-1544acf6f727@msnhung.local	nga	\N	Thiên Nga	tro_giang	f	100000	t
77ffcb33-c53a-41b3-a728-f1fdb13cc37b	19f38f04-61b3-43ca-8335-d6f1b809a252@msnhung.local	ngan	\N	Ngân	tro_giang	f	100000	t
8f2ca2fa-e36b-4f1c-89a0-aade2484f779	ed73e7b8-d79a-4f34-9401-1efaf3f11565@msnhung.local	test	123	test	tro_giang	f	1000000	t
\.


--
-- Data for Name: hoc_sinh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."hoc_sinh" ("id", "ho_ten", "avatar", "ten_phu_huynh", "sdt_phu_huynh", "phu_huynh_id", "ngay_vao", "don_gia_rieng", "trang_thai", "ghi_chu", "tao_luc", "sticker_dau_ky", "link_zalo", "ma_hs", "don_gia") FROM stdin;
9706bbdf-ef70-4ea9-950c-f8062c4ac033	Lê Ngọc Vy	\N	Bích	\N	\N	2026-11-22	\N	dang_hoc	\N	2026-11-25 13:48:55.225174+00	0	\N	HS130	150000
09426ac0-e7af-47bc-a029-195fcee72b46	Bùi Bách	avatar/09426ac0-e7af-47bc-a029-195fcee72b46-1794921820760.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:23:40.619385+00	0	\N	HS001	400000
2a71aebf-2868-4496-8c0d-26a9c5fdac6d	Gia Khánh	avatar/2a71aebf-2868-4496-8c0d-26a9c5fdac6d-1794921883142.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:24:43.072064+00	0	\N	HS002	400000
6125884c-53f0-45ee-a303-3d03bc111254	Gia Minh	avatar/6125884c-53f0-45ee-a303-3d03bc111254-1794921934570.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:25:34.500012+00	20	\N	HS003	400000
98deb901-bd60-4e1a-94c1-0ab944440ecb	Hải Hiếu	avatar/98deb901-bd60-4e1a-94c1-0ab944440ecb-1794921993396.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:26:33.273193+00	0	\N	HS004	400000
1b364415-27c0-4528-b772-6f9331702874	Hoàng Tuấn	avatar/1b364415-27c0-4528-b772-6f9331702874-1794922033355.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:27:13.282976+00	0	\N	HS005	400000
9c5e27df-2361-46d3-9551-92dc6109c2f5	Lâm Tùng	avatar/9c5e27df-2361-46d3-9551-92dc6109c2f5-1794922065703.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:27:45.537928+00	0	\N	HS006	400000
8605edcb-76d1-4391-9739-fcbf0bc389a1	Lê Thị Anh Thư	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:03:52.001641+00	60	\N	HS058	200000
3d45bd85-eba9-426b-93b3-37f7de37970f	Nguyễn Thế Hiếu	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:03:54.45887+00	465	\N	HS060	200000
5f872515-0a7e-4cd7-8a63-01c8c51d8b04	Nguyễn Thị Ngọc	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:04:22.507485+00	0	\N	HS061	200000
4d36c077-ad54-4671-8a64-3c7d297faca3	Lê Tiến Anh	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:44:12.041399+00	435	\N	HS028	150000
d96f705a-caed-4aed-8c5a-2f729630dd64	Phạm Bảo Anh	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:44:44.198055+00	141	\N	HS030	150000
10e6b491-c559-4087-bbc6-d6520f6d21f5	Phạm Ngọc Anh	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:45:09.048392+00	71	\N	HS031	150000
64a37c23-5108-4025-bcb3-e7ea6b1fe979	Phạm Nhật Linh (Sam)	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:45:26.515177+00	163	\N	HS032	150000
b218ff29-82e7-4386-8eae-0dd472b1894b	Trần Gia Nghĩa (Ỉn)	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:46:09.638888+00	98	\N	HS034	150000
da8f3b69-bcb6-46d7-b324-e5f61183d270	Vũ Dương Bảo An	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:46:49.705307+00	59	\N	HS036	150000
97016524-445e-48cb-ad25-91aae2e0369b	Lương Minh Quân	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:03:53.110352+00	103	\N	HS059	150000
bc073e92-1a93-41f4-9698-d042e73f9aa9	Nhật Duy	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:04:22.9052+00	0	\N	HS062	150000
7dd34d24-cee2-4506-98f3-90bc27e293a9	Trung Dũng	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:00:43.008932+00	58	https://zalo.me/g/fydjarn7zof4nifq8y4z	HS038	1000000
55328067-088a-4f1b-ae66-507f6d56aa15	Hoàng Trung Hải	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:07:09.119992+00	56	https://zalo.me/g/zgel8mci93ptujzeoquu	HS041	150000
552de5e9-d599-4a8e-ace8-d80518dfe059	Hà Đoàn Nhật Hoàng	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:06:01.175745+00	284	https://zalo.me/g/ndhnrkrskkjgirptjbd8	HS040	150000
a5df955d-2040-41d3-a691-2a9526050dba	Hoàng Trung Đức	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:43:24.654764+00	93	\N	HS025	150000
68f0e7bf-636d-460a-a1e9-c2c0f10c86d1	Bảo Hân	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:03:41.012923+00	58	\N	HS054	150000
d7a4616d-10a2-4dc3-a6a9-78c86c71e5f8	Đặng An Bình	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:03:46.314453+00	55	\N	HS055	150000
abac3dcb-3f90-48e2-b36f-e80f34c47d92	Đỗ Hoàng Thùy	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:03:51.531242+00	58	\N	HS056	150000
c896114e-f0e2-4b63-af81-07e50276d6fd	Đỗ Kim Ngân	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:03:51.800241+00	41	\N	HS057	150000
b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	Minh Trang	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:05:51.968385+00	0	\N	HS083	500000
b3065572-cd6a-4131-bae6-4f0b9ed4f46f	Nam Phong	avatar/b3065572-cd6a-4131-bae6-4f0b9ed4f46f-1794922100871.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:28:20.821969+00	0	\N	HS007	400000
2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	Chu Bảo Ngân	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:04:29.454866+00	311	\N	HS066	200000
cc1d85c9-4423-4157-9953-74dfc16e5b00	Lê Hồng Ngọc	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:05:52.694682+00	0	\N	HS087	200000
46e4a30d-fdb2-46de-ae44-f50c91b96020	Nguyễn Hải Sơn	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:05:53.431667+00	469	\N	HS090	200000
a5ca77b4-627d-4092-ad49-3a8afe6bc16d	Phạm Sương Mai	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:05:54.034015+00	0	\N	HS093	200000
dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	Phạm Thị Vân Anh	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:05:47.029677+00	184	\N	HS067	200000
58ccd9fc-cb17-4e09-afc1-0989f0636f6f	Ngô Thảo Chi	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:04:29.160242+00	62	\N	HS065	200000
04c0644a-6490-4551-9b84-2b3e606b2f11	Trịnh Ngọc Bảo Anh	avatar/04c0644a-6490-4551-9b84-2b3e606b2f11-1794998765684.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:46:05.536913+00	165	\N	HS018	150000
7c7fc404-3d84-4d6b-8972-3926976216f4	Trịnh Ngọc Bảo Trân	avatar/7c7fc404-3d84-4d6b-8972-3926976216f4-1794998800089.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:46:39.986746+00	276	\N	HS019	150000
8a601d2f-4322-4983-9e47-f964e910e10f	Vũ Hải Long	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:04:27.873171+00	326	\N	HS064	200000
8449f57a-28fa-40e2-b016-52d8fdfb1a1a	Đặng Bảo An	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:42:37.088899+00	132	\N	HS022	150000
127cf384-4ac0-4a57-8d3e-7f3755cf5e76	Đỗ Thùy Linh	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:42:53.079265+00	45	\N	HS023	150000
47de7f3c-c311-44a9-b8e9-d535f63909c5	Hoàng Mai Phương	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:43:07.199964+00	199	\N	HS024	150000
e1d9c6da-9520-433a-9485-201be17d736d	Lê Danh Gia Bảo	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:43:54.430225+00	108	\N	HS027	150000
9649475f-b209-4855-8e4f-f991a3ccce82	Nguyễn Gia Bảo	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:05:50.629082+00	148	\N	HS075	150000
e5d63dee-19fe-4ae1-a741-08a03111eb1d	Nguyễn Ngọc Châu An	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:44:30.250637+00	39	\N	HS029	150000
e3906889-be7a-483c-a548-52c80afb47e7	Nguyễn Tự Huy	avatar/e3906889-be7a-483c-a548-52c80afb47e7-1794998686016.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:44:45.767249+00	35	\N	HS016	150000
94c6acd3-4c22-405e-a976-d9cd63a72345	Trần Gia Bảo	avatar/94c6acd3-4c22-405e-a976-d9cd63a72345-1794998722264.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:45:22.118529+00	125	\N	HS017	150000
e6af6149-70f4-4687-8390-4f3886b7a42e	Trần Gia Khiêm (Voi)	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:45:50.826526+00	165	\N	HS033	150000
ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	Trần Gia Minh	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:05:51.717019+00	112	\N	HS081	150000
3e45fe76-7884-4e40-8f60-d54cb47ea033	Tú Anh	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 12:46:22.947966+00	34	\N	HS035	150000
0377768d-cc45-49f5-a96d-8d170c3bf41f	Vũ Hải Hà	avatar/0377768d-cc45-49f5-a96d-8d170c3bf41f-1794998858970.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:47:38.903246+00	23	https://zalo.me/g/l3uhkuophq7uzcn8qqrj	HS021	150000
1555600c-8358-42eb-b9f3-611dbeab3641	Khuất Hoàng An	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:07:23.152836+00	165	https://zalo.me/g/rd741dryczmk29nfhvgw	HS042	150000
6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	Vũ Quốc Tùng	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:13:57.036645+00	306	https://zalo.me/g/aowhik487	HS052	150000
0151b50f-11df-493c-a959-2b143ffec470	Phạm Trí Thành	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-20 12:04:27.433992+00	0	\N	HS063	200000
242f8971-c4c0-44d1-8f4e-c26d77efd8ef	Nguyễn Hà Giang	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:08:26.674575+00	117	https://zalo.me/g/jfamzj191	HS045	150000
60cdb4a9-3025-44d3-8086-b14612242c76	Nguyễn Hải Đăng	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:09:53.691685+00	97	https://zalo.me/g/jfamzj191	HS047	150000
ff386fd8-15b5-42a0-b103-536c60684008	Lê Minh Huy	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:07:37.094095+00	221	https://zalo.me/g/txfgex990	HS043	150000
f85931d6-9ede-45a1-acde-ba4789c6e853	Nguyễn Ngọc Quân	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:10:15.639752+00	380	https://zalo.me/g/oyopku102	HS048	150000
78e11889-7937-481d-8234-98df5fc25ddc	Phạm Minh Khôi	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:10:55.593686+00	285	https://zalo.me/g/xpgehs363	HS049	150000
892394ca-8163-4263-9b19-957de160996b	Nguyễn Đăng Dương	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-19 13:08:08.684126+00	346	https://zalo.me/g/zwmmze689	HS044	200000
e561c6d5-6fbc-462a-ab2e-e1423f3b692f	Ngọc Minh	avatar/e561c6d5-6fbc-462a-ab2e-e1423f3b692f-1794922166340.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-17 13:29:26.274078+00	0	\N	HS008	0
33a3cfe1-6ebb-46fb-b851-4282d579a315	Hoàng Diệu Linh	avatar/33a3cfe1-6ebb-46fb-b851-4282d579a315-1794998542956.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:42:22.881958+00	143	\N	HS013	200000
eaff414d-ac8c-44a0-9ed3-483992927fb9	Ánh Long	avatar/eaff414d-ac8c-44a0-9ed3-483992927fb9-1794998386874.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:39:46.828145+00	36	https://zalo.me/g/c4nefj98lxkx9coet0jh	HS009	150000
a409e2ce-01c6-49e8-bbdf-5caf4477db1e	Đinh Bá Quang Anh	avatar/a409e2ce-01c6-49e8-bbdf-5caf4477db1e-1794998465030.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:41:04.952525+00	152	\N	HS011	150000
47286437-2fcd-451e-b01f-c19e8cbbcbef	Đỗ Phương Thu	avatar/47286437-2fcd-451e-b01f-c19e8cbbcbef-1794998506091.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:41:46.019686+00	107	\N	HS012	150000
a6071b67-2130-479d-9960-be9b713e379d	Lê Duy Anh	avatar/a6071b67-2130-479d-9960-be9b713e379d-1794998592009.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:43:11.843234+00	6	\N	HS014	150000
bc4166c1-2a49-43d1-9769-f752dcc2d91c	Bùi Ngọc Hà	avatar/bc4166c1-2a49-43d1-9769-f752dcc2d91c-1794998426835.jpg	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:40:26.742895+00	214	https://zalo.me/g/uvqw50szeba9aqcj2yuy	HS010	150000
d2c38a11-b7b8-41da-9cf9-9f5808755c9b	Tùng Lâm	\N	\N	\N	\N	2026-11-01	\N	dang_hoc	\N	2026-11-18 10:47:01.711591+00	0	\N	HS020	150000
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
\.


--
-- Data for Name: diem_danh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."diem_danh" ("buoi_id", "hoc_sinh_id", "trang_thai", "sticker") FROM stdin;
71e54043-f25e-48e8-873d-9f249bd6150c	64a37c23-5108-4025-bcb3-e7ea6b1fe979	co_mat	7
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	8a601d2f-4322-4983-9e47-f964e910e10f	co_mat	8
71e54043-f25e-48e8-873d-9f249bd6150c	4d36c077-ad54-4671-8a64-3c7d297faca3	co_mat	7
71e54043-f25e-48e8-873d-9f249bd6150c	d96f705a-caed-4aed-8c5a-2f729630dd64	co_mat	4
92b3cab2-5ac5-48d8-a4a8-9b189028353a	7c7fc404-3d84-4d6b-8972-3926976216f4	vang	0
92b3cab2-5ac5-48d8-a4a8-9b189028353a	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	vang	0
71e54043-f25e-48e8-873d-9f249bd6150c	10e6b491-c559-4087-bbc6-d6520f6d21f5	co_mat	4
71e54043-f25e-48e8-873d-9f249bd6150c	b218ff29-82e7-4386-8eae-0dd472b1894b	co_mat	5
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	47286437-2fcd-451e-b01f-c19e8cbbcbef	hoc_bu	0
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
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	68f0e7bf-636d-460a-a1e9-c2c0f10c86d1	co_mat	5
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	d7a4616d-10a2-4dc3-a6a9-78c86c71e5f8	co_mat	5
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	abac3dcb-3f90-48e2-b36f-e80f34c47d92	co_mat	5
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
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	892394ca-8163-4263-9b19-957de160996b	vang	0
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	co_mat	4
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	f85931d6-9ede-45a1-acde-ba4789c6e853	co_mat	5
7546fba6-4be9-440e-9ab2-c379d4c471e9	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	6125884c-53f0-45ee-a303-3d03bc111254	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	98deb901-bd60-4e1a-94c1-0ab944440ecb	co_mat	10
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	552de5e9-d599-4a8e-ace8-d80518dfe059	co_mat	5
7546fba6-4be9-440e-9ab2-c379d4c471e9	1b364415-27c0-4528-b772-6f9331702874	co_mat	10
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	55328067-088a-4f1b-ae66-507f6d56aa15	co_mat	5
7546fba6-4be9-440e-9ab2-c379d4c471e9	9c5e27df-2361-46d3-9551-92dc6109c2f5	co_mat	10
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	1555600c-8358-42eb-b9f3-611dbeab3641	co_mat	5
7546fba6-4be9-440e-9ab2-c379d4c471e9	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	co_mat	10
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	ff386fd8-15b5-42a0-b103-536c60684008	co_mat	5
7546fba6-4be9-440e-9ab2-c379d4c471e9	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	10
7546fba6-4be9-440e-9ab2-c379d4c471e9	09426ac0-e7af-47bc-a029-195fcee72b46	co_mat	10
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	3d45bd85-eba9-426b-93b3-37f7de37970f	co_mat	8
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	78e11889-7937-481d-8234-98df5fc25ddc	co_mat	5
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	co_mat	5
1dc15fdd-fa0f-47e7-b22c-8e44dc54cd1b	7dd34d24-cee2-4506-98f3-90bc27e293a9	vang	0
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	c896114e-f0e2-4b63-af81-07e50276d6fd	vang	0
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	8605edcb-76d1-4391-9739-fcbf0bc389a1	vang	0
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	5
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	97016524-445e-48cb-ad25-91aae2e0369b	vang	0
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	vang	0
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	vang	0
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	bc073e92-1a93-41f4-9698-d042e73f9aa9	vang	0
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	0151b50f-11df-493c-a959-2b143ffec470	vang	0
81a08445-8690-4ba5-9fc5-2331ede97bb5	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	vang	0
b58e02fa-a696-449e-bdab-8586041d5620	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	co_mat	10
2d39d3bf-403a-4add-b335-932f3f0f7f67	6125884c-53f0-45ee-a303-3d03bc111254	co_mat	9
81a08445-8690-4ba5-9fc5-2331ede97bb5	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	co_mat	10
2d39d3bf-403a-4add-b335-932f3f0f7f67	98deb901-bd60-4e1a-94c1-0ab944440ecb	co_mat	15
2d39d3bf-403a-4add-b335-932f3f0f7f67	09426ac0-e7af-47bc-a029-195fcee72b46	co_mat	10
2d39d3bf-403a-4add-b335-932f3f0f7f67	1b364415-27c0-4528-b772-6f9331702874	vang	0
2d39d3bf-403a-4add-b335-932f3f0f7f67	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	co_mat	11
2d39d3bf-403a-4add-b335-932f3f0f7f67	9c5e27df-2361-46d3-9551-92dc6109c2f5	co_mat	10
2d39d3bf-403a-4add-b335-932f3f0f7f67	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	co_mat	10
f6e57378-f553-452e-9d0c-3cd5920181c2	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	hoc_bu	10
2d39d3bf-403a-4add-b335-932f3f0f7f67	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	13
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	bc4166c1-2a49-43d1-9769-f752dcc2d91c	vang	0
81a08445-8690-4ba5-9fc5-2331ede97bb5	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	10
71e54043-f25e-48e8-873d-9f249bd6150c	55328067-088a-4f1b-ae66-507f6d56aa15	co_mat	2
81a08445-8690-4ba5-9fc5-2331ede97bb5	cc1d85c9-4423-4157-9953-74dfc16e5b00	co_mat	8
f6e57378-f553-452e-9d0c-3cd5920181c2	8605edcb-76d1-4391-9739-fcbf0bc389a1	hoc_bu	10
81a08445-8690-4ba5-9fc5-2331ede97bb5	8605edcb-76d1-4391-9739-fcbf0bc389a1	vang	0
60bd6335-c8dd-40c3-9fed-be5893431eeb	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	vang	0
92b3cab2-5ac5-48d8-a4a8-9b189028353a	892394ca-8163-4263-9b19-957de160996b	vang	0
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	60cdb4a9-3025-44d3-8086-b14612242c76	co_mat	2
81a08445-8690-4ba5-9fc5-2331ede97bb5	46e4a30d-fdb2-46de-ae44-f50c91b96020	co_mat	8
81a08445-8690-4ba5-9fc5-2331ede97bb5	3d45bd85-eba9-426b-93b3-37f7de37970f	co_mat	8
81a08445-8690-4ba5-9fc5-2331ede97bb5	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	vang	0
81a08445-8690-4ba5-9fc5-2331ede97bb5	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	co_mat	8
81a08445-8690-4ba5-9fc5-2331ede97bb5	0151b50f-11df-493c-a959-2b143ffec470	vang	0
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	co_mat	3
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	7
81a08445-8690-4ba5-9fc5-2331ede97bb5	8a601d2f-4322-4983-9e47-f964e910e10f	co_mat	8
01d029a9-b0f8-47b3-867a-008624e4ed9d	7dd34d24-cee2-4506-98f3-90bc27e293a9	vang	0
729bac19-c0d8-469d-89fc-b9e0f37385fd	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	co_mat	5
2923c476-222a-4733-84a2-3a26aa7f7adf	7dd34d24-cee2-4506-98f3-90bc27e293a9	co_mat	5
3e8c80ca-802a-4b44-95ea-f9f1b274fb7e	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	vang	0
c510b585-9651-4983-976c-9c4af08cd484	7dd34d24-cee2-4506-98f3-90bc27e293a9	co_mat	10
4f692829-ff0d-4dd0-83d2-74fc0103fcf5	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	co_mat	0
22086756-3ad4-4f3b-a145-8d0239ef3e04	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	co_mat	30
f5b9a39c-174b-477b-8ba2-45a68f53b660	7dd34d24-cee2-4506-98f3-90bc27e293a9	co_mat	10
33376ba3-08e6-4509-a001-d4f6d0898b26	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	10
4d50f71f-4d1d-4be0-a868-093fd1896077	7dd34d24-cee2-4506-98f3-90bc27e293a9	co_mat	10
c4327a19-e1d2-4db4-8e8f-7dc9794288c7	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	vang	0
d3cdec5a-6719-4abd-a70f-edf6d94ff3e7	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	co_mat	20
feea60a9-496d-42ca-8fac-579b7e045401	7dd34d24-cee2-4506-98f3-90bc27e293a9	co_mat	10
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	09426ac0-e7af-47bc-a029-195fcee72b46	co_mat	10
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	co_mat	10
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	6125884c-53f0-45ee-a303-3d03bc111254	vang	0
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	98deb901-bd60-4e1a-94c1-0ab944440ecb	co_mat	10
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	1b364415-27c0-4528-b772-6f9331702874	co_mat	10
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	9c5e27df-2361-46d3-9551-92dc6109c2f5	vang	0
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	co_mat	10
2384d9ae-3528-41aa-9a60-77b3e7ce6b8e	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	10
a572b44b-9082-49d3-b823-1b64a2e2139e	09426ac0-e7af-47bc-a029-195fcee72b46	co_mat	10
a572b44b-9082-49d3-b823-1b64a2e2139e	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	co_mat	10
a572b44b-9082-49d3-b823-1b64a2e2139e	6125884c-53f0-45ee-a303-3d03bc111254	co_mat	10
a572b44b-9082-49d3-b823-1b64a2e2139e	98deb901-bd60-4e1a-94c1-0ab944440ecb	co_mat	10
a572b44b-9082-49d3-b823-1b64a2e2139e	1b364415-27c0-4528-b772-6f9331702874	co_mat	10
a572b44b-9082-49d3-b823-1b64a2e2139e	9c5e27df-2361-46d3-9551-92dc6109c2f5	co_mat	10
a572b44b-9082-49d3-b823-1b64a2e2139e	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	co_mat	10
a572b44b-9082-49d3-b823-1b64a2e2139e	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	10
2ffd70cd-0afb-4874-9fd2-27de085d7225	09426ac0-e7af-47bc-a029-195fcee72b46	co_mat	10
2ffd70cd-0afb-4874-9fd2-27de085d7225	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	co_mat	13
2ffd70cd-0afb-4874-9fd2-27de085d7225	6125884c-53f0-45ee-a303-3d03bc111254	co_mat	10
2ffd70cd-0afb-4874-9fd2-27de085d7225	98deb901-bd60-4e1a-94c1-0ab944440ecb	co_mat	10
2ffd70cd-0afb-4874-9fd2-27de085d7225	1b364415-27c0-4528-b772-6f9331702874	co_mat	10
2ffd70cd-0afb-4874-9fd2-27de085d7225	9c5e27df-2361-46d3-9551-92dc6109c2f5	co_mat	10
2ffd70cd-0afb-4874-9fd2-27de085d7225	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	co_mat	10
2ffd70cd-0afb-4874-9fd2-27de085d7225	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	co_mat	13
62dbfa7c-dc48-49a3-b20b-1fee55d37758	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	co_mat	10
62dbfa7c-dc48-49a3-b20b-1fee55d37758	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	8605edcb-76d1-4391-9739-fcbf0bc389a1	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	cc1d85c9-4423-4157-9953-74dfc16e5b00	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	46e4a30d-fdb2-46de-ae44-f50c91b96020	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	3d45bd85-eba9-426b-93b3-37f7de37970f	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	vang	0
62dbfa7c-dc48-49a3-b20b-1fee55d37758	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	04c0644a-6490-4551-9b84-2b3e606b2f11	vang	0
62dbfa7c-dc48-49a3-b20b-1fee55d37758	7c7fc404-3d84-4d6b-8972-3926976216f4	vang	0
62dbfa7c-dc48-49a3-b20b-1fee55d37758	8a601d2f-4322-4983-9e47-f964e910e10f	co_mat	5
8779134c-3ec1-43b0-9894-355f8396c452	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	co_mat	0
8779134c-3ec1-43b0-9894-355f8396c452	47286437-2fcd-451e-b01f-c19e8cbbcbef	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	47de7f3c-c311-44a9-b8e9-d535f63909c5	vang	0
8779134c-3ec1-43b0-9894-355f8396c452	55328067-088a-4f1b-ae66-507f6d56aa15	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	e1d9c6da-9520-433a-9485-201be17d736d	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	4d36c077-ad54-4671-8a64-3c7d297faca3	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	9649475f-b209-4855-8e4f-f991a3ccce82	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	60cdb4a9-3025-44d3-8086-b14612242c76	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	e5d63dee-19fe-4ae1-a741-08a03111eb1d	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	d96f705a-caed-4aed-8c5a-2f729630dd64	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	10e6b491-c559-4087-bbc6-d6520f6d21f5	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	64a37c23-5108-4025-bcb3-e7ea6b1fe979	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	e6af6149-70f4-4687-8390-4f3886b7a42e	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	b218ff29-82e7-4386-8eae-0dd472b1894b	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	3e45fe76-7884-4e40-8f60-d54cb47ea033	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	da8f3b69-bcb6-46d7-b324-e5f61183d270	co_mat	3
8779134c-3ec1-43b0-9894-355f8396c452	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	0
0eba43b0-5e48-4b58-ab43-c4a54bb92958	552de5e9-d599-4a8e-ace8-d80518dfe059	co_mat	5
0eba43b0-5e48-4b58-ab43-c4a54bb92958	1555600c-8358-42eb-b9f3-611dbeab3641	co_mat	5
0eba43b0-5e48-4b58-ab43-c4a54bb92958	a6071b67-2130-479d-9960-be9b713e379d	co_mat	3
0eba43b0-5e48-4b58-ab43-c4a54bb92958	ff386fd8-15b5-42a0-b103-536c60684008	co_mat	5
0eba43b0-5e48-4b58-ab43-c4a54bb92958	9649475f-b209-4855-8e4f-f991a3ccce82	co_mat	2
0eba43b0-5e48-4b58-ab43-c4a54bb92958	f85931d6-9ede-45a1-acde-ba4789c6e853	co_mat	5
0eba43b0-5e48-4b58-ab43-c4a54bb92958	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	5
0eba43b0-5e48-4b58-ab43-c4a54bb92958	78e11889-7937-481d-8234-98df5fc25ddc	co_mat	5
0eba43b0-5e48-4b58-ab43-c4a54bb92958	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	hoc_bu	5
0eba43b0-5e48-4b58-ab43-c4a54bb92958	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	co_mat	5
0eba43b0-5e48-4b58-ab43-c4a54bb92958	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	co_mat	5
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	3
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	bc4166c1-2a49-43d1-9769-f752dcc2d91c	vang	0
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	co_mat	5
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	47286437-2fcd-451e-b01f-c19e8cbbcbef	co_mat	5
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	6
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	892394ca-8163-4263-9b19-957de160996b	co_mat	6
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	e3906889-be7a-483c-a548-52c80afb47e7	vang	0
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	94c6acd3-4c22-405e-a976-d9cd63a72345	co_mat	4
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	04c0644a-6490-4551-9b84-2b3e606b2f11	co_mat	6
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	7c7fc404-3d84-4d6b-8972-3926976216f4	co_mat	8
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	co_mat	8
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	3
eea2018b-766f-4172-aefc-f89454e11876	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	co_mat	7
eea2018b-766f-4172-aefc-f89454e11876	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	co_mat	11
eea2018b-766f-4172-aefc-f89454e11876	47de7f3c-c311-44a9-b8e9-d535f63909c5	co_mat	7
eea2018b-766f-4172-aefc-f89454e11876	a5df955d-2040-41d3-a691-2a9526050dba	co_mat	4
eea2018b-766f-4172-aefc-f89454e11876	55328067-088a-4f1b-ae66-507f6d56aa15	co_mat	8
eea2018b-766f-4172-aefc-f89454e11876	e1d9c6da-9520-433a-9485-201be17d736d	co_mat	3
eea2018b-766f-4172-aefc-f89454e11876	4d36c077-ad54-4671-8a64-3c7d297faca3	co_mat	5
eea2018b-766f-4172-aefc-f89454e11876	e5d63dee-19fe-4ae1-a741-08a03111eb1d	co_mat	7
eea2018b-766f-4172-aefc-f89454e11876	e3906889-be7a-483c-a548-52c80afb47e7	hoc_bu	5
eea2018b-766f-4172-aefc-f89454e11876	d96f705a-caed-4aed-8c5a-2f729630dd64	co_mat	7
eea2018b-766f-4172-aefc-f89454e11876	10e6b491-c559-4087-bbc6-d6520f6d21f5	co_mat	0
eea2018b-766f-4172-aefc-f89454e11876	64a37c23-5108-4025-bcb3-e7ea6b1fe979	co_mat	9
eea2018b-766f-4172-aefc-f89454e11876	e6af6149-70f4-4687-8390-4f3886b7a42e	co_mat	2
eea2018b-766f-4172-aefc-f89454e11876	b218ff29-82e7-4386-8eae-0dd472b1894b	co_mat	4
eea2018b-766f-4172-aefc-f89454e11876	3e45fe76-7884-4e40-8f60-d54cb47ea033	co_mat	8
eea2018b-766f-4172-aefc-f89454e11876	da8f3b69-bcb6-46d7-b324-e5f61183d270	co_mat	0
88e99a85-3d79-46e3-b5f4-e5caa7817535	bc4166c1-2a49-43d1-9769-f752dcc2d91c	hoc_bu	6
88e99a85-3d79-46e3-b5f4-e5caa7817535	552de5e9-d599-4a8e-ace8-d80518dfe059	co_mat	4
88e99a85-3d79-46e3-b5f4-e5caa7817535	55328067-088a-4f1b-ae66-507f6d56aa15	co_mat	8
88e99a85-3d79-46e3-b5f4-e5caa7817535	1555600c-8358-42eb-b9f3-611dbeab3641	co_mat	4
88e99a85-3d79-46e3-b5f4-e5caa7817535	ff386fd8-15b5-42a0-b103-536c60684008	co_mat	4
88e99a85-3d79-46e3-b5f4-e5caa7817535	892394ca-8163-4263-9b19-957de160996b	co_mat	8
88e99a85-3d79-46e3-b5f4-e5caa7817535	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	co_mat	3
88e99a85-3d79-46e3-b5f4-e5caa7817535	60cdb4a9-3025-44d3-8086-b14612242c76	co_mat	3
88e99a85-3d79-46e3-b5f4-e5caa7817535	f85931d6-9ede-45a1-acde-ba4789c6e853	co_mat	4
88e99a85-3d79-46e3-b5f4-e5caa7817535	78e11889-7937-481d-8234-98df5fc25ddc	vang	0
88e99a85-3d79-46e3-b5f4-e5caa7817535	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	4
88e99a85-3d79-46e3-b5f4-e5caa7817535	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	eaff414d-ac8c-44a0-9ed3-483992927fb9	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	68f0e7bf-636d-460a-a1e9-c2c0f10c86d1	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	d7a4616d-10a2-4dc3-a6a9-78c86c71e5f8	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	abac3dcb-3f90-48e2-b36f-e80f34c47d92	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	c896114e-f0e2-4b63-af81-07e50276d6fd	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	8605edcb-76d1-4391-9739-fcbf0bc389a1	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	97016524-445e-48cb-ad25-91aae2e0369b	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	3d45bd85-eba9-426b-93b3-37f7de37970f	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	0151b50f-11df-493c-a959-2b143ffec470	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	vang	0
cc7c5af2-ece3-4607-8ff6-a606fe66b11d	8a601d2f-4322-4983-9e47-f964e910e10f	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	33a3cfe1-6ebb-46fb-b851-4282d579a315	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	8605edcb-76d1-4391-9739-fcbf0bc389a1	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	cc1d85c9-4423-4157-9953-74dfc16e5b00	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	46e4a30d-fdb2-46de-ae44-f50c91b96020	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	3d45bd85-eba9-426b-93b3-37f7de37970f	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	0151b50f-11df-493c-a959-2b143ffec470	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	vang	0
e23c926a-8834-4a87-97aa-f4b23f53bb49	8a601d2f-4322-4983-9e47-f964e910e10f	vang	0
fee61361-bad6-4261-9696-09b6fcdc5209	eaff414d-ac8c-44a0-9ed3-483992927fb9	hoc_bu	5
fee61361-bad6-4261-9696-09b6fcdc5209	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	8605edcb-76d1-4391-9739-fcbf0bc389a1	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	cc1d85c9-4423-4157-9953-74dfc16e5b00	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	46e4a30d-fdb2-46de-ae44-f50c91b96020	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	3d45bd85-eba9-426b-93b3-37f7de37970f	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	vang	0
fee61361-bad6-4261-9696-09b6fcdc5209	0151b50f-11df-493c-a959-2b143ffec470	hoc_bu	10
fee61361-bad6-4261-9696-09b6fcdc5209	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	co_mat	10
fee61361-bad6-4261-9696-09b6fcdc5209	94c6acd3-4c22-405e-a976-d9cd63a72345	co_mat	6
fee61361-bad6-4261-9696-09b6fcdc5209	04c0644a-6490-4551-9b84-2b3e606b2f11	vang	0
fee61361-bad6-4261-9696-09b6fcdc5209	7c7fc404-3d84-4d6b-8972-3926976216f4	vang	0
fee61361-bad6-4261-9696-09b6fcdc5209	8a601d2f-4322-4983-9e47-f964e910e10f	co_mat	10
fe2e618b-207f-4e12-85a5-869a5a678c89	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	5
fe2e618b-207f-4e12-85a5-869a5a678c89	68f0e7bf-636d-460a-a1e9-c2c0f10c86d1	hoc_bu	5
fe2e618b-207f-4e12-85a5-869a5a678c89	d7a4616d-10a2-4dc3-a6a9-78c86c71e5f8	hoc_bu	5
fe2e618b-207f-4e12-85a5-869a5a678c89	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	co_mat	8
fe2e618b-207f-4e12-85a5-869a5a678c89	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	vang	0
fe2e618b-207f-4e12-85a5-869a5a678c89	abac3dcb-3f90-48e2-b36f-e80f34c47d92	hoc_bu	5
fe2e618b-207f-4e12-85a5-869a5a678c89	c896114e-f0e2-4b63-af81-07e50276d6fd	hoc_bu	5
fe2e618b-207f-4e12-85a5-869a5a678c89	47286437-2fcd-451e-b01f-c19e8cbbcbef	co_mat	2
fe2e618b-207f-4e12-85a5-869a5a678c89	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	co_mat	5
fe2e618b-207f-4e12-85a5-869a5a678c89	47de7f3c-c311-44a9-b8e9-d535f63909c5	co_mat	2
fe2e618b-207f-4e12-85a5-869a5a678c89	55328067-088a-4f1b-ae66-507f6d56aa15	co_mat	2
fe2e618b-207f-4e12-85a5-869a5a678c89	e1d9c6da-9520-433a-9485-201be17d736d	vang	0
fe2e618b-207f-4e12-85a5-869a5a678c89	4d36c077-ad54-4671-8a64-3c7d297faca3	co_mat	4
fe2e618b-207f-4e12-85a5-869a5a678c89	97016524-445e-48cb-ad25-91aae2e0369b	hoc_bu	5
fe2e618b-207f-4e12-85a5-869a5a678c89	9649475f-b209-4855-8e4f-f991a3ccce82	co_mat	2
fe2e618b-207f-4e12-85a5-869a5a678c89	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	co_mat	4
fe2e618b-207f-4e12-85a5-869a5a678c89	60cdb4a9-3025-44d3-8086-b14612242c76	co_mat	6
fe2e618b-207f-4e12-85a5-869a5a678c89	e5d63dee-19fe-4ae1-a741-08a03111eb1d	co_mat	7
fe2e618b-207f-4e12-85a5-869a5a678c89	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	5
fe2e618b-207f-4e12-85a5-869a5a678c89	d96f705a-caed-4aed-8c5a-2f729630dd64	co_mat	3
fe2e618b-207f-4e12-85a5-869a5a678c89	10e6b491-c559-4087-bbc6-d6520f6d21f5	co_mat	4
fe2e618b-207f-4e12-85a5-869a5a678c89	64a37c23-5108-4025-bcb3-e7ea6b1fe979	co_mat	3
fe2e618b-207f-4e12-85a5-869a5a678c89	e6af6149-70f4-4687-8390-4f3886b7a42e	co_mat	1
fe2e618b-207f-4e12-85a5-869a5a678c89	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	co_mat	1
fe2e618b-207f-4e12-85a5-869a5a678c89	b218ff29-82e7-4386-8eae-0dd472b1894b	co_mat	2
fe2e618b-207f-4e12-85a5-869a5a678c89	3e45fe76-7884-4e40-8f60-d54cb47ea033	co_mat	11
fe2e618b-207f-4e12-85a5-869a5a678c89	da8f3b69-bcb6-46d7-b324-e5f61183d270	co_mat	5
fe2e618b-207f-4e12-85a5-869a5a678c89	0377768d-cc45-49f5-a96d-8d170c3bf41f	vang	0
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	552de5e9-d599-4a8e-ace8-d80518dfe059	co_mat	6
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	1555600c-8358-42eb-b9f3-611dbeab3641	co_mat	6
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	8605edcb-76d1-4391-9739-fcbf0bc389a1	hoc_bu	10
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	a6071b67-2130-479d-9960-be9b713e379d	co_mat	3
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	ff386fd8-15b5-42a0-b103-536c60684008	co_mat	6
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	9649475f-b209-4855-8e4f-f991a3ccce82	co_mat	3
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	f85931d6-9ede-45a1-acde-ba4789c6e853	co_mat	6
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	hoc_bu	10
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	6
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	78e11889-7937-481d-8234-98df5fc25ddc	co_mat	5
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	0151b50f-11df-493c-a959-2b143ffec470	hoc_bu	10
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	hoc_bu	10
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	co_mat	3
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	co_mat	8
a1c02c20-6317-4d61-ba6b-656c1156c884	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	2
a1c02c20-6317-4d61-ba6b-656c1156c884	bc4166c1-2a49-43d1-9769-f752dcc2d91c	co_mat	7
a1c02c20-6317-4d61-ba6b-656c1156c884	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	co_mat	2
a1c02c20-6317-4d61-ba6b-656c1156c884	47286437-2fcd-451e-b01f-c19e8cbbcbef	vang	0
a1c02c20-6317-4d61-ba6b-656c1156c884	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	8
a1c02c20-6317-4d61-ba6b-656c1156c884	a6071b67-2130-479d-9960-be9b713e379d	co_mat	5
a1c02c20-6317-4d61-ba6b-656c1156c884	892394ca-8163-4263-9b19-957de160996b	co_mat	8
a1c02c20-6317-4d61-ba6b-656c1156c884	e3906889-be7a-483c-a548-52c80afb47e7	vang	0
a1c02c20-6317-4d61-ba6b-656c1156c884	94c6acd3-4c22-405e-a976-d9cd63a72345	co_mat	4
a1c02c20-6317-4d61-ba6b-656c1156c884	04c0644a-6490-4551-9b84-2b3e606b2f11	co_mat	5
a1c02c20-6317-4d61-ba6b-656c1156c884	7c7fc404-3d84-4d6b-8972-3926976216f4	co_mat	5
a1c02c20-6317-4d61-ba6b-656c1156c884	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	vang	0
a1c02c20-6317-4d61-ba6b-656c1156c884	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	5
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	co_mat	7
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	co_mat	10
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	47de7f3c-c311-44a9-b8e9-d535f63909c5	co_mat	3
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	a5df955d-2040-41d3-a691-2a9526050dba	vang	0
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	55328067-088a-4f1b-ae66-507f6d56aa15	vang	0
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	e1d9c6da-9520-433a-9485-201be17d736d	co_mat	3
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	4d36c077-ad54-4671-8a64-3c7d297faca3	co_mat	6
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	e5d63dee-19fe-4ae1-a741-08a03111eb1d	co_mat	8
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	d96f705a-caed-4aed-8c5a-2f729630dd64	co_mat	6
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	10e6b491-c559-4087-bbc6-d6520f6d21f5	co_mat	6
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	64a37c23-5108-4025-bcb3-e7ea6b1fe979	co_mat	6
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	e6af6149-70f4-4687-8390-4f3886b7a42e	co_mat	3
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	b218ff29-82e7-4386-8eae-0dd472b1894b	co_mat	7
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	3e45fe76-7884-4e40-8f60-d54cb47ea033	co_mat	7
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	da8f3b69-bcb6-46d7-b324-e5f61183d270	co_mat	6
45a23d78-e0da-44ae-9568-b0865bd1bc0f	bc4166c1-2a49-43d1-9769-f752dcc2d91c	co_mat	8
45a23d78-e0da-44ae-9568-b0865bd1bc0f	552de5e9-d599-4a8e-ace8-d80518dfe059	co_mat	4
45a23d78-e0da-44ae-9568-b0865bd1bc0f	55328067-088a-4f1b-ae66-507f6d56aa15	vang	0
45a23d78-e0da-44ae-9568-b0865bd1bc0f	1555600c-8358-42eb-b9f3-611dbeab3641	co_mat	4
45a23d78-e0da-44ae-9568-b0865bd1bc0f	ff386fd8-15b5-42a0-b103-536c60684008	co_mat	4
45a23d78-e0da-44ae-9568-b0865bd1bc0f	892394ca-8163-4263-9b19-957de160996b	vang	0
45a23d78-e0da-44ae-9568-b0865bd1bc0f	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	co_mat	4
45a23d78-e0da-44ae-9568-b0865bd1bc0f	60cdb4a9-3025-44d3-8086-b14612242c76	co_mat	4
45a23d78-e0da-44ae-9568-b0865bd1bc0f	f85931d6-9ede-45a1-acde-ba4789c6e853	co_mat	4
45a23d78-e0da-44ae-9568-b0865bd1bc0f	78e11889-7937-481d-8234-98df5fc25ddc	co_mat	4
45a23d78-e0da-44ae-9568-b0865bd1bc0f	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	co_mat	5
45a23d78-e0da-44ae-9568-b0865bd1bc0f	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	5
45a23d78-e0da-44ae-9568-b0865bd1bc0f	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	co_mat	4
e06f0275-a6f0-42f0-9f1d-963713a5120a	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	3
e06f0275-a6f0-42f0-9f1d-963713a5120a	68f0e7bf-636d-460a-a1e9-c2c0f10c86d1	co_mat	5
e06f0275-a6f0-42f0-9f1d-963713a5120a	d7a4616d-10a2-4dc3-a6a9-78c86c71e5f8	vang	0
e06f0275-a6f0-42f0-9f1d-963713a5120a	abac3dcb-3f90-48e2-b36f-e80f34c47d92	co_mat	5
e06f0275-a6f0-42f0-9f1d-963713a5120a	c896114e-f0e2-4b63-af81-07e50276d6fd	co_mat	5
e06f0275-a6f0-42f0-9f1d-963713a5120a	8605edcb-76d1-4391-9739-fcbf0bc389a1	co_mat	8
e06f0275-a6f0-42f0-9f1d-963713a5120a	97016524-445e-48cb-ad25-91aae2e0369b	co_mat	5
e06f0275-a6f0-42f0-9f1d-963713a5120a	3d45bd85-eba9-426b-93b3-37f7de37970f	co_mat	8
e06f0275-a6f0-42f0-9f1d-963713a5120a	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	co_mat	8
e06f0275-a6f0-42f0-9f1d-963713a5120a	bc073e92-1a93-41f4-9698-d042e73f9aa9	co_mat	5
e06f0275-a6f0-42f0-9f1d-963713a5120a	0151b50f-11df-493c-a959-2b143ffec470	vang	0
e06f0275-a6f0-42f0-9f1d-963713a5120a	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	co_mat	8
e06f0275-a6f0-42f0-9f1d-963713a5120a	8a601d2f-4322-4983-9e47-f964e910e10f	co_mat	8
d5358c27-17ab-4613-937d-1e122c6dd555	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	co_mat	8
d5358c27-17ab-4613-937d-1e122c6dd555	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	8
d5358c27-17ab-4613-937d-1e122c6dd555	8605edcb-76d1-4391-9739-fcbf0bc389a1	co_mat	10
d5358c27-17ab-4613-937d-1e122c6dd555	cc1d85c9-4423-4157-9953-74dfc16e5b00	co_mat	10
d5358c27-17ab-4613-937d-1e122c6dd555	46e4a30d-fdb2-46de-ae44-f50c91b96020	co_mat	6
d5358c27-17ab-4613-937d-1e122c6dd555	3d45bd85-eba9-426b-93b3-37f7de37970f	co_mat	8
d5358c27-17ab-4613-937d-1e122c6dd555	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	co_mat	6
d5358c27-17ab-4613-937d-1e122c6dd555	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	co_mat	10
d5358c27-17ab-4613-937d-1e122c6dd555	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	vang	0
d5358c27-17ab-4613-937d-1e122c6dd555	0151b50f-11df-493c-a959-2b143ffec470	vang	0
d5358c27-17ab-4613-937d-1e122c6dd555	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	co_mat	10
d5358c27-17ab-4613-937d-1e122c6dd555	8a601d2f-4322-4983-9e47-f964e910e10f	co_mat	6
152f232d-a41b-49ba-906c-68151d28d4a1	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	co_mat	10
152f232d-a41b-49ba-906c-68151d28d4a1	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	10
152f232d-a41b-49ba-906c-68151d28d4a1	8605edcb-76d1-4391-9739-fcbf0bc389a1	co_mat	6
152f232d-a41b-49ba-906c-68151d28d4a1	cc1d85c9-4423-4157-9953-74dfc16e5b00	co_mat	6
152f232d-a41b-49ba-906c-68151d28d4a1	46e4a30d-fdb2-46de-ae44-f50c91b96020	co_mat	8
152f232d-a41b-49ba-906c-68151d28d4a1	3d45bd85-eba9-426b-93b3-37f7de37970f	co_mat	8
152f232d-a41b-49ba-906c-68151d28d4a1	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	co_mat	10
152f232d-a41b-49ba-906c-68151d28d4a1	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	co_mat	6
152f232d-a41b-49ba-906c-68151d28d4a1	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	co_mat	10
152f232d-a41b-49ba-906c-68151d28d4a1	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	co_mat	6
152f232d-a41b-49ba-906c-68151d28d4a1	94c6acd3-4c22-405e-a976-d9cd63a72345	vang	0
152f232d-a41b-49ba-906c-68151d28d4a1	04c0644a-6490-4551-9b84-2b3e606b2f11	vang	0
152f232d-a41b-49ba-906c-68151d28d4a1	7c7fc404-3d84-4d6b-8972-3926976216f4	vang	0
152f232d-a41b-49ba-906c-68151d28d4a1	8a601d2f-4322-4983-9e47-f964e910e10f	co_mat	8
78ddc48c-fcce-40b2-a990-7881b7cebe73	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	3
78ddc48c-fcce-40b2-a990-7881b7cebe73	d7a4616d-10a2-4dc3-a6a9-78c86c71e5f8	hoc_bu	3
78ddc48c-fcce-40b2-a990-7881b7cebe73	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	co_mat	6
78ddc48c-fcce-40b2-a990-7881b7cebe73	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	co_mat	2
78ddc48c-fcce-40b2-a990-7881b7cebe73	47286437-2fcd-451e-b01f-c19e8cbbcbef	co_mat	5
78ddc48c-fcce-40b2-a990-7881b7cebe73	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	co_mat	9
78ddc48c-fcce-40b2-a990-7881b7cebe73	47de7f3c-c311-44a9-b8e9-d535f63909c5	co_mat	5
78ddc48c-fcce-40b2-a990-7881b7cebe73	55328067-088a-4f1b-ae66-507f6d56aa15	co_mat	6
78ddc48c-fcce-40b2-a990-7881b7cebe73	8605edcb-76d1-4391-9739-fcbf0bc389a1	hoc_bu	0
78ddc48c-fcce-40b2-a990-7881b7cebe73	e1d9c6da-9520-433a-9485-201be17d736d	co_mat	2
78ddc48c-fcce-40b2-a990-7881b7cebe73	4d36c077-ad54-4671-8a64-3c7d297faca3	co_mat	5
78ddc48c-fcce-40b2-a990-7881b7cebe73	9649475f-b209-4855-8e4f-f991a3ccce82	co_mat	6
78ddc48c-fcce-40b2-a990-7881b7cebe73	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	co_mat	3
78ddc48c-fcce-40b2-a990-7881b7cebe73	60cdb4a9-3025-44d3-8086-b14612242c76	co_mat	1
78ddc48c-fcce-40b2-a990-7881b7cebe73	e5d63dee-19fe-4ae1-a741-08a03111eb1d	co_mat	2
78ddc48c-fcce-40b2-a990-7881b7cebe73	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	5
78ddc48c-fcce-40b2-a990-7881b7cebe73	d96f705a-caed-4aed-8c5a-2f729630dd64	co_mat	6
78ddc48c-fcce-40b2-a990-7881b7cebe73	10e6b491-c559-4087-bbc6-d6520f6d21f5	vang	0
78ddc48c-fcce-40b2-a990-7881b7cebe73	64a37c23-5108-4025-bcb3-e7ea6b1fe979	vang	0
78ddc48c-fcce-40b2-a990-7881b7cebe73	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	hoc_bu	0
78ddc48c-fcce-40b2-a990-7881b7cebe73	94c6acd3-4c22-405e-a976-d9cd63a72345	hoc_bu	5
78ddc48c-fcce-40b2-a990-7881b7cebe73	e6af6149-70f4-4687-8390-4f3886b7a42e	co_mat	3
78ddc48c-fcce-40b2-a990-7881b7cebe73	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	co_mat	3
78ddc48c-fcce-40b2-a990-7881b7cebe73	b218ff29-82e7-4386-8eae-0dd472b1894b	co_mat	6
78ddc48c-fcce-40b2-a990-7881b7cebe73	3e45fe76-7884-4e40-8f60-d54cb47ea033	co_mat	5
78ddc48c-fcce-40b2-a990-7881b7cebe73	da8f3b69-bcb6-46d7-b324-e5f61183d270	co_mat	4
78ddc48c-fcce-40b2-a990-7881b7cebe73	0377768d-cc45-49f5-a96d-8d170c3bf41f	vang	0
6b2d9128-7127-45f0-8f82-081aa3ff0759	552de5e9-d599-4a8e-ace8-d80518dfe059	co_mat	8
6b2d9128-7127-45f0-8f82-081aa3ff0759	1555600c-8358-42eb-b9f3-611dbeab3641	co_mat	8
6b2d9128-7127-45f0-8f82-081aa3ff0759	a6071b67-2130-479d-9960-be9b713e379d	co_mat	5
6b2d9128-7127-45f0-8f82-081aa3ff0759	ff386fd8-15b5-42a0-b103-536c60684008	co_mat	8
6b2d9128-7127-45f0-8f82-081aa3ff0759	9649475f-b209-4855-8e4f-f991a3ccce82	co_mat	3
6b2d9128-7127-45f0-8f82-081aa3ff0759	f85931d6-9ede-45a1-acde-ba4789c6e853	co_mat	8
6b2d9128-7127-45f0-8f82-081aa3ff0759	3d45bd85-eba9-426b-93b3-37f7de37970f	hoc_bu	10
6b2d9128-7127-45f0-8f82-081aa3ff0759	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	8
6b2d9128-7127-45f0-8f82-081aa3ff0759	78e11889-7937-481d-8234-98df5fc25ddc	vang	0
6b2d9128-7127-45f0-8f82-081aa3ff0759	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	hoc_bu	10
6b2d9128-7127-45f0-8f82-081aa3ff0759	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	co_mat	10
6b2d9128-7127-45f0-8f82-081aa3ff0759	8a601d2f-4322-4983-9e47-f964e910e10f	hoc_bu	10
6b2d9128-7127-45f0-8f82-081aa3ff0759	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	co_mat	8
5d355ba0-130a-4159-8ab3-2e1464e17e50	09426ac0-e7af-47bc-a029-195fcee72b46	vang	0
5d355ba0-130a-4159-8ab3-2e1464e17e50	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	vang	0
5d355ba0-130a-4159-8ab3-2e1464e17e50	6125884c-53f0-45ee-a303-3d03bc111254	vang	0
5d355ba0-130a-4159-8ab3-2e1464e17e50	98deb901-bd60-4e1a-94c1-0ab944440ecb	vang	0
5d355ba0-130a-4159-8ab3-2e1464e17e50	1b364415-27c0-4528-b772-6f9331702874	vang	0
5d355ba0-130a-4159-8ab3-2e1464e17e50	9c5e27df-2361-46d3-9551-92dc6109c2f5	vang	0
5d355ba0-130a-4159-8ab3-2e1464e17e50	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	vang	0
5d355ba0-130a-4159-8ab3-2e1464e17e50	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	vang	0
f2baa976-58d4-4609-9331-5947c40c4df7	a6071b67-2130-479d-9960-be9b713e379d	vang	0
81a08445-8690-4ba5-9fc5-2331ede97bb5	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	vang	0
f2baa976-58d4-4609-9331-5947c40c4df7	78e11889-7937-481d-8234-98df5fc25ddc	vang	0
804fbd08-2178-4c1a-9c0a-293b1ca0462a	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	hoc_bu	8
804fbd08-2178-4c1a-9c0a-293b1ca0462a	0151b50f-11df-493c-a959-2b143ffec470	hoc_bu	8
f2baa976-58d4-4609-9331-5947c40c4df7	f85931d6-9ede-45a1-acde-ba4789c6e853	co_mat	4
f2baa976-58d4-4609-9331-5947c40c4df7	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	4
804fbd08-2178-4c1a-9c0a-293b1ca0462a	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	hoc_bu	0
f2baa976-58d4-4609-9331-5947c40c4df7	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	co_mat	5
f2baa976-58d4-4609-9331-5947c40c4df7	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	co_mat	4
f2baa976-58d4-4609-9331-5947c40c4df7	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	hoc_bu	10
f2baa976-58d4-4609-9331-5947c40c4df7	9649475f-b209-4855-8e4f-f991a3ccce82	co_mat	3
f2baa976-58d4-4609-9331-5947c40c4df7	ff386fd8-15b5-42a0-b103-536c60684008	co_mat	4
f2baa976-58d4-4609-9331-5947c40c4df7	552de5e9-d599-4a8e-ace8-d80518dfe059	co_mat	4
f2baa976-58d4-4609-9331-5947c40c4df7	1555600c-8358-42eb-b9f3-611dbeab3641	co_mat	4
c1bd29b8-3283-4974-804c-48118046b64f	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	co_mat	10
804fbd08-2178-4c1a-9c0a-293b1ca0462a	04c0644a-6490-4551-9b84-2b3e606b2f11	vang	0
804fbd08-2178-4c1a-9c0a-293b1ca0462a	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	co_mat	0
804fbd08-2178-4c1a-9c0a-293b1ca0462a	a6071b67-2130-479d-9960-be9b713e379d	co_mat	4
896a645c-e7c4-4117-940f-d49b23298936	3d45bd85-eba9-426b-93b3-37f7de37970f	co_mat	8
804fbd08-2178-4c1a-9c0a-293b1ca0462a	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	3
804fbd08-2178-4c1a-9c0a-293b1ca0462a	7c7fc404-3d84-4d6b-8972-3926976216f4	co_mat	8
804fbd08-2178-4c1a-9c0a-293b1ca0462a	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	co_mat	2
804fbd08-2178-4c1a-9c0a-293b1ca0462a	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	3
7e26a780-214a-4c13-8a28-7f897936eec2	d96f705a-caed-4aed-8c5a-2f729630dd64	vang	0
997fe90e-6a07-4050-a18e-2c2e251643cd	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	co_mat	10
804fbd08-2178-4c1a-9c0a-293b1ca0462a	bc4166c1-2a49-43d1-9769-f752dcc2d91c	co_mat	14
804fbd08-2178-4c1a-9c0a-293b1ca0462a	47286437-2fcd-451e-b01f-c19e8cbbcbef	co_mat	8
804fbd08-2178-4c1a-9c0a-293b1ca0462a	892394ca-8163-4263-9b19-957de160996b	co_mat	8
804fbd08-2178-4c1a-9c0a-293b1ca0462a	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	5
804fbd08-2178-4c1a-9c0a-293b1ca0462a	94c6acd3-4c22-405e-a976-d9cd63a72345	co_mat	5
804fbd08-2178-4c1a-9c0a-293b1ca0462a	33a3cfe1-6ebb-46fb-b851-4282d579a315	co_mat	8
896a645c-e7c4-4117-940f-d49b23298936	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	vang	0
896a645c-e7c4-4117-940f-d49b23298936	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	vang	0
896a645c-e7c4-4117-940f-d49b23298936	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	vang	0
896a645c-e7c4-4117-940f-d49b23298936	8605edcb-76d1-4391-9739-fcbf0bc389a1	vang	0
896a645c-e7c4-4117-940f-d49b23298936	33a3cfe1-6ebb-46fb-b851-4282d579a315	vang	0
896a645c-e7c4-4117-940f-d49b23298936	9706bbdf-ef70-4ea9-950c-f8062c4ac033	hoc_bu	8
896a645c-e7c4-4117-940f-d49b23298936	46e4a30d-fdb2-46de-ae44-f50c91b96020	co_mat	10
896a645c-e7c4-4117-940f-d49b23298936	7c7fc404-3d84-4d6b-8972-3926976216f4	co_mat	8
896a645c-e7c4-4117-940f-d49b23298936	04c0644a-6490-4551-9b84-2b3e606b2f11	co_mat	8
896a645c-e7c4-4117-940f-d49b23298936	94c6acd3-4c22-405e-a976-d9cd63a72345	co_mat	7
896a645c-e7c4-4117-940f-d49b23298936	cc1d85c9-4423-4157-9953-74dfc16e5b00	co_mat	6
896a645c-e7c4-4117-940f-d49b23298936	8a601d2f-4322-4983-9e47-f964e910e10f	co_mat	10
896a645c-e7c4-4117-940f-d49b23298936	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	co_mat	8
7e26a780-214a-4c13-8a28-7f897936eec2	10e6b491-c559-4087-bbc6-d6520f6d21f5	vang	0
896a645c-e7c4-4117-940f-d49b23298936	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	co_mat	10
7e26a780-214a-4c13-8a28-7f897936eec2	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	vang	0
7e26a780-214a-4c13-8a28-7f897936eec2	e5d63dee-19fe-4ae1-a741-08a03111eb1d	vang	0
7e26a780-214a-4c13-8a28-7f897936eec2	e1d9c6da-9520-433a-9485-201be17d736d	vang	0
7e26a780-214a-4c13-8a28-7f897936eec2	eaff414d-ac8c-44a0-9ed3-483992927fb9	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	47286437-2fcd-451e-b01f-c19e8cbbcbef	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	47de7f3c-c311-44a9-b8e9-d535f63909c5	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	55328067-088a-4f1b-ae66-507f6d56aa15	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	4d36c077-ad54-4671-8a64-3c7d297faca3	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	9649475f-b209-4855-8e4f-f991a3ccce82	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	e3906889-be7a-483c-a548-52c80afb47e7	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	64a37c23-5108-4025-bcb3-e7ea6b1fe979	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	e6af6149-70f4-4687-8390-4f3886b7a42e	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	b218ff29-82e7-4386-8eae-0dd472b1894b	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	3e45fe76-7884-4e40-8f60-d54cb47ea033	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	da8f3b69-bcb6-46d7-b324-e5f61183d270	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	0377768d-cc45-49f5-a96d-8d170c3bf41f	co_mat	5
62dbfa7c-dc48-49a3-b20b-1fee55d37758	94c6acd3-4c22-405e-a976-d9cd63a72345	co_mat	3
804fbd08-2178-4c1a-9c0a-293b1ca0462a	9706bbdf-ef70-4ea9-950c-f8062c4ac033	hoc_bu	5
7e26a780-214a-4c13-8a28-7f897936eec2	60cdb4a9-3025-44d3-8086-b14612242c76	co_mat	5
7e26a780-214a-4c13-8a28-7f897936eec2	97016524-445e-48cb-ad25-91aae2e0369b	hoc_bu	5
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	a6071b67-2130-479d-9960-be9b713e379d	vang	0
8779134c-3ec1-43b0-9894-355f8396c452	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	hoc_bu	0
8779134c-3ec1-43b0-9894-355f8396c452	a6071b67-2130-479d-9960-be9b713e379d	hoc_bu	0
fe2e618b-207f-4e12-85a5-869a5a678c89	a6071b67-2130-479d-9960-be9b713e379d	hoc_bu	0
eea2018b-766f-4172-aefc-f89454e11876	bc4166c1-2a49-43d1-9769-f752dcc2d91c	hoc_bu	5
8ac83685-f5d9-4b1f-8dd4-d7bc387ad24f	7dd34d24-cee2-4506-98f3-90bc27e293a9	hoc_bu	0
92b3cab2-5ac5-48d8-a4a8-9b189028353a	8605edcb-76d1-4391-9739-fcbf0bc389a1	hoc_bu	0
92b3cab2-5ac5-48d8-a4a8-9b189028353a	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	hoc_bu	0
92b3cab2-5ac5-48d8-a4a8-9b189028353a	0151b50f-11df-493c-a959-2b143ffec470	hoc_bu	0
\.


--
-- Data for Name: ghi_danh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ghi_danh" ("id", "hoc_sinh_id", "lop_id", "ngay_vao", "trang_thai", "tao_luc", "don_gia_rieng") FROM stdin;
1395b60d-0614-4015-91b0-e40f32cfe60f	09426ac0-e7af-47bc-a029-195fcee72b46	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-01	dang_hoc	2026-11-17 13:23:40.619385+00	\N
f8090b4f-941d-4dc8-bafd-a8efb7ea4d91	2a71aebf-2868-4496-8c0d-26a9c5fdac6d	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-01	dang_hoc	2026-11-17 13:24:43.072064+00	\N
91a3c799-9547-4448-a484-263c8109e115	6125884c-53f0-45ee-a303-3d03bc111254	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-01	dang_hoc	2026-11-17 13:25:34.500012+00	\N
49ad2997-dcf6-4520-91ab-4afbd876a3a5	98deb901-bd60-4e1a-94c1-0ab944440ecb	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-01	dang_hoc	2026-11-17 13:26:33.273193+00	\N
5182b3d0-c42c-4b7f-95e1-754dff58324c	1b364415-27c0-4528-b772-6f9331702874	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-01	dang_hoc	2026-11-17 13:27:13.282976+00	\N
7a88be29-1a8b-4649-98d3-fe24f578fdc0	9c5e27df-2361-46d3-9551-92dc6109c2f5	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-01	dang_hoc	2026-11-17 13:27:45.537928+00	\N
98255787-6cc6-4cd7-bad4-8424d423f405	b3065572-cd6a-4131-bae6-4f0b9ed4f46f	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-01	dang_hoc	2026-11-17 13:28:20.821969+00	\N
b6513021-3453-42da-984b-2431648e8faf	4d36c077-ad54-4671-8a64-3c7d297faca3	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:44:12.041399+00	\N
da021082-d4a2-4d82-9601-f63a7616fa73	d96f705a-caed-4aed-8c5a-2f729630dd64	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:44:44.198055+00	\N
53adcd68-4f38-49d7-ba04-55989cc45389	10e6b491-c559-4087-bbc6-d6520f6d21f5	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:45:09.048392+00	\N
f1f33b0f-5f52-4d75-94d3-a09e0a3e19da	64a37c23-5108-4025-bcb3-e7ea6b1fe979	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:45:26.515177+00	\N
41187abb-5819-4f53-a718-1a1bcaa091aa	b218ff29-82e7-4386-8eae-0dd472b1894b	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:46:09.638888+00	\N
4defbe4f-3348-480d-b431-0b4212c26dd8	da8f3b69-bcb6-46d7-b324-e5f61183d270	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:46:49.705307+00	\N
701c7044-c417-424d-96e5-417a843bbe3e	8605edcb-76d1-4391-9739-fcbf0bc389a1	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:03:52.001641+00	\N
9b1a9d34-50ef-4d35-b238-04c666f1a284	97016524-445e-48cb-ad25-91aae2e0369b	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:03:53.110352+00	\N
26ad0d3a-ccc4-4ac8-81e5-0cf0bd3a083b	3d45bd85-eba9-426b-93b3-37f7de37970f	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:03:54.45887+00	\N
2d00fa7c-647a-481c-a8b9-f4dd22fa0068	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:04:22.507485+00	\N
e64ca27f-1b21-4e23-8d37-95e41081d53d	bc073e92-1a93-41f4-9698-d042e73f9aa9	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:04:22.9052+00	\N
daab69d8-e874-4e34-ba1e-76e1692e7a87	0151b50f-11df-493c-a959-2b143ffec470	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:04:27.433992+00	\N
6563b129-34c2-48f5-8f43-e62b8dc3f978	8a601d2f-4322-4983-9e47-f964e910e10f	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:04:27.873171+00	\N
a163edb3-ff76-498f-ae1c-8614a952efc0	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:04:29.160242+00	\N
145d3137-cc13-4e08-ba1d-e709df973b7d	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-20 12:04:29.454866+00	\N
dd0bf11d-57b1-4534-b976-471416ecfdc3	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-20 12:05:47.029677+00	\N
a324e024-84e5-453a-b973-bf76ad1fc2f1	9706bbdf-ef70-4ea9-950c-f8062c4ac033	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-25	dang_hoc	2026-11-25 14:43:50.028096+00	\N
c7dd8025-745e-46ac-bb8c-3280151def93	9649475f-b209-4855-8e4f-f991a3ccce82	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:50.629082+00	\N
5d1eff36-b668-4af0-a442-45560f020e54	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:51.717019+00	\N
9be7f12a-553f-4a6f-b06a-b5121bf0ab36	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	76d237de-b44c-46bf-ba95-e3233ccf528c	2026-11-01	dang_hoc	2026-11-20 12:05:51.968385+00	\N
93cd43c9-acf4-4446-9223-8d617b228b45	cc1d85c9-4423-4157-9953-74dfc16e5b00	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:52.694682+00	\N
f94310b2-34d8-4f3b-8f4f-05b3663b07be	46e4a30d-fdb2-46de-ae44-f50c91b96020	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:53.431667+00	\N
a4573920-7f7a-4f06-a51f-5879bb730252	e1d9c6da-9520-433a-9485-201be17d736d	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:43:54.430225+00	\N
b8d94313-8db5-4339-a4af-428416a13a4f	e5d63dee-19fe-4ae1-a741-08a03111eb1d	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:44:30.250637+00	\N
1843bb54-1b09-4239-ae4e-adcca3e186cc	e6af6149-70f4-4687-8390-4f3886b7a42e	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:45:50.826526+00	\N
b7c0f012-c367-4ff7-adb5-af322b6007b1	3e45fe76-7884-4e40-8f60-d54cb47ea033	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:46:22.947966+00	\N
4daa31af-36e2-4a93-a614-980f6370f858	e3906889-be7a-483c-a548-52c80afb47e7	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:44:45.767249+00	\N
d4bd78d8-daed-44eb-aa0c-c34aed57ccb3	94c6acd3-4c22-405e-a976-d9cd63a72345	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:45:22.118529+00	\N
78c1bc71-3d0a-4781-b2f9-4b8e20dac77f	04c0644a-6490-4551-9b84-2b3e606b2f11	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:46:05.536913+00	\N
4f55b444-8186-47ca-9e28-e38e9d7189ea	7c7fc404-3d84-4d6b-8972-3926976216f4	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:46:39.986746+00	\N
de59adc7-ee12-4059-9cc2-4a30ac7d3bc7	0377768d-cc45-49f5-a96d-8d170c3bf41f	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:47:38.903246+00	\N
f6956557-840e-4339-9bf5-14fd32cd3c36	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:42:37.088899+00	\N
82d08710-b82a-4872-a39e-de0ca9b75b56	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:42:53.079265+00	\N
7f4ef058-7e6c-4fee-a80e-02e97d103fc1	47de7f3c-c311-44a9-b8e9-d535f63909c5	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:43:07.199964+00	\N
70f9abe8-f31a-4298-9a4c-cb5436e687f0	a5df955d-2040-41d3-a691-2a9526050dba	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:43:24.654764+00	\N
e743300f-c53e-4ed4-bd1c-6d09477b760a	7dd34d24-cee2-4506-98f3-90bc27e293a9	4df112a4-8db9-4c78-a747-5ab93c497a19	2026-11-01	dang_hoc	2026-11-19 13:00:43.008932+00	\N
9f4407ca-1e6a-480d-92f5-f15b566ee7d6	552de5e9-d599-4a8e-ace8-d80518dfe059	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:06:01.175745+00	\N
7c837391-44ce-4851-8fb2-3a0a26d3a0cb	55328067-088a-4f1b-ae66-507f6d56aa15	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:07:09.119992+00	\N
76dc6cc0-622f-4171-861c-015c3c0883a0	1555600c-8358-42eb-b9f3-611dbeab3641	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:07:23.152836+00	\N
d3e29832-8d7b-472b-bcbe-75f74c30b63d	ff386fd8-15b5-42a0-b103-536c60684008	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:07:37.094095+00	\N
fbdd439e-100f-481d-bcd4-98550b59607a	892394ca-8163-4263-9b19-957de160996b	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:08:08.684126+00	\N
9a1acda1-0392-412c-8d1c-9e4621460f38	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:08:26.674575+00	\N
9312aabd-571f-4f75-af16-56cd628b733a	f85931d6-9ede-45a1-acde-ba4789c6e853	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:10:15.639752+00	\N
fddfef87-531e-4924-ab63-bd0bd7b69564	78e11889-7937-481d-8234-98df5fc25ddc	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:10:55.593686+00	\N
620d2f4a-a0f6-4c4f-8fce-151760d806cc	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-23	dang_hoc	2026-11-23 10:32:40.740025+00	\N
b4901f2f-7705-4f3e-a748-69d616b8ea68	9706bbdf-ef70-4ea9-950c-f8062c4ac033	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-25	dang_hoc	2026-11-25 14:44:02.868044+00	\N
f76e7452-dbf0-4af9-832e-beaad5b64da4	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:13:57.036645+00	\N
bf4bc70b-32b9-4fa4-b8cc-5aa7965b0613	68f0e7bf-636d-460a-a1e9-c2c0f10c86d1	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:03:41.012923+00	\N
5fa6c70b-6777-423c-be07-272279b97a6d	d7a4616d-10a2-4dc3-a6a9-78c86c71e5f8	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:03:46.314453+00	\N
5fbcbfe7-a999-49cf-b672-d463ebb6ba4b	abac3dcb-3f90-48e2-b36f-e80f34c47d92	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:03:51.531242+00	\N
70843b1a-1e37-405c-80b8-84577ff1e261	c896114e-f0e2-4b63-af81-07e50276d6fd	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:03:51.800241+00	\N
e9d48cc8-a9cc-4e08-95c4-997a6f236152	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:54.034015+00	\N
1eda9c94-3519-44c7-bee1-ce0d06cbbca7	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	bafc8fee-b143-40b2-a06b-ae9a461c8e5a	2026-11-01	dang_hoc	2026-11-17 13:29:26.274078+00	\N
f1d2b40e-2548-4d62-9c4f-d2aded38df6d	eaff414d-ac8c-44a0-9ed3-483992927fb9	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:39:46.828145+00	\N
f7d48d95-c5d8-4c5c-aaee-a7cf8c243e88	bc4166c1-2a49-43d1-9769-f752dcc2d91c	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:40:26.742895+00	\N
520b24f7-d1dd-4249-a75a-6e6dc99fd010	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:41:04.952525+00	\N
63b63cea-d260-4894-a0a0-1d66662a0b1c	47286437-2fcd-451e-b01f-c19e8cbbcbef	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:41:46.019686+00	\N
d33df2dc-7942-4e99-afe9-7828efb41e8f	33a3cfe1-6ebb-46fb-b851-4282d579a315	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:42:22.881958+00	\N
0423fb4c-fec2-4274-a750-b08f9a46113c	a6071b67-2130-479d-9960-be9b713e379d	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:43:11.843234+00	\N
d2481ce2-2449-4ae1-a1e5-fd2e780c0472	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:47:01.711591+00	\N
ef3913c6-33d1-4c64-86dd-34b7e2545dc6	eaff414d-ac8c-44a0-9ed3-483992927fb9	929bc9ea-dc44-4f17-8473-edf75de7d63b	2026-11-01	dang_hoc	2026-11-20 12:03:29.102106+00	\N
ca4f4c37-87be-4ca9-a3e8-fc27c8fbc0d3	eaff414d-ac8c-44a0-9ed3-483992927fb9	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:55.487179+00	\N
2c1638ec-5df2-4a33-9109-4904f2b73081	bc4166c1-2a49-43d1-9769-f752dcc2d91c	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:05:39.234021+00	\N
ba4f66e6-5a3f-413c-903d-705e0e3e7b6c	2c2939ba-5703-41d5-b941-ea4a2ef4ce7d	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:52.269994+00	\N
364c43a3-ceec-46c3-9715-6c9d80eae8bc	8449f57a-28fa-40e2-b016-52d8fdfb1a1a	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:54.924735+00	\N
b187d208-e596-40b1-8c6b-d4087f35d207	a409e2ce-01c6-49e8-bbdf-5caf4477db1e	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:57.710767+00	\N
fa5e8904-33a7-4972-9c2f-9633e40d6337	47286437-2fcd-451e-b01f-c19e8cbbcbef	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:57.833883+00	\N
0bbc89b4-e7c7-4179-8a11-998f41297ed3	127cf384-4ac0-4a57-8d3e-7f3755cf5e76	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:55.080428+00	\N
710fdfcd-c00d-4fda-b3f6-fb780997d3b3	552de5e9-d599-4a8e-ace8-d80518dfe059	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:49.477942+00	\N
419c6675-b3d1-494a-aed1-e4bb71896841	33a3cfe1-6ebb-46fb-b851-4282d579a315	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:52.53947+00	\N
b59009f0-1f2d-4e73-b693-befad74980e8	33a3cfe1-6ebb-46fb-b851-4282d579a315	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-21 09:04:45.424931+00	\N
657a9963-d335-4028-9568-bc7544b08176	47de7f3c-c311-44a9-b8e9-d535f63909c5	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:55.243029+00	\N
4f28d7d5-3d43-49db-90b9-5b71836f067b	55328067-088a-4f1b-ae66-507f6d56aa15	1d80e3bc-dfb1-4398-b242-bf46211e8e80	2026-11-01	dang_hoc	2026-11-19 12:43:38.416812+00	\N
15a3a9d3-8ff4-47ce-8442-f3f883a3e45b	55328067-088a-4f1b-ae66-507f6d56aa15	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:55.664782+00	\N
ce23a985-da18-4001-97e8-9c781f75a6aa	1555600c-8358-42eb-b9f3-611dbeab3641	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:49.742674+00	\N
21afb315-39c2-4947-9a24-a5ca535af390	e1d9c6da-9520-433a-9485-201be17d736d	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:56.04477+00	\N
6055f5c4-0f2e-43c8-ba18-a77dbaa2c5a9	a6071b67-2130-479d-9960-be9b713e379d	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:50.146783+00	\N
5017951c-d189-4b1e-9f14-a85c9bf95861	cc1d85c9-4423-4157-9953-74dfc16e5b00	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-21 09:05:29.782042+00	\N
614416f4-2027-4664-8b1a-cd447feccfa5	ff386fd8-15b5-42a0-b103-536c60684008	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:50.321896+00	\N
99d46f54-b3cc-4b44-9c50-2c464ef54c9d	8605edcb-76d1-4391-9739-fcbf0bc389a1	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:53.151558+00	\N
3073140c-a23b-4e91-86dc-9a6003c4da72	8605edcb-76d1-4391-9739-fcbf0bc389a1	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-21 09:05:06.825661+00	\N
3dc4166d-87e2-44ed-88ac-8b05a91f6d34	4d36c077-ad54-4671-8a64-3c7d297faca3	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:56.184466+00	\N
71d529f4-1f31-4253-b1fa-6d68a66a3346	58ccd9fc-cb17-4e09-afc1-0989f0636f6f	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:53.273184+00	\N
df8ea158-2237-4940-97fd-163925aabe7a	e561c6d5-6fbc-462a-ab2e-e1423f3b692f	633443ce-1a36-49f5-80c2-24a8eaf5e22e	2026-11-01	dang_hoc	2026-11-19 12:50:38.442405+00	\N
f290d57d-e094-4cee-8100-0fdacba7b711	892394ca-8163-4263-9b19-957de160996b	4e49d265-ef05-4457-8c75-ff435e266182	2026-11-01	dang_hoc	2026-11-18 10:44:09.588667+00	\N
7610a232-60ff-48e6-927b-2a20f40f6e4a	9649475f-b209-4855-8e4f-f991a3ccce82	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:58.678299+00	\N
043c43cd-a71b-473a-a8fe-e7ccc1ac4cf5	242f8971-c4c0-44d1-8f4e-c26d77efd8ef	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:06:00.032158+00	\N
830633d5-59be-49ad-a398-9f29cfb99d06	60cdb4a9-3025-44d3-8086-b14612242c76	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:59.197027+00	\N
d08c7b2f-ae8e-4d70-8956-f968ec76d642	60cdb4a9-3025-44d3-8086-b14612242c76	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:09:53.691685+00	\N
3523de60-88a6-421e-a9cd-7c97b57635fc	46e4a30d-fdb2-46de-ae44-f50c91b96020	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-21 09:05:50.151541+00	\N
53b0afd3-5dda-4f00-a65f-9f5e62201d75	e5d63dee-19fe-4ae1-a741-08a03111eb1d	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:56.306248+00	\N
f09a5157-73ce-4ffe-97b9-362f65c7bd1c	f85931d6-9ede-45a1-acde-ba4789c6e853	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:50.760389+00	\N
68afc0c5-5667-4de6-a3a5-1c78fbc6ec78	3d45bd85-eba9-426b-93b3-37f7de37970f	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:53.593471+00	\N
5272a859-4cee-4d8d-b485-48d2670faef0	3d45bd85-eba9-426b-93b3-37f7de37970f	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-21 09:06:04.928146+00	\N
e4114502-6e1e-4d57-85b9-e7b2fcd61f89	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:53.90189+00	\N
e57a0156-e87c-4ff0-9e53-16db2d37a5c3	5f872515-0a7e-4cd7-8a63-01c8c51d8b04	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-21 09:06:23.941898+00	\N
c90cc9e9-6a9c-4398-8301-feef1e479713	e3906889-be7a-483c-a548-52c80afb47e7	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:51.031292+00	\N
b53c0743-1060-43f8-93e2-26066779608b	e3906889-be7a-483c-a548-52c80afb47e7	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:59.482784+00	\N
b1a3cb2e-dac3-4bbf-80b3-80f49b7860af	d96f705a-caed-4aed-8c5a-2f729630dd64	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:56.436526+00	\N
90482f90-5900-433a-83ec-16521b83952f	78e11889-7937-481d-8234-98df5fc25ddc	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:51.161949+00	\N
e2e1f48b-b971-436d-b753-0e831ccd4061	10e6b491-c559-4087-bbc6-d6520f6d21f5	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:56.682842+00	\N
4e7065aa-8983-40f4-baf8-6d0c1fd5192c	64a37c23-5108-4025-bcb3-e7ea6b1fe979	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:56.942431+00	\N
948e6eed-da6c-457c-ab6d-18e5d4e74fa2	a5ca77b4-627d-4092-ad49-3a8afe6bc16d	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-21 09:06:40.848735+00	\N
b60e8cfe-76b0-4ee5-8b00-14859e6739ae	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:54.157267+00	\N
55381fa8-da90-4780-8eeb-2b49e8b9df06	0151b50f-11df-493c-a959-2b143ffec470	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-20 12:05:49.12364+00	\N
d4ddcaf7-fc42-4015-a113-918656f88cb4	94c6acd3-4c22-405e-a976-d9cd63a72345	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:54.305609+00	\N
d7994df4-c1db-4b87-b61c-4eda8ced68d4	e6af6149-70f4-4687-8390-4f3886b7a42e	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:57.085628+00	\N
678ec754-68c9-4da2-91c3-b2eb8865bad5	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:59.624446+00	\N
34916fe5-638a-4b40-81f3-a038f7614993	b218ff29-82e7-4386-8eae-0dd472b1894b	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:57.22124+00	\N
78b4447a-f8e5-4e47-91ed-7698177fb6d0	04c0644a-6490-4551-9b84-2b3e606b2f11	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:54.67402+00	\N
0acf4e56-450b-42d2-9210-c61bf207c06a	7c7fc404-3d84-4d6b-8972-3926976216f4	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:54.790485+00	\N
419c4f70-5b7f-4f2a-8fbb-a3a5d0fae8a0	3e45fe76-7884-4e40-8f60-d54cb47ea033	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:57.389586+00	\N
3cb1b3ac-4319-49d3-a070-22268ca2c4a9	d2c38a11-b7b8-41da-9cf9-9f5808755c9b	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:13:09.146202+00	\N
60d5c472-86ed-4e58-9977-13c9bc2790a1	da8f3b69-bcb6-46d7-b324-e5f61183d270	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:57.511878+00	\N
8db1dc87-e2cf-4ac0-a5dc-f87b40d2ac08	0377768d-cc45-49f5-a96d-8d170c3bf41f	04be4e4f-b69a-4443-b1a1-61ff6eee57cb	2026-11-01	dang_hoc	2026-11-19 13:13:34.90197+00	\N
7f0790f7-45a2-471f-8a3c-2ba3c47ee13f	0377768d-cc45-49f5-a96d-8d170c3bf41f	ff5bdfec-e718-4912-bf1b-877186b3f8e8	2026-11-01	dang_hoc	2026-11-20 12:05:59.907078+00	\N
7d7d7b2b-25b9-4317-8d6f-7f0264ae6b51	8a601d2f-4322-4983-9e47-f964e910e10f	0a6a5510-3d31-4b1c-96ca-09889eef3bc1	2026-11-01	dang_hoc	2026-11-20 12:05:49.29744+00	\N
ff79fa26-cf21-4a9b-bdd1-e770fc689daa	8a601d2f-4322-4983-9e47-f964e910e10f	c4a9644d-37b9-42f9-9466-a36f0b4af57c	2026-11-01	dang_hoc	2026-11-20 12:05:54.422514+00	\N
aceca6b5-a76e-45d9-b4c2-d0d1a43d35cc	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	3aec8da8-00ec-454d-bfb1-d63fb936e5f9	2026-11-01	dang_hoc	2026-11-20 12:05:51.832647+00	\N
6b96df8c-cd27-44ab-a4cf-64a1cd47b3d7	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	9267894b-0000-4fa0-9931-9b300d5f1238	2026-11-01	dang_hoc	2026-11-20 12:05:52.07862+00	1000000
\.


--
-- Data for Name: goi_hoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."goi_hoc" ("id", "hoc_sinh_id", "thang_bat_dau", "so_thang", "don_gia", "buoi_du_kien", "tien_du_tru", "dieu_chinh", "ly_do_dieu_chinh", "tao_luc", "tien_thang", "lop_gia") FROM stdin;
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
-- Data for Name: nhat_ky; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."nhat_ky" ("id", "luc", "nguoi", "ten_nguoi", "bang", "hanh_dong", "doi_tuong", "thay_doi") FROM stdin;
406	2026-11-21 02:50:21.724338+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Minh Trang	{"id": "818ee0b6-07c3-409b-836b-5df5c60da957", "so": 1, "ngay": "2026-11-21", "ly_do": null, "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-21T02:50:21.724338+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "8ea22cc8-cef8-4c6d-95f8-6e89b2b50136"}
407	2026-11-21 02:50:27.538791+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Minh Trang	{"id": "e16e6279-ff6c-4697-ba2d-908baea496ef", "so": -1, "ngay": "2026-11-21", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-21T02:50:27.538791+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "8ea22cc8-cef8-4c6d-95f8-6e89b2b50136"}
408	2026-11-21 02:51:11.173369+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
513	2026-11-21 03:34:15.780639+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
847	2026-11-21 04:34:50.72082+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1066	2026-11-21 04:58:48.798416+00	\N	\N	hoc_sinh	sua	Bùi Bách	{"don_gia_rieng": [0, null]}
1257	2026-11-21 07:38:24.658527+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1287	2026-11-21 11:18:21.021892+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Hoàng Trung Hải 	{"link_zalo": [null, "https://zalo.me/g/zgel8mci93ptujzeoquu"]}
1299	2026-11-21 13:10:07.205886+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Thiên Nga · Lớp ielts cơ bản t7 · 21/11/2026	{"buoi_id": "81a08445-8690-4ba5-9fc5-2331ede97bb5", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1311	2026-11-23 08:12:32.849762+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	xoa	test · Ca tối t2: 18-20 · 23/11/2026	{"buoi_id": "f2baa976-58d4-4609-9331-5947c40c4df7", "don_gia": 1000000, "tro_giang_id": "8f2ca2fa-e36b-4f1c-89a0-aade2484f779"}
1312	2026-11-23 08:12:32.849762+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	sua	Ca tối t2: 18-20 · 23/11/2026	{"lop_nghi": [false, true]}
1322	2026-11-23 09:57:41.699238+00	\N	\N	hoc_sinh	sua	Bùi Bách	{"sticker_dau_ky": [0, 30]}
1332	2026-11-23 09:57:43.681776+00	\N	\N	hoc_sinh	sua	Chu Bảo Ngân	{"sticker_dau_ky": [0, 349]}
1342	2026-11-23 09:57:45.446945+00	\N	\N	hoc_sinh	sua	Hoàng Mai Phương	{"sticker_dau_ky": [0, 216]}
1352	2026-11-23 09:57:46.767265+00	\N	\N	hoc_sinh	sua	Lương Minh Quân	{"sticker_dau_ky": [0, 113]}
1362	2026-11-23 09:57:48.125222+00	\N	\N	hoc_sinh	sua	Nguyễn Tự Huy	{"sticker_dau_ky": [0, 72]}
1372	2026-11-23 09:57:50.489069+00	\N	\N	hoc_sinh	sua	Trần Gia Bảo	{"sticker_dau_ky": [0, 147]}
1382	2026-11-23 09:57:52.198899+00	\N	\N	hoc_sinh	sua	Vũ Hải Long	{"sticker_dau_ky": [0, 373]}
1387	2026-11-23 10:32:40.740025+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	them	Ngô Thảo Chi · Lớp ielts cơ bản t7	{"id": "620d2f4a-a0f6-4c4f-8fce-151760d806cc", "lop_id": "0a6a5510-3d31-4b1c-96ca-09889eef3bc1", "tao_luc": "2026-11-23T10:32:40.740025+00:00", "ngay_vao": "2026-11-23", "trang_thai": "dang_hoc", "hoc_sinh_id": "58ccd9fc-cb17-4e09-afc1-0989f0636f6f", "don_gia_rieng": null}
1397	2026-11-23 10:33:44.677447+00	\N	\N	hoc_sinh	sua	Lâm Tùng	{"sticker_dau_ky": [20, 0]}
1413	2026-11-23 10:33:48.162634+00	\N	\N	hoc_sinh	sua	Ánh Long	{"sticker_dau_ky": [60, 36]}
1423	2026-11-23 10:33:50.304931+00	\N	\N	hoc_sinh	sua	Nguyễn Hà Giang	{"sticker_dau_ky": [134, 117]}
1433	2026-11-23 10:33:51.865967+00	\N	\N	hoc_sinh	sua	Trần Gia Nghĩa (Ỉn)	{"sticker_dau_ky": [120, 98]}
1443	2026-11-23 10:33:53.669928+00	\N	\N	hoc_sinh	sua	Vũ Quốc Tùng	{"sticker_dau_ky": [331, 306]}
1453	2026-11-23 10:33:55.198484+00	\N	\N	hoc_sinh	sua	Phạm Trí Thành	{"sticker_dau_ky": [20, 0]}
1490	2026-11-23 12:09:36.70274+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	tuan	{"id": "2989caff-fdc5-4bae-83f9-6fc5cdf40ef2", "ma_hs": "HS129", "avatar": null, "ho_ten": "tuan", "don_gia": 300000, "ghi_chu": null, "tao_luc": "2026-11-23T08:13:55.579378+00:00", "ngay_vao": "2026-11-23", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1499	2026-11-23 13:29:03.860981+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Nguyễn Tự Huy	{"id": "d4749940-5fb2-4e3f-bdde-2bbf84b6d8e8", "so": -56, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:29:03.860981+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "e3906889-be7a-483c-a548-52c80afb47e7"}
1500	2026-11-23 13:29:22.847383+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Nguyễn Gia Bảo	{"id": "df522537-3680-42c6-8106-c13cc2099e95", "so": -60, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:29:22.847383+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "9649475f-b209-4855-8e4f-f991a3ccce82"}
1513	2026-11-25 13:14:02.62017+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Thành · Ca 18-20 T4 · 25/11/2026	{"buoi_id": "804fbd08-2178-4c1a-9c0a-293b1ca0462a", "don_gia": 100000, "tro_giang_id": "d45793f2-33af-41bf-91e4-410cf31087cc"}
1523	2026-11-25 14:50:49.8562+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Ngân · Lớp mix chiều cn · 22/11/2026	{"buoi_id": "7e26a780-214a-4c13-8a28-7f897936eec2", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1532	2026-11-25 15:49:54.749189+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	them	1-1 Trung Dũng  · 16/11/2026	{"id": "8ac83685-f5d9-4b1f-8dd4-d7bc387ad24f", "loai": "bu", "ngay": "2026-11-16", "lop_id": "4df112a4-8db9-4c78-a747-5ab93c497a19", "bat_dau": "09:00:00", "ghi_chu": null, "ket_thuc": "11:00:00", "lop_nghi": false}
1258	2026-11-21 08:57:13.183957+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1288	2026-11-21 11:18:48.717537+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Khuất Hoàng An 	{"link_zalo": [null, "https://zalo.me/g/rd741dryczmk29nfhvgw"]}
1300	2026-11-22 15:03:34.523597+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1313	2026-11-23 08:13:11.974913+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	lop	them	test	{"id": "83fb20a4-7e02-491c-84a1-5958f3fd9f55", "gio": null, "ten": "test", "lich": [6], "don_gia": 0, "gio_thu": {"6": {"bd": "17:55", "kt": "19:55"}}, "tao_luc": "2026-11-23T08:13:11.974913+00:00", "hoat_dong": true}
1323	2026-11-23 09:57:41.871349+00	\N	\N	hoc_sinh	sua	Gia Khánh	{"sticker_dau_ky": [0, 33]}
1333	2026-11-23 09:57:43.817431+00	\N	\N	hoc_sinh	sua	Đặng An Bình	{"sticker_dau_ky": [0, 63]}
1343	2026-11-23 09:57:45.602919+00	\N	\N	hoc_sinh	sua	Hoàng Trung Đức	{"sticker_dau_ky": [0, 97]}
1353	2026-11-23 09:57:46.888204+00	\N	\N	hoc_sinh	sua	Nguyễn Đăng Dương	{"sticker_dau_ky": [0, 368]}
1363	2026-11-23 09:57:48.515606+00	\N	\N	hoc_sinh	sua	Nhật Duy	{"sticker_dau_ky": [0, 5]}
1373	2026-11-23 09:57:50.647495+00	\N	\N	hoc_sinh	sua	Trần Gia Khiêm (Voi)	{"sticker_dau_ky": [0, 177]}
1383	2026-11-23 09:57:52.309169+00	\N	\N	hoc_sinh	sua	Vũ Quốc Tùng	{"sticker_dau_ky": [0, 331]}
1388	2026-11-23 10:33:10.804756+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	xoa	Ngô Thảo Chi · Ca tối t2: 18-20	{"id": "ecdcef9b-afb2-4dd5-9ec2-f3bfe138d836", "lop_id": "3aec8da8-00ec-454d-bfb1-d63fb936e5f9", "tao_luc": "2026-11-20T12:05:51.572575+00:00", "ngay_vao": "2026-11-01", "trang_thai": "dang_hoc", "hoc_sinh_id": "58ccd9fc-cb17-4e09-afc1-0989f0636f6f", "don_gia_rieng": null}
1398	2026-11-23 10:33:45.24874+00	\N	\N	hoc_sinh	sua	Nam Phong	{"sticker_dau_ky": [30, 0]}
1403	2026-11-23 10:33:46.062768+00	\N	\N	hoc_sinh	sua	Lê Hồng Ngọc	{"sticker_dau_ky": [31, 0]}
1412	2026-11-23 10:33:48.03741+00	\N	\N	hoc_sinh	sua	Vũ Hải Long	{"sticker_dau_ky": [373, 326]}
1422	2026-11-23 10:33:50.12015+00	\N	\N	hoc_sinh	sua	Nguyễn Gia Bảo	{"sticker_dau_ky": [167, 148]}
1432	2026-11-23 10:33:51.751586+00	\N	\N	hoc_sinh	sua	Trần Gia Minh	{"sticker_dau_ky": [137, 112]}
1442	2026-11-23 10:33:53.551051+00	\N	\N	hoc_sinh	sua	Phạm Minh Khôi	{"sticker_dau_ky": [299, 285]}
1452	2026-11-23 10:33:55.064242+00	\N	\N	hoc_sinh	sua	Lương Minh Quân	{"sticker_dau_ky": [113, 103]}
1491	2026-11-23 12:10:30.243113+00	8f2ca2fa-e36b-4f1c-89a0-aade2484f779	test	tai_khoan	dang_nhap	test	\N
1501	2026-11-23 13:29:37.728911+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Trần Gia Minh	{"id": "0e43f7d5-68ae-458a-b336-188f2c6fc9e1", "so": -50, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:29:37.728911+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "ecfde36a-3d8b-458a-88bd-3dee5c89cdd4"}
1503	2026-11-23 13:30:04.01465+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Khuất Hoàng An	{"id": "0f3fa630-7c6c-49ed-8ec5-e99a02a37c1e", "so": -60, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:30:04.01465+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "1555600c-8358-42eb-b9f3-611dbeab3641"}
1505	2026-11-23 13:30:29.858335+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Hà Đoàn Nhật Hoàng	{"id": "e020e6eb-34af-4b85-9cf8-559b6c5adb74", "so": -70, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:30:29.858335+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "552de5e9-d599-4a8e-ace8-d80518dfe059"}
1506	2026-11-23 13:30:42.643418+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Lê Minh Huy	{"id": "80e5836b-54bb-414c-a858-3ceaf28cc933", "so": -70, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:30:42.643418+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "ff386fd8-15b5-42a0-b103-536c60684008"}
1514	2026-11-25 13:14:04.099554+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Anh Tuấn · Ca 18-20 T4 · 25/11/2026	{"buoi_id": "804fbd08-2178-4c1a-9c0a-293b1ca0462a", "don_gia": 100000, "tro_giang_id": "69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed"}
1524	2026-11-25 14:55:38.711783+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Tuấn lớp ielts nâng cao  · Lớp Ielts nâng cao · 19/11/2026	{"buoi_id": "7546fba6-4be9-440e-9ab2-c379d4c471e9", "don_gia": 50000, "tro_giang_id": "9b8a626d-c10d-443e-adcf-8b152a9b6c90"}
1259	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Chu Bảo Ngân	{"id": "ad4eb7e3-ef7e-442e-9e18-766284275ff7", "avatar": "avatar/ad4eb7e3-ef7e-442e-9e18-766284275ff7-1794999976075.jpg", "ho_ten": "Chu Bảo Ngân", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:06:16.031289+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1260	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Hoàng Diệu Linh	{"id": "e57f5ae7-1615-43da-89c0-af87f74cdc97", "avatar": "avatar/e57f5ae7-1615-43da-89c0-af87f74cdc97-1795000028815.jpg", "ho_ten": "Hoàng Diệu Linh", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:07:08.678948+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1261	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Lê Thị Anh Thư	{"id": "e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af", "avatar": "avatar/e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af-1795003669718.jpg", "ho_ten": "Lê Thị Anh Thư", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:08:14.94948+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1262	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Lê Hồng Ngọc	{"id": "a7a4a0fd-b313-4cc7-a91a-43726d34edc9", "avatar": null, "ho_ten": "Lê Hồng Ngọc", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:08:40.036682+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1263	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Nguyễn Hải Sơn	{"id": "4f80d2ff-fc12-472d-8330-f9d4eba659ab", "avatar": "avatar/4f80d2ff-fc12-472d-8330-f9d4eba659ab-1795000166855.jpg", "ho_ten": "Nguyễn Hải Sơn", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:09:26.774658+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1264	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Nguyễn Thị Ngọc	{"id": "d52ba56a-1453-4315-8de9-75f0bbe3c7b4", "avatar": null, "ho_ten": "Nguyễn Thị Ngọc", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:09:51.735342+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1265	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Phạm Sương Mai	{"id": "d33f6ef4-92f6-4de1-bde4-d15d6f1dc5c7", "avatar": null, "ho_ten": "Phạm Sương Mai", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:10:09.65974+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1266	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Phạm Thị Vân Anh	{"id": "ef8b67df-fbeb-4c52-ba94-4be8fdb8053b", "avatar": "avatar/ef8b67df-fbeb-4c52-ba94-4be8fdb8053b-1795000241808.jpg", "ho_ten": "Phạm Thị Vân Anh", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:10:41.735205+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1267	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Phạm Trí Thành	{"id": "fa327d0b-f6b8-4d58-b67a-74eafeea4798", "avatar": null, "ho_ten": "Phạm Trí Thành", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:11:04.707612+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1268	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Ngô Thảo Chi	{"id": "b20830c3-0747-45aa-bba0-0efd2f0cd32e", "avatar": "avatar/b20830c3-0747-45aa-bba0-0efd2f0cd32e-1795003682982.jpg", "ho_ten": "Ngô Thảo Chi", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:11:47.747478+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1269	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	xoa	Vũ Hải Long	{"id": "3f7ce3c1-adc5-4a3c-b88e-5f6cd8aeac91", "avatar": "avatar/3f7ce3c1-adc5-4a3c-b88e-5f6cd8aeac91-1795000346567.jpg", "ho_ten": "Vũ Hải Long", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "ghi_chu": null, "tao_luc": "2026-11-18T11:12:26.51448+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1270	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	xoa	Ielts pre chiều t7 · 07/11/2026	{"id": "828c679c-152f-4e56-a36d-69158139863f", "loai": "lich", "ngay": "2026-11-07", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "bat_dau": "15:15:00", "ghi_chu": null, "ket_thuc": "17:15:00", "lop_nghi": false}
1271	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	xoa	Ielts pre chiều t7 · 14/11/2026	{"id": "c8f1d446-55a0-41fa-8553-827903f3aab7", "loai": "lich", "ngay": "2026-11-14", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "bat_dau": "15:15:00", "ghi_chu": null, "ket_thuc": "17:15:00", "lop_nghi": false}
1272	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	xoa	Ielts pre chiều t7 · 21/11/2026	{"id": "1c00f3c5-b4b9-4095-b86c-100d576579e3", "loai": "lich", "ngay": "2026-11-21", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "bat_dau": "15:15:00", "ghi_chu": null, "ket_thuc": "17:15:00", "lop_nghi": false}
1273	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	xoa	Ielts pre chiều t7 · 28/11/2026	{"id": "256eace7-fc21-4c4f-b5f7-9688da6a1291", "loai": "lich", "ngay": "2026-11-28", "lop_id": "0d76975d-4f18-47de-adb8-3992850432eb", "bat_dau": "15:15:00", "ghi_chu": null, "ket_thuc": "17:15:00", "lop_nghi": false}
1274	2026-11-21 08:59:13.384652+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	lop	xoa	Ielts pre chiều t7	{"id": "0d76975d-4f18-47de-adb8-3992850432eb", "gio": null, "ten": "Ielts pre chiều t7", "lich": [6], "don_gia": 200000, "gio_thu": {"6": {"bd": "15:15", "kt": "17:15"}}, "tao_luc": "2026-11-18T11:05:43.398604+00:00", "hoat_dong": true}
1289	2026-11-21 11:19:34.802578+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Lê Minh Huy	{"link_zalo": [null, "https://zalo.me/g/txfgex990"]}
1301	2026-11-23 06:00:14.42233+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1324	2026-11-23 09:57:42.047669+00	\N	\N	hoc_sinh	sua	Gia Minh	{"sticker_dau_ky": [0, 40]}
1275	2026-11-21 09:04:45.424931+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	Hoàng Diệu Linh	{"id": "6be26019-2c76-4991-ad4c-8b444d4a5eb0", "avatar": null, "ho_ten": "Hoàng Diệu Linh", "lop_id": "0a6a5510-3d31-4b1c-96ca-09889eef3bc1", "ghi_chu": null, "tao_luc": "2026-11-21T09:04:45.424931+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1278	2026-11-21 09:05:50.151541+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	Nguyễn Hải Sơn	{"id": "4e25df69-7985-44e0-ad18-4855a5b4ebb5", "avatar": null, "ho_ten": "Nguyễn Hải Sơn", "lop_id": "0a6a5510-3d31-4b1c-96ca-09889eef3bc1", "ghi_chu": null, "tao_luc": "2026-11-21T09:05:50.151541+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1290	2026-11-21 11:20:13.670013+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Nguyễn Đăng Dương 	{"link_zalo": [null, "https://zalo.me/g/zwmmze689"]}
1302	2026-11-23 06:19:14.075282+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1305	2026-11-23 06:23:57.128985+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	xoa	Minh Dương · 1-1 Trung Dũng  · 23/11/2026	{"buoi_id": "01d029a9-b0f8-47b3-867a-008624e4ed9d", "don_gia": 100000, "tro_giang_id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68"}
1314	2026-11-23 08:13:55.579378+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	tuan	{"id": "2989caff-fdc5-4bae-83f9-6fc5cdf40ef2", "ma_hs": "HS129", "avatar": null, "ho_ten": "tuan", "don_gia": 300000, "ghi_chu": null, "tao_luc": "2026-11-23T08:13:55.579378+00:00", "ngay_vao": "2026-11-23", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1325	2026-11-23 09:57:42.186255+00	\N	\N	hoc_sinh	sua	Hải Hiếu	{"sticker_dau_ky": [0, 30]}
1335	2026-11-23 09:57:44.079018+00	\N	\N	hoc_sinh	sua	Đinh Bá Quang Anh	{"sticker_dau_ky": [0, 161]}
1345	2026-11-23 09:57:45.850642+00	\N	\N	hoc_sinh	sua	Khuất Hoàng An	{"sticker_dau_ky": [0, 192]}
1355	2026-11-23 09:57:47.140179+00	\N	\N	hoc_sinh	sua	Nguyễn Hà Giang	{"sticker_dau_ky": [0, 134]}
1365	2026-11-23 09:57:48.766335+00	\N	\N	hoc_sinh	sua	Phạm Minh Khôi	{"sticker_dau_ky": [0, 299]}
1375	2026-11-23 09:57:50.927395+00	\N	\N	hoc_sinh	sua	Trần Gia Nghĩa (Ỉn)	{"sticker_dau_ky": [0, 120]}
1389	2026-11-23 10:33:42.768886+00	\N	\N	hoc_sinh	sua	Minh Trang	{"sticker_dau_ky": [55, 0]}
1399	2026-11-23 10:33:45.388497+00	\N	\N	hoc_sinh	sua	Chu Bảo Ngân	{"sticker_dau_ky": [349, 311]}
1404	2026-11-23 10:33:46.189581+00	\N	\N	hoc_sinh	sua	Nguyễn Hải Sơn	{"sticker_dau_ky": [498, 469]}
1414	2026-11-23 10:33:48.283005+00	\N	\N	hoc_sinh	sua	Đặng Bảo An	{"sticker_dau_ky": [163, 132]}
1424	2026-11-23 10:33:50.420574+00	\N	\N	hoc_sinh	sua	Nguyễn Hải Đăng	{"sticker_dau_ky": [114, 97]}
1434	2026-11-23 10:33:51.982898+00	\N	\N	hoc_sinh	sua	Tú Anh	{"sticker_dau_ky": [68, 34]}
1444	2026-11-23 10:33:53.798213+00	\N	\N	hoc_sinh	sua	Bùi Ngọc Hà	{"sticker_dau_ky": [235, 214]}
1454	2026-11-23 10:33:55.57272+00	\N	\N	hoc_sinh	sua	Nhật Duy	{"sticker_dau_ky": [5, 0]}
1472	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Ngân · Pre-A1+Ielts bổ trợ · 14/11/2026	{"buoi_id": "e06f0275-a6f0-42f0-9f1d-963713a5120a", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1473	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Minh Dương · Lớp ielts cơ bản cn · 15/11/2026	{"buoi_id": "152f232d-a41b-49ba-906c-68151d28d4a1", "don_gia": 100000, "tro_giang_id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68"}
1474	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Ngân · Lớp mix chiều cn · 15/11/2026	{"buoi_id": "78ddc48c-fcce-40b2-a990-7881b7cebe73", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1475	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Thiên Nga · Lớp mix chiều cn · 15/11/2026	{"buoi_id": "78ddc48c-fcce-40b2-a990-7881b7cebe73", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1476	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Ngân · Ca tối t2: 18-20 · 16/11/2026	{"buoi_id": "6b2d9128-7127-45f0-8f82-081aa3ff0759", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1477	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Thiên Nga · Ca tối t2: 18-20 · 16/11/2026	{"buoi_id": "6b2d9128-7127-45f0-8f82-081aa3ff0759", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1492	2026-11-23 12:11:59.727526+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1502	2026-11-23 13:29:52.229865+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Vũ Quốc Tùng	{"id": "e259e0ef-bf4b-4bfe-8ade-6d1c1722a888", "so": -80, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:29:52.229865+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "6ef103a4-fc2b-4fc6-bb1a-e113033e7f91"}
1504	2026-11-23 13:30:18.889108+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Phạm Thị Vân Anh	{"id": "bbf86199-1e17-4ad4-a10f-e2523c3d6824", "so": -70, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:30:18.889108+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4"}
1515	2026-11-25 13:48:55.225174+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	Lê Ngọc Vy	{"id": "9706bbdf-ef70-4ea9-950c-f8062c4ac033", "ma_hs": "HS130", "avatar": null, "ho_ten": "Lê Ngọc Vy", "don_gia": 150000, "ghi_chu": null, "tao_luc": "2026-11-25T13:48:55.225174+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": "Bích", "sticker_dau_ky": 0}
1525	2026-11-25 14:55:40.511233+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	xoa	Anh Tuấn · Lớp Ielts nâng cao · 19/11/2026	{"buoi_id": "7546fba6-4be9-440e-9ab2-c379d4c471e9", "don_gia": 100000, "tro_giang_id": "69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed"}
1276	2026-11-21 09:05:06.825661+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	Lê Thị Anh Thư	{"id": "340f69e5-e301-4c40-9266-536922a91eb1", "avatar": null, "ho_ten": "Lê Thị Anh Thư", "lop_id": "0a6a5510-3d31-4b1c-96ca-09889eef3bc1", "ghi_chu": null, "tao_luc": "2026-11-21T09:05:06.825661+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1279	2026-11-21 09:06:04.928146+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	Nguyễn Thế Hiếu	{"id": "1bd2c8f1-632a-405b-b076-7095b1b0eac1", "avatar": null, "ho_ten": "Nguyễn Thế Hiếu", "lop_id": "0a6a5510-3d31-4b1c-96ca-09889eef3bc1", "ghi_chu": null, "tao_luc": "2026-11-21T09:06:04.928146+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1291	2026-11-21 11:23:07.930421+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Nguyễn Hà Giang 	{"link_zalo": [null, "https://zalo.me/g/jfamzj191"]}
1293	2026-11-21 11:23:52.453424+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Nguyễn Ngọc Quân 	{"link_zalo": [null, "https://zalo.me/g/oyopku102"]}
1303	2026-11-23 06:22:29.841651+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	lop	sua	Ca 1 tối t6	{"ten": ["Ca 1 tối t6 ", "Ca 1 tối t6"], "don_gia": [150000, 0]}
1315	2026-11-23 08:13:55.906553+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	them	tuan · test	{"id": "71b816ac-2cfd-4455-bed9-ea85e1b355ca", "lop_id": "83fb20a4-7e02-491c-84a1-5958f3fd9f55", "tao_luc": "2026-11-23T08:13:55.906553+00:00", "ngay_vao": "2026-11-23", "trang_thai": "dang_hoc", "hoc_sinh_id": "2989caff-fdc5-4bae-83f9-6fc5cdf40ef2", "don_gia_rieng": null}
1326	2026-11-23 09:57:42.352372+00	\N	\N	hoc_sinh	sua	Hoàng Tuấn	{"sticker_dau_ky": [0, 30]}
1336	2026-11-23 09:57:44.233513+00	\N	\N	hoc_sinh	sua	Đỗ Hoàng Thùy	{"sticker_dau_ky": [0, 68]}
1346	2026-11-23 09:57:45.989924+00	\N	\N	hoc_sinh	sua	Lê Thị Anh Thư	{"sticker_dau_ky": [0, 109]}
1356	2026-11-23 09:57:47.274723+00	\N	\N	hoc_sinh	sua	Nguyễn Hải Đăng	{"sticker_dau_ky": [0, 114]}
1366	2026-11-23 09:57:48.893146+00	\N	\N	hoc_sinh	sua	Phạm Ngọc Anh	{"sticker_dau_ky": [0, 84]}
1376	2026-11-23 09:57:51.078864+00	\N	\N	hoc_sinh	sua	Trịnh Ngọc Bảo Anh	{"sticker_dau_ky": [0, 176]}
1390	2026-11-23 10:33:42.910813+00	\N	\N	hoc_sinh	sua	Trung Dũng	{"sticker_dau_ky": [103, 58]}
1405	2026-11-23 10:33:46.318291+00	\N	\N	hoc_sinh	sua	Nguyễn Thế Hiếu	{"sticker_dau_ky": [514, 465]}
1415	2026-11-23 10:33:48.426022+00	\N	\N	hoc_sinh	sua	Đinh Bá Quang Anh	{"sticker_dau_ky": [161, 152]}
1425	2026-11-23 10:33:50.573941+00	\N	\N	hoc_sinh	sua	Nguyễn Ngọc Châu An	{"sticker_dau_ky": [66, 39]}
1435	2026-11-23 10:33:52.098767+00	\N	\N	hoc_sinh	sua	Vũ Dương Bảo An	{"sticker_dau_ky": [77, 59]}
1445	2026-11-23 10:33:53.928049+00	\N	\N	hoc_sinh	sua	Nguyễn Đăng Dương	{"sticker_dau_ky": [368, 346]}
1455	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Minh Dương · Lớp ielts cơ bản cn · 01/11/2026	{"buoi_id": "62dbfa7c-dc48-49a3-b20b-1fee55d37758", "don_gia": 100000, "tro_giang_id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68"}
1456	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Trần Mạnh · Lớp mix chiều cn · 01/11/2026	{"buoi_id": "8779134c-3ec1-43b0-9894-355f8396c452", "don_gia": 100000, "tro_giang_id": "7925dcdb-7311-4634-896a-b4b6386b2df2"}
1457	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Thiên Nga · Lớp mix chiều cn · 01/11/2026	{"buoi_id": "8779134c-3ec1-43b0-9894-355f8396c452", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1458	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Trần Mạnh · Ca tối t2: 18-20 · 02/11/2026	{"buoi_id": "0eba43b0-5e48-4b58-ab43-c4a54bb92958", "don_gia": 100000, "tro_giang_id": "7925dcdb-7311-4634-896a-b4b6386b2df2"}
1459	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Thiên Nga · Ca tối t2: 18-20 · 02/11/2026	{"buoi_id": "0eba43b0-5e48-4b58-ab43-c4a54bb92958", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1460	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Thiên Nga · Cấp 1 Ca 18-20 t5 · 05/11/2026	{"buoi_id": "eea2018b-766f-4172-aefc-f89454e11876", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1461	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Minh Dương · Ca 1 tối t6 · 06/11/2026	{"buoi_id": "88e99a85-3d79-46e3-b5f4-e5caa7817535", "don_gia": 100000, "tro_giang_id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68"}
1462	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Ngân · Ca 1 tối t6 · 06/11/2026	{"buoi_id": "88e99a85-3d79-46e3-b5f4-e5caa7817535", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1463	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Minh Dương · Lớp ielts cơ bản cn · 08/11/2026	{"buoi_id": "fee61361-bad6-4261-9696-09b6fcdc5209", "don_gia": 100000, "tro_giang_id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68"}
1464	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Trần Mạnh · Lớp mix chiều cn · 08/11/2026	{"buoi_id": "fe2e618b-207f-4e12-85a5-869a5a678c89", "don_gia": 100000, "tro_giang_id": "7925dcdb-7311-4634-896a-b4b6386b2df2"}
1465	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Ngân · Lớp mix chiều cn · 08/11/2026	{"buoi_id": "fe2e618b-207f-4e12-85a5-869a5a678c89", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1466	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Thiên Nga · Lớp mix chiều cn · 08/11/2026	{"buoi_id": "fe2e618b-207f-4e12-85a5-869a5a678c89", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1467	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Trần Mạnh · Ca tối t2: 18-20 · 09/11/2026	{"buoi_id": "e7fd6d88-4cb3-47f6-b23f-ac1170050a38", "don_gia": 100000, "tro_giang_id": "7925dcdb-7311-4634-896a-b4b6386b2df2"}
1468	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Thiên Nga · Ca tối t2: 18-20 · 09/11/2026	{"buoi_id": "e7fd6d88-4cb3-47f6-b23f-ac1170050a38", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1469	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Thiên Nga · Cấp 1 Ca 18-20 t5 · 12/11/2026	{"buoi_id": "99c06620-cdb1-41cc-b9b6-cc2cadb351dc", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1470	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Minh Dương · Ca 1 tối t6 · 13/11/2026	{"buoi_id": "45a23d78-e0da-44ae-9568-b0865bd1bc0f", "don_gia": 100000, "tro_giang_id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68"}
1471	2026-11-23 10:33:55.706965+00	\N	\N	tro_giang_buoi	them	Ngân · Ca 1 tối t6 · 13/11/2026	{"buoi_id": "45a23d78-e0da-44ae-9568-b0865bd1bc0f", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1478	2026-11-23 10:52:10.88504+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	sua	Lớp Ielts nâng cao · 07/11/2026	{"lop_nghi": [false, true]}
1277	2026-11-21 09:05:29.782042+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	Lê Hồng Ngọc	{"id": "eec7705d-63cb-4de0-9acd-fdce496ae29e", "avatar": null, "ho_ten": "Lê Hồng Ngọc", "lop_id": "0a6a5510-3d31-4b1c-96ca-09889eef3bc1", "ghi_chu": null, "tao_luc": "2026-11-21T09:05:29.782042+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1280	2026-11-21 09:06:23.941898+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	Nguyễn Thị Ngọc	{"id": "4185efd4-cf95-40ec-9370-41740de65997", "avatar": null, "ho_ten": "Nguyễn Thị Ngọc", "lop_id": "0a6a5510-3d31-4b1c-96ca-09889eef3bc1", "ghi_chu": null, "tao_luc": "2026-11-21T09:06:23.941898+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1281	2026-11-21 09:06:40.848735+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	them	Phạm Sương Mai	{"id": "251337fd-eaef-47ce-95a3-55fed086e050", "avatar": null, "ho_ten": "Phạm Sương Mai", "lop_id": "0a6a5510-3d31-4b1c-96ca-09889eef3bc1", "ghi_chu": null, "tao_luc": "2026-11-21T09:06:40.848735+00:00", "ngay_vao": "2026-11-01", "link_zalo": null, "trang_thai": "dang_hoc", "phu_huynh_id": null, "don_gia_rieng": null, "sdt_phu_huynh": null, "ten_phu_huynh": null, "sticker_dau_ky": 0}
1292	2026-11-21 11:23:30.814974+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Nguyễn Hải Đăng 	{"link_zalo": [null, "https://zalo.me/g/jfamzj191"]}
1304	2026-11-23 06:23:30.387567+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Minh Dương · 1-1 Trung Dũng  · 23/11/2026	{"buoi_id": "01d029a9-b0f8-47b3-867a-008624e4ed9d", "don_gia": 100000, "tro_giang_id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68"}
1316	2026-11-23 08:50:51.826562+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1327	2026-11-23 09:57:42.490823+00	\N	\N	hoc_sinh	sua	Lâm Tùng	{"sticker_dau_ky": [0, 20]}
1337	2026-11-23 09:57:44.345903+00	\N	\N	hoc_sinh	sua	Đỗ Kim Ngân	{"sticker_dau_ky": [0, 51]}
1347	2026-11-23 09:57:46.107587+00	\N	\N	hoc_sinh	sua	Lê Danh Gia Bảo	{"sticker_dau_ky": [0, 119]}
1357	2026-11-23 09:57:47.38522+00	\N	\N	hoc_sinh	sua	Nguyễn Hải Sơn	{"sticker_dau_ky": [0, 498]}
1367	2026-11-23 09:57:49.027518+00	\N	\N	hoc_sinh	sua	Phạm Nhật Linh (Sam)	{"sticker_dau_ky": [0, 184]}
1377	2026-11-23 09:57:51.522353+00	\N	\N	hoc_sinh	sua	Trịnh Ngọc Bảo Trân	{"sticker_dau_ky": [0, 289]}
1391	2026-11-23 10:33:43.302464+00	\N	\N	hoc_sinh	sua	Ngọc Minh	{"sticker_dau_ky": [43, 0]}
1400	2026-11-23 10:33:45.751547+00	\N	\N	hoc_sinh	sua	Hoàng Diệu Linh	{"sticker_dau_ky": [190, 143]}
1406	2026-11-23 10:33:46.687925+00	\N	\N	hoc_sinh	sua	Nguyễn Thị Ngọc	{"sticker_dau_ky": [49, 0]}
1416	2026-11-23 10:33:48.559786+00	\N	\N	hoc_sinh	sua	Đỗ Phương Thu	{"sticker_dau_ky": [122, 107]}
1426	2026-11-23 10:33:50.720799+00	\N	\N	hoc_sinh	sua	Nguyễn Tự Huy	{"sticker_dau_ky": [72, 35]}
1436	2026-11-23 10:33:52.471073+00	\N	\N	hoc_sinh	sua	Vũ Hải Hà	{"sticker_dau_ky": [40, 23]}
1446	2026-11-23 10:33:54.311626+00	\N	\N	hoc_sinh	sua	Tùng Lâm	{"sticker_dau_ky": [13, 0]}
1479	2026-11-23 10:52:28.424313+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	sua	Lớp Ielts nâng cao · 07/11/2026	{"lop_nghi": [true, false]}
1493	2026-11-23 12:22:36.424685+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1507	2026-11-23 13:31:49.666462+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	sticker_cong_tru	them	Nguyễn Ngọc Quân	{"id": "0252b598-f1ef-446a-8da0-d432d6ba5ed8", "so": -66, "ngay": "2026-11-23", "ly_do": "Đổi quà", "nguoi": "43d2ab0d-e902-49d7-9e81-a3696d296ad2", "tao_luc": "2026-11-23T13:31:49.666462+00:00", "ten_nguoi": "Quản trị", "hoc_sinh_id": "f85931d6-9ede-45a1-acde-ba4789c6e853"}
1516	2026-11-25 13:51:04.36655+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	them	Lê Ngọc Vy · Ca 18-20 T4	{"id": "a092e517-0097-42da-8ef4-5cee324bf971", "lop_id": "4e49d265-ef05-4457-8c75-ff435e266182", "tao_luc": "2026-11-25T13:51:04.36655+00:00", "ngay_vao": "2026-11-25", "trang_thai": "dang_hoc", "hoc_sinh_id": "9706bbdf-ef70-4ea9-950c-f8062c4ac033", "don_gia_rieng": null}
1526	2026-11-25 15:00:52.600981+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1282	2026-11-21 10:06:59.212955+00	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	Ngân	tro_giang_buoi	them	Ngân · Pre-A1+Ielts bổ trợ · 21/11/2026	{"buoi_id": "2a9b49fe-888a-4327-9b2b-92cf74c0ffad", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1294	2026-11-21 11:24:12.994089+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Phạm Minh Khôi 	{"link_zalo": [null, "https://zalo.me/g/xpgehs363"]}
1306	2026-11-23 06:24:11.830836+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	test · 1-1 Trung Dũng  · 23/11/2026	{"buoi_id": "01d029a9-b0f8-47b3-867a-008624e4ed9d", "don_gia": 1000000, "tro_giang_id": "8f2ca2fa-e36b-4f1c-89a0-aade2484f779"}
1317	2026-11-23 08:51:06.979723+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	sua	Ca tối t2: 18-20 · 23/11/2026	{"lop_nghi": [true, false]}
1328	2026-11-23 09:57:42.640332+00	\N	\N	hoc_sinh	sua	Nam Phong	{"sticker_dau_ky": [0, 30]}
1338	2026-11-23 09:57:44.48345+00	\N	\N	hoc_sinh	sua	Đỗ Phương Thu	{"sticker_dau_ky": [0, 122]}
1348	2026-11-23 09:57:46.24892+00	\N	\N	hoc_sinh	sua	Lê Duy Anh	{"sticker_dau_ky": [0, 22]}
1358	2026-11-23 09:57:47.557648+00	\N	\N	hoc_sinh	sua	Nguyễn Ngọc Châu An	{"sticker_dau_ky": [0, 66]}
1368	2026-11-23 09:57:49.713943+00	\N	\N	hoc_sinh	sua	Phạm Sương Mai	{"sticker_dau_ky": [0, 31]}
1378	2026-11-23 09:57:51.669107+00	\N	\N	hoc_sinh	sua	Tú Anh	{"sticker_dau_ky": [0, 68]}
1392	2026-11-23 10:33:43.450324+00	\N	\N	hoc_sinh	sua	Bùi Bách	{"sticker_dau_ky": [30, 0]}
1401	2026-11-23 10:33:45.771463+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	xoa	Phạm Trí Thành · Ca tối t2: 18-20	{"id": "86ba99d1-4ff8-4565-95ed-12dfb5bbe59a", "lop_id": "3aec8da8-00ec-454d-bfb1-d63fb936e5f9", "tao_luc": "2026-11-20T12:05:51.31199+00:00", "ngay_vao": "2026-11-01", "trang_thai": "dang_hoc", "hoc_sinh_id": "0151b50f-11df-493c-a959-2b143ffec470", "don_gia_rieng": null}
1407	2026-11-23 10:33:46.857317+00	\N	\N	hoc_sinh	sua	Phạm Sương Mai	{"sticker_dau_ky": [31, 0]}
1417	2026-11-23 10:33:48.925668+00	\N	\N	hoc_sinh	sua	Đỗ Thùy Linh	{"sticker_dau_ky": [83, 45]}
1427	2026-11-23 10:33:50.848389+00	\N	\N	hoc_sinh	sua	Phạm Bảo Anh	{"sticker_dau_ky": [166, 141]}
1437	2026-11-23 10:33:52.598919+00	\N	\N	hoc_sinh	sua	Hà Đoàn Nhật Hoàng	{"sticker_dau_ky": [311, 284]}
1447	2026-11-23 10:33:54.437926+00	\N	\N	hoc_sinh	sua	Hoàng Trung Đức	{"sticker_dau_ky": [97, 93]}
1480	2026-11-23 10:52:30.749044+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	sua	Lớp Ielts nâng cao · 07/11/2026	{"lop_nghi": [false, true]}
1494	2026-11-23 13:18:41.625263+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1508	2026-11-23 13:32:50.41741+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1517	2026-11-25 14:43:50.028096+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	them	Lê Ngọc Vy · Ca 1 tối t6	{"id": "a324e024-84e5-453a-b973-bf76ad1fc2f1", "lop_id": "04be4e4f-b69a-4443-b1a1-61ff6eee57cb", "tao_luc": "2026-11-25T14:43:50.028096+00:00", "ngay_vao": "2026-11-25", "trang_thai": "dang_hoc", "hoc_sinh_id": "9706bbdf-ef70-4ea9-950c-f8062c4ac033", "don_gia_rieng": null}
1527	2026-11-25 15:21:27.591842+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Anh Tuấn · Ca 18-20 T4 · 04/11/2026	{"buoi_id": "b5d93120-96a2-4b6a-8ed4-3042aa4624cf", "don_gia": 100000, "tro_giang_id": "69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed"}
1283	2026-11-21 11:08:45.79064+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1295	2026-11-21 11:26:05.481909+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Vũ Hải Hà 	{"link_zalo": [null, "https://zalo.me/g/l3uhkuophq7uzcn8qqrj"]}
1307	2026-11-23 06:24:58.291083+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	test · Lớp ielts cơ bản cn · 22/11/2026	{"buoi_id": "896a645c-e7c4-4117-940f-d49b23298936", "don_gia": 1000000, "tro_giang_id": "8f2ca2fa-e36b-4f1c-89a0-aade2484f779"}
1318	2026-11-23 08:52:58.32855+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1334	2026-11-23 09:57:43.95866+00	\N	\N	hoc_sinh	sua	Đặng Bảo An	{"sticker_dau_ky": [0, 163]}
1344	2026-11-23 09:57:45.737796+00	\N	\N	hoc_sinh	sua	Hoàng Trung Hải	{"sticker_dau_ky": [0, 83]}
1354	2026-11-23 09:57:47.030554+00	\N	\N	hoc_sinh	sua	Nguyễn Gia Bảo	{"sticker_dau_ky": [0, 167]}
1364	2026-11-23 09:57:48.652638+00	\N	\N	hoc_sinh	sua	Phạm Bảo Anh	{"sticker_dau_ky": [0, 166]}
1374	2026-11-23 09:57:50.794229+00	\N	\N	hoc_sinh	sua	Trần Gia Minh	{"sticker_dau_ky": [0, 137]}
1393	2026-11-23 10:33:43.592584+00	\N	\N	hoc_sinh	sua	Gia Khánh	{"sticker_dau_ky": [33, 0]}
1402	2026-11-23 10:33:45.887673+00	\N	\N	hoc_sinh	sua	Lê Thị Anh Thư	{"sticker_dau_ky": [109, 60]}
1408	2026-11-23 10:33:47.216635+00	\N	\N	hoc_sinh	sua	Phạm Thị Vân Anh	{"sticker_dau_ky": [209, 184]}
1418	2026-11-23 10:33:49.063407+00	\N	\N	hoc_sinh	sua	Hoàng Mai Phương	{"sticker_dau_ky": [216, 199]}
1428	2026-11-23 10:33:51.225731+00	\N	\N	hoc_sinh	sua	Phạm Ngọc Anh	{"sticker_dau_ky": [84, 71]}
1438	2026-11-23 10:33:52.717158+00	\N	\N	hoc_sinh	sua	Khuất Hoàng An	{"sticker_dau_ky": [192, 165]}
1448	2026-11-23 10:33:54.5654+00	\N	\N	hoc_sinh	sua	Bảo Hân	{"sticker_dau_ky": [68, 58]}
1481	2026-11-23 10:57:35.548197+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	sua	Lớp Ielts nâng cao · 07/11/2026	{"lop_nghi": [true, false]}
1495	2026-11-23 13:20:15.803682+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Thiên Nga · Ca tối t2: 18-20 · 23/11/2026	{"buoi_id": "f2baa976-58d4-4609-9331-5947c40c4df7", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1509	2026-11-23 14:17:19.867774+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1518	2026-11-25 14:44:02.868044+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	them	Lê Ngọc Vy · Lớp ielts cơ bản cn	{"id": "b4901f2f-7705-4f3e-a748-69d616b8ea68", "lop_id": "c4a9644d-37b9-42f9-9466-a36f0b4af57c", "tao_luc": "2026-11-25T14:44:02.868044+00:00", "ngay_vao": "2026-11-25", "trang_thai": "dang_hoc", "hoc_sinh_id": "9706bbdf-ef70-4ea9-950c-f8062c4ac033", "don_gia_rieng": null}
1528	2026-11-25 15:42:53.080477+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Thành · Ca 18-20 T4 · 04/11/2026	{"buoi_id": "b5d93120-96a2-4b6a-8ed4-3042aa4624cf", "don_gia": 100000, "tro_giang_id": "d45793f2-33af-41bf-91e4-410cf31087cc"}
1284	2026-11-21 11:16:08.188659+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Trung Dũng 	{"link_zalo": [null, "https://zalo.me/g/fydjarn7zof4nifq8y4z"]}
1296	2026-11-21 11:26:35.297459+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Vũ Quốc Tùng 	{"link_zalo": [null, "https://zalo.me/g/aowhik487"]}
792	2026-11-21 04:30:20.901861+00	\N	\N	tai_khoan	sua	Chị Hoa	{"phai_doi_mat_khau": [false, true]}
1308	2026-11-23 06:25:11.714989+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	xoa	test · 1-1 Trung Dũng  · 23/11/2026	{"buoi_id": "01d029a9-b0f8-47b3-867a-008624e4ed9d", "don_gia": 1000000, "tro_giang_id": "8f2ca2fa-e36b-4f1c-89a0-aade2484f779"}
1319	2026-11-23 09:57:41.074219+00	\N	\N	hoc_sinh	sua	Minh Trang	{"sticker_dau_ky": [0, 55]}
1329	2026-11-23 09:57:42.780417+00	\N	\N	hoc_sinh	sua	Ánh Long	{"sticker_dau_ky": [0, 60]}
1339	2026-11-23 09:57:44.602083+00	\N	\N	hoc_sinh	sua	Đỗ Thùy Linh	{"sticker_dau_ky": [0, 83]}
1349	2026-11-23 09:57:46.360998+00	\N	\N	hoc_sinh	sua	Lê Hồng Ngọc	{"sticker_dau_ky": [0, 31]}
1359	2026-11-23 09:57:47.729439+00	\N	\N	hoc_sinh	sua	Nguyễn Ngọc Quân	{"sticker_dau_ky": [0, 407]}
1369	2026-11-23 09:57:49.830045+00	\N	\N	hoc_sinh	sua	Phạm Thị Vân Anh	{"sticker_dau_ky": [0, 209]}
1379	2026-11-23 09:57:51.7901+00	\N	\N	hoc_sinh	sua	Tùng Lâm	{"sticker_dau_ky": [0, 13]}
1384	2026-11-23 10:06:03.653492+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1394	2026-11-23 10:33:43.735236+00	\N	\N	hoc_sinh	sua	Gia Minh	{"sticker_dau_ky": [40, 20]}
693	2026-11-21 04:25:32.78919+00	8f2ca2fa-e36b-4f1c-89a0-aade2484f779	test	tai_khoan	dang_nhap	test	\N
1411	2026-11-23 10:33:47.668715+00	\N	\N	hoc_sinh	sua	Trịnh Ngọc Bảo Trân	{"sticker_dau_ky": [289, 276]}
1421	2026-11-23 10:33:49.692435+00	\N	\N	hoc_sinh	sua	Lê Tiến Anh	{"sticker_dau_ky": [458, 435]}
1431	2026-11-23 10:33:51.639078+00	\N	\N	hoc_sinh	sua	Trần Gia Khiêm (Voi)	{"sticker_dau_ky": [177, 165]}
1441	2026-11-23 10:33:53.360892+00	\N	\N	hoc_sinh	sua	Nguyễn Ngọc Quân	{"sticker_dau_ky": [407, 380]}
1451	2026-11-23 10:33:54.944019+00	\N	\N	hoc_sinh	sua	Đỗ Kim Ngân	{"sticker_dau_ky": [51, 41]}
1482	2026-11-23 11:26:46.062795+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	sua	Trần Mạnh	{"hoat_dong": [true, false]}
1496	2026-11-23 13:20:16.609853+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Ngân · Ca tối t2: 18-20 · 23/11/2026	{"buoi_id": "f2baa976-58d4-4609-9331-5947c40c4df7", "don_gia": 100000, "tro_giang_id": "77ffcb33-c53a-41b3-a728-f1fdb13cc37b"}
1510	2026-11-23 14:17:52.395061+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	them	1-1 Minh Trang · 23/11/2026	{"id": "c1bd29b8-3283-4974-804c-48118046b64f", "loai": "phu", "ngay": "2026-11-23", "lop_id": "76d237de-b44c-46bf-ba95-e3233ccf528c", "bat_dau": "20:30:00", "ghi_chu": null, "ket_thuc": "21:30:00", "lop_nghi": false}
1519	2026-11-25 14:44:51.355801+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Lê Ngọc Vy	{"ngay_vao": ["2026-11-01", "2026-11-22"]}
1529	2026-11-25 15:44:53.223288+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Anh Tuấn · Ca 18-20 T4 · 11/11/2026	{"buoi_id": "a1c02c20-6317-4d61-ba6b-656c1156c884", "don_gia": 100000, "tro_giang_id": "69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed"}
1285	2026-11-21 11:17:14.221795+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Bùi Ngọc Hà	{"link_zalo": [null, "https://zalo.me/g/uvqw50szeba9aqcj2yuy"]}
1297	2026-11-21 11:28:01.543748+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Ánh Long	{"link_zalo": [null, "https://zalo.me/g/c4nefj98lxkx9coet0jh"]}
1309	2026-11-23 06:25:31.01733+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	xoa	test · Lớp ielts cơ bản cn · 22/11/2026	{"buoi_id": "896a645c-e7c4-4117-940f-d49b23298936", "don_gia": 1000000, "tro_giang_id": "8f2ca2fa-e36b-4f1c-89a0-aade2484f779"}
1320	2026-11-23 09:57:41.37601+00	\N	\N	hoc_sinh	sua	Ngọc Minh	{"sticker_dau_ky": [0, 43]}
1330	2026-11-23 09:57:43.357232+00	\N	\N	hoc_sinh	sua	Bảo Hân	{"sticker_dau_ky": [0, 68]}
1340	2026-11-23 09:57:45.181156+00	\N	\N	hoc_sinh	sua	Hà Đoàn Nhật Hoàng	{"sticker_dau_ky": [0, 311]}
1350	2026-11-23 09:57:46.502627+00	\N	\N	hoc_sinh	sua	Lê Minh Huy	{"sticker_dau_ky": [0, 248]}
1360	2026-11-23 09:57:47.859277+00	\N	\N	hoc_sinh	sua	Nguyễn Thế Hiếu	{"sticker_dau_ky": [0, 514]}
1370	2026-11-23 09:57:50.227584+00	\N	\N	hoc_sinh	sua	Phạm Trí Thành	{"sticker_dau_ky": [0, 20]}
1380	2026-11-23 09:57:51.934053+00	\N	\N	hoc_sinh	sua	Vũ Dương Bảo An	{"sticker_dau_ky": [0, 77]}
1385	2026-11-23 10:27:19.47986+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1395	2026-11-23 10:33:44.18158+00	\N	\N	hoc_sinh	sua	Hải Hiếu	{"sticker_dau_ky": [30, 0]}
1410	2026-11-23 10:33:47.519904+00	\N	\N	hoc_sinh	sua	Trịnh Ngọc Bảo Anh	{"sticker_dau_ky": [176, 165]}
1420	2026-11-23 10:33:49.569458+00	\N	\N	hoc_sinh	sua	Lê Danh Gia Bảo	{"sticker_dau_ky": [119, 108]}
1430	2026-11-23 10:33:51.49629+00	\N	\N	hoc_sinh	sua	Trần Gia Bảo	{"sticker_dau_ky": [147, 125]}
1440	2026-11-23 10:33:52.972774+00	\N	\N	hoc_sinh	sua	Lê Minh Huy	{"sticker_dau_ky": [248, 221]}
1450	2026-11-23 10:33:54.824739+00	\N	\N	hoc_sinh	sua	Đỗ Hoàng Thùy	{"sticker_dau_ky": [68, 58]}
1483	2026-11-23 11:59:43.277749+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1497	2026-11-23 13:23:33.803857+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1511	2026-11-24 05:00:06.606744+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1520	2026-11-25 14:44:51.550541+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	xoa	Lê Ngọc Vy · Ca 18-20 T4	{"id": "a092e517-0097-42da-8ef4-5cee324bf971", "lop_id": "4e49d265-ef05-4457-8c75-ff435e266182", "tao_luc": "2026-11-25T13:51:04.36655+00:00", "ngay_vao": "2026-11-25", "trang_thai": "dang_hoc", "hoc_sinh_id": "9706bbdf-ef70-4ea9-950c-f8062c4ac033", "don_gia_rieng": null}
1521	2026-11-25 14:46:58.231663+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Minh Dương · Lớp ielts cơ bản cn · 22/11/2026	{"buoi_id": "896a645c-e7c4-4117-940f-d49b23298936", "don_gia": 100000, "tro_giang_id": "877e2be5-c648-4abe-b7a6-8ceff0df9d68"}
1530	2026-11-25 15:44:54.605113+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Thành · Ca 18-20 T4 · 11/11/2026	{"buoi_id": "a1c02c20-6317-4d61-ba6b-656c1156c884", "don_gia": 100000, "tro_giang_id": "d45793f2-33af-41bf-91e4-410cf31087cc"}
1286	2026-11-21 11:17:41.714828+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	hoc_sinh	sua	Hà Đoàn Nhật Hoàng 	{"link_zalo": [null, "https://zalo.me/g/ndhnrkrskkjgirptjbd8"]}
1298	2026-11-21 12:41:15.190206+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1310	2026-11-23 06:25:44.904906+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	test · Ca tối t2: 18-20 · 23/11/2026	{"buoi_id": "f2baa976-58d4-4609-9331-5947c40c4df7", "don_gia": 1000000, "tro_giang_id": "8f2ca2fa-e36b-4f1c-89a0-aade2484f779"}
733	2026-11-21 04:25:44.427848+00	8f2ca2fa-e36b-4f1c-89a0-aade2484f779	test	tai_khoan	sua	test	{"phai_doi_mat_khau": [true, false]}
1321	2026-11-23 09:57:41.520907+00	\N	\N	hoc_sinh	sua	Trung Dũng	{"sticker_dau_ky": [0, 103]}
1331	2026-11-23 09:57:43.530792+00	\N	\N	hoc_sinh	sua	Bùi Ngọc Hà	{"sticker_dau_ky": [0, 235]}
1341	2026-11-23 09:57:45.302497+00	\N	\N	hoc_sinh	sua	Hoàng Diệu Linh	{"sticker_dau_ky": [0, 190]}
1351	2026-11-23 09:57:46.624787+00	\N	\N	hoc_sinh	sua	Lê Tiến Anh	{"sticker_dau_ky": [0, 458]}
1361	2026-11-23 09:57:47.98223+00	\N	\N	hoc_sinh	sua	Nguyễn Thị Ngọc	{"sticker_dau_ky": [0, 49]}
1371	2026-11-23 09:57:50.352786+00	\N	\N	hoc_sinh	sua	Ngô Thảo Chi	{"sticker_dau_ky": [0, 111]}
1381	2026-11-23 09:57:52.061911+00	\N	\N	hoc_sinh	sua	Vũ Hải Hà	{"sticker_dau_ky": [0, 40]}
1386	2026-11-23 10:31:29.104609+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	xoa	Lê Thị Anh Thư · Ca tối t2: 18-20	{"id": "5e13564d-f6f9-4fce-9968-9a36f1906b93", "lop_id": "3aec8da8-00ec-454d-bfb1-d63fb936e5f9", "tao_luc": "2026-11-20T12:05:50.001283+00:00", "ngay_vao": "2026-11-01", "trang_thai": "dang_hoc", "hoc_sinh_id": "8605edcb-76d1-4391-9739-fcbf0bc389a1", "don_gia_rieng": null}
1396	2026-11-23 10:33:44.549236+00	\N	\N	hoc_sinh	sua	Hoàng Tuấn	{"sticker_dau_ky": [30, 0]}
1409	2026-11-23 10:33:47.389278+00	\N	\N	hoc_sinh	sua	Ngô Thảo Chi	{"sticker_dau_ky": [111, 62]}
1419	2026-11-23 10:33:49.416568+00	\N	\N	hoc_sinh	sua	Hoàng Trung Hải	{"sticker_dau_ky": [83, 56]}
1429	2026-11-23 10:33:51.358236+00	\N	\N	hoc_sinh	sua	Phạm Nhật Linh (Sam)	{"sticker_dau_ky": [184, 163]}
1439	2026-11-23 10:33:52.847722+00	\N	\N	hoc_sinh	sua	Lê Duy Anh	{"sticker_dau_ky": [22, 6]}
1449	2026-11-23 10:33:54.704938+00	\N	\N	hoc_sinh	sua	Đặng An Bình	{"sticker_dau_ky": [63, 55]}
1484	2026-11-23 12:08:55.261398+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	ghi_danh	xoa	tuan · test	{"id": "71b816ac-2cfd-4455-bed9-ea85e1b355ca", "lop_id": "83fb20a4-7e02-491c-84a1-5958f3fd9f55", "tao_luc": "2026-11-23T08:13:55.906553+00:00", "ngay_vao": "2026-11-23", "trang_thai": "dang_hoc", "hoc_sinh_id": "2989caff-fdc5-4bae-83f9-6fc5cdf40ef2", "don_gia_rieng": null}
1485	2026-11-23 12:08:55.261398+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	xoa	test · 07/11/2026	{"id": "5784f080-fe41-4661-9ab0-e7f3fda09fc7", "loai": "lich", "ngay": "2026-11-07", "lop_id": "83fb20a4-7e02-491c-84a1-5958f3fd9f55", "bat_dau": "17:55:00", "ghi_chu": null, "ket_thuc": "19:55:00", "lop_nghi": false}
1486	2026-11-23 12:08:55.261398+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	xoa	test · 14/11/2026	{"id": "35ae820f-72e9-46ef-a786-e9ad9c95a333", "loai": "lich", "ngay": "2026-11-14", "lop_id": "83fb20a4-7e02-491c-84a1-5958f3fd9f55", "bat_dau": "17:55:00", "ghi_chu": null, "ket_thuc": "19:55:00", "lop_nghi": false}
1487	2026-11-23 12:08:55.261398+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	xoa	test · 21/11/2026	{"id": "da913556-56bb-4a24-8a89-3483b4aac513", "loai": "lich", "ngay": "2026-11-21", "lop_id": "83fb20a4-7e02-491c-84a1-5958f3fd9f55", "bat_dau": "17:55:00", "ghi_chu": null, "ket_thuc": "19:55:00", "lop_nghi": false}
1488	2026-11-23 12:08:55.261398+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	buoi_hoc	xoa	test · 28/11/2026	{"id": "cb423108-4e1d-4f39-82af-397f9322acf3", "loai": "lich", "ngay": "2026-11-28", "lop_id": "83fb20a4-7e02-491c-84a1-5958f3fd9f55", "bat_dau": "17:55:00", "ghi_chu": null, "ket_thuc": "19:55:00", "lop_nghi": false}
1489	2026-11-23 12:08:55.261398+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	lop	xoa	test	{"id": "83fb20a4-7e02-491c-84a1-5958f3fd9f55", "gio": null, "ten": "test", "lich": [6], "don_gia": 0, "gio_thu": {"6": {"bd": "17:55", "kt": "19:55"}}, "tao_luc": "2026-11-23T08:13:11.974913+00:00", "hoat_dong": true}
1498	2026-11-23 13:26:54.578754+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1512	2026-11-24 13:30:31.769019+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tai_khoan	dang_nhap	Quản trị	\N
1522	2026-11-25 14:50:48.15274+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Thiên Nga · Lớp mix chiều cn · 22/11/2026	{"buoi_id": "7e26a780-214a-4c13-8a28-7f897936eec2", "don_gia": 100000, "tro_giang_id": "906a5d63-7289-4b55-a279-ff8db9b1a5c4"}
1531	2026-11-25 15:47:58.302151+00	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	tro_giang_buoi	them	Thành · Cấp 1 Ca 18-20 t5 · 05/11/2026	{"buoi_id": "eea2018b-766f-4172-aefc-f89454e11876", "don_gia": 100000, "tro_giang_id": "d45793f2-33af-41bf-91e4-410cf31087cc"}
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
-- Data for Name: sticker_cong_tru; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."sticker_cong_tru" ("id", "hoc_sinh_id", "so", "ly_do", "ngay", "nguoi", "ten_nguoi", "tao_luc") FROM stdin;
818ee0b6-07c3-409b-836b-5df5c60da957	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	1	\N	2026-11-21	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-21 02:50:21.724338+00
e16e6279-ff6c-4697-ba2d-908baea496ef	b64ca36c-4f68-4afd-ac90-9f3a5fbe6381	-1	Đổi quà	2026-11-21	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-21 02:50:27.538791+00
d4749940-5fb2-4e3f-bdde-2bbf84b6d8e8	e3906889-be7a-483c-a548-52c80afb47e7	-56	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:29:03.860981+00
df522537-3680-42c6-8106-c13cc2099e95	9649475f-b209-4855-8e4f-f991a3ccce82	-60	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:29:22.847383+00
0e43f7d5-68ae-458a-b336-188f2c6fc9e1	ecfde36a-3d8b-458a-88bd-3dee5c89cdd4	-50	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:29:37.728911+00
e259e0ef-bf4b-4bfe-8ade-6d1c1722a888	6ef103a4-fc2b-4fc6-bb1a-e113033e7f91	-80	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:29:52.229865+00
0f3fa630-7c6c-49ed-8ec5-e99a02a37c1e	1555600c-8358-42eb-b9f3-611dbeab3641	-60	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:30:04.01465+00
bbf86199-1e17-4ad4-a10f-e2523c3d6824	dab1cbd9-52d2-4fe6-a8a5-fe25b56ad8b4	-70	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:30:18.889108+00
e020e6eb-34af-4b85-9cf8-559b6c5adb74	552de5e9-d599-4a8e-ace8-d80518dfe059	-70	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:30:29.858335+00
80e5836b-54bb-414c-a858-3ceaf28cc933	ff386fd8-15b5-42a0-b103-536c60684008	-70	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:30:42.643418+00
0252b598-f1ef-446a-8da0-d432d6ba5ed8	f85931d6-9ede-45a1-acde-ba4789c6e853	-66	Đổi quà	2026-11-23	43d2ab0d-e902-49d7-9e81-a3696d296ad2	Quản trị	2026-11-23 13:31:49.666462+00
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
2a9b49fe-888a-4327-9b2b-92cf74c0ffad	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
81a08445-8690-4ba5-9fc5-2331ede97bb5	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
62dbfa7c-dc48-49a3-b20b-1fee55d37758	877e2be5-c648-4abe-b7a6-8ceff0df9d68	100000
8779134c-3ec1-43b0-9894-355f8396c452	7925dcdb-7311-4634-896a-b4b6386b2df2	100000
8779134c-3ec1-43b0-9894-355f8396c452	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
0eba43b0-5e48-4b58-ab43-c4a54bb92958	7925dcdb-7311-4634-896a-b4b6386b2df2	100000
0eba43b0-5e48-4b58-ab43-c4a54bb92958	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
eea2018b-766f-4172-aefc-f89454e11876	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
88e99a85-3d79-46e3-b5f4-e5caa7817535	877e2be5-c648-4abe-b7a6-8ceff0df9d68	100000
88e99a85-3d79-46e3-b5f4-e5caa7817535	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
fee61361-bad6-4261-9696-09b6fcdc5209	877e2be5-c648-4abe-b7a6-8ceff0df9d68	100000
fe2e618b-207f-4e12-85a5-869a5a678c89	7925dcdb-7311-4634-896a-b4b6386b2df2	100000
fe2e618b-207f-4e12-85a5-869a5a678c89	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
fe2e618b-207f-4e12-85a5-869a5a678c89	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	7925dcdb-7311-4634-896a-b4b6386b2df2	100000
e7fd6d88-4cb3-47f6-b23f-ac1170050a38	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
99c06620-cdb1-41cc-b9b6-cc2cadb351dc	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
45a23d78-e0da-44ae-9568-b0865bd1bc0f	877e2be5-c648-4abe-b7a6-8ceff0df9d68	100000
45a23d78-e0da-44ae-9568-b0865bd1bc0f	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
e06f0275-a6f0-42f0-9f1d-963713a5120a	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
152f232d-a41b-49ba-906c-68151d28d4a1	877e2be5-c648-4abe-b7a6-8ceff0df9d68	100000
78ddc48c-fcce-40b2-a990-7881b7cebe73	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
78ddc48c-fcce-40b2-a990-7881b7cebe73	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
6b2d9128-7127-45f0-8f82-081aa3ff0759	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
6b2d9128-7127-45f0-8f82-081aa3ff0759	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
f2baa976-58d4-4609-9331-5947c40c4df7	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
f2baa976-58d4-4609-9331-5947c40c4df7	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
804fbd08-2178-4c1a-9c0a-293b1ca0462a	d45793f2-33af-41bf-91e4-410cf31087cc	100000
804fbd08-2178-4c1a-9c0a-293b1ca0462a	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	100000
896a645c-e7c4-4117-940f-d49b23298936	877e2be5-c648-4abe-b7a6-8ceff0df9d68	100000
7e26a780-214a-4c13-8a28-7f897936eec2	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
7e26a780-214a-4c13-8a28-7f897936eec2	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
7546fba6-4be9-440e-9ab2-c379d4c471e9	9b8a626d-c10d-443e-adcf-8b152a9b6c90	50000
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	100000
b5d93120-96a2-4b6a-8ed4-3042aa4624cf	d45793f2-33af-41bf-91e4-410cf31087cc	100000
a1c02c20-6317-4d61-ba6b-656c1156c884	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	100000
f6e57378-f553-452e-9d0c-3cd5920181c2	8b0b82af-8eee-477b-bc50-b5c72837c2f7	50000
92b3cab2-5ac5-48d8-a4a8-9b189028353a	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	100000
92b3cab2-5ac5-48d8-a4a8-9b189028353a	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
71e54043-f25e-48e8-873d-9f249bd6150c	d45793f2-33af-41bf-91e4-410cf31087cc	100000
71e54043-f25e-48e8-873d-9f249bd6150c	906a5d63-7289-4b55-a279-ff8db9b1a5c4	100000
a1c02c20-6317-4d61-ba6b-656c1156c884	d45793f2-33af-41bf-91e4-410cf31087cc	100000
eea2018b-766f-4172-aefc-f89454e11876	d45793f2-33af-41bf-91e4-410cf31087cc	100000
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	100000
c0f883fc-0857-4b2b-bc18-2e057ddde6a7	877e2be5-c648-4abe-b7a6-8ceff0df9d68	100000
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
ab21adff-595e-4e24-b531-330c50173d99	anh	buoi/2a9b49fe-888a-4327-9b2b-92cf74c0ffad/0d11d290-af2d-40e7-8448-eef0256e935f.jpg	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	2026-11-21 10:09:21.271552+00	2026-11-21 10:09:21.271552+00	2026-11-21 10:09:21.271552+00	{"eTag": "\\"4679075009a8f8561fb8d11e38c7956c\\"", "size": 208919, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-21T10:09:22.000Z", "contentLength": 208919, "httpStatusCode": 200}	6bcdeee6-6aae-4dcb-b111-c385c9ab686d	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	{}	\N	f	f
da331209-373c-4e67-988f-3705213411ce	anh	avatar/e561c6d5-6fbc-462a-ab2e-e1423f3b692f-1794922166340.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:29:26.55453+00	2026-11-17 13:29:26.55453+00	2026-11-17 13:29:26.55453+00	{"eTag": "\\"37c383c52df93dfade9f5cd18b8d6d1c\\"", "size": 31871, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:29:27.000Z", "contentLength": 31871, "httpStatusCode": 200}	541c4b5f-aa92-4574-a2fc-0906ab05f3ac	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
66330ff4-1eb2-4a28-b7ee-c34326daf455	anh	buoi/f6e57378-f553-452e-9d0c-3cd5920181c2/90519080-c18d-407c-a4ea-b97c733a9440.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:36:49.224042+00	2026-11-17 13:36:49.224042+00	2026-11-17 13:36:49.224042+00	{"eTag": "\\"c4517f2c1fc1fc4aaf3f9b6e5b31aade\\"", "size": 519296, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:36:50.000Z", "contentLength": 519296, "httpStatusCode": 200}	77ed8b9f-38d4-4e61-9920-53d810327588	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
d7b51017-3ef4-42d6-8c5f-ec250851393b	anh	avatar/eaff414d-ac8c-44a0-9ed3-483992927fb9-1794998386874.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:39:47.476031+00	2026-11-18 10:39:47.476031+00	2026-11-18 10:39:47.476031+00	{"eTag": "\\"be1dad01a7d2110eae8f05b10462a840\\"", "size": 32325, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:39:48.000Z", "contentLength": 32325, "httpStatusCode": 200}	2a4805ad-64af-449e-bf76-cf8c3b143c0a	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
04ff0e5c-432a-425a-b419-964802d57adb	anh	avatar/bc4166c1-2a49-43d1-9769-f752dcc2d91c-1794998426835.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:40:27.278732+00	2026-11-18 10:40:27.278732+00	2026-11-18 10:40:27.278732+00	{"eTag": "\\"d5d0b6710da7bda234c727bc0ed7e1e2\\"", "size": 34809, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:40:28.000Z", "contentLength": 34809, "httpStatusCode": 200}	044db24d-8daa-4bb2-8739-68bbb64b92cd	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
b47269c4-29bd-4a10-b4a1-a9740bdd1d66	anh	avatar/a409e2ce-01c6-49e8-bbdf-5caf4477db1e-1794998465030.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:41:05.606162+00	2026-11-18 10:41:05.606162+00	2026-11-18 10:41:05.606162+00	{"eTag": "\\"e24c1585b6f5a94deafdcd2edd2638c1\\"", "size": 31377, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:41:06.000Z", "contentLength": 31377, "httpStatusCode": 200}	e0f6d570-1471-4fd7-9250-f6fcc6875b9f	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
3434da4c-8418-4710-bf8f-99e493548075	anh	avatar/47286437-2fcd-451e-b01f-c19e8cbbcbef-1794998506091.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:41:46.434226+00	2026-11-18 10:41:46.434226+00	2026-11-18 10:41:46.434226+00	{"eTag": "\\"320a6cdd3b38484b6c1090a5ff33479d\\"", "size": 45661, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:41:47.000Z", "contentLength": 45661, "httpStatusCode": 200}	616723e6-430b-4e46-a15a-61e998cb8448	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
06c54237-6348-4026-8891-432c316a25a9	anh	buoi/81a08445-8690-4ba5-9fc5-2331ede97bb5/36ed64de-d62b-47f1-b3d6-f48e23b3a534.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-21 13:09:27.913895+00	2026-11-21 13:09:27.913895+00	2026-11-21 13:09:27.913895+00	{"eTag": "\\"9934443a3cdec5aa582629f758fd6fe8\\"", "size": 558837, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-21T13:09:28.000Z", "contentLength": 558837, "httpStatusCode": 200}	0505fc0d-bfec-4493-b135-248c95487e59	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
8cfc351b-0dd8-493c-9f17-e0f5a57fa85f	anh	avatar/e83a1cf4-c38e-4ddc-acd0-ff0fb166c6af-1795000095271.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:08:16.349002+00	2026-11-18 11:08:16.349002+00	2026-11-18 11:08:16.349002+00	{"eTag": "\\"c38a1368930413b39808bfe9302dbde2\\"", "size": 60865, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:08:17.000Z", "contentLength": 60865, "httpStatusCode": 200}	efbde369-3292-4cc9-83b1-901f7bffcb91	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
53514b5c-4ed8-4713-8657-8c4a8c45fb8b	anh	buoi/c0f883fc-0857-4b2b-bc18-2e057ddde6a7/7ee96fbf-f995-40cf-b4b4-507406311607.jpg	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	2026-11-20 15:05:34.911506+00	2026-11-20 15:05:34.911506+00	2026-11-20 15:05:34.911506+00	{"eTag": "\\"9c4f2993e03054518ff437dfac594f9b\\"", "size": 234238, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-20T15:05:35.000Z", "contentLength": 234238, "httpStatusCode": 200}	ac13dd70-1f31-46a5-bc57-c661463f1558	77ffcb33-c53a-41b3-a728-f1fdb13cc37b	{}	\N	f	f
455cfdac-3905-44d2-a7cb-a9698add2fa0	anh	buoi/2d39d3bf-403a-4add-b335-932f3f0f7f67/176a4a28-14b5-453c-9076-57de30913a5e.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-21 04:29:22.523063+00	2026-11-21 04:29:22.523063+00	2026-11-21 04:29:22.523063+00	{"eTag": "\\"b94892eb2c414ee7ab3548b05f2f2119\\"", "size": 497611, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-21T04:29:23.000Z", "contentLength": 497611, "httpStatusCode": 200}	a3259883-b1b6-4e3e-b431-abaa4ffde440	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
6c738786-5fc0-4583-8a0d-ba0ee364c4fb	anh	avatar/09426ac0-e7af-47bc-a029-195fcee72b46-1794921820760.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:23:41.263151+00	2026-11-17 13:23:41.263151+00	2026-11-17 13:23:41.263151+00	{"eTag": "\\"af664b57be1ffcd181441f47b255b0bc\\"", "size": 29581, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:23:42.000Z", "contentLength": 29581, "httpStatusCode": 200}	414fdadb-e697-4f5f-94df-34dded287fde	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
cb0fdf70-da6b-4389-aa9b-14f4914db27d	anh	avatar/2a71aebf-2868-4496-8c0d-26a9c5fdac6d-1794921883142.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:24:43.360443+00	2026-11-17 13:24:43.360443+00	2026-11-17 13:24:43.360443+00	{"eTag": "\\"ec06d6c193de9b68544745b1a4ba9d01\\"", "size": 27786, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:24:44.000Z", "contentLength": 27786, "httpStatusCode": 200}	3aa7df80-697e-4384-9c74-840b56035a86	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
9a930db9-6a42-4e88-a6c7-400228817384	anh	avatar/6125884c-53f0-45ee-a303-3d03bc111254-1794921934570.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:25:34.918926+00	2026-11-17 13:25:34.918926+00	2026-11-17 13:25:34.918926+00	{"eTag": "\\"7e5447db38a6128e82d50c27666b3fea\\"", "size": 61998, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:25:35.000Z", "contentLength": 61998, "httpStatusCode": 200}	8a01a39c-a2b2-4bbf-8bc8-53cf6f09d729	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
1635fd4c-74cc-416e-b363-0b1b63fe4f14	anh	avatar/98deb901-bd60-4e1a-94c1-0ab944440ecb-1794921993396.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:26:33.652882+00	2026-11-17 13:26:33.652882+00	2026-11-17 13:26:33.652882+00	{"eTag": "\\"4954bafc7818a1c79515c8f7f40c05cb\\"", "size": 49024, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:26:34.000Z", "contentLength": 49024, "httpStatusCode": 200}	28225600-b907-473d-8e0d-6177f232c176	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
f5345400-d925-48f5-9a02-3694909f3d8a	anh	avatar/1b364415-27c0-4528-b772-6f9331702874-1794922033355.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:27:13.56512+00	2026-11-17 13:27:13.56512+00	2026-11-17 13:27:13.56512+00	{"eTag": "\\"1f384a634367b343c7fa9b4f2da9a05d\\"", "size": 22690, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:27:14.000Z", "contentLength": 22690, "httpStatusCode": 200}	e4a7ddec-0a11-4cfe-8666-cb918cbfddb5	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
31841a69-d1fd-46d3-8b68-826877ad34b9	anh	avatar/9c5e27df-2361-46d3-9551-92dc6109c2f5-1794922065703.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-17 13:27:46.01517+00	2026-11-17 13:27:46.01517+00	2026-11-17 13:27:46.01517+00	{"eTag": "\\"104ac3a775c1f2850f04dd989c6771b8\\"", "size": 62037, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-17T13:27:46.000Z", "contentLength": 62037, "httpStatusCode": 200}	4afaed50-abef-4747-8574-513c8dbae2b8	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
aae1fd4b-fe1c-4180-ac25-c0926feaa062	anh	avatar/33a3cfe1-6ebb-46fb-b851-4282d579a315-1794998542956.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:42:23.382259+00	2026-11-18 10:42:23.382259+00	2026-11-18 10:42:23.382259+00	{"eTag": "\\"6a22dfe46447998b929cbe9dca758718\\"", "size": 42188, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:42:24.000Z", "contentLength": 42188, "httpStatusCode": 200}	283e3c06-1867-4d03-bbda-f75825f9d20c	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
2330d943-fed7-464d-b9ec-b73687edc7cd	anh	avatar/a6071b67-2130-479d-9960-be9b713e379d-1794998592009.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:43:12.462365+00	2026-11-18 10:43:12.462365+00	2026-11-18 10:43:12.462365+00	{"eTag": "\\"7f1d08d51a47a50983637868a5bf7a25\\"", "size": 44575, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:43:13.000Z", "contentLength": 44575, "httpStatusCode": 200}	6d383ff7-c865-45b7-949d-eb52728e64c8	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
6400921c-3c89-489f-b024-220362bc462e	anh	buoi/f2baa976-58d4-4609-9331-5947c40c4df7/63caa467-acdf-4480-af0b-0ad9c8463d98.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-23 13:24:04.994313+00	2026-11-23 13:24:04.994313+00	2026-11-23 13:24:04.994313+00	{"eTag": "\\"f8a32ae50ae10abb4fa779ab6c7ac6f2\\"", "size": 578148, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-23T13:24:05.000Z", "contentLength": 578148, "httpStatusCode": 200}	1b11df16-7eb9-4771-ac1b-c792f3ca2ad5	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
e9fbdc1c-cf74-41e8-9e32-5c32b2635195	anh	avatar/e3906889-be7a-483c-a548-52c80afb47e7-1794998686016.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:44:46.651832+00	2026-11-18 10:44:46.651832+00	2026-11-18 10:44:46.651832+00	{"eTag": "\\"bdad5cdb7d86c96195e0f1d428b3efa6\\"", "size": 37287, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:44:47.000Z", "contentLength": 37287, "httpStatusCode": 200}	ca951f6e-b905-4ffc-a3eb-c029ea088b0b	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
effde8df-5396-47ec-b2ca-cbe1f80d7d89	anh	avatar/b20830c3-0747-45aa-bba0-0efd2f0cd32e-1795000307959.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 11:11:49.292144+00	2026-11-18 11:11:49.292144+00	2026-11-18 11:11:49.292144+00	{"eTag": "\\"c38a1368930413b39808bfe9302dbde2\\"", "size": 60865, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T11:11:50.000Z", "contentLength": 60865, "httpStatusCode": 200}	7a011c10-c7f5-47cd-850d-bf1eb5ff6015	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
bcab6efb-aae5-4f48-a906-c78972584dfe	anh	avatar/94c6acd3-4c22-405e-a976-d9cd63a72345-1794998722264.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:45:23.081068+00	2026-11-18 10:45:23.081068+00	2026-11-18 10:45:23.081068+00	{"eTag": "\\"8b68c58d1a31b1c8b7186e9fbb3cb4ec\\"", "size": 27748, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:45:24.000Z", "contentLength": 27748, "httpStatusCode": 200}	c6843625-61ac-40c0-bc7b-57826a3d0962	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
c8732a09-8bc1-4f71-ad97-a026db691dc3	anh	avatar/04c0644a-6490-4551-9b84-2b3e606b2f11-1794998765684.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:46:06.439564+00	2026-11-18 10:46:06.439564+00	2026-11-18 10:46:06.439564+00	{"eTag": "\\"1b2fcdcacb62cfa6c667692cbb58d27c\\"", "size": 40478, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:46:07.000Z", "contentLength": 40478, "httpStatusCode": 200}	997674db-a944-43d1-9d48-01839ec943e3	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
7b702705-ad0b-451d-a98b-6233e01496e5	anh	avatar/2b4945ec-cae0-46dc-a0a4-805242d96727-1795236615764.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-21 04:50:16.721075+00	2026-11-21 04:50:16.721075+00	2026-11-21 04:50:16.721075+00	{"eTag": "\\"94bb973b48f85e26a10a739a4b232312\\"", "size": 2707, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-21T04:50:17.000Z", "contentLength": 2707, "httpStatusCode": 200}	aac237cb-b82a-451f-b4fc-8601f5d2d047	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
d54dce0e-1875-40bb-9bdb-fb68b066c3a5	anh	buoi/5953209e-2472-4fb7-916a-b242ad4fa5d3/59939fac-07da-4db6-8bc2-d3ee2e1a66b2.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-21 04:50:23.573755+00	2026-11-21 04:50:23.573755+00	2026-11-21 04:50:23.573755+00	{"eTag": "\\"8d3f5d6ca3e5c44b0ead49f327ed2837\\"", "size": 14639, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-21T04:50:24.000Z", "contentLength": 14639, "httpStatusCode": 200}	77c00817-f2d7-413a-8f20-f3310a8643f1	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
8e1e902a-05e2-4c6c-a0ab-d2dc34092112	anh	avatar/7c7fc404-3d84-4d6b-8972-3926976216f4-1794998800089.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-18 10:46:40.592421+00	2026-11-18 10:46:40.592421+00	2026-11-18 10:46:40.592421+00	{"eTag": "\\"f68352affe7f8ba939aa54cf61c33e20\\"", "size": 39961, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T10:46:41.000Z", "contentLength": 39961, "httpStatusCode": 200}	49eca5f8-f981-4665-88ef-c63be0b5d763	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
7c848c94-738a-483f-8e86-91378a983cbc	anh	buoi/c1bd29b8-3283-4974-804c-48118046b64f/708c9599-0f0c-4e7f-b221-2dcbc27b4d32.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-23 14:18:13.450618+00	2026-11-23 14:18:13.450618+00	2026-11-23 14:18:13.450618+00	{"eTag": "\\"e91a46859b0f1a1433d07ca22121aaf7\\"", "size": 438381, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-23T14:18:14.000Z", "contentLength": 438381, "httpStatusCode": 200}	25e98186-8253-4cc9-8861-314320ece8dd	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
65f70535-cba0-4890-8638-3c29eb469942	anh	buoi/804fbd08-2178-4c1a-9c0a-293b1ca0462a/febd7102-68da-47bb-8408-7436b9bcd9cb.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-25 13:15:22.458238+00	2026-11-25 13:15:22.458238+00	2026-11-25 13:15:22.458238+00	{"eTag": "\\"2bbc4b1da96d9d468ff49fddf10f9ec8\\"", "size": 666885, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-25T13:15:23.000Z", "contentLength": 666885, "httpStatusCode": 200}	bf5ec457-dc3e-4449-9b5b-52ada33e62df	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
6362f617-2bd0-4e9e-a5b4-0185ac57b79b	anh	buoi/997fe90e-6a07-4050-a18e-2c2e251643cd/e3b51695-d754-4a97-a83b-bd76ef994726.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-25 14:39:26.379469+00	2026-11-25 14:39:26.379469+00	2026-11-25 14:39:26.379469+00	{"eTag": "\\"a096577aa1ddab5de54340c27373839f\\"", "size": 359218, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-25T14:39:27.000Z", "contentLength": 359218, "httpStatusCode": 200}	21f139c0-2349-4f52-a272-92705395041b	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
00efaf16-7b0f-4282-8c63-b263f2a804c2	anh	buoi/896a645c-e7c4-4117-940f-d49b23298936/e83f827a-e74b-4cac-960b-e484948b3cab.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-25 14:50:31.652197+00	2026-11-25 14:50:31.652197+00	2026-11-25 14:50:31.652197+00	{"eTag": "\\"afd043e430dbe86ea186f94401c976b8\\"", "size": 409013, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-25T14:50:32.000Z", "contentLength": 409013, "httpStatusCode": 200}	9676a961-ca35-4959-8568-246ad55db87e	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
25fb50f0-9271-46b8-9fd6-a11be5cd9867	anh	buoi/7e26a780-214a-4c13-8a28-7f897936eec2/0dfced6d-88ed-448f-95a1-10a8282b5b43.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-25 14:54:23.250355+00	2026-11-25 14:54:23.250355+00	2026-11-25 14:54:23.250355+00	{"eTag": "\\"06b5847e9386b983e7bebf736c41f201\\"", "size": 334148, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-25T14:54:24.000Z", "contentLength": 334148, "httpStatusCode": 200}	ed272ce4-4daf-4cf9-a77d-145263688b5d	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
23e4eb0d-c6e0-44a5-876e-6336466c1308	anh	buoi/7e26a780-214a-4c13-8a28-7f897936eec2/2b7f49a9-15ec-4d5f-964e-0869d1c13a88.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-25 14:54:46.777481+00	2026-11-25 14:54:46.777481+00	2026-11-25 14:54:46.777481+00	{"eTag": "\\"efe15fd662eea5c1fdd004e750355876\\"", "size": 439948, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-25T14:54:47.000Z", "contentLength": 439948, "httpStatusCode": 200}	da6c542a-e3c9-4339-9cc9-17aef3c95ec4	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
a9971b81-8c50-4a67-9657-eb125038e646	anh	buoi/92b3cab2-5ac5-48d8-a4a8-9b189028353a/2c9ad16e-8d97-4db5-9b10-a08643e38e86.jpg	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	2026-11-18 12:20:49.658409+00	2026-11-18 12:20:49.658409+00	2026-11-18 12:20:49.658409+00	{"eTag": "\\"1bbc5df55c60290e44ba41c8bae027aa\\"", "size": 576396, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-18T12:20:50.000Z", "contentLength": 576396, "httpStatusCode": 200}	3b343f0a-95ce-46e1-9da4-9b961203b945	69dc8fb7-cf4b-4ce8-9dac-fe767f6968ed	{}	\N	f	f
cf860e4a-ec2f-4bbb-8626-4e4ab0c6c188	anh	buoi/b58e02fa-a696-449e-bdab-8586041d5620/141820af-28e8-457a-b1e4-a411095c240a.jpg	43d2ab0d-e902-49d7-9e81-a3696d296ad2	2026-11-20 14:42:39.737219+00	2026-11-20 14:42:39.737219+00	2026-11-20 14:42:39.737219+00	{"eTag": "\\"6ab6be1db0dd386ca407f58aa2e40b2c\\"", "size": 415997, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-11-20T14:42:40.000Z", "contentLength": 415997, "httpStatusCode": 200}	62f09cd5-3828-4b16-97fa-d1a491089bca	43d2ab0d-e902-49d7-9e81-a3696d296ad2	{}	\N	f	f
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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 793, true);


--
-- Name: hoc_sinh_ma_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."hoc_sinh_ma_seq"', 130, true);


--
-- Name: nhat_ky_chot_so_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nhat_ky_chot_so_id_seq"', 173, true);


--
-- Name: nhat_ky_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."nhat_ky_id_seq"', 1532, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict YNsDQfLRdrzh3bD2kiJ0PXlslWjwIBmvobt7m9nXXSqftO0dMiVWdRydCxXd70a

RESET ALL;

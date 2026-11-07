# Security Model

This document describes the production security controls for the portfolio CMS.

## Authentication and authorization

- **Admin access** — Supabase Auth (email/password) with middleware protection on `/admin/*`.
- **Admin allowlist** — `admin_users` table; non-allowlisted authenticated users are signed out.
- **Server actions** — All mutations call `requireAdmin()` before touching the database.
- **CSRF** — Next.js Server Actions include built-in origin checks; the contact API validates `Origin`/`Referer` in production.

## Database (Supabase RLS)

- Row Level Security is enabled on every `public` table (verified in CI).
- **Public read** — Published/visible content only (e.g. `status = 'published'`, `visible = true`).
- **Contact submissions** — No public INSERT. Inserts use the service role from `/api/contact` only (migration `20260708120000_harden_contact_submissions.sql`).
- **Admin write** — Authenticated admin policies via `is_admin()` for all CMS tables.
- **Service role** — Used only on the server for seeding, contact inserts, and rate limiting; never exposed to the client.

## Input validation and XSS

| Surface | Control |
| --- | --- |
| Contact form | Zod schema, honeypot field, length limits |
| Article/page HTML | `sanitize-html` on save and render |
| Theme custom CSS | Stripped of `</style>`, `<script>`, `@import`, `expression()` |
| Theme colors | Hex-only validation on save; re-validated at render |
| Maintenance message | HTML-escaped in middleware 503 response |
| JSON-LD | `JSON.stringify` in a script tag (no raw HTML) |

Custom scripts (Settings) are intentionally powerful and admin-only. Only paste code from trusted sources.

## Contact form abuse controls

- **No direct DB insert** — Anon clients cannot INSERT into `contact_submissions` (bypassing the API is blocked by RLS).
- **Rate limit** — 5 submissions per hashed IP per hour. Fail closed: missing service role, DB count errors, or missing IP in production are treated as rate limited.
- **Honeypot** — Hidden `company` field; bots receive silent success.
- **Origin check** — Production rejects cross-site POSTs to `/api/contact`.
- **IP storage** — IPs are hashed with `CONTACT_IP_SALT`; raw IPs are not stored.
- **Production env gate** — On Vercel production (`VERCEL_ENV=production`), the production build (`next.config.ts`) fails unless it finds `NEXT_PUBLIC_SITE_URL` (non-localhost), `SUPABASE_SERVICE_ROLE_KEY`, and `CONTACT_IP_SALT` (≥16 chars) when Supabase is configured. A failed build keeps the last good deployment live. Server boot only logs the same check: throwing there would return 500 on every server-rendered route.

## HTTP security headers

Applied globally via `next.config.ts`:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera/microphone/geolocation disabled)
- `Strict-Transport-Security` (preload-ready max-age)
- `Content-Security-Policy` (production only)

### Content-Security-Policy

The CSP is defined in `src/lib/security/headers.ts` and applied only in
production (dev/HMR needs `'unsafe-eval'`). It intentionally allows
`'unsafe-inline'` for scripts/styles and `https:` sources because CMS-configured
analytics (Plausible, GA4), Supabase, Sentry, and admin custom scripts require
runtime flexibility, and there is no per-request nonce infrastructure.

The meaningful hardening it provides:

- `object-src 'none'` — blocks plugin/embed injection
- `base-uri 'self'` — blocks `<base>` tag hijacking
- `frame-ancestors 'self'` — clickjacking protection (aligned with `X-Frame-Options`)
- `form-action 'self'` — prevents form-target hijacking
- `upgrade-insecure-requests` — forces HTTPS subresources

CMS-authored HTML is additionally sanitized server-side before render, so the
`'unsafe-inline'` script allowance is not an XSS vector for stored content.

## Crawl controls

`robots.ts` disallows `/admin` and `/api` for all user agents (even when
indexing is enabled), so admin login/dashboard routes are never indexed. When
`seo.defaultRobots` is set to noindex, the entire site is disallowed.

## Secrets and environment

Never commit `.env.local`. Required production secrets:

- `NEXT_PUBLIC_SITE_URL` (canonical production domain, not localhost)
- `SUPABASE_SERVICE_ROLE_KEY`
- `CONTACT_IP_SALT` (unique per environment, ≥16 characters)
- `ADMIN_PASSWORD` (strong, rotated after seed)
- `RESEND_API_KEY` (if email delivery is enabled)

Optional override for local verification of the production gate:

- `PORTFOLIO_ENFORCE_PRODUCTION_ENV=true`

## Monitoring

- Optional Sentry for error tracking (no intentional PII from contact forms).
- Optional Plausible/GA4 (privacy-focused / configurable in admin).

## Reporting issues

If you discover a vulnerability, email the site owner directly rather than opening a public issue with exploit details.

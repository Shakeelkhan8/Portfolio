# Phase 6 — Deployment & Operations

Production deployment on Vercel, CI/CD, optional monitoring and analytics.

## Delivered

### Vercel deployment

- **`vercel.json`** — pnpm install/build commands, Mumbai region (`bom1`), silent GitHub comments
- **Security headers** — HSTS added in `next.config.ts` (alongside Phase 5 headers)
- **Environment-driven site URL** — set `NEXT_PUBLIC_SITE_URL` in Vercel for correct metadata, sitemap, and RSS

### CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml`:

| Job | Steps |
| --- | --- |
| **quality** | typecheck → lint → unit tests → build |
| **e2e** | Playwright smoke tests (after quality passes) |

Triggers on push and pull requests to `main`. Uses pnpm with Node 20.

### Sentry (optional)

Error monitoring and session replay when env vars are set. **Disabled by default** — no DSN means zero overhead.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | Client | Browser error capture + replay |
| `SENTRY_DSN` | Server / Edge | API and server component errors |
| `SENTRY_ORG` | Build | Source map upload org slug |
| `SENTRY_PROJECT` | Build | Source map upload project slug |
| `SENTRY_AUTH_TOKEN` | Build (secret) | Upload source maps on deploy |

Files:

- `src/instrumentation.ts` — server/edge registration
- `src/instrumentation-client.ts` — client init + replay
- `sentry.server.config.ts` / `sentry.edge.config.ts`
- `src/app/global-error.tsx` — root error boundary
- `next.config.ts` — wraps with `withSentryConfig` when build token is present
- Tunnel route at `/monitoring` (ad-blocker bypass)

### Plausible Analytics (optional)

Privacy-focused, cookieless analytics via `src/components/analytics/plausible-analytics.tsx`.

Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to your production domain (e.g. `shakeelkhan.dev`). Script is not loaded when unset.

### Privacy policy

Updated `/privacy` to describe Plausible and Sentry when enabled.

---

## Deployment checklist

### 1. Connect Vercel to GitHub

1. Import `Shakeelkhan8/portfolio` at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Next.js** (auto-detected)
3. Root directory: `.`
4. Vercel reads `vercel.json` for install/build commands

Preview deployments are created automatically for every PR. Production deploys on merge to `main`.

### 2. Environment variables (Vercel dashboard)

**Required for production:**

| Variable | Example | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Must match live URL |

**Recommended:**

| Variable | Notes |
| --- | --- |
| `RESEND_API_KEY` | Contact form email delivery |
| `CONTACT_EMAIL` | `shakeelkhan4147@gmail.com` |
| `GITHUB_TOKEN` | Higher GitHub API rate limits on `/open-source` |

**Optional monitoring:**

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Your domain in Plausible |
| `NEXT_PUBLIC_SENTRY_DSN` | From Sentry project settings |
| `SENTRY_DSN` | Same DSN for server/edge |
| `SENTRY_ORG` | Org slug for source maps |
| `SENTRY_PROJECT` | Project slug |
| `SENTRY_AUTH_TOKEN` | Build secret — [create token](https://sentry.io/settings/account/api/auth-tokens/) with `project:releases` |

Apply to **Production**, **Preview**, and **Development** as appropriate. `NEXT_PUBLIC_*` vars must be set per environment.

### 3. Custom domain

1. Vercel project → **Settings → Domains**
2. Add apex domain (e.g. `shakeelkhan.dev`) and/or `www`
3. Update DNS at your registrar per Vercel instructions
4. Set `NEXT_PUBLIC_SITE_URL` to the canonical URL
5. Update `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to match

Optional www redirect — add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.yourdomain.com" }],
      "destination": "https://yourdomain.com/:path*",
      "permanent": true
    }
  ]
}
```

### 4. Resend domain (contact form)

1. Verify your domain in [Resend](https://resend.com/domains)
2. Update the `from` address in `src/app/api/contact/route.ts` from `onboarding@resend.dev` to your verified sender

### 5. Plausible setup

1. Create site at [plausible.io](https://plausible.io)
2. Add domain matching production URL
3. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in Vercel

### 6. Sentry setup

**Quick path:** run the wizard locally, then copy env vars to Vercel:

```bash
npx @sentry/wizard@latest -i nextjs
```

**Manual path:** create a Next.js project in Sentry, copy DSN, set env vars listed above.

Verify after deploy: trigger a test error and confirm it appears in the Sentry Issues dashboard.

### 7. Enable GitHub Actions

CI runs automatically once `.github/workflows/ci.yml` is on `main`. No secrets required for quality checks and E2E.

For Vercel CLI deploys from CI (optional alternative to Git integration), add secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Git integration is recommended for this portfolio — CI handles validation; Vercel handles deploy.

---

## Commands

| Command | Description |
| --- | --- |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests |
| `pnpm test:e2e` | E2E smoke tests (requires build) |

---

## Next step

**Phase 7** — Content strategy: real project case studies, technical writing, resume PDF.

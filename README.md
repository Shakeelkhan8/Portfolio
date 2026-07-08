# Portfolio

Personal portfolio site for [Shakeel Khan](https://github.com/Shakeelkhan8) — Senior Backend Engineer. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Supabase CMS.

**New to this project?** Start with the [Complete Setup & Deployment Guide](./docs/GUIDE.md) — step-by-step instructions for installation, configuration, customization, and deployment.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui (Base UI)
- **CMS:** Supabase (Postgres, Auth, Storage)
- **Email:** Resend (contact form)
- **Monitoring:** Sentry (optional), Plausible / GA4 (optional, CMS-configured)
- **Testing:** Vitest (unit), Playwright (E2E)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Supabase project (for CMS admin and dynamic content)

### Install and run

```bash
pnpm install
cp .env.example .env.local
# Configure Supabase + optional Resend keys in .env.local
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical site URL for metadata, sitemap, and RSS |
| `NEXT_PUBLIC_SUPABASE_URL` | CMS | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | CMS | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | CMS/seed | Server-only key for seed, rate limits, fallbacks |
| `ADMIN_PASSWORD` | Seed | Initial admin password for `pnpm db:seed` (min 12 chars) |
| `RESEND_API_KEY` | Optional | Contact form email delivery |
| `CONTACT_EMAIL` | Optional | Recipient for contact form submissions |
| `CONTACT_IP_SALT` | Production | Salt for hashing contact submission IPs |
| `GITHUB_TOKEN` | Optional | Higher GitHub API rate limits on `/open-source` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Plausible analytics (or configure in admin Settings) |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Client-side error monitoring |
| `SENTRY_DSN` | Optional | Server-side error monitoring |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm db:seed` | Seed CMS from static content + create admin |
| `pnpm db:seed:force` | Re-seed (destructive to CMS content) |
| `pnpm analyze` | Bundle size analysis |

## Project Structure

```
src/
├── app/
│   ├── (site)/         # Public portfolio pages
│   ├── admin/          # CMS admin panel
│   └── api/            # API routes (contact)
├── components/         # UI and feature components
├── config/             # Static defaults (seed/fallback)
├── content/            # Legacy seed source (TypeScript)
├── lib/
│   ├── db/             # Supabase queries, mappers, cache
│   ├── admin/          # Server actions
│   ├── security/       # Sanitization, headers, origin checks
│   └── contact/        # Contact form services
└── types/              # Shared TypeScript types
supabase/migrations/    # SQL schema + RLS policies
docs/                   # Setup guide, admin guide, security model
```

## Documentation

- [Complete Setup & Deployment Guide](./docs/GUIDE.md) — install, configure, customize, deploy, troubleshoot
- [Admin Panel Guide](./docs/ADMIN.md) — content workflows, publishing, maintenance mode
- [Security Model](./docs/SECURITY.md) — RLS, XSS controls, rate limiting, headers

## Content model

Public pages read from Supabase with static fallbacks when the database is unavailable. Seed data originates from `src/content/` and `src/config/` via `pnpm db:seed`.

Manage after setup:

- Projects, blog, skills, experience, education, navigation
- Media library, contact inbox, site settings (SEO, theme, analytics)

## Deployment

Configured for [Vercel](https://vercel.com). CI runs typecheck, lint, unit tests, build, and Playwright smoke tests on every push/PR.

Set `NEXT_PUBLIC_SITE_URL` to your production domain. For contact email, prefer a custom-domain address in **Admin → Settings**, verify that domain in [Resend](https://resend.com), and set `RESEND_FROM` (and optionally `CONTACT_EMAIL` for delivery).

## License

Private — all rights reserved.

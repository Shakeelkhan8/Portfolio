# Portfolio

Personal portfolio site for [Shakeel Khan](https://github.com/Shakeelkhan8) — Senior Backend Engineer. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui (Base UI)
- **Motion:** Framer Motion
- **Email:** Resend (contact form)
- **Monitoring:** Sentry (optional), Plausible Analytics (optional)
- **Testing:** Vitest (unit), Playwright (E2E)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install and run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and configure as needed:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical site URL for metadata, sitemap, and RSS |
| `RESEND_API_KEY` | Optional | Contact form email delivery |
| `CONTACT_EMAIL` | Optional | Recipient for contact form submissions |
| `GITHUB_TOKEN` | Optional | Higher GitHub API rate limits on `/open-source` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Privacy-focused analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Client-side error monitoring |
| `SENTRY_DSN` | Optional | Server-side error monitoring |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Optional | Source map uploads on deploy |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Format with Prettier |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm analyze` | Bundle size analysis |

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components (layout, UI, feature-specific)
├── config/           # Site config, navigation, fonts
├── content/          # Static content (projects, experience, writing)
├── lib/              # Utilities, metadata, search, structured data
├── services/         # External service integrations (GitHub)
└── types/            # Shared TypeScript types
```

## Content

- **Projects:** `src/content/projects/index.ts`
- **Experience:** `src/content/experience.ts`
- **Writing:** `src/content/writing/index.ts`
- **Skills:** `src/content/skills.ts`

## Deployment

The site is configured for [Vercel](https://vercel.com). Push to `main` triggers CI validation; Vercel handles preview and production deploys.

Set `NEXT_PUBLIC_SITE_URL` to your production domain. For the contact form, verify your domain in [Resend](https://resend.com) and update the sender address in `src/app/api/contact/route.ts`.

## License

Private — all rights reserved.

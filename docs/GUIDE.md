# Portfolio — Complete Setup, Customization & Deployment Guide

A start-to-finish guide for setting up, configuring, customizing, and deploying
this portfolio. **No prior knowledge of the project is assumed.** If you can
copy commands into a terminal and edit a text file, you can follow this guide.

> Companion docs: [`README.md`](../README.md) (quick reference),
> [`docs/ADMIN.md`](./ADMIN.md) (day-to-day content editing), and
> [`docs/SECURITY.md`](./SECURITY.md) (security model).

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation guide](#3-installation-guide)
4. [Configuration](#4-configuration)
5. [Customization guide](#5-customization-guide)
6. [Usage guide](#6-usage-guide)
7. [Deployment guide](#7-deployment-guide)
8. [Troubleshooting](#8-troubleshooting)
9. [Maintenance](#9-maintenance)
10. [Appendix](#10-appendix)

---

## 1. Project overview

### 1.1 Purpose

This is a **personal portfolio website** for a software engineer. It presents
projects/case studies, blog articles, work experience, skills, a resume, and an
open-source showcase, plus a contact form.

Its defining feature is that it is **CMS-driven**: after the initial setup you
edit all content through a password-protected admin panel at `/admin` — you do
**not** need to touch code to change text, add a project, publish an article,
upload images, or tweak the theme. Content lives in a database; the code renders
it.

If the database is ever unavailable, the site automatically falls back to static
content bundled in the code, so the public site never goes fully blank.

### 1.2 Technologies and frameworks

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript** |
| UI library | **React 19** |
| Styling | **Tailwind CSS v4** + **shadcn/ui** (built on Base UI) |
| Database / Auth / Storage | **Supabase** (PostgreSQL, Supabase Auth, Supabase Storage) |
| Transactional email | **Resend** (contact form) |
| Error monitoring | **Sentry** (optional) |
| Web analytics | **Plausible** or **GA4** (optional, configured in admin) |
| Unit tests | **Vitest** |
| End-to-end tests | **Playwright** |
| Package manager | **pnpm** |
| Hosting | **Vercel** (recommended) |

### 1.3 Project structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── (site)/            # Public pages (home, about, projects, writing, etc.)
│   │   ├── admin/
│   │   │   ├── (auth)/        # Login, forgot/reset password
│   │   │   └── (protected)/   # Dashboard + all CMS management screens
│   │   ├── api/               # API routes (e.g. /api/contact)
│   │   ├── globals.css        # Theme tokens (colors, radii, shadows) + base styles
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   ├── robots.ts          # robots.txt (disallows /admin and /api)
│   │   ├── not-found.tsx      # 404 page
│   │   └── global-error.tsx   # Root error boundary
│   ├── components/            # UI + feature components (public and admin)
│   ├── config/                # Static defaults used for seeding + fallback
│   │   ├── site.ts            # Name, title, email, links, expertise, philosophy
│   │   ├── navigation.ts      # Nav menus + route helpers
│   │   └── fonts.ts           # Google Fonts wiring
│   ├── content/               # Static seed source: projects, writing, skills, experience
│   ├── lib/
│   │   ├── db/                # Supabase queries, mappers, cache tags, revalidation
│   │   ├── admin/             # Server actions (CRUD), pagination, reorder, auth guard
│   │   ├── security/          # HTML sanitization, security headers, CSP
│   │   ├── seed/              # Seeding logic
│   │   └── validators/        # Zod schemas
│   └── types/                 # Shared TypeScript types (incl. generated DB types)
├── supabase/
│   └── migrations/            # SQL: schema, RLS policies, storage buckets
├── scripts/
│   └── seed.ts                # Entry point for `pnpm db:seed`
├── tests/
│   ├── unit/                  # Vitest tests
│   └── e2e/                   # Playwright tests
├── docs/                      # This guide, ADMIN.md, SECURITY.md
├── .env.example               # Template for environment variables
├── next.config.ts             # Next.js config (images, headers, Sentry)
└── package.json               # Scripts + dependencies
```

### 1.4 How the pieces fit together (mental model)

```
Visitor ──▶ Next.js public pages ──▶ Supabase (published content)
                                   └▶ static fallback (if DB unavailable)

You (admin) ──▶ /admin (login) ──▶ Server Actions ──▶ Supabase (create/update/delete)
                                                     └▶ cache revalidation ──▶ public site updates
```

---

## 2. Prerequisites

### 2.1 Required software

Install these before you start:

| Tool | Minimum version | Why | Where to get it |
| --- | --- | --- | --- |
| **Node.js** | 20+ | Runs the build tooling and server | <https://nodejs.org> (LTS) |
| **pnpm** | 10+ | Package manager used by this project | `npm install -g pnpm` |
| **Git** | any recent | Clone the repo, version control | <https://git-scm.com> |
| A code editor | — | Editing config/content | e.g. VS Code / Cursor |

Verify your versions:

```bash
node -v      # should print v20.x or higher
pnpm -v      # should print 10.x or higher
git --version
```

### 2.2 Required accounts / services

| Service | Required? | Used for | Free tier? |
| --- | --- | --- | --- |
| **Supabase** | **Required** for the admin/CMS | Database, auth, file storage | Yes |
| **Resend** | Optional | Sending contact-form emails | Yes |
| **Vercel** | Recommended | Hosting the live site | Yes |
| **GitHub** | Optional | Higher API limits on `/open-source` | Yes |
| **Sentry** | Optional | Error monitoring in production | Yes |

> You can run the site locally **without** any accounts — it will use static
> fallback content. But to use the admin panel and edit content, you need a
> Supabase project.

---

## 3. Installation guide

### Step 1 — Get the code

```bash
git clone <your-repository-url> portfolio
cd portfolio
```

If you already have the folder locally, just `cd` into it.

### Step 2 — Install dependencies

```bash
pnpm install
```

This reads `package.json` and installs everything into `node_modules/`.

### Step 3 — Create your environment file

Copy the template and open the new file in your editor:

```bash
cp .env.example .env.local
```

`.env.local` is where your secret keys live. It is **git-ignored** and must
never be committed. See [Section 4.2](#42-environment-variables) for what each
value means.

> **Minimum to boot locally with a working admin:** set
> `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
> `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_PASSWORD`. See Step 4.

### Step 4 — Set up Supabase (for the CMS/admin)

1. Go to <https://supabase.com>, sign in, and **create a new project**. Choose a
   strong database password and a region close to you.
2. Wait for the project to finish provisioning (~2 minutes).
3. In the dashboard, open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **`anon` / publishable key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **`service_role` key** (keep secret!) → `SUPABASE_SERVICE_ROLE_KEY`
4. **Apply the database schema.** Open **SQL Editor** in the Supabase dashboard
   and run the migration files from `supabase/migrations/`, in order:
   1. `20260307120000_initial_schema.sql`
   2. `20260307120001_rls_policies.sql`
   3. `20260307120002_storage.sql`

   Paste the contents of each file into a new query and click **Run**. (If you
   use the Supabase CLI instead, `supabase db push` will apply them.)
5. Fill your `.env.local`:

   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
   ADMIN_EMAIL=you@example.com
   ADMIN_PASSWORD=a-strong-password-min-12-chars
   ```

### Step 5 — Seed the database and create your admin user

```bash
pnpm db:seed
```

This:

- Populates the database with the starter content from `src/content/` and
  `src/config/`.
- Creates an admin login using `ADMIN_EMAIL` + `ADMIN_PASSWORD`.

You should see a success message and `Admin user: you@example.com`.

> Re-running `pnpm db:seed` is safe — it will not overwrite existing content.
> Use `pnpm db:seed:force` **only** if you want to wipe and reset CMS content.

### Step 6 — Run the project locally

```bash
pnpm dev
```

Open:

- Public site: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin/login> (sign in with your
  `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

You now have a fully working local copy. Edit content in the admin panel and it
updates live.

---

## 4. Configuration

### 4.1 Configuration files and their purpose

| File | Purpose | When to edit |
| --- | --- | --- |
| `.env.local` | Secrets and environment settings | During setup / before deploy |
| `src/config/site.ts` | Default identity: name, title, email, social links, expertise, philosophy | Initial branding (also editable later via admin) |
| `src/config/navigation.ts` | Menu structure + internal route helpers | Adding/removing nav items in code |
| `src/config/fonts.ts` | Which Google Fonts are loaded | Changing fonts |
| `src/app/globals.css` | Theme tokens: colors, radii, shadows, light/dark palettes | Changing base colors globally |
| `next.config.ts` | Image domains, security headers, CSP, Sentry wiring | Adding image hosts, advanced tweaks |
| `supabase/migrations/*.sql` | Database schema, security policies, storage buckets | Rarely — schema changes |

### 4.2 Environment variables

Set these in `.env.local` for local development, and in your host's dashboard
for production (see [Section 7](#7-deployment-guide)).

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Production** | Canonical site URL. Used for metadata, Open Graph tags, sitemap, and RSS. Locally `http://localhost:3000`; in production your real domain. |
| `NEXT_PUBLIC_SUPABASE_URL` | **CMS** | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **CMS** | Supabase anon/publishable key (safe for the browser). Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` also works. |
| `SUPABASE_SERVICE_ROLE_KEY` | **CMS / seed** | Server-only secret key. Used by the seed script, rate limiting, and fallbacks. **Never expose to the browser.** |
| `ADMIN_EMAIL` | Seed | Email for the initial admin account (defaults to a placeholder if unset). |
| `ADMIN_PASSWORD` | **Seed** | Initial admin password. **Minimum 12 characters.** |
| `RESEND_API_KEY` | Optional | Enables contact-form email delivery via Resend. |
| `RESEND_FROM` | Optional | The "from" address, e.g. `"Portfolio <onboarding@resend.dev>"`. |
| `CONTACT_EMAIL` | Optional | Where contact submissions are emailed. |
| `CONTACT_IP_SALT` | **Production** | Random string used to hash submitter IPs (privacy). Set a unique value per environment. |
| `GITHUB_TOKEN` | Optional | A GitHub personal access token to raise API rate limits on `/open-source`. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Plausible analytics domain (or configure analytics in admin Settings). |
| `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` | Optional | Client / server error monitoring DSN. |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Optional | Needed only to upload source maps at build time. |

> **Rule of thumb:** anything prefixed `NEXT_PUBLIC_` is exposed to the browser
> and must not contain secrets. Everything else is server-only.

### 4.3 Third-party services and integrations

- **Supabase** — required for the admin/CMS. Provides the database, admin
  authentication, and file storage (media library, resume PDFs).
- **Resend** — optional. To enable contact emails: create an account, verify
  your sending domain, then set `RESEND_API_KEY`, `RESEND_FROM`, and
  `CONTACT_EMAIL`. Without it, the contact form still validates and stores
  submissions in the database (viewable in the admin inbox) but won't email you.
- **GitHub** — optional token for the `/open-source` page's live repo data.
- **Sentry** — optional error monitoring; only activates when a DSN is present.
- **Plausible / GA4** — optional analytics; can be toggled from admin
  **Settings → Analytics**.

### 4.4 Settings to change before deploying

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real domain.
- [ ] Set a strong, unique `CONTACT_IP_SALT`.
- [ ] Rotate/confirm `ADMIN_PASSWORD` is strong (you can change it after first login).
- [ ] Add production Supabase keys (a separate Supabase project for production is recommended).
- [ ] Configure Resend if you want contact emails.
- [ ] Replace the default identity in `src/config/site.ts` (or via admin) with your own.

---

## 5. Customization guide

There are **two ways** to customize:

1. **Admin panel (recommended for content)** — no code, changes apply live.
2. **Code/config files** — for branding defaults, fonts, base theme colors, and
   structural changes.

### 5.1 Update personal information

**Via admin (recommended):** sign in → **Settings → General** to edit name,
title, availability, and identity. Social links live under **Navigation**.

**Via code (seed defaults / fallback):** edit `src/config/site.ts`:

```ts
export const siteConfig = {
  name: "Your Name",
  title: "Your Role",
  description: "Your one-line intro...",
  email: "you@example.com",
  location: "Your Country",
  city: "Your City",
  timezone: "Area/City",
  links: {
    github: "https://github.com/you",
    linkedin: "https://www.linkedin.com/in/you/",
  },
  githubUsername: "you",
  // expertise, philosophy, languages, availability...
} as const;
```

> Code changes to `site.ts` affect the **seed defaults and fallback**. If you've
> already seeded and are editing content live, make the same change in the admin
> panel so it's reflected in the database.

### 5.2 Change projects, blog, skills, experience, social links

All of these are managed in the admin panel (see [`docs/ADMIN.md`](./ADMIN.md)
for full workflows):

| Content | Where in admin | Notes |
| --- | --- | --- |
| Projects / case studies | **Projects** | Publish/draft, ordering (up/down), SEO, thumbnail |
| Blog articles | **Blog** | HTML content (sanitized), tags, SEO |
| Skills | **Skills** | Categories + skills, reorderable |
| Experience | **Experience** | Roles, highlights, reorderable |
| Education / achievements | **Education** / **Achievements** | Reorderable |
| Navigation & social links | **Navigation** | Grouped: main / utility / footer / social |
| Certifications / testimonials / services | Respective screens | Reorderable, inline edit |
| Resume PDF | **Resume** | Upload PDF in Media, mark one version active |
| Open-source curation | **Open Source** | Pin/hide/override repos |

**In code (starter/fallback data):** `src/content/projects/`,
`src/content/writing/`, `src/content/skills.ts`, `src/content/experience.ts`,
and `src/config/navigation.ts`.

### 5.3 Themes, colors, fonts, images

**Colors (base theme):** edit the CSS variables in `src/app/globals.css`. Light
theme is under `:root`, dark theme under `.dark`:

```css
:root {
  --background: #fafafa;
  --foreground: #171717;
  --primary: #2563eb;     /* change your accent/brand color here */
  /* ... */
}

.dark {
  --background: #0a0a0a;
  --primary: #60a5fa;
  /* ... */
}
```

**Colors (per-site override without code):** admin **Settings → Theme** exposes
primary/accent/background colors and optional custom CSS (sanitized).

**Fonts:** edit `src/config/fonts.ts`. It imports Google Fonts via
`next/font/google`. Swap a font by importing a different one and updating the
CSS variable:

```ts
import { Inter, JetBrains_Mono } from "next/font/google";

const sans = Inter({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
```

**Images / media:** upload images, PDFs, and short videos in admin **Media**.
Assign them to projects (thumbnails), testimonials (avatars), certifications
(badges), and SEO/OG images. If you add a brand-new external image host, whitelist
it in `next.config.ts` under `images.remotePatterns`.

### 5.4 Add or remove sections

- **CMS-managed sections** (projects, blog, testimonials, services, etc.):
  simply add or delete items in the admin panel. Empty sections hide themselves
  on the public site.
- **Whole new routes/pages of custom content:** use admin **Pages** to create a
  new page at `/{slug}` with HTML content and SEO — no code needed.
- **Structural/layout changes** (new hard-coded section on the home page, new
  route with custom React): edit the relevant files under `src/app/(site)/` and
  `src/components/`. Add navigation entries in admin **Navigation** (or
  `src/config/navigation.ts`).

---

## 6. Usage guide

### 6.1 How the portfolio works

- **Public pages** are server-rendered and read published content from Supabase,
  with caching for speed. When you publish or edit content in admin, the
  relevant caches are revalidated so the public site reflects changes quickly.
- **The admin panel** (`/admin`) is protected by Supabase Auth. Only accounts in
  the admin allowlist can sign in; every change is validated, sanitized where
  needed, and recorded in an audit log.

### 6.2 Maintaining and updating content

Day-to-day, you'll spend your time in `/admin`:

1. Sign in at `/admin/login`.
2. Use the dashboard for an overview and quick actions.
3. Edit the relevant section; use **draft** vs **published** to control
   visibility.
4. Use the **up/down reorder buttons** to control display order.
5. Changes go live automatically after saving.

See [`docs/ADMIN.md`](./ADMIN.md) for detailed per-section workflows.

### 6.3 Common workflows

- **Publish a new project:** Admin → Projects → New → fill details → set status
  to **Published** → save.
- **Write an article:** Admin → Blog → New → add HTML content, excerpt, tags,
  SEO → publish.
- **Update your resume PDF:** Admin → Media → upload the PDF → Admin → Resume →
  add a version pointing to it → mark **active**.
- **Change your accent color:** Admin → Settings → Theme (or edit
  `--primary` in `globals.css`).
- **Respond to a contact message:** Admin → Contact → open the message → reply by
  email; mark read/archived.

---

## 7. Deployment guide

The project is optimized for **Vercel**. Instructions for a generic VPS are also
included. (Static hosts like GitHub Pages/Netlify-static are **not** suitable as-is
because this app uses server-side rendering, server actions, and API routes.)

### 7.1 Build process

Locally, a production build is:

```bash
pnpm build      # compiles and type-checks; outputs to .next/
pnpm start      # serves the production build on http://localhost:3000
```

Always run `pnpm build` before deploying to catch type or build errors early.

### 7.2 Production configuration

- Use a **separate Supabase project** for production (don't share dev keys).
- Apply the same migrations (`supabase/migrations/`) to the production project.
- Set all required environment variables in your host (see [4.2](#42-environment-variables)).
- Set `NEXT_PUBLIC_SITE_URL` to your production domain.
- Run the seed once against production (locally, with production env values):
  ```bash
  pnpm db:seed
  ```

### 7.3 Deploy to Vercel (recommended)

1. Push your code to GitHub/GitLab/Bitbucket.
2. Go to <https://vercel.com>, click **Add New → Project**, and import the repo.
3. Vercel auto-detects Next.js. Leave the build command as default
   (`next build`) and output as default.
4. Under **Environment Variables**, add every variable from your `.env.local`
   that applies to production (Supabase keys, `NEXT_PUBLIC_SITE_URL`,
   `CONTACT_IP_SALT`, Resend, etc.).
5. Click **Deploy**. Vercel builds and gives you a `*.vercel.app` URL.
6. (Optional) Enable Sentry source maps by setting `SENTRY_ORG`,
   `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN`.

> **CI note:** the repo's CI runs typecheck, lint, unit tests, build, and
> Playwright smoke tests on every push/PR. Keep these green before deploying.

### 7.4 Deploy to a VPS (alternative)

On a server with Node.js 20+ and pnpm:

```bash
git clone <repo> && cd portfolio
pnpm install
# create .env.local with production values
pnpm build
pnpm start          # runs on port 3000
```

Run it under a process manager (e.g. `pm2`) and put **Nginx** in front as a
reverse proxy:

```nginx
server {
  server_name yourdomain.com;
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

### 7.5 Domain configuration

- **Vercel:** Project → **Settings → Domains** → add your domain → follow the DNS
  instructions (add an `A`/`CNAME` record at your registrar). Then update
  `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy.
- **VPS:** point an `A` record to your server's IP.

### 7.6 SSL / HTTPS

- **Vercel:** HTTPS is automatic and free (managed certificates). Nothing to do.
- **VPS:** use **Let's Encrypt** via Certbot:
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
  ```
  The app already sends an HSTS header and (in production) a Content-Security-Policy.

### 7.7 Post-deployment verification

Check each of these on the live domain:

- [ ] Home page and all nav links load.
- [ ] `/admin/login` works and you can sign in.
- [ ] Editing content in admin updates the public site.
- [ ] `/sitemap.xml` and `/robots.txt` are reachable (`robots.txt` should
      **disallow** `/admin`).
- [ ] Contact form submits (and emails arrive if Resend is configured).
- [ ] `/open-source` loads GitHub data.
- [ ] Open Graph preview looks right (test by sharing a link).
- [ ] (If enabled) Sentry receives events and analytics records visits.

---

## 8. Troubleshooting

### 8.1 Common issues

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Admin login fails / "not authorized" | Admin user not seeded, or wrong Supabase keys | Confirm `pnpm db:seed` succeeded; check Supabase keys in env |
| Public site shows starter content, not yours | DB unreachable → static fallback, or content not published | Verify Supabase env vars; ensure items are **Published** |
| `pnpm db:seed` errors "Missing required environment variable" | Env not loaded | Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` |
| Contact form "fails to send" | Resend not configured | Set `RESEND_API_KEY`/`RESEND_FROM`/`CONTACT_EMAIL`; submissions still save to the inbox |
| Images don't load / Next image error | Host not whitelisted | Add the host to `images.remotePatterns` in `next.config.ts` |
| `/open-source` shows little/no data | GitHub rate limit | Set `GITHUB_TOKEN` |
| Styling looks broken after edits | Invalid CSS variable in `globals.css` | Revert the change; keep values valid hex/CSS |

### 8.2 Build and deployment errors

- **Type errors during `pnpm build`:** run `pnpm typecheck` to see them
  individually; fix and rebuild.
- **Lint failures in CI:** run `pnpm lint` (or `pnpm lint:fix`) locally.
- **Missing env vars in production:** re-check the host's environment variable
  settings; `NEXT_PUBLIC_*` values must be present at **build** time.
- **RLS/permission errors from Supabase:** confirm all three migration files ran,
  in order, on that project.

### 8.3 Debugging tips

- Read the terminal output from `pnpm dev` — server errors print there.
- Use the browser devtools **Console** and **Network** tabs for client issues.
- Temporarily run `pnpm build && pnpm start` locally to reproduce
  production-only behavior (e.g. CSP, caching).
- If a page throws, the route-level error boundary shows a "Try again" option;
  the underlying error is logged (and sent to Sentry if configured).

---

## 9. Maintenance

### 9.1 Updating dependencies

```bash
pnpm outdated        # see what's behind
pnpm update          # update within allowed semver ranges
pnpm install
pnpm typecheck && pnpm test && pnpm build   # verify nothing broke
```

Upgrade major versions (Next.js, React, Tailwind) one at a time and test after
each.

### 9.2 Backing up

- **Content/database:** in Supabase, use **Database → Backups** (automatic on
  paid tiers) or periodically export via the SQL editor / `pg_dump`. Your CMS
  content lives here — back it up regularly.
- **Media:** files live in Supabase Storage; include them in your backup plan.
- **Configuration:** keep `.env.local` values in a secure password manager (never
  in git). The code + migrations are versioned in git.

### 9.3 Best practices

- Use **separate Supabase projects** for development and production.
- Keep CI green (typecheck, lint, tests, build) before deploying.
- Rotate secrets (`ADMIN_PASSWORD`, `CONTACT_IP_SALT`, service role key) if ever
  exposed.
- Prefer editing content in the **admin panel**; reserve code changes for
  structure, styling, and new features.
- Review [`docs/SECURITY.md`](./SECURITY.md) before going live.

---

## 10. Appendix

### 10.1 Useful commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the dev server (hot reload) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm db:seed` | Seed content + create admin (non-destructive) |
| `pnpm db:seed:force` | Reset and re-seed CMS content (**destructive**) |
| `pnpm analyze` | Build with bundle-size analysis |

### 10.2 FAQ

**Do I need Supabase just to run it locally?**
No — the public site works with static fallback content. But the admin panel and
live content editing require Supabase.

**Can I host this on GitHub Pages or a static-only host?**
No. It relies on server-side rendering, server actions, and API routes. Use
Vercel or a Node-capable server (VPS).

**How do I change my name/title everywhere?**
Edit it in admin **Settings → General**. For the code-level default/fallback,
also update `src/config/site.ts`.

**How do I add a new admin user?**
Add them to the admin allowlist in Supabase (the `admin_users` table) and create
their auth account; see [`docs/SECURITY.md`](./SECURITY.md).

**The contact form works but I get no email — why?**
Email requires Resend. Without it, submissions are still saved and visible in
admin **Contact**. Configure `RESEND_API_KEY`, `RESEND_FROM`, and `CONTACT_EMAIL`
to receive emails.

**How do I reset all content to the starter set?**
`pnpm db:seed:force` — this is destructive to current CMS content, so back up
first.

**Where do I change the accent color?**
`--primary` in `src/app/globals.css` (light and dark), or admin
**Settings → Theme**.

### 10.3 Additional notes and recommendations

- Treat `.env.local` and the `service_role` key as **highly sensitive**. Never
  commit them or expose them client-side.
- Set a unique `CONTACT_IP_SALT` in production so hashed IPs can't be correlated
  across environments.
- After your first production login, change the admin password to something only
  you know.
- Keep an eye on the admin dashboard for content stats and recent activity.
- Read [`docs/ADMIN.md`](./ADMIN.md) for content workflows and
  [`docs/SECURITY.md`](./SECURITY.md) for the full security model.


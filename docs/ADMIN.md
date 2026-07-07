# Admin Panel Guide

This portfolio is CMS-driven. After initial setup, manage content from `/admin` without editing source files.

## First-time setup

1. Configure Supabase env vars in `.env.local` (see `.env.example`).
2. Apply migrations in `supabase/migrations/`.
3. Seed content and create the admin user:

```bash
pnpm db:seed
```

4. Sign in at `/admin/login` with the seeded admin email/password.

Use `pnpm db:seed:force` only when you intentionally want to reset CMS content.

## Content workflows

### Projects (`/admin/projects`)

- Create case studies with overview, challenges, architecture diagram JSON, and SEO fields.
- Set status to **published** for public visibility.
- Archive removes a project from the public site (soft delete).

### Blog (`/admin/blog`)

- Write articles in HTML (sanitized on save).
- Add tags, excerpt, SEO metadata, and optional OG image from the media library.
- Published articles appear under `/writing/[slug]`.

### Custom pages (`/admin/pages`)

- Create landing pages and legal content with HTML and SEO fields.
- Reserved slugs (e.g. `admin`, `projects`) are blocked to protect system routes.
- Published pages appear at `/{slug}` (privacy uses `/privacy`).

### Certifications, testimonials, services (`/admin/certifications`, `/testimonials`, `/services`)

- **Certifications** — shown on the resume page with optional verification links.
- **Testimonials** — featured items appear on the home page.
- **Services** — shown on home and contact pages.

### Resume PDF (`/admin/resume`)

- Upload PDFs via the media library, then attach versions here.
- Mark one version as **active** for the public download button on `/resume`.
- Edit existing versions inline; the active version cannot be deleted until another is set active.
- Without an active PDF, visitors can still print the on-page resume.

### Open source curation (`/admin/curated-repos`)

- Pin, hide, or override descriptions for repositories on `/open-source`.
- Live GitHub data is still fetched; curation rules layer on top.
- Pinned repos outside the default fetch window are loaded individually.

### Core content (`/admin/skills`, `/experience`, `/education`, `/achievements`, `/navigation`)

- Manage structured portfolio sections used across About, Experience, Resume, and navigation.
- Reordering uses `display_order` fields in each form.

### Media (`/admin/media`)

- Upload images and documents to Supabase Storage.
- Files referenced by projects, articles, pages, certifications, testimonials, theme, SEO defaults, or resume versions cannot be deleted until references are removed.

### Contact inbox (`/admin/contact`)

- Review submissions stored in `contact_submissions`.
- Filter, search, mark read/archived, and export CSV.

### Settings (`/admin/settings`)

- **General** — site identity, availability, maintenance mode.
- **SEO defaults** — global title/description/robots/OG image.
- **Theme** — CSS variables and optional custom CSS (sanitized).
- **Analytics** — Plausible and GA4 toggles.
- **GitHub** — username and live stats toggle for `/open-source`.
- **Custom scripts** — inject trusted JavaScript only (admin-controlled).

## Maintenance mode

When enabled in Settings → General, public visitors receive HTTP 503 with `noindex`. Admin routes remain accessible.

## Publishing checklist

Before promoting content live:

1. Set entity status to **published** (projects, articles, pages).
2. Review SEO title, description, canonical URL, and robots directives.
3. Verify internal links and slugs.
4. Check `/sitemap.xml` and page metadata after save (cache revalidates automatically).

## Security notes

- Only the seeded admin account can access write operations.
- HTML content is sanitized server-side; do not rely on pasted script tags.
- Custom scripts and custom CSS are powerful — use only trusted code.
- Rotate `ADMIN_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`, and `CONTACT_IP_SALT` for production.

See [SECURITY.md](./SECURITY.md) for the full security model.

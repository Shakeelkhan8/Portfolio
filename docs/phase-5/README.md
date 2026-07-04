# Phase 5 — Optimization & Quality

Performance, accessibility, SEO, testing, and production hardening.

## Delivered

### SEO

- **JSON-LD structured data** — Person, WebSite, ProfilePage (global); CreativeWork + BreadcrumbList (projects)
- **Dynamic OG image** — `/opengraph-image` generated via `next/og`
- **Web app manifest** — `/manifest.webmanifest`
- **Enhanced metadata** — keywords, authors, canonical URLs, RSS alternate, googleBot hints

### Performance & Security

- **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **`poweredByHeader: false`**
- **`next/image`** for GitHub avatars with remote pattern config
- **Static asset caching** for favicon
- **Bundle analyzer** — `pnpm analyze`

### Accessibility

- Landmark roles on header (`banner`) and footer (`contentinfo`)
- Project filters use accessible `Button` with `aria-pressed`
- Live region announces filtered project count
- Search inputs have explicit `aria-label`s
- Project list uses semantic `<ul>` / `<li>`

### Testing

| Command | Description |
| --- | --- |
| `pnpm test` | Vitest unit tests (content, search, structured data) |
| `pnpm test:e2e` | Playwright smoke tests (requires build) |
| `pnpm analyze` | Bundle size analysis |

### Unit tests (`tests/unit/`)

- Content helpers (projects, dates)
- Search index
- Structured data schema generation

### E2E tests (`tests/e2e/`)

- Homepage render
- Navigation
- Projects listing
- Command palette (search button)
- 404 page

All 5 smoke tests pass against the production build (`pnpm build` then `pnpm test:e2e`).

### Bug fix

- **`CommandDialog`** — wrapped cmdk children in `<Command>` so the palette no longer crashes on open

## Environment

No new environment variables required for Phase 5.

## Next Step

**Phase 6** — Deployment, CI/CD, monitoring (Sentry), analytics (Plausible), domain setup. See `docs/phase-6/README.md`.

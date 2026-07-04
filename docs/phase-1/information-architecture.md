# Information Architecture

## Site Map

```
/                           Home
├── /about                  About
├── /projects               Projects index
│   └── /projects/[slug]    Project case study
├── /experience             Experience timeline
├── /writing                Technical writing index
│   └── /writing/[slug]     Article
├── /open-source            Open source contributions
├── /resume                 Resume (view + download)
├── /contact                Contact
├── /privacy                Privacy policy
├── /rss.xml                RSS feed
├── /sitemap.xml            Sitemap (generated)
└── /404                    Not found
```

## Navigation Structure

### Primary Navigation (header)

Visible on all pages. Keeps focus on the core story.

| Label | Route | Purpose |
| --- | --- | --- |
| About | `/about` | Background, philosophy, skills |
| Projects | `/projects` | Engineering case studies |
| Writing | `/writing` | Technical articles |
| Experience | `/experience` | Career timeline |
| Contact | `/contact` | Get in touch |

### Secondary Navigation (header utility)

| Label | Route | Purpose |
| --- | --- | --- |
| Resume | `/resume` | Quick access for recruiters |
| Open Source | `/open-source` | GitHub activity (Phase 4) |

### Footer Navigation

| Label | Route |
| --- | --- |
| Privacy | `/privacy` |
| RSS | `/rss.xml` |
| GitHub | external |
| LinkedIn | external |
| Email | `mailto:` |

## Content Hierarchy

### Home (`/`)

Primary landing. Answers "who is this engineer?" in under 10 seconds.

1. **Hero** — Name, title, one-line positioning, availability badge, primary CTA
2. **Expertise** — 4–6 focus areas (backend architecture, SaaS, APIs, etc.)
3. **Selected Projects** — 2–3 featured case studies (placeholder until content added)
4. **Engineering Philosophy** — 3–4 principles with brief rationale
5. **Latest Writing** — 2–3 recent articles (empty state until content added)
6. **Experience Snapshot** — Current role + years of experience
7. **Contact CTA** — Email + availability message

### About (`/about`)

Deepens the hero. Communicates seniority through decisions, not buzzwords.

1. Introduction
2. Engineering philosophy (expanded)
3. Skills grouped by domain (Backend, Architecture, Infrastructure, Frontend)
4. What I'm looking for (availability)
5. Personal details (location, languages)

### Projects (`/projects`)

Not a card grid of logos. A curated list of engineering case studies.

Each entry shows: title, one-line problem statement, role, tech stack tags, key metric (when available).

Filtering by tag/category in Phase 4.

### Project Detail (`/projects/[slug]`)

Full case study structure (see wireframes). This is the centerpiece of the portfolio.

### Experience (`/experience`)

Interactive vertical timeline:

- Role, company, dates, location
- 3–5 impact bullets per role
- Expandable detail for technical depth

### Writing (`/writing`)

MDX blog index with tags, reading time, and search (Phase 4).

### Open Source (`/open-source`)

GitHub-sourced contributions and pinned repos (Phase 4). Placeholder in Phase 3.

### Resume (`/resume`)

Web-readable resume generated from CV content + PDF download.

### Contact (`/contact`)

Simple email form via Resend. No database. Name, email, message fields.

## URL Conventions

| Rule | Example |
| --- | --- |
| Lowercase, hyphenated slugs | `/projects/dispatch-management-saas` |
| Writing under `/writing` | `/writing/multi-tenant-database-design` |
| Trailing slashes off | `/about` not `/about/` |
| Canonical URLs on all pages | Set via metadata |

## SEO & Metadata Strategy

| Page type | Title pattern | Description source |
| --- | --- | --- |
| Home | `{name} — {title}` | Site description |
| Inner pages | `{Page} — {name}` | Page-specific summary |
| Projects | `{Project} — {name}` | Project overview |
| Writing | `{Article} — {name}` | Article excerpt |

Structured data (Person, Article, BreadcrumbList) added in Phase 5.

## Content Sources

| Content | Source | Phase |
| --- | --- | --- |
| Personal info | `src/config/site.ts` | Now |
| Experience | `src/content/experience/` (MDX/JSON) | Phase 3 |
| Projects | `src/content/projects/` (MDX) | Phase 3 |
| Writing | `src/content/blog/` (MDX) | Phase 3 |
| Open source | GitHub API | Phase 4 |
| Resume | Generated from CV + site content | Phase 3 |

## Responsive Breakpoints

Aligned with design tokens:

| Name | Width | Layout behavior |
| --- | --- | --- |
| `sm` | 640px | Single → two columns where needed |
| `md` | 768px | Side nav collapses to hamburger |
| `lg` | 1024px | Full desktop layout |
| `xl` | 1280px | Max content width enforced |
| `2xl` | 1536px | Optional wider grids |

## Max Content Width

- **Prose (reading):** 680px — articles, case study body
- **Standard:** 1120px — most page content
- **Wide:** 1280px — project diagrams, timeline

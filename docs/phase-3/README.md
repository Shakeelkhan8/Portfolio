# Phase 3 — Pages & Content

All core pages, content from CV, and contact form delivery.

## Pages

| Route | Status |
| --- | --- |
| `/` | Complete — full homepage with all IA sections |
| `/about` | Complete |
| `/projects` | Complete — 3 case studies from CV |
| `/projects/[slug]` | Complete — full case study template |
| `/experience` | Complete — interactive timeline |
| `/writing` | Empty state — ready for articles |
| `/open-source` | Placeholder — GitHub integration in Phase 4 |
| `/resume` | Complete — web CV + print-to-PDF |
| `/contact` | Complete — Resend form with mailto fallback |
| `/privacy` | Complete |
| `/404` | Complete |
| `/rss.xml` | Complete — ready for articles |
| `/sitemap.xml` | Complete |
| `/robots.txt` | Complete |

## Content

| Source | Location |
| --- | --- |
| Projects | `src/content/projects/index.ts` |
| Experience | `src/content/experience.ts` |
| Skills | `src/content/skills.ts` |
| Writing | `src/content/writing/index.ts` (empty) |

## Contact Form

Requires environment variables for email delivery:

```env
RESEND_API_KEY=re_...
CONTACT_EMAIL=shakeelkhan4147@gmail.com
```

Without `RESEND_API_KEY`, the form shows a helpful error with direct mailto fallback.

## Next Step

**Phase 4** — GitHub integration, search, command palette, architecture diagrams.

# Phase 4 — Advanced Features

Interactive experiences, GitHub integration, search, and navigation shortcuts.

## Delivered

### GitHub Integration (`/open-source`)

- Live profile data from GitHub API
- Public repo cards with language, stars, forks, topics
- Stats: repos, followers, following, member since
- Graceful fallback when API is unavailable or rate-limited
- Optional `GITHUB_TOKEN` env var for higher rate limits (5000/hr vs 60/hr)

### Command Palette

- **⌘K / Ctrl+K** — open search from anywhere
- Search pages, projects, and articles
- Quick navigation shortcuts
- Search button in header (desktop)

### Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Open command palette |
| `G` then `H` | Go to Home |
| `G` then `A` | Go to About |
| `G` then `P` | Go to Projects |
| `G` then `W` | Go to Writing |
| `G` then `E` | Go to Experience |
| `G` then `C` | Go to Contact |
| `?` | Show keyboard shortcuts dialog |

### Search

- Project page: filter by tag + text search
- Writing page: search input (ready for articles)
- Command palette: global search index

### Architecture Diagrams

Interactive layer-based diagrams on all 3 project case studies:

- Hover a node to highlight connected services
- Respects `prefers-reduced-motion`
- Data in `src/content/architecture/index.ts`

## Environment

```env
# Optional — increases GitHub API rate limit
GITHUB_TOKEN=ghp_...
```

## Next Step

**Phase 5** — Performance optimization, accessibility audit, SEO enhancements, testing, and bundle analysis.

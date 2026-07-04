# Phase 2 — Design System

The visual and component foundation for the portfolio.

## Delivered

### shadcn/ui (Base Nova style)

Initialized with Tailwind CSS v4. Installed primitives:

- Button, Badge, Card, Input, Textarea, Label
- Separator, Sheet, Skeleton, Tooltip

### Layout Shell

| Component | Path |
| --- | --- |
| SiteShell | `src/components/layout/site-shell.tsx` |
| Header | `src/components/layout/header.tsx` |
| Footer | `src/components/layout/footer.tsx` |
| Container | `src/components/layout/container.tsx` |
| Section | `src/components/layout/section.tsx` |
| SectionHeader | `src/components/layout/section-header.tsx` |
| SkipLink | `src/components/layout/skip-link.tsx` |
| MainContent | `src/components/layout/main-content.tsx` |

### Typography

| Component | Path |
| --- | --- |
| Heading | `src/components/typography/heading.tsx` |
| Text | `src/components/typography/text.tsx` |
| Prose | `src/components/typography/prose.tsx` |

### Navigation

| Component | Path |
| --- | --- |
| NavBar | `src/components/navigation/nav-bar.tsx` |
| NavLink | `src/components/navigation/nav-link.tsx` |
| MobileNav | `src/components/navigation/mobile-nav.tsx` |

### Shared & Motion

| Component | Path |
| --- | --- |
| AppLink | `src/components/shared/app-link.tsx` |
| SocialLinks | `src/components/shared/social-links.tsx` |
| AvailabilityBadge | `src/components/shared/availability-badge.tsx` |
| ThemeToggle | `src/components/shared/theme-toggle.tsx` |
| FadeIn | `src/components/motion/fade-in.tsx` |
| ThemeProvider | `src/components/providers/theme-provider.tsx` |

## Theme

- **Primary accent:** Slate-blue (`#2563eb` light / `#60a5fa` dark)
- **Fonts:** Geist Sans, Inter, JetBrains Mono
- **Dark mode:** System default via `next-themes`, manual toggle in header
- **Motion:** Framer Motion scroll reveals with `prefers-reduced-motion` support

## Next Step

**Phase 3** — Build pages (About, Projects, Experience, Writing, Contact, Resume) using these components.

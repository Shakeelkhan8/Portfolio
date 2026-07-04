# Component Inventory

Every component needed across Phases 2–4, grouped by priority.

**Legend:** P0 = Phase 2 (design system), P1 = Phase 3 (pages), P2 = Phase 4 (advanced)

---

## Layout (P0)

| Component | Description | Used on |
| --- | --- | --- |
| `RootLayout` | HTML shell, fonts, metadata | All |
| `Header` | Sticky nav with logo, links, theme | All |
| `Footer` | Copyright, legal links, social icons | All |
| `Container` | Max-width wrapper with responsive padding | All |
| `Section` | Vertical section with consistent spacing | All |
| `SectionHeader` | Title + optional description + action link | Home, index pages |
| `MobileNav` | Full-screen overlay navigation | Mobile |
| `SkipLink` | Accessibility skip-to-content | All |
| `MainContent` | `<main>` landmark wrapper | All |

---

## Typography (P0)

| Component | Description |
| --- | --- |
| `Heading` | h1–h4 with size variants |
| `Text` | Body text with size/color variants |
| `Prose` | MDX/article typography wrapper |
| `Code` | Inline code styling |
| `Blockquote` | Pull quotes in articles |

---

## UI Primitives (P0 — via shadcn/ui)

| Component | shadcn source | Notes |
| --- | --- | --- |
| `Button` | button | Primary, secondary, ghost, link variants |
| `Badge` | badge | Tags, availability status, tech stack |
| `Card` | card | Project cards, expertise cards |
| `Separator` | separator | Section dividers |
| `Input` | input | Contact form |
| `Textarea` | textarea | Contact form message |
| `Label` | label | Form labels |
| `Skeleton` | skeleton | Loading states |
| `Tooltip` | tooltip | Icon buttons, abbreviations |
| `Dialog` | dialog | Mobile menu alternative, modals |
| `Sheet` | sheet | Mobile navigation drawer |
| `DropdownMenu` | dropdown-menu | Theme toggle (future) |
| `ScrollArea` | scroll-area | TOC sidebar |
| `Tabs` | tabs | Project detail sections (optional) |

---

## Navigation (P0–P1)

| Component | Priority | Description |
| --- | --- | --- |
| `NavLink` | P0 | Active-state aware link |
| `NavBar` | P0 | Desktop horizontal nav |
| `Breadcrumbs` | P1 | Project/writing detail pages |
| `TableOfContents` | P1 | Sticky article TOC |
| `Pagination` | P2 | Writing index pagination |

---

## Home Page (P1)

| Component | Description |
| --- | --- |
| `Hero` | Name, title, CTA, availability badge |
| `AvailabilityBadge` | Green dot + status text |
| `ExpertiseGrid` | Grid of focus area cards |
| `ProjectPreview` | Compact project card for home |
| `ProjectPreviewGrid` | 2–3 featured projects |
| `PhilosophyList` | Engineering principles |
| `WritingPreview` | Compact article row |
| `WritingPreviewList` | Latest articles |
| `ExperienceSnapshot` | Current role summary |
| `ContactCTA` | Bottom-of-page call to action |

---

## Projects (P1)

| Component | Description |
| --- | --- |
| `ProjectCard` | Full project list item |
| `ProjectGrid` | Projects index layout |
| `ProjectHero` | Case study header |
| `ProjectMeta` | Role, stack, links, dates |
| `ProjectSection` | Named case study section |
| `ProjectTOC` | Sticky in-page navigation |
| `MetricCard` | Key result/metric highlight |
| `DecisionBlock` | Decision → rationale → trade-off |
| `CodeBlock` | Syntax-highlighted code with copy button |
| `EmptyProjects` | No projects placeholder |

---

## Experience (P1)

| Component | Description |
| --- | --- |
| `Timeline` | Vertical timeline container |
| `TimelineItem` | Single role entry |
| `TimelineMarker` | Dot/line connector |
| `RoleCard` | Expandable role detail |

---

## Writing (P1)

| Component | Description |
| --- | --- |
| `ArticleCard` | Writing index item |
| `ArticleHeader` | Title, date, reading time, tags |
| `ArticleMeta` | Tags, series, date |
| `ReadingProgress` | Top progress bar |
| `TagList` | Tag badges |
| `RelatedPosts` | Bottom-of-article links |
| `EmptyWriting` | No articles placeholder |

---

## Contact (P1)

| Component | Description |
| --- | --- |
| `ContactForm` | Name, email, message + submit |
| `ContactInfo` | Direct email + availability |
| `FormStatus` | Success/error feedback |

---

## Resume (P1)

| Component | Description |
| --- | --- |
| `ResumeView` | Web-readable CV layout |
| `DownloadButton` | PDF download trigger |
| `ResumeSection` | Summary, skills, experience blocks |

---

## Open Source (P2)

| Component | Description |
| --- | --- |
| `RepoCard` | GitHub repo summary |
| `ContributionGraph` | Activity visualization |
| `GitHubStats` | Followers, repos, languages |
| `PinnedRepos` | Featured repositories |

---

## Architecture (P2)

| Component | Description |
| --- | --- |
| `ArchitectureDiagram` | Interactive system diagram |
| `DiagramNode` | Single node in diagram |
| `DiagramEdge` | Connection between nodes |

---

## Search & Command (P2)

| Component | Description |
| --- | --- |
| `CommandPalette` | ⌘K search overlay |
| `SearchInput` | Writing/projects search |
| `SearchResults` | Grouped result list |
| `KeyboardShortcuts` | Shortcut reference dialog |

---

## Shared / Utility (P0–P1)

| Component | Priority | Description |
| --- | --- | --- |
| `ThemeProvider` | P0 | System/light/dark (extends CSS approach) |
| `Icon` | P0 | Lucide icon wrapper |
| `Link` | P0 | Internal/external link with icon |
| `SocialLinks` | P0 | GitHub, LinkedIn, email icons |
| `ExternalLink` | P0 | Link with external indicator |
| `CopyButton` | P1 | Clipboard copy with feedback |
| `FadeIn` | P0 | Scroll reveal animation wrapper |
| `PageTransition` | P1 | Route transition wrapper |
| `EmptyState` | P1 | Generic empty content placeholder |
| `ErrorBoundary` | P1 | Client error fallback |
| `SEOHead` | P1 | Metadata helper (mostly server-side) |

---

## Build Order (Phase 2)

Recommended sequence for design system implementation:

1. **Tokens & globals** — colors, typography, spacing in CSS
2. **Layout shell** — Container, Section, Header, Footer, SkipLink
3. **shadcn/ui init** — Button, Badge, Card, Input, Separator
4. **Typography components** — Heading, Text, Prose
5. **Navigation** — NavLink, NavBar, MobileNav
6. **Motion primitives** — FadeIn, reduced-motion support
7. **Shared** — Icon, Link, SocialLinks, ThemeProvider

Then Phase 3 builds page-specific components on top of this foundation.

---

## Component Count Summary

| Priority | Count |
| --- | --- |
| P0 (Phase 2) | ~30 |
| P1 (Phase 3) | ~35 |
| P2 (Phase 4) | ~12 |
| **Total** | **~77** |

Many P0 primitives come from shadcn/ui with customization, reducing net-new component code.

# Design direction

The public site's visual language, and the reasons behind it. Tokens live in
`src/app/globals.css`; this file explains them.

## Why the previous design felt flat (audit, Nov 2026)

- **No colour identity.** Every surface, border and text colour was a neutral
  grey between `#0a0a0b` and `#ededed`. Nothing anchored the eye, so the site
  read as a generic dark template.
- **One section pattern, six times.** Each home section was a large noun
  heading ("Case studies", "Side projects", "Experience") with a grey line under
  it and a grid of identical rounded cards. Sections were interchangeable.
- **Card monoculture.** Case studies, side projects, contact paths, skills and
  languages all sat in the same dark rounded box.
- **A crowded, centred hero.** Seven centred tiers (badge, eyebrow, headline,
  paragraph, two buttons, proof line, scroll cue) competed with each other.
  The hand-built particle star was almost hidden behind a dark scrim, and the
  strongest content, the results, was the smallest text on the screen.
- **No type scale.** About twenty different heading sizes. Page titles ranged
  from 36 to 68 px depending on the page, and home section headings were 44 px
  while the same headings elsewhere were 30 px, so the size jumped between
  pages.

## The idea: the night shift

The work is the part of a product nobody sees until it breaks: ledgers,
webhooks, tenant isolation. The site should feel like that work looks at
2 a.m. when it is done well: dark, quiet, precise, with one warm light on.

- **Warm dark, not grey dark.** Neutrals carry a slight warm bias (paper on a
  dark desk), which reads as human rather than as a UI kit.
- **One signal colour: amber** (`--signal`). It marks what matters and nothing
  else: results, the current section, focus, live state in the diagram. If
  more than a few amber marks are on screen at once, one of them is wrong.
- **Ruled, editorial structure instead of boxes.** Sections open with a
  hairline rule and a small mono label, like a ledger or a printed report.
  Lists of things are rows separated by rules, not grids of cards. Cards are
  kept for things that really are separate objects (a project you can open).
- **Statements, not labels.** A section's large heading is a sentence with a
  point of view; the category name ("Case studies") is the small label above
  it.

## Type

Three faces, each with one job:

| Role | Face | Notes |
|---|---|---|
| Display | Mona Sans, semi-expanded | Headlines and headline numbers only |
| Body | IBM Plex Sans | All running text |
| Labels and data | JetBrains Mono | Small caps labels, metadata, code |

One fluid scale, defined as Tailwind text tokens in `globals.css`. Use these
instead of one-off sizes:

| Token | Use | Range |
|---|---|---|
| `text-display` | Home hero headline | 34 → 56 px |
| `text-title` | Page titles (one per page) | 34 → 50 px |
| `text-heading` | Section statements | 26 → 36 px |
| `text-subheading` | Card and item titles | 19 → 21 px |
| `text-figure` | Headline numbers | 28 → 38 px |
| `label-mono` (utility) | Section labels, metadata | 11 px, 0.14em |

Body copy is 16 px (17 px for lead paragraphs), with line lengths held near
65 characters.

## Motion

Motion explains structure or confirms an action; it is never decoration.

- Entrances above the fold are CSS, so content never waits for JavaScript.
- Section rules draw in as the section arrives (CSS scroll-driven where
  supported, otherwise static).
- Hover states move a few pixels or change one colour. Nothing bounces.
- Reduced motion turns movement off; the page is complete at rest.

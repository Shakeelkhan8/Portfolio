# Wireframes

Low-fidelity layout blueprints. These define structure and content zones — not final visual design (Phase 2).

All layouts use a **1120px max-width container** with generous vertical spacing.

---

## Global Layout Shell

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo/Name]     About  Projects  Writing  Exp  Contact  ☀  │  ← sticky header
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                      { page content }                        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  © 2026 Shakeel Khan    Privacy · RSS    GitHub · LinkedIn  │  ← footer
└──────────────────────────────────────────────────────────────┘
```

**Mobile header:** Hamburger → full-screen nav overlay.

---

## Home (`/`)

```
┌──────────────────────────────────────────────────────────────┐
│                         HERO                               │
│  ● Available for work                                        │
│                                                              │
│  Shakeel Khan                                                │
│  Senior Backend Engineer                                     │
│                                                              │
│  One-line positioning statement                              │
│  about scalable systems and production SaaS.                 │
│                                                              │
│  [View Projects]  [Get in Touch]                             │
│                                                              │
│  Pakistan · 5+ years · Backend · SaaS · APIs                 │
├──────────────────────────────────────────────────────────────┤
│  EXPERTISE                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Backend  │ │ Multi-   │ │ API      │ │ Perform- │       │
│  │ Arch     │ │ tenant   │ │ Design   │ │ ance     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├──────────────────────────────────────────────────────────────┤
│  SELECTED PROJECTS                          [View all →]     │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │ Project title       │  │ Project title       │           │
│  │ Problem one-liner   │  │ Problem one-liner   │           │
│  │ Laravel · PostgreSQL│  │ Laravel · MySQL     │           │
│  └─────────────────────┘  └─────────────────────┘           │
├──────────────────────────────────────────────────────────────┤
│  HOW I THINK                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Principle 1 — brief explanation                     │    │
│  │ Principle 2 — brief explanation                     │    │
│  │ Principle 3 — brief explanation                     │    │
│  └─────────────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────────────┤
│  LATEST WRITING                             [View all →]     │
│  · Article title                              Mar 2026       │
│  · Article title                              Feb 2026       │
├──────────────────────────────────────────────────────────────┤
│  EXPERIENCE                                                  │
│  Backend Engineer @ Elityx          Nov 2025 – Present       │
│  [View full timeline →]                                      │
├──────────────────────────────────────────────────────────────┤
│  LET'S WORK TOGETHER                                         │
│  Open to full-time, contract, and consulting.                │
│  [Contact me]                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## About (`/about`)

```
┌──────────────────────────────────────────────────────────────┐
│  About                                                       │
│  ─────                                                       │
│  2–3 paragraph introduction. Senior tone. No buzzwords.        │
├──────────────────────────────────────────────────────────────┤
│  ENGINEERING PHILOSOPHY                                      │
│  Numbered list of principles with one sentence each.         │
├──────────────────────────────────────────────────────────────┤
│  SKILLS                                                      │
│  Backend          Architecture       Infrastructure        │
│  · Laravel        · Multi-tenancy    · Docker              │
│  · PostgreSQL     · RBAC             · Redis               │
│  · REST APIs      · API-first        · CI/CD               │
│                                                              │
│  Frontend                                                    │
│  · React · Next.js · Vue.js · Tailwind                      │
├──────────────────────────────────────────────────────────────┤
│  DETAILS                                                     │
│  Location: Pakistan (Asia/Karachi)                           │
│  Languages: Urdu, Pashto, English                            │
│  Availability: Open to opportunities                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Projects Index (`/projects`)

```
┌──────────────────────────────────────────────────────────────┐
│  Projects                                                    │
│  Engineering case studies from production systems.           │
│                                                              │
│  [All] [SaaS] [Automation] [APIs]     ← filters (Phase 4)   │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Dispatch Management SaaS                               │ │
│  │ Multi-tenant platform · 500+ daily shipments           │ │
│  │ Role: Sole Backend Engineer                            │ │
│  │ Laravel · PostgreSQL · Docker              [Read →]    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ISP Management System                                  │ │
│  │ Full-stack platform · 3 active ISPs                  │ │
│  │ Role: Freelance · Solo                                 │ │
│  │ Laravel · MySQL                            [Read →]    │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## Project Detail (`/projects/[slug]`)

```
┌──────────────────────────────────────────────────────────────┐
│  Home / Projects / Dispatch Management SaaS                  │
│                                                              │
│  Dispatch Management SaaS                                    │
│  Multi-tenant dispatch platform serving 5 companies.         │
│  Laravel · PostgreSQL · Vue.js · Docker                      │
│                                                              │
│  [Live Demo]  [GitHub]                                       │
├──────────────────────────────────────────────────────────────┤
│  OVERVIEW │ PROBLEM │ ARCHITECTURE │ DECISIONS │ RESULTS     │  ← sticky TOC
├──────────────────────────────────────────────────────────────┤
│  Overview                                                    │
│  2–3 paragraphs setting context.                             │
│                                                              │
│  Problem                                                     │
│  What business problem this solved.                          │
│                                                              │
│  My Role                                                     │
│  Scope and ownership.                                        │
│                                                              │
│  Architecture                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         [ Interactive system diagram ]                 │ │
│  │   Frontend → API → Services → DB → Queue → External  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Engineering Decisions                                       │
│  Decision → Rationale → Trade-off format.                  │
│                                                              │
│  Results & Metrics                                           │
│  · 500+ daily shipments                                      │
│  · 5 companies onboarded                                     │
│  · Sub-second API response times                             │
│                                                              │
│  Lessons Learned                                             │
│  What I'd do differently.                                    │
│                                                              │
│  Code Sample                                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  // syntax-highlighted snippet              [Copy]     │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## Experience (`/experience`)

```
┌──────────────────────────────────────────────────────────────┐
│  Experience                                                  │
│  5+ years building production systems.                       │
├──────────────────────────────────────────────────────────────┤
│  │                                                           │
│  ●── Backend Engineer                                        │
│  │   Elityx · Nov 2025 – Present · Islamabad                │
│  │   · Sole backend engineer, 80%+ ownership                │
│  │   · Multi-tenant SaaS, 500+ daily shipments             │
│  │   · Financial system with real transactions              │
│  │                                                           │
│  ●── Backend Developer                                       │
│  │   Hum Network · Sep 2023 – Oct 2025                      │
│  │   · Automated 3-day reporting to under 2 minutes        │
│  │   · WebSocket real-time sync                              │
│  │                                                           │
│  ●── Web Developer                                           │
│  │   iProfessional · Oct 2022 – Aug 2023                    │
│  │   · CRM modules, component library (-30% dev time)       │
│  │                                                           │
│  ○── Earlier roles (collapsed by default)                    │
│      Internships at Hum Network, Genesis Engineering         │
└──────────────────────────────────────────────────────────────┘
```

---

## Writing Index (`/writing`)

```
┌──────────────────────────────────────────────────────────────┐
│  Writing                                                     │
│  Technical articles on backend systems and architecture.     │
│                                                              │
│  [Search...]                          ← Phase 4              │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Article Title                                          │ │
│  │ Brief excerpt from the article...                      │ │
│  │ 8 min read · Backend · Mar 2026                        │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## Writing Detail (`/writing/[slug]`)

```
┌──────────────────────────────────────────────────────────────┐
│  Article Title                                               │
│  Mar 4, 2026 · 8 min read · Backend Architecture             │
├──────────────────────┬───────────────────────────────────────┤
│  Table of Contents   │  Article body (MDX)                   │
│  · Introduction      │                                       │
│  · Problem           │  Prose width: 680px                   │
│  · Approach          │                                       │
│  · Results           │  ████████████░░ reading progress      │
│                      │                                       │
│  (sticky sidebar)    │  Related posts at bottom              │
└──────────────────────┴───────────────────────────────────────┘
```

---

## Contact (`/contact`)

```
┌──────────────────────────────────────────────────────────────┐
│  Contact                                                     │
│  Open to full-time, contract, and consulting.                  │
│                                                              │
│  ● Available                                                 │
├──────────────────────────────────────────────────────────────┤
│  Name          [________________]                            │
│  Email         [________________]                            │
│  Message       [________________]                            │
│                [________________]                            │
│                [________________]                            │
│                                                              │
│                [Send Message]                                │
│                                                              │
│  Or email directly: shakeelkhan4147@gmail.com                │
└──────────────────────────────────────────────────────────────┘
```

---

## Resume (`/resume`)

```
┌──────────────────────────────────────────────────────────────┐
│  Resume                              [Download PDF ↓]        │
├──────────────────────────────────────────────────────────────┤
│  Muhammad Shakeel                                            │
│  Senior Backend Engineer                                     │
│  shakeelkhan4147@gmail.com · Pakistan                        │
│                                                              │
│  Summary, Skills, Experience, Projects, Education            │
│  (Structured web version of CV content)                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 404

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              404 — Page not found                            │
│              The page you're looking for doesn't exist.      │
│                                                              │
│              [Go Home]  [View Projects]  [Contact]           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

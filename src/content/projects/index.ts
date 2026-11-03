import type { Project } from "@/types";

/**
 * Seed and fallback projects. Order here is display order.
 *
 * Professional work is `featured: true`. Side projects carry the
 * `SIDE_PROJECT_TAG` tag and render in their own section on the home page
 * (see `src/lib/projects.ts`), which keeps the split editable from the CMS
 * without a schema change.
 */
export const projects: Project[] = [
  {
    slug: "dispatch-management-saas",
    title: "Dispatch Management SaaS",
    summary:
      "A multi-tenant dispatch and settlement platform for logistics companies in Saudi Arabia. I designed its financial engine, its tenant isolation and the framework client integrations plug into.",
    problem:
      "Logistics companies needed one platform for dispatch, captain fleets, financial settlements and incoming orders, without paying for custom infrastructure per client.",
    role: "Primary engineer for the first seven months. I designed the financial engine, tenant isolation and the inbound integration framework.",
    context: "Elityx · In production · Nov 2025 – present",
    stack: ["Laravel", "PostgreSQL", "Redis", "Docker", "Webhooks", "EdfaPay"],
    tags: ["Multi-tenant SaaS", "Payments", "Integrations"],
    featured: true,
    links: [],
    metrics: [
      { label: "of the financial engine's code", value: "~63%" },
      {
        label: "of the platform's commits in its first seven months",
        value: "58%",
      },
      { label: "Payments test gate", value: "Every deploy" },
    ],
    overview:
      "The platform covers the whole operational loop: trip creation, auto-dispatch, the captain app, billing and settlements, and the orders that client systems send in. I was its primary engineer for the first seven months. As the team grew I kept ownership of the paths where mistakes cost money: the financial engine, tenant isolation and inbound integrations.",
    challenges: [
      "Isolating each company's data while sharing one application and one database.",
      "A three-layer financial system (company billing, inter-company settlements, captain payouts) on a double-entry ledger, handling real money.",
      "Payment providers and client systems retry, so every money posting has to be safe to receive twice.",
      "A release must never break a payment path, even as more engineers commit to the codebase.",
    ],
    architecture:
      "An operations portal and the captain mobile apps talk to a Laravel API backed by PostgreSQL and Redis. Auto-dispatch runs as scheduled jobs. The financial engine posts every money movement to a double-entry ledger and takes card payments through EdfaPay. Client systems send orders through an inbound adapter framework, and the platform also connects to e-commerce stores and the WASL government API. Everything ships as Docker containers.",
    decisions: [
      {
        decision:
          "One PostgreSQL database with tenant-scoped queries, not a database per company",
        rationale:
          "Far less operational overhead. A model trait and a global query scope apply the company filter to every query, so isolation doesn't depend on each developer remembering it.",
        tradeoff:
          "One missed scope has a bigger blast radius than physical separation would, so the scope has to be the default, not an option.",
      },
      {
        decision: "One inbound adapter contract for client integrations",
        rationale:
          "Each client sends orders in its own format. Adapters behind one interface and a factory map them into the platform's model, so the core never knows which client an order came from. Later integrations were built on the same base class.",
        tradeoff:
          "More abstraction up front, but adding a client doesn't touch the core.",
      },
      {
        decision: "Run the payment tests before every production deploy",
        rationale:
          "A failing payments suite blocks the release, so a broken money path can't reach production however many people are committing.",
        tradeoff:
          "Deploys wait for the suite, and a flaky payment test blocks a release until someone fixes it.",
      },
    ],
    results: [
      "The ledger, invoicing, reconciliation and card payments run on real transactions.",
      "Tenant isolation is enforced in the query layer for every company on the platform.",
      "Payment tests gate every production deploy.",
    ],
    lessons: [
      "Tenant scoping has to be enforced in the query layer, not left to each developer to remember.",
      "Financial webhooks need idempotent handling from day one. Payment providers will retry.",
    ],
    futureImprovements: [
      "Event-driven dispatch for time-critical assignments.",
      "A read replica for reporting queries.",
    ],
  },
  {
    slug: "enterprise-reporting-automation",
    title: "Enterprise Reporting Automation",
    summary:
      "A backend that generates Hum Network's operational reports automatically, replacing a manual Excel process that took three days.",
    problem:
      "Hum Network's operations team spent three days each cycle compiling Excel reports by hand from several data sources. It delayed decisions and cost more than 100 hours a month.",
    role: "Backend developer",
    context: "Hum Network Limited · Sep 2023 – Oct 2025",
    stack: [
      "Laravel",
      "PHP",
      "MySQL",
      "WebSockets",
      "Excel and PDF generation",
    ],
    tags: ["Automation", "Enterprise", "Integrations"],
    featured: true,
    links: [],
    metrics: [
      { label: "Report turnaround", value: "3 days → under 2 min" },
      { label: "Hours saved", value: "100+ a month" },
    ],
    overview:
      "The system pulls data from internal databases and external JSON APIs and produces structured Excel and PDF reports on demand. It also feeds Ross XPression for live TV graphics workflows, and keeps related internal apps in sync over WebSockets.",
    challenges: [
      "Turning inconsistent hand-made Excel formats into one reliable pipeline.",
      "Proving the automated reports matched the manual ones before switching over.",
      "Feeding live TV data workflows through Ross XPression.",
    ],
    architecture:
      "A Laravel backend reads from internal databases and external JSON APIs, normalises the data into report templates, and renders Excel and PDF output. WebSocket and Socket.IO connections keep related internal applications updated in real time.",
    decisions: [
      {
        decision:
          "Fixed report templates instead of free-form Excel generation",
        rationale:
          "Templates keep output consistent and make it straightforward to compare against the old manual reports.",
        tradeoff: "Ad-hoc changes to a report need a template change.",
      },
    ],
    results: [
      "Report turnaround cut from three days to under two minutes.",
      "More than 100 operational hours saved each month.",
      "Real-time data sync across internal applications over WebSockets.",
    ],
    lessons: [
      "Replacing a manual process means running both side by side until stakeholders see they match.",
    ],
  },
  {
    slug: "isp-management-system",
    title: "ISP Management System",
    summary:
      "Billing, subscriptions and a customer portal for small internet service providers, built in 2023 for three local ISPs.",
    problem:
      "Small ISPs in Pakistan had no affordable software for customer billing, subscription plans, bandwidth tracking and self-service.",
    role: "Independent developer: design, build and deploy",
    context: "Independent · 2023",
    stack: ["Laravel", "PHP", "MySQL", "Blade"],
    tags: ["Billing", "Full-stack", "SaaS"],
    featured: true,
    links: [],
    metrics: [{ label: "ISPs set up on it in 2023", value: "3" }],
    overview:
      "A full-stack platform for small ISPs: billing and invoicing, subscription plans, bandwidth usage tracking, and a self-service portal for customers. I built it in 2023 and set it up for three local providers.",
    challenges: [
      "Permissions that keep ISP staff, agents and customers in separate scopes.",
      "Billing cycles that stay correct when a customer changes plan mid-cycle.",
      "A customer portal simple enough for people who aren't technical.",
    ],
    architecture:
      "A single Laravel application on MySQL, with Blade templates for both the admin and customer sides. Role-based access separates ISP staff, agents and end customers.",
    decisions: [
      {
        decision: "A monolith instead of separate services",
        rationale:
          "A small system for three small ISPs. Operational simplicity was worth more than anything a distributed design would add.",
        tradeoff:
          "Growing far beyond that load would need a scaling plan later.",
      },
      {
        decision: "Role-based access with scoped permissions",
        rationale:
          "Staff, agents and customers each need their own permission scope.",
        tradeoff: "The permission matrix grows with every new role.",
      },
    ],
    results: [
      "Set up for three ISPs in 2023.",
      "Billing, subscriptions and customer self-service in one system.",
    ],
    lessons: [
      "On a small production system, build admin tooling early. Support requests come from the edge cases you didn't plan for.",
    ],
  },
  {
    slug: "keystone",
    title: "Keystone",
    summary:
      "Subscriber automation for small ISPs on MikroTik. When a customer pays, their internet comes back in seconds and nobody has to touch a router.",
    problem:
      "A small ISP running PPPoE on MikroTik has two daily problems: people who stopped paying but are still connected, and people who paid at 11pm and stay cut off until someone opens WinBox in the morning.",
    role: "Solo project: design and build",
    context: "Side project · 2026 · Paused · Private repo",
    stack: [
      "Go",
      "PostgreSQL 16",
      "FreeRADIUS 3.2",
      "MikroTik RouterOS",
      "Docker",
    ],
    tags: ["Side project", "Billing", "Networking"],
    featured: false,
    links: [],
    metrics: [],
    overview:
      "Keystone owns a subscriber's service state end to end: it creates the account in RADIUS, enforces suspension on the live session through CoA and Disconnect, and restores service the moment a payment is recorded. Billing runs on an append-only ledger, and reminders and cut-offs follow a grace period the ISP chooses. Nothing is cut off by default.",
    challenges: [
      "Changing a live session's state without forcing the customer to reconnect.",
      "A billing run that's safe to repeat, so cron firing twice never invoices twice.",
      "Leaving message spend in the ISP's hands: reminders stay off until the ISP turns them on.",
    ],
    architecture:
      "One static Go binary with its migrations embedded, deployed on-premise at each ISP. FreeRADIUS runs unmodified and reads the same PostgreSQL database. Router instructions and customer messages share one outbox, so a provider outage delays a message rather than losing it. Every operator action is written to an append-only event log.",
    decisions: [
      {
        decision: "An append-only ledger instead of a balance column",
        rationale:
          "Invoices, payments and allocations are rows, and what a customer owes is their sum. A correction is a reversing entry, so the history can always be audited.",
        tradeoff:
          "A balance has to be summed rather than read, and fixing a mistake takes a new entry instead of an edit.",
      },
      {
        decision: "Separate “record payment” from “restore service”",
        rationale:
          "As one button it recorded the full balance as cash every time, so waivers and misclicks entered the ledger as money received, and part payments were impossible.",
        tradeoff: "Operators press two buttons instead of one.",
      },
      {
        decision: "Unmodified FreeRADIUS reading the same database",
        rationale:
          "No custom RADIUS module to maintain, and routers keep talking to a standard AAA server.",
        tradeoff: "The schema has to fit what FreeRADIUS expects.",
      },
    ],
    results: [
      "Billing, collections and suspension flows built and covered by CI, including integration tests against a real PostgreSQL.",
    ],
    lessons: [],
    futureImprovements: [
      "A lab run on MikroTik CHR to confirm how suspension behaves over CoA on a real RouterOS version.",
      "Choosing a WhatsApp or SMS provider. Until then, messages are recorded with what they would have cost.",
    ],
  },
  {
    slug: "ai-mentor-health",
    title: "AI Mentor Health",
    summary:
      "A wellness-coaching app with AI chat, daily habit check-ins and weekly plans: a domain-structured Laravel codebase with Stripe subscriptions.",
    problem:
      "An MVP foundation for a consumer wellness product: coaching that remembers the user's goals instead of a generic chatbot, and a paid tier that's simple to run.",
    role: "Solo project",
    context: "Side project · 2026 · Open source (MIT)",
    stack: [
      "Laravel",
      "PHP 8.4",
      "MySQL",
      "Stripe",
      "Larastan",
      "GitHub Actions",
    ],
    tags: ["Side project", "AI", "SaaS"],
    featured: false,
    links: [
      {
        label: "Code on GitHub",
        href: "https://github.com/Shakeelkhan8/ai-mentor-health",
      },
    ],
    metrics: [],
    overview:
      "Users set goals and focus areas, chat with an AI coach that has safety framing built in, check in on habits each day, and get an AI-generated weekly plan. A Pro tier on Stripe Checkout lifts the free plan's daily message limit. It gives general wellness guidance only and doesn't diagnose anything.",
    challenges: [
      "Keeping the AI provider swappable.",
      "Getting reliably structured output from a model for weekly plans.",
      "Keeping plan limits in one place.",
    ],
    architecture:
      "Domain modules (Identity, Coaching, Habits, Plans, Billing) layered as HTTP → application actions and services → domain → infrastructure. The coach sits behind an AiCoachClient contract, Stripe Checkout and webhooks handle subscriptions, and feature flags keep deferred modules switched off.",
    decisions: [
      {
        decision: "The AI provider sits behind an AiCoachClient contract",
        rationale:
          "The coach can change provider, or run on pre-written replies for the public demo, without touching domain code.",
        tradeoff:
          "One more abstraction to keep in step with what providers offer.",
      },
      {
        decision: "Weekly plans as strict JSON with a safe fallback",
        rationale:
          "A malformed model response never reaches the user as a broken plan.",
        tradeoff: "When the model fails, the fallback plan is generic.",
      },
      {
        decision: "Plan limits decided in one Entitlements class",
        rationale: "Free and Pro limits have exactly one home.",
        tradeoff:
          "Every feature has to ask that class instead of checking the plan directly.",
      },
    ],
    results: [
      "Tests, Pint and Larastan (level 5, no baseline) run on every pull request.",
    ],
    lessons: [],
  },
  {
    slug: "portfolio",
    title: "This portfolio and its CMS",
    summary:
      "The site you're on: a Next.js front end with its own admin panel, so every page, project and setting can be edited without a deploy.",
    problem:
      "I wanted a portfolio I could keep current without touching code, that stays up even when its database doesn't, and that doesn't turn its contact form into a spam endpoint.",
    role: "Solo project: design, build and deploy",
    context: "Side project · 2026 · Private repo",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Supabase",
      "Vercel",
      "Playwright",
    ],
    tags: ["Side project", "Frontend", "CMS"],
    featured: false,
    links: [],
    metrics: [{ label: "Content areas editable in the admin", value: "21" }],
    overview:
      "Public pages are server-rendered Next.js App Router routes that read from Supabase (Postgres, Auth and Storage). A separate admin panel manages 21 content areas, from projects and experience to navigation, SEO defaults and the contact inbox. Each edit revalidates only the cache tags it touches, so changes go live without a rebuild.",
    challenges: [
      "Keeping the public site up when the database is unreachable.",
      "A contact form that's hard to abuse, without adding a CAPTCHA.",
      "Letting the admin save rich HTML without opening an XSS hole.",
    ],
    architecture:
      "Next.js App Router on Vercel. Public pages read through cached queries tagged by content type; admin server actions write to Supabase and revalidate those tags. Row Level Security is on for every public table: visitors can only read published content, and admin writes go through an is_admin() policy. The contact form posts to an API route that validates with Zod, checks the origin, rate-limits by hashed IP and stores submissions with the service role. Resend delivers the email.",
    decisions: [
      {
        decision: "Typed fallback content behind every query",
        rationale:
          "If Supabase is unreachable or not configured, pages render from the same typed content that seeds the database, instead of erroring.",
        tradeoff:
          "The seed and the live database can drift apart, so the seed has to be kept accurate.",
      },
      {
        decision: "Rate-limit the contact form and fail closed",
        rationale:
          "Five submissions per hashed IP per hour, plus a honeypot field and an origin check. A missing key or a failed count is treated as limited, not allowed.",
        tradeoff:
          "A database hiccup can block a genuine message, which beats an open spam endpoint.",
      },
      {
        decision: "Sanitize stored HTML on save and again on render",
        rationale:
          "Articles and pages accept rich HTML from the admin; sanitize-html runs on both sides, so one bad save can't reach visitors.",
        tradeoff: "Some HTML is stripped even where it would have been harmless.",
      },
    ],
    results: [
      "Accessibility (axe) and SEO crawl checks run in Playwright on every pull request.",
      "Row Level Security on every public table, and no public insert path into contact submissions.",
    ],
    lessons: [],
  },
];

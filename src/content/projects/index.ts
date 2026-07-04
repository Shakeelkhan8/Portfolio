import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "dispatch-management-saas",
    title: "Dispatch Management SaaS",
    summary:
      "Multi-tenant dispatch platform serving 5 companies, 200+ captains, and 500+ daily shipments.",
    problem:
      "Logistics companies needed a unified platform to manage dispatch operations, captain fleets, financial settlements, and e-commerce integrations — without building custom infrastructure for each client.",
    role: "Sole Backend Engineer — 80%+ system ownership",
    context: "Elityx · Production SaaS · Nov 2025 – Present",
    stack: ["Laravel", "PostgreSQL", "Vue.js", "Docker", "Redis", "Webhooks"],
    tags: ["SaaS", "Multi-Tenant", "APIs"],
    featured: true,
    links: [],
    metrics: [
      { label: "Companies onboarded", value: "5" },
      { label: "Daily shipments", value: "500+" },
      { label: "Captains managed", value: "200+" },
      { label: "API response target", value: "<1s" },
    ],
    overview:
      "A live multi-tenant Dispatch Management SaaS that handles the full operational lifecycle — from trip creation and auto-dispatch to financial settlements and e-commerce sync. I architect and maintain the backend end-to-end, including PostgreSQL schema, mobile APIs, webhook integrations, and production deployment.",
    challenges: [
      "Designing multi-tenant data isolation while sharing infrastructure efficiently across 5 companies.",
      "Building intelligent auto-dispatch that balances location, captain availability, and priority rules under cron-driven configuration.",
      "Implementing a three-layer financial system processing real transactions across companies, providers, and captains.",
      "Maintaining sub-second API response times as shipment volume scaled to 500+ daily operations.",
    ],
    architecture:
      "Portal frontend (Laravel Blade + Vue.js) communicates with a Laravel API layer backed by PostgreSQL. Auto-dispatch runs on scheduled jobs. An adapter-based integration layer connects Shopify, Salla, and other e-commerce platforms via webhooks. Mobile APIs serve captain and field operations. Docker handles deployment.",
    decisions: [
      {
        decision: "PostgreSQL with tenant-scoped queries over separate databases per company",
        rationale:
          "Reduced operational overhead while maintaining logical isolation through tenant IDs and RBAC.",
        tradeoff:
          "Requires disciplined query scoping; a missed tenant filter has higher blast radius than physical separation.",
      },
      {
        decision: "Adapter pattern for e-commerce integrations",
        rationale:
          "Each platform (Shopify, Salla, WooCommerce) has different webhook payloads and auth flows.",
        tradeoff:
          "More upfront abstraction cost, but adding new platforms doesn't require core system changes.",
      },
      {
        decision: "Cron-driven auto-dispatch over real-time event streaming",
        rationale:
          "Dispatch rules involve batch evaluation of availability, zones, and priorities — better suited to scheduled processing.",
        tradeoff:
          "Slightly higher latency for dispatch assignment vs. event-driven, but simpler to configure and debug.",
      },
    ],
    results: [
      "5 companies onboarded from zero to production.",
      "500+ daily shipments processed through the platform.",
      "Financial system handling real billing, settlements, and captain payouts.",
      "Sub-second API response times through indexing and query optimisation.",
    ],
    lessons: [
      "Multi-tenant systems need tenant scoping enforced at the query builder level, not left to individual developers.",
      "Financial modules require idempotent webhook handling from day one — payment retries are inevitable.",
    ],
    futureImprovements: [
      "Event-driven dispatch for time-critical assignments.",
      "Read replica for reporting queries at scale.",
    ],
  },
  {
    slug: "isp-management-system",
    title: "ISP Management System",
    summary:
      "Full-stack platform for internet service providers — billing, subscriptions, and customer portal.",
    problem:
      "Small-to-medium ISPs in Pakistan lacked affordable software to manage customer billing, subscription plans, bandwidth tracking, and self-service portals.",
    role: "Freelance · Solo full-stack developer",
    context: "Freelance · 2023 · Active production use",
    stack: ["Laravel", "PHP", "MySQL", "Blade"],
    tags: ["Full-Stack", "SaaS", "Billing"],
    featured: true,
    links: [],
    metrics: [
      { label: "Active ISPs", value: "3" },
      { label: "Admin roles", value: "Multi-role" },
      { label: "Status", value: "Production" },
    ],
    overview:
      "A full-stack ISP management platform built as a solo freelance project. It handles customer billing and invoicing, subscription plan management, bandwidth usage tracking, and a self-service customer portal — currently in active daily use by 3 internet service providers.",
    challenges: [
      "Designing a multi-role permission system for ISP staff, agents, and customers.",
      "Building reliable billing cycles with subscription plan changes mid-cycle.",
      "Creating a customer portal simple enough for non-technical users.",
    ],
    architecture:
      "Monolithic Laravel application with MySQL. Blade templates for admin and customer interfaces. Role-based access control separates ISP staff, agents, and end customers.",
    decisions: [
      {
        decision: "Monolithic Laravel over microservices",
        rationale:
          "Solo project serving 3 ISPs — operational simplicity outweighed distributed architecture benefits.",
        tradeoff:
          "Scaling beyond current load would require horizontal scaling strategy later.",
      },
      {
        decision: "Multi-role RBAC with scoped permissions",
        rationale:
          "ISPs need staff, agents, and customers operating in separate permission scopes.",
        tradeoff: "Permission matrix complexity grows with each new role type.",
      },
    ],
    results: [
      "3 ISPs actively using the platform in daily operations.",
      "Complete billing, subscription, and customer self-service workflow.",
    ],
    lessons: [
      "For solo production systems, invest in admin tooling early — support requests come from edge cases you didn't anticipate.",
    ],
  },
  {
    slug: "enterprise-reporting-automation",
    title: "Enterprise Reporting Automation",
    summary:
      "Automated backend system replacing a 3-day manual Excel reporting workflow.",
    problem:
      "Hum Network's operations team spent 3 days per cycle manually compiling Excel reports from multiple data sources — a bottleneck that delayed decision-making and consumed 100+ hours monthly.",
    role: "Backend Developer",
    context: "Hum Network Limited · Sep 2023 – Oct 2025",
    stack: ["Laravel", "PHP", "MySQL", "Excel Generation", "PDF"],
    tags: ["Automation", "Enterprise", "APIs"],
    featured: false,
    links: [],
    metrics: [
      { label: "Processing time", value: "3 days → <2 min" },
      { label: "Hours saved", value: "100+/month" },
    ],
    overview:
      "Built a backend system that generates structured Excel and PDF reports automatically, replacing a manual process that took 3 days. The system integrates with Ross XPression for live TV data workflows and reduced operational overhead by over 100 hours per month.",
    challenges: [
      "Mapping inconsistent manual Excel formats into a reliable automated pipeline.",
      "Ensuring report accuracy matched the manual process before cutover.",
      "Integrating with Ross XPression for automated content updates.",
    ],
    architecture:
      "Laravel backend pulls data from internal databases and external JSON APIs, processes it into structured report formats, and generates Excel/PDF outputs. WebSocket integration enables real-time data synchronisation across related applications.",
    decisions: [
      {
        decision: "Structured report templates over free-form Excel generation",
        rationale:
          "Templates ensure consistency and make validation against legacy outputs straightforward.",
        tradeoff:
          "Less flexibility for ad-hoc report changes without template updates.",
      },
    ],
    results: [
      "Reporting time reduced from 3 days to under 2 minutes.",
      "100+ operational hours saved per month.",
      "Real-time data sync via WebSockets across internal applications.",
    ],
    lessons: [
      "Automating manual processes requires shadow-running both systems in parallel before cutover — stakeholders need proof of parity.",
    ],
  },
];

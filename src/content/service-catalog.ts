import type { ProjectTypeKey } from "@/lib/validators/contact";

/**
 * The /services page: what can be hired, at what starting price.
 *
 * Prices are the live Upwork package prices (company profile, section 2:
 * "change prices in one place (Upwork) and copy them here, never the other
 * way round"). Every claim here must be backed by the CV or a case study;
 * tests/unit/content-claims.test.ts scans this file too.
 *
 * Saudi merchant work (Salla, Zid) stays out until the employment contract
 * check, as in src/content/services.ts.
 */

export type Service = {
  /** Contact form project type this service preselects. */
  type: ProjectTypeKey;
  title: string;
  /** "From $60" etc.; always a starting price. */
  price: string;
  summary: string;
  includes: string[];
  goodFor: string;
};

export const services: Service[] = [
  {
    type: "fix",
    title: "Laravel and PHP fixes",
    price: "From $60",
    summary:
      "The bug found at its cause, fixed, and covered by a test that fails without the fix. Slow pages and queries get the same treatment.",
    includes: [
      "Root-cause diagnosis, not a patch over the symptom",
      "The fix, with a regression test",
      "Slow query and N+1 investigation",
      "Indexes, rewritten queries or Redis caching, measured before and after",
      "Refactoring of the code around the fix where it helps",
    ],
    goodFor: "A live Laravel or PHP app with a known bug, or a page that got slow.",
  },
  {
    type: "integration",
    title: "APIs, payments and webhooks",
    price: "From $150",
    summary:
      "Payment gateways, partner APIs and store sync wired into your app so that a retried webhook can't charge, credit or ship twice.",
    includes: [
      "Payment gateway integration with signed webhooks",
      "Idempotency keys and safe retries",
      "REST API endpoints for your own clients or partners",
      "Third-party API clients with error handling and logging",
      "Order, product or stock sync with Shopify or WooCommerce",
    ],
    goodFor:
      "Teams connecting a Laravel app to a gateway, a store or a partner's API.",
  },
  {
    type: "ai",
    title: "AI features with OpenAI or Claude",
    price: "From $200",
    summary:
      "One specific feature, such as chat, summaries or pulling data out of documents, built into your app with limits on what it can cost.",
    includes: [
      "OpenAI or Anthropic Claude API integration",
      "Structured output validated before your app uses it",
      "Per-user spend limits and request logging",
      "The provider behind an interface, so it can be swapped",
      "Queued processing for slow or batch jobs",
    ],
    goodFor:
      "A product that wants one useful AI feature, not an AI rebuild. No model training.",
  },
  {
    type: "upgrade",
    title: "Laravel and PHP upgrades",
    price: "From $120",
    summary:
      "Your app moved to a supported Laravel and PHP version with the deprecations fixed and the tests green. PHP 8.2 stops getting security fixes on 31 December 2026.",
    includes: [
      "Laravel version upgrade, one major at a time",
      "PHP compatibility fixes",
      "Dependency updates and replacements for abandoned packages",
      "Tests added around risky areas before they change",
      "A regression check of the main flows",
    ],
    goodFor: "Apps on Laravel 10 or older, or on PHP 8.2 or older.",
  },
  {
    type: "maintenance",
    title: "Care plans",
    price: "From $249 a month",
    summary:
      "A set number of fix hours each month plus the upkeep nobody schedules: updates, patches, backups and monitoring, reported monthly.",
    includes: [
      "2, 5 or 10 fix hours a month ($249, $499 or $899)",
      "Framework and dependency updates, security patches",
      "Uptime monitoring and backups",
      "A monthly report, white-labelled for agencies",
      "First response within one working day",
    ],
    goodFor:
      "Agencies and businesses with a live app and no backend developer on call.",
  },
];

export type ServicePackage = {
  type: ProjectTypeKey;
  title: string;
  price: string;
  summary: string;
  includes: string[];
  excludes: string[];
  scope: string;
};

export const packages: ServicePackage[] = [
  {
    type: "fix",
    title: "Laravel quick fix",
    price: "From $60",
    summary: "One clearly scoped bug, fixed and verified.",
    includes: [
      "Investigation of the root cause",
      "The fix",
      "A regression test where the code allows one",
      "Verification with you on staging or a copy of the app",
    ],
    excludes: [
      "New features",
      "Server or hosting changes",
      "Bugs that need a redesign to fix",
    ],
    scope:
      "One bug in one repository. If the cause turns out to be bigger, I stop and quote before going further.",
  },
  {
    type: "health-check",
    title: "Backend health check",
    price: "$300 fixed",
    summary: "A 3-day review of one app, with a ranked list of what to fix.",
    includes: [
      "Code quality and structure review",
      "Upgrade and dependency risks",
      "Database query and index review",
      "Security configuration review",
      "Payments and queues, where the app has them",
      "A prioritised fix list with effort estimates",
    ],
    excludes: [
      "Making the fixes (quoted separately or done on a care plan)",
      "Penetration testing",
      "Front-end and design review",
    ],
    scope: "One application and its database. Read access to the code is enough.",
  },
  {
    type: "ai",
    title: "AI integration starter",
    price: "From $200",
    summary: "One AI feature built into your Laravel app, with cost limits.",
    includes: [
      "One feature: chat, summarise or extract",
      "OpenAI or Claude, wired into your app",
      "Per-user spend cap and logging",
      "Handling for timeouts and malformed output",
      "Tests and short handover notes",
    ],
    excludes: [
      "Model training or fine-tuning",
      "More than one feature",
      "API usage fees (billed by the provider to your account)",
    ],
    scope:
      "One feature in one app. Further features are quoted after the first is live.",
  },
];

export type EngagementPath = {
  type: ProjectTypeKey;
  title: string;
  price: string;
  description: string;
  cta: string;
};

export const engagementPaths: EngagementPath[] = [
  {
    type: "fix",
    title: "Small fixed-price tasks",
    price: "From $60",
    description:
      "A bug, a slow page, an upgrade step or a single integration. Scoped and priced in writing before I start, delivered with a test.",
    cta: "Start with a small task",
  },
  {
    type: "build",
    title: "Custom development",
    price: "Specs from $150",
    description:
      "Builds, integrations and upgrades that need a plan. We agree a written spec first, then a fixed price for the build. MVP builds start at $1,500.",
    cta: "Discuss a project",
  },
  {
    type: "maintenance",
    title: "Ongoing backend support",
    price: "From $249 a month",
    description:
      "A care plan with fix hours every month, plus updates, backups, monitoring and a monthly report.",
    cta: "Ask about a care plan",
  },
];

export const pricingNote =
  "Prices are starting points for a clearly scoped job. The final price depends on the size of the codebase, how far behind it is and what the work turns up, and you get it in writing before I start.";

export type FaqItem = { question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    question: "What types of Laravel projects do you work on?",
    answer:
      "Mostly SaaS backends and the systems around them: multi-tenant platforms, billing, payments and ledgers, reporting, and integrations with gateways, stores and partner APIs. I've built these for a logistics SaaS, an ISP and a media company.",
  },
  {
    question: "Can you fix bugs in an existing Laravel application?",
    answer:
      "Yes, it's the most common job. I find the cause, fix it, and add a test that fails without the fix, so it stays fixed. Small, clearly scoped fixes start at $60.",
  },
  {
    question: "Do you work with legacy PHP applications?",
    answer:
      "Yes, older Laravel versions and plain PHP codebases both. Before changing anything risky I put tests around it, so we know the change didn't break what already worked.",
  },
  {
    question: "Can you upgrade Laravel and PHP versions?",
    answer:
      "Yes, from $120 depending on how far behind the app is. I go one major version at a time and keep the tests green at each step. PHP 8.2 stops getting security fixes on 31 December 2026, so apps on 8.2 or older should plan an upgrade.",
  },
  {
    question: "Do you integrate the OpenAI and Claude APIs?",
    answer:
      "Yes. I build specific features such as chat, summaries and extracting data from documents, with per-user spend limits, logging, and output that's validated before your app uses it. I don't train or fine-tune models.",
  },
  {
    question: "Can you optimise slow PostgreSQL queries?",
    answer:
      "Yes. I start from the query plan, then fix it with an index, a rewritten query, or Redis caching where the data allows, and I measure before and after so you can see the difference.",
  },
  {
    question: "Do you build payment gateway integrations?",
    answer:
      "Yes. On a live logistics SaaS I designed the financial engine: card payments, a double-entry ledger and reconciliation. Integrations come with signed webhooks, retries and idempotency, so a repeated webhook can't charge or credit twice.",
  },
  {
    question: "Can you write automated tests for an existing application?",
    answer:
      "Yes, including apps with no tests at all. I start with the paths where a bug costs money or data, using Pest or PHPUnit, then add Larastan and CI so the tests keep running.",
  },
  {
    question: "Do you offer ongoing backend maintenance?",
    answer:
      "Yes. Care plans start at $249 a month and include 2, 5 or 10 fix hours, updates, security patches, backups, uptime monitoring and a monthly report. Unused hours don't roll over.",
  },
  {
    question: "How do you estimate project costs?",
    answer:
      "From a written scope. Small jobs get a fixed price before I start. Bigger work starts with a short written spec, priced on its own, and then a fixed price for the build.",
  },
  {
    question: "Can you work with an existing development team?",
    answer:
      "Yes. I work in your repository, branches and review process, and write handover notes for whoever maintains the code next. For agencies the work is white-label, with an NDA on request, and I never contact your client.",
  },
  {
    question: "Do you work on fixed-price projects?",
    answer:
      "Yes. Scope and price are agreed in writing before I start, and you get a short progress update every working day.",
  },
];

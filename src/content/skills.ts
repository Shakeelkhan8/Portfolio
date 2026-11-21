import type { SkillGroup } from "@/types";

/**
 * Tech stack groups (CMS skill categories via content:sync). Each item is
 * verified from the CV, a repository, or the user's own confirmation
 * (mobile and security items, 2026-11-19; Python, GraphQL, MongoDB, JWT /
 * OAuth 2.0, Kubernetes, Nginx and RabbitMQ / Kafka, 2026-11-21). The user
 * asked to keep every earlier skill (2026-11-19) and to drop iOS (Swift)
 * (2026-11-21).
 */
export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript", "PHP 8.4", "Python", "Go", "SQL"],
  },
  {
    category: "Backend",
    skills: [
      "Node.js",
      "NestJS",
      "Express",
      "Laravel",
      "REST APIs",
      "GraphQL",
      "WebSockets",
      "Queues and scheduled jobs",
      "RabbitMQ / Kafka",
      "Idempotent webhooks",
      "Multi-tenancy",
      "RBAC",
      "Adapter pattern",
    ],
  },
  {
    category: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Vue.js",
      "Livewire",
      "Vite",
      "Tailwind CSS",
      "Blade",
      "jQuery",
    ],
  },
  {
    category: "Mobile",
    skills: ["React Native", "Flutter"],
  },
  {
    category: "Data",
    skills: [
      "PostgreSQL",
      "MySQL",
      "Redis",
      "MongoDB",
      "Prisma",
      "Supabase",
      "Row-level security",
      "Schema design",
      "Indexing",
      "Migrations",
    ],
  },
  {
    category: "Payments and integrations",
    skills: [
      "Stripe",
      "HyperPay",
      "EdfaPay",
      "Shopify",
      "Salla",
      "Zid",
      "WooCommerce",
      "Odoo",
      "Webhooks",
    ],
  },
  {
    category: "Security",
    skills: [
      "Secure development",
      "JWT / OAuth 2.0",
      "OWASP web app audits",
      "Code security reviews",
      "Server hardening",
      "Dependency audits",
    ],
  },
  {
    category: "AI integration",
    skills: [
      "OpenAI API",
      "Claude API",
      "Structured output",
      "Evals",
      "Batch processing",
      "Spend limits",
    ],
  },
  {
    category: "DevOps and testing",
    skills: [
      "Docker",
      "Kubernetes",
      "Nginx",
      "GitHub Actions",
      "AWS (EC2, S3, RDS)",
      "Vercel",
      "Linux",
      "OpenTelemetry",
      "Sentry",
      "Vitest",
      "Pest and PHPUnit",
      "Playwright",
      "Larastan",
    ],
  },
];

export const aboutIntro = [
  "I'm Shakeel, a full stack developer and software engineer working in Laravel, PHP and PostgreSQL. Most of what I build is the part of a product nobody sees until it breaks: payment webhooks, ledgers, tenant isolation, scheduled jobs and the integrations between them.",
  "On a live logistics SaaS, I designed the financial engine (double-entry ledger, invoicing, reconciliation and card payments), the tenant-isolation layer, and a deploy gate that blocks any release if the payment tests fail.",
  "How I work: scope and price are confirmed in writing before I start, you get a short progress update every working day, every fix ships with a test that proves it, and the handover notes are written for whoever maintains the code next. For agencies the work is white-label, with an NDA on request, and I never contact your client.",
  "Tell me what you need, and I'll tell you honestly whether I'm the right fit.",
];

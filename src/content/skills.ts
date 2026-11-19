import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Backend",
    skills: ["PHP 8.4", "Laravel", "Go", "Node.js", "REST APIs", "WebSockets"],
  },
  {
    category: "Data",
    skills: [
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Schema design",
      "Indexing",
      "Migrations",
    ],
  },
  {
    category: "Architecture",
    skills: [
      "Multi-tenancy",
      "RBAC",
      "Queues and scheduled jobs",
      "Idempotent webhooks",
      "Adapter pattern",
    ],
  },
  {
    category: "Integrations",
    skills: [
      "Salla",
      "Zid",
      "Shopify",
      "WooCommerce",
      "HyperPay",
      "EdfaPay",
      "Stripe",
      "Webhooks",
    ],
  },
  {
    category: "AI integration",
    skills: [
      "OpenAI API",
      "Claude API",
      "Structured output",
      "Batch processing",
      "Spend limits",
    ],
  },
  {
    category: "Frontend",
    skills: ["Vue.js", "Livewire", "Blade", "React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Delivery",
    skills: [
      "Docker",
      "GitHub Actions",
      "Linux",
      "Pest and PHPUnit",
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

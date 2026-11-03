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
  "I'm Shakeel, a Laravel backend developer in Islamabad. I've been building for the web since 2021 and working full-time with PHP and Laravel since 2022. Most of what I build is the part of a product nobody sees until it breaks: payment webhooks, ledgers, tenant isolation, scheduled jobs and the integrations between them.",
  "At Elityx I work on a multi-tenant dispatch platform for logistics companies in Saudi Arabia. I was its primary engineer for the first seven months, and I designed its financial engine, the layer that keeps each company's data separate, and the framework that client integrations plug into.",
  "Before that I spent two years at Hum Network automating reporting that used to take three days by hand. Alongside my job I take Laravel project work: payment integrations, AI features with OpenAI or Claude, upgrades, store sync and bug fixes.",
  "I'm open to remote backend roles, and to project work where money and data move between systems.",
];

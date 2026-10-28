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
      "ZATCA e-invoicing",
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
  "I'm Shakeel, a backend engineer in Islamabad. I've worked full-time in PHP and Laravel since 2022, and most of what I build is the part of a SaaS product nobody sees until it breaks: tenant isolation, ledgers, payment webhooks, scheduled jobs and the integrations between them.",
  "Today I'm the primary backend engineer at Elityx on a multi-tenant dispatch platform for logistics companies in Saudi Arabia. It runs five companies, more than 200 drivers and over 500 shipments a day, and I own most of the backend: the schema, the APIs, the financial system and deployment.",
  "Before that I spent two years at Hum Network automating reporting that used to take three days by hand, and as a freelancer I built billing software that three internet providers use every day. In my own time I build tools I want to use myself, like Vantage and Keystone.",
  "I'm open to remote backend roles on product teams, and to project work where reliability and money are involved.",
];

import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Backend",
    skills: [
      "Laravel",
      "PHP",
      "Node.js",
      "REST APIs",
      "WebSockets",
      "Socket.IO",
    ],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MySQL", "Schema Design", "Indexing", "Migrations"],
  },
  {
    category: "Architecture",
    skills: [
      "Multi-Tenancy",
      "RBAC",
      "API-First Design",
      "Adapter Pattern",
      "Caching Strategies",
    ],
  },
  {
    category: "Integrations",
    skills: [
      "Webhooks",
      "Shopify",
      "Salla",
      "WooCommerce",
      "Payment Gateways",
    ],
  },
  {
    category: "Frontend",
    skills: ["React", "Next.js", "Vue.js", "Tailwind CSS", "JavaScript"],
  },
  {
    category: "Infrastructure",
    skills: ["Docker", "Git", "CI/CD", "Linux", "Postman", "Swagger"],
  },
];

export const aboutIntro = [
  "Backend engineer with 5+ years of experience building and shipping production-grade SaaS platforms, enterprise automation systems, and API-driven architectures.",
  "Currently architecting and owning 80%+ of the backend for a live multi-tenant Dispatch Management SaaS serving 5 onboarded companies, 200+ captains, and 500+ daily shipments.",
  "I focus on systems that remain reliable under real operational load — from database design and API contracts to webhook integrations and deployment pipelines.",
];

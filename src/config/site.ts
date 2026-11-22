export const siteConfig = {
  name: "Shakeel Khan",
  legalName: "Muhammad Shakeel",
  title: "Full Stack Developer & Software Engineer",
  description:
    "Full stack developer and software engineer specialising in payments, integrations and multi-tenant SaaS on Laravel and PostgreSQL: payment gateways and webhooks, ledgers, tenant isolation, APIs and AI features.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  location: "Pakistan",
  city: "Islamabad",
  timezone: "Asia/Karachi",
  phone: "+92 318 0549115",
  email: "shakeelkhan4147@gmail.com",
  /** Full-time years, counted from October 2022. Internships are not included. */
  yearsOfExperience: 4,
  links: {
    github: "https://github.com/Shakeelkhan8",
    linkedin: "https://www.linkedin.com/in/shakeelkhan8",
  },
  githubUsername: "Shakeelkhan8",
  languages: [
    { name: "Urdu", level: "Native" },
    { name: "Pashto", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
  ],
  /** The response time promised on the contact page; keep it a promise care plans can meet. */
  responseTime: "Within one working day.",
  availability: {
    status: "available" as const,
    message: "Open to full-time and remote roles, and to project work.",
  },
  expertise: [
    "Payments & SaaS",
    "DevOps",
    "Security audits",
    "Network & broadcast",
    "Mobile apps",
  ],
  philosophy: [
    {
      title: "Make the wrong thing hard",
      description:
        "Tenant scoping, idempotency keys and append-only ledgers belong in the structure of the code, not in a checklist someone has to remember.",
    },
    {
      title: "Plan for the retry",
      description:
        "Webhooks arrive twice, jobs die halfway through and payment providers time out. I design handlers for that from the first commit.",
    },
    {
      title: "Measure before optimising",
      description:
        "I add an index or a cache when a query plan or a profile says so, not because it might help.",
    },
    {
      title: "Write the decision down",
      description:
        "Trade-offs go in the code and the commit history, so the next engineer doesn't have to guess why something is the way it is.",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Shakeel Khan",
  legalName: "Muhammad Shakeel",
  title: "Senior Backend Engineer",
  description:
    "Senior Backend Engineer building scalable systems, multi-tenant SaaS platforms, and production-grade APIs.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  location: "Pakistan",
  city: "Islamabad",
  timezone: "Asia/Karachi",
  phone: "+92 318 0549115",
  email: "shakeelkhan4147@gmail.com",
  yearsOfExperience: 5,
  links: {
    github: "https://github.com/Shakeelkhan8",
    linkedin: "https://www.linkedin.com/in/shakeel-khan-47888a288/",
  },
  languages: [
    { name: "Urdu", level: "Native" },
    { name: "Pashto", level: "Native" },
    { name: "English", level: "Professional Working Proficiency" },
  ],
  availability: {
    status: "available" as const,
    message:
      "Open to full-time roles, contract work, and consulting opportunities.",
  },
  expertise: [
    "Backend Architecture",
    "Multi-Tenant SaaS",
    "API Design",
    "Database Design",
    "Performance Engineering",
    "System Integration",
  ],
  philosophy: [
    {
      title: "Build for scale, not just for today",
      description:
        "Design systems that remain reliable and maintainable as requirements grow.",
    },
    {
      title: "Simplicity without sacrificing flexibility",
      description:
        "Prefer clear architecture over clever abstractions that obscure intent.",
    },
    {
      title: "Optimize what you measure",
      description:
        "Target real bottlenecks with data — not premature optimization.",
    },
    {
      title: "Software others enjoy maintaining",
      description:
        "Readable code, thoughtful naming, and consistent patterns reduce long-term cost.",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

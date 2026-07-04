export const siteConfig = {
  name: "Shakeel Khan",
  title: "Senior Backend Engineer",
  description:
    "Senior Backend Engineer building scalable systems, reliable APIs, and production-grade software.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  location: "Pakistan",
  timezone: "Asia/Karachi",
  email: "shakeelkhan4147@gmail.com",
  links: {
    github: "https://github.com/Shakeelkhan8",
    linkedin: "https://www.linkedin.com/in/shakeel-khan-47888a288/",
  },
  availability: {
    status: "available" as const,
    message:
      "Open to full-time roles, contract work, and consulting opportunities.",
  },
} as const;

export type SiteConfig = typeof siteConfig;

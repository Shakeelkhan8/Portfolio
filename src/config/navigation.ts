import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { title: "About", href: "/about" },
  { title: "Projects", href: "/projects" },
  { title: "Writing", href: "/writing" },
  { title: "Experience", href: "/experience" },
  { title: "Contact", href: "/contact" },
];

export const utilityNav: NavItem[] = [
  { title: "Resume", href: "/resume" },
  { title: "Open Source", href: "/open-source" },
];

export const footerNav: NavItem[] = [
  { title: "Privacy", href: "/privacy" },
  { title: "RSS", href: "/rss.xml" },
];

export const socialNav: NavItem[] = [
  {
    title: "GitHub",
    href: "https://github.com/Shakeelkhan8",
    external: true,
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/shakeel-khan-47888a288/",
    external: true,
  },
  {
    title: "Email",
    href: "mailto:shakeelkhan4147@gmail.com",
    external: true,
  },
];

export const routes = {
  home: "/",
  about: "/about",
  projects: "/projects",
  project: (slug: string) => `/projects/${slug}` as const,
  experience: "/experience",
  writing: "/writing",
  article: (slug: string) => `/writing/${slug}` as const,
  openSource: "/open-source",
  resume: "/resume",
  contact: "/contact",
  privacy: "/privacy",
  rss: "/rss.xml",
  sitemap: "/sitemap.xml",
} as const;

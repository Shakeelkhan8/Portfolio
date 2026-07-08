import { siteConfig } from "@/config/site";
import { getMailtoHref } from "@/lib/contact/email-display";
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
    href: siteConfig.links.github,
    external: true,
  },
  {
    title: "LinkedIn",
    href: siteConfig.links.linkedin,
    external: true,
  },
  {
    title: "Email",
    href: getMailtoHref(siteConfig.email),
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
  page: (slug: string) => `/${slug}` as const,
  privacy: "/privacy",
  rss: "/rss.xml",
  sitemap: "/sitemap.xml",
} as const;

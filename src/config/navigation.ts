import { siteConfig } from "@/config/site";
import { getMailtoHref } from "@/lib/contact/email-display";
import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { title: "Work", href: "/projects" },
  { title: "About", href: "/about" },
  { title: "Resume", href: "/resume" },
  { title: "Contact", href: "/contact" },
];

// Writing is left out of the navigation until there are enough posts to make
// it worth a link (see MIN_ARTICLES_FOR_HOME on the home page). The /writing
// pages, sitemap entries and RSS feed stay live.
export const utilityNav: NavItem[] = [
  { title: "Experience", href: "/experience" },
  { title: "Open source", href: "/open-source" },
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
  terminal: "/terminal",
  page: (slug: string) => `/${slug}` as const,
  privacy: "/privacy",
  rss: "/rss.xml",
  sitemap: "/sitemap.xml",
} as const;

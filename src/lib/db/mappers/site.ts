import { getPublicEnv } from "@/lib/env";
import type {
  CtaSection,
  NavigationData,
  NavigationItemRecord,
  SectionHeader,
  SiteConfig,
} from "@/types/cms";
import type { NavItem } from "@/types";

export function toIsoMonth(date: string | null): string | null {
  if (!date) return null;
  return date.slice(0, 7);
}

export function mapSiteConfig(input: {
  site: {
    site_name: string;
    legal_name: string;
    tagline: string;
    description: string;
    email: string;
    phone: string | null;
    location: string;
    city: string | null;
    timezone: string;
    years_of_experience: number;
    availability_status: SiteConfig["availability"]["status"];
    availability_message: string;
    github_username: string | null;
    resume_summary: string | null;
    maintenance_enabled: boolean;
    maintenance_message: string | null;
    response_time_text: string | null;
    copyright_text: string | null;
    languages_visible?: boolean | null;
  };
  expertise: Array<{ title: string }>;
  philosophy: Array<{ title: string; description: string }>;
  languages: Array<{ name: string; level: string }>;
  socialLinks: Array<{ platform: string; url: string }>;
}): SiteConfig {
  const github =
    input.socialLinks.find((link) => link.platform === "github")?.url ?? "";
  const linkedin =
    input.socialLinks.find((link) => link.platform === "linkedin")?.url ?? "";

  return {
    name: input.site.site_name,
    legalName: input.site.legal_name,
    title: input.site.tagline,
    description: input.site.description,
    url: getPublicEnv().NEXT_PUBLIC_SITE_URL,
    location: input.site.location,
    city: input.site.city ?? "",
    timezone: input.site.timezone,
    phone: input.site.phone ?? "",
    email: input.site.email,
    yearsOfExperience: input.site.years_of_experience,
    links: { github, linkedin },
    githubUsername: input.site.github_username ?? "",
    languages: input.languages.map((language) => ({
      name: language.name,
      level: language.level,
    })),
    languagesVisible: input.site.languages_visible ?? true,
    availability: {
      status: input.site.availability_status,
      message: input.site.availability_message,
    },
    expertise: input.expertise.map((item) => item.title),
    philosophy: input.philosophy.map((item) => ({
      title: item.title,
      description: item.description,
    })),
    resumeSummary: input.site.resume_summary ?? "",
    responseTimeText:
      input.site.response_time_text ?? "Usually within 24–48 hours.",
    copyrightText:
      input.site.copyright_text ??
      `© ${new Date().getFullYear()} ${input.site.site_name}. All rights reserved.`,
    maintenanceEnabled: input.site.maintenance_enabled,
    maintenanceMessage: input.site.maintenance_message,
  };
}

function mapNavItem(item: NavigationItemRecord): NavItem {
  return {
    title: item.title,
    href: item.href,
    external: item.external,
  };
}

export function mapNavigation(items: NavigationItemRecord[]): NavigationData {
  const visible = items.filter((item) => item.visible);

  const sort = (group: NavigationItemRecord["navGroup"]) =>
    visible
      .filter((item) => item.navGroup === group)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(mapNavItem);

  return {
    mainNav: sort("main"),
    utilityNav: sort("utility"),
    footerNav: sort("footer"),
    socialNav: sort("social"),
  };
}

export function mapSectionHeader(row: {
  page_key: string;
  section_key: string;
  title: string;
  description: string | null;
}): SectionHeader {
  return {
    pageKey: row.page_key,
    sectionKey: row.section_key,
    title: row.title,
    description: row.description,
  };
}

export function mapCtaSection(row: {
  section_key: string;
  title: string;
  description: string | null;
  primary_label: string | null;
  primary_href: string | null;
  secondary_label: string | null;
  secondary_href: string | null;
}): CtaSection {
  return {
    key: row.section_key,
    title: row.title,
    description: row.description,
    primaryLabel: row.primary_label,
    primaryHref: row.primary_href,
    secondaryLabel: row.secondary_label,
    secondaryHref: row.secondary_href,
  };
}

export function mapNavigationItem(row: {
  id: string;
  nav_group: NavigationItemRecord["navGroup"];
  title: string;
  href: string;
  external: boolean;
  display_order: number;
  visible: boolean;
}): NavigationItemRecord {
  return {
    id: row.id,
    navGroup: row.nav_group,
    title: row.title,
    href: row.href,
    external: row.external,
    displayOrder: row.display_order,
    visible: row.visible,
  };
}

import { siteConfig as defaultSiteConfig } from "@/config/site";
import { mainNav, utilityNav, footerNav, socialNav } from "@/config/navigation";
import { aboutIntro, skillGroups } from "@/content/skills";
import {
  accomplishments,
  education,
  experience,
  resumeSummary,
} from "@/content/experience";
import { projects } from "@/content/projects";
import { articles } from "@/content/writing";
import { architectureDiagrams } from "@/content/architecture";
import { homeSectionHeaders, ctaSections } from "@/lib/seed/content-data";
import type {
  AboutContent,
  AchievementRecord,
  EducationRecord,
  ExperienceRecord,
  HomePageContent,
  NavigationData,
  NavigationItemRecord,
  SectionHeader,
  SiteConfig,
  SkillCategoryRecord,
} from "@/types/cms";
import type { Article, Project } from "@/types";

export function getFallbackSiteConfig(): SiteConfig {
  return {
    name: defaultSiteConfig.name,
    legalName: defaultSiteConfig.legalName,
    title: defaultSiteConfig.title,
    description: defaultSiteConfig.description,
    url: defaultSiteConfig.url,
    location: defaultSiteConfig.location,
    city: defaultSiteConfig.city,
    timezone: defaultSiteConfig.timezone,
    phone: defaultSiteConfig.phone,
    email: defaultSiteConfig.email,
    yearsOfExperience: defaultSiteConfig.yearsOfExperience,
    links: defaultSiteConfig.links,
    githubUsername: defaultSiteConfig.githubUsername,
    languages: [...defaultSiteConfig.languages],
    availability: { ...defaultSiteConfig.availability },
    expertise: [...defaultSiteConfig.expertise],
    philosophy: defaultSiteConfig.philosophy.map((item) => ({ ...item })),
    resumeSummary,
    responseTimeText: "Usually within 24–48 hours.",
    copyrightText: `© ${new Date().getFullYear()} ${defaultSiteConfig.name}. All rights reserved.`,
    maintenanceEnabled: false,
    maintenanceMessage: null,
  };
}

export function getFallbackNavigation(): NavigationData {
  return {
    mainNav: [...mainNav],
    utilityNav: [...utilityNav],
    footerNav: [...footerNav],
    socialNav: [...socialNav],
  };
}

export function getFallbackHomeContent(): HomePageContent {
  return {
    sectionHeaders: homeSectionHeaders.map((header) => ({
      pageKey: header.page_key,
      sectionKey: header.section_key,
      title: header.title,
      description: header.description,
    })),
    ctaSections: ctaSections.map((cta) => ({
      key: cta.section_key,
      title: cta.title,
      description: cta.description,
      primaryLabel: cta.primary_label,
      primaryHref: cta.primary_href,
      secondaryLabel: cta.secondary_label,
      secondaryHref: cta.secondary_href,
    })),
  };
}

export function getFallbackAboutContent(): AboutContent {
  return { paragraphs: [...aboutIntro] };
}

export function getFallbackSkillCategories(): SkillCategoryRecord[] {
  return skillGroups.map((group, index) => ({
    id: `fallback-${group.category}`,
    name: group.category,
    slug: group.category.toLowerCase().replace(/\s+/g, "-"),
    displayOrder: index,
    skills: group.skills.map((skill, skillIndex) => ({
      id: `fallback-${group.category}-${skill}`,
      name: skill,
      icon: null,
      level: null,
      displayOrder: skillIndex,
    })),
  }));
}

export function getFallbackExperience(): ExperienceRecord[] {
  return experience.map((entry, index) => ({
    id: entry.id,
    legacyId: entry.id,
    company: entry.company,
    role: entry.role,
    location: entry.location,
    startDate: entry.startDate,
    endDate: entry.endDate,
    description: null,
    featured: entry.featured ?? false,
    displayOrder: index,
    highlights: [...entry.highlights],
    technologies: [],
  }));
}

export function getFallbackEducation(): EducationRecord[] {
  return [
    {
      id: "fallback-education",
      institution: education.institution,
      degree: education.degree,
      location: education.location,
      startDate: education.startDate,
      endDate: education.endDate,
      description: null,
      displayOrder: 0,
      achievements: [],
    },
  ];
}

export function getFallbackAchievements(): AchievementRecord[] {
  return accomplishments.map((item, index) => ({
    id: `fallback-achievement-${index}`,
    text: item.text,
    featured: index < 2,
    displayOrder: index,
  }));
}

export function getFallbackNavigationItems(): NavigationItemRecord[] {
  const navigation = getFallbackNavigation();

  return [
    ...navigation.mainNav.map((item, index) => ({
      id: `fallback-main-${index}`,
      navGroup: "main" as const,
      title: item.title,
      href: item.href,
      external: item.external ?? false,
      displayOrder: index,
      visible: true,
    })),
    ...navigation.utilityNav.map((item, index) => ({
      id: `fallback-utility-${index}`,
      navGroup: "utility" as const,
      title: item.title,
      href: item.href,
      external: item.external ?? false,
      displayOrder: index,
      visible: true,
    })),
    ...navigation.footerNav.map((item, index) => ({
      id: `fallback-footer-${index}`,
      navGroup: "footer" as const,
      title: item.title,
      href: item.href,
      external: item.external ?? false,
      displayOrder: index,
      visible: true,
    })),
    ...navigation.socialNav.map((item, index) => ({
      id: `fallback-social-${index}`,
      navGroup: "social" as const,
      title: item.title,
      href: item.href,
      external: item.external ?? true,
      displayOrder: index,
      visible: true,
    })),
  ];
}

export function getFallbackProjects(): Project[] {
  return projects.map((project) => ({
    ...project,
    futureImprovements: project.futureImprovements
      ? [...project.futureImprovements]
      : undefined,
  }));
}

export function getFallbackArticles(): Article[] {
  return articles.filter((article) => article.published);
}

export function getFallbackArchitectureDiagram(slug: string) {
  return architectureDiagrams[slug];
}

export function getFallbackSectionHeader(
  pageKey: string,
  sectionKey: string,
): SectionHeader | undefined {
  return getFallbackHomeContent().sectionHeaders.find(
    (header) =>
      header.pageKey === pageKey && header.sectionKey === sectionKey,
  );
}

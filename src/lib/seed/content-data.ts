import { siteConfig } from "@/config/site";
import {
  footerNav,
  mainNav,
  socialNav,
  utilityNav,
} from "@/config/navigation";
import { architectureDiagrams } from "@/content/architecture";
import {
  accomplishments,
  education,
  experience,
  resumeSummary,
} from "@/content/experience";
import { aboutIntro, skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";
import { articles } from "@/content/writing";
import { parseMonthDate, slugify } from "@/lib/seed/helpers";

export const SEED_META_KEY = "seed_completed";

export const homeSectionHeaders = [
  {
    page_key: "home",
    section_key: "expertise",
    title: "Expertise",
    description: "Areas where I deliver the most impact.",
    display_order: 1,
  },
  {
    page_key: "home",
    section_key: "projects",
    title: "Selected Projects",
    description: "Engineering case studies from production systems.",
    display_order: 2,
  },
  {
    page_key: "home",
    section_key: "philosophy",
    title: "How I Think",
    description: "Principles that guide my engineering decisions.",
    display_order: 3,
  },
  {
    page_key: "home",
    section_key: "writing",
    title: "Latest Writing",
    description: null,
    display_order: 4,
  },
  {
    page_key: "home",
    section_key: "experience",
    title: "Experience",
    description: null,
    display_order: 5,
  },
] as const;

export const ctaSections = [
  {
    section_key: "home_contact",
    title: "Let's work together",
    description: siteConfig.availability.message,
    primary_label: "Contact me",
    primary_href: "/contact",
    secondary_label: siteConfig.email,
    secondary_href: `mailto:${siteConfig.email}`,
  },
] as const;

export function getSeedPayload() {
  return {
    siteSettings: {
      site_name: siteConfig.name,
      legal_name: siteConfig.legalName,
      tagline: siteConfig.title,
      description: siteConfig.description,
      email: siteConfig.email,
      phone: siteConfig.phone,
      location: siteConfig.location,
      city: siteConfig.city,
      timezone: siteConfig.timezone,
      years_of_experience: siteConfig.yearsOfExperience,
      copyright_text: `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
      availability_status: siteConfig.availability.status,
      availability_message: siteConfig.availability.message,
      github_username: siteConfig.githubUsername,
      resume_summary: resumeSummary,
      maintenance_enabled: false,
      maintenance_message: null,
      response_time_text: "Usually within 24–48 hours.",
    },
    themeSettings: {
      primary_color: "#2563eb",
      accent_color: "#2563eb",
      background_color: "#fafafa",
      foreground_color: "#171717",
      font_heading: "Geist",
      font_body: "Geist",
      font_mono: "Geist Mono",
    },
    seoDefaults: {
      default_title: `${siteConfig.name} — ${siteConfig.title}`,
      default_description: siteConfig.description,
      default_robots: "index, follow",
      twitter_card_type: "summary_large_image",
    },
    analyticsSettings: {
      plausible_enabled: false,
      ga4_enabled: false,
    },
    githubSettings: {
      username: siteConfig.githubUsername,
      show_live_stats: true,
    },
    philosophyItems: siteConfig.philosophy.map((item, index) => ({
      title: item.title,
      description: item.description,
      display_order: index,
    })),
    expertiseItems: siteConfig.expertise.map((title, index) => ({
      title,
      display_order: index,
    })),
    aboutParagraphs: aboutIntro.map((content, index) => ({
      content,
      display_order: index,
    })),
    languages: siteConfig.languages.map((language, index) => ({
      name: language.name,
      level: language.level,
      display_order: index,
    })),
    achievements: accomplishments.map((item, index) => ({
      text: item.text,
      featured: index < 2,
      display_order: index,
    })),
    navigation: [
      ...mainNav.map((item, index) => ({
        nav_group: "main" as const,
        title: item.title,
        href: item.href,
        external: item.external ?? false,
        display_order: index,
      })),
      ...utilityNav.map((item, index) => ({
        nav_group: "utility" as const,
        title: item.title,
        href: item.href,
        external: item.external ?? false,
        display_order: index,
      })),
      ...footerNav.map((item, index) => ({
        nav_group: "footer" as const,
        title: item.title,
        href: item.href,
        external: item.external ?? false,
        display_order: index,
      })),
      ...socialNav.map((item, index) => ({
        nav_group: "social" as const,
        title: item.title,
        href: item.href,
        external: item.external ?? true,
        display_order: index,
      })),
    ],
    socialLinks: [
      {
        platform: "github",
        label: "GitHub",
        url: siteConfig.links.github,
        icon: "github",
        display_order: 0,
      },
      {
        platform: "linkedin",
        label: "LinkedIn",
        url: siteConfig.links.linkedin,
        icon: "linkedin",
        display_order: 1,
      },
      {
        platform: "email",
        label: "Email",
        url: `mailto:${siteConfig.email}`,
        icon: "mail",
        display_order: 2,
      },
    ],
    skillGroups,
    experience: experience.map((entry, index) => ({
      legacy_id: entry.id,
      company: entry.company,
      role: entry.role,
      location: entry.location,
      start_date: parseMonthDate(entry.startDate),
      end_date: entry.endDate ? parseMonthDate(entry.endDate) : null,
      featured: entry.featured ?? false,
      display_order: index,
      highlights: entry.highlights,
    })),
    education: [
      {
        institution: education.institution,
        degree: education.degree,
        location: education.location,
        start_date: parseMonthDate(education.startDate),
        end_date: parseMonthDate(education.endDate),
        display_order: 0,
      },
    ],
    projects: projects.map((project, index) => ({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      problem: project.problem,
      role: project.role,
      context: project.context,
      overview: project.overview,
      architecture_text: project.architecture,
      status: "published" as const,
      featured: project.featured,
      display_order: index,
      published_at: new Date().toISOString(),
      stack: project.stack,
      tags: project.tags,
      links: project.links,
      metrics: project.metrics,
      challenges: project.challenges,
      decisions: project.decisions,
      results: project.results,
      lessons: project.lessons,
      futureImprovements: project.futureImprovements ?? [],
      diagram: architectureDiagrams[project.slug] ?? null,
    })),
    articles: articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content_html: article.content ?? "",
      status: "published" as const,
      reading_time_minutes: article.readingTime,
      published_at: article.date,
      meta_title: article.title,
      meta_description: article.excerpt,
      tags: article.tags,
    })),
    privacyPage: {
      slug: "privacy",
      title: "Privacy Policy",
      content_html: `
        <h2>Overview</h2>
        <p>This privacy policy explains how ${siteConfig.name} ("I", "me") handles information when you visit this portfolio website.</p>
        <h2>Information I Collect</h2>
        <p>If you use the contact form, I collect your name, email address, and message content solely to respond to your inquiry.</p>
        <h2>Contact Form</h2>
        <p>Contact form submissions are stored securely and may also be delivered by email.</p>
        <h2>Analytics</h2>
        <p>This site may use privacy-focused analytics when enabled in production.</p>
      `.trim(),
      status: "published" as const,
      meta_title: "Privacy Policy",
      meta_description: "Privacy policy for this portfolio website.",
    },
    sectionHeaders: homeSectionHeaders,
    ctaSections,
  };
}

export function getSkillCategorySlug(name: string) {
  return slugify(name);
}

import type { NavItem } from "@/types";

export type AvailabilityStatus = "available" | "unavailable" | "limited";

export type SiteConfig = {
  name: string;
  legalName: string;
  title: string;
  description: string;
  url: string;
  location: string;
  city: string;
  timezone: string;
  phone: string;
  email: string;
  yearsOfExperience: number;
  links: {
    github: string;
    linkedin: string;
  };
  githubUsername: string;
  languages: Array<{ name: string; level: string }>;
  availability: {
    status: AvailabilityStatus;
    message: string;
  };
  expertise: string[];
  philosophy: Array<{ title: string; description: string }>;
  resumeSummary: string;
  responseTimeText: string;
  copyrightText: string;
};

export type NavigationData = {
  mainNav: NavItem[];
  utilityNav: NavItem[];
  footerNav: NavItem[];
  socialNav: NavItem[];
};

export type SectionHeader = {
  pageKey: string;
  sectionKey: string;
  title: string;
  description: string | null;
};

export type CtaSection = {
  key: string;
  title: string;
  description: string | null;
  primaryLabel: string | null;
  primaryHref: string | null;
  secondaryLabel: string | null;
  secondaryHref: string | null;
};

export type HomePageContent = {
  sectionHeaders: SectionHeader[];
  ctaSections: CtaSection[];
};

export type SkillCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  skills: Array<{
    id: string;
    name: string;
    icon: string | null;
    level: string | null;
    displayOrder: number;
  }>;
};

export type ExperienceRecord = {
  id: string;
  legacyId: string | null;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  featured: boolean;
  displayOrder: number;
  highlights: string[];
  technologies: string[];
};

export type EducationRecord = {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  displayOrder: number;
  achievements: string[];
};

export type AchievementRecord = {
  id: string;
  text: string;
  featured: boolean;
  displayOrder: number;
};

export type NavigationItemRecord = {
  id: string;
  navGroup: "main" | "utility" | "footer" | "social";
  title: string;
  href: string;
  external: boolean;
  displayOrder: number;
  visible: boolean;
};

export type AboutContent = {
  paragraphs: string[];
};

export type MediaFileRecord = {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  storageBucket: string;
  storagePath: string;
  publicUrl: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
};

export type ProjectArchitectureRecord = {
  title: string;
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    layer: number;
  }>;
  edges: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
};

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  role: string;
  context: string;
  overview: string;
  architectureText: string;
  status: "draft" | "published";
  featured: boolean;
  displayOrder: number;
  completionDate: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  thumbnailMediaId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageId: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  publishedAt: string | null;
  tags: string[];
  stack: string[];
  links: Array<{ label: string; href: string }>;
  metrics: Array<{ label: string; value: string }>;
  challenges: string[];
  decisions: Array<{
    decision: string;
    rationale: string;
    tradeoff: string;
  }>;
  results: string[];
  lessons: string[];
  futureImprovements: string[];
  diagram: ProjectArchitectureRecord | null;
};

export type ArticleRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string | null;
  status: "draft" | "published";
  readingTimeMinutes: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageId: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  publishedAt: string | null;
  tags: string[];
};

export type ContactSubmissionRecord = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived";
  ipHash: string | null;
  userAgent: string | null;
  readAt: string | null;
  createdAt: string;
};

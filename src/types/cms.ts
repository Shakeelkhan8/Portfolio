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
    /** Upwork profile; empty when the CMS has no "upwork" social link. */
    upwork: string;
  };
  githubUsername: string;
  languages: Array<{ name: string; level: string }>;
  /** When false, About page hides the Languages section (default true). */
  languagesVisible: boolean;
  availability: {
    status: AvailabilityStatus;
    message: string;
  };
  expertise: string[];
  philosophy: Array<{ title: string; description: string }>;
  resumeSummary: string;
  responseTimeText: string;
  copyrightText: string;
  maintenanceEnabled: boolean;
  maintenanceMessage: string | null;
};

/** Site settings that must never reach the browser (see `toPublicSiteConfig`). */
export type PrivateSiteField =
  "phone" | "legalName" | "location" | "city" | "timezone";

/**
 * The site settings safe to hand to a client component. Props of a client
 * component are serialised into every page's HTML, so passing the full
 * `SiteConfig` would publish the private fields even if nothing renders them.
 * The `never` keys make passing a full `SiteConfig` a type error.
 */
export type PublicSiteConfig = Omit<SiteConfig, PrivateSiteField> & {
  [K in PrivateSiteField]?: never;
};

export type SeoDefaultsRecord = {
  id: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImageId: string | null;
  defaultOgImageUrl: string | null;
  defaultRobots: string;
  twitterCardType: string;
};

export type ThemeSettingsRecord = {
  id: string;
  logoMediaId: string | null;
  faviconMediaId: string | null;
  primaryColor: string;
  accentColor: string | null;
  backgroundColor: string | null;
  foregroundColor: string | null;
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  customCss: string | null;
};

export type AnalyticsSettingsRecord = {
  id: string;
  plausibleDomain: string | null;
  plausibleEnabled: boolean;
  ga4MeasurementId: string | null;
  ga4Enabled: boolean;
};

export type CustomScriptRecord = {
  id: string;
  name: string;
  scriptContent: string;
  placement: "head" | "body_end";
  enabled: boolean;
};

export type GitHubSettingsRecord = {
  id: string;
  username: string;
  showLiveStats: boolean;
};

/** Public portfolio QR configured in admin (null when unset/disabled). */
export type PortfolioQrConfig = {
  imageUrl: string;
  targetUrl: string | null;
  label: string;
  mediaId: string;
};

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  contentHtml: string | null;
  status: "draft" | "published";
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageId: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type PageListRecord = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  updatedAt: string;
};

export type CertificationRecord = {
  id: string;
  name: string;
  issuer: string;
  issueDate: string | null;
  credentialId: string | null;
  verificationUrl: string | null;
  imageMediaId: string | null;
  imageUrl: string | null;
  displayOrder: number;
  visible: boolean;
};

export type TestimonialRecord = {
  id: string;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  content: string;
  rating: number | null;
  avatarMediaId: string | null;
  avatarUrl: string | null;
  featured: boolean;
  displayOrder: number;
  visible: boolean;
};

export type ServiceRecord = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  displayOrder: number;
  visible: boolean;
};

export type ExpertiseItemRecord = {
  id: string;
  title: string;
  displayOrder: number;
};

export type PhilosophyItemRecord = {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
};

export type LanguageRecord = {
  id: string;
  name: string;
  level: string;
  displayOrder: number;
};

export type SocialLinkRecord = {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  displayOrder: number;
  visible: boolean;
};

export type ResumeVersionRecord = {
  id: string;
  title: string;
  fileMediaId: string;
  fileUrl: string;
  fileName: string;
  isActive: boolean;
  displayOrder: number;
  uploadedAt: string;
};

export type CuratedRepoRecord = {
  id: string;
  repoFullName: string;
  githubRepoId: number | null;
  pinned: boolean;
  hidden: boolean;
  overrideDescription: string | null;
  displayOrder: number;
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

export type ProjectListRecord = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  featured: boolean;
  displayOrder: number;
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

export type ArticleListRecord = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  readingTimeMinutes: number;
  publishedAt: string | null;
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

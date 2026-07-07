export type NavItem = {
  title: string;
  href: string;
  external?: boolean;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectMetric = {
  label: string;
  value: string;
};

export type EngineeringDecision = {
  decision: string;
  rationale: string;
  tradeoff: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  role: string;
  context: string;
  stack: string[];
  tags: string[];
  featured: boolean;
  links: ProjectLink[];
  metrics: ProjectMetric[];
  overview: string;
  challenges: string[];
  architecture: string;
  decisions: EngineeringDecision[];
  results: string[];
  lessons: string[];
  futureImprovements?: string[];
  thumbnailUrl?: string | null;
};

export type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  highlights: string[];
  featured?: boolean;
};

export type SkillGroup = {
  category: string;
  skills: string[];
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readingTime: number;
  tags: string[];
  published: boolean;
};

export type ArticleDetail = Article & {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  robots: string | null;
};

export type ProjectDetail = Project & {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  robots: string | null;
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
};

export type Accomplishment = {
  text: string;
};

export type DiagramNodeType =
  | "frontend"
  | "api"
  | "service"
  | "database"
  | "cache"
  | "queue"
  | "external";

export type DiagramNode = {
  id: string;
  label: string;
  type: DiagramNodeType;
  layer: number;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

export type ArchitectureDiagramData = {
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

export type GitHubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
  topics: string[];
};

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "page" | "project" | "article";
};

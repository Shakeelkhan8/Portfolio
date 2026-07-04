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
  date: string;
  readingTime: number;
  tags: string[];
  published: boolean;
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

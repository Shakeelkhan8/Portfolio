export const CACHE_TAGS = {
  site: "cms:site",
  navigation: "cms:navigation",
  skills: "cms:skills",
  experience: "cms:experience",
  education: "cms:education",
  achievements: "cms:achievements",
  projects: "cms:projects",
  media: "cms:media",
  articles: "cms:articles",
  pages: "cms:pages",
  certifications: "cms:certifications",
  testimonials: "cms:testimonials",
  services: "cms:services",
  resume: "cms:resume",
  search: "cms:search",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

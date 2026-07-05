export const CACHE_TAGS = {
  site: "cms:site",
  navigation: "cms:navigation",
  skills: "cms:skills",
  experience: "cms:experience",
  education: "cms:education",
  achievements: "cms:achievements",
  projects: "cms:projects",
  articles: "cms:articles",
  pages: "cms:pages",
  search: "cms:search",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

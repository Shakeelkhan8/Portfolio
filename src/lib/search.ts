import { unstable_cache } from "next/cache";
import { routes } from "@/config/navigation";
import { getArticles, getProjects, getPublishedPages } from "@/lib/content";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { getNavigation } from "@/lib/db/queries/navigation";
import { filterSearchIndex } from "@/lib/search-utils";
import type { SearchResult } from "@/types";

export { filterSearchIndex } from "@/lib/search-utils";

const DEDICATED_CMS_PAGE_SLUGS = new Set(["privacy"]);

async function buildSearchIndexUncached(): Promise<SearchResult[]> {
  const [navigation, projects, articles, publishedPages] = await Promise.all([
    getNavigation(),
    getProjects(),
    getArticles(),
    getPublishedPages(),
  ]);

  const staticPages: SearchResult[] = [
    {
      id: "home",
      title: "Home",
      description: "Portfolio homepage",
      href: routes.home,
      type: "page",
    },
    ...navigation.mainNav.map((item) => ({
      id: item.href,
      title: item.title,
      description: `Navigate to ${item.title}`,
      href: item.href,
      type: "page" as const,
    })),
    ...navigation.utilityNav.map((item) => ({
      id: item.href,
      title: item.title,
      description: `Navigate to ${item.title}`,
      href: item.href,
      type: "page" as const,
    })),
  ];

  const cmsPageResults: SearchResult[] = publishedPages
    .filter((page) => !DEDICATED_CMS_PAGE_SLUGS.has(page.slug))
    .map((page) => ({
      id: `page-${page.slug}`,
      title: page.title,
      description: page.metaDescription ?? `Page: /${page.slug}`,
      href: routes.page(page.slug),
      type: "page" as const,
    }));

  const projectResults: SearchResult[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    title: project.title,
    description: project.summary,
    href: routes.project(project.slug),
    type: "project",
  }));

  const articleResults: SearchResult[] = articles.map((article) => ({
    id: `article-${article.slug}`,
    title: article.title,
    description: article.excerpt,
    href: routes.article(article.slug),
    type: "article",
  }));

  return [
    ...staticPages,
    ...cmsPageResults,
    ...projectResults,
    ...articleResults,
  ];
}

export const buildSearchIndex = unstable_cache(
  buildSearchIndexUncached,
  ["cms-search-index"],
  { tags: [CACHE_TAGS.search] },
);

export async function searchContent(query: string): Promise<SearchResult[]> {
  const index = await buildSearchIndex();
  return filterSearchIndex(index, query);
}

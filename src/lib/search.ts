import { routes } from "@/config/navigation";
import { getArticles, getProjects } from "@/lib/content";
import { getNavigation } from "@/lib/db/queries/navigation";
import { filterSearchIndex } from "@/lib/search-utils";
import type { SearchResult } from "@/types";

export { filterSearchIndex } from "@/lib/search-utils";

export async function buildSearchIndex(): Promise<SearchResult[]> {
  const [navigation, projects, articles] = await Promise.all([
    getNavigation(),
    getProjects(),
    getArticles(),
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

  return [...staticPages, ...projectResults, ...articleResults];
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  const index = await buildSearchIndex();
  return filterSearchIndex(index, query);
}

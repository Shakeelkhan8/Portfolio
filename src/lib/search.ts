import { mainNav, utilityNav, routes } from "@/config/navigation";
import { projects } from "@/content/projects";
import { articles } from "@/content/writing";
import type { SearchResult } from "@/types";

const staticPages: SearchResult[] = [
  {
    id: "home",
    title: "Home",
    description: "Portfolio homepage",
    href: routes.home,
    type: "page",
  },
  ...mainNav.map((item) => ({
    id: item.href,
    title: item.title,
    description: `Navigate to ${item.title}`,
    href: item.href,
    type: "page" as const,
  })),
  ...utilityNav.map((item) => ({
    id: item.href,
    title: item.title,
    description: `Navigate to ${item.title}`,
    href: item.href,
    type: "page" as const,
  })),
];

export function buildSearchIndex(): SearchResult[] {
  const projectResults: SearchResult[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    title: project.title,
    description: project.summary,
    href: routes.project(project.slug),
    type: "project",
  }));

  const articleResults: SearchResult[] = articles
    .filter((a) => a.published)
    .map((article) => ({
      id: `article-${article.slug}`,
      title: article.title,
      description: article.excerpt,
      href: routes.article(article.slug),
      type: "article",
    }));

  return [...staticPages, ...projectResults, ...articleResults];
}

export function searchContent(query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return buildSearchIndex();

  return buildSearchIndex().filter((item) => {
    const haystack =
      `${item.title} ${item.description} ${item.type}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

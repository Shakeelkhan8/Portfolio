import type { MetadataRoute } from "next";
import { routes } from "@/config/navigation";
import {
  getArticleSlugs,
  getProjectSlugs,
  getPublishedPages,
  getSiteConfig,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, projectSlugs, articleSlugs, cmsPages] = await Promise.all([
    getSiteConfig(),
    getProjectSlugs(),
    getArticleSlugs(),
    getPublishedPages(),
  ]);
  const baseUrl = site.url;

  const staticPages = [
    routes.home,
    routes.about,
    routes.projects,
    routes.experience,
    routes.writing,
    routes.openSource,
    routes.resume,
    routes.contact,
  ];

  const cmsPagePaths = cmsPages.map((page) =>
    page.slug === "privacy" ? routes.privacy : `/${page.slug}`,
  );

  const projectPages = projectSlugs.map((slug) => routes.project(slug));
  const articlePages = articleSlugs.map((slug) => routes.article(slug));

  const allPaths = [
    ...new Set([...staticPages, ...cmsPagePaths, ...projectPages, ...articlePages]),
  ];

  const cmsLastModified = new Map(
    cmsPages.map((page) => [
      page.slug === "privacy" ? routes.privacy : `/${page.slug}`,
      new Date(page.updatedAt),
    ]),
  );

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: cmsLastModified.get(path) ?? new Date(),
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority:
      path === routes.home ? 1 : path.startsWith("/projects/") ? 0.8 : 0.7,
  }));
}

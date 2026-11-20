import type { MetadataRoute } from "next";
import { routes } from "@/config/navigation";
import {
  getArticleSitemapEntries,
  getProjectSitemapEntries,
  getPublishedPages,
  getSiteConfig,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, projectEntries, articleEntries, cmsPages] = await Promise.all([
    getSiteConfig(),
    getProjectSitemapEntries(),
    getArticleSitemapEntries(),
    getPublishedPages(),
  ]);
  const baseUrl = site.url;
  const buildDate = new Date();

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

  const lastModifiedByPath = new Map<string, Date>();

  for (const page of cmsPages) {
    const path = page.slug === "privacy" ? routes.privacy : `/${page.slug}`;
    lastModifiedByPath.set(path, new Date(page.updatedAt));
  }

  for (const entry of projectEntries) {
    lastModifiedByPath.set(routes.project(entry.slug), entry.lastModified);
  }

  for (const entry of articleEntries) {
    lastModifiedByPath.set(routes.article(entry.slug), entry.lastModified);
  }

  const cmsPagePaths = cmsPages.map((page) =>
    page.slug === "privacy" ? routes.privacy : `/${page.slug}`,
  );
  const projectPages = projectEntries.map((entry) => routes.project(entry.slug));
  const articlePages = articleEntries.map((entry) => routes.article(entry.slug));

  const allPaths = [
    ...new Set([
      ...staticPages,
      ...cmsPagePaths,
      ...projectPages,
      ...articlePages,
    ]),
  ];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastModifiedByPath.get(path) ?? buildDate,
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority:
      path === routes.home ? 1 : path.startsWith("/projects/") ? 0.8 : 0.7,
  }));
}

import type { MetadataRoute } from "next";
import { routes } from "@/config/navigation";
import { getProjectSlugs, getArticleSlugs } from "@/lib/content";
import { getSiteConfig } from "@/lib/db/queries/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, projectSlugs, articleSlugs] = await Promise.all([
    getSiteConfig(),
    getProjectSlugs(),
    getArticleSlugs(),
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
    routes.privacy,
  ];

  const projectPages = projectSlugs.map((slug) => routes.project(slug));
  const articlePages = articleSlugs.map((slug) => routes.article(slug));

  return [...staticPages, ...projectPages, ...articlePages].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority: path === routes.home ? 1 : path.startsWith("/projects/") ? 0.8 : 0.7,
  }));
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { getProjectSlugs, getArticleSlugs } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

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

  const projectPages = getProjectSlugs().map((slug) => routes.project(slug));
  const articlePages = getArticleSlugs().map((slug) => routes.article(slug));

  return [...staticPages, ...projectPages, ...articlePages].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority: path === routes.home ? 1 : path.startsWith("/projects/") ? 0.8 : 0.7,
  }));
}

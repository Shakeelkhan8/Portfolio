import type { MetadataRoute } from "next";
import { getSeoDefaults, getSiteConfig } from "@/lib/content";
import { parseRobotsDirective } from "@/lib/seo/robots";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const [site, seo] = await Promise.all([getSiteConfig(), getSeoDefaults()]);
  const robotsMeta = parseRobotsDirective(seo.defaultRobots);
  const allowIndexing =
    !robotsMeta ||
    typeof robotsMeta === "object" &&
      !Array.isArray(robotsMeta) &&
      robotsMeta.index !== false;

  return {
    rules: {
      userAgent: "*",
      allow: allowIndexing ? "/" : undefined,
      disallow: allowIndexing ? undefined : "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { getSiteConfig, getThemeSettings } from "@/lib/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [site, theme] = await Promise.all([getSiteConfig(), getThemeSettings()]);

  return {
    name: `${site.name} — Portfolio`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: theme.backgroundColor ?? "#fafafa",
    theme_color: theme.primaryColor,
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}

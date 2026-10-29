import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteConfig();

  return {
    name: `${site.name} | Portfolio`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}

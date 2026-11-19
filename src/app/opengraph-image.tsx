import { ImageResponse } from "next/og";
import { getCtaSection, getSiteConfig } from "@/lib/content";
import { DEFAULT_OG_IMAGE_ID } from "@/lib/og/default-image";
import { OG_SIZE, OgCard } from "@/lib/og/og-card";

// Use the Node.js runtime: the Edge runtime has a 1 MB bundle limit on Vercel,
// and next/og's ImageResponse (WASM renderer + font handling) exceeds it.
export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateImageMetadata() {
  const site = await getSiteConfig();
  return [
    {
      id: DEFAULT_OG_IMAGE_ID,
      alt: `${site.name} | ${site.title}`,
    },
  ];
}

/**
 * Default link preview. Mirrors the home hero: it leads with the work (the
 * CMS hero headline) and puts the name in the footer.
 */
export default async function OpenGraphImage() {
  const [site, hero] = await Promise.all([
    getSiteConfig(),
    getCtaSection("home_hero"),
  ]);
  const heroTitle = hero?.title?.trim();
  const title = heroTitle && heroTitle !== site.name ? heroTitle : site.title;

  return new ImageResponse(
    (
      <OgCard
        eyebrow={["Full stack engineering", ...site.expertise.slice(0, 2)].join(" · ")}
        title={title}
        description={hero?.description?.trim() || site.description}
        footer={`${site.name} · ${site.title}`}
      />
    ),
    { ...OG_SIZE },
  );
}

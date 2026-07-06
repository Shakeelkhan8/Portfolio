import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function createMetadata({
  title,
  description,
  path = "",
  ogImage,
  canonicalUrl,
  robots,
}: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
}): Metadata {
  const url = canonicalUrl ?? `${siteConfig.url}${path}`;
  const metaDescription = description ?? siteConfig.description;
  const openGraphImages = ogImage ? [{ url: ogImage }] : undefined;

  return {
    title,
    description: metaDescription,
    alternates: { canonical: url },
    robots: robots ?? undefined,
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description: metaDescription,
      url,
      siteName: siteConfig.name,
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

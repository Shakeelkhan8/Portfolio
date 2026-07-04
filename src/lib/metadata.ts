import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function createMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description: description ?? siteConfig.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description: description ?? siteConfig.description,
      url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description: description ?? siteConfig.description,
    },
  };
}

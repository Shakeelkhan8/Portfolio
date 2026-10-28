import type { Metadata } from "next";
import { getSeoDefaults } from "@/lib/db/queries/settings";
import { getSiteConfig } from "@/lib/db/queries/site";
import { parseRobotsDirective } from "@/lib/seo/robots";
import type { SeoDefaultsRecord, SiteConfig } from "@/types/cms";

export type MetadataContext = {
  site: SiteConfig;
  seo: SeoDefaultsRecord;
};

const DEFAULT_SOCIAL_IMAGE = "/opengraph-image";

/** Legacy CMS titles may still use em/en dash separators. */
function withPipeSeparator(title: string): string {
  return title.replace(/\s*[—–]\s*/g, " | ").trim();
}

export async function getMetadataContext(): Promise<MetadataContext> {
  const [site, seo] = await Promise.all([getSiteConfig(), getSeoDefaults()]);
  return { site, seo };
}

function resolveTwitterCard(
  cardType: string,
): "summary" | "summary_large_image" | "app" | "player" {
  if (cardType === "summary") return "summary";
  if (cardType === "app") return "app";
  if (cardType === "player") return "player";
  return "summary_large_image";
}

/** Prefer page OG image → CMS default → generated `/opengraph-image`. */
export function resolveSocialImages(
  ogImage?: string | null,
  defaultOgImageUrl?: string | null,
): NonNullable<NonNullable<Metadata["openGraph"]>["images"]> {
  if (ogImage) {
    return [{ url: ogImage }];
  }
  if (defaultOgImageUrl) {
    return [{ url: defaultOgImageUrl }];
  }
  return [{ url: DEFAULT_SOCIAL_IMAGE }];
}

export function buildDefaultMetadata(ctx: MetadataContext): Metadata {
  const { site, seo } = ctx;
  const defaultTitle = withPipeSeparator(
    seo.defaultTitle || `${site.name} | ${site.title}`,
  );
  const defaultDescription = seo.defaultDescription || site.description;
  const socialImages = resolveSocialImages(null, seo.defaultOgImageUrl);

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${site.name}`,
    },
    description: defaultDescription,
    metadataBase: new URL(site.url),
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    keywords: [
      "Senior Backend Engineer",
      "Laravel Developer",
      "PHP Backend Engineer",
      "Multi-tenant SaaS",
      ...site.expertise,
    ],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: site.url,
      siteName: site.name,
      title: defaultTitle,
      description: defaultDescription,
      images: socialImages,
    },
    twitter: {
      card: resolveTwitterCard(seo.twitterCardType),
      title: defaultTitle,
      description: defaultDescription,
      images: socialImages,
    },
    robots:
      parseRobotsDirective(seo.defaultRobots) ??
      ({
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      } satisfies Metadata["robots"]),
    alternates: {
      canonical: site.url,
      types: {
        "application/rss+xml": `${site.url}/rss.xml`,
      },
    },
  };
}

export function buildPageMetadata(
  ctx: MetadataContext,
  {
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
  },
): Metadata {
  const { site, seo } = ctx;
  const url = canonicalUrl ?? `${site.url}${path}`;
  const metaDescription =
    description ?? seo.defaultDescription ?? site.description;
  const socialImages = resolveSocialImages(ogImage, seo.defaultOgImageUrl);
  const parsedRobots = parseRobotsDirective(robots);

  return {
    title,
    description: metaDescription,
    alternates: { canonical: url },
    ...(parsedRobots ? { robots: parsedRobots } : {}),
    openGraph: {
      title: `${title} | ${site.name}`,
      description: metaDescription,
      url,
      siteName: site.name,
      images: socialImages,
    },
    twitter: {
      card: resolveTwitterCard(seo.twitterCardType),
      title: `${title} | ${site.name}`,
      description: metaDescription,
      images: socialImages,
    },
  };
}

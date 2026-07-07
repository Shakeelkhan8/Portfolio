import { unstable_cache } from "next/cache";
import { createReadClient } from "@/lib/supabase/read-client";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { getFallbackPrivacyPage } from "@/lib/db/fallback/settings";
import { mapPageRecord } from "@/lib/db/mappers/settings";
import type { PageRecord } from "@/types/cms";

async function fetchPageBySlugFromDb(slug: string): Promise<PageRecord | null> {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("pages")
    .select(
      "id, slug, title, content_html, status, meta_title, meta_description, og_image_id, canonical_url, robots, published_at, updated_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  let ogImageUrl: string | null = null;
  if (data.og_image_id) {
    const { data: media } = await supabase
      .from("media_files")
      .select("public_url")
      .eq("id", data.og_image_id)
      .maybeSingle();
    ogImageUrl = media?.public_url ?? null;
  }

  return mapPageRecord(data, ogImageUrl);
}

const getCachedPageBySlug = unstable_cache(
  async (slug: string) => fetchPageBySlugFromDb(slug),
  ["cms-page-by-slug"],
  { tags: [CACHE_TAGS.pages] },
);

export async function getPageBySlug(slug: string): Promise<PageRecord | undefined> {
  if (!isSupabaseConfigured()) {
    if (slug === "privacy") {
      return getFallbackPrivacyPage();
    }
    return undefined;
  }

  try {
    const page = await getCachedPageBySlug(slug);
    if (page) {
      return page;
    }

    if (slug === "privacy") {
      return getFallbackPrivacyPage();
    }

    return undefined;
  } catch {
    if (slug === "privacy") {
      return getFallbackPrivacyPage();
    }
    return undefined;
  }
}

async function fetchPublishedPageSlugsFromDb(): Promise<
  Array<{
    slug: string;
    title: string;
    metaDescription: string | null;
    updatedAt: string;
  }>
> {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("pages")
    .select("slug, title, meta_description, updated_at")
    .eq("status", "published")
    .is("deleted_at", null);

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    metaDescription: row.meta_description,
    updatedAt: row.updated_at,
  }));
}

export type PublishedPageSummary = {
  slug: string;
  title: string;
  metaDescription: string | null;
  updatedAt: string;
};

export const getPublishedPages = unstable_cache(
  async (): Promise<PublishedPageSummary[]> => {
    if (!isSupabaseConfigured()) {
      return [
        {
          slug: "privacy",
          title: "Privacy Policy",
          metaDescription: "Privacy policy for this portfolio website.",
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    try {
      const pages = await fetchPublishedPageSlugsFromDb();
      return pages.length > 0
        ? pages
        : [
            {
              slug: "privacy",
              title: "Privacy Policy",
              metaDescription: "Privacy policy for this portfolio website.",
              updatedAt: new Date().toISOString(),
            },
          ];
    } catch {
      return [
        {
          slug: "privacy",
          title: "Privacy Policy",
          metaDescription: "Privacy policy for this portfolio website.",
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  },
  ["cms-published-pages"],
  { tags: [CACHE_TAGS.pages] },
);

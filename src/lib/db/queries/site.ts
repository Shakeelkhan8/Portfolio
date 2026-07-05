import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import {
  getFallbackHomeContent,
  getFallbackSiteConfig,
} from "@/lib/db/fallback";
import {
  mapCtaSection,
  mapSectionHeader,
  mapSiteConfig,
} from "@/lib/db/mappers/site";

async function fetchSiteConfigFromDb() {
  const supabase = await createClient();

  const [
    siteResult,
    expertiseResult,
    philosophyResult,
    languagesResult,
    socialResult,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase
      .from("expertise_items")
      .select("title")
      .order("display_order", { ascending: true }),
    supabase
      .from("philosophy_items")
      .select("title, description")
      .order("display_order", { ascending: true }),
    supabase
      .from("languages")
      .select("name, level")
      .order("display_order", { ascending: true }),
    supabase
      .from("social_links")
      .select("platform, url")
      .eq("visible", true)
      .order("display_order", { ascending: true }),
  ]);

  if (siteResult.error || !siteResult.data) {
    return null;
  }

  return mapSiteConfig({
    site: siteResult.data,
    expertise: expertiseResult.data ?? [],
    philosophy: philosophyResult.data ?? [],
    languages: languagesResult.data ?? [],
    socialLinks: socialResult.data ?? [],
  });
}

export const getSiteConfig = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return getFallbackSiteConfig();
    }

    try {
      const site = await fetchSiteConfigFromDb();
      return site ?? getFallbackSiteConfig();
    } catch {
      return getFallbackSiteConfig();
    }
  },
  ["cms-site-config"],
  { tags: [CACHE_TAGS.site] },
);

async function fetchHomeContentFromDb() {
  const supabase = await createClient();

  const [headersResult, ctaResult] = await Promise.all([
    supabase
      .from("section_headers")
      .select("page_key, section_key, title, description")
      .eq("visible", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("cta_sections")
      .select(
        "section_key, title, description, primary_label, primary_href, secondary_label, secondary_href",
      )
      .eq("visible", true),
  ]);

  if (headersResult.error || ctaResult.error) {
    return null;
  }

  return {
    sectionHeaders: (headersResult.data ?? []).map(mapSectionHeader),
    ctaSections: (ctaResult.data ?? []).map(mapCtaSection),
  };
}

export const getHomeContent = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return getFallbackHomeContent();
    }

    try {
      const content = await fetchHomeContentFromDb();
      return content ?? getFallbackHomeContent();
    } catch {
      return getFallbackHomeContent();
    }
  },
  ["cms-home-content"],
  { tags: [CACHE_TAGS.site] },
);

export async function getSectionHeader(pageKey: string, sectionKey: string) {
  const home = await getHomeContent();
  return (
    home.sectionHeaders.find(
      (header) =>
        header.pageKey === pageKey && header.sectionKey === sectionKey,
    ) ?? getFallbackHomeContent().sectionHeaders.find(
      (header) =>
        header.pageKey === pageKey && header.sectionKey === sectionKey,
    )
  );
}

export async function getCtaSection(key: string) {
  const home = await getHomeContent();
  return (
    home.ctaSections.find((cta) => cta.key === key) ??
    getFallbackHomeContent().ctaSections.find((cta) => cta.key === key)
  );
}

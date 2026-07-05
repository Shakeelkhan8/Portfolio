import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import {
  getFallbackNavigation,
  getFallbackNavigationItems,
} from "@/lib/db/fallback";
import { mapNavigation, mapNavigationItem } from "@/lib/db/mappers/site";
import type { NavigationItemRecord } from "@/types/cms";

async function fetchNavigationFromDb() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("navigation_items")
    .select("id, nav_group, title, href, external, display_order, visible")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    return null;
  }

  return mapNavigation(data.map(mapNavigationItem));
}

export const getNavigation = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return getFallbackNavigation();
    }

    try {
      const navigation = await fetchNavigationFromDb();
      return navigation ?? getFallbackNavigation();
    } catch {
      return getFallbackNavigation();
    }
  },
  ["cms-navigation"],
  { tags: [CACHE_TAGS.navigation] },
);

export const getNavigationItems = unstable_cache(
  async (): Promise<NavigationItemRecord[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackNavigationItems();
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("navigation_items")
      .select("id, nav_group, title, href, external, display_order, visible")
      .order("display_order", { ascending: true });

    if (error || !data?.length) {
      return getFallbackNavigationItems();
    }

    return data.map(mapNavigationItem);
  },
  ["cms-navigation-items"],
  { tags: [CACHE_TAGS.navigation] },
);

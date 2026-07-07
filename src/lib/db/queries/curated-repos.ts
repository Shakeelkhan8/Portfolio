import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { mapCuratedRepo } from "@/lib/db/mappers/curated-repos";
import type { CuratedRepoRecord } from "@/types/cms";

async function fetchCuratedReposFromDb(): Promise<CuratedRepoRecord[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("curated_repos")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return null;
  }

  return data.map(mapCuratedRepo);
}

export const getCuratedRepos = unstable_cache(
  async (): Promise<CuratedRepoRecord[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      return (await fetchCuratedReposFromDb()) ?? [];
    } catch {
      return [];
    }
  },
  ["cms-curated-repos"],
  { tags: [CACHE_TAGS.curatedRepos] },
);

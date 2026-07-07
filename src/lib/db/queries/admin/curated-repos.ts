import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { mapCuratedRepo } from "@/lib/db/mappers/curated-repos";
import type { CuratedRepoRecord } from "@/types/cms";

export async function getCuratedRepoRecords(): Promise<CuratedRepoRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("curated_repos")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map(mapCuratedRepo);
}

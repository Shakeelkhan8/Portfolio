import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { mapPageRecord } from "@/lib/db/mappers/settings";
import type { PageRecord } from "@/types/cms";

export async function getPageRecords(): Promise<PageRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select(
      "id, slug, title, content_html, status, meta_title, meta_description, og_image_id, canonical_url, robots, published_at, updated_at",
    )
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const ogIds = data
    .map((row) => row.og_image_id)
    .filter((id): id is string => Boolean(id));

  let mediaMap = new Map<string, string>();
  if (ogIds.length) {
    const { data: media } = await supabase
      .from("media_files")
      .select("id, public_url")
      .in("id", ogIds);
    mediaMap = new Map((media ?? []).map((file) => [file.id, file.public_url]));
  }

  return data.map((row) =>
    mapPageRecord(row, mediaMap.get(row.og_image_id ?? "") ?? null),
  );
}

export async function getPageRecordById(id: string): Promise<PageRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select(
      "id, slug, title, content_html, status, meta_title, meta_description, og_image_id, canonical_url, robots, published_at, updated_at",
    )
    .eq("id", id)
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

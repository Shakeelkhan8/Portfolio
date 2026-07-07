import { createReadClient } from "@/lib/supabase/read-client";
import { isSupabaseConfigured } from "@/lib/env";
import {
  buildPaginatedResult,
  getRange,
  type PaginatedResult,
} from "@/lib/admin/pagination";
import type { MediaFileRecord } from "@/types/cms";

function mapMediaFile(row: {
  id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  storage_bucket: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}): MediaFileRecord {
  return {
    id: row.id,
    filename: row.filename,
    originalFilename: row.original_filename,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    altText: row.alt_text,
    width: row.width,
    height: row.height,
    createdAt: row.created_at,
  };
}

export async function getMediaFiles(): Promise<MediaFileRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("media_files")
    .select(
      "id, filename, original_filename, mime_type, size_bytes, storage_bucket, storage_path, public_url, alt_text, width, height, created_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapMediaFile);
}

export async function getMediaFileById(
  id: string,
): Promise<MediaFileRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("media_files")
    .select(
      "id, filename, original_filename, mime_type, size_bytes, storage_bucket, storage_path, public_url, alt_text, width, height, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapMediaFile(data);
}

export async function getImageMediaFiles(): Promise<MediaFileRecord[]> {
  const files = await getMediaFiles();
  return files.filter((file) => file.mimeType.startsWith("image/"));
}

type MediaListOptions = {
  page: number;
  pageSize: number;
};

export async function getMediaFilesPaginated(
  options: MediaListOptions,
): Promise<PaginatedResult<MediaFileRecord>> {
  if (!isSupabaseConfigured()) {
    return buildPaginatedResult([], 0, options.page, options.pageSize);
  }

  const supabase = createReadClient();
  const { from, to } = getRange(options.page, options.pageSize);
  const { data, count, error } = await supabase
    .from("media_files")
    .select(
      "id, filename, original_filename, mime_type, size_bytes, storage_bucket, storage_path, public_url, alt_text, width, height, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) {
    return buildPaginatedResult([], 0, options.page, options.pageSize);
  }

  return buildPaginatedResult(
    data.map(mapMediaFile),
    count ?? 0,
    options.page,
    options.pageSize,
  );
}

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
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

  const supabase = await createClient();
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

  const supabase = await createClient();
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

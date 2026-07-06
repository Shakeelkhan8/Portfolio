"use server";

import { getSupabaseUrl } from "@/lib/env";
import { requireAdmin } from "@/lib/admin/require-admin";
import { revalidateAfterMediaChange } from "@/lib/db/revalidate";
import {
  BUCKET_SIZE_LIMITS,
  resolveBucketForMimeType,
} from "@/lib/storage/constants";
import {
  buildPublicStorageUrl,
  buildStoragePath,
  sanitizeFilename,
} from "@/lib/storage/paths";
import {
  isAllowedUploadMimeType,
  mediaAltSchema,
  type AdminActionState,
} from "@/lib/validators/media";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: "media_file",
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

async function getMediaReferenceCount(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  id: string,
) {
  const [projectRefs, articleRefs, galleryItems, resumeVersions] =
    await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .or(`thumbnail_media_id.eq.${id},og_image_id.eq.${id}`),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("og_image_id", id),
    supabase
      .from("project_gallery")
      .select("id", { count: "exact", head: true })
      .eq("media_id", id),
    supabase
      .from("resume_versions")
      .select("id", { count: "exact", head: true })
      .eq("file_media_id", id),
  ]);

  return (
    (projectRefs.count ?? 0) +
    (articleRefs.count ?? 0) +
    (galleryItems.count ?? 0) +
    (resumeVersions.count ?? 0)
  );
}

export async function uploadMediaAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  if (!isAllowedUploadMimeType(file.type)) {
    return { error: "File type is not allowed." };
  }

  const bucket = resolveBucketForMimeType(file.type);

  if (!bucket) {
    return { error: "No storage bucket matches this file type." };
  }

  if (file.size > BUCKET_SIZE_LIMITS[bucket]) {
    return { error: "File exceeds the allowed size for this bucket." };
  }

  const altText = formData.get("altText")?.toString().trim() || null;
  const { supabase, user } = await requireAdmin();
  const storagePath = buildStoragePath(file.name);
  const filename = sanitizeFilename(file.name);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const publicUrl = buildPublicStorageUrl(
    getSupabaseUrl(),
    bucket,
    storagePath,
  );

  const { data, error } = await supabase
    .from("media_files")
    .insert({
      filename,
      original_filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      storage_bucket: bucket,
      storage_path: storagePath,
      public_url: publicUrl,
      alt_text: altText,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    await supabase.storage.from(bucket).remove([storagePath]);
    return { error: error?.message ?? "Failed to save media record." };
  }

  await logAdminAction(supabase, user.id, "create", data.id);
  revalidateAfterMediaChange();
  return { success: "File uploaded." };
}

export async function updateMediaAltAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = mediaAltSchema.safeParse({
    id: formData.get("id"),
    altText: formData.get("altText")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("media_files")
    .update({ alt_text: parsed.data.altText || null })
    .eq("id", parsed.data.id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "update", parsed.data.id);
  revalidateAfterMediaChange();
  return { success: "Alt text updated." };
}

export async function deleteMediaAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { error: "Missing media id." };
  }

  const { supabase, user } = await requireAdmin();

  const { data: media, error: fetchError } = await supabase
    .from("media_files")
    .select("id, storage_bucket, storage_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !media) {
    return { error: fetchError?.message ?? "Media file not found." };
  }

  const referenceCount = await getMediaReferenceCount(supabase, id);

  if (referenceCount > 0) {
    return {
      error:
        "This file is still referenced by a project, article, or resume. Remove references before deleting.",
    };
  }

  const { error: storageError } = await supabase.storage
    .from(media.storage_bucket)
    .remove([media.storage_path]);

  if (storageError) {
    return { error: storageError.message };
  }

  const { error } = await supabase.from("media_files").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "delete", id);
  revalidateAfterMediaChange();
  return { success: "Media file deleted." };
}

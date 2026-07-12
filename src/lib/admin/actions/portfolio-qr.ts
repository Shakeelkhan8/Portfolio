"use server";

import QRCode from "qrcode";
import { getSupabaseUrl } from "@/lib/env";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  revalidateAfterMediaChange,
  revalidateAfterSettingsChange,
} from "@/lib/db/revalidate";
import {
  BUCKET_SIZE_LIMITS,
  STORAGE_BUCKETS,
} from "@/lib/storage/constants";
import {
  buildPublicStorageUrl,
  buildStoragePath,
  sanitizeFilename,
} from "@/lib/storage/paths";
import type { AdminActionState } from "@/lib/validators/content";
import {
  isQrImageMimeType,
  portfolioQrGenerateSchema,
  portfolioQrSaveSchema,
} from "@/lib/validators/portfolio-qr";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: "portfolio_qr",
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

async function getSiteSettingsId(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
) {
  const { data, error } = await supabase
    .from("site_settings")
    .select("id, qr_code_media_id")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/** Generate a QR SVG for the given URL, store it in media, and attach to settings. */
export async function generatePortfolioQrAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = portfolioQrGenerateSchema.safeParse({
    targetUrl: formData.get("targetUrl"),
    label: formData.get("label")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const site = await getSiteSettingsId(supabase);
  if (!site) {
    return { error: "Site settings are not available. Seed the database first." };
  }

  let svg: string;
  try {
    svg = await QRCode.toString(parsed.data.targetUrl, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 4,
      width: 512,
      color: { dark: "#000000", light: "#ffffff" },
    });
  } catch {
    return { error: "Could not generate QR code for that URL." };
  }

  const fileBuffer = Buffer.from(svg, "utf8");
  const mimeType = "image/svg+xml";
  const bucket = STORAGE_BUCKETS.branding;

  if (fileBuffer.length > BUCKET_SIZE_LIMITS[bucket]) {
    return { error: "Generated QR exceeds the branding size limit." };
  }

  const originalFilename = "portfolio-qr.svg";
  const storagePath = buildStoragePath(originalFilename);
  const filename = sanitizeFilename(originalFilename);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
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

  const { data: media, error: insertError } = await supabase
    .from("media_files")
    .insert({
      filename,
      original_filename: originalFilename,
      mime_type: mimeType,
      size_bytes: fileBuffer.length,
      storage_bucket: bucket,
      storage_path: storagePath,
      public_url: publicUrl,
      alt_text: `QR code linking to ${parsed.data.targetUrl}`,
      width: 512,
      height: 512,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (insertError || !media) {
    await supabase.storage.from(bucket).remove([storagePath]);
    return { error: insertError?.message ?? "Failed to save QR media." };
  }

  const previousMediaId = site.qr_code_media_id;

  const { error: updateError } = await supabase
    .from("site_settings")
    .update({
      qr_code_media_id: media.id,
      qr_target_url: parsed.data.targetUrl,
      qr_label: parsed.data.label,
      qr_enabled: true,
    })
    .eq("id", site.id);

  if (updateError) {
    return { error: updateError.message };
  }

  // Clear previous QR media if it is no longer referenced elsewhere
  if (previousMediaId && previousMediaId !== media.id) {
    await detachAndMaybeDeleteMedia(supabase, previousMediaId, media.id);
  }

  await logAdminAction(supabase, user.id, "generate", media.id);
  revalidateAfterMediaChange();
  revalidateAfterSettingsChange();
  return { success: "QR code generated and published." };
}

/** Attach an existing media image (or clear), update label / URL / enabled. */
export async function savePortfolioQrAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = portfolioQrSaveSchema.safeParse({
    mediaId: formData.get("mediaId"),
    targetUrl: formData.get("targetUrl")?.toString() ?? "",
    label: formData.get("label")?.toString() ?? "",
    enabled: formData.get("enabled") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const site = await getSiteSettingsId(supabase);
  if (!site) {
    return { error: "Site settings are not available. Seed the database first." };
  }

  const mediaId = parsed.data.mediaId ?? null;

  if (mediaId) {
    const { data: media, error } = await supabase
      .from("media_files")
      .select("id, mime_type, public_url")
      .eq("id", mediaId)
      .maybeSingle();

    if (error || !media) {
      return { error: "Selected media file was not found." };
    }

    if (!isQrImageMimeType(media.mime_type)) {
      return {
        error: "QR image must be PNG, JPEG, WebP, or SVG.",
      };
    }

    if (!media.public_url) {
      return { error: "Selected media has no public URL." };
    }
  }

  const previousMediaId = site.qr_code_media_id;

  const { error: updateError } = await supabase
    .from("site_settings")
    .update({
      qr_code_media_id: mediaId,
      qr_target_url: parsed.data.targetUrl || null,
      qr_label: parsed.data.label,
      qr_enabled: parsed.data.enabled ?? true,
    })
    .eq("id", site.id);

  if (updateError) {
    return { error: updateError.message };
  }

  if (previousMediaId && previousMediaId !== mediaId) {
    // Previous file stays in media library unless unused — do not auto-delete uploads
  }

  await logAdminAction(supabase, user.id, "save", mediaId ?? site.id);
  revalidateAfterSettingsChange();
  return { success: "QR settings saved." };
}

export async function clearPortfolioQrAction(
  _prev: AdminActionState,
  _formData: FormData,
): Promise<AdminActionState> {
  const { supabase, user } = await requireAdmin();
  const site = await getSiteSettingsId(supabase);
  if (!site) {
    return { error: "Site settings are not available." };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      qr_code_media_id: null,
      qr_enabled: false,
    })
    .eq("id", site.id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "clear", site.id);
  revalidateAfterSettingsChange();
  return { success: "QR code removed from the public site." };
}

async function detachAndMaybeDeleteMedia(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  previousMediaId: string,
  _newMediaId: string,
) {
  // Leave prior generated files in the library so admins can re-select them.
  void previousMediaId;
  void supabase;
}

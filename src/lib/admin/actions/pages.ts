"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { revalidateAfterPageChange } from "@/lib/db/revalidate";
import { sanitizeRichHtml } from "@/lib/security/sanitize";
import {
  emptyMediaId,
  pageSchema,
  validatePageSlug,
  type AdminActionState,
} from "@/lib/validators/cms-modules";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: "page",
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

export async function upsertPageAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = pageSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    contentHtml: formData.get("contentHtml"),
    status: formData.get("status") ?? "draft",
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    ogImageId: formData.get("ogImageId") || undefined,
    canonicalUrl: formData.get("canonicalUrl") || undefined,
    robots: formData.get("robots") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const slugError = validatePageSlug(parsed.data.slug);
  if (slugError) {
    return { error: slugError };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const previousSlug =
    typeof formData.get("previousSlug") === "string"
      ? formData.get("previousSlug")?.toString()
      : undefined;
  const sanitizedHtml = sanitizeRichHtml(parsed.data.contentHtml);

  const payload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    content_html: sanitizedHtml,
    status: parsed.data.status,
    meta_title: parsed.data.metaTitle || null,
    meta_description: parsed.data.metaDescription || null,
    og_image_id: emptyMediaId(parsed.data.ogImageId),
    canonical_url: parsed.data.canonicalUrl || null,
    robots: parsed.data.robots || "index, follow",
    published_at:
      parsed.data.status === "published" ? new Date().toISOString() : null,
  };

  if (typeof id === "string" && id.length > 0) {
    const { data: existing } = await supabase
      .from("pages")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase
      .from("pages")
      .update({
        ...payload,
        published_at:
          parsed.data.status === "published"
            ? existing?.published_at ?? new Date().toISOString()
            : null,
      })
      .eq("id", id);

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", id);
    revalidateAfterPageChange({ slug: parsed.data.slug, previousSlug });
    return { success: "Page saved." };
  }

  const { data, error } = await supabase
    .from("pages")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { error: error.message };
  await logAdminAction(supabase, user.id, "create", data.id);
  revalidateAfterPageChange({ slug: parsed.data.slug });
  return { success: "Page created." };
}

export async function deletePageAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing page id." };
  }

  const { supabase, user } = await requireAdmin();
  const { data: page } = await supabase
    .from("pages")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("pages")
    .update({ deleted_at: new Date().toISOString(), status: "draft" })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "archive", id);
  revalidateAfterPageChange({ slug: page?.slug });
  return { success: "Page archived." };
}

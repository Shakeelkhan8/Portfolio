"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { revalidateAfterArticleChange } from "@/lib/db/revalidate";
import { estimateReadingTimeMinutes } from "@/lib/utils/reading-time";
import {
  articleSchema,
  emptyMediaId,
  parseArticleTags,
  type AdminActionState,
} from "@/lib/validators/articles";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: "article",
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

async function syncArticleTags(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  articleId: string,
  tags: string[],
) {
  await supabase.from("article_tags").delete().eq("article_id", articleId);

  if (!tags.length) {
    return;
  }

  const { error } = await supabase.from("article_tags").insert(
    tags.map((tag, index) => ({
      article_id: articleId,
      tag,
      display_order: index,
    })),
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function upsertArticleAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = articleSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    contentHtml: formData.get("contentHtml"),
    status: formData.get("status") ?? "draft",
    readingTimeMinutes: formData.get("readingTimeMinutes") || undefined,
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    ogImageId: formData.get("ogImageId") || undefined,
    canonicalUrl: formData.get("canonicalUrl") || undefined,
    robots: formData.get("robots") || undefined,
    tags: formData.get("tags"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const previousSlug =
    typeof formData.get("previousSlug") === "string"
      ? formData.get("previousSlug")?.toString()
      : undefined;
  const tags = parseArticleTags(formData.get("tags")?.toString());
  const readingTimeMinutes =
    parsed.data.readingTimeMinutes ??
    estimateReadingTimeMinutes(parsed.data.contentHtml);

  const basePayload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content_html: parsed.data.contentHtml,
    status: parsed.data.status,
    reading_time_minutes: readingTimeMinutes,
    meta_title: parsed.data.metaTitle || null,
    meta_description: parsed.data.metaDescription || null,
    og_image_id: emptyMediaId(parsed.data.ogImageId),
    canonical_url: parsed.data.canonicalUrl || null,
    robots: parsed.data.robots || "index, follow",
  };

  let articleId = typeof id === "string" ? id : "";
  const isUpdate = Boolean(articleId);

  if (isUpdate) {
    const { data: existing, error: existingError } = await supabase
      .from("articles")
      .select("published_at")
      .eq("id", articleId)
      .maybeSingle();

    if (existingError) {
      return { error: existingError.message };
    }

    const { error } = await supabase
      .from("articles")
      .update({
        ...basePayload,
        published_at:
          parsed.data.status === "published"
            ? existing?.published_at ?? new Date().toISOString()
            : null,
      })
      .eq("id", articleId)
      .is("deleted_at", null);

    if (error) {
      return { error: error.message };
    }

    await logAdminAction(supabase, user.id, "update", articleId);
  } else {
    const { data, error } = await supabase
      .from("articles")
      .insert({
        ...basePayload,
        published_at:
          parsed.data.status === "published" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { error: error?.message ?? "Failed to create article." };
    }

    articleId = data.id;
    await logAdminAction(supabase, user.id, "create", articleId);
  }

  try {
    await syncArticleTags(supabase, articleId, tags);
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to save article tags.",
    };
  }

  revalidateAfterArticleChange({
    slug: parsed.data.slug,
    previousSlug,
  });

  return {
    success: isUpdate ? "Article saved." : "Article created.",
  };
}

export async function deleteArticleAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { error: "Missing article id." };
  }

  const { supabase, user } = await requireAdmin();

  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !article) {
    return { error: fetchError?.message ?? "Article not found." };
  }

  const { error } = await supabase
    .from("articles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "delete", id);
  revalidateAfterArticleChange({ slug: article.slug });
  return { success: "Article archived." };
}

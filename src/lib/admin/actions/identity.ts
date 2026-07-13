"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { revalidateAfterContentChange } from "@/lib/db/revalidate";
import {
  expertiseItemSchema,
  languageSchema,
  philosophyItemSchema,
  socialLinkSchema,
  type AdminActionState,
} from "@/lib/validators/identity";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

export async function upsertExpertiseItemAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = expertiseItemSchema.safeParse({
    title: formData.get("title"),
    displayOrder: formData.get("displayOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    title: parsed.data.title,
    display_order: parsed.data.displayOrder,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase
      .from("expertise_items")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "expertise_item", id);
  } else {
    const { data, error } = await supabase
      .from("expertise_items")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "expertise_item", data.id);
  }

  revalidateAfterContentChange(CACHE_TAGS.site);
  return { success: "Expertise saved." };
}

export async function deleteExpertiseItemAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing expertise id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("expertise_items").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "expertise_item", id);
  revalidateAfterContentChange(CACHE_TAGS.site);
  return { success: "Expertise deleted." };
}

export async function upsertPhilosophyItemAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = philosophyItemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    displayOrder: formData.get("displayOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    title: parsed.data.title,
    description: parsed.data.description,
    display_order: parsed.data.displayOrder,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase
      .from("philosophy_items")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "philosophy_item", id);
  } else {
    const { data, error } = await supabase
      .from("philosophy_items")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "philosophy_item", data.id);
  }

  revalidateAfterContentChange(CACHE_TAGS.site);
  return { success: "Principle saved." };
}

export async function deletePhilosophyItemAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing principle id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("philosophy_items").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "philosophy_item", id);
  revalidateAfterContentChange(CACHE_TAGS.site);
  return { success: "Principle deleted." };
}

export async function upsertLanguageAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = languageSchema.safeParse({
    name: formData.get("name"),
    level: formData.get("level"),
    displayOrder: formData.get("displayOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    name: parsed.data.name,
    level: parsed.data.level,
    display_order: parsed.data.displayOrder,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase
      .from("languages")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "language", id);
  } else {
    const { data, error } = await supabase
      .from("languages")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "language", data.id);
  }

  revalidateAfterContentChange(CACHE_TAGS.site);
  return { success: "Language saved." };
}

export async function deleteLanguageAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing language id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("languages").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "language", id);
  revalidateAfterContentChange(CACHE_TAGS.site);
  return { success: "Language deleted." };
}

export async function updateLanguagesVisibilityAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const visible = formData.get("visible") === "on";

  const { supabase, user } = await requireAdmin();
  const { data: site, error: siteError } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (siteError || !site) {
    return { error: siteError?.message ?? "Site settings not found." };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({ languages_visible: visible })
    .eq("id", site.id);

  if (error) return { error: error.message };

  await logAdminAction(
    supabase,
    user.id,
    "update",
    "site_settings",
    site.id,
  );
  revalidateAfterContentChange(CACHE_TAGS.site);
  return {
    success: visible
      ? "Languages section is now visible on the About page."
      : "Languages section is now hidden on the About page.",
  };
}

export async function upsertSocialLinkAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = socialLinkSchema.safeParse({
    platform: formData.get("platform"),
    label: formData.get("label"),
    url: formData.get("url"),
    icon: formData.get("icon") || undefined,
    displayOrder: formData.get("displayOrder") ?? 0,
    visible: formData.get("visible") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    platform: parsed.data.platform,
    label: parsed.data.label,
    url: parsed.data.url,
    icon: parsed.data.icon || null,
    display_order: parsed.data.displayOrder,
    visible: parsed.data.visible ?? true,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase
      .from("social_links")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "social_link", id);
  } else {
    const { data, error } = await supabase
      .from("social_links")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "social_link", data.id);
  }

  revalidateAfterContentChange(CACHE_TAGS.site);
  return { success: "Social link saved." };
}

export async function deleteSocialLinkAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing social link id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "social_link", id);
  revalidateAfterContentChange(CACHE_TAGS.site);
  return { success: "Social link deleted." };
}

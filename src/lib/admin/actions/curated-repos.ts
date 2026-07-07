"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { revalidateAfterContentChange } from "@/lib/db/revalidate";
import {
  curatedRepoSchema,
  type AdminActionState,
} from "@/lib/validators/curated-repos";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: "curated_repo",
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

export async function upsertCuratedRepoAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = curatedRepoSchema.safeParse({
    repoFullName: formData.get("repoFullName"),
    pinned: formData.get("pinned") === "on",
    hidden: formData.get("hidden") === "on",
    overrideDescription: formData.get("overrideDescription") || undefined,
    displayOrder: formData.get("displayOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");

  const payload = {
    repo_full_name: parsed.data.repoFullName,
    pinned: parsed.data.pinned ?? false,
    hidden: parsed.data.hidden ?? false,
    override_description: parsed.data.overrideDescription || null,
    display_order: parsed.data.displayOrder,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase
      .from("curated_repos")
      .update(payload)
      .eq("id", id);

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", id);
  } else {
    const { data, error } = await supabase
      .from("curated_repos")
      .insert(payload)
      .select("id")
      .single();

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", data.id);
  }

  revalidateAfterContentChange(CACHE_TAGS.curatedRepos);
  return { success: "Repository curation saved." };
}

export async function deleteCuratedRepoAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing repository id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("curated_repos").delete().eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", id);
  revalidateAfterContentChange(CACHE_TAGS.curatedRepos);
  return { success: "Repository curation removed." };
}

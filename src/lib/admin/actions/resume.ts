"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { revalidateAfterResumeChange } from "@/lib/db/revalidate";
import {
  resumeVersionSchema,
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
    entity_type: "resume_version",
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

export async function upsertResumeVersionAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = resumeVersionSchema.safeParse({
    title: formData.get("title"),
    fileMediaId: formData.get("fileMediaId"),
    displayOrder: formData.get("displayOrder") ?? 0,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");

  const { data: media, error: mediaError } = await supabase
    .from("media_files")
    .select("mime_type")
    .eq("id", parsed.data.fileMediaId)
    .maybeSingle();

  if (mediaError || !media) {
    return { error: "Selected file was not found." };
  }

  if (media.mime_type !== "application/pdf") {
    return { error: "Resume files must be PDF documents." };
  }

  if (parsed.data.isActive) {
    await supabase
      .from("resume_versions")
      .update({ is_active: false })
      .neq("id", typeof id === "string" ? id : "");
  }

  const payload = {
    title: parsed.data.title,
    file_media_id: parsed.data.fileMediaId,
    display_order: parsed.data.displayOrder,
    is_active: parsed.data.isActive ?? false,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase
      .from("resume_versions")
      .update(payload)
      .eq("id", id);

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", id);
  } else {
    const { data, error } = await supabase
      .from("resume_versions")
      .insert(payload)
      .select("id")
      .single();

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", data.id);
  }

  revalidateAfterResumeChange();
  return { success: "Resume version saved." };
}

export async function deleteResumeVersionAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing resume version id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("resume_versions").delete().eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", id);
  revalidateAfterResumeChange();
  return { success: "Resume version deleted." };
}

export async function setActiveResumeVersionAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing resume version id." };
  }

  const { supabase, user } = await requireAdmin();
  await supabase.from("resume_versions").update({ is_active: false }).neq("id", id);

  const { error } = await supabase
    .from("resume_versions")
    .update({ is_active: true })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "activate", id);
  revalidateAfterResumeChange();
  return { success: "Active resume updated." };
}

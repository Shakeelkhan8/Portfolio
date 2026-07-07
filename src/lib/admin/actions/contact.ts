"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  contactSubmissionsToCsv,
  getContactSubmissions,
} from "@/lib/db/queries/admin/contact-submissions";
import type { AdminActionState } from "@/lib/validators/content";
import { contactStatusSchema, type ContactStatusFilter } from "@/lib/validators/contact";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: "contact_submission",
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

function revalidateContactInbox() {
  revalidatePath("/admin/contact");
  revalidatePath("/admin/dashboard");
}

export async function markContactSubmissionReadAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { error: "Missing submission id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("contact_submissions")
    .update({
      status: "read",
      read_at: new Date().toISOString(),
      read_by: user.id,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "mark_read", id);
  revalidateContactInbox();
  return { success: "Marked as read." };
}

export async function archiveContactSubmissionAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { error: "Missing submission id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "archive", id);
  revalidateContactInbox();
  return { success: "Archived." };
}

export async function markContactSubmissionUnreadAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { error: "Missing submission id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("contact_submissions")
    .update({
      status: "unread",
      read_at: null,
      read_by: null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "mark_unread", id);
  revalidateContactInbox();
  return { success: "Marked as unread." };
}

export async function deleteContactSubmissionAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { error: "Missing submission id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "delete", id);
  revalidateContactInbox();
  return { success: "Submission deleted." };
}

export async function exportContactSubmissionsAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState & { csv?: string }> {
  const { supabase, user } = await requireAdmin();

  const statusRaw = formData.get("status")?.toString() ?? "all";
  let status: ContactStatusFilter = "all";

  if (statusRaw !== "all") {
    const parsed = contactStatusSchema.safeParse(statusRaw);
    if (parsed.success) {
      status = parsed.data;
    }
  }

  const submissions = await getContactSubmissions({
    status,
    search: formData.get("search")?.toString(),
  });

  await logAdminAction(supabase, user.id, "export");

  return {
    success: "Export ready.",
    csv: contactSubmissionsToCsv(submissions),
  };
}

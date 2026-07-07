"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { revalidateAfterContentChange } from "@/lib/db/revalidate";
import {
  certificationSchema,
  emptyMediaId,
  serviceSchema,
  testimonialSchema,
  type AdminActionState,
} from "@/lib/validators/cms-modules";

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

export async function upsertCertificationAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = certificationSchema.safeParse({
    name: formData.get("name"),
    issuer: formData.get("issuer"),
    issueDate: formData.get("issueDate") || undefined,
    credentialId: formData.get("credentialId") || undefined,
    verificationUrl: formData.get("verificationUrl") || undefined,
    imageMediaId: formData.get("imageMediaId") || undefined,
    displayOrder: formData.get("displayOrder") ?? 0,
    visible: formData.get("visible") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    name: parsed.data.name,
    issuer: parsed.data.issuer,
    issue_date: parsed.data.issueDate || null,
    credential_id: parsed.data.credentialId || null,
    verification_url: parsed.data.verificationUrl || null,
    image_media_id: emptyMediaId(parsed.data.imageMediaId),
    display_order: parsed.data.displayOrder,
    visible: parsed.data.visible ?? true,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase.from("certifications").update(payload).eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "certification", id);
  } else {
    const { data, error } = await supabase
      .from("certifications")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "certification", data.id);
  }

  revalidateAfterContentChange(CACHE_TAGS.certifications);
  return { success: "Certification saved." };
}

export async function deleteCertificationAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing certification id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "certification", id);
  revalidateAfterContentChange(CACHE_TAGS.certifications);
  return { success: "Certification deleted." };
}

export async function upsertTestimonialAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = testimonialSchema.safeParse({
    authorName: formData.get("authorName"),
    authorRole: formData.get("authorRole") || undefined,
    authorCompany: formData.get("authorCompany") || undefined,
    content: formData.get("content"),
    rating: formData.get("rating") || undefined,
    avatarMediaId: formData.get("avatarMediaId") || undefined,
    featured: formData.get("featured") === "on",
    displayOrder: formData.get("displayOrder") ?? 0,
    visible: formData.get("visible") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    author_name: parsed.data.authorName,
    author_role: parsed.data.authorRole || null,
    author_company: parsed.data.authorCompany || null,
    content: parsed.data.content,
    rating:
      typeof parsed.data.rating === "number" ? parsed.data.rating : null,
    avatar_media_id: emptyMediaId(parsed.data.avatarMediaId),
    featured: parsed.data.featured ?? false,
    display_order: parsed.data.displayOrder,
    visible: parsed.data.visible ?? true,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase.from("testimonials").update(payload).eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "testimonial", id);
  } else {
    const { data, error } = await supabase
      .from("testimonials")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "testimonial", data.id);
  }

  revalidateAfterContentChange(CACHE_TAGS.testimonials);
  return { success: "Testimonial saved." };
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing testimonial id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "testimonial", id);
  revalidateAfterContentChange(CACHE_TAGS.testimonials);
  return { success: "Testimonial deleted." };
}

export async function upsertServiceAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
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
    title: parsed.data.title,
    description: parsed.data.description,
    icon: parsed.data.icon || null,
    display_order: parsed.data.displayOrder,
    visible: parsed.data.visible ?? true,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase.from("services").update(payload).eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "service", id);
  } else {
    const { data, error } = await supabase
      .from("services")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "service", data.id);
  }

  revalidateAfterContentChange(CACHE_TAGS.services);
  return { success: "Service saved." };
}

export async function deleteServiceAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing service id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "service", id);
  revalidateAfterContentChange(CACHE_TAGS.services);
  return { success: "Service deleted." };
}

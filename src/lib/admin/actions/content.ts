"use server";

import { revalidateAfterContentChange } from "@/lib/db/revalidate";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  achievementSchema,
  educationSchema,
  experienceSchema,
  navigationSchema,
  skillCategorySchema,
  skillSchema,
  splitCsv,
  splitLines,
  slugify,
  type AdminActionState,
} from "@/lib/validators/content";

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

export async function upsertSkillCategoryAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = skillCategorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const slug = parsed.data.slug || slugify(parsed.data.name);
  const id = formData.get("id");

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase
      .from("skill_categories")
      .update({ name: parsed.data.name, slug })
      .eq("id", id);

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "skill_category", id);
  } else {
    const { error } = await supabase.from("skill_categories").insert({
      name: parsed.data.name,
      slug,
      display_order: Number(formData.get("displayOrder") ?? 0),
    });

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "skill_category");
  }

  revalidateAfterContentChange(CACHE_TAGS.skills);
  return { success: "Skill category saved." };
}

export async function deleteSkillCategoryAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing category id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("skill_categories").delete().eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "skill_category", id);
  revalidateAfterContentChange(CACHE_TAGS.skills);
  return { success: "Skill category deleted." };
}

export async function upsertSkillAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = skillSchema.safeParse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    icon: formData.get("icon") || undefined,
    level: formData.get("level") || undefined,
    displayOrder: formData.get("displayOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    icon: parsed.data.icon || null,
    level: parsed.data.level || null,
    display_order: parsed.data.displayOrder,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase.from("skills").update(payload).eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "skill", id);
  } else {
    const { error } = await supabase.from("skills").insert(payload);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "skill");
  }

  revalidateAfterContentChange(CACHE_TAGS.skills);
  return { success: "Skill saved." };
}

export async function deleteSkillAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing skill id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "skill", id);
  revalidateAfterContentChange(CACHE_TAGS.skills);
  return { success: "Skill deleted." };
}

export async function upsertExperienceAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = experienceSchema.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    description: formData.get("description") || undefined,
    featured: formData.get("featured") === "on",
    displayOrder: formData.get("displayOrder") ?? 0,
    highlights: formData.get("highlights"),
    technologies: formData.get("technologies"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    company: parsed.data.company,
    role: parsed.data.role,
    location: parsed.data.location,
    start_date: parsed.data.startDate,
    end_date: parsed.data.endDate || null,
    description: parsed.data.description || null,
    featured: parsed.data.featured ?? false,
    display_order: parsed.data.displayOrder,
  };

  let experienceId = typeof id === "string" ? id : "";

  if (experienceId) {
    const { error } = await supabase
      .from("experiences")
      .update(payload)
      .eq("id", experienceId);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "experience", experienceId);
  } else {
    const { data, error } = await supabase
      .from("experiences")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) return { error: error?.message ?? "Failed to create." };
    experienceId = data.id;
    await logAdminAction(supabase, user.id, "create", "experience", experienceId);
  }

  await supabase.from("experience_highlights").delete().eq("experience_id", experienceId);
  await supabase.from("experience_technologies").delete().eq("experience_id", experienceId);

  const highlights = splitLines(formData.get("highlights")?.toString());
  const technologies = splitCsv(formData.get("technologies")?.toString());

  if (highlights.length) {
    await supabase.from("experience_highlights").insert(
      highlights.map((text, index) => ({
        experience_id: experienceId,
        text,
        display_order: index,
      })),
    );
  }

  if (technologies.length) {
    await supabase.from("experience_technologies").insert(
      technologies.map((technology, index) => ({
        experience_id: experienceId,
        technology,
        display_order: index,
      })),
    );
  }

  revalidateAfterContentChange(CACHE_TAGS.experience);
  return { success: "Experience saved." };
}

export async function deleteExperienceAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing experience id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "experience", id);
  revalidateAfterContentChange(CACHE_TAGS.experience);
  return { success: "Experience deleted." };
}

export async function upsertEducationAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = educationSchema.safeParse({
    institution: formData.get("institution"),
    degree: formData.get("degree"),
    location: formData.get("location"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    description: formData.get("description") || undefined,
    displayOrder: formData.get("displayOrder") ?? 0,
    achievements: formData.get("achievements"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    institution: parsed.data.institution,
    degree: parsed.data.degree,
    location: parsed.data.location,
    start_date: parsed.data.startDate,
    end_date: parsed.data.endDate || null,
    description: parsed.data.description || null,
    display_order: parsed.data.displayOrder,
  };

  let educationId = typeof id === "string" ? id : "";

  if (educationId) {
    const { error } = await supabase
      .from("educations")
      .update(payload)
      .eq("id", educationId);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "education", educationId);
  } else {
    const { data, error } = await supabase
      .from("educations")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) return { error: error?.message ?? "Failed to create." };
    educationId = data.id;
    await logAdminAction(supabase, user.id, "create", "education", educationId);
  }

  await supabase.from("education_achievements").delete().eq("education_id", educationId);
  const achievements = splitLines(formData.get("achievements")?.toString());

  if (achievements.length) {
    await supabase.from("education_achievements").insert(
      achievements.map((text, index) => ({
        education_id: educationId,
        text,
        display_order: index,
      })),
    );
  }

  revalidateAfterContentChange(CACHE_TAGS.education);
  return { success: "Education saved." };
}

export async function deleteEducationAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing education id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("educations").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "education", id);
  revalidateAfterContentChange(CACHE_TAGS.education);
  return { success: "Education deleted." };
}

export async function upsertAchievementAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = achievementSchema.safeParse({
    text: formData.get("text"),
    featured: formData.get("featured") === "on",
    displayOrder: formData.get("displayOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    text: parsed.data.text,
    featured: parsed.data.featured ?? false,
    display_order: parsed.data.displayOrder,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase.from("achievements").update(payload).eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "achievement", id);
  } else {
    const { error } = await supabase.from("achievements").insert(payload);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "achievement");
  }

  revalidateAfterContentChange(CACHE_TAGS.achievements);
  return { success: "Achievement saved." };
}

export async function deleteAchievementAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing achievement id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "achievement", id);
  revalidateAfterContentChange(CACHE_TAGS.achievements);
  return { success: "Achievement deleted." };
}

export async function upsertNavigationAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = navigationSchema.safeParse({
    navGroup: formData.get("navGroup"),
    title: formData.get("title"),
    href: formData.get("href"),
    external: formData.get("external") === "on",
    displayOrder: formData.get("displayOrder") ?? 0,
    visible: formData.get("visible") !== "off",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const payload = {
    nav_group: parsed.data.navGroup,
    title: parsed.data.title,
    href: parsed.data.href,
    external: parsed.data.external ?? false,
    display_order: parsed.data.displayOrder,
    visible: parsed.data.visible ?? true,
  };

  if (typeof id === "string" && id.length > 0) {
    const { error } = await supabase
      .from("navigation_items")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "navigation_item", id);
  } else {
    const { error } = await supabase.from("navigation_items").insert(payload);
    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "navigation_item");
  }

  revalidateAfterContentChange(CACHE_TAGS.navigation);
  return { success: "Navigation item saved." };
}

export async function deleteNavigationAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing navigation id." };

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "navigation_item", id);
  revalidateAfterContentChange(CACHE_TAGS.navigation);
  return { success: "Navigation item deleted." };
}

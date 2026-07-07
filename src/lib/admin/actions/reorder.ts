"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin/require-admin";
import { CACHE_TAGS, type CacheTag } from "@/lib/db/cache-tags";
import {
  revalidateAfterContentChange,
  revalidateAfterProjectChange,
  revalidateAfterResumeChange,
} from "@/lib/db/revalidate";
import {
  moveDisplayOrderSchema,
  type ReorderEntity,
} from "@/lib/validators/reorder";
import type { AdminActionState } from "@/lib/validators/content";

type ReorderConfig = {
  table: string;
  scopeColumn?: "nav_group" | "category_id";
  cacheTags: CacheTag[];
  revalidate?: () => void;
};

const REORDER_CONFIG: Record<ReorderEntity, ReorderConfig> = {
  projects: {
    table: "projects",
    cacheTags: [CACHE_TAGS.projects],
    revalidate: () => revalidateAfterProjectChange(),
  },
  services: {
    table: "services",
    cacheTags: [CACHE_TAGS.services],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.services),
  },
  testimonials: {
    table: "testimonials",
    cacheTags: [CACHE_TAGS.testimonials],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.testimonials),
  },
  certifications: {
    table: "certifications",
    cacheTags: [CACHE_TAGS.certifications],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.certifications),
  },
  "curated-repos": {
    table: "curated_repos",
    cacheTags: [CACHE_TAGS.curatedRepos],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.curatedRepos),
  },
  "resume-versions": {
    table: "resume_versions",
    cacheTags: [CACHE_TAGS.resume],
    revalidate: () => revalidateAfterResumeChange(),
  },
  navigation: {
    table: "navigation_items",
    scopeColumn: "nav_group",
    cacheTags: [CACHE_TAGS.navigation],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.navigation),
  },
  experiences: {
    table: "experiences",
    cacheTags: [CACHE_TAGS.experience],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.experience),
  },
  educations: {
    table: "educations",
    cacheTags: [CACHE_TAGS.education],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.education),
  },
  achievements: {
    table: "achievements",
    cacheTags: [CACHE_TAGS.achievements],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.achievements),
  },
  "skill-categories": {
    table: "skill_categories",
    cacheTags: [CACHE_TAGS.skills],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.skills),
  },
  skills: {
    table: "skills",
    scopeColumn: "category_id",
    cacheTags: [CACHE_TAGS.skills],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.skills),
  },
  expertise: {
    table: "expertise_items",
    cacheTags: [CACHE_TAGS.site],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.site),
  },
  philosophy: {
    table: "philosophy_items",
    cacheTags: [CACHE_TAGS.site],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.site),
  },
  languages: {
    table: "languages",
    cacheTags: [CACHE_TAGS.site],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.site),
  },
  "social-links": {
    table: "social_links",
    cacheTags: [CACHE_TAGS.site],
    revalidate: () => revalidateAfterContentChange(CACHE_TAGS.site),
  },
};

async function logReorder(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  entity: ReorderEntity,
  entityId: string,
  direction: "up" | "down",
  scopeKey?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action: "reorder",
    entity_type: entity,
    entity_id: entityId,
    metadata_json: { direction, scopeKey: scopeKey ?? null },
  });
}

export async function moveDisplayOrderAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = moveDisplayOrderSchema.safeParse({
    entity: formData.get("entity"),
    id: formData.get("id"),
    direction: formData.get("direction"),
    scopeKey: formData.get("scopeKey") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid reorder request." };
  }

  const { entity, id, direction, scopeKey } = parsed.data;
  const config = REORDER_CONFIG[entity];
  const { supabase, user } = await requireAdmin();

  // Reorder operates on dynamic table names, so use an untyped client view for
  // these generic operations. All table names are constrained by REORDER_CONFIG.
  const db = supabase as unknown as SupabaseClient;

  let query = db
    .from(config.table)
    .select("id, display_order")
    .order("display_order", { ascending: true });

  if (config.scopeColumn) {
    if (!scopeKey) {
      return { error: "Missing reorder scope." };
    }
    query = query.eq(config.scopeColumn, scopeKey);
  }

  if (entity === "projects") {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query;
  const rows = (data ?? []) as Array<{ id: string; display_order: number }>;

  if (error || !rows.length) {
    return { error: error?.message ?? "Could not load items to reorder." };
  }

  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) {
    return { error: "Item not found in this list." };
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= rows.length) {
    return {
      error:
        direction === "up"
          ? "Already at the top."
          : "Already at the bottom.",
    };
  }

  const reordered = [...rows];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, moved);

  const updates = await Promise.all(
    reordered.map((row, order) =>
      db
        .from(config.table)
        .update({ display_order: order })
        .eq("id", row.id),
    ),
  );

  const failed = updates.find((result) => result.error);
  if (failed?.error) {
    return { error: failed.error.message };
  }

  await logReorder(supabase, user.id, entity, id, direction, scopeKey);
  config.revalidate?.();

  return { success: "Order updated." };
}

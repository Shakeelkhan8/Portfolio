"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { revalidateAfterProjectChange } from "@/lib/db/revalidate";
import {
  emptyMediaId,
  parseProjectArrays,
  projectSchema,
  type AdminActionState,
} from "@/lib/validators/projects";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: "project",
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

async function syncProjectChildren(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  projectId: string,
  arrays: ReturnType<typeof parseProjectArrays>,
) {
  await Promise.all([
    supabase.from("project_tags").delete().eq("project_id", projectId),
    supabase.from("project_technologies").delete().eq("project_id", projectId),
    supabase.from("project_links").delete().eq("project_id", projectId),
    supabase.from("project_metrics").delete().eq("project_id", projectId),
    supabase.from("project_challenges").delete().eq("project_id", projectId),
    supabase.from("project_decisions").delete().eq("project_id", projectId),
    supabase.from("project_results").delete().eq("project_id", projectId),
    supabase.from("project_lessons").delete().eq("project_id", projectId),
    supabase.from("project_future_improvements").delete().eq("project_id", projectId),
    supabase
      .from("project_architecture_diagrams")
      .delete()
      .eq("project_id", projectId),
  ]);

  const inserts = [];

  if (arrays.tags.length) {
    inserts.push(
      supabase.from("project_tags").insert(
        arrays.tags.map((tag, index) => ({
          project_id: projectId,
          tag,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.stack.length) {
    inserts.push(
      supabase.from("project_technologies").insert(
        arrays.stack.map((technology, index) => ({
          project_id: projectId,
          technology,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.links.length) {
    inserts.push(
      supabase.from("project_links").insert(
        arrays.links.map((link, index) => ({
          project_id: projectId,
          label: link.label,
          href: link.href,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.metrics.length) {
    inserts.push(
      supabase.from("project_metrics").insert(
        arrays.metrics.map((metric, index) => ({
          project_id: projectId,
          label: metric.label,
          value: metric.value,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.challenges.length) {
    inserts.push(
      supabase.from("project_challenges").insert(
        arrays.challenges.map((text, index) => ({
          project_id: projectId,
          text,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.decisions.length) {
    inserts.push(
      supabase.from("project_decisions").insert(
        arrays.decisions.map((decision, index) => ({
          project_id: projectId,
          decision: decision.decision,
          rationale: decision.rationale,
          tradeoff: decision.tradeoff,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.results.length) {
    inserts.push(
      supabase.from("project_results").insert(
        arrays.results.map((text, index) => ({
          project_id: projectId,
          text,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.lessons.length) {
    inserts.push(
      supabase.from("project_lessons").insert(
        arrays.lessons.map((text, index) => ({
          project_id: projectId,
          text,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.futureImprovements.length) {
    inserts.push(
      supabase.from("project_future_improvements").insert(
        arrays.futureImprovements.map((text, index) => ({
          project_id: projectId,
          text,
          display_order: index,
        })),
      ),
    );
  }

  if (arrays.diagram && arrays.diagramTitle) {
    inserts.push(
      supabase.from("project_architecture_diagrams").insert({
        project_id: projectId,
        title: arrays.diagramTitle,
        nodes_json: arrays.diagram.nodes,
        edges_json: arrays.diagram.edges,
      }),
    );
  }

  const results = await Promise.all(inserts);

  for (const result of results) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }
}

export async function upsertProjectAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = projectSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    problem: formData.get("problem"),
    role: formData.get("role"),
    context: formData.get("context"),
    overview: formData.get("overview"),
    architectureText: formData.get("architectureText"),
    status: formData.get("status") ?? "draft",
    featured: formData.get("featured") === "on",
    displayOrder: formData.get("displayOrder") ?? 0,
    completionDate: formData.get("completionDate") || undefined,
    demoUrl: formData.get("demoUrl") || undefined,
    githubUrl: formData.get("githubUrl") || undefined,
    thumbnailMediaId: formData.get("thumbnailMediaId") || undefined,
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    ogImageId: formData.get("ogImageId") || undefined,
    canonicalUrl: formData.get("canonicalUrl") || undefined,
    robots: formData.get("robots") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let arrays: ReturnType<typeof parseProjectArrays>;

  try {
    arrays = parseProjectArrays(formData);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid project content.",
    };
  }

  const { supabase, user } = await requireAdmin();
  const id = formData.get("id");
  const previousSlug =
    typeof formData.get("previousSlug") === "string"
      ? formData.get("previousSlug")?.toString()
      : undefined;

  const payload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    problem: parsed.data.problem,
    role: parsed.data.role,
    context: parsed.data.context,
    overview: parsed.data.overview,
    architecture_text: parsed.data.architectureText,
    status: parsed.data.status,
    featured: parsed.data.featured ?? false,
    display_order: parsed.data.displayOrder,
    completion_date: parsed.data.completionDate || null,
    demo_url: parsed.data.demoUrl || null,
    github_url: parsed.data.githubUrl || null,
    thumbnail_media_id: emptyMediaId(parsed.data.thumbnailMediaId),
    meta_title: parsed.data.metaTitle || null,
    meta_description: parsed.data.metaDescription || null,
    og_image_id: emptyMediaId(parsed.data.ogImageId),
    canonical_url: parsed.data.canonicalUrl || null,
    robots: parsed.data.robots || "index, follow",
    published_at:
      parsed.data.status === "published" ? new Date().toISOString() : null,
  };

  let projectId = typeof id === "string" ? id : "";
  const isUpdate = Boolean(projectId);

  if (isUpdate) {
    const { data: existing, error: existingError } = await supabase
      .from("projects")
      .select("published_at")
      .eq("id", projectId)
      .maybeSingle();

    if (existingError) {
      return { error: existingError.message };
    }

    const updatePayload = {
      ...payload,
      published_at:
        parsed.data.status === "published"
          ? existing?.published_at ?? new Date().toISOString()
          : null,
    };

    const { error } = await supabase
      .from("projects")
      .update(updatePayload)
      .eq("id", projectId)
      .is("deleted_at", null);

    if (error) {
      return { error: error.message };
    }

    await logAdminAction(supabase, user.id, "update", projectId);
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      return { error: error?.message ?? "Failed to create project." };
    }

    projectId = data.id;
    await logAdminAction(supabase, user.id, "create", projectId);
  }

  try {
    await syncProjectChildren(supabase, projectId, arrays);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to save project details.",
    };
  }

  revalidateAfterProjectChange({
    slug: parsed.data.slug,
    previousSlug,
  });

  return {
    success: isUpdate ? "Project saved." : "Project created.",
  };
}

export async function deleteProjectAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { error: "Missing project id." };
  }

  const { supabase, user } = await requireAdmin();

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !project) {
    return { error: fetchError?.message ?? "Project not found." };
  }

  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, user.id, "delete", id);
  revalidateAfterProjectChange({ slug: project.slug });
  return { success: "Project archived." };
}

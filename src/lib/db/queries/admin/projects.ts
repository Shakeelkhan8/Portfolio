import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  buildPaginatedResult,
  getRange,
  type PaginatedResult,
} from "@/lib/admin/pagination";
import type { ProjectArchitectureRecord, ProjectListRecord, ProjectRecord } from "@/types/cms";

function byProject<T extends { project_id: string; display_order: number }>(
  rows: T[] | null | undefined,
  projectId: string,
) {
  return (rows ?? [])
    .filter((row) => row.project_id === projectId)
    .sort((a, b) => a.display_order - b.display_order);
}

function mapProjectRecord(
  project: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    problem: string;
    role: string;
    context: string;
    overview: string;
    architecture_text: string;
    status: "draft" | "published";
    featured: boolean;
    display_order: number;
    completion_date: string | null;
    demo_url: string | null;
    github_url: string | null;
    thumbnail_media_id: string | null;
    meta_title: string | null;
    meta_description: string | null;
    og_image_id: string | null;
    canonical_url: string | null;
    robots: string | null;
    published_at: string | null;
  },
  relations: {
    tags: Array<{ tag: string }>;
    stack: Array<{ technology: string }>;
    links: Array<{ label: string; href: string }>;
    metrics: Array<{ label: string; value: string }>;
    challenges: Array<{ text: string }>;
    decisions: Array<{
      decision: string;
      rationale: string;
      tradeoff: string;
    }>;
    results: Array<{ text: string }>;
    lessons: Array<{ text: string }>;
    futureImprovements: Array<{ text: string }>;
    diagram: {
      title: string;
      nodes_json: unknown;
      edges_json: unknown;
    } | null;
  },
): ProjectRecord {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    problem: project.problem,
    role: project.role,
    context: project.context,
    overview: project.overview,
    architectureText: project.architecture_text,
    status: project.status,
    featured: project.featured,
    displayOrder: project.display_order,
    completionDate: project.completion_date,
    demoUrl: project.demo_url,
    githubUrl: project.github_url,
    thumbnailMediaId: project.thumbnail_media_id,
    metaTitle: project.meta_title,
    metaDescription: project.meta_description,
    ogImageId: project.og_image_id,
    canonicalUrl: project.canonical_url,
    robots: project.robots,
    publishedAt: project.published_at,
    tags: relations.tags.map((row) => row.tag),
    stack: relations.stack.map((row) => row.technology),
    links: relations.links.map((row) => ({
      label: row.label,
      href: row.href,
    })),
    metrics: relations.metrics.map((row) => ({
      label: row.label,
      value: row.value,
    })),
    challenges: relations.challenges.map((row) => row.text),
    decisions: relations.decisions.map((row) => ({
      decision: row.decision,
      rationale: row.rationale,
      tradeoff: row.tradeoff,
    })),
    results: relations.results.map((row) => row.text),
    lessons: relations.lessons.map((row) => row.text),
    futureImprovements: relations.futureImprovements.map((row) => row.text),
    diagram: relations.diagram
      ? {
          title: relations.diagram.title,
          nodes:
            (relations.diagram.nodes_json as ProjectArchitectureRecord["nodes"]) ??
            [],
          edges:
            (relations.diagram.edges_json as ProjectArchitectureRecord["edges"]) ??
            [],
        }
      : null,
  };
}

async function fetchProjectRelations(projectIds: string[]) {
  if (!projectIds.length) {
    return {
      tags: [],
      stack: [],
      links: [],
      metrics: [],
      challenges: [],
      decisions: [],
      results: [],
      lessons: [],
      futureImprovements: [],
      diagrams: [],
    };
  }

  const supabase = await createClient();

  const [
    tagsResult,
    stackResult,
    linksResult,
    metricsResult,
    challengesResult,
    decisionsResult,
    resultsResult,
    lessonsResult,
    futureResult,
    diagramsResult,
  ] = await Promise.all([
    supabase
      .from("project_tags")
      .select("project_id, tag, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_technologies")
      .select("project_id, technology, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_links")
      .select("project_id, label, href, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_metrics")
      .select("project_id, label, value, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_challenges")
      .select("project_id, text, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_decisions")
      .select("project_id, decision, rationale, tradeoff, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_results")
      .select("project_id, text, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_lessons")
      .select("project_id, text, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_future_improvements")
      .select("project_id, text, display_order")
      .in("project_id", projectIds),
    supabase
      .from("project_architecture_diagrams")
      .select("project_id, title, nodes_json, edges_json")
      .in("project_id", projectIds),
  ]);

  return {
    tags: tagsResult.data ?? [],
    stack: stackResult.data ?? [],
    links: linksResult.data ?? [],
    metrics: metricsResult.data ?? [],
    challenges: challengesResult.data ?? [],
    decisions: decisionsResult.data ?? [],
    results: resultsResult.data ?? [],
    lessons: lessonsResult.data ?? [],
    futureImprovements: futureResult.data ?? [],
    diagrams: diagramsResult.data ?? [],
  };
}

export async function getProjectRecords(): Promise<ProjectRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, summary, problem, role, context, overview, architecture_text, status, featured, display_order, completion_date, demo_url, github_url, thumbnail_media_id, meta_title, meta_description, og_image_id, canonical_url, robots, published_at",
    )
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error || !projects?.length) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);
  const relations = await fetchProjectRelations(projectIds);

  return projects.map((project) =>
    mapProjectRecord(project, {
      tags: byProject(relations.tags, project.id),
      stack: byProject(relations.stack, project.id),
      links: byProject(relations.links, project.id),
      metrics: byProject(relations.metrics, project.id),
      challenges: byProject(relations.challenges, project.id),
      decisions: byProject(relations.decisions, project.id),
      results: byProject(relations.results, project.id),
      lessons: byProject(relations.lessons, project.id),
      futureImprovements: byProject(relations.futureImprovements, project.id),
      diagram:
        relations.diagrams.find((diagram) => diagram.project_id === project.id) ??
        null,
    }),
  );
}

export async function getProjectRecordById(
  id: string,
): Promise<ProjectRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, summary, problem, role, context, overview, architecture_text, status, featured, display_order, completion_date, demo_url, github_url, thumbnail_media_id, meta_title, meta_description, og_image_id, canonical_url, robots, published_at",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !project) {
    return null;
  }

  const relations = await fetchProjectRelations([project.id]);

  return mapProjectRecord(project, {
    tags: byProject(relations.tags, project.id),
    stack: byProject(relations.stack, project.id),
    links: byProject(relations.links, project.id),
    metrics: byProject(relations.metrics, project.id),
    challenges: byProject(relations.challenges, project.id),
    decisions: byProject(relations.decisions, project.id),
    results: byProject(relations.results, project.id),
    lessons: byProject(relations.lessons, project.id),
    futureImprovements: byProject(relations.futureImprovements, project.id),
    diagram:
      relations.diagrams.find((diagram) => diagram.project_id === project.id) ??
      null,
  });
}

type ProjectListOptions = {
  page: number;
  pageSize: number;
};

export async function getProjectListRecords(
  options: ProjectListOptions,
): Promise<PaginatedResult<ProjectListRecord>> {
  if (!isSupabaseConfigured()) {
    return buildPaginatedResult([], 0, options.page, options.pageSize);
  }

  const supabase = await createClient();
  const { from, to } = getRange(options.page, options.pageSize);
  const { data, count, error } = await supabase
    .from("projects")
    .select("id, slug, title, status, featured, display_order", {
      count: "exact",
    })
    .is("deleted_at", null)
    .order("display_order", { ascending: true })
    .range(from, to);

  if (error || !data) {
    return buildPaginatedResult([], 0, options.page, options.pageSize);
  }

  const items: ProjectListRecord[] = data.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    status: project.status,
    featured: project.featured,
    displayOrder: project.display_order,
  }));

  return buildPaginatedResult(items, count ?? 0, options.page, options.pageSize);
}

import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import {
  getFallbackArchitectureDiagram,
  getFallbackProjects,
} from "@/lib/db/fallback";
import {
  mapArchitectureDiagram,
  mapProject,
} from "@/lib/db/mappers/content";
import type { ArchitectureDiagramData, Project } from "@/types";

async function fetchProjectsFromDb(): Promise<Project[] | null> {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "slug, title, summary, problem, role, context, overview, architecture_text, featured, demo_url, github_url, display_order",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error || !projects?.length) {
    return null;
  }

  const projectIdsResult = await supabase
    .from("projects")
    .select("id, slug")
    .eq("status", "published")
    .is("deleted_at", null);

  const slugToId = new Map(
    (projectIdsResult.data ?? []).map((project) => [project.slug, project.id]),
  );

  const ids = [...slugToId.values()];

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
  ] = await Promise.all([
    supabase.from("project_tags").select("project_id, tag, display_order").in("project_id", ids),
    supabase
      .from("project_technologies")
      .select("project_id, technology, display_order")
      .in("project_id", ids),
    supabase
      .from("project_links")
      .select("project_id, label, href, display_order")
      .in("project_id", ids),
    supabase
      .from("project_metrics")
      .select("project_id, label, value, display_order")
      .in("project_id", ids),
    supabase
      .from("project_challenges")
      .select("project_id, text, display_order")
      .in("project_id", ids),
    supabase
      .from("project_decisions")
      .select("project_id, decision, rationale, tradeoff, display_order")
      .in("project_id", ids),
    supabase
      .from("project_results")
      .select("project_id, text, display_order")
      .in("project_id", ids),
    supabase
      .from("project_lessons")
      .select("project_id, text, display_order")
      .in("project_id", ids),
    supabase
      .from("project_future_improvements")
      .select("project_id, text, display_order")
      .in("project_id", ids),
  ]);

  const byProject = <T extends { project_id: string; display_order: number }>(
    rows: T[] | null,
    projectId: string,
  ) =>
    (rows ?? [])
      .filter((row) => row.project_id === projectId)
      .sort((a, b) => a.display_order - b.display_order);

  return projects.map((project) => {
    const projectId = slugToId.get(project.slug);
    if (!projectId) {
      throw new Error(`Missing project id for slug ${project.slug}`);
    }

    const links = byProject(linksResult.data, projectId).map((link) => ({
      label: link.label,
      href: link.href,
    }));

    if (project.demo_url) {
      links.unshift({ label: "Live demo", href: project.demo_url });
    }

    if (project.github_url) {
      links.push({ label: "GitHub", href: project.github_url });
    }

    return mapProject(project, {
      tags: byProject(tagsResult.data, projectId).map((row) => row.tag),
      stack: byProject(stackResult.data, projectId).map((row) => row.technology),
      links,
      metrics: byProject(metricsResult.data, projectId).map((row) => ({
        label: row.label,
        value: row.value,
      })),
      challenges: byProject(challengesResult.data, projectId).map(
        (row) => row.text,
      ),
      decisions: byProject(decisionsResult.data, projectId).map((row) => ({
        decision: row.decision,
        rationale: row.rationale,
        tradeoff: row.tradeoff,
      })),
      results: byProject(resultsResult.data, projectId).map((row) => row.text),
      lessons: byProject(lessonsResult.data, projectId).map((row) => row.text),
      futureImprovements: byProject(futureResult.data, projectId).map(
        (row) => row.text,
      ),
    });
  });
}

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackProjects();
    }

    try {
      const projects = await fetchProjectsFromDb();
      return projects ?? getFallbackProjects();
    } catch {
      return getFallbackProjects();
    }
  },
  ["cms-projects"],
  { tags: [CACHE_TAGS.projects] },
);

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((project) => project.slug);
}

export async function getArchitectureDiagram(
  slug: string,
): Promise<ArchitectureDiagramData | undefined> {
  if (!isSupabaseConfigured()) {
    return getFallbackArchitectureDiagram(slug);
  }

  try {
    const supabase = await createClient();
    const projectResult = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!projectResult.data) {
      return getFallbackArchitectureDiagram(slug);
    }

    const { data, error } = await supabase
      .from("project_architecture_diagrams")
      .select("title, nodes_json, edges_json")
      .eq("project_id", projectResult.data.id)
      .maybeSingle();

    if (error || !data) {
      return getFallbackArchitectureDiagram(slug);
    }

    return mapArchitectureDiagram(data);
  } catch {
    return getFallbackArchitectureDiagram(slug);
  }
}

import { unstable_cache } from "next/cache";
import { createReadClient } from "@/lib/supabase/read-client";
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
import type { ArchitectureDiagramData, Project, ProjectDetail } from "@/types";

async function fetchProjectsFromDb(): Promise<Project[] | null> {
  const supabase = createReadClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "slug, title, summary, problem, role, context, overview, architecture_text, featured, demo_url, github_url, display_order, thumbnail_media_id",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error || !projects?.length) {
    return null;
  }

  const thumbnailIds = [
    ...new Set(
      projects
        .map((project) => project.thumbnail_media_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  let thumbnailMap = new Map<string, string>();
  if (thumbnailIds.length) {
    const { data: media } = await supabase
      .from("media_files")
      .select("id, public_url")
      .in("id", thumbnailIds);
    thumbnailMap = new Map((media ?? []).map((file) => [file.id, file.public_url]));
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

    return mapProject(
      project,
      {
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
      },
      project.thumbnail_media_id
        ? thumbnailMap.get(project.thumbnail_media_id) ?? null
        : null,
    );
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

async function fetchProjectDetailFromDb(
  slug: string,
): Promise<ProjectDetail | null> {
  const supabase = createReadClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, summary, problem, role, context, overview, architecture_text, featured, demo_url, github_url, display_order, meta_title, meta_description, canonical_url, robots, og_image_id, thumbnail_media_id",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !project) {
    return null;
  }

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
    ogImageResult,
    thumbnailResult,
  ] = await Promise.all([
    supabase
      .from("project_tags")
      .select("tag, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_technologies")
      .select("technology, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_links")
      .select("label, href, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_metrics")
      .select("label, value, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_challenges")
      .select("text, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_decisions")
      .select("decision, rationale, tradeoff, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_results")
      .select("text, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_lessons")
      .select("text, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("project_future_improvements")
      .select("text, display_order")
      .eq("project_id", project.id)
      .order("display_order", { ascending: true }),
    project.og_image_id
      ? supabase
          .from("media_files")
          .select("public_url")
          .eq("id", project.og_image_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    project.thumbnail_media_id
      ? supabase
          .from("media_files")
          .select("public_url")
          .eq("id", project.thumbnail_media_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const links = (linksResult.data ?? []).map((link) => ({
    label: link.label,
    href: link.href,
  }));

  if (project.demo_url) {
    links.unshift({ label: "Live demo", href: project.demo_url });
  }

  if (project.github_url) {
    links.push({ label: "GitHub", href: project.github_url });
  }

  const mapped = mapProject(
    {
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      problem: project.problem,
      role: project.role,
      context: project.context,
      overview: project.overview,
      architecture_text: project.architecture_text,
      featured: project.featured,
      demo_url: project.demo_url,
      github_url: project.github_url,
    },
    {
      tags: (tagsResult.data ?? []).map((row) => row.tag),
      stack: (stackResult.data ?? []).map((row) => row.technology),
      links,
      metrics: (metricsResult.data ?? []).map((row) => ({
        label: row.label,
        value: row.value,
      })),
      challenges: (challengesResult.data ?? []).map((row) => row.text),
      decisions: (decisionsResult.data ?? []).map((row) => ({
        decision: row.decision,
        rationale: row.rationale,
        tradeoff: row.tradeoff,
      })),
      results: (resultsResult.data ?? []).map((row) => row.text),
      lessons: (lessonsResult.data ?? []).map((row) => row.text),
      futureImprovements: (futureResult.data ?? []).map((row) => row.text),
    },
    thumbnailResult.data?.public_url ?? null,
  );

  return {
    ...mapped,
    metaTitle: project.meta_title,
    metaDescription: project.meta_description,
    ogImageUrl: ogImageResult.data?.public_url ?? null,
    canonicalUrl: project.canonical_url,
    robots: project.robots,
  };
}

const getCachedProjectDetail = unstable_cache(
  async (slug: string) => fetchProjectDetailFromDb(slug),
  ["cms-project-detail"],
  { tags: [CACHE_TAGS.projects] },
);

function mapFallbackProjectDetail(project: Project): ProjectDetail {
  return {
    ...project,
    metaTitle: null,
    metaDescription: null,
    ogImageUrl: null,
    canonicalUrl: null,
    robots: null,
  };
}

export async function getProjectDetailBySlug(
  slug: string,
): Promise<ProjectDetail | undefined> {
  const fallback = getFallbackProjects().find((project) => project.slug === slug);

  if (!isSupabaseConfigured()) {
    return fallback ? mapFallbackProjectDetail(fallback) : undefined;
  }

  try {
    const project = await getCachedProjectDetail(slug);
    if (project) {
      return project;
    }

    return fallback ? mapFallbackProjectDetail(fallback) : undefined;
  } catch {
    return fallback ? mapFallbackProjectDetail(fallback) : undefined;
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((project) => project.slug);
}

export type SitemapEntry = { slug: string; lastModified: Date };

export async function getProjectSitemapEntries(): Promise<SitemapEntry[]> {
  if (!isSupabaseConfigured()) {
    return getFallbackProjects().map((project) => ({
      slug: project.slug,
      lastModified: new Date(),
    }));
  }

  try {
    const supabase = createReadClient();
    const { data, error } = await supabase
      .from("projects")
      .select("slug, published_at, updated_at")
      .eq("status", "published")
      .is("deleted_at", null);

    if (error || !data?.length) {
      return [];
    }

    return data.map((row) => ({
      slug: row.slug,
      lastModified: new Date(row.updated_at ?? row.published_at ?? Date.now()),
    }));
  } catch {
    return [];
  }
}

export async function getArchitectureDiagram(
  slug: string,
): Promise<ArchitectureDiagramData | undefined> {
  if (!isSupabaseConfigured()) {
    return getFallbackArchitectureDiagram(slug);
  }

  try {
    const supabase = createReadClient();
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

import type {
  EngineeringDecision,
  Project,
  ProjectLink,
  ProjectMetric,
} from "@/types";
import type { ArchitectureDiagramData, DiagramEdge, DiagramNode } from "@/types";
import { toIsoMonth } from "@/lib/db/mappers/site";

type ProjectRow = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  role: string;
  context: string;
  overview: string;
  architecture_text: string;
  featured: boolean;
  demo_url: string | null;
  github_url: string | null;
};

export function mapProject(
  row: ProjectRow,
  relations: {
    tags: string[];
    stack: string[];
    links: ProjectLink[];
    metrics: ProjectMetric[];
    challenges: string[];
    decisions: EngineeringDecision[];
    results: string[];
    lessons: string[];
    futureImprovements: string[];
  },
  thumbnailUrl?: string | null,
): Project {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    problem: row.problem,
    role: row.role,
    context: row.context,
    stack: relations.stack,
    tags: relations.tags,
    featured: row.featured,
    links: relations.links,
    metrics: relations.metrics,
    overview: row.overview,
    challenges: relations.challenges,
    architecture: row.architecture_text,
    decisions: relations.decisions,
    results: relations.results,
    lessons: relations.lessons,
    futureImprovements: relations.futureImprovements.length
      ? relations.futureImprovements
      : undefined,
    thumbnailUrl: thumbnailUrl ?? null,
  };
}

export function mapArchitectureDiagram(row: {
  title: string;
  nodes_json: unknown;
  edges_json: unknown;
}): ArchitectureDiagramData {
  return {
    title: row.title,
    nodes: (row.nodes_json as DiagramNode[]) ?? [],
    edges: (row.edges_json as DiagramEdge[]) ?? [],
  };
}

export function mapExperienceEntry(row: {
  id: string;
  legacy_id: string | null;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  featured: boolean;
  display_order: number;
  highlights: Array<{ text: string }>;
}) {
  return {
    id: row.legacy_id ?? row.id,
    role: row.role,
    company: row.company,
    location: row.location,
    startDate: toIsoMonth(row.start_date) ?? row.start_date,
    endDate: toIsoMonth(row.end_date),
    highlights: row.highlights.map((item) => item.text),
    featured: row.featured,
  };
}

export function mapEducationEntry(row: {
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string | null;
}) {
  return {
    degree: row.degree,
    institution: row.institution,
    location: row.location,
    startDate: toIsoMonth(row.start_date) ?? row.start_date,
    endDate: toIsoMonth(row.end_date) ?? "",
  };
}

export function mapArticle(row: {
  slug: string;
  title: string;
  excerpt: string;
  content_html: string | null;
  published_at: string | null;
  reading_time_minutes: number;
  tags: Array<{ tag: string }>;
}) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content_html ?? undefined,
    date: row.published_at ?? new Date().toISOString(),
    readingTime: row.reading_time_minutes,
    tags: row.tags.map((item) => item.tag),
    published: true,
  };
}

import { z } from "zod";
import {
  slugify,
  splitCsv,
  splitLines,
  type AdminActionState,
} from "@/lib/validators/content";

export type { AdminActionState };

export const projectSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required."),
  title: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim().min(1, "Summary is required."),
  problem: z.string().trim().min(1, "Problem statement is required."),
  role: z.string().trim().min(1, "Role is required."),
  context: z.string().trim().min(1, "Context is required."),
  overview: z.string().trim().min(1, "Overview is required."),
  architectureText: z.string().trim().min(1, "Architecture text is required."),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.coerce.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  completionDate: z.string().optional(),
  demoUrl: z.string().trim().optional(),
  githubUrl: z.string().trim().optional(),
  thumbnailMediaId: z.string().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  ogImageId: z.string().optional(),
  canonicalUrl: z.string().trim().optional(),
  robots: z.string().trim().optional(),
});

export function parsePipeRows(
  value: string | null | undefined,
  columns: number,
  fieldName: string,
) {
  return splitLines(value).map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());

    if (parts.length < columns || parts.some((part) => !part)) {
      throw new Error(
        `Invalid ${fieldName} on line ${index + 1}. Use ${columns} pipe-separated values.`,
      );
    }

    return parts;
  });
}

export function parseMetrics(value?: string | null) {
  return parsePipeRows(value, 2, "metric").map(([label, metricValue]) => ({
    label,
    value: metricValue,
  }));
}

export function parseLinks(value?: string | null) {
  return parsePipeRows(value, 2, "link").map(([label, href]) => ({
    label,
    href,
  }));
}

export function parseDecisions(value?: string | null) {
  return parsePipeRows(value, 3, "decision").map(
    ([decision, rationale, tradeoff]) => ({
      decision,
      rationale,
      tradeoff,
    }),
  );
}

export function parseDiagramJson(
  nodesValue?: string | null,
  edgesValue?: string | null,
) {
  const nodesRaw = nodesValue?.trim();
  const edgesRaw = edgesValue?.trim();

  if (!nodesRaw && !edgesRaw) {
    return null;
  }

  if (!nodesRaw || !edgesRaw) {
    throw new Error("Architecture diagram requires both nodes and edges JSON.");
  }

  let nodes: unknown;
  let edges: unknown;

  try {
    nodes = JSON.parse(nodesRaw);
    edges = JSON.parse(edgesRaw);
  } catch {
    throw new Error("Architecture diagram JSON is invalid.");
  }

  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    throw new Error("Architecture diagram nodes and edges must be JSON arrays.");
  }

  return { nodes, edges };
}

export function projectSlugFromTitle(title: string) {
  return slugify(title);
}

export function parseProjectArrays(formData: FormData) {
  return {
    tags: splitCsv(formData.get("tags")?.toString()),
    stack: splitCsv(formData.get("stack")?.toString()),
    challenges: splitLines(formData.get("challenges")?.toString()),
    results: splitLines(formData.get("results")?.toString()),
    lessons: splitLines(formData.get("lessons")?.toString()),
    futureImprovements: splitLines(
      formData.get("futureImprovements")?.toString(),
    ),
    metrics: parseMetrics(formData.get("metrics")?.toString()),
    links: parseLinks(formData.get("links")?.toString()),
    decisions: parseDecisions(formData.get("decisions")?.toString()),
    diagramTitle: formData.get("diagramTitle")?.toString().trim() || "",
    diagram: parseDiagramJson(
      formData.get("diagramNodes")?.toString(),
      formData.get("diagramEdges")?.toString(),
    ),
  };
}

export function emptyMediaId(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

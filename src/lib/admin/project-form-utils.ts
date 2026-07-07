import type { ProjectRecord } from "@/types/cms";

export function formatLines(values: string[]) {
  return values.join("\n");
}

export function formatCsv(values: string[]) {
  return values.join(", ");
}

export function formatPipeRows(
  values: Array<Record<string, string>>,
  keys: string[],
) {
  return values.map((row) => keys.map((key) => row[key]).join(" | ")).join("\n");
}

export function projectToFormDefaults(project?: ProjectRecord | null) {
  if (!project) {
    return {
      slug: "",
      title: "",
      summary: "",
      problem: "",
      role: "",
      context: "",
      overview: "",
      architectureText: "",
      status: "draft",
      featured: false,
      displayOrder: 0,
      completionDate: "",
      demoUrl: "",
      githubUrl: "",
      thumbnailMediaId: "",
      metaTitle: "",
      metaDescription: "",
      ogImageId: "",
      canonicalUrl: "",
      robots: "index, follow",
      tags: "",
      stack: "",
      links: "",
      metrics: "",
      challenges: "",
      decisions: "",
      results: "",
      lessons: "",
      futureImprovements: "",
      diagramTitle: "",
      diagramNodes: "",
      diagramEdges: "",
    };
  }

  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    problem: project.problem,
    role: project.role,
    context: project.context,
    overview: project.overview,
    architectureText: project.architectureText,
    status: project.status,
    featured: project.featured,
    displayOrder: project.displayOrder,
    completionDate: project.completionDate ?? "",
    demoUrl: project.demoUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    thumbnailMediaId: project.thumbnailMediaId ?? "",
    metaTitle: project.metaTitle ?? "",
    metaDescription: project.metaDescription ?? "",
    ogImageId: project.ogImageId ?? "",
    canonicalUrl: project.canonicalUrl ?? "",
    robots: project.robots ?? "index, follow",
    tags: formatCsv(project.tags),
    stack: formatCsv(project.stack),
    links: formatPipeRows(project.links, ["label", "href"]),
    metrics: formatPipeRows(project.metrics, ["label", "value"]),
    challenges: formatLines(project.challenges),
    decisions: formatPipeRows(project.decisions, [
      "decision",
      "rationale",
      "tradeoff",
    ]),
    results: formatLines(project.results),
    lessons: formatLines(project.lessons),
    futureImprovements: formatLines(project.futureImprovements),
    diagramTitle: project.diagram?.title ?? "",
    diagramNodes: project.diagram
      ? JSON.stringify(project.diagram.nodes, null, 2)
      : "",
    diagramEdges: project.diagram
      ? JSON.stringify(project.diagram.edges, null, 2)
      : "",
  };
}

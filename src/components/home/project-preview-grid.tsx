import { ProjectCard } from "@/components/projects/project-card";
import {
  getArchitectureDiagramsBySlugs,
  getFeaturedProjects,
} from "@/lib/content";
import type { Project } from "@/types";

type ProjectPreviewGridProps = {
  projects?: Project[];
  limit?: number;
};

export async function ProjectPreviewGrid({
  projects,
  limit,
}: ProjectPreviewGridProps) {
  const items = (projects ?? (await getFeaturedProjects())).slice(
    0,
    limit ?? undefined,
  );
  const diagrams = await getArchitectureDiagramsBySlugs(
    items.map((project) => project.slug),
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          diagram={diagrams[project.slug] ?? null}
        />
      ))}
    </div>
  );
}

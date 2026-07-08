import { ProjectCard } from "@/components/projects/project-card";
import { FadeIn } from "@/components/motion/fade-in";
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
      {items.map((project, index) => (
        <FadeIn key={project.slug} delay={index * 0.05}>
          <ProjectCard
            project={project}
            diagram={diagrams[project.slug] ?? null}
          />
        </FadeIn>
      ))}
    </div>
  );
}

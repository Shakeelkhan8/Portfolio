import { ProjectCard } from "@/components/projects/project-card";
import { FadeIn } from "@/components/motion/fade-in";
import { getFeaturedProjects } from "@/lib/content";
import type { Project } from "@/types";

type ProjectPreviewGridProps = {
  projects?: Project[];
};

export async function ProjectPreviewGrid({ projects }: ProjectPreviewGridProps) {
  const items = projects ?? (await getFeaturedProjects());

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((project, index) => (
        <FadeIn key={project.slug} delay={index * 0.05}>
          <ProjectCard project={project} />
        </FadeIn>
      ))}
    </div>
  );
}

import { ProjectCard } from "@/components/projects/project-card";
import { FadeIn } from "@/components/motion/fade-in";
import { getFeaturedProjects } from "@/lib/content";

export function ProjectPreviewGrid() {
  const projects = getFeaturedProjects();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project, index) => (
        <FadeIn key={project.slug} delay={index * 0.05}>
          <ProjectCard project={project} />
        </FadeIn>
      ))}
    </div>
  );
}

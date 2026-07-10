import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Badge } from "@/components/ui/badge";
import { ProjectCardVisual } from "@/components/projects/project-card-visual";
import { HoverTilt } from "@/components/motion/hover-tilt";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import type { ArchitectureDiagramData, Project } from "@/types";

type ProjectCardProps = {
  project: Project;
  diagram?: ArchitectureDiagramData | null;
  delay?: number;
};

export function ProjectCard({ project, diagram, delay = 0 }: ProjectCardProps) {
  const href = routes.project(project.slug);

  return (
    <Reveal className="h-full" delay={delay}>
      <HoverTilt className="h-full">
        <article className="site-card group relative flex h-full flex-col overflow-hidden rounded-2xl">
          <AppLink
            href={href}
            showExternalIcon={false}
            className="absolute inset-0 z-10 rounded-2xl"
            aria-label={`Read case study: ${project.title}`}
          >
            <span className="sr-only">Read case study</span>
          </AppLink>

          <div className="overflow-hidden">
            <ProjectCardVisual project={project} diagram={diagram} />
          </div>
          <div className="relative z-0 flex flex-1 flex-col gap-3 p-5 sm:gap-4 sm:p-6">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-muted/60 text-[0.7rem] sm:text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="font-heading text-base font-semibold tracking-tight text-foreground transition-colors duration-300 sm:text-lg group-hover:text-foreground/80">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 sm:line-clamp-none">
                {project.summary}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Role:</span>{" "}
              {project.role}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.stack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="border-border/80 text-[0.7rem] sm:text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-foreground/90">
              Read case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1" />
            </p>
          </div>
        </article>
      </HoverTilt>
    </Reveal>
  );
}

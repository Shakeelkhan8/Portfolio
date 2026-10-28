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
  const highlightMetric = project.metrics[0];

  return (
    <Reveal className="h-full min-w-0" delay={delay}>
      <HoverTilt className="h-full min-w-0">
        <article className="site-card group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl transition-transform duration-300 active:scale-[0.985]">
          <AppLink
            href={href}
            showExternalIcon={false}
            className="absolute inset-0 z-10 rounded-2xl"
            aria-label={`Read case study: ${project.title}`}
          >
            <span className="sr-only">Read case study</span>
          </AppLink>

          <div className="relative min-w-0 overflow-hidden">
            <ProjectCardVisual project={project} diagram={diagram} />
            {highlightMetric ? (
              <div className="pointer-events-none absolute bottom-3 left-3 z-[1] max-w-[calc(100%-1.5rem)] rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] tracking-wide text-foreground backdrop-blur-sm sm:bottom-4 sm:left-4 sm:text-[11px]">
                <span className="font-semibold">{highlightMetric.value}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {highlightMetric.label}
                </span>
              </div>
            ) : null}
          </div>

          <div className="relative z-0 flex min-w-0 flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-6">
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-muted/60 text-[0.7rem] sm:text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="min-w-0 space-y-1.5 sm:space-y-2">
              <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 sm:text-lg group-hover:text-foreground/85">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-3">
                {project.summary}
              </p>
            </div>

            <p className="hidden min-w-0 truncate text-sm text-muted-foreground sm:block">
              <span className="font-medium text-foreground">Role:</span>{" "}
              {project.role}
            </p>

            <div className="hidden min-w-0 flex-wrap gap-1.5 sm:flex sm:gap-2">
              {project.stack.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="border-border/80 text-[0.7rem] sm:text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            <p className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-foreground">
              Read case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1" />
            </p>
          </div>
        </article>
      </HoverTilt>
    </Reveal>
  );
}

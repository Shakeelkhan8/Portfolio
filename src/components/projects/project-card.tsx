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
  return (
    <Reveal className="h-full" delay={delay}>
      <HoverTilt className="h-full">
        <article className="site-card group relative flex h-full flex-col overflow-hidden rounded-2xl">
          <div className="overflow-hidden">
            <ProjectCardVisual project={project} diagram={diagram} />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-muted/60">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-foreground/80">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Role:</span>{" "}
              {project.role}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="border-border/80">
                  {tech}
                </Badge>
              ))}
            </div>
            <AppLink
              href={routes.project(project.slug)}
              showExternalIcon={false}
              className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground"
            >
              Read case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </AppLink>
          </div>
        </article>
      </HoverTilt>
    </Reveal>
  );
}

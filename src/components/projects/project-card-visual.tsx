import Image from "next/image";
import { ArchitectureDiagramPreview } from "@/components/architecture/architecture-diagram-preview";
import { Badge } from "@/components/ui/badge";
import type { ArchitectureDiagramData, Project } from "@/types";

type ProjectCardVisualProps = {
  project: Project;
  diagram?: ArchitectureDiagramData | null;
};

export function ProjectCardVisual({
  project,
  diagram,
}: ProjectCardVisualProps) {
  if (project.thumbnailUrl) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/60 bg-muted">
        <Image
          src={project.thumbnailUrl}
          alt={`${project.title} thumbnail`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background/25"
        />
      </div>
    );
  }

  if (diagram) {
    return <ArchitectureDiagramPreview diagram={diagram} />;
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden border-b border-border/60 bg-muted/20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklch,var(--foreground)_6%,transparent),transparent_65%)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative flex flex-wrap justify-center gap-1.5 px-4">
        {project.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs backdrop-blur-sm">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

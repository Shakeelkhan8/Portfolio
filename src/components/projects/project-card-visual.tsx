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
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-muted">
        <Image
          src={project.thumbnailUrl}
          alt={`${project.title} thumbnail`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
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
      className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden border-b border-border bg-muted/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--accent-muted),transparent_65%)] opacity-70" />
      <div className="relative flex flex-wrap justify-center gap-1.5 px-4">
        {project.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

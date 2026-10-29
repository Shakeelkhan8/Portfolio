import Image from "next/image";
import type { Project } from "@/types";

type ProjectCardVisualProps = {
  project: Project;
};

/**
 * CMS thumbnail for a project card. Cards without one lead with their
 * headline result instead (see ProjectCard), so this renders nothing.
 */
export function ProjectCardVisual({ project }: ProjectCardVisualProps) {
  if (!project.thumbnailUrl) return null;

  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted sm:aspect-[16/9]">
      <Image
        src={project.thumbnailUrl}
        alt={`${project.title} thumbnail`}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-active:scale-[1.03]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-background/10 to-transparent"
      />
    </div>
  );
}

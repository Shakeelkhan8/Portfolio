import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { FadeIn } from "@/components/motion/fade-in";

type ProjectHeroProps = {
  project: Project;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <FadeIn className="space-y-6">
      {project.thumbnailUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-lg">
          <Image
            src={project.thumbnailUrl}
            alt={`${project.title} thumbnail`}
            fill
            priority
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-background/20"
          />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-muted/60">
            {tag}
          </Badge>
        ))}
      </div>
      <Heading as="h1" size="xl" className="text-foreground">
        {project.title}
      </Heading>
      <Text size="lg" muted leading="relaxed">
        {project.summary}
      </Text>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">Role:</span>{" "}
          {project.role}
        </span>
        <span>
          <span className="font-medium text-foreground">Context:</span>{" "}
          {project.context}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <Badge key={tech} variant="outline" className="border-border/80">
            {tech}
          </Badge>
        ))}
      </div>
    </FadeIn>
  );
}

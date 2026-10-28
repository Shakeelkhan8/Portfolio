import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/shared/button-link";

type ProjectHeroProps = {
  project: Project;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <FadeIn className="space-y-6">
      {project.thumbnailUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
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
      {project.links.length > 0 ? (
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          {project.links.map((link, index) => (
            <ButtonLink
              key={link.href}
              href={link.href}
              external
              size="lg"
              variant={index === 0 ? "default" : "outline"}
              className={index === 0 ? "group" : "group bg-transparent"}
            >
              {link.label}
              <ArrowUpRight
                aria-hidden="true"
                data-icon="inline-end"
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </ButtonLink>
          ))}
        </div>
      ) : null}
    </FadeIn>
  );
}

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routes } from "@/config/navigation";
import type { Project } from "@/types";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
      {project.thumbnailUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-muted">
          <Image
            src={project.thumbnailUrl}
            alt={`${project.title} thumbnail`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}
      <CardHeader>
        <div className="mb-2 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription className="leading-relaxed">
          {project.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Role:</span>{" "}
          {project.role}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
        <AppLink
          href={routes.project(project.slug)}
          showExternalIcon={false}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          Read case study
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </AppLink>
      </CardContent>
    </Card>
  );
}

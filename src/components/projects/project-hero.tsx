import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

type ProjectHeroProps = {
  project: Project;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <Heading as="h1" size="xl">
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
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}

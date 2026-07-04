import { ExternalLink, GitFork, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GitHubRepo } from "@/types";
import { Text } from "@/components/typography/text";

type RepoCardProps = {
  repo: GitHubRepo;
};

function formatUpdatedDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-primary"
            >
              {repo.name}
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
          </CardTitle>
        </div>
        {repo.description ? (
          <Text size="sm" muted leading="relaxed">
            {repo.description}
          </Text>
        ) : (
          <Text size="sm" muted>
            No description provided.
          </Text>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {repo.language ? (
            <Badge variant="secondary">{repo.language}</Badge>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5" />
            {repo.stargazersCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="size-3.5" />
            {repo.forksCount}
          </span>
          <span>Updated {formatUpdatedDate(repo.updatedAt)}</span>
        </div>
        {repo.topics.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 4).map((topic) => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

import { ExternalLink, GitFork, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GitHubRepo } from "@/types";
import { Text } from "@/components/typography/text";
import { Reveal } from "@/components/motion/reveal";

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
    <Reveal className="h-full">
      <article className="site-card flex h-full flex-col rounded-2xl p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-heading text-base font-semibold tracking-tight">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              {repo.name}
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
          </h3>
        </div>
        {repo.description ? (
          <Text size="sm" muted leading="relaxed" className="mb-4 flex-1">
            {repo.description}
          </Text>
        ) : (
          <Text size="sm" muted className="mb-4 flex-1">
            No description provided.
          </Text>
        )}
        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {repo.language ? (
              <Badge variant="secondary" className="bg-muted/60">
                {repo.language}
              </Badge>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5" />
              {repo.stargazersCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork className="size-3.5" />
              {repo.forksCount}
            </span>
            <span className="font-mono text-[11px]">
              Updated {formatUpdatedDate(repo.updatedAt)}
            </span>
          </div>
          {repo.topics.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.slice(0, 4).map((topic) => (
                <Badge key={topic} variant="outline" className="border-border/80">
                  {topic}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}

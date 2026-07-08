import Image from "next/image";
import { GitHubIcon } from "@/components/shared/brand-icons";
import { Card, CardContent } from "@/components/ui/card";
import type { GitHubProfile } from "@/types";

type GitHubStatsProps = {
  profile: GitHubProfile;
};

export function GitHubStats({ profile }: GitHubStatsProps) {
  const memberSince = new Date(profile.createdAt).getFullYear();

  const stats = [
    { label: "Public repos", value: profile.publicRepos },
    { label: "Followers", value: profile.followers },
    { label: "Following", value: profile.following },
    { label: "Member since", value: memberSince },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="pt-4">
            <p className="text-2xl font-semibold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type GitHubProfileCardProps = {
  profile: GitHubProfile;
};

export function GitHubProfileCard({ profile }: GitHubProfileCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
      <Image
        src={profile.avatarUrl}
        alt={`${profile.login} GitHub avatar`}
        width={80}
        height={80}
        className="size-20 rounded-full border border-border"
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <GitHubIcon className="size-4" />
          <a
            href={profile.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-primary"
          >
            @{profile.login}
          </a>
        </div>
        {profile.name ? (
          <p className="text-lg font-semibold">{profile.name}</p>
        ) : null}
        {profile.bio ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {profile.bio}
          </p>
        ) : null}
      </div>
    </div>
  );
}

type GitHubProfileFallbackProps = {
  username: string;
  githubUrl: string;
  liveStatsUnavailable?: boolean;
};

export function GitHubProfileFallback({
  username,
  githubUrl,
  liveStatsUnavailable = false,
}: GitHubProfileFallbackProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-1 flex items-center gap-2">
        <GitHubIcon className="size-4" />
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:text-primary"
        >
          @{username}
        </a>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {liveStatsUnavailable
          ? "Live GitHub stats are temporarily unavailable. Selected repositories are shown below, or view the full profile on GitHub."
          : "View public repositories and activity on GitHub."}
      </p>
    </div>
  );
}

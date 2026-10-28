import Image from "next/image";
import { GitHubIcon } from "@/components/shared/brand-icons";
import { Reveal } from "@/components/motion/reveal";
import type { GitHubProfile } from "@/types";

type GitHubProfileCardProps = {
  profile: GitHubProfile;
};

export function GitHubProfileCard({ profile }: GitHubProfileCardProps) {
  return (
    <Reveal>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Image
          src={profile.avatarUrl}
          alt={`${profile.login} GitHub avatar`}
          width={80}
          height={80}
          className="size-20 rounded-full"
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <GitHubIcon className="size-4" />
            <a
              href={profile.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-primary"
            >
              @{profile.login}
            </a>
          </div>
          {profile.name ? (
            <p className="font-heading text-lg font-semibold tracking-tight">
              {profile.name}
            </p>
          ) : null}
          {profile.bio ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
          ) : null}
        </div>
      </div>
    </Reveal>
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
    <Reveal>
      <div>
        <div className="mb-1 flex items-center gap-2">
          <GitHubIcon className="size-4" />
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-primary"
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
    </Reveal>
  );
}

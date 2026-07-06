import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/motion/fade-in";
import {
  GitHubProfileCard,
  GitHubStats,
} from "@/components/github/github-stats";
import { RepoCard } from "@/components/github/repo-card";
import { ButtonLink } from "@/components/shared/button-link";
import { routes } from "@/config/navigation";
import { getGitHubSettings, getSiteConfig } from "@/lib/content";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { getGitHubData } from "@/services/github";
import type { GitHubProfile, GitHubRepo } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Open Source",
    description: "Open source contributions and GitHub activity.",
    path: routes.openSource,
  });
}

export default async function OpenSourcePage() {
  const [site, githubSettings] = await Promise.all([
    getSiteConfig(),
    getGitHubSettings(),
  ]);

  let profile: GitHubProfile | null = null;
  let repos: GitHubRepo[] = [];

  if (githubSettings.showLiveStats) {
    try {
      const data = await getGitHubData(githubSettings.username);
      profile = data.profile;
      repos = data.repos;
    } catch {
      profile = null;
      repos = [];
    }
  }

  const githubUrl = site.links.github || `https://github.com/${githubSettings.username}`;

  return (
    <>
      <PageHeader
        title="Open Source"
        description="Selected repositories and public GitHub activity."
      />
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container>
          {profile ? (
            <FadeIn className="space-y-10">
              <GitHubProfileCard profile={profile} />
              <GitHubStats profile={profile} />
              <div className="grid gap-4 sm:grid-cols-2">
                {repos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </FadeIn>
          ) : (
            <EmptyState
              title="GitHub stats unavailable"
              description="Live GitHub data could not be loaded right now."
              action={
                <ButtonLink href={githubUrl} external>
                  View GitHub profile
                </ButtonLink>
              }
            />
          )}
        </Container>
      </Section>
    </>
  );
}

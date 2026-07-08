import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import {
  GitHubProfileCard,
  GitHubProfileFallback,
  GitHubStats,
} from "@/components/github/github-stats";
import { RepoCard } from "@/components/github/repo-card";
import { ButtonLink } from "@/components/shared/button-link";
import { Text } from "@/components/typography/text";
import { routes } from "@/config/navigation";
import { getCuratedRepos, getGitHubSettings, getSiteConfig } from "@/lib/content";
import { resolveOpenSourcePageData } from "@/lib/github/resolve-open-source";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Open Source",
    description: "Open source contributions and GitHub activity.",
    path: routes.openSource,
  });
}

export default async function OpenSourcePage() {
  const [site, githubSettings, curatedRepos] = await Promise.all([
    getSiteConfig(),
    getGitHubSettings(),
    getCuratedRepos(),
  ]);

  const { profile, repos, liveStatsUnavailable } =
    await resolveOpenSourcePageData(
      githubSettings.username,
      githubSettings.showLiveStats,
      curatedRepos,
    );

  const githubUrl =
    site.links.github || `https://github.com/${githubSettings.username}`;
  const hasContent = Boolean(profile) || repos.length > 0;

  return (
    <>
      <PageHeader
        title="Open Source"
        description="Selected repositories and public GitHub activity."
      />
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="space-y-10">
          {hasContent ? (
            <>
              {profile ? (
                <>
                  <GitHubProfileCard profile={profile} />
                  <GitHubStats profile={profile} />
                </>
              ) : (
                <GitHubProfileFallback
                  username={githubSettings.username}
                  githubUrl={githubUrl}
                  liveStatsUnavailable={liveStatsUnavailable}
                />
              )}

              {liveStatsUnavailable && profile ? (
                <Text size="sm" muted>
                  Repository details below may be limited while live GitHub data
                  is unavailable.
                </Text>
              ) : null}

              {repos.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {repos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No repositories selected"
                  description="Curated repositories will appear here once configured in the admin panel."
                  action={
                    <ButtonLink href={githubUrl} external>
                      Browse GitHub profile
                    </ButtonLink>
                  }
                />
              )}
            </>
          ) : (
            <EmptyState
              title="GitHub activity unavailable"
              description="Live GitHub data could not be loaded and no curated repositories are configured yet."
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

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
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/shared/app-link";
import { createMetadata } from "@/lib/metadata";
import { getGitHubData } from "@/services/github";
import { siteConfig } from "@/config/site";
import type { GitHubProfile, GitHubRepo } from "@/types";

export const metadata: Metadata = createMetadata({
  title: "Open Source",
  description: "Open source contributions and GitHub activity.",
  path: "/open-source",
});

async function loadGitHubData(): Promise<{
  profile: GitHubProfile;
  repos: GitHubRepo[];
} | null> {
  try {
    return await getGitHubData();
  } catch {
    return null;
  }
}

export default async function OpenSourcePage() {
  const data = await loadGitHubData();

  if (!data) {
    return (
      <>
        <PageHeader
          title="Open Source"
          description="Contributions and projects on GitHub."
        />
        <Section spacing="sm" className="border-t border-border pt-0">
          <Container>
            <EmptyState
              title="Unable to load GitHub data"
              description="GitHub API is temporarily unavailable or rate-limited. Visit the profile directly or try again later."
              action={
                <Button
                  render={
                    <AppLink
                      href={siteConfig.links.github}
                      external
                      showExternalIcon={false}
                    />
                  }
                >
                  View GitHub Profile
                </Button>
              }
            />
          </Container>
        </Section>
      </>
    );
  }

  const { profile, repos } = data;

  return (
    <>
      <PageHeader
        title="Open Source"
        description="Public repositories and GitHub activity."
      />
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="space-y-10">
          <FadeIn>
            <GitHubProfileCard profile={profile} />
          </FadeIn>
          <GitHubStats profile={profile} />
          <div>
            <h2 className="mb-6 text-lg font-semibold tracking-tight">
              Repositories
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {repos.map((repo, index) => (
                <FadeIn key={repo.id} delay={index * 0.05}>
                  <RepoCard repo={repo} />
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

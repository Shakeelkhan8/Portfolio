import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SocialLinks } from "@/components/shared/social-links";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/shared/app-link";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = createMetadata({
  title: "Open Source",
  description: "Open source contributions and GitHub activity.",
  path: "/open-source",
});

export default function OpenSourcePage() {
  return (
    <>
      <PageHeader
        title="Open Source"
        description="Contributions and projects on GitHub."
      />
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container>
          <EmptyState
            title="GitHub integration coming in Phase 4"
            description="Live GitHub stats, pinned repositories, and contribution activity will be pulled from your profile automatically."
            action={
              <div className="flex flex-col items-center gap-4">
                <SocialLinks />
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
              </div>
            }
          />
        </Container>
      </Section>
    </>
  );
}

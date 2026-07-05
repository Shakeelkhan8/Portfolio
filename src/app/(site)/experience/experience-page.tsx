import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { Timeline } from "@/components/experience/timeline";
import { getExperience } from "@/lib/content";
import { siteConfig } from "@/config/site";

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        title="Experience"
        description={`${siteConfig.yearsOfExperience}+ years building production systems across SaaS, enterprise, and freelance projects.`}
      />
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="max-w-3xl">
          <Timeline entries={getExperience()} />
        </Container>
      </Section>
    </>
  );
}

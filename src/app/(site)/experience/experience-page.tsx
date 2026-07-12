import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { Timeline } from "@/components/experience/timeline";
import { getExperience, getSiteConfig } from "@/lib/content";

export default async function ExperiencePage() {
  const [site, experience] = await Promise.all([
    getSiteConfig(),
    getExperience(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Experience"
        description={`${site.yearsOfExperience}+ years building production systems across SaaS, enterprise, and freelance projects.`}
      />
      <Section spacing="sm" className="pt-0">
        <Container className="max-w-3xl">
          <Timeline entries={experience} />
        </Container>
      </Section>
    </>
  );
}

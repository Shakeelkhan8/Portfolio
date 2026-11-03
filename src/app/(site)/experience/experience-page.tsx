import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { Timeline } from "@/components/experience/timeline";
import { getExperience } from "@/lib/content";

export default async function ExperiencePage() {
  const experience = await getExperience();

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Experience"
        description="Building for the web since 2021, and full-time with PHP and Laravel since 2022, across SaaS, enterprise and independent projects."
      />
      <Section spacing="sm" className="pt-0">
        <Container>
          <Timeline entries={experience} />
        </Container>
      </Section>
    </>
  );
}

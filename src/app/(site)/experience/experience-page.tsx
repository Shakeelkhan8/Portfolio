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
        title="Where I've worked"
        description={`${site.yearsOfExperience}+ years full-time across logistics SaaS, media and freelance work, after two internships.`}
      />
      <Section spacing="none" className="pb-16 sm:pb-24">
        <Container>
          <Timeline entries={experience} />
        </Container>
      </Section>
    </>
  );
}

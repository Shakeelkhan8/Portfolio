import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { ResumeView } from "@/components/resume/resume-view";
import { DownloadResumeButton } from "@/components/resume/download-resume-button";
import {
  getAchievements,
  getExperience,
  getPrimaryEducation,
  getResumeSummary,
  getSiteConfig,
  getSkillGroups,
} from "@/lib/content";

export default async function ResumePage() {
  const [site, resumeSummary, skillGroups, experience, education, achievements] =
    await Promise.all([
      getSiteConfig(),
      getResumeSummary(),
      getSkillGroups(),
      getExperience(),
      getPrimaryEducation(),
      getAchievements(),
    ]);

  return (
    <>
      <PageHeader title="Resume" description={site.title}>
        <div className="no-print mt-6">
          <DownloadResumeButton />
        </div>
      </PageHeader>
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="max-w-3xl">
          <ResumeView
            site={site}
            resumeSummary={resumeSummary}
            skillGroups={skillGroups}
            experience={experience}
            education={education}
            accomplishments={achievements.map((item) => ({ text: item.text }))}
          />
        </Container>
      </Section>
    </>
  );
}

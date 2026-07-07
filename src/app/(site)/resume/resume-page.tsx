import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { ResumeView } from "@/components/resume/resume-view";
import { DownloadResumeButton } from "@/components/resume/download-resume-button";
import { CertificationsSection } from "@/components/resume/certifications-section";
import {
  getAchievements,
  getActiveResumeVersion,
  getCertifications,
  getExperience,
  getPrimaryEducation,
  getResumeSummary,
  getSiteConfig,
  getSkillGroups,
} from "@/lib/content";

export default async function ResumePage() {
  const [
    site,
    resumeSummary,
    skillGroups,
    experience,
    education,
    achievements,
    certifications,
    activeResume,
  ] = await Promise.all([
    getSiteConfig(),
    getResumeSummary(),
    getSkillGroups(),
    getExperience(),
    getPrimaryEducation(),
    getAchievements(),
    getCertifications(),
    getActiveResumeVersion(),
  ]);

  return (
    <>
      <PageHeader title="Resume" description={site.title}>
        <div className="no-print mt-6">
          <DownloadResumeButton
            pdfUrl={activeResume?.fileUrl}
            fileName={activeResume?.fileName}
          />
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
          {certifications.length > 0 ? (
            <div className="mt-10 border-t border-border pt-10">
              <CertificationsSection certifications={certifications} />
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}

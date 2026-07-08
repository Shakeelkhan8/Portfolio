import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { ResumeView } from "@/components/resume/resume-view";
import { DownloadResumeButton } from "@/components/resume/download-resume-button";
import { CertificationsSection } from "@/components/resume/certifications-section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { routes } from "@/config/navigation";
import {
  formatDateRange,
  getAchievements,
  getActiveResumeVersion,
  getCertifications,
  getExperience,
  getFeaturedExperience,
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
    currentRole,
  ] = await Promise.all([
    getSiteConfig(),
    getResumeSummary(),
    getSkillGroups(),
    getExperience(),
    getPrimaryEducation(),
    getAchievements(),
    getCertifications(),
    getActiveResumeVersion(),
    getFeaturedExperience(),
  ]);

  return (
    <>
      <PageHeader
        title="Resume"
        description="One-page snapshot for hiring managers. Prefer the PDF for full detail."
      >
        <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <DownloadResumeButton
            pdfUrl={activeResume?.fileUrl}
            fileName={activeResume?.fileName}
          />
          <ButtonLink href={routes.experience} variant="outline" size="lg">
            View experience timeline
          </ButtonLink>
        </div>
      </PageHeader>

      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="max-w-3xl space-y-8">
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <Text size="sm" muted className="mb-2 uppercase tracking-widest">
              Summary
            </Text>
            <Text leading="relaxed">{resumeSummary}</Text>
          </div>

          {currentRole ? (
            <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
              <Text size="sm" muted className="mb-2 uppercase tracking-widest">
                Current role
              </Text>
              <Heading as="h2" size="md" balance={false} className="mb-1">
                {currentRole.role}
              </Heading>
              <Text className="mb-1 font-medium">{currentRole.company}</Text>
              <Text size="sm" muted className="mb-4">
                {formatDateRange(currentRole.startDate, currentRole.endDate)} ·{" "}
                {currentRole.location}
              </Text>
              {currentRole.highlights[0] ? (
                <Text size="sm" muted leading="relaxed">
                  {currentRole.highlights[0]}
                </Text>
              ) : null}
            </div>
          ) : null}

          <details className="group rounded-xl border border-border bg-muted/20 open:bg-surface">
            <summary className="no-print cursor-pointer list-none px-6 py-4 text-sm font-medium marker:content-none sm:px-8 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3">
                <span>View full web resume</span>
                <span className="text-muted-foreground transition-transform group-open:rotate-180">
                  ▾
                </span>
              </span>
            </summary>
            <div className="border-t border-border px-6 py-8 sm:px-8">
              <ResumeView
                site={site}
                resumeSummary={resumeSummary}
                skillGroups={skillGroups}
                experience={experience}
                education={education}
                accomplishments={achievements.map((item) => ({
                  text: item.text,
                }))}
              />
              {certifications.length > 0 ? (
                <div className="mt-10 border-t border-border pt-10">
                  <CertificationsSection certifications={certifications} />
                </div>
              ) : null}
            </div>
          </details>
        </Container>
      </Section>
    </>
  );
}

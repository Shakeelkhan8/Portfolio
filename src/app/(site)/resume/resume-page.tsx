import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { PortfolioQr } from "@/components/shared/portfolio-qr";
import { ResumeView } from "@/components/resume/resume-view";
import { DownloadResumeButton } from "@/components/resume/download-resume-button";
import { ExpandDetailsWhilePrinting } from "@/components/resume/expand-details-while-printing";
import { CertificationsSection } from "@/components/resume/certifications-section";
import { Reveal } from "@/components/motion/reveal";
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
  getPortfolioQr,
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
    portfolioQr,
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
    getPortfolioQr(),
  ]);

  return (
    <>
      <ExpandDetailsWhilePrinting />
      <PageHeader
        eyebrow="Resume"
        title="Resume"
        description="One-page snapshot for hiring managers. Prefer the PDF for full detail."
      >
        <div className="no-print flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <DownloadResumeButton
              pdfUrl={activeResume?.fileUrl}
              fileName={activeResume?.fileName}
            />
            <ButtonLink href={routes.experience} variant="outline" size="lg">
              View experience timeline
            </ButtonLink>
          </div>
          <PortfolioQr qr={portfolioQr} siteName={site.name} size={112} />
        </div>
      </PageHeader>

      <Section spacing="sm" className="pt-0">
        <Container className="max-w-3xl space-y-10">
          {/* The full resume below repeats these two, so they stay off paper. */}
          <Reveal className="no-print">
            <div>
              <Text
                size="sm"
                muted
                className="mb-2 font-mono text-[11px] tracking-[0.28em] uppercase"
              >
                Summary
              </Text>
              <Text leading="relaxed">{resumeSummary}</Text>
            </div>
          </Reveal>

          {currentRole ? (
            <Reveal delay={0.06} className="no-print">
              <div>
                <Text
                  size="sm"
                  muted
                  className="mb-2 font-mono text-[11px] tracking-[0.28em] uppercase"
                >
                  Current role
                </Text>
                <Heading as="h2" size="md" balance={false} className="mb-1">
                  {currentRole.role}
                </Heading>
                <Text className="mb-1 font-medium text-foreground/90">
                  {currentRole.company}
                </Text>
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
            </Reveal>
          ) : null}

          <Reveal delay={0.1}>
            <details className="group">
              <summary className="no-print cursor-pointer list-none py-1 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  <span>View full web resume</span>
                  <span className="text-muted-foreground transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </span>
              </summary>
              <div className="mt-6 pt-2">
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
                  <div className="mt-10 pt-2">
                    <CertificationsSection certifications={certifications} />
                  </div>
                ) : null}
              </div>
            </details>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

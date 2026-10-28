import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { PortfolioQr } from "@/components/shared/portfolio-qr";
import { ResumeView } from "@/components/resume/resume-view";
import { DownloadResumeButton } from "@/components/resume/download-resume-button";
import { CertificationsSection } from "@/components/resume/certifications-section";
import { ButtonLink } from "@/components/shared/button-link";
import { routes } from "@/config/navigation";
import {
  getAchievements,
  getActiveResumeVersion,
  getCertifications,
  getExperience,
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
    getPortfolioQr(),
  ]);

  return (
    <>
      <PageHeader
        title="Resume"
        description="Everything on one page. Download the PDF if you need a file for your applicant system."
      >
        <div className="no-print flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <DownloadResumeButton
              pdfUrl={activeResume?.fileUrl}
              fileName={activeResume?.fileName}
            />
            <ButtonLink
              href={routes.contact}
              variant="outline"
              size="lg"
              className="bg-transparent"
            >
              Get in touch
            </ButtonLink>
          </div>
          <PortfolioQr qr={portfolioQr} siteName={site.name} size={96} />
        </div>
      </PageHeader>

      <Container className="max-w-4xl py-12 sm:py-16">
        <ResumeView
          site={site}
          resumeSummary={resumeSummary}
          skillGroups={skillGroups}
          experience={experience}
          education={education}
          accomplishments={achievements.map((item) => ({ text: item.text }))}
        />
        {certifications.length > 0 ? (
          <div className="border-t border-border pt-8">
            <CertificationsSection certifications={certifications} />
          </div>
        ) : null}
      </Container>
    </>
  );
}

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { ResumeView } from "@/components/resume/resume-view";
import { DownloadResumeButton } from "@/components/resume/download-resume-button";

export default function ResumePage() {
  return (
    <>
      <PageHeader title="Resume" description="Senior Backend Engineer">
        <div className="no-print mt-6">
          <DownloadResumeButton />
        </div>
      </PageHeader>
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="max-w-3xl">
          <ResumeView />
        </Container>
      </Section>
    </>
  );
}

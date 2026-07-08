import { ArrowRight } from "lucide-react";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { AppLink } from "@/components/shared/app-link";
import { ProjectPreviewGrid } from "@/components/home/project-preview-grid";
import { ExperienceSnapshot } from "@/components/home/experience-snapshot";
import { ContactCTA } from "@/components/home/contact-cta";
import { getSectionHeader, getSiteConfig } from "@/lib/content";
import { routes } from "@/config/navigation";

export default async function Home() {
  const site = await getSiteConfig();
  const [projectsHeader, experienceHeader] = await Promise.all([
    getSectionHeader("home", "projects"),
    getSectionHeader("home", "experience"),
  ]);

  return (
    <>
      <Section
        spacing="none"
        className="relative isolate overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_35%,#000,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[420px] w-[720px] max-w-[95vw] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <Container>
          <FadeIn className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <AvailabilityBadge site={site} className="mb-8" />
            <Heading as="h1" size="hero" className="mb-5 text-gradient">
              {site.name}
            </Heading>
            <Text size="xl" className="mb-5 max-w-xl font-medium">
              {site.title}
            </Text>
            <Text size="lg" leading="relaxed" muted className="mb-10 max-w-2xl">
              {site.description}
            </Text>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href={routes.projects} size="lg" className="group">
                View Projects
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  data-icon="inline-end"
                />
              </ButtonLink>
              <ButtonLink href={routes.contact} variant="outline" size="lg">
                Get in Touch
              </ButtonLink>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary">
                {site.yearsOfExperience}+ years
              </Badge>
              <Badge variant="secondary">{site.location}</Badge>
              {site.expertise.slice(0, 3).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border bg-muted/30">
        <Container>
          <SectionHeader
            title={projectsHeader?.title ?? "Selected Projects"}
            description={
              projectsHeader?.description ??
              "Engineering case studies from production systems."
            }
            action={
              <AppLink
                href={routes.projects}
                showExternalIcon={false}
                className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary"
              >
                View all
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </AppLink>
            }
          />
          <ProjectPreviewGrid limit={2} />
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border">
        <Container>
          <SectionHeader title={experienceHeader?.title ?? "Experience"} />
          <ExperienceSnapshot />
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border bg-muted/30">
        <Container>
          <ContactCTA site={site} />
        </Container>
      </Section>
    </>
  );
}

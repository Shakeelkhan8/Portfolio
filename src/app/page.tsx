import { ArrowRight } from "lucide-react";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLink } from "@/components/shared/app-link";
import { ExpertiseGrid } from "@/components/home/expertise-grid";
import { ProjectPreviewGrid } from "@/components/home/project-preview-grid";
import { WritingPreviewList } from "@/components/home/writing-preview-list";
import { ExperienceSnapshot } from "@/components/home/experience-snapshot";
import { ContactCTA } from "@/components/home/contact-cta";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";

export default function Home() {
  return (
    <>
      <Section spacing="sm" className="pt-16 pb-20 md:pt-24 md:pb-28">
        <Container>
          <FadeIn className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <AvailabilityBadge className="mb-8" />
            <Heading as="h1" size="hero" className="mb-4">
              {siteConfig.name}
            </Heading>
            <Text size="xl" muted className="mb-6 max-w-xl">
              {siteConfig.title}
            </Text>
            <Text size="lg" leading="relaxed" muted className="mb-10 max-w-2xl">
              {siteConfig.description}
            </Text>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                render={
                  <AppLink href={routes.projects} showExternalIcon={false} />
                }
                size="lg"
              >
                View Projects
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={
                  <AppLink href={routes.contact} showExternalIcon={false} />
                }
              >
                Get in Touch
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary">
                {siteConfig.yearsOfExperience}+ years
              </Badge>
              <Badge variant="secondary">{siteConfig.location}</Badge>
              {siteConfig.expertise.slice(0, 3).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border">
        <Container>
          <SectionHeader
            title="Expertise"
            description="Areas where I deliver the most impact."
            align="center"
          />
          <ExpertiseGrid />
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border bg-muted/30">
        <Container>
          <SectionHeader
            title="Selected Projects"
            description="Engineering case studies from production systems."
            action={
              <AppLink
                href={routes.projects}
                showExternalIcon={false}
                className="text-sm font-medium text-primary"
              >
                View all
                <ArrowRight className="ml-1 inline size-4" />
              </AppLink>
            }
          />
          <ProjectPreviewGrid />
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border">
        <Container>
          <SectionHeader
            title="How I Think"
            description="Principles that guide my engineering decisions."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {siteConfig.philosophy.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <div className="rounded-xl border border-border bg-surface p-6">
                  <Text className="mb-2 font-medium">{item.title}</Text>
                  <Text size="sm" muted leading="relaxed">
                    {item.description}
                  </Text>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border bg-muted/30">
        <Container>
          <SectionHeader
            title="Latest Writing"
            action={
              <AppLink
                href={routes.writing}
                showExternalIcon={false}
                className="text-sm font-medium text-primary"
              >
                View all
                <ArrowRight className="ml-1 inline size-4" />
              </AppLink>
            }
          />
          <WritingPreviewList />
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border">
        <Container>
          <SectionHeader title="Experience" />
          <ExperienceSnapshot />
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border bg-muted/30">
        <Container>
          <ContactCTA />
        </Container>
      </Section>
    </>
  );
}

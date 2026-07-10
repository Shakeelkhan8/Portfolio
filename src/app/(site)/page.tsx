import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { AppLink } from "@/components/shared/app-link";
import { HomeHero } from "@/components/home/home-hero";
import { ExpertiseGrid } from "@/components/home/expertise-grid";
import { ProjectPreviewGrid } from "@/components/home/project-preview-grid";
import { WritingPreviewList } from "@/components/home/writing-preview-list";
import { ExperienceSnapshot } from "@/components/home/experience-snapshot";
import { ContactCTA } from "@/components/home/contact-cta";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import {
  getCtaSection,
  getFeaturedTestimonials,
  getSectionHeader,
  getServices,
  getSiteConfig,
} from "@/lib/content";
import { routes } from "@/config/navigation";

export default async function Home() {
  const site = await getSiteConfig();
  const [
    heroCta,
    expertiseHeader,
    projectsHeader,
    writingHeader,
    experienceHeader,
    servicesHeader,
    testimonialsHeader,
    services,
    testimonials,
  ] = await Promise.all([
    getCtaSection("home_hero"),
    getSectionHeader("home", "expertise"),
    getSectionHeader("home", "projects"),
    getSectionHeader("home", "writing"),
    getSectionHeader("home", "experience"),
    getSectionHeader("home", "services"),
    getSectionHeader("home", "testimonials"),
    getServices(),
    getFeaturedTestimonials(),
  ]);

  return (
    <>
      <Section
        spacing="none"
        className="relative isolate overflow-hidden pb-16 md:pb-20"
      >
        <Container className="relative">
          <HomeHero site={site} cta={heroCta} />

          <Reveal delay={0.15} className="mx-auto mt-2 max-w-3xl sm:mt-4 md:mt-8">
            <Stagger
              className="flex flex-wrap items-center justify-center gap-2 border-t border-border/40 pt-8 sm:gap-2.5 sm:pt-10"
              stagger={0.06}
            >
              <StaggerItem>
                <span className="inline-flex min-h-9 items-center rounded-full border border-border/70 bg-surface/60 px-3 py-1.5 font-mono text-[0.7rem] text-muted-foreground backdrop-blur-sm transition-colors duration-300 active:border-foreground/25 sm:px-3.5 sm:text-xs hover:border-foreground/25 hover:text-foreground">
                  {site.yearsOfExperience}+ years
                </span>
              </StaggerItem>
              {site.expertise.slice(0, 3).map((item) => (
                <StaggerItem key={item}>
                  <span className="inline-flex min-h-9 items-center rounded-full border border-border/70 bg-surface/40 px-3 py-1.5 text-[0.7rem] text-foreground/80 backdrop-blur-sm transition-colors duration-300 active:border-foreground/25 sm:px-3.5 sm:text-xs hover:border-foreground/25 hover:text-foreground">
                    {item}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="sm" className="relative border-t border-border/60">
        <Container>
          <SectionHeader
            title={expertiseHeader?.title ?? "Expertise"}
            description={
              expertiseHeader?.description ??
              "Areas where I deliver the most impact."
            }
            align="center"
          />
          <ExpertiseGrid site={site} />
        </Container>
      </Section>

      <Section spacing="sm" className="relative border-t border-border/60">
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
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View all
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </AppLink>
            }
          />
          <ProjectPreviewGrid limit={2} staggered />
        </Container>
      </Section>

      <Section spacing="sm" className="relative border-t border-border/60">
        <Container>
          <SectionHeader
            title={writingHeader?.title ?? "Latest Writing"}
            action={
              <AppLink
                href={routes.writing}
                showExternalIcon={false}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View all
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </AppLink>
            }
          />
          <WritingPreviewList />
        </Container>
      </Section>

      <Section spacing="sm" className="relative border-t border-border/60">
        <Container>
          <SectionHeader title={experienceHeader?.title ?? "Experience"} />
          <ExperienceSnapshot />
        </Container>
      </Section>

      {services.length > 0 ? (
        <Section spacing="sm" className="relative border-t border-border/60">
          <Container>
            <SectionHeader
              title={servicesHeader?.title ?? "Services"}
              description={
                servicesHeader?.description ??
                "Ways I can help your team ship reliable software."
              }
              align="center"
            />
            <ServicesSection services={services} />
          </Container>
        </Section>
      ) : null}

      {testimonials.length > 0 ? (
        <Section spacing="sm" className="relative border-t border-border/60">
          <Container>
            <SectionHeader
              title={testimonialsHeader?.title ?? "Testimonials"}
              description={
                testimonialsHeader?.description ??
                "What colleagues and clients say about working together."
              }
              align="center"
            />
            <TestimonialsSection testimonials={testimonials} />
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm" className="relative border-t border-border/60">
        <Container>
          <ContactCTA site={site} />
        </Container>
      </Section>
    </>
  );
}

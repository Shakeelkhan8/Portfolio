import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { AppLink } from "@/components/shared/app-link";
import { HomeHero } from "@/components/home/home-hero";
import { PrinciplesGrid } from "@/components/home/principles-grid";
import { ProjectPreviewGrid } from "@/components/home/project-preview-grid";
import { SideProjectCard } from "@/components/home/side-project-card";
import { WritingPreviewList } from "@/components/home/writing-preview-list";
import { ExperienceSnapshot } from "@/components/home/experience-snapshot";
import { ContactCTA } from "@/components/home/contact-cta";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import {
  getCtaSection,
  getExperience,
  getFeaturedTestimonials,
  getProjects,
  getSectionHeader,
  getServices,
  getSiteConfig,
} from "@/lib/content";
import { isSideProject } from "@/lib/projects";
import { routes } from "@/config/navigation";

function ViewAllLink({
  href,
  label = "View all",
}: {
  href: string;
  label?: string;
}) {
  return (
    <AppLink
      href={href}
      showExternalIcon={false}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </AppLink>
  );
}

export default async function Home() {
  const site = await getSiteConfig();
  const [
    heroCta,
    principlesHeader,
    projectsHeader,
    sideProjectsHeader,
    writingHeader,
    experienceHeader,
    servicesHeader,
    testimonialsHeader,
    services,
    testimonials,
    projects,
    experience,
  ] = await Promise.all([
    getCtaSection("home_hero"),
    getSectionHeader("home", "philosophy"),
    getSectionHeader("home", "projects"),
    getSectionHeader("home", "side_projects"),
    getSectionHeader("home", "writing"),
    getSectionHeader("home", "experience"),
    getSectionHeader("home", "services"),
    getSectionHeader("home", "testimonials"),
    getServices(),
    getFeaturedTestimonials(),
    getProjects(),
    getExperience(),
  ]);
  const sideProjects = projects.filter(isSideProject);

  return (
    <>
      <Section
        spacing="none"
        className="relative isolate max-w-full overflow-x-clip pb-12 sm:pb-16 md:pb-20"
      >
        <HomeHero site={site} cta={heroCta} />

        <Container className="relative">
          <Reveal
            delay={0.15}
            className="mx-auto mt-2 max-w-3xl sm:mt-4 md:mt-8"
          >
            <Stagger
              className="flex flex-wrap items-center justify-center gap-2 pt-8 sm:gap-2.5 sm:pt-10"
              stagger={0.06}
            >
              <StaggerItem>
                <span className="inline-flex min-h-9 items-center rounded-full bg-foreground/[0.05] px-3 py-1.5 font-mono text-[0.7rem] text-muted-foreground transition-colors duration-300 active:bg-foreground/[0.08] sm:px-3.5 sm:text-xs hover:bg-foreground/[0.08] hover:text-foreground">
                  {site.yearsOfExperience}+ years
                </span>
              </StaggerItem>
              {site.expertise.slice(0, 3).map((item) => (
                <StaggerItem key={item}>
                  <span className="inline-flex min-h-9 max-w-full items-center rounded-full bg-foreground/[0.04] px-3 py-1.5 text-[0.7rem] text-foreground/80 transition-colors duration-300 active:bg-foreground/[0.08] sm:px-3.5 sm:text-xs hover:bg-foreground/[0.08] hover:text-foreground">
                    {item}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader
            title={principlesHeader?.title ?? "How I work"}
            description={
              principlesHeader?.description ??
              "Rules I hold myself to on every system I build."
            }
          />
          <PrinciplesGrid principles={site.philosophy} />
        </Container>
      </Section>

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader
            title={projectsHeader?.title ?? "Selected Projects"}
            description={
              projectsHeader?.description ??
              "Engineering case studies from production systems."
            }
            action={<ViewAllLink href={routes.projects} />}
          />
          <ProjectPreviewGrid limit={2} staggered />
        </Container>
      </Section>

      {sideProjects.length > 0 ? (
        <Section spacing="sm" className="relative">
          <Container>
            <SectionHeader
              title={sideProjectsHeader?.title ?? "Side projects"}
              description={
                sideProjectsHeader?.description ??
                "Things I build in my own time, mostly to solve problems I have."
              }
            />
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
              {sideProjects.map((project, index) => (
                <SideProjectCard
                  key={project.slug}
                  project={project}
                  delay={(index % 2) * 0.06}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader
            title={writingHeader?.title ?? "Latest Writing"}
            action={<ViewAllLink href={routes.writing} />}
          />
          <WritingPreviewList />
        </Container>
      </Section>

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader title={experienceHeader?.title ?? "Experience"} />
          <ExperienceSnapshot experience={experience} />
        </Container>
      </Section>

      {services.length > 0 ? (
        <Section spacing="sm" className="relative">
          <Container>
            <SectionHeader
              title={servicesHeader?.title ?? "Working together"}
              description={
                servicesHeader?.description ??
                "Project work I take on alongside my main role."
              }
            />
            <ServicesSection services={services} />
          </Container>
        </Section>
      ) : null}

      {testimonials.length > 0 ? (
        <Section spacing="sm" className="relative">
          <Container>
            <SectionHeader
              title={testimonialsHeader?.title ?? "Testimonials"}
              description={
                testimonialsHeader?.description ??
                "What colleagues and clients say about working together."
              }
            />
            <TestimonialsSection testimonials={testimonials} />
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm" className="relative">
        <Container>
          <ContactCTA site={site} />
        </Container>
      </Section>
    </>
  );
}

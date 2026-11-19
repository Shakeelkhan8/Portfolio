import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { AppLink } from "@/components/shared/app-link";
import { HomeHero } from "@/components/home/home-hero";
import { ImpactSection } from "@/components/home/impact-section";
import { ServicesTeaser } from "@/components/home/services-teaser";
import { AiSection } from "@/components/home/ai-section";
import { impact } from "@/content/impact";
import { heroStats } from "@/content/home-about";
import { AboutSnapshot } from "@/components/home/about-snapshot";
import { LivePlatformsGrid } from "@/components/home/live-platforms-grid";
import { StackSection } from "@/components/home/stack-section";
import { livePlatforms } from "@/content/live-platforms";
import { services as catalogServices } from "@/content/service-catalog";
import { PrinciplesGrid } from "@/components/home/principles-grid";
import { ProjectPreviewGrid } from "@/components/home/project-preview-grid";
import { SideProjectCard } from "@/components/home/side-project-card";
import { WritingPreviewList } from "@/components/home/writing-preview-list";
import { ExperienceSnapshot } from "@/components/home/experience-snapshot";
import { ContactCTA } from "@/components/home/contact-cta";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import {
  getActiveResumeVersion,
  getArticles,
  getCtaSection,
  getExperience,
  getFeaturedTestimonials,
  getPrimaryEducation,
  getProjects,
  getSectionHeader,
  getSkillGroups,
  getServices,
  getSiteConfig,
} from "@/lib/content";
import { isSideProject } from "@/lib/projects";
import { toPublicSiteConfig } from "@/lib/public-site";
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

const MIN_ARTICLES_FOR_HOME = 4;

export default async function Home() {
  // HomeHero and ContactCTA are client components: their props reach the HTML.
  const site = toPublicSiteConfig(await getSiteConfig());
  const [
    heroCta,
    principlesHeader,
    projectsHeader,
    sideProjectsHeader,
    writingHeader,
    experienceHeader,
    testimonialsHeader,
    services,
    testimonials,
    projects,
    experience,
    articles,
    activeResume,
    education,
    skillGroups,
  ] = await Promise.all([
    getCtaSection("home_hero"),
    getSectionHeader("home", "philosophy"),
    getSectionHeader("home", "projects"),
    getSectionHeader("home", "side_projects"),
    getSectionHeader("home", "writing"),
    getSectionHeader("home", "experience"),
    getSectionHeader("home", "testimonials"),
    getServices(),
    getFeaturedTestimonials(),
    getProjects(),
    getExperience(),
    getArticles(),
    getActiveResumeVersion(),
    getPrimaryEducation(),
    getSkillGroups(),
  ]);
  const sideProjects = projects.filter(isSideProject);
  // A writing section with one or two short posts reads as unfinished, so it
  // stays off the home page (and out of the default nav) until there are more.
  const showWriting = articles.length >= MIN_ARTICLES_FOR_HOME;

  return (
    <>
      <Section
        spacing="none"
        className="relative isolate max-w-full overflow-x-clip pb-12 sm:pb-16 md:pb-20"
      >
        <HomeHero
          site={site}
          cta={heroCta}
          stats={heroStats}
          resumeUrl={activeResume?.fileUrl ?? null}
        />
      </Section>

      <Section spacing="sm" className="relative" id="about">
        <Container>
          <AboutSnapshot education={education} />
        </Container>
      </Section>

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader
            title="Impact"
            description="What the work changed, in numbers I can back up."
          />
          <ImpactSection items={impact} />
        </Container>
      </Section>

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader
            title={projectsHeader?.title ?? "Case studies"}
            description={
              projectsHeader?.description ??
              "Live systems I've built and run: what the problem was, what I decided, and what it cost."
            }
            action={<ViewAllLink href={routes.projects} />}
          />
          <ProjectPreviewGrid limit={2} staggered />
        </Container>
      </Section>

      <Section spacing="sm" className="relative" id="live-platforms">
        <Container>
          <SectionHeader
            title="Live platforms"
            description="Production websites I've worked on, and my part in each."
          />
          <LivePlatformsGrid items={livePlatforms} />
        </Container>
      </Section>

      {skillGroups.length > 0 ? (
        <Section spacing="sm" className="relative" id="tech-stack">
          <Container>
            <SectionHeader
              title="Tech stack"
              description="What I build with, across web, mobile, data, security and delivery."
            />
            <StackSection groups={skillGroups} />
          </Container>
        </Section>
      ) : null}

      {testimonials.length > 0 ? (
        <Section spacing="sm" className="relative">
          <Container>
            {/*
              The statement follows the count, not the CMS: "Trusted by people
              I've worked with" over a single quote would overstate it. With
              one, it speaks for one client; from two, it switches.
            */}
            <SectionHeader
              title={testimonialsHeader?.title ?? "Testimonials"}
              description={
                testimonials.length >= 2
                  ? "Trusted by people I've worked with."
                  : "In a client's words."
              }
            />
            <TestimonialsSection
              testimonials={testimonials}
              upworkUrl={site.links.upwork}
            />
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader
            title="Services"
            description="What you can hire me for, from a $60 fix to a monthly care plan."
            action={<ViewAllLink href={routes.services} label="Prices and packages" />}
          />
          <ServicesTeaser services={catalogServices} />
        </Container>
      </Section>

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader
            title="AI integration"
            description="Practical AI integrations for real business applications."
          />
          <AiSection />
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
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sideProjects.map((project, index) => (
                <SideProjectCard
                  key={project.slug}
                  project={project}
                  delay={(index % 3) * 0.06}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

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

      {showWriting ? (
        <Section spacing="sm" className="relative">
          <Container>
            <SectionHeader
              title={writingHeader?.title ?? "Latest Writing"}
              action={<ViewAllLink href={routes.writing} />}
            />
            <WritingPreviewList />
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm" className="relative">
        <Container>
          <SectionHeader
            title={experienceHeader?.title ?? "Experience"}
            description={
              experienceHeader?.description ??
              "What I'm doing now, and what came before."
            }
          />
          <ExperienceSnapshot experience={experience} />
        </Container>
      </Section>

      <Section spacing="sm" className="relative">
        <Container>
          <ContactCTA site={site} services={services} />
        </Container>
      </Section>
    </>
  );
}

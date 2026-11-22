import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { AppLink } from "@/components/shared/app-link";
import { HomeHero } from "@/components/home/home-hero";
import { ImpactSection } from "@/components/home/impact-section";
import { AiSection } from "@/components/home/ai-section";
import { impact } from "@/content/impact";
import { heroStats } from "@/content/home-about";
import { AboutSnapshot } from "@/components/home/about-snapshot";
import { StackSection } from "@/components/home/stack-section";
import { withTechIcons } from "@/lib/tech-icons";
import { WorkSection } from "@/components/home/work-section";
import { WritingPreviewList } from "@/components/home/writing-preview-list";
import { ExperienceSnapshot } from "@/components/home/experience-snapshot";
import { ContactSection } from "@/components/home/contact-section";
import {
  getActiveResumeVersion,
  getArchitectureDiagramsBySlugs,
  getArticles,
  getCtaSection,
  getExperience,
  getPrimaryEducation,
  getProjects,
  getSectionHeader,
  getSkillGroups,
  getSiteConfig,
} from "@/lib/content";
import { toPublicSiteConfig } from "@/lib/public-site";
import { getWhatsAppHref } from "@/lib/contact/whatsapp";
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
  // HomeHero and ContactSection's form are client components: their props reach the HTML.
  const rawSite = await getSiteConfig();
  const site = toPublicSiteConfig(rawSite);
  // Only the wa.me link reaches the page; the phone field itself stays private.
  const whatsappHref = getWhatsAppHref(rawSite.phone);
  const [
    heroCta,
    writingHeader,
    experienceHeader,
    projects,
    experience,
    articles,
    activeResume,
    education,
    skillGroups,
  ] = await Promise.all([
    getCtaSection("home_hero"),
    getSectionHeader("home", "writing"),
    getSectionHeader("home", "experience"),
    getProjects(),
    getExperience(),
    getArticles(),
    getActiveResumeVersion(),
    getPrimaryEducation(),
    getSkillGroups(),
  ]);
  const diagrams = await getArchitectureDiagramsBySlugs(
    projects.map((project) => project.slug),
  );
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

      {/*
        Seven sections in a fixed order, each an anchor for the home nav
        (src/components/navigation/home-section-nav.tsx): About, Experience,
        Tech stack, Work, Writing (once there are enough posts), Contact.
        Testimonials and "How I work" live on /about (2026-11-22).
      */}
      <Section spacing="sm" className="relative" id="about">
        <Container>
          <AboutSnapshot education={education} />
          <div className="mt-16 sm:mt-20">
            <SectionHeader
              title="Impact"
              description="What the work changed, in numbers I can back up."
            />
            <ImpactSection items={impact} />
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="relative" id="experience">
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

      {skillGroups.length > 0 ? (
        <Section spacing="sm" className="relative" id="tech-stack">
          <Container>
            <SectionHeader
              title="Tech stack"
              description="What I build with, across web, mobile, data, security and delivery."
            />
            <StackSection groups={withTechIcons(skillGroups)} />
          </Container>
        </Section>
      ) : null}

      <div id="work">
        {/*
          Fixed copy, not the Admin "projects" header: the section was
          rebuilt around featured rows (src/components/home/work-section.tsx).
        */}
        <Section spacing="sm" className="relative">
          <Container>
            <SectionHeader
              title="Work"
              description="What I've built, what was hard about it, and how I solved it."
            />
            <WorkSection projects={projects} diagrams={diagrams} />
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
      </div>

      {showWriting ? (
        <Section spacing="sm" className="relative" id="writing">
          <Container>
            <SectionHeader
              title={writingHeader?.title ?? "Latest Writing"}
              action={<ViewAllLink href={routes.writing} />}
            />
            <WritingPreviewList />
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm" className="relative" id="contact">
        <Container>
          <ContactSection
            site={site}
            whatsappHref={whatsappHref}
            resumeUrl={activeResume?.fileUrl ?? null}
          />
        </Container>
      </Section>
    </>
  );
}

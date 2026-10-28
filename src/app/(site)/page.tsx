import { ContentSection } from "@/components/layout/content-section";
import { ArrowLink } from "@/components/shared/arrow-link";
import { HomeHero } from "@/components/home/home-hero";
import { ExperienceSnapshot } from "@/components/home/experience-snapshot";
import { ContactCTA } from "@/components/home/contact-cta";
import { SideProjects } from "@/components/home/side-projects";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { DecisionHighlight } from "@/components/about/decision-highlight";
import { WorkRow } from "@/components/projects/work-row";
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

export default async function Home() {
  const [
    site,
    heroCta,
    projects,
    experience,
    projectsHeader,
    decisionsHeader,
    sideProjectsHeader,
    experienceHeader,
    servicesHeader,
    testimonialsHeader,
    services,
    testimonials,
  ] = await Promise.all([
    getSiteConfig(),
    getCtaSection("home_hero"),
    getProjects(),
    getExperience(),
    getSectionHeader("home", "projects"),
    getSectionHeader("home", "philosophy"),
    getSectionHeader("home", "side_projects"),
    getSectionHeader("home", "experience"),
    getSectionHeader("home", "services"),
    getSectionHeader("home", "testimonials"),
    getServices(),
    getFeaturedTestimonials(),
  ]);

  const selectedWork = projects.filter(
    (project) => project.featured && !isSideProject(project),
  );
  const sideProjects = projects.filter(isSideProject);
  const currentRole =
    experience.find((entry) => entry.featured) ?? experience[0];

  return (
    <>
      <HomeHero site={site} cta={heroCta} currentRole={currentRole} />

      {selectedWork.length > 0 ? (
        <ContentSection
          id="work"
          title={projectsHeader?.title ?? "Selected work"}
          description={projectsHeader?.description}
          action={<ArrowLink href={routes.projects}>All projects</ArrowLink>}
        >
          <div>
            {selectedWork.map((project) => (
              <WorkRow key={project.slug} project={project} />
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ContentSection
        id="decisions"
        title={decisionsHeader?.title ?? "How I make decisions"}
        description={decisionsHeader?.description}
      >
        <DecisionHighlight projects={projects} />
      </ContentSection>

      {sideProjects.length > 0 ? (
        <ContentSection
          id="side-projects"
          title={sideProjectsHeader?.title ?? "Side projects"}
          description={sideProjectsHeader?.description}
        >
          <SideProjects projects={sideProjects} />
        </ContentSection>
      ) : null}

      <ContentSection
        id="experience"
        title={experienceHeader?.title ?? "Experience"}
        description={experienceHeader?.description}
      >
        <ExperienceSnapshot experience={experience} />
      </ContentSection>

      {testimonials.length > 0 ? (
        <ContentSection
          id="testimonials"
          title={testimonialsHeader?.title ?? "What people say"}
          description={testimonialsHeader?.description}
        >
          <TestimonialsSection testimonials={testimonials} />
        </ContentSection>
      ) : null}

      <ContentSection
        id="contact"
        title={servicesHeader?.title ?? "Working together"}
        description={servicesHeader?.description}
      >
        <ContactCTA site={site} services={services} />
      </ContentSection>
    </>
  );
}

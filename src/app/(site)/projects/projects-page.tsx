import { Container } from "@/components/layout/container";
import { ContentSection } from "@/components/layout/content-section";
import { PageHeader } from "@/components/shared/page-header";
import { SideProjects } from "@/components/home/side-projects";
import { WorkRow } from "@/components/projects/work-row";
import { getProjects } from "@/lib/content";
import { isSideProject } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const work = projects.filter((project) => !isSideProject(project));
  const sideProjects = projects.filter(isSideProject);

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Projects and case studies"
        description="Systems I've built for employers and clients, plus the side projects I run on my own. Each write-up covers the problem, the architecture, the decisions and what they cost."
      />

      {work.length > 0 ? (
        <Container className="py-14 sm:py-20">
          <div className="max-w-4xl">
            {work.map((project) => (
              <WorkRow key={project.slug} project={project} as="h2" />
            ))}
          </div>
        </Container>
      ) : null}

      {sideProjects.length > 0 ? (
        <ContentSection
          id="side-projects"
          title="Side projects"
          description="Things I build in my own time, mostly to solve problems I have. Open-source ones link to their code."
        >
          <SideProjects projects={sideProjects} />
        </ContentSection>
      ) : null}
    </>
  );
}

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectList } from "@/components/projects/project-list";
import {
  getArchitectureDiagramsBySlugs,
  getProjects,
} from "@/lib/content";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const diagrams = await getArchitectureDiagramsBySlugs(
    projects.map((project) => project.slug),
  );

  return (
    <>
      <PageHeader
        title="Projects"
        heading="Systems I've built and run."
        description="For employers and clients, plus a few side projects. Each write-up covers the problem, the decisions and what they cost."
      />
      <Section spacing="sm" className="pt-0">
        <Container>
          <ProjectList projects={projects} diagrams={diagrams} />
        </Container>
      </Section>
    </>
  );
}

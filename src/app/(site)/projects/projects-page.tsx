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
        description="Engineering case studies from production systems. Not demos, but real operational software."
      />
      <Section spacing="sm" className="border-t border-border/60 pt-0">
        <Container>
          <ProjectList projects={projects} diagrams={diagrams} />
        </Container>
      </Section>
    </>
  );
}

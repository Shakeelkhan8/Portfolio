import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectList } from "@/components/projects/project-list";
import { getProjects } from "@/lib/content";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHeader
        title="Projects"
        description="Engineering case studies from production systems — not demos, but real operational software."
      />
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container>
          <ProjectList projects={projects} />
        </Container>
      </Section>
    </>
  );
}

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { FadeIn } from "@/components/motion/fade-in";
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
          <div className="grid gap-6">
            {projects.map((project, index) => (
              <FadeIn key={project.slug} delay={index * 0.05}>
                <ProjectCard project={project} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

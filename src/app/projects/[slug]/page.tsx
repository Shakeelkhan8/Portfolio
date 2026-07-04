import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProjectHero } from "@/components/projects/project-hero";
import { ProjectSection } from "@/components/projects/project-section";
import { MetricGrid } from "@/components/projects/metric-grid";
import { FadeIn } from "@/components/motion/fade-in";
import { JsonLd } from "@/components/seo/json-ld";
import { ArchitectureDiagram } from "@/components/architecture/architecture-diagram";
import { getArchitectureDiagram } from "@/content/architecture";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import {
  getBreadcrumbSchema,
  getProjectSchema,
} from "@/lib/structured-data";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  return createMetadata({
    title: project.title,
    description: project.summary,
    path: routes.project(slug),
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const diagram = getArchitectureDiagram(slug);
  const projectUrl = `${siteConfig.url}${routes.project(slug)}`;

  const structuredData = [
    getProjectSchema(project),
    getBreadcrumbSchema([
      { name: "Home", url: siteConfig.url },
      { name: "Projects", url: `${siteConfig.url}${routes.projects}` },
      { name: project.title, url: projectUrl },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Section spacing="sm" className="pt-16 pb-8 md:pt-20">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Projects", href: routes.projects },
              { label: project.title },
            ]}
          />
          <FadeIn>
            <ProjectHero project={project} />
          </FadeIn>
        </Container>
      </Section>

      {project.metrics.length > 0 ? (
        <Section spacing="none" className="pb-12">
          <Container>
            <MetricGrid metrics={project.metrics} />
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm" className="border-t border-border">
        <Container className="max-w-3xl space-y-12">
          <FadeIn>
            <ProjectSection id="overview" title="Overview">
              <p>{project.overview}</p>
            </ProjectSection>
          </FadeIn>

          <FadeIn>
            <ProjectSection id="problem" title="Problem">
              <p>{project.problem}</p>
            </ProjectSection>
          </FadeIn>

          <FadeIn>
            <ProjectSection id="role" title="My Role">
              <p>{project.role}</p>
            </ProjectSection>
          </FadeIn>

          <FadeIn>
            <ProjectSection id="challenges" title="Technical Challenges">
              <ul className="list-disc space-y-2 pl-5">
                {project.challenges.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </ProjectSection>
          </FadeIn>

          <FadeIn>
            <ProjectSection id="architecture" title="Architecture">
              <p>{project.architecture}</p>
              {diagram ? (
                <div className="mt-6 not-prose">
                  <ArchitectureDiagram diagram={diagram} />
                </div>
              ) : null}
            </ProjectSection>
          </FadeIn>

          <FadeIn>
            <ProjectSection id="decisions" title="Engineering Decisions">
              <div className="space-y-6">
                {project.decisions.map((decision) => (
                  <div
                    key={decision.decision.slice(0, 40)}
                    className="rounded-lg border border-border p-5"
                  >
                    <p className="font-medium text-foreground">
                      {decision.decision}
                    </p>
                    <p className="mt-2">{decision.rationale}</p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium text-foreground">
                        Trade-off:
                      </span>{" "}
                      {decision.tradeoff}
                    </p>
                  </div>
                ))}
              </div>
            </ProjectSection>
          </FadeIn>

          <FadeIn>
            <ProjectSection id="results" title="Results">
              <ul className="list-disc space-y-2 pl-5">
                {project.results.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </ProjectSection>
          </FadeIn>

          <FadeIn>
            <ProjectSection id="lessons" title="Lessons Learned">
              <ul className="list-disc space-y-2 pl-5">
                {project.lessons.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </ProjectSection>
          </FadeIn>

          {project.futureImprovements?.length ? (
            <FadeIn>
              <ProjectSection id="future" title="Future Improvements">
                <ul className="list-disc space-y-2 pl-5">
                  {project.futureImprovements.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              </ProjectSection>
            </FadeIn>
          ) : null}
        </Container>
      </Section>
    </>
  );
}

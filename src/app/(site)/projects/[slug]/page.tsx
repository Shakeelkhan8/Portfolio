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
import { BuildSummary } from "@/components/projects/build-summary";
import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import {
  getArchitectureDiagram,
  getProjectDetailBySlug,
  getProjectSlugs,
  getProjects,
} from "@/lib/content";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { getBreadcrumbSchema, getProjectSchema } from "@/lib/structured-data";
import { routes } from "@/config/navigation";
import { getSiteConfig } from "@/lib/db/queries/site";
import type { EngineeringDecision } from "@/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [ctx, project] = await Promise.all([
    getMetadataContext(),
    getProjectDetailBySlug(slug),
  ]);

  if (!project) return {};

  return buildPageMetadata(ctx, {
    title: project.metaTitle ?? project.title,
    description: project.metaDescription ?? project.summary,
    path: routes.project(slug),
    ogImage: project.ogImageUrl,
    canonicalUrl: project.canonicalUrl,
    robots: project.robots,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, site, allProjects] = await Promise.all([
    getProjectDetailBySlug(slug),
    getSiteConfig(),
    getProjects(),
  ]);

  if (!project) notFound();

  const diagram = await getArchitectureDiagram(slug);
  const currentIndex = allProjects.findIndex((item) => item.slug === slug);
  const nextProject =
    allProjects.length > 1 && currentIndex !== -1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : undefined;
  const projectUrl = `${site.url}${routes.project(slug)}`;

  const structuredData = [
    getProjectSchema(site, project),
    getBreadcrumbSchema([
      { name: "Home", url: site.url },
      { name: "Projects", url: `${site.url}${routes.projects}` },
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
          <ProjectHero project={project} />
        </Container>
      </Section>

      {project.metrics.length > 0 ? (
        <Section spacing="none" className="pb-12">
          <Container className="max-w-3xl">
            <MetricGrid metrics={project.metrics} />
          </Container>
        </Section>
      ) : null}

      <Section spacing="sm">
        <Container className="max-w-3xl space-y-12">
          {diagram ? <BuildSummary diagram={diagram} /> : null}

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

          {project.challenges.length > 0 ? (
            <FadeIn>
              <ProjectSection id="challenges" title="Technical Challenges">
                <BulletList items={project.challenges} />
              </ProjectSection>
            </FadeIn>
          ) : null}

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

          {project.decisions.length > 0 ? (
            <FadeIn>
              <ProjectSection id="decisions" title="Engineering Decisions">
                <div className="space-y-4">
                  {project.decisions.map((decision, index) => (
                    <DecisionCard
                      key={decision.decision.slice(0, 40)}
                      index={index}
                      decision={decision}
                    />
                  ))}
                </div>
              </ProjectSection>
            </FadeIn>
          ) : null}

          {project.results.length > 0 ? (
            <FadeIn>
              <ProjectSection id="results" title="Results">
                <BulletList items={project.results} />
              </ProjectSection>
            </FadeIn>
          ) : null}

          {project.lessons.length > 0 ? (
            <FadeIn>
              <ProjectSection id="lessons" title="Lessons Learned">
                <BulletList items={project.lessons} />
              </ProjectSection>
            </FadeIn>
          ) : null}

          {project.futureImprovements?.length ? (
            <FadeIn>
              <ProjectSection id="future" title="Future Improvements">
                <BulletList items={project.futureImprovements} />
              </ProjectSection>
            </FadeIn>
          ) : null}
        </Container>
      </Section>

      {nextProject && nextProject.slug !== slug ? (
        <Section spacing="none" className="pb-16 sm:pb-20">
          <Container className="max-w-3xl">
            <AppLink
              href={routes.project(nextProject.slug)}
              showExternalIcon={false}
              className="site-card group flex items-center justify-between gap-4 rounded-2xl p-5 sm:p-6"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Next project
                </span>
                <span className="mt-1.5 block truncate font-heading text-lg font-semibold tracking-tight text-foreground">
                  {nextProject.title}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-foreground/[0.04] transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <ArrowRight className="size-4" />
              </span>
            </AppLink>
          </Container>
        </Section>
      ) : null}
    </>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li
          key={item.slice(0, 40)}
          className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:size-1.5 before:rounded-full before:bg-muted-foreground/50"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function DecisionCard({
  decision,
  index,
}: {
  decision: EngineeringDecision;
  index: number;
}) {
  return (
    <article className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-5 sm:p-6">
      <p className="mb-3 font-mono text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        Decision {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="font-heading text-[1.0625rem] font-semibold leading-snug tracking-tight text-pretty text-foreground">
        {decision.decision}
      </h3>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="rounded-xl bg-foreground/[0.035] px-4 py-3.5">
          <dt className="mb-1.5 font-mono text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Why
          </dt>
          <dd className="text-sm leading-relaxed text-pretty text-foreground/80">
            {decision.rationale}
          </dd>
        </div>
        <div className="rounded-xl bg-foreground/[0.035] px-4 py-3.5">
          <dt className="mb-1.5 font-mono text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Trade-off
          </dt>
          <dd className="text-sm leading-relaxed text-pretty text-foreground/80">
            {decision.tradeoff}
          </dd>
        </div>
      </dl>
    </article>
  );
}

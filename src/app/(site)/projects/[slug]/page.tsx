import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { ArchitectureDiagram } from "@/components/architecture/architecture-diagram";
import { DecisionRecord } from "@/components/projects/decision-record";
import { ArrowLink } from "@/components/shared/arrow-link";
import { ButtonLink } from "@/components/shared/button-link";
import {
  getArchitectureDiagram,
  getProjectDetailBySlug,
  getProjectSlugs,
  getProjects,
} from "@/lib/content";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { displayTags, isSideProject } from "@/lib/projects";
import { getBreadcrumbSchema, getProjectSchema } from "@/lib/structured-data";
import { routes } from "@/config/navigation";
import { getSiteConfig } from "@/lib/db/queries/site";

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

  const kind = isSideProject(project) ? "Side project" : "Case study";

  return buildPageMetadata(ctx, {
    title: project.metaTitle ?? `${project.title}: ${kind}`,
    description: project.metaDescription ?? project.summary,
    path: routes.project(slug),
    ogImage: project.ogImageUrl,
    canonicalUrl: project.canonicalUrl,
    robots: project.robots,
  });
}

/** A case-study section: label column on the left, prose on the right. */
function StudySection({
  id,
  title,
  children,
  wide,
}: {
  id: string;
  title: string;
  children: ReactNode;
  /** Full-width content under the prose, for figures that need the room. */
  wide?: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-20 border-t border-border py-10 md:grid md:grid-cols-12 md:gap-12 md:py-14"
    >
      <Reveal className="md:col-span-3">
        <h2
          id={`${id}-heading`}
          className="font-heading text-2xl leading-tight text-foreground"
        >
          {title}
        </h2>
      </Reveal>
      <Reveal className="mt-4 min-w-0 md:col-span-9 md:mt-0">{children}</Reveal>
      {wide ? (
        <Reveal className="mt-8 min-w-0 md:col-span-12 md:mt-10">{wide}</Reveal>
      ) : null}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[65ch] space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-5 leading-relaxed text-pretty text-foreground/85 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-signal before:content-['']"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

const prose =
  "max-w-[65ch] text-[1.0625rem] leading-relaxed text-pretty text-foreground/85";

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, site, allProjects] = await Promise.all([
    getProjectDetailBySlug(slug),
    getSiteConfig(),
    getProjects(),
  ]);

  if (!project) notFound();

  const diagram = await getArchitectureDiagram(slug);
  const projectUrl = `${site.url}${routes.project(slug)}`;
  const tags = displayTags(project);

  const currentIndex = allProjects.findIndex((item) => item.slug === slug);
  const nextProject =
    allProjects.length > 1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : undefined;

  const structuredData = [
    getProjectSchema(site, project),
    getBreadcrumbSchema([
      { name: "Home", url: site.url },
      { name: "Projects", url: `${site.url}${routes.projects}` },
      { name: project.title, url: projectUrl },
    ]),
  ];

  const facts = [
    { term: "Role", detail: project.role },
    { term: "Stack", detail: project.stack.join(", ") },
    tags.length > 0 ? { term: "Area", detail: tags.join(", ") } : null,
  ].filter((fact): fact is { term: string; detail: string } => fact !== null);

  return (
    <>
      <JsonLd data={structuredData} />

      <header className="border-b border-border">
        <Container className="pt-10 pb-12 sm:pt-14 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Work", href: routes.projects },
              { label: project.title },
            ]}
          />
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-8">
              <p className="label-mono">{project.context}</p>
              <h1 className="mt-4 font-heading text-[2.5rem] leading-[1.05] text-foreground sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
                {project.summary}
              </p>
              {project.links.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.links.map((link, index) => (
                    <ButtonLink
                      key={link.href}
                      href={link.href}
                      external
                      showExternalIcon
                      variant={index === 0 ? "default" : "outline"}
                      size="lg"
                      className="min-h-11 px-5"
                    >
                      {link.label}
                    </ButtonLink>
                  ))}
                </div>
              ) : null}
            </div>
            <dl className="divide-y divide-border self-start border-y border-border md:col-span-4">
              {facts.map((fact) => (
                <div
                  key={fact.term}
                  className="grid grid-cols-[4.5rem_1fr] gap-3 py-3.5"
                >
                  <dt className="label-mono pt-0.5">{fact.term}</dt>
                  <dd className="text-sm leading-relaxed text-foreground">
                    {fact.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {project.thumbnailUrl ? (
            <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={project.thumbnailUrl}
                alt={`${project.title} screenshot`}
                fill
                priority
                sizes="(min-width: 1120px) 1056px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </Container>
      </header>

      {project.metrics.length > 0 ? (
        <Container>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 py-10 md:grid-cols-4 md:py-12">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col-reverse">
                <dt className="mt-1.5 text-sm leading-snug text-muted-foreground">
                  {metric.label}
                </dt>
                <dd className="font-heading text-3xl leading-tight text-foreground sm:text-4xl">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      ) : null}

      <Container className="pb-8">
        {project.problem ? (
          <StudySection id="problem" title="The problem">
            <p className={prose}>{project.problem}</p>
          </StudySection>
        ) : null}

        {project.overview ? (
          <StudySection id="overview" title="What it does">
            <p className={prose}>{project.overview}</p>
          </StudySection>
        ) : null}

        {project.challenges.length > 0 ? (
          <StudySection id="challenges" title="The hard parts">
            <BulletList items={project.challenges} />
          </StudySection>
        ) : null}

        {project.architecture || diagram ? (
          <StudySection
            id="architecture"
            title="Architecture"
            wide={diagram ? <ArchitectureDiagram diagram={diagram} /> : null}
          >
            {project.architecture ? (
              <p className={prose}>{project.architecture}</p>
            ) : null}
          </StudySection>
        ) : null}

        {project.decisions.length > 0 ? (
          <StudySection id="decisions" title="Decisions">
            <div className="space-y-5">
              {project.decisions.map((decision, index) => (
                <DecisionRecord
                  key={decision.decision}
                  decision={decision}
                  index={index}
                />
              ))}
            </div>
          </StudySection>
        ) : null}

        {project.results.length > 0 ? (
          <StudySection id="results" title="Results">
            <BulletList items={project.results} />
          </StudySection>
        ) : null}

        {project.lessons.length > 0 ? (
          <StudySection id="lessons" title="What I learned">
            <BulletList items={project.lessons} />
          </StudySection>
        ) : null}

        {project.futureImprovements?.length ? (
          <StudySection id="next" title="What's next">
            <BulletList items={project.futureImprovements} />
          </StudySection>
        ) : null}
      </Container>

      <nav aria-label="More projects" className="border-t border-border">
        <Container className="flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
          {nextProject && nextProject.slug !== slug ? (
            <div>
              <p className="label-mono">Next</p>
              <p className="mt-2 font-heading text-2xl text-foreground sm:text-3xl">
                <ArrowLink
                  href={routes.project(nextProject.slug)}
                  className="font-heading text-2xl font-normal sm:text-3xl"
                >
                  {nextProject.title}
                </ArrowLink>
              </p>
            </div>
          ) : (
            <span />
          )}
          <ArrowLink href={routes.projects}>All projects</ArrowLink>
        </Container>
      </nav>
    </>
  );
}

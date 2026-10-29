import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import { getProjects } from "@/lib/content";
import type { EngineeringDecision, Project } from "@/types";

const PREFERRED_PROJECT_SLUG = "dispatch-management-saas";

type DecisionHighlightData = {
  project: Project;
  decision: EngineeringDecision;
};

function pickHighlightedDecision(
  projects: Project[],
): DecisionHighlightData | null {
  const preferred = projects.find(
    (project) => project.slug === PREFERRED_PROJECT_SLUG,
  );
  const ordered = preferred
    ? [preferred, ...projects.filter((p) => p.slug !== preferred.slug)]
    : projects;

  for (const project of ordered) {
    const decision = project.decisions[0];
    if (decision) {
      return { project, decision };
    }
  }

  return null;
}

export async function DecisionHighlight() {
  const projects = await getProjects();
  const highlight = pickHighlightedDecision(projects);
  if (!highlight) return null;

  const { project, decision } = highlight;
  const href = routes.project(project.slug);

  return (
    <Section spacing="none" className="py-10 sm:py-12">
      <Container>
        <Reveal>
          <Heading as="h2" size="lg" className="mb-3 text-foreground">
            How I decide
          </Heading>
          <Text muted leading="relaxed" className="mb-6">
            One call from a live system, with the reasoning and what it cost:
          </Text>

          <AppLink
            href={href}
            showExternalIcon={false}
            className="site-card group relative block rounded-2xl p-5 no-underline outline-none transition-[border-color,background-color,transform] duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-7"
            aria-label={`Read the full case study: ${project.title}`}
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-foreground/[0.08] pb-4">
              <p className="font-mono text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                Recent decision
              </p>
              <p className="text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                {project.title}
              </p>
            </div>

            <p className="mb-6 text-pretty font-heading text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl sm:leading-snug">
              {decision.decision}
            </p>

            <dl className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="rounded-xl bg-foreground/[0.035] px-4 py-3.5 sm:px-5 sm:py-4">
                <dt className="mb-2 font-mono text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Why
                </dt>
                <dd className="text-sm leading-relaxed text-foreground/80 text-pretty">
                  {decision.rationale}
                </dd>
              </div>
              <div className="rounded-xl bg-foreground/[0.035] px-4 py-3.5 sm:px-5 sm:py-4">
                <dt className="mb-2 font-mono text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Tradeoff
                </dt>
                <dd className="text-sm leading-relaxed text-foreground/80 text-pretty">
                  {decision.tradeoff}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-foreground/[0.08] pt-4">
              <span className="text-sm font-medium text-foreground">
                Read the full case study
              </span>
              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-foreground/[0.04] text-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-foreground/30 group-hover:bg-foreground/[0.08]"
                aria-hidden="true"
              >
                <ArrowRight className="size-4" />
              </span>
            </div>
          </AppLink>
        </Reveal>
      </Container>
    </Section>
  );
}

import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
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

  return (
    <Section spacing="sm" className="bg-muted/30">
      <Container className="max-w-3xl">
        <Heading as="h2" size="lg" className="mb-3">
          How I decide
        </Heading>
        <Text muted leading="relaxed" className="mb-8 max-w-2xl">
          Senior judgment shows up in tradeoffs, not slogans. One concrete call
          from a live system:
        </Text>
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          <Text size="sm" muted className="mb-3 uppercase tracking-widest">
            Recent decision · {project.title}
          </Text>
          <Text className="mb-4 text-base font-medium leading-snug sm:text-lg">
            {decision.decision}
          </Text>
          <dl className="space-y-4">
            <div>
              <dt className="mb-1 text-sm font-medium text-foreground">Why</dt>
              <dd>
                <Text size="sm" muted leading="relaxed">
                  {decision.rationale}
                </Text>
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-sm font-medium text-foreground">
                Tradeoff
              </dt>
              <dd>
                <Text size="sm" muted leading="relaxed">
                  {decision.tradeoff}
                </Text>
              </dd>
            </div>
          </dl>
          <AppLink
            href={routes.project(project.slug)}
            showExternalIcon={false}
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            Read the full case study
            <ArrowRight className="size-4" aria-hidden="true" />
          </AppLink>
        </div>
      </Container>
    </Section>
  );
}

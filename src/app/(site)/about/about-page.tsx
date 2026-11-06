import { DecisionHighlight } from "@/components/about/decision-highlight";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { Reveal } from "@/components/motion/reveal";
import { Text } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import {
  getAboutContent,
  getSiteConfig,
  getSkillGroups,
} from "@/lib/content";

export default async function AboutPage() {
  const [site, about, skillGroups] = await Promise.all([
    getSiteConfig(),
    getAboutContent(),
    getSkillGroups(),
  ]);

  return (
    <>
      <PageHeader
        title="About"
        heading="I work on the parts of a product that move money."
        description="Tenancy, payments, ledgers and the integrations around them, mostly in Laravel, PHP and PostgreSQL."
      >
        <AvailabilityBadge site={site} />
      </PageHeader>

      <Section spacing="none" className="pb-10 sm:pb-12">
        <Container className="space-y-5">
          {about.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 30)} delay={index * 0.05}>
              <Text
                leading="relaxed"
                className="max-w-[68ch] text-lead text-pretty text-foreground/80"
              >
                {paragraph}
              </Text>
            </Reveal>
          ))}
        </Container>
      </Section>

      <DecisionHighlight />

      <Section spacing="none" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container>
          <SectionHeader
            title="Toolkit"
            description="What I reach for, grouped by the job it does."
          />
          {/* Ruled rows, like a ledger: the job on the left, the tools on the right. */}
          {/*
            One reveal for the whole list: a <dl> may only contain <dt>/<dd>
            groups wrapped in a single <div>, so each row must be a direct
            child (a per-row Reveal added a second wrapper and failed axe).
          */}
          <Reveal>
            <dl className="border-t border-foreground/10">
              {skillGroups.map((group) => (
                <div
                  key={group.category}
                  className="grid gap-3 border-b border-foreground/10 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8 sm:py-6"
                >
                  <dt className="font-heading text-subheading font-semibold text-foreground">
                    {group.category}
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <li key={skill}>
                          <Badge
                            variant="secondary"
                            className="border border-foreground/8 bg-foreground/[0.03] px-2.5 py-1 text-[0.8125rem] font-medium text-foreground/85"
                          >
                            {skill}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {site.languagesVisible !== false && site.languages.length > 0 ? (
        <Section spacing="none" className="pb-16 pt-2 sm:pb-20 sm:pt-4">
          <Container>
            <SectionHeader title="Languages" />
            <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-3">
              {site.languages.map((language) => (
                <li
                  key={`${language.name}-${language.level}`}
                  className="border-t border-foreground/10 pt-4"
                >
                  <p className="font-heading text-subheading font-semibold text-foreground">
                    {language.name}
                  </p>
                  <p className="label-mono mt-2">{language.level}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}

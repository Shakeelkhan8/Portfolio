import { DecisionHighlight } from "@/components/about/decision-highlight";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { Reveal } from "@/components/motion/reveal";
import { Heading } from "@/components/typography/heading";
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
        eyebrow="About"
        title="About"
        description="Senior backend engineer focused on scalable SaaS systems, APIs, and production ownership."
      >
        <AvailabilityBadge site={site} />
      </PageHeader>

      <Section spacing="none" className="pb-10 sm:pb-12">
        <Container className="space-y-5">
          {about.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 30)} delay={index * 0.05}>
              <Text leading="relaxed" muted className="text-pretty">
                {paragraph}
              </Text>
            </Reveal>
          ))}
        </Container>
      </Section>

      <DecisionHighlight />

      <Section spacing="none" className="pb-16 pt-10 sm:pb-20 sm:pt-12">
        <Container>
          <Reveal>
            <p className="mb-3 font-mono text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
              Toolkit
            </p>
            <Heading as="h2" size="lg" className="mb-8 text-foreground sm:mb-10">
              Skills
            </Heading>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {skillGroups.map((group, index) => (
              <Reveal key={group.category} delay={index * 0.045} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-foreground/[0.06] bg-foreground/[0.03] p-5 transition-[border-color,background-color] duration-300 hover:border-foreground/12 hover:bg-foreground/[0.045] sm:p-6">
                  <div className="mb-4 flex items-baseline gap-3 border-b border-foreground/[0.06] pb-3.5">
                    <span
                      className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground tabular-nums"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Text className="font-heading text-[0.98rem] font-semibold tracking-tight text-foreground">
                      {group.category}
                    </Text>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <li key={skill}>
                        <Badge
                          variant="secondary"
                          className="border border-foreground/8 bg-background/50 px-2.5 py-1 text-[0.75rem] font-medium text-foreground/85"
                        >
                          {skill}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {site.languagesVisible !== false && site.languages.length > 0 ? (
        <Section spacing="none" className="pb-16 pt-2 sm:pb-20 sm:pt-4">
          <Container>
            <Reveal>
              <p className="mb-3 font-mono text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                Communication
              </p>
              <Heading as="h2" size="lg" className="mb-8 text-foreground sm:mb-10">
                Languages
              </Heading>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {site.languages.map((language, index) => (
                <Reveal
                  key={`${language.name}-${language.level}`}
                  delay={index * 0.045}
                  className="h-full"
                >
                  <article className="flex h-full flex-col justify-between rounded-2xl border border-foreground/[0.06] bg-foreground/[0.03] p-5 transition-[border-color,background-color] duration-300 hover:border-foreground/12 hover:bg-foreground/[0.045] sm:p-6">
                    <Text className="font-heading text-[0.98rem] font-semibold tracking-tight text-foreground">
                      {language.name}
                    </Text>
                    <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                      {language.level}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}

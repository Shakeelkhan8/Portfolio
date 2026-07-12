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
        <Container className="max-w-3xl space-y-5">
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
        <Container className="max-w-3xl">
          <Reveal>
            <p className="mb-3 font-mono text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
              Toolkit
            </p>
            <Heading as="h2" size="lg" className="mb-6 text-foreground">
              Skills
            </Heading>
          </Reveal>

          <div className="rounded-2xl bg-foreground/[0.035] px-5 py-6 sm:px-7 sm:py-8">
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {skillGroups.map((group, index) => (
                <Reveal key={group.category} delay={index * 0.04}>
                  <div>
                    <Text className="mb-3 font-heading text-[0.95rem] font-semibold tracking-tight text-foreground">
                      {group.category}
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="border border-foreground/10 bg-background/60 px-2.5 py-1 text-[0.75rem] font-medium text-foreground/90"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-10 sm:mt-12">
            <Heading as="h2" size="lg" className="mb-6 text-foreground">
              Details
            </Heading>
            <dl className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              <Reveal>
                <div>
                  <dt className="mb-1.5 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                    Location
                  </dt>
                  <dd className="text-sm text-foreground/90">
                    {site.location} ({site.timezone})
                  </dd>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div>
                  <dt className="mb-1.5 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                    Availability
                  </dt>
                  <dd className="text-sm text-foreground/90">
                    {site.availability.message}
                  </dd>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="sm:col-span-2">
                <div>
                  <dt className="mb-1.5 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                    Languages
                  </dt>
                  <dd className="text-sm text-foreground/90">
                    {site.languages
                      .map((lang) => `${lang.name} (${lang.level})`)
                      .join(" · ")}
                  </dd>
                </div>
              </Reveal>
            </dl>
          </div>
        </Container>
      </Section>
    </>
  );
}

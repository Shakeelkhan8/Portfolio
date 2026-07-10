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
        title="About"
        description="Senior backend engineer focused on scalable SaaS systems, APIs, and production ownership."
      >
        <AvailabilityBadge site={site} className="mt-4" />
      </PageHeader>

      <Section spacing="sm" className="border-t border-border/60 pt-0">
        <Container className="max-w-3xl space-y-6">
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

      <Section spacing="sm">
        <Container>
          <Heading as="h2" size="lg" className="mb-8 text-foreground">
            Skills
          </Heading>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group, index) => (
              <Reveal key={group.category} delay={index * 0.05}>
                <div className="site-card rounded-2xl p-5">
                  <Text className="mb-3 font-heading font-medium tracking-tight">
                    {group.category}
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-muted/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border/60">
        <Container className="max-w-3xl">
          <Heading as="h2" size="lg" className="mb-8 text-foreground">
            Details
          </Heading>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <div className="site-card rounded-2xl p-5">
                <dt className="mb-1 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                  Location
                </dt>
                <dd className="text-sm text-foreground/90">
                  {site.location} ({site.timezone})
                </dd>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="site-card rounded-2xl p-5">
                <dt className="mb-1 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                  Availability
                </dt>
                <dd className="text-sm text-foreground/90">
                  {site.availability.message}
                </dd>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="sm:col-span-2">
              <div className="site-card rounded-2xl p-5">
                <dt className="mb-1 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
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
        </Container>
      </Section>
    </>
  );
}

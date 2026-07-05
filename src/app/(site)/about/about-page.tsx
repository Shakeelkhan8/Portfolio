import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { FadeIn } from "@/components/motion/fade-in";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { aboutIntro, skillGroups } from "@/content/skills";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About"
        description="Senior backend engineer focused on scalable systems, production SaaS, and engineering excellence."
      >
        <AvailabilityBadge className="mt-4" />
      </PageHeader>

      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="max-w-3xl space-y-6">
          {aboutIntro.map((paragraph) => (
            <FadeIn key={paragraph.slice(0, 30)}>
              <Text leading="relaxed" muted>
                {paragraph}
              </Text>
            </FadeIn>
          ))}
        </Container>
      </Section>

      <Section spacing="sm" className="bg-muted/30">
        <Container>
          <Heading as="h2" size="lg" className="mb-8">
            Engineering Philosophy
          </Heading>
          <div className="grid gap-4 md:grid-cols-2">
            {siteConfig.philosophy.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container>
          <Heading as="h2" size="lg" className="mb-8">
            Skills
          </Heading>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <FadeIn key={group.category}>
                <div>
                  <Text className="mb-3 font-medium">{group.category}</Text>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border bg-muted/30">
        <Container className="max-w-3xl space-y-6">
          <Heading as="h2" size="lg">
            Details
          </Heading>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium">Location</dt>
              <dd className="text-sm text-muted-foreground">
                {siteConfig.location} ({siteConfig.timezone})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Availability</dt>
              <dd className="text-sm text-muted-foreground">
                {siteConfig.availability.message}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium">Languages</dt>
              <dd className="text-sm text-muted-foreground">
                {siteConfig.languages
                  .map((lang) => `${lang.name} (${lang.level})`)
                  .join(" · ")}
              </dd>
            </div>
          </dl>
        </Container>
      </Section>
    </>
  );
}

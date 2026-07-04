import { ArrowRight } from "lucide-react";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLink } from "@/components/shared/app-link";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";

export default function Home() {
  return (
    <>
      <Section spacing="sm" className="pt-16 pb-20 md:pt-24 md:pb-28">
        <Container>
          <FadeIn className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <AvailabilityBadge className="mb-8" />
            <Heading as="h1" size="hero" className="mb-4">
              {siteConfig.name}
            </Heading>
            <Text size="xl" muted className="mb-6 max-w-xl">
              {siteConfig.title}
            </Text>
            <Text size="lg" leading="relaxed" muted className="mb-10 max-w-2xl">
              {siteConfig.description}
            </Text>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                render={
                  <AppLink href={routes.projects} showExternalIcon={false} />
                }
                size="lg"
              >
                View Projects
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={
                  <AppLink href={routes.contact} showExternalIcon={false} />
                }
              >
                Get in Touch
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary">{siteConfig.yearsOfExperience}+ years</Badge>
              <Badge variant="secondary">{siteConfig.location}</Badge>
              {siteConfig.expertise.slice(0, 3).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-border bg-muted/30">
        <Container>
          <SectionHeader
            title="Engineering Philosophy"
            description="How I approach building production systems."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {siteConfig.philosophy.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <Card className="h-full border-border/60 bg-surface shadow-sm">
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
          <SectionHeader
            title="Design System Preview"
            description="Phase 2 components are ready. Pages will be built in Phase 3."
          />
          <FadeIn>
            <Card className="border-dashed">
              <CardContent className="py-10 text-center">
                <Text muted>
                  Layout shell, navigation, typography, motion, and shadcn/ui
                  primitives are in place.
                </Text>
              </CardContent>
            </Card>
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}

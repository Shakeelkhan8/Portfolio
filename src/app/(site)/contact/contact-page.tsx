import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ContactForm } from "@/components/contact/contact-form";
import { ServicesSection } from "@/components/home/services-section";
import { Text } from "@/components/typography/text";
import { Reveal } from "@/components/motion/reveal";
import { getMailtoHref } from "@/lib/contact/email-display";
import { getServices, getSiteConfig } from "@/lib/content";

export default async function ContactPage() {
  const [site, services] = await Promise.all([getSiteConfig(), getServices()]);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact"
        description={site.availability.message}
      >
        <AvailabilityBadge site={site} />
      </PageHeader>
      <Section spacing="sm" className="pt-0">
        <Container className="grid max-w-5xl gap-12 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-3">
            <ContactForm />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-2">
            <aside className="space-y-8" aria-label="Contact details">
              <div>
                <Text
                  size="sm"
                  className="mb-2 font-mono text-[10px] tracking-[0.22em] uppercase"
                  muted
                >
                  Email
                </Text>
                <Text size="sm">
                  <a
                    href={getMailtoHref(site.email)}
                    className="font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    {site.email}
                  </a>
                </Text>
              </div>
              {site.links.upwork ? (
                <div>
                  <Text
                    size="sm"
                    className="mb-2 font-mono text-[10px] tracking-[0.22em] uppercase"
                    muted
                  >
                    Upwork
                  </Text>
                  <Text size="sm">
                    <a
                      href={site.links.upwork}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Fixed-price packages and reviews
                    </a>
                  </Text>
                </div>
              ) : null}
              <div>
                <Text
                  size="sm"
                  className="mb-2 font-mono text-[10px] tracking-[0.22em] uppercase"
                  muted
                >
                  Response time
                </Text>
                <Text size="sm" muted>
                  {site.responseTimeText}
                </Text>
              </div>
            </aside>
          </Reveal>
        </Container>
      </Section>

      {services.length > 0 ? (
        <Section spacing="sm">
          <Container>
            <SectionHeader
              title="Work with me"
              description="White-label for agencies, fixed-price for product teams. Most work starts with a code health check."
            />
            <ServicesSection services={services} />
          </Container>
        </Section>
      ) : null}
    </>
  );
}

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ContactForm } from "@/components/contact/contact-form";
import { ServicesSection } from "@/components/home/services-section";
import { Text } from "@/components/typography/text";
import { getMailtoHref } from "@/lib/contact/email-display";
import { getServices, getSiteConfig } from "@/lib/content";

export default async function ContactPage() {
  const [site, services] = await Promise.all([getSiteConfig(), getServices()]);

  return (
    <>
      <PageHeader title="Contact" description={site.availability.message}>
        <AvailabilityBadge site={site} className="mt-4" />
      </PageHeader>
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="grid max-w-4xl gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          <aside className="space-y-6 lg:col-span-2" aria-label="Contact details">
            <div>
              <Text size="sm" className="mb-1 font-medium">
                Email
              </Text>
              <Text size="sm" muted>
                <a
                  href={getMailtoHref(site.email)}
                  className="text-primary hover:underline"
                >
                  {site.email}
                </a>
              </Text>
            </div>
            <div>
              <Text size="sm" className="mb-1 font-medium">
                Location
              </Text>
              <Text size="sm" muted>
                {site.location} ({site.timezone})
              </Text>
            </div>
            <div>
              <Text size="sm" className="mb-1 font-medium">
                Response time
              </Text>
              <Text size="sm" muted>
                {site.responseTimeText}
              </Text>
            </div>
          </aside>
        </Container>
      </Section>

      {services.length > 0 ? (
        <Section spacing="sm" className="border-t border-border bg-muted/30">
          <Container>
            <SectionHeader
              title="Services"
              description="Areas where I can contribute on contract or consulting engagements."
              align="center"
            />
            <ServicesSection services={services} />
          </Container>
        </Section>
      ) : null}
    </>
  );
}

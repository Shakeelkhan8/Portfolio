import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ContactForm } from "@/components/contact/contact-form";
import { Text } from "@/components/typography/text";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        description={siteConfig.availability.message}
      >
        <AvailabilityBadge className="mt-4" />
      </PageHeader>
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="grid max-w-4xl gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <div>
              <Text size="sm" className="mb-1 font-medium">
                Email
              </Text>
              <Text size="sm" muted>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-primary hover:underline"
                >
                  {siteConfig.email}
                </a>
              </Text>
            </div>
            <div>
              <Text size="sm" className="mb-1 font-medium">
                Location
              </Text>
              <Text size="sm" muted>
                {siteConfig.location} ({siteConfig.timezone})
              </Text>
            </div>
            <div>
              <Text size="sm" className="mb-1 font-medium">
                Response time
              </Text>
              <Text size="sm" muted>
                Usually within 24–48 hours.
              </Text>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

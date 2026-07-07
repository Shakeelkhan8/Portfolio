import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function SiteLoading() {
  return (
    <Section spacing="sm" className="py-24">
      <Container>
        <div
          className="flex min-h-[40vh] items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <span className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
          <span className="sr-only">Loading…</span>
        </div>
      </Container>
    </Section>
  );
}

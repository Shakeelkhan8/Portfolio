import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function SiteLoading() {
  return (
    <Section
      spacing="none"
      className="relative isolate min-h-[calc(100svh-var(--header-height)-var(--mobile-tab-bar-height))] md:min-h-[60vh]"
    >
      <Container>
        <div
          className="flex min-h-[calc(100svh-var(--header-height)-var(--mobile-tab-bar-height)-4rem)] flex-col items-center justify-center gap-5 md:min-h-[60vh]"
          role="status"
          aria-live="polite"
        >
          <div className="relative flex size-14 items-center justify-center sm:size-16">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-border animate-loader-pulse"
            />
            <span
              aria-hidden="true"
              className="absolute inset-2 rounded-full border border-border/50 animate-loader-pulse [animation-delay:200ms]"
            />
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full bg-foreground"
            />
          </div>
          <p className="font-mono text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
            Loading
          </p>
          <span className="sr-only">Loading…</span>
        </div>
      </Container>
    </Section>
  );
}

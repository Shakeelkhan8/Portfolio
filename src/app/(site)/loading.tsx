import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function SiteLoading() {
  return (
    <Section spacing="none" className="relative isolate min-h-[60vh]">
      <Container>
        <div
          className="flex min-h-[60vh] flex-col items-center justify-center gap-5"
          role="status"
          aria-live="polite"
        >
          <div className="relative flex size-16 items-center justify-center">
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

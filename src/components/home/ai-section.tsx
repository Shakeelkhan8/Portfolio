import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { ButtonLink } from "@/components/shared/button-link";
import { Reveal } from "@/components/motion/reveal";
import { contactHref } from "@/components/services/service-list";
import { routes } from "@/config/navigation";

const capabilities = [
  "OpenAI API integration",
  "Anthropic Claude API integration",
  "Assistants and chat inside your app",
  "Pulling structured data out of documents",
  "AI steps in existing business workflows",
  "AI features added to Laravel apps you already run",
];

/** Steps of a typical integration, left to right. */
const flow = [
  { name: "Your Laravel app", note: "A user action or a queued job" },
  { name: "AI service layer", note: "Spend limits, logging, retries" },
  { name: "OpenAI or Claude API", note: "Behind one interface" },
  { name: "Validated response", note: "Checked before it's used" },
];

/**
 * AI as an engineering capability, not a slogan. The diagram is explicitly
 * labelled illustrative; the real-project evidence is AI Mentor Health,
 * linked by name. No claims about training models.
 */
export function AiSection() {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
      <Reveal>
        <p className="max-w-[56ch] leading-relaxed text-pretty text-foreground/80">
          AI works best as one more part of an application you already trust.
          I add specific features to existing Laravel apps, each with limits
          on what it can spend, logs of what it did, and output that is
          validated before it touches your data.
        </p>
        <ul className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {capabilities.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-foreground/30" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-7 max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground">
          In practice:{" "}
          <AppLink
            href={routes.project("ai-mentor-health")}
            showExternalIcon={false}
            className="link-draw font-medium text-foreground"
          >
            AI Mentor Health
          </AppLink>
          , an open-source side project, keeps its AI coach behind an
          interface so the provider can change, and has to get reliably
          structured output from the model for its weekly plans.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <ButtonLink href={contactHref("ai")} className="group">
            Discuss an AI integration project
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              data-icon="inline-end"
            />
          </ButtonLink>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <figure className="rounded-2xl border border-foreground/[0.08] bg-surface p-5 sm:p-7">
          <figcaption className="label-mono mb-6 flex flex-wrap items-center justify-between gap-2">
            <span>How a typical integration fits together</span>
            <span className="rounded border border-foreground/15 px-1.5 py-0.5 text-[10px] tracking-[0.12em]">
              Illustrative
            </span>
          </figcaption>
          <ol className="grid gap-3">
            {flow.map((step, index) => (
              <li key={step.name} className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-full border border-foreground/15 font-mono text-[11px] text-foreground/70 tabular-nums"
                >
                  {index + 1}
                </span>
                <div className="rounded-lg border border-foreground/10 bg-background/60 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{step.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            The response returns to the app through the same layer, so every
            call is limited, logged and checked in one place.
          </p>
        </figure>
      </Reveal>
    </div>
  );
}

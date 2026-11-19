"use client";

import { ArrowRight, Download } from "lucide-react";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/layout/container";
import { HeroOrb } from "@/components/motion/hero-orb";
import { HERO } from "@/components/motion/hero-timeline";
import { TextReveal } from "@/components/motion/text-reveal";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { CtaSection, PublicSiteConfig } from "@/types/cms";

/** One proof point under the hero actions: a short figure and what it means. */
export type HeroStat = {
  value: string;
  label: string;
};

type HomeHeroProps = {
  site: PublicSiteConfig;
  /** CMS-managed intro and CTAs (`cta_sections.home_hero`). */
  cta?: CtaSection | null;
  /** Proof points along the bottom of the first screen. */
  stats?: HeroStat[];
  /** Active resume PDF from the CMS; without one the action opens /resume. */
  resumeUrl?: string | null;
};

/**
 * Opacity-only entrance for the hero's supporting lines. CSS (`.enter-fade`),
 * so it runs from first paint and doesn't wait for hydration. Phones get the
 * shorter duration and reduced motion gets no animation, both in globals.css.
 */
function HeroFade({
  children,
  delay,
  className,
}: {
  children: ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <div
      className={cn("enter-fade", className)}
      style={{ "--enter-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Splits the name into the two display lines: the first word, then the rest.
 * A one-word name stays on one line.
 */
function nameLines(name: string): [string, string | null] {
  const [first, ...rest] = name.trim().split(/\s+/);
  return [first ?? name, rest.length > 0 ? rest.join(" ") : null];
}

/**
 * Home hero (docs/DESIGN.md).
 *
 * Name-first editorial composition: the name set as the display line, the
 * role and areas of expertise under it, the intro, the actions with
 * availability, then the proof points as a ruled line along the bottom of
 * the first screen. The header hides its wordmark at the top of this page
 * (see Header), so the name still appears once. The particle star sits to
 * the right as the visual, warm at its core, and drifts away as you scroll.
 */
export function HomeHero({ site, cta, stats = [], resumeUrl }: HomeHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const primaryLabel = cta?.primaryLabel?.trim() || null;
  const primaryHref = cta?.primaryHref?.trim() || routes.projects;
  const intro = cta?.description?.trim() || site.description;
  const available = site.availability.status === "available";
  const [firstName, restOfName] = nameLines(site.name);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: mobile ? 90 : 70,
    damping: mobile ? 30 : 28,
    mass: 0.4,
  });

  const orbY = useTransform(smooth, [0, 1], [0, mobile ? 48 : 120]);
  const orbScale = useTransform(smooth, [0, 1], [1, mobile ? 1.12 : 1.3]);
  const orbOpacity = useTransform(smooth, [0, 0.8], [1, 0.05]);
  const contentOpacity = useTransform(smooth, [0, 0.55], [1, 0]);

  return (
    <div
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-var(--header-height)-var(--mobile-tab-bar-height))] w-full max-w-full flex-col overflow-x-clip md:min-h-[calc(100svh-var(--header-height))]"
    >
      {/*
        The star: upper right on phones (behind the copy, dimmed by the scrim
        below), the right half of the hero from md up. Clipped to the
        section, never 100vw, so it can't cause horizontal scroll.
      */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <m.div
          aria-hidden="true"
          className="absolute -top-[6%] -right-[30%] h-[62%] w-[110%] origin-center will-change-transform md:top-0 md:-right-[6%] md:h-full md:w-[62%]"
          style={
            prefersReducedMotion
              ? undefined
              : { y: orbY, scale: orbScale, opacity: orbOpacity }
          }
        >
          <HeroOrb />
        </m.div>
        {/* Keeps the copy readable where it overlaps the star. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,var(--background)_78%)] md:bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklch,var(--background)_82%,transparent)_38%,transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,var(--background))]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay site-noise"
        />
      </div>

      <Container className="relative z-10 flex flex-1 flex-col">
        <m.div
          className="flex flex-1 flex-col justify-center pt-8 pb-8 sm:pt-10 md:pb-10"
          style={
            prefersReducedMotion
              ? undefined
              : // Opacity only: translateY on this text tree softens glyphs on mobile GPUs.
                { opacity: contentOpacity }
          }
        >
          <HeroFade delay={HERO.type.badge}>
            <p className="label-mono text-foreground/55">Hello, I&apos;m</p>
          </HeroFade>

          {/*
            The name is the h1. Each line is its own reveal; the h1 carries the
            full name as its accessible name so it reads once, not word by word.
          */}
          <h1
            aria-label={site.name}
            className="mt-3 font-heading text-hero-name font-semibold uppercase font-stretch-semi-expanded text-foreground sm:mt-4"
          >
            <span aria-hidden="true" className="block">
              <TextReveal as="span" text={firstName} delay={HERO.type.name} />
            </span>
            {restOfName ? (
              <span
                aria-hidden="true"
                className="block pl-[0.55em] text-foreground/35 sm:pl-[0.9em]"
              >
                <TextReveal
                  as="span"
                  text={restOfName}
                  delay={HERO.type.name + 0.12}
                />
              </span>
            ) : null}
          </h1>

          <HeroFade delay={HERO.type.title} className="mt-6 sm:mt-7">
            <p className="font-heading text-lg font-semibold tracking-[0.08em] text-foreground uppercase sm:text-xl">
              {site.title}
            </p>
            {site.expertise.length > 0 ? (
              <ul
                aria-label="Areas of expertise"
                className="mt-3 flex max-w-[44rem] flex-wrap gap-x-3 gap-y-1.5"
              >
                {site.expertise.map((area, index) => (
                  <li
                    key={area}
                    className="label-mono flex items-center gap-3 text-foreground/60"
                  >
                    {index > 0 ? (
                      <span aria-hidden="true" className="text-signal">
                        •
                      </span>
                    ) : null}
                    {area}
                  </li>
                ))}
              </ul>
            ) : null}
          </HeroFade>

          {intro ? (
            <HeroFade delay={HERO.type.description} className="mt-5 sm:mt-6">
              <p className="max-w-[36rem] text-lead text-pretty text-foreground/75">
                {intro}
              </p>
            </HeroFade>
          ) : null}

          <HeroFade delay={HERO.type.actions} className="mt-7 sm:mt-8">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {primaryLabel ? (
                <ButtonLink
                  href={primaryHref}
                  size="lg"
                  className="group min-h-12 px-6 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  {primaryLabel}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    data-icon="inline-end"
                  />
                </ButtonLink>
              ) : null}
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "min-h-12 px-6",
                  )}
                >
                  <Download className="size-4" data-icon="inline-start" />
                  Download resume
                </a>
              ) : (
                <ButtonLink
                  href={routes.resume}
                  variant="outline"
                  size="lg"
                  className="min-h-12 px-6"
                >
                  View resume
                </ButtonLink>
              )}
            </div>
          </HeroFade>

          {/* Availability sits under the actions it qualifies. */}
          <HeroFade delay={HERO.type.actions + 0.08} className="mt-5">
            <p className="label-mono inline-flex items-center gap-2.5 text-foreground/60">
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  available
                    ? "bg-success shadow-[0_0_0_3px_color-mix(in_oklch,var(--success)_22%,transparent)]"
                    : "bg-muted-foreground",
                )}
              />
              {available ? "Available for work" : "Not taking new work"}
            </p>
          </HeroFade>
        </m.div>

        {stats.length > 0 ? (
          <HeroFade delay={HERO.type.actions + 0.15} className="pb-6 sm:pb-8">
            {/*
              Proof points in one ruled line along the bottom of the first
              screen. Each figure has a full explanation in the Impact
              section just below.
            */}
            <dl className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-foreground/10 pt-5 sm:grid-cols-3 sm:pt-6">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="flex flex-row-reverse items-baseline justify-end gap-3 sm:flex-col-reverse sm:items-start sm:gap-1.5"
                >
                  {/* Label first in the DOM so it's read as the term; shown under the figure. */}
                  <dt className="label-mono text-foreground/60">{stat.label}</dt>
                  <dd className="font-heading text-figure font-semibold text-foreground">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </HeroFade>
        ) : null}
      </Container>
    </div>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
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
import { AppLink } from "@/components/shared/app-link";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/layout/container";
import { HeroOrb } from "@/components/motion/hero-orb";
import { HERO } from "@/components/motion/hero-timeline";
import { TextReveal } from "@/components/motion/text-reveal";
import { routes } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { CtaSection, PublicSiteConfig } from "@/types/cms";

type HomeHeroProps = {
  site: PublicSiteConfig;
  /** CMS-managed headline, intro and CTAs (`cta_sections.home_hero`). */
  cta?: CtaSection | null;
};

/**
 * Opacity-only entrance for the hero's supporting lines. CSS (`.enter-fade`),
 * so it runs from first paint: the intro paragraph can be the page's LCP
 * element and must not wait for hydration. Phones get the shorter duration
 * and reduced motion gets no animation, both in globals.css.
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
 * Index of the word where the headline's qualifier starts ("for payments,
 * ..."), so the role reads bright and the specialisation quieter. Undefined
 * when the CMS headline has no such split: it then renders in one tone.
 */
function qualifierStart(headline: string): number | undefined {
  const words = headline.split(" ");
  const index = words.findIndex(
    (word, i) => i > 0 && ["for", "who", "building"].includes(word.toLowerCase()),
  );
  return index > 0 ? index : undefined;
}

/**
 * Home hero (docs/DESIGN.md).
 *
 * Left-aligned editorial composition instead of a centred stack: a two-tone
 * headline, the intro, one primary action and a quiet text link with
 * availability under them, then the areas of expertise as a ruled line along
 * the bottom edge. The results have their own section below, with
 * context. The particle star sits to the right as the visual, warm at its
 * core, and drifts away as you scroll.
 */
export function HomeHero({ site, cta }: HomeHeroProps) {
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
  const secondaryLabel = cta?.secondaryLabel?.trim() || null;
  const secondaryHref = cta?.secondaryHref?.trim() || routes.contact;
  // Older CMS rows set the headline to the site name, which the header
  // wordmark already shows, so fall back to the professional title.
  const ctaTitle = cta?.title?.trim();
  const headline = ctaTitle && ctaTitle !== site.name ? ctaTitle : site.title;
  const intro = cta?.description?.trim() || site.description;
  const available = site.availability.status === "available";

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
          className="flex flex-1 flex-col justify-center pt-10 pb-12 sm:pt-14 md:max-w-[42rem] md:pb-16 lg:max-w-[46rem]"
          style={
            prefersReducedMotion
              ? undefined
              : // Opacity only: translateY on this text tree softens glyphs on mobile GPUs.
                { opacity: contentOpacity }
          }
        >
          {/*
            No name line above the headline: the header's wordmark already
            shows the name directly above, so the headline opens the page.
          */}
          <TextReveal
            as="h1"
            text={headline}
            delay={HERO.type.name}
            quietFrom={qualifierStart(headline)}
            className="font-heading font-stretch-normal max-w-[22ch] text-display font-semibold text-balance text-foreground sm:font-stretch-semi-expanded"
          />

          {intro ? (
            <HeroFade delay={HERO.type.description} className="mt-7 sm:mt-8">
              <p className="max-w-[36rem] text-lead text-pretty text-foreground/75">
                {intro}
              </p>
            </HeroFade>
          ) : null}

          {primaryLabel || secondaryLabel ? (
            <HeroFade delay={HERO.type.actions} className="mt-9 sm:mt-10">
              <div className="flex flex-wrap items-center gap-x-7 gap-y-4 sm:gap-x-8">
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
                {secondaryLabel ? (
                  <AppLink
                    href={secondaryHref}
                    showExternalIcon={false}
                    className="link-draw inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-foreground"
                  >
                    {secondaryLabel}
                  </AppLink>
                ) : null}
              </div>
            </HeroFade>
          ) : null}

          {/*
            Availability sits under the actions it qualifies, not in the
            identity line, so the top of the hero reads as just the name.
          */}
          <HeroFade delay={HERO.type.actions + 0.08} className="mt-6 sm:mt-7">
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

        {site.expertise.length > 0 ? (
          <HeroFade delay={HERO.type.actions + 0.15} className="pb-8 sm:pb-10">
            {/*
              What I do, in one ruled line along the bottom of the first
              screen (CMS `expertise_items`). The results that used to sit
              here have their own section just below, with context.
            */}
            <ul
              aria-label="Areas of expertise"
              className="flex flex-wrap gap-x-3 gap-y-2 border-t border-foreground/10 pt-5 sm:pt-6"
            >
              {site.expertise.map((area, index) => (
                <li key={area} className="label-mono flex items-center gap-3 text-foreground/75">
                  {index > 0 ? (
                    <span aria-hidden="true" className="h-3 w-px bg-foreground/20" />
                  ) : null}
                  {area}
                </li>
              ))}
            </ul>
          </HeroFade>
        ) : null}
      </Container>
    </div>
  );
}

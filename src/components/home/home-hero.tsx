"use client";

import { ArrowRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/layout/container";
import { HeroOrb } from "@/components/motion/hero-orb";
import {
  HERO,
  HERO_EASE,
  HERO_EASE_SOFT,
} from "@/components/motion/hero-timeline";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrollCue } from "@/components/motion/scroll-cue";
import { TextReveal } from "@/components/motion/text-reveal";
import { Text } from "@/components/typography/text";
import { routes } from "@/config/navigation";
import type { CtaSection, SiteConfig } from "@/types/cms";

type HomeHeroProps = {
  site: SiteConfig;
  /** CMS-managed hero CTAs (`cta_sections.home_hero`) */
  cta?: CtaSection | null;
};

function HeroFade({
  children,
  delay,
  className,
  soft,
}: {
  children: ReactNode;
  delay: number;
  className?: string;
  /** Accepted for call-site compatibility; hero fades are opacity-only. */
  y?: number;
  soft?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Opacity only — transforms on text ancestors rasterize soft on mobile GPUs.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: soft ? 0.7 : 1, ease: HERO_EASE_SOFT }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Immersive hero: cosmic visual chapter, then CMS identity over the living star.
 * Orb is section-width (not 100vw) so it never causes horizontal scroll.
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
  // The CMS hero intro is specific (current role and integrations); the site
  // description stays generic for meta tags and is only the fallback here.
  const intro = cta?.description?.trim() || site.description;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: mobile ? 90 : 70,
    damping: mobile ? 30 : 28,
    mass: 0.4,
  });

  const orbY = useTransform(smooth, [0, 1], [0, mobile ? 64 : 140]);
  const orbScale = useTransform(smooth, [0, 1], [1, mobile ? 1.18 : 1.55]);
  const orbOpacity = useTransform(smooth, [0, 0.8], [1, 0.05]);
  const contentOpacity = useTransform(smooth, [0, 0.5], [1, 0]);
  const cueOpacity = useTransform(smooth, [0, 0.18], [1, 0]);

  const d = (seconds: number) => (prefersReducedMotion ? 0 : seconds);

  return (
    <div
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-var(--header-height)-var(--mobile-tab-bar-height))] w-full max-w-full flex-col overflow-x-clip md:min-h-[calc(100svh-var(--header-height))]"
    >
      {/* Full-bleed within section — clipped, never uses 100vw */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 origin-center will-change-transform"
          style={
            prefersReducedMotion
              ? undefined
              : { y: orbY, scale: orbScale, opacity: orbOpacity }
          }
        >
          <HeroOrb />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,transparent_0%,transparent_32%,rgba(0,0,0,0.28)_68%,var(--background)_96%)]" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay site-noise"
          />
        </motion.div>
      </div>

      <Container className="relative z-10 flex flex-1 flex-col">
        {/* Dark scrim under the copy so text stays legible over the orb's core. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[14%] bottom-[18%] -z-10 mx-auto max-w-4xl bg-[radial-gradient(ellipse_closest-side,rgb(0_0_0/0.78),rgb(0_0_0/0.45)_55%,transparent)]"
        />
        <motion.div
          className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-0 pb-24 pt-4 text-center sm:pb-28 sm:pt-6"
          style={
            prefersReducedMotion
              ? undefined
              : // Opacity only — translateY on this text tree softens glyphs on mobile GPUs.
                { opacity: contentOpacity }
          }
        >
          <HeroFade
            delay={d(HERO.type.badge)}
            className="mb-5 sm:mb-7"
            soft={mobile}
          >
            <AvailabilityBadge site={site} />
          </HeroFade>

          {site.location ? (
            <HeroFade
              delay={d(HERO.type.location)}
              className="mb-4 sm:mb-5"
              soft={mobile}
            >
              <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground uppercase sm:text-[11px] sm:tracking-[0.4em]">
                {[site.city, site.location].filter(Boolean).join(", ")}
              </p>
            </HeroFade>
          ) : null}

          <motion.div
            className="relative mb-5 w-full max-w-full sm:mb-6"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: d(HERO.type.name),
              duration: mobile ? 0.85 : 1.2,
              ease: HERO_EASE,
            }}
          >
            <TextReveal
              as="h1"
              text={site.name}
              intensity="default"
              delay={d(HERO.type.name)}
              className="font-heading relative z-10 max-w-full text-[clamp(1.75rem,8vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance text-foreground [text-shadow:0_2px_28px_rgba(0,0,0,0.75)] sm:text-6xl md:text-7xl lg:text-[5rem]"
            />
          </motion.div>

          {site.title ? (
            <HeroFade
              delay={d(HERO.type.title)}
              className="mb-4 w-full max-w-xl sm:mb-5 sm:max-w-2xl"
              y={18}
              soft={mobile}
            >
              <Text
                size="xl"
                className="relative z-10 text-lg font-medium tracking-tight text-foreground/92 sm:text-xl"
              >
                {site.title}
              </Text>
            </HeroFade>
          ) : null}

          {intro ? (
            <HeroFade
              delay={d(HERO.type.description)}
              className="mb-8 w-full max-w-md sm:mb-10 sm:max-w-2xl"
              y={16}
              soft={mobile}
            >
              <Text
                size="lg"
                leading="relaxed"
                className="relative z-10 text-[0.9375rem] leading-relaxed text-pretty text-foreground/72 [text-shadow:0_1px_18px_rgb(0_0_0/0.9)] sm:text-lg"
              >
                {intro}
              </Text>
            </HeroFade>
          ) : null}

          {primaryLabel || secondaryLabel ? (
            <HeroFade
              delay={d(HERO.type.actions)}
              className="w-full max-w-xs sm:max-w-none"
              y={14}
              soft={mobile}
            >
              <div className="relative z-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
                {primaryLabel ? (
                  <Magnetic strength={0.35}>
                    <ButtonLink
                      href={primaryHref}
                      size="lg"
                      className="group min-h-12 w-full transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:min-w-[10.5rem] sm:w-auto"
                    >
                      {primaryLabel}
                      <ArrowRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        data-icon="inline-end"
                      />
                    </ButtonLink>
                  </Magnetic>
                ) : null}
                {secondaryLabel ? (
                  <Magnetic strength={0.22}>
                    <ButtonLink
                      href={secondaryHref}
                      variant="outline"
                      size="lg"
                      className="min-h-12 w-full border-border/80 bg-background/20 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:min-w-[10.5rem] sm:w-auto"
                    >
                      {secondaryLabel}
                    </ButtonLink>
                  </Magnetic>
                ) : null}
              </div>
            </HeroFade>
          ) : null}
        </motion.div>
      </Container>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-5 z-20 sm:bottom-8"
        style={prefersReducedMotion ? undefined : { opacity: cueOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: d(HERO.type.cue),
          duration: 1.15,
          ease: HERO_EASE,
        }}
      >
        <ScrollCue />
      </motion.div>
    </div>
  );
}

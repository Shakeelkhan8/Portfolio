"use client";

import { ArrowRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ButtonLink } from "@/components/shared/button-link";
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
  y = 22,
}: {
  children: ReactNode;
  delay: number;
  className?: string;
  y?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 1, ease: HERO_EASE_SOFT }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Immersive hero: cosmic visual chapter, then CMS identity over the living star.
 * All copy and CTAs come from the CMS — nothing hardcoded.
 */
export function HomeHero({ site, cta }: HomeHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const primaryLabel = cta?.primaryLabel?.trim() || null;
  const primaryHref = cta?.primaryHref?.trim() || routes.projects;
  const secondaryLabel = cta?.secondaryLabel?.trim() || null;
  const secondaryHref = cta?.secondaryHref?.trim() || routes.contact;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 28,
    mass: 0.45,
  });

  const orbY = useTransform(smooth, [0, 1], [0, 140]);
  const orbScale = useTransform(smooth, [0, 1], [1, 1.55]);
  const orbOpacity = useTransform(smooth, [0, 0.8], [1, 0.05]);
  const contentY = useTransform(smooth, [0, 1], [0, 64]);
  const contentOpacity = useTransform(smooth, [0, 0.5], [1, 0]);
  const cueOpacity = useTransform(smooth, [0, 0.18], [1, 0]);

  const d = (seconds: number) => (prefersReducedMotion ? 0 : seconds);

  return (
    <div
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-var(--header-height))] flex-col"
    >
      {/* Visual plane — edge-to-edge star */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-screen -translate-x-1/2"
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

      {/* Identity chapter — CMS content, choreographed to the star */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-1 pb-28 pt-6 text-center"
        style={
          prefersReducedMotion
            ? undefined
            : { y: contentY, opacity: contentOpacity }
        }
      >
        <HeroFade delay={d(HERO.type.badge)} className="mb-7" y={14}>
          <AvailabilityBadge site={site} />
        </HeroFade>

        {site.location ? (
          <HeroFade delay={d(HERO.type.location)} className="mb-5" y={12}>
            <p className="font-mono text-[11px] tracking-[0.4em] text-muted-foreground uppercase">
              {site.location}
            </p>
          </HeroFade>
        ) : null}

        <motion.div
          className="relative mb-6"
          initial={
            prefersReducedMotion
              ? false
              : { opacity: 0, scale: 0.97 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: d(HERO.type.name),
            duration: 1.2,
            ease: HERO_EASE,
          }}
        >
          <TextReveal
            as="h1"
            text={site.name}
            intensity="cinematic"
            delay={d(HERO.type.name)}
            className="font-heading relative z-10 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground drop-shadow-[0_4px_40px_rgba(0,0,0,0.85)] sm:text-6xl md:text-7xl lg:text-[5rem]"
          />
          {/* Soft light under the name — ties type to the star */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-24 w-[min(90%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.06] blur-3xl"
          />
        </motion.div>

        {site.title ? (
          <HeroFade delay={d(HERO.type.title)} className="mb-5 max-w-2xl" y={18}>
            <Text
              size="xl"
              className="relative z-10 font-medium tracking-tight text-foreground/92"
            >
              {site.title}
            </Text>
          </HeroFade>
        ) : null}

        {site.description ? (
          <HeroFade
            delay={d(HERO.type.description)}
            className="mb-10 max-w-2xl"
            y={16}
          >
            <Text
              size="lg"
              leading="relaxed"
              muted
              className="relative z-10 text-balance"
            >
              {site.description}
            </Text>
          </HeroFade>
        ) : null}

        {primaryLabel || secondaryLabel ? (
          <HeroFade delay={d(HERO.type.actions)} y={14}>
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
              {primaryLabel ? (
                <Magnetic strength={0.35}>
                  <ButtonLink
                    href={primaryHref}
                    size="lg"
                    className="group min-w-[10.5rem] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
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
                    className="min-w-[10.5rem] border-border/80 bg-background/20 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    {secondaryLabel}
                  </ButtonLink>
                </Magnetic>
              ) : null}
            </div>
          </HeroFade>
        ) : null}
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-8 z-20"
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

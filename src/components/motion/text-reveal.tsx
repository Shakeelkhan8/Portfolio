"use client";

import { m, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import {
  HERO_EASE,
  HERO_EASE_DRAMATIC,
} from "@/components/motion/hero-timeline";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  /** Split by word (default) or single line */
  mode?: "word" | "line";
  /** `mount` for headlines above the fold; `inView` for scroll sections */
  when?: "mount" | "inView";
  /**
   * `cinematic` — longer mask reveal (no CSS filter — filters blur mobile type)
   * `default` — clean mask reveal
   */
  intensity?: "default" | "cinematic";
};

const WORD_STAGGER = { default: 0.045, cinematic: 0.07 } as const;
const WORD_DURATION = { default: 0.7, cinematic: 1.05 } as const;

/** The overflow mask each word rises out of. */
const MASK_CLASS =
  "inline-block max-w-full overflow-hidden align-bottom pb-[0.08em]";

/**
 * Masked word-by-word headline reveal.
 *
 * `mount` renders CSS-animated spans (`.enter-word`): the headline is usually
 * the LCP element, and a CSS animation starts on first paint, whereas a
 * Motion `initial={{ opacity: 0 }}` kept it invisible until hydration.
 * `inView` uses Motion's viewport detection, which needs JavaScript anyway.
 *
 * The animated words are the only copy of the text: a separate sr-only
 * duplicate made crawlers and `textContent` read the heading twice. Words are
 * joined by non-breaking spaces, so screen readers hear a normal phrase.
 */
export function TextReveal({
  text,
  as: Tag = "p",
  className,
  delay = 0,
  mode = "word",
  when = "mount",
  intensity = "default",
}: TextRevealProps) {
  const parts = mode === "line" ? [text] : text.split(" ");
  const stagger = mode === "word" ? WORD_STAGGER[intensity] : 0;
  const duration = WORD_DURATION[intensity];

  const label = (part: string, index: number) =>
    `${part}${mode === "word" && index < parts.length - 1 ? " " : ""}`;

  if (when === "mount") {
    return (
      <Tag className={cn("max-w-full", className)}>
        {parts.map((part, index) => (
          <span key={`${part}-${index}`} className={MASK_CLASS}>
            <span
              className="enter-word max-w-full"
              style={
                {
                  "--enter-delay": `${delay + index * stagger}s`,
                  "--enter-duration": `${duration}s`,
                } as CSSProperties
              }
            >
              {label(part, index)}
            </span>
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <InViewReveal
      Tag={Tag}
      className={className}
      parts={parts.map(label)}
      delay={delay}
      stagger={stagger}
      duration={duration}
      cinematic={intensity === "cinematic"}
    />
  );
}

function InViewReveal({
  Tag,
  className,
  parts,
  delay,
  stagger,
  duration,
  cinematic,
}: {
  Tag: NonNullable<TextRevealProps["as"]>;
  className?: string;
  parts: string[];
  delay: number;
  stagger: number;
  duration: number;
  cinematic: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <Tag className={className}>{parts.join("")}</Tag>;
  }

  // Mask reveal via translate only — never CSS filter/scale (softens glyphs).
  const wordVariants = {
    hidden: { y: cinematic ? "115%" : "110%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: {
        duration,
        ease: cinematic ? HERO_EASE_DRAMATIC : HERO_EASE,
      },
    },
  };

  return (
    <Tag className={cn("max-w-full", className)}>
      <m.span
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
      >
        {parts.map((part, index) => (
          <span key={`${part}-${index}`} className={MASK_CLASS}>
            <m.span
              className="inline-block max-w-full"
              variants={wordVariants}
            >
              {part}
            </m.span>
          </span>
        ))}
      </m.span>
    </Tag>
  );
}

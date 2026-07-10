"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  /** `mount` for hero; `inView` for scroll sections */
  when?: "mount" | "inView";
  /**
   * `cinematic` — blur + mask + soft scale (hero opening)
   * `default` — clean mask reveal
   */
  intensity?: "default" | "cinematic";
};

export function TextReveal({
  text,
  as: Tag = "p",
  className,
  delay = 0,
  mode = "word",
  when = "mount",
  intensity = "default",
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const parts = mode === "line" ? [text] : text.split(" ");
  const cinematic = intensity === "cinematic";

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: mode === "word" ? (cinematic ? 0.07 : 0.045) : 0,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = cinematic
    ? {
        hidden: {
          y: "115%",
          opacity: 0,
          filter: "blur(12px)",
          scale: 0.96,
        },
        show: {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          transition: { duration: 1.05, ease: HERO_EASE_DRAMATIC },
        },
      }
    : {
        hidden: { y: "110%", opacity: 0 },
        show: {
          y: "0%",
          opacity: 1,
          transition: { duration: 0.7, ease: HERO_EASE },
        },
      };

  return (
    <Tag className={cn("max-w-full", className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        {...(when === "inView"
          ? {
              whileInView: "show",
              viewport: { once: true, amount: 0.4 },
            }
          : { animate: "show" })}
        variants={containerVariants}
      >
        {parts.map((part, index) => (
          <span
            key={`${part}-${index}`}
            className="inline-block max-w-full overflow-hidden align-bottom pb-[0.08em]"
          >
            <motion.span
              className="inline-block max-w-full will-change-transform"
              variants={wordVariants}
            >
              {part}
              {mode === "word" && index < parts.length - 1 ? "\u00A0" : null}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

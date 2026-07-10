"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left bg-foreground/70"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

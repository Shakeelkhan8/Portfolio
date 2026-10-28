"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Hero scroll hint: "Scroll" with a mouse pointer, "Swipe up" on touch. */
export function ScrollCue() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-2" aria-hidden="true">
      <div className="relative flex h-10 w-14 flex-col items-center rounded-md border border-foreground/35">
        <div className="flex h-6 w-full items-center justify-center border-b border-foreground/20">
          <span className="h-px w-3.5 rounded-full bg-foreground/45" />
        </div>
        <div className="relative flex h-4 w-full items-center justify-center">
          <motion.span
            className="absolute size-1 rounded-full bg-foreground/75"
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, 4, 0], opacity: [0.9, 0.25, 0.9] }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
      <span className="text-[11px] font-medium tracking-[0.18em] text-foreground/55 uppercase">
        <span className="pointer-fine:hidden">Swipe up</span>
        <span className="hidden pointer-fine:inline">Scroll</span>
      </span>
    </div>
  );
}

"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("@/components/motion/motion-features").then((mod) => mod.default);

/**
 * Site-wide Motion setup.
 *
 * Reduced motion: `reducedMotion="user"` makes Motion skip transform and
 * layout animations (opacity fades remain) when the visitor asks for less
 * motion. Components must not branch their markup on `useReducedMotion()`:
 * it is `null` on the server and the real preference on the client's first
 * render, so a branch that swaps elements made React throw hydration error
 * #418 and re-render the whole page for those visitors.
 *
 * Features: components render `m.*` (a thin shell) instead of `motion.*`,
 * and the animation features load in their own chunk after hydration.
 * `strict` throws if a full `motion.*` component is added, so the saving
 * cannot silently regress. Nothing that must be visible at first paint
 * depends on this: above-the-fold entrances are CSS (see "Entrance motion"
 * in globals.css).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}

"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("@/components/motion/motion-features").then((mod) => mod.default);

/**
 * Lazy-loads Motion's animation features after hydration.
 *
 * Components render `m.*` (a thin shell) instead of `motion.*`, which bundles
 * every feature into first-load JavaScript. `strict` throws if a full
 * `motion.*` component is added, so the saving cannot silently regress.
 *
 * Nothing that must be visible at first paint depends on this: above-the-fold
 * entrances are CSS (see "Entrance motion" in globals.css). What waits for
 * the features chunk is scroll reveals, hover tilt, the nav sheet stagger
 * and the tab indicator, all of which only run after interaction or scroll.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}

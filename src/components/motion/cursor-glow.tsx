"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * Soft spotlight that follows the cursor — enhances depth without replacing
 * the system cursor (no custom circle cursor).
 */
export function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);
  const x = useSpring(rawX, { stiffness: 120, damping: 28, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMove(event: MouseEvent) {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion, rawX, rawY]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[5] hidden size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        x,
        y,
        background:
          "radial-gradient(circle, color-mix(in oklch, var(--foreground) 8%, transparent) 0%, transparent 68%)",
      }}
    />
  );
}

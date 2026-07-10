"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type AmbientBackgroundProps = {
  className?: string;
};

export function AmbientBackground({ className }: AmbientBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawInvX = useMotionValue(0);
  const rawInvY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 40, damping: 25, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 40, damping: 25, mass: 0.8 });
  const invX = useSpring(rawInvX, { stiffness: 35, damping: 22, mass: 0.9 });
  const invY = useSpring(rawInvY, { stiffness: 35, damping: 22, mass: 0.9 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMove(event: MouseEvent) {
      const nx = (event.clientX / window.innerWidth - 0.5) * 48;
      const ny = (event.clientY / window.innerHeight - 0.5) * 32;
      rawX.set(nx);
      rawY.set(ny);
      rawInvX.set(-nx * 0.55);
      rawInvY.set(-ny * 0.55);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion, rawX, rawY, rawInvX, rawInvY]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-background" />
      <div className="site-mesh absolute inset-0" />
      <motion.div
        style={prefersReducedMotion ? undefined : { x, y }}
        className={cn(
          "absolute -top-40 left-1/2 h-[560px] w-[780px] -translate-x-1/2 rounded-full bg-foreground/[0.055] blur-[130px]",
          !prefersReducedMotion && "animate-orb-drift",
        )}
      />
      <motion.div
        style={prefersReducedMotion ? undefined : { x: invX, y: invY }}
        className={cn(
          "absolute right-[-10%] bottom-[6%] h-[380px] w-[380px] rounded-full bg-foreground/[0.035] blur-[110px]",
          !prefersReducedMotion && "animate-orb-drift [animation-delay:-7s]",
        )}
      />
      <motion.div
        style={prefersReducedMotion ? undefined : { x: invX, y }}
        className="absolute top-[35%] left-[-12%] h-[280px] w-[280px] rounded-full bg-foreground/[0.025] blur-[90px]"
      />
      <div className="site-noise absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" />
      <div className="absolute inset-0 bg-grid opacity-25 [mask-image:radial-gradient(70%_55%_at_50%_20%,#000,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_95%)]" />
    </div>
  );
}

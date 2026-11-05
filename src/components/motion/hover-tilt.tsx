"use client";

import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type HoverTiltProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

/** Subtle 3D tilt — fine pointer only; touch devices get press feedback via CSS. */
export function HoverTilt({
  children,
  className,
  maxTilt = 2,
}: HoverTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 20, mass: 0.3 });
  const y = useSpring(rawY, { stiffness: 200, damping: 20, mass: 0.3 });
  const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Always render the same element: swapping a plain <div> for <m.div>
  // once the pointer check ran made React remount every card after
  // hydration. When tilt is off, the handlers are simply not attached.
  const tiltEnabled = finePointer && !prefersReducedMotion;

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    rawX.set(x / rect.width - 0.5);
    rawY.set(y / rect.height - 0.5);
    // Border spotlight position (see `[data-spotlight]` in globals.css).
    node.style.setProperty("--spot-x", `${x}px`);
    node.style.setProperty("--spot-y", `${y}px`);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <m.div
      ref={ref}
      className={cn("h-full [transform-style:preserve-3d]", className)}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      data-spotlight={tiltEnabled ? "" : undefined}
      onMouseMove={tiltEnabled ? onMove : undefined}
      onMouseLeave={tiltEnabled ? onLeave : undefined}
    >
      {children}
    </m.div>
  );
}

"use client";

import {
  m,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  duration = 0.55,
  direction = "up",
  distance = 24,
  once = true,
  className,
  ...props
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [softMotion, setSoftMotion] = useState(true);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const narrow = window.matchMedia("(max-width: 768px)");
    const sync = () => setSoftMotion(coarse.matches || narrow.matches);
    sync();
    coarse.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      coarse.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
    };
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Mobile/touch: opacity only. Transforms on text ancestors stay soft on GPU.
  if (softMotion) {
    return (
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, amount: 0.12, margin: "0px 0px -40px 0px" }}
        transition={{
          duration: Math.min(duration, 0.45),
          delay,
          ease: EASE,
        }}
        className={className}
        {...props}
      >
        {children}
      </m.div>
    );
  }

  const offset = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }[direction];

  return (
    <m.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.12, margin: "0px 0px -40px 0px" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}

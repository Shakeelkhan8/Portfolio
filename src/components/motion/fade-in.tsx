"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type FadeInProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "none";
  /**
   * `mount` — animate once when rendered (safe for above-the-fold content).
   * `inView` — animate when scrolled into view (uses a forgiving viewport so
   * content is never left at opacity 0 while partially visible).
   */
  when?: "mount" | "inView";
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.55,
  direction = "up",
  when = "mount",
  className,
  ...props
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = direction === "up" ? 22 : direction === "down" ? -22 : 0;
  const transition = { duration, delay, ease: EASE };
  const initial = {
    opacity: 0,
    y: offset,
    filter: "blur(6px)",
  };
  const visible = {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  };

  if (when === "mount") {
    return (
      <motion.div
        initial={initial}
        animate={visible}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -48px 0px" }}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

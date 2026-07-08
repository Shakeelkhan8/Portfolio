"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";

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
  duration = 0.4,
  direction = "up",
  when = "mount",
  className,
  ...props
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = direction === "up" ? 12 : direction === "down" ? -12 : 0;
  const transition = { duration, delay, ease: [0.4, 0, 0.2, 1] as const };

  if (when === "mount") {
    return (
      <motion.div
        initial={{ opacity: 0, y: offset }}
        animate={{ opacity: 1, y: 0 }}
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
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -48px 0px" }}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

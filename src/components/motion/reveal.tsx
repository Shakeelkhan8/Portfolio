"use client";

import {
  motion,
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
  duration = 0.65,
  direction = "up",
  distance = 32,
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

  const travel = softMotion ? Math.min(distance, 20) : distance;
  const offset = {
    up: { x: 0, y: travel },
    down: { x: 0, y: -travel },
    left: { x: travel, y: 0 },
    right: { x: -travel, y: 0 },
    none: { x: 0, y: 0 },
  }[direction];

  return (
    <motion.div
      initial={
        softMotion
          ? { opacity: 0, ...offset }
          : { opacity: 0, ...offset, filter: "blur(8px)" }
      }
      whileInView={
        softMotion
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once, amount: 0.12, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: softMotion ? Math.min(duration, 0.45) : duration,
        delay,
        ease: EASE,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

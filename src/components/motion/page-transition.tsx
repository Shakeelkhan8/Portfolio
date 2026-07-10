"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Route transitions — lighter on coarse pointers (no blur filter) for 60fps mobile.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={
        coarse
          ? { opacity: 0, y: 14 }
          : { opacity: 0, y: 22, filter: "blur(10px)" }
      }
      animate={
        coarse
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={{ duration: coarse ? 0.38 : 0.55, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Route transitions. On mobile/touch, opacity-only so the whole page is not
 * left on a transformed compositor layer (which softens all text).
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
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
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={softMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={softMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: softMotion ? 0.32 : 0.42, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

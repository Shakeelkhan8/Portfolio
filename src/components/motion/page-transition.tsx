import type { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Route entrance. `(site)/template.tsx` remounts this wrapper on every
 * navigation, which restarts the CSS animation (`.page-enter`): a short rise
 * on desktop, opacity only on phones, nothing under reduced motion.
 *
 * It used to be a Motion component starting at opacity 0, which hid every
 * page until hydration finished.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return <div className="page-enter">{children}</div>;
}

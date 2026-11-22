"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/config/navigation";

/**
 * A vertical tab on the right edge that opens /terminal, like the benchmark
 * portfolio's. From 1024px, the same breakpoint as the social rail; hidden
 * on the terminal page itself. It is 28px wide so it fits the page's right
 * margin (32px at 1024px) without covering text.
 */
export function TerminalTab() {
  if (usePathname() === routes.terminal) return null;

  return (
    <Link
      href={routes.terminal}
      aria-label="Open the terminal version of this portfolio"
      className="fixed top-1/2 right-0 z-40 hidden w-7 -translate-y-1/2 items-center gap-1.5 rounded-l-lg border border-r-0 border-foreground/15 bg-background/80 py-3 font-mono text-[10px] leading-none font-medium tracking-[0.18em] text-foreground/75 uppercase backdrop-blur transition-colors [writing-mode:vertical-rl] hover:border-signal/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex"
    >
      <span aria-hidden="true" className="text-signal [writing-mode:horizontal-tb]">
        ›_
      </span>
      Terminal
    </Link>
  );
}

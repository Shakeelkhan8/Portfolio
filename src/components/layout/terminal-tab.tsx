"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquareTerminal } from "lucide-react";
import { routes } from "@/config/navigation";

/**
 * A tab on the right edge that opens /terminal, like the benchmark
 * portfolio's: an icon and a vertical label in a rounded pill. It is 48px
 * wide, so it shows from 1280px, where it clears the text on every page (at
 * 1200px it overlapped wider pages by 5px); a slimmer 28px sliver at 1024px
 * was too easy to miss. Below 1280px the footer links to the terminal.
 * Hidden on /terminal.
 */
export function TerminalTab() {
  if (usePathname() === routes.terminal) return null;

  return (
    <Link
      href={routes.terminal}
      aria-label="Open the terminal version of this portfolio"
      className="group fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 rounded-l-2xl border border-r-0 border-foreground/15 bg-background/85 px-2.5 py-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur transition-[transform,border-color] duration-300 hover:border-signal/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-x-0.5 min-[1280px]:flex"
    >
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-lg bg-signal/15 text-signal transition-colors duration-300 group-hover:bg-signal/25"
      >
        <SquareTerminal className="size-4" />
      </span>
      <span className="font-mono text-[11px] font-medium tracking-[0.25em] text-foreground/75 uppercase transition-colors duration-300 [writing-mode:vertical-rl] group-hover:text-foreground">
        Terminal
      </span>
    </Link>
  );
}

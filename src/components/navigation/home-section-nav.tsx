"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { routes } from "@/config/navigation";
import { cn } from "@/lib/utils";

/** The home page's sections, in page order (src/app/(site)/page.tsx). */
export const HOME_SECTIONS = [
  { id: "about", title: "About" },
  { id: "experience", title: "Experience" },
  { id: "tech-stack", title: "Tech stack" },
  { id: "work", title: "Work" },
  { id: "contact", title: "Contact" },
] as const;

/**
 * The desktop nav on the home page: links jump to the page's own sections,
 * and the one under the middle of the screen is marked as current, like the
 * benchmark portfolio. Every other page keeps the Admin-managed main nav
 * (NavBar). Smooth scrolling and the header offset come from globals.css,
 * which also turns smooth scrolling off for reduced motion.
 */
export function HomeSectionNav({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        setActive(HOME_SECTIONS.find((section) => visible.get(section.id))?.id ?? null);
      },
      // A thin band across the middle of the viewport.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const section of HOME_SECTIONS) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={cn("hidden items-center gap-5 md:flex lg:gap-7", className)}
    >
      {HOME_SECTIONS.map((section) => {
        const current = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={current ? "location" : undefined}
            className={cn(
              "relative py-2 text-[13px] font-medium tracking-wide transition-all duration-300 after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:rounded-full after:bg-signal after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100",
              current ? "text-foreground after:scale-x-100" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {section.title}
          </a>
        );
      })}
      <a
        href={routes.resume}
        className="group ml-1 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-foreground/20 px-4 text-[13px] font-medium text-foreground transition-colors duration-300 hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Resume
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    </nav>
  );
}

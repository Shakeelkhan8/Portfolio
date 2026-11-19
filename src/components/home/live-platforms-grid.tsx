import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { LivePlatform } from "@/content/live-platforms";

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Reference cards for live production websites: what kind of platform it is,
 * the user's part in it, the stack, and a link to the live site. These are
 * contributions to larger sites, so they link out instead of to a case study.
 *
 * Each <li> is a direct child of the <ul>; the Reveal sits inside it.
 */
export function LivePlatformsGrid({ items }: { items: LivePlatform[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {items.map((item, index) => (
        <li key={item.url}>
          <Reveal
            delay={index * 0.06}
            className="group flex h-full flex-col rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 transition-colors duration-300 hover:border-foreground/25 sm:p-7"
          >
            <p className="label-mono text-foreground/55">{item.category}</p>
            <h3 className="mt-3 font-heading text-heading font-semibold text-foreground">
              {item.name}
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-foreground/75">
              {item.summary}
            </p>
            <ul aria-label={`${item.name} stack`} className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="label-mono rounded-full border border-foreground/10 px-2.5 py-1 text-foreground/65"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-foreground"
            >
              <span className="link-draw">Visit {hostOf(item.url)}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

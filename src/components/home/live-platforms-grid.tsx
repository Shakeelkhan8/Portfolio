import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { LivePlatform, SiteLayout } from "@/content/live-platforms";

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const block = "rounded-[3px] bg-foreground/[0.09]";
const line = "h-1.5 rounded-full bg-foreground/[0.08]";

/** An abstract sketch of the site's layout; no third-party imagery. */
function LayoutSketch({ layout }: { layout: SiteLayout }) {
  if (layout === "news") {
    return (
      <div className="grid h-full grid-cols-[1fr_0.42fr] gap-2.5 p-3">
        <div className="grid grid-rows-[1.4fr_1fr] gap-2.5">
          <div className={`${block} bg-gradient-to-br from-foreground/[0.14] to-foreground/[0.05]`} />
          <div className="grid grid-cols-2 gap-2.5">
            <div className={block} />
            <div className={block} />
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex gap-1.5">
              <div className="flex-1 space-y-1">
                <div className={line} />
                <div className={`${line} w-2/3`} />
              </div>
              <div className={`${block} size-6 shrink-0`} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (layout === "tv") {
    return (
      <div className="flex h-full flex-col gap-2.5 p-3">
        <div className="relative flex-[1.6] overflow-hidden rounded-[3px] bg-gradient-to-r from-signal/25 via-foreground/[0.10] to-foreground/[0.04]">
          <div className="absolute bottom-2.5 left-3 space-y-1">
            <div className="h-2 w-20 rounded-full bg-foreground/30" />
            <div className="h-1.5 w-12 rounded-full bg-foreground/20" />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-4 gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={block} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <div className="flex-[1.3] rounded-[3px] bg-gradient-to-br from-foreground/[0.14] to-foreground/[0.04]" />
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="size-4 rounded-full bg-foreground/[0.12]" />
            <div className={line} />
            <div className={`${line} w-3/4`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Work cards for live production websites, in the benchmark's layout: a
 * status badge, the platform type, the name, the user's part, the stack, a
 * framed sketch of the site with its real address, and a link to the live
 * site. These are contributions to larger sites, so there is no case-study
 * page; the card says what the user did and links out.
 *
 * Each <li> is a direct child of the <ul>; the Reveal sits inside it.
 */
export function LivePlatformsGrid({ items }: { items: LivePlatform[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li key={item.url}>
          <Reveal delay={index * 0.06} className="group flex h-full flex-col">
            <span className="label-mono self-start rounded-full border border-foreground/20 px-2.5 py-1 text-foreground/80">
              Live site
            </span>
            <p className="label-mono mt-4 text-foreground/50">{item.category}</p>
            <h3 className="mt-2 font-heading text-heading font-semibold text-foreground">
              {item.name}
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-foreground/75">
              {item.summary}
            </p>
            <ul aria-label={`${item.name} stack`} className="mt-4 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-foreground/10 px-2.5 py-0.5 text-xs text-foreground/65"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div
              aria-hidden="true"
              className="mt-6 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02] transition-colors duration-300 group-hover:border-foreground/25"
            >
              <div className="flex items-center gap-1.5 border-b border-foreground/10 px-3 py-2">
                <span className="size-2 rounded-full bg-foreground/15" />
                <span className="size-2 rounded-full bg-foreground/15" />
                <span className="size-2 rounded-full bg-foreground/15" />
                <span className="label-mono ml-auto truncate text-[10px] text-foreground/45">
                  Official site · {hostOf(item.url)}
                </span>
              </div>
              <div className="aspect-[16/10]">
                <LayoutSketch layout={item.layout} />
              </div>
            </div>

            <div className="mt-auto pt-5">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit the ${item.name} live site (opens in a new tab)`}
                className="label-mono inline-flex min-h-9 items-center gap-1.5 rounded-full border border-foreground/20 px-3.5 py-1.5 text-foreground transition-colors hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Visit live site
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

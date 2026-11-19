import { Reveal } from "@/components/motion/reveal";
import { homeAbout } from "@/content/home-about";
import type { Education } from "@/types";

function yearOf(date: string): string {
  const year = date.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : date;
}

/**
 * Home About: a two-line headline on the left; the story, three highlights
 * and education on the right. Copy lives in src/content/home-about.ts;
 * education comes from the CMS (Admin → Education).
 */
export function AboutSnapshot({ education }: { education: Education | null }) {
  const { eyebrow, headline, paragraphs, highlights } = homeAbout;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <Reveal>
        <p className="label-mono text-foreground/55">{eyebrow}</p>
        <h2 className="mt-4 font-heading text-title font-semibold font-stretch-semi-expanded text-balance text-foreground">
          {headline[0]}
          <span className="block font-light text-foreground/55">{headline[1]}</span>
        </h2>
      </Reveal>

      <div>
        <Reveal delay={0.06} className="space-y-5">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-lead text-pretty text-foreground/75"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="mt-10 grid gap-6 border-t border-foreground/10 pt-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.value} className="flex flex-col gap-1.5">
                {/* Label first in the DOM (the term); shown under the figure. */}
                <dt className="label-mono order-2 text-foreground/60">{item.label}</dt>
                <dd className="order-1 font-heading text-subheading font-semibold text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {education?.degree ? (
          <Reveal delay={0.18}>
            <div className="mt-10">
              <p className="label-mono text-foreground/55">Education</p>
              <div className="mt-4 flex flex-col gap-1 border-l border-foreground/15 pl-5">
                <p className="font-heading text-[1.0625rem] font-semibold text-foreground">
                  {education.degree}
                </p>
                <p className="text-sm text-muted-foreground">
                  {[
                    education.institution,
                    [yearOf(education.startDate), education.endDate ? yearOf(education.endDate) : null]
                      .filter(Boolean)
                      .join(" to "),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}

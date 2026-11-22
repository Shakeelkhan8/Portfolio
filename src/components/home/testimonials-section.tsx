import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Reveal } from "@/components/motion/reveal";
import { Text } from "@/components/typography/text";
import { routes } from "@/config/navigation";
import { parseTestimonialSource } from "@/lib/testimonials";
import type { TestimonialRecord } from "@/types/cms";

type TestimonialsSectionProps = {
  testimonials: TestimonialRecord[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Attribution({ item }: { item: TestimonialRecord }) {
  const { company, verifiedOn } = parseTestimonialSource(item.authorCompany);
  const detail = [item.authorRole, company].filter(Boolean).join(" · ");

  return (
    <figcaption className="flex items-start gap-3">
      {item.avatarUrl ? (
        <Image
          src={item.avatarUrl}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 font-mono text-xs text-muted-foreground"
        >
          {getInitials(item.authorName)}
        </span>
      )}
      <span className="min-w-0">
        <Text size="sm" className="font-medium">
          {item.authorName}
        </Text>
        {detail ? (
          <Text size="xs" muted className="mt-0.5">
            {detail}
          </Text>
        ) : null}
        {verifiedOn ? (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success-muted/40 px-2.5 py-1 text-xs font-medium text-success">
            <BadgeCheck aria-hidden="true" className="size-3.5" />
            Verified on {verifiedOn}
          </span>
        ) : null}
      </span>
    </figcaption>
  );
}

/** The lead quote, set large in the display face with room around it. */
function PullQuote({
  item,
}: {
  item: TestimonialRecord;
}) {
  return (
    <Reveal>
      <figure className="grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16">
        <blockquote className="relative">
          <span
            aria-hidden="true"
            className="absolute -top-3 -left-1 font-heading text-6xl leading-none text-signal/70 select-none sm:-top-4 sm:-left-7"
          >
            &ldquo;
          </span>
          <p className="max-w-[38ch] pt-8 font-heading text-[clamp(1.25rem,1.05rem+0.85vw,1.75rem)] leading-[1.42] font-medium tracking-[-0.012em] text-pretty text-foreground/90 sm:pt-0">
            {item.content}
          </p>
        </blockquote>
        <div className="border-t border-foreground/10 pt-5 md:self-end md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <Attribution item={item} />
        </div>
      </figure>
    </Reveal>
  );
}

/**
 * Client and colleague testimonials (CMS `testimonials`, visible and
 * featured only). Only genuine, permitted testimonials belong in the data;
 * see docs/testimonial-requests.md for how new ones are collected.
 *
 * One quote is a pull-quote in the display face: one real voice, given room,
 * carries more weight than a small paragraph in a grid. From two quotes on,
 * the first stays the pull-quote and the rest follow in a ruled grid. A
 * review verified on a platform gets a badge naming it, so a
 * reader can check it.
 */
export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials.length) {
    return null;
  }

  const [lead, ...rest] = testimonials;

  return (
    <div>
      <PullQuote item={lead!} />

      {rest.length > 0 ? (
        <ul className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, index) => (
            <li key={item.id} className="border-t border-foreground/10 pt-5">
              <Reveal delay={index * 0.06} className="h-full">
                <figure className="flex h-full flex-col">
                  <blockquote className="flex-1">
                    <Text leading="relaxed" className="text-pretty text-foreground/85">
                      {item.content}
                    </Text>
                  </blockquote>
                  <div className="mt-6">
                    <Attribution item={item} />
                  </div>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-foreground/10 pt-6">
        <AppLink
          href={`${routes.contact}#contact-form`}
          showExternalIcon={false}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          <span className="link-draw">Get in touch</span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </AppLink>
      </div>
    </div>
  );
}

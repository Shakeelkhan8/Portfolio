import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Text } from "@/components/typography/text";
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
  return (
    <figcaption className="flex items-center gap-3">
      {item.avatarUrl ? (
        <Image
          src={item.avatarUrl}
          alt={`${item.authorName} avatar`}
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
        <Text size="xs" muted className="mt-0.5">
          {[item.authorRole, item.authorCompany].filter(Boolean).join(" · ")}
        </Text>
      </span>
    </figcaption>
  );
}

/**
 * Client testimonials. A single quote is set as a pull-quote in the display
 * face, with the attribution beside it: one real voice, given room, carries
 * more weight than a small grey paragraph in the first third of a grid.
 * Several quotes fall back to a quieter grid.
 */
export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) {
    return null;
  }

  if (testimonials.length === 1) {
    const [item] = testimonials;
    return (
      <Reveal>
        <figure className="grid gap-8 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-16">
          <blockquote className="relative">
            <span
              aria-hidden="true"
              className="absolute -top-3 -left-1 font-heading text-6xl leading-none text-signal/70 select-none sm:-left-7 sm:-top-4"
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

  return (
    <Stagger className="grid gap-10 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
      {testimonials.map((item) => (
        <StaggerItem key={item.id}>
          <figure className="flex h-full flex-col border-t border-foreground/10 pt-5">
            <blockquote className="flex-1">
              <Text leading="relaxed" className="text-foreground/85">
                {item.content}
              </Text>
            </blockquote>
            <div className="mt-6">
              <Attribution item={item} />
            </div>
          </figure>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

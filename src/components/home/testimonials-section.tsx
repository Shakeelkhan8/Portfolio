import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
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

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials.length) {
    return null;
  }

  return (
    <ul className="grid gap-10 md:grid-cols-2">
      {testimonials.map((item) => (
        <li key={item.id}>
          <Reveal>
            <figure className="flex h-full flex-col border-t border-border pt-6">
              <blockquote className="flex-1 font-heading text-xl leading-snug text-foreground">
                &ldquo;{item.content}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
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
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                  >
                    {getInitials(item.authorName)}
                  </span>
                )}
                <span className="min-w-0 text-sm">
                  <span className="block font-medium text-foreground">
                    {item.authorName}
                  </span>
                  <span className="block text-muted-foreground">
                    {[item.authorRole, item.authorCompany]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

import Image from "next/image";
import { Quote } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
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

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((item, index) => (
        <FadeIn key={item.id} delay={index * 0.05}>
          <figure className="flex h-full flex-col rounded-xl border border-border bg-surface p-6">
            <Quote className="mb-4 size-5 text-muted-foreground" aria-hidden />
            <blockquote className="flex-1">
              <Text size="sm" leading="relaxed" muted>
                {item.content}
              </Text>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
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
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                >
                  {getInitials(item.authorName)}
                </span>
              )}
              <span className="min-w-0">
                <Text size="sm" className="font-medium">
                  {item.authorName}
                </Text>
                <Text size="xs" muted>
                  {[item.authorRole, item.authorCompany]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </span>
            </figcaption>
          </figure>
        </FadeIn>
      ))}
    </div>
  );
}

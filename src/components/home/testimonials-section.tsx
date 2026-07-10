import Image from "next/image";
import { Quote } from "lucide-react";
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

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) {
    return null;
  }

  return (
    <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
      {testimonials.map((item) => (
        <StaggerItem key={item.id}>
          <figure className="site-card flex h-full flex-col rounded-2xl p-6">
            <Quote
              className="mb-4 size-5 text-muted-foreground transition-transform duration-300 group-hover:scale-110"
              aria-hidden
            />
            <blockquote className="flex-1">
              <Text size="sm" leading="relaxed" muted>
                {item.content}
              </Text>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
              {item.avatarUrl ? (
                <Image
                  src={item.avatarUrl}
                  alt={`${item.authorName} avatar`}
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-full object-cover ring-1 ring-border/80"
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
        </StaggerItem>
      ))}
    </Stagger>
  );
}

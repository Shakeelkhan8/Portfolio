import { Plus } from "lucide-react";
import type { FaqItem } from "@/content/service-catalog";

/**
 * Questions as native <details>: keyboard and screen-reader support for
 * free, works without JavaScript, and every answer is in the HTML for
 * search engines. The plus turns into a cross when open.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-foreground/10">
      {items.map((item) => (
        <details
          key={item.question}
          className="group border-b border-foreground/10 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left font-heading text-[1.0625rem] font-semibold text-foreground transition-colors hover:text-foreground/80 sm:text-lg">
            {item.question}
            <Plus
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-[68ch] pb-6 leading-relaxed text-pretty text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

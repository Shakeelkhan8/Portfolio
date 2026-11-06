import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge only knows Tailwind's built-in sizes. Without this, it reads
 * the site's type-scale classes (`text-display`, `text-title`, ...) as text
 * colours and drops either them or `text-foreground` when both are present.
 * Keep in sync with the `--text-*` tokens in globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "title", "heading", "subheading", "figure", "lead"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

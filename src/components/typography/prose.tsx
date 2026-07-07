import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type ProseProps = ComponentPropsWithoutRef<"article">;

export function Prose({ className, ...props }: ProseProps) {
  return (
    <article
      className={cn(
        "container-prose",
        "prose prose-neutral dark:prose-invert max-w-none",
        "[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:-tracking-[0.01em]",
        "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_p]:leading-[1.75] [&_p]:text-muted-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/30 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:decoration-primary",
        "[&_code]:rounded-md [&_code]:border [&_code]:border-border/60 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:before:content-none [&_code]:after:content-none",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:text-sm [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-1 [&_li]:text-muted-foreground [&_li]:marker:text-muted-foreground/60",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-foreground [&_blockquote]:italic",
        "[&_img]:rounded-xl [&_img]:border [&_img]:border-border",
        "[&_hr]:my-12 [&_hr]:border-border",
        "[&_table]:text-sm [&_th]:font-semibold [&_th]:text-foreground [&_td]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

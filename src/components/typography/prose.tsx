import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type ProseProps = ComponentPropsWithoutRef<"article">;

export function Prose({ className, ...props }: ProseProps) {
  return (
    <article
      className={cn(
        "container-prose px-6",
        "prose prose-neutral dark:prose-invert max-w-none",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_p]:leading-relaxed [&_p]:text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-4",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:text-muted-foreground",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic",
        className,
      )}
      {...props}
    />
  );
}

import { Badge } from "@/components/ui/badge";
import type { SiteConfig } from "@/types/cms";
import { cn } from "@/lib/utils";

type AvailabilityBadgeProps = {
  site: SiteConfig;
  className?: string;
};

export function AvailabilityBadge({ site, className }: AvailabilityBadgeProps) {
  const isAvailable = site.availability.status === "available";
  const message = site.availability.message?.trim() ?? "";
  const shortFallback = isAvailable ? "Available for work" : "Not available";
  // Prefer CMS copy when it fits a badge; longer messages stay on contact CTA.
  const label =
    message && message.length <= 42 ? message : shortFallback;

  return (
    <Badge
      variant="outline"
      title={message || undefined}
      className={cn(
        "gap-2 border-border bg-muted/40 px-3.5 py-1.5 font-normal text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          isAvailable
            ? "bg-success motion-safe:animate-pulse"
            : "bg-muted-foreground",
        )}
        aria-hidden="true"
      />
      {label}
    </Badge>
  );
}

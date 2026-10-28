import type { SiteConfig } from "@/types/cms";
import { cn } from "@/lib/utils";

type AvailabilityBadgeProps = {
  site: SiteConfig;
  className?: string;
};

export function AvailabilityBadge({ site, className }: AvailabilityBadgeProps) {
  const isAvailable = site.availability.status === "available";
  const message = site.availability.message?.trim() ?? "";
  const shortFallback = isAvailable
    ? "Available for work"
    : "Not taking new work";
  // Prefer CMS copy when it fits on one line; longer messages stay on the contact CTA.
  const label = message && message.length <= 48 ? message : shortFallback;

  return (
    <p
      title={message || undefined}
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          isAvailable ? "bg-success" : "bg-muted-foreground",
        )}
        aria-hidden="true"
      />
      {label}
    </p>
  );
}

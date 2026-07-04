import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type AvailabilityBadgeProps = {
  className?: string;
};

export function AvailabilityBadge({ className }: AvailabilityBadgeProps) {
  const isAvailable = siteConfig.availability.status === "available";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-2 border-success/30 bg-success-muted/50 px-3 py-1 font-normal text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          isAvailable ? "bg-success animate-pulse" : "bg-muted-foreground",
        )}
        aria-hidden="true"
      />
      {isAvailable ? "Available for work" : "Not available"}
    </Badge>
  );
}

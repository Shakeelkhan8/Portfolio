import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import { Text } from "@/components/typography/text";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center",
        className,
      )}
    >
      <FileText className="mb-4 size-8 text-muted-foreground" aria-hidden="true" />
      <Text className="mb-2 font-medium">{title}</Text>
      <Text size="sm" muted className="mb-6 max-w-md">
        {description}
      </Text>
      {action}
    </div>
  );
}

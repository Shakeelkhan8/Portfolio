import type { ComponentType, ReactNode } from "react";
import { FileText, type LucideProps } from "lucide-react";
import { Text } from "@/components/typography/text";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ComponentType<LucideProps>;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon = FileText,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center",
        className,
      )}
    >
      <div
        className="mb-5 flex size-12 items-center justify-center rounded-xl border border-border/60 bg-surface text-muted-foreground shadow-xs"
        aria-hidden="true"
      >
        <Icon className="size-5" />
      </div>
      <Text className="mb-1.5 font-medium">{title}</Text>
      <Text size="sm" muted className="mb-6 max-w-md leading-relaxed">
        {description}
      </Text>
      {action}
    </div>
  );
}

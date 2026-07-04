import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  title,
  description,
  action,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-3 md:mb-16",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("space-y-3", align === "center" && "max-w-2xl")}>
        <Heading as="h2" size="2xl">
          {title}
        </Heading>
        {description ? (
          <Text size="lg" muted className="max-w-2xl">
            {description}
          </Text>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

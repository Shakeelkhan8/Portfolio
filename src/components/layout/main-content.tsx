import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type MainContentProps = ComponentPropsWithoutRef<"main">;

export function MainContent({ className, ...props }: MainContentProps) {
  return (
    <main
      id="main-content"
      className={cn("flex min-w-0 max-w-full flex-1 flex-col overflow-x-clip", className)}
      {...props}
    />
  );
}

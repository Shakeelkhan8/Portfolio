import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type MainContentProps = ComponentPropsWithoutRef<"main">;

export function MainContent({ className, ...props }: MainContentProps) {
  return (
    <main
      id="main-content"
      className={cn("flex flex-1 flex-col", className)}
      {...props}
    />
  );
}

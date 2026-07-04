"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommandActions } from "@/components/command/command-menu-provider";

export function SearchTrigger() {
  const { openCommand } = useCommandActions();

  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden h-8 gap-2 text-muted-foreground md:inline-flex"
      onClick={openCommand}
      aria-label="Open search"
    >
      <Search className="size-3.5" />
      <span>Search</span>
      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
        ⌘K
      </kbd>
    </Button>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSiteDataSafe } from "@/components/providers/site-data-provider";
import { filterSearchIndex } from "@/lib/search-utils";
import { cn } from "@/lib/utils";

type ContentSearchProps = {
  types?: Array<"page" | "project" | "article">;
  placeholder?: string;
  className?: string;
  onQueryChange?: (query: string) => void;
};

export function ContentSearch({
  types,
  placeholder = "Search...",
  className,
  onQueryChange,
}: ContentSearchProps) {
  const siteData = useSiteDataSafe();
  const [query, setQuery] = useState("");

  const resultCount = useMemo(() => {
    const index = siteData?.searchIndex ?? [];
    const results = filterSearchIndex(index, query);
    return types
      ? results.filter((item) => types.includes(item.type)).length
      : results.length;
  }, [query, siteData?.searchIndex, types]);

  function handleChange(value: string) {
    setQuery(value);
    onQueryChange?.(value);
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={placeholder}
      />
      {query ? (
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
          {resultCount} results
        </span>
      ) : null}
    </div>
  );
}

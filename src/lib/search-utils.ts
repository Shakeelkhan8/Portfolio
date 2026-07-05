import type { SearchResult } from "@/types";

export function filterSearchIndex(
  index: SearchResult[],
  query: string,
): SearchResult[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) return index;

  return index.filter((item) => {
    const haystack =
      `${item.title} ${item.description} ${item.type}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

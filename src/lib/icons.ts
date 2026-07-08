import type { LucideIcon } from "lucide-react";
import { icons } from "lucide-react";

export function resolveLucideIcon(name?: string | null): LucideIcon | null {
  if (!name) {
    return null;
  }

  return icons[name as keyof typeof icons] ?? null;
}

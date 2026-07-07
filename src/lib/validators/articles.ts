import { z } from "zod";
import { splitCsv, type AdminActionState } from "@/lib/validators/content";

export type { AdminActionState };

export const articleSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required."),
  title: z.string().trim().min(1, "Title is required."),
  excerpt: z.string().trim().min(1, "Excerpt is required."),
  contentHtml: z.string().trim().min(1, "Article content is required."),
  status: z.enum(["draft", "published"]).default("draft"),
  readingTimeMinutes: z.coerce.number().int().min(1).optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  ogImageId: z.string().optional(),
  canonicalUrl: z.string().trim().optional(),
  robots: z.string().trim().optional(),
  tags: z.string().optional(),
});

export function parseArticleTags(value?: string | null) {
  return splitCsv(value);
}

export function emptyMediaId(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

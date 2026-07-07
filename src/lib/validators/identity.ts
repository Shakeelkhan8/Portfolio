import { z } from "zod";
import type { AdminActionState } from "@/lib/validators/content";

export type { AdminActionState };

export const expertiseItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export const philosophyItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export const languageSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  level: z.string().trim().min(1, "Level is required."),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Platform is required."),
  label: z.string().trim().min(1, "Label is required."),
  url: z.string().trim().min(1, "URL is required."),
  icon: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().optional(),
});

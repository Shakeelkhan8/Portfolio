import { z } from "zod";

export const skillCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required."),
  slug: z.string().trim().min(1).optional(),
});

export const skillSchema = z.object({
  categoryId: z.uuid("Select a category."),
  name: z.string().trim().min(1, "Skill name is required."),
  icon: z.string().trim().optional(),
  level: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional()
    .or(z.literal("")),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(1),
  role: z.string().trim().min(1),
  location: z.string().trim().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  description: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  highlights: z.string().optional(),
  technologies: z.string().optional(),
});

export const educationSchema = z.object({
  institution: z.string().trim().min(1),
  degree: z.string().trim().min(1),
  location: z.string().trim().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  description: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  achievements: z.string().optional(),
});

export const achievementSchema = z.object({
  text: z.string().trim().min(1),
  featured: z.coerce.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export const navigationSchema = z.object({
  navGroup: z.enum(["main", "utility", "footer", "social"]),
  title: z.string().trim().min(1),
  href: z.string().trim().min(1),
  external: z.coerce.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().optional(),
});

export type AdminActionState = {
  error?: string;
  success?: string;
};

export function splitLines(value?: string | null) {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitCsv(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

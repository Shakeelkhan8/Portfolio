import { z } from "zod";

export const reorderEntitySchema = z.enum([
  "projects",
  "services",
  "testimonials",
  "certifications",
  "curated-repos",
  "resume-versions",
  "navigation",
  "experiences",
  "educations",
  "achievements",
  "skill-categories",
  "skills",
]);

export const moveDisplayOrderSchema = z.object({
  entity: reorderEntitySchema,
  id: z.string().uuid(),
  direction: z.enum(["up", "down"]),
  scopeKey: z.string().trim().optional(),
});

export type ReorderEntity = z.infer<typeof reorderEntitySchema>;

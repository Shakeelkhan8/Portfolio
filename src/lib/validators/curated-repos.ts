import { z } from "zod";
import type { AdminActionState } from "@/lib/validators/cms-modules";

export type { AdminActionState };

export const curatedRepoSchema = z.object({
  repoFullName: z
    .string()
    .trim()
    .min(1, "Repository name is required.")
    .regex(
      /^[\w.-]+\/[\w.-]+$/,
      "Use the owner/repo format (e.g. vercel/next.js).",
    ),
  pinned: z.coerce.boolean().optional(),
  hidden: z.coerce.boolean().optional(),
  overrideDescription: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

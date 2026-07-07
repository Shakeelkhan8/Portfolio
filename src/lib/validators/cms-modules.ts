import { z } from "zod";
import { slugify, type AdminActionState } from "@/lib/validators/content";

export type { AdminActionState };

export const RESERVED_PAGE_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "contact",
  "experience",
  "open-source",
  "projects",
  "resume",
  "writing",
  "sitemap.xml",
  "rss.xml",
  "robots.txt",
  "manifest.webmanifest",
]);

export const pageSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  title: z.string().trim().min(1, "Title is required."),
  contentHtml: z.string().trim().min(1, "Page content is required."),
  status: z.enum(["draft", "published"]).default("draft"),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  ogImageId: z.string().optional(),
  canonicalUrl: z.string().trim().optional(),
  robots: z.string().trim().optional(),
});

export function validatePageSlug(slug: string) {
  if (RESERVED_PAGE_SLUGS.has(slug)) {
    return "This slug is reserved for a system route.";
  }
  return null;
}

export const certificationSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  issuer: z.string().trim().min(1, "Issuer is required."),
  issueDate: z.string().optional(),
  credentialId: z.string().trim().optional(),
  verificationUrl: z.string().trim().optional(),
  imageMediaId: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().optional(),
});

export const testimonialSchema = z.object({
  authorName: z.string().trim().min(1, "Author name is required."),
  authorRole: z.string().trim().optional(),
  authorCompany: z.string().trim().optional(),
  content: z.string().trim().min(1, "Testimonial content is required."),
  rating: z.coerce.number().int().min(1).max(5).optional().or(z.literal("")),
  avatarMediaId: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().optional(),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  icon: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().optional(),
});

export const resumeVersionSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  fileMediaId: z.string().uuid("Select a PDF from the media library."),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().optional(),
});

export function emptyMediaId(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function slugifyPageTitle(title: string) {
  return slugify(title);
}

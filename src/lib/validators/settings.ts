import { z } from "zod";
import type { AdminActionState } from "@/lib/validators/content";

export type { AdminActionState };

const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

const optionalString = z
  .string()
  .optional()
  .transform((value) => value?.trim() ?? "");

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required."),
  legalName: z.string().trim().min(1, "Legal name is required."),
  tagline: z.string().trim().min(1, "Tagline is required."),
  description: z.string().trim().min(1, "Description is required."),
  email: z.email("Enter a valid email."),
  phone: z.string().optional(),
  location: z.string().trim().min(1, "Location is required."),
  city: z.string().optional(),
  timezone: z.string().trim().min(1, "Timezone is required."),
  yearsOfExperience: z.coerce.number().int().min(0).max(60),
  copyrightText: z.string().optional(),
  availabilityStatus: z.enum(["available", "unavailable", "limited"]),
  availabilityMessage: z.string().trim().min(1),
  githubUsername: z.string().optional(),
  resumeSummary: z.string().optional(),
  responseTimeText: z.string().optional(),
  maintenanceEnabled: z.coerce.boolean().optional(),
  maintenanceMessage: z.string().optional(),
});

export const seoDefaultsSchema = z.object({
  defaultTitle: z.string().trim().min(1, "Default title is required."),
  defaultDescription: z.string().trim().min(1, "Default description is required."),
  defaultOgImageId: optionalUuid,
  defaultRobots: z.string().trim().min(1, "Robots directive is required."),
  twitterCardType: z.enum([
    "summary",
    "summary_large_image",
    "app",
    "player",
  ]),
});

export const themeSettingsSchema = z.object({
  primaryColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex color."),
  accentColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex color.")
    .optional()
    .or(z.literal("")),
  backgroundColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex color.")
    .optional()
    .or(z.literal("")),
  foregroundColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex color.")
    .optional()
    .or(z.literal("")),
  fontHeading: z.string().trim().min(1),
  fontBody: z.string().trim().min(1),
  fontMono: z.string().trim().min(1),
  customCss: z.string().optional(),
});

export const analyticsSettingsSchema = z.object({
  plausibleEnabled: z.coerce.boolean().optional(),
  plausibleDomain: z.string().optional(),
  ga4Enabled: z.coerce.boolean().optional(),
  ga4MeasurementId: z.string().optional(),
});

export const customScriptSchema = z.object({
  name: z.string().trim().min(1, "Script name is required."),
  scriptContent: z.string().trim().min(1, "Script content is required."),
  placement: z.enum(["head", "body_end"]),
  enabled: z.coerce.boolean().optional(),
});

export const githubSettingsSchema = z.object({
  username: z.string().trim().min(1, "GitHub username is required."),
  showLiveStats: z.coerce.boolean().optional(),
});

export function parseOptionalString(value: FormDataEntryValue | null) {
  return optionalString.parse(typeof value === "string" ? value : "");
}

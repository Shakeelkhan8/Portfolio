import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.email("Please provide a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
  company: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const contactStatusSchema = z.enum(["unread", "read", "archived"]);

export type ContactStatusFilter = z.infer<typeof contactStatusSchema> | "all";

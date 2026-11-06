import { z } from "zod";

/**
 * Contact form choices. Stored as the stable key (`project_type`, `budget`
 * columns); labels are for the form, the notification email and the admin
 * inbox. Adding an option is safe; renaming a key orphans old rows' labels.
 */
export const PROJECT_TYPES = {
  fix: "Bug fix or slow app",
  integration: "API, payment or webhook integration",
  ai: "AI feature with OpenAI or Claude",
  upgrade: "Laravel or PHP upgrade",
  "health-check": "Code health check",
  build: "New build or MVP",
  maintenance: "Ongoing maintenance",
  role: "A full-time or contract role",
  other: "Something else",
} as const;

export const BUDGETS = {
  "under-300": "Under $300",
  "300-1000": "$300 to $1,000",
  "1000-3000": "$1,000 to $3,000",
  "3000-plus": "Over $3,000",
  monthly: "A monthly retainer",
  "not-sure": "Not sure yet",
} as const;

export type ProjectTypeKey = keyof typeof PROJECT_TYPES;
export type BudgetKey = keyof typeof BUDGETS;

const projectTypeKeys = Object.keys(PROJECT_TYPES) as [
  ProjectTypeKey,
  ...ProjectTypeKey[],
];
const budgetKeys = Object.keys(BUDGETS) as [BudgetKey, ...BudgetKey[]];

/** Label for a stored key; unknown or empty keys come back as null. */
export function projectTypeLabel(key: string | null | undefined) {
  return key && key in PROJECT_TYPES
    ? PROJECT_TYPES[key as ProjectTypeKey]
    : null;
}

export function budgetLabel(key: string | null | undefined) {
  return key && key in BUDGETS ? BUDGETS[key as BudgetKey] : null;
}

/** An empty <select> posts "", which means "not chosen". */
const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.email("Please provide a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
  /*
   * Optional on the server so a visitor still running the previous form
   * (cached JS during a deploy) can submit; the form itself requires a
   * project type.
   */
  projectType: z.preprocess(
    emptyToUndefined,
    z.enum(projectTypeKeys, "Please choose a project type.").optional(),
  ),
  budget: z.preprocess(
    emptyToUndefined,
    z.enum(budgetKeys, "Please choose a budget range.").optional(),
  ),
  company: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const contactStatusSchema = z.enum(["unread", "read", "archived"]);

export type ContactStatusFilter = z.infer<typeof contactStatusSchema> | "all";

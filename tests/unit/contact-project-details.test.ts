import { describe, expect, it } from "vitest";
import {
  foldDetailsIntoMessage,
  isMissingColumnError,
} from "@/lib/contact/persist-submission";
import {
  budgetLabel,
  contactFormSchema,
  projectTypeLabel,
} from "@/lib/validators/contact";

const base = {
  name: "Ada",
  email: "ada@example.com",
  message: "Our Laravel queue stalls every night.",
};

describe("contact form: project type and budget", () => {
  it("accepts known keys", () => {
    const parsed = contactFormSchema.parse({
      ...base,
      projectType: "fix",
      budget: "300-1000",
    });
    expect(parsed.projectType).toBe("fix");
    expect(parsed.budget).toBe("300-1000");
  });

  it("treats an empty select as not chosen", () => {
    const parsed = contactFormSchema.parse({ ...base, projectType: "", budget: "" });
    expect(parsed.projectType).toBeUndefined();
    expect(parsed.budget).toBeUndefined();
  });

  it("still accepts the previous form's payload (no new fields)", () => {
    expect(contactFormSchema.safeParse(base).success).toBe(true);
  });

  it("rejects values that aren't in the lists", () => {
    const result = contactFormSchema.safeParse({ ...base, projectType: "hack" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Please choose a project type.");
  });

  it("maps keys to labels and unknown keys to null", () => {
    expect(projectTypeLabel("ai")).toBe("AI feature with OpenAI or Claude");
    expect(budgetLabel("monthly")).toBe("A monthly retainer");
    expect(projectTypeLabel("nope")).toBeNull();
    expect(budgetLabel(null)).toBeNull();
  });
});

describe("storing before the migration runs", () => {
  it("recognises missing-column errors from Postgres and PostgREST", () => {
    expect(isMissingColumnError({ code: "42703" })).toBe(true);
    expect(isMissingColumnError({ code: "PGRST204" })).toBe(true);
    expect(
      isMissingColumnError({
        message:
          "Could not find the 'budget' column of 'contact_submissions' in the schema cache",
      }),
    ).toBe(true);
    expect(isMissingColumnError({ code: "23505", message: "duplicate key" })).toBe(false);
    expect(isMissingColumnError(null)).toBe(false);
  });

  it("keeps the answers in the message so nothing is lost", () => {
    expect(
      foldDetailsIntoMessage({ ...base, projectType: "upgrade", budget: "not-sure" }),
    ).toBe(
      "Project type: Laravel or PHP upgrade\nBudget: Not sure yet\n\nOur Laravel queue stalls every night.",
    );
  });

  it("leaves the message alone when nothing was chosen", () => {
    expect(foldDetailsIntoMessage(base)).toBe(base.message);
  });
});

import * as Sentry from "@sentry/nextjs";
import { Resend } from "resend";
import { getContactEnv } from "@/lib/env";
import { budgetLabel, projectTypeLabel } from "@/lib/validators/contact";

type SendContactEmailInput = {
  name: string;
  email: string;
  message: string;
  projectType?: string;
  budget?: string;
  to: string;
};

export async function sendContactNotificationEmail({
  name,
  email,
  message,
  projectType,
  budget,
  to,
}: SendContactEmailInput) {
  const { resendApiKey, resendFrom } = getContactEnv();

  if (!resendApiKey) {
    return { sent: false as const, reason: "missing_api_key" as const };
  }

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: resendFrom,
    to,
    replyTo: email,
    subject: `Portfolio contact from ${name}${
      projectTypeLabel(projectType) ? `: ${projectTypeLabel(projectType)}` : ""
    }`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${projectTypeLabel(projectType) ?? "Not given"}`,
      `Budget: ${budgetLabel(budget) ?? "Not given"}`,
      "",
      message,
    ].join("\n"),
  });

  if (error) {
    Sentry.captureException(error);
    return { sent: false as const, reason: "send_failed" as const };
  }

  return { sent: true as const };
}

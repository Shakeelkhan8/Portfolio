import * as Sentry from "@sentry/nextjs";
import { Resend } from "resend";
import { getContactEnv } from "@/lib/env";

type SendContactEmailInput = {
  name: string;
  email: string;
  message: string;
  to: string;
};

export async function sendContactNotificationEmail({
  name,
  email,
  message,
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
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    Sentry.captureException(error);
    return { sent: false as const, reason: "send_failed" as const };
  }

  return { sent: true as const };
}

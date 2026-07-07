import { NextResponse } from "next/server";
import { persistContactSubmission } from "@/lib/contact/persist-submission";
import { resolveContactRecipientEmail } from "@/lib/contact/recipient";
import { getRequestIp, hashContactIp } from "@/lib/contact/request-meta";
import { sendContactNotificationEmail } from "@/lib/contact/send-email";
import { getContactEnv, getPublicEnv } from "@/lib/env";
import { isTrustedSiteRequest } from "@/lib/security/request-origin";
import { contactFormSchema } from "@/lib/validators/contact";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  if (!isTrustedSiteRequest(request, getPublicEnv().NEXT_PUBLIC_SITE_URL)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  if (parsed.data.company?.trim()) {
    return NextResponse.json({ success: true });
  }

  const { name, email, message } = parsed.data;
  const { ipSalt } = getContactEnv();
  const ipHash = hashContactIp(getRequestIp(request), ipSalt);
  const userAgent = request.headers.get("user-agent");

  const persistResult = await persistContactSubmission({
    name,
    email,
    message,
    ipHash,
    userAgent,
  });

  if (persistResult.reason === "rate_limited") {
    return NextResponse.json(
      { error: "Too many messages sent recently. Please try again later." },
      { status: 429 },
    );
  }

  const recipientEmail = await resolveContactRecipientEmail();
  const emailResult = await sendContactNotificationEmail({
    name,
    email,
    message,
    to: recipientEmail,
  });

  if (persistResult.stored) {
    if (!emailResult.sent && emailResult.reason === "missing_api_key") {
      return NextResponse.json({ success: true, deliveredByEmail: false });
    }

    if (!emailResult.sent) {
      return NextResponse.json({ success: true, deliveredByEmail: false });
    }

    return NextResponse.json({ success: true, deliveredByEmail: true });
  }

  if (emailResult.sent) {
    return NextResponse.json({ success: true, deliveredByEmail: true });
  }

  return NextResponse.json(
    {
      error:
        "Unable to deliver your message right now. Please email directly at " +
        recipientEmail,
      fallbackEmail: recipientEmail,
    },
    { status: 503 },
  );
}

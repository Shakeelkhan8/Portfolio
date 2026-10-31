import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getSiteConfig } from "@/lib/db/queries/site";
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

  try {
    return await deliver(request, parsed.data);
  } catch (error) {
    // Anything that throws past validation (a missing or invalid env var such
    // as CONTACT_IP_SALT, a client library error) used to escape the handler,
    // so the browser got an empty 500 it could not parse. Report it and give
    // the visitor a readable answer with a way to reach me instead.
    Sentry.captureException(error, { tags: { route: "api/contact" } });
    console.error("[api/contact] unhandled error", error);

    const fallbackEmail = await fallbackRecipientEmail();
    return NextResponse.json(
      {
        error: `Something went wrong sending your message. Please email ${fallbackEmail} directly.`,
        fallbackEmail,
      },
      { status: 500 },
    );
  }
}

/**
 * The address to show when delivery fails. Deliberately avoids
 * getContactEnv(), which is one of the things that can throw.
 */
async function fallbackRecipientEmail(): Promise<string> {
  try {
    return (await getSiteConfig()).email || siteConfig.email;
  } catch {
    return siteConfig.email;
  }
}

async function deliver(
  request: Request,
  { name, email, message }: { name: string; email: string; message: string },
) {
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

  if (!persistResult.stored) {
    if (persistResult.reason === "rate_limited") {
      return NextResponse.json(
        { error: "Too many messages sent recently. Please try again later." },
        { status: 429 },
      );
    }

    if (
      persistResult.reason === "service_role_missing" ||
      persistResult.reason === "supabase_unconfigured"
    ) {
      return NextResponse.json(
        {
          error:
            "Contact storage is temporarily unavailable. Please try again later or email directly.",
        },
        { status: 503 },
      );
    }
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

  // Best-effort email when DB insert failed for other reasons.
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

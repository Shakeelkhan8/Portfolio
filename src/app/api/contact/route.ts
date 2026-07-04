import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL ?? siteConfig.email;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Email service is not configured. Please email directly at " +
          siteConfig.email,
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: contactEmail,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

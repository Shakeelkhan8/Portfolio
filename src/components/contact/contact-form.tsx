"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/typography/text";
import { useSiteData } from "@/components/providers/site-data-provider";
import {
  getMailtoHref,
  getPublicEmailLabel,
} from "@/lib/contact/email-display";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const { site } = useSiteData();
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      company: formData.get("company") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to send message.");
      }

      setState("success");
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center rounded-2xl border border-success/30 bg-success-muted/30 p-8 text-center animate-in fade-in-0 zoom-in-95 duration-300"
      >
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>
        <Text className="font-heading font-medium text-foreground">
          Message sent successfully.
        </Text>
        <Text size="sm" muted className="mt-2">
          I&apos;ll get back to you as soon as possible.
        </Text>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setState("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const isLoading = state === "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Your name"
          autoComplete="name"
          disabled={isLoading}
          className="bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          className="bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">Message</Label>
          <span className="text-xs text-muted-foreground">Max 5000 characters</span>
        </div>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Tell me about the opportunity or project..."
          rows={6}
          maxLength={5000}
          disabled={isLoading}
          className="bg-background/50"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state === "error" ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <Text size="sm" className="text-destructive">
            {errorMessage}
          </Text>
          <Text size="sm" muted className="mt-2">
            Or email directly —{" "}
            <a
              href={getMailtoHref(site.email)}
              className="font-medium text-primary hover:underline"
            >
              {getPublicEmailLabel(site.email, { preferAddress: true })}
            </a>
          </Text>
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" data-icon="inline-start" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}

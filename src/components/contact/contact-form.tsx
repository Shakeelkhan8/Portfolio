"use client";

import { useRef, useState } from "react";
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
import { contactFormSchema } from "@/lib/validators/contact";

type FormState = "idle" | "loading" | "success" | "error";
type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ["name", "email", "message"];

/**
 * Field errors for a payload, using the API's own schema so the browser and
 * the server agree. The form no longer asks for a project type or budget
 * (2026-11-19); the API still accepts both as optional, so older rows and a
 * cached older form keep working.
 */
function validate(payload: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {};
  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as FieldName;
      if (FIELD_ORDER.includes(field) && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function ContactForm() {
  const { site } = useSiteData();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Captured now: React clears event.currentTarget once this handler
    // yields at the first await, and calling reset() on it then threw after a
    // successful send, which flipped the form into its error state.
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
    };

    const errors = validate(payload);
    setFieldErrors(errors);
    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      setState("idle");
      form.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus();
      return;
    }

    setState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Failed to send message.");
      }

      form.reset();
      setState("success");
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
          Message sent. Thank you.
        </Text>
        <Text size="sm" muted className="mt-2 max-w-sm text-pretty">
          {site.responseTimeText?.trim()
            ? `I'll reply soon. Response time: ${site.responseTimeText.trim()}`
            : "I'll reply as soon as I can."}
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
  const fieldProps = (name: FieldName) => ({
    "aria-invalid": fieldErrors[name] ? true : undefined,
    "aria-describedby": fieldErrors[name] ? `${name}-error` : undefined,
  });

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
      aria-label="Contact form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Your name"
            autoComplete="name"
            disabled={isLoading}
            className="h-10 bg-background/50"
            {...fieldProps("name")}
          />
          <FieldError id="name-error" message={fieldErrors.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            autoComplete="email"
            disabled={isLoading}
            className="h-10 bg-background/50"
            {...fieldProps("email")}
          />
          <FieldError id="email-error" message={fieldErrors.email} />
        </div>
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
          placeholder="Tell me about the role or the project, and how I can help."
          rows={6}
          maxLength={5000}
          disabled={isLoading}
          className="bg-background/50"
          {...fieldProps("message")}
        />
        <FieldError id="message-error" message={fieldErrors.message} />
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
            Or email directly:{" "}
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
            Send message
          </>
        )}
      </Button>
    </form>
  );
}

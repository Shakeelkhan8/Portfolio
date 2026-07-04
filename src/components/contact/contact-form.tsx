"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/typography/text";
import { siteConfig } from "@/config/site";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
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
      <div className="rounded-xl border border-success/30 bg-success-muted/30 p-8 text-center">
        <Text className="font-medium text-foreground">
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Your name"
          autoComplete="name"
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Tell me about the opportunity or project..."
          rows={6}
        />
      </div>

      {state === "error" ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <Text size="sm" className="text-destructive">
            {errorMessage}
          </Text>
          <Text size="sm" muted className="mt-2">
            Or email directly at{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-medium text-primary hover:underline"
            >
              {siteConfig.email}
            </a>
          </Text>
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={state === "loading"}>
        {state === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

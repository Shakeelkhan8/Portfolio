"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/admin/actions/auth";
import { AuthCard } from "@/components/admin/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  nextPath?: string;
  initialError?: string;
};

export function LoginForm({ nextPath, initialError }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, {
    error: initialError,
  });

  return (
    <AuthCard
      title="Admin sign in"
      description="Sign in to manage your portfolio content."
      footer={
        <Link
          href="/admin/forgot-password"
          className="text-primary hover:underline"
        >
          Forgot your password?
        </Link>
      }
    >
      <form action={formAction} className="space-y-4">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••••••"
          />
        </div>

        {state.error ? (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}

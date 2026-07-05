"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/admin/actions/auth";
import { AuthCard } from "@/components/admin/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, {});

  return (
    <AuthCard
      title="Choose a new password"
      description="Use at least 12 characters with a mix of letters and numbers."
      footer={
        <Link href="/admin/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            placeholder="••••••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            placeholder="••••••••••••"
          />
        </div>

        {state.error ? (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthCard>
  );
}

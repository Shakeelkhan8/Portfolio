import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/auth/login-form";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border bg-surface p-8 text-center">
        <h1 className="font-heading text-xl font-semibold">Supabase not configured</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your Supabase environment variables to{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code>{" "}
          before using the admin panel.
        </p>
      </div>
    );
  }

  const initialError =
    params.error === "unauthorized"
      ? "You are not authorized to access the admin panel."
      : undefined;

  return (
    <LoginForm nextPath={params.next} initialError={initialError} />
  );
}

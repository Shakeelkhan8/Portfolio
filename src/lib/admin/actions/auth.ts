"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import {
  forgotPasswordSchema,
  getAuthErrorMessage,
  loginSchema,
  resetPasswordSchema,
  type AuthActionState,
} from "@/lib/validators/auth";
import { getPublicEnv } from "@/lib/env";
import type { Json } from "@/types/database";

async function logAuditEvent(
  actorId: string | null,
  action: string,
  entityType: string,
  metadata: Json = {},
) {
  try {
    const supabase = createServiceClient();
    await supabase.from("audit_logs").insert({
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: null,
      metadata_json: metadata,
    });
  } catch {
    // Audit logging should not block auth flows.
  }
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: getAuthErrorMessage(error.message) };
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    return { error: "You are not authorized to access the admin panel." };
  }

  await logAuditEvent(data.user.id, "login", "auth", {
    email: parsed.data.email,
  });

  const next = formData.get("next");
  const destination =
    typeof next === "string" && next.startsWith("/admin")
      ? next
      : "/admin/dashboard";

  redirect(destination);
}

export async function logoutAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.signOut();

  if (user) {
    await logAuditEvent(user.id, "logout", "auth");
  }

  redirect("/admin/login");
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const siteUrl = getPublicEnv().NEXT_PUBLIC_SITE_URL;

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/admin/reset-password`,
  });

  if (error) {
    return { error: getAuthErrorMessage(error.message) };
  }

  return {
    success:
      "If an account exists for that email, a password reset link has been sent.",
  };
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Your reset session has expired. Request a new reset link.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: getAuthErrorMessage(error.message) };
  }

  await logAuditEvent(user.id, "password_reset", "auth");

  redirect("/admin/dashboard");
}

export async function getAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminUser) return null;

  return {
    id: user.id,
    email: adminUser.email,
  };
}

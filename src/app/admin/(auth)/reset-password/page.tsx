import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/admin/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Choose new password",
};

export default function AdminResetPasswordPage() {
  return <ResetPasswordForm />;
}

import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/admin/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function AdminForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email address." }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, { message: "Password must be at least 12 characters." }),
    confirmPassword: z.string().min(1, { message: "Confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export type AuthActionState = {
  error?: string;
  success?: string;
};

export function getAuthErrorMessage(error: string): string {
  const normalized = error.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  if (normalized.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return "Something went wrong. Please try again.";
}

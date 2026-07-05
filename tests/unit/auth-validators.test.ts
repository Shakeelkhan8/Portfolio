import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  getAuthErrorMessage,
  loginSchema,
  resetPasswordSchema,
} from "@/lib/validators/auth";

describe("auth validators", () => {
  it("accepts valid login credentials", () => {
    const result = loginSchema.safeParse({
      email: "shakeelkhan4147@gmail.com",
      password: "valid-password",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid login email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "valid-password",
    });

    expect(result.success).toBe(false);
  });

  it("accepts forgot password email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "shakeelkhan4147@gmail.com",
    });

    expect(result.success).toBe(true);
  });

  it("requires matching reset passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "valid-password-12",
      confirmPassword: "different-password",
    });

    expect(result.success).toBe(false);
  });

  it("maps known auth errors to friendly messages", () => {
    expect(getAuthErrorMessage("Invalid login credentials")).toBe(
      "Invalid email or password.",
    );
    expect(getAuthErrorMessage("Email rate limit exceeded")).toContain(
      "Too many attempts",
    );
  });
});

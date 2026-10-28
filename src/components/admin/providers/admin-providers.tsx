"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  );
}

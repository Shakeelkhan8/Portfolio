"use client";

import { Toaster } from "sonner";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}

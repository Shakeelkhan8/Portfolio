import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Experience",
  description:
    "5+ years building production backend systems, SaaS platforms, and enterprise automation.",
  path: "/experience",
});

export { default } from "./experience-page";

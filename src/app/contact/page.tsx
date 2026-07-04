import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Get in touch about full-time roles, contract work, or consulting opportunities.",
  path: "/contact",
});

export { default } from "./contact-page";

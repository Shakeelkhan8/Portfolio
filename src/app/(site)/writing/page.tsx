import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Writing",
  description:
    "Technical articles on backend systems, architecture, and engineering decisions.",
  path: "/writing",
});

export { default } from "./writing-page";

import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Projects",
  description:
    "Engineering case studies from production systems — SaaS platforms, automation, and API-driven architectures.",
  path: "/projects",
});

export { default } from "./projects-page";

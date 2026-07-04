import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Resume",
  description: "Resume of Shakeel Khan — Senior Backend Engineer.",
  path: "/resume",
});

export { default } from "./resume-page";

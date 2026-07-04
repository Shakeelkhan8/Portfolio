import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Background, engineering philosophy, and technical skills of Shakeel Khan, Senior Backend Engineer.",
  path: "/about",
});

export { default } from "./about-page";

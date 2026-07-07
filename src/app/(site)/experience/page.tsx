import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Experience",
    description:
      "Professional experience, education, and career highlights as a Senior Backend Engineer.",
    path: routes.experience,
  });
}

export { default } from "./experience-page";

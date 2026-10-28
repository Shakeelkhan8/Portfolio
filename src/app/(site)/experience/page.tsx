import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Experience",
    description:
      "Shakeel Khan's work history: senior backend engineer at Elityx on a Saudi logistics SaaS, backend developer at Hum Network, and earlier Laravel roles.",
    path: routes.experience,
  });
}

export { default } from "./experience-page";

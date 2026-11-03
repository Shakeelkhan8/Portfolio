import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Contact",
    description:
      "Contact Shakeel Khan about a remote backend role or Laravel work: a code health check, a care plan, payments and integrations, or a fixed-price project. White-label for agencies.",
    path: routes.contact,
  });
}

export { default } from "./contact-page";

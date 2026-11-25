import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Contact",
    description:
      "Contact Shakeel Khan about a PHP/Laravel or full stack role, a SaaS or web app, an API integration, an AI feature or an upgrade. Replies within one working day.",
    path: routes.contact,
  });
}

export { default } from "./contact-page";

import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Contact",
    description:
      "Contact Shakeel Khan about a Laravel or PHP project, a payment or API integration, an AI feature, an upgrade or a remote backend role. Replies within one working day.",
    path: routes.contact,
  });
}

export { default } from "./contact-page";

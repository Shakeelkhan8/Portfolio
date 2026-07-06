import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Contact",
    description:
      "Get in touch about full-time roles, contract work, or consulting opportunities.",
    path: routes.contact,
  });
}

export { default } from "./contact-page";

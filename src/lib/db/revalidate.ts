import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "@/lib/db/cache-tags";

export function revalidateContent(...tags: CacheTag[]) {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  revalidateTag(CACHE_TAGS.search, "max");
}

export function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/experience");
  revalidatePath("/resume");
  revalidatePath("/projects");
  revalidatePath("/contact");
  revalidatePath("/sitemap.xml");
}

export function revalidateAfterContentChange(...tags: CacheTag[]) {
  revalidateContent(...tags);
  revalidatePublicPages();
}

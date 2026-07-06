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
  revalidatePath("/writing");
  revalidatePath("/contact");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
}

export function revalidateAfterContentChange(...tags: CacheTag[]) {
  revalidateContent(...tags);
  revalidatePublicPages();
}

export function revalidateAfterProjectChange(options?: {
  slug?: string;
  previousSlug?: string;
}) {
  revalidateAfterContentChange(CACHE_TAGS.projects);

  if (options?.previousSlug && options.previousSlug !== options.slug) {
    revalidatePath(`/projects/${options.previousSlug}`);
  }

  if (options?.slug) {
    revalidatePath(`/projects/${options.slug}`);
  }
}

export function revalidateAfterMediaChange() {
  revalidateTag(CACHE_TAGS.media, "max");
}

export function revalidateAfterArticleChange(options?: {
  slug?: string;
  previousSlug?: string;
}) {
  revalidateAfterContentChange(CACHE_TAGS.articles);

  if (options?.previousSlug && options.previousSlug !== options.slug) {
    revalidatePath(`/writing/${options.previousSlug}`);
  }

  if (options?.slug) {
    revalidatePath(`/writing/${options.slug}`);
  }
}

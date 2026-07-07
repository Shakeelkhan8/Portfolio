import type { Metadata } from "next";
import { TestimonialsManager } from "@/components/admin/content/testimonials-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getTestimonialRecords } from "@/lib/db/queries/admin/cms-modules";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const [testimonials, mediaFiles] = await Promise.all([
    getTestimonialRecords(),
    getMediaFiles(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Testimonials
        </Heading>
        <Text muted className="mt-1">
          Manage client and colleague testimonials for the home page.
        </Text>
      </div>
      <TestimonialsManager
        testimonials={testimonials}
        mediaFiles={mediaFiles}
      />
    </div>
  );
}

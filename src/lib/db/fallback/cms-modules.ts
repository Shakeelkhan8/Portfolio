import { defaultServices } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import type {
  CertificationRecord,
  ServiceRecord,
  TestimonialRecord,
} from "@/types/cms";

export function getFallbackCertifications(): CertificationRecord[] {
  return [];
}

export function getFallbackTestimonials(): TestimonialRecord[] {
  return testimonials.map((item, index) => ({
    id: `fallback-testimonial-${index + 1}`,
    authorName: item.author_name,
    authorRole: item.author_role,
    authorCompany: item.author_company,
    content: item.content,
    rating: null,
    avatarMediaId: null,
    avatarUrl: null,
    featured: true,
    displayOrder: index,
    visible: true,
  }));
}

export function getFallbackServices(): ServiceRecord[] {
  return defaultServices.map((service, index) => ({
    id: `fallback-service-${index + 1}`,
    title: service.title,
    description: service.description,
    icon: service.icon,
    displayOrder: index,
    visible: true,
  }));
}

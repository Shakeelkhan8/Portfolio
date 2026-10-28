import { defaultServices } from "@/content/services";
import type {
  CertificationRecord,
  ServiceRecord,
  TestimonialRecord,
} from "@/types/cms";

export function getFallbackCertifications(): CertificationRecord[] {
  return [];
}

export function getFallbackTestimonials(): TestimonialRecord[] {
  return [];
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

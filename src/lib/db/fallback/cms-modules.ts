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
  return [
    {
      id: "fallback-service-1",
      title: "Backend Architecture",
      description:
        "Design and build scalable APIs, multi-tenant systems, and production-grade services.",
      icon: "Server",
      displayOrder: 0,
      visible: true,
    },
    {
      id: "fallback-service-2",
      title: "System Modernization",
      description:
        "Migrate legacy systems, improve reliability, and reduce operational risk.",
      icon: "RefreshCw",
      displayOrder: 1,
      visible: true,
    },
    {
      id: "fallback-service-3",
      title: "Technical Consulting",
      description:
        "Architecture reviews, performance tuning, and hands-on engineering leadership.",
      icon: "Lightbulb",
      displayOrder: 2,
      visible: true,
    },
  ];
}

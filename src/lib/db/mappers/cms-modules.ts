import type {
  CertificationRecord,
  ResumeVersionRecord,
  ServiceRecord,
  TestimonialRecord,
} from "@/types/cms";

export function mapCertification(
  row: {
    id: string;
    name: string;
    issuer: string;
    issue_date: string | null;
    credential_id: string | null;
    verification_url: string | null;
    image_media_id: string | null;
    display_order: number;
    visible: boolean;
  },
  imageUrl?: string | null,
): CertificationRecord {
  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    issueDate: row.issue_date,
    credentialId: row.credential_id,
    verificationUrl: row.verification_url,
    imageMediaId: row.image_media_id,
    imageUrl: imageUrl ?? null,
    displayOrder: row.display_order,
    visible: row.visible,
  };
}

export function mapTestimonial(
  row: {
    id: string;
    author_name: string;
    author_role: string | null;
    author_company: string | null;
    content: string;
    rating: number | null;
    avatar_media_id: string | null;
    featured: boolean;
    display_order: number;
    visible: boolean;
  },
  avatarUrl?: string | null,
): TestimonialRecord {
  return {
    id: row.id,
    authorName: row.author_name,
    authorRole: row.author_role,
    authorCompany: row.author_company,
    content: row.content,
    rating: row.rating,
    avatarMediaId: row.avatar_media_id,
    avatarUrl: avatarUrl ?? null,
    featured: row.featured,
    displayOrder: row.display_order,
    visible: row.visible,
  };
}

export function mapService(row: {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
  visible: boolean;
}): ServiceRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    displayOrder: row.display_order,
    visible: row.visible,
  };
}

export function mapResumeVersion(
  row: {
    id: string;
    title: string;
    file_media_id: string;
    is_active: boolean;
    display_order: number;
    uploaded_at: string;
  },
  file: { public_url: string; original_filename: string },
): ResumeVersionRecord {
  return {
    id: row.id,
    title: row.title,
    fileMediaId: row.file_media_id,
    fileUrl: file.public_url,
    fileName: file.original_filename,
    isActive: row.is_active,
    displayOrder: row.display_order,
    uploadedAt: row.uploaded_at,
  };
}

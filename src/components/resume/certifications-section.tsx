import { ExternalLink } from "lucide-react";
import { Text } from "@/components/typography/text";
import { formatMonthYear } from "@/lib/formatters";
import type { CertificationRecord } from "@/types/cms";

type CertificationsSectionProps = {
  certifications: CertificationRecord[];
};

export function CertificationsSection({
  certifications,
}: CertificationsSectionProps) {
  if (!certifications.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <Text className="font-medium">Certifications</Text>
      <ul className="space-y-3">
        {certifications.map((cert) => (
          <li key={cert.id} className="flex items-start justify-between gap-4">
            <div>
              <Text size="sm" className="font-medium">
                {cert.name}
              </Text>
              <Text size="sm" muted>
                {cert.issuer}
                {cert.issueDate
                  ? ` · ${formatMonthYear(cert.issueDate)}`
                  : ""}
              </Text>
              {cert.credentialId ? (
                <Text size="xs" muted>
                  ID: {cert.credentialId}
                </Text>
              ) : null}
            </div>
            {cert.verificationUrl ? (
              <a
                href={cert.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
              >
                Verify
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

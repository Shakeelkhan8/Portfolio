"use client";

import { Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type DownloadResumeButtonProps = {
  pdfUrl?: string | null;
  fileName?: string;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export function DownloadResumeButton({
  pdfUrl,
  fileName = "resume.pdf",
  variant = "default",
  size = "lg",
  className,
}: DownloadResumeButtonProps) {
  if (pdfUrl) {
    return (
      <a
        href={pdfUrl}
        download={fileName}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant, size }), className)}
      >
        <Download className="size-4" data-icon="inline-start" />
        Download PDF
      </a>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => window.print()}
    >
      <Download className="size-4" data-icon="inline-start" />
      Print / Save as PDF
    </Button>
  );
}

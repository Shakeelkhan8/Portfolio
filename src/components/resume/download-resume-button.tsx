"use client";

import { Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DownloadResumeButtonProps = {
  pdfUrl?: string | null;
  fileName?: string;
};

export function DownloadResumeButton({
  pdfUrl,
  fileName = "resume.pdf",
}: DownloadResumeButtonProps) {
  if (pdfUrl) {
    return (
      <a
        href={pdfUrl}
        download={fileName}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        <Download className="size-4" data-icon="inline-start" />
        Download PDF
      </a>
    );
  }

  return (
    <Button variant="outline" onClick={() => window.print()}>
      <Download className="size-4" data-icon="inline-start" />
      Print resume
    </Button>
  );
}

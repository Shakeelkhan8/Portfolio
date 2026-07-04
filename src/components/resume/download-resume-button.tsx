"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadResumeButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.print()}
    >
      <Download className="size-4" data-icon="inline-start" />
      Download PDF
    </Button>
  );
}

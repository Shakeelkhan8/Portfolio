import { cn } from "@/lib/utils";
import type { PortfolioQrConfig } from "@/types/cms";

type PortfolioQrProps = {
  qr: PortfolioQrConfig | null;
  className?: string;
  /** Visible size of the QR modules in pixels (default 128). */
  size?: number;
  siteName?: string;
};

/**
 * Renders the CMS-configured portfolio QR. Returns null when unset/disabled.
 * Light pad keeps scan contrast on the dark site theme.
 */
export function PortfolioQr({
  qr,
  className,
  size = 128,
  siteName = "portfolio",
}: PortfolioQrProps) {
  if (!qr?.imageUrl) {
    return null;
  }

  return (
    <figure
      className={cn("no-print flex flex-col items-start gap-2.5", className)}
    >
      <div
        className="rounded-xl border border-foreground/10 bg-white p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
        style={{ width: size + 20, height: size + 20 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr.imageUrl}
          alt={`QR code linking to ${siteName}${qr.targetUrl ? ` (${qr.targetUrl})` : " homepage"}`}
          width={size}
          height={size}
          className="size-full rounded-md object-contain"
          decoding="async"
        />
      </div>
      <figcaption className="flex max-w-[9.5rem] flex-col gap-1.5">
        <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {qr.label}
        </span>
        <a
          href={qr.imageUrl}
          download="portfolio-qr"
          className="text-[11px] text-muted-foreground/80 underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          Download QR
        </a>
      </figcaption>
    </figure>
  );
}

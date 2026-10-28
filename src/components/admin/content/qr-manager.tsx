"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  clearPortfolioQrAction,
  generatePortfolioQrAction,
  savePortfolioQrAction,
} from "@/lib/admin/actions/portfolio-qr";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminPortfolioQrData } from "@/lib/db/queries/portfolio-qr";
import type { MediaFileRecord } from "@/types/cms";

type QrManagerProps = {
  qr: AdminPortfolioQrData;
  mediaFiles: MediaFileRecord[];
};

export function QrManager({ qr, mediaFiles }: QrManagerProps) {
  const [generateState, generateAction] = useActionState(
    generatePortfolioQrAction,
    {},
  );
  const [saveState, saveAction] = useActionState(savePortfolioQrAction, {});
  const [clearState, clearAction] = useActionState(clearPortfolioQrAction, {});

  const imageFiles = mediaFiles.filter((file) =>
    ["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(
      file.mimeType,
    ),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="space-y-8">
        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Generate</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a high-quality SVG QR from a public URL. Replaces the
              currently published code.
            </p>
          </div>
          <form action={generateAction} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="generate-targetUrl">Target URL</Label>
              <Input
                id="generate-targetUrl"
                name="targetUrl"
                type="url"
                placeholder="https://your-domain.com"
                defaultValue={qr.targetUrl}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="generate-label">Label</Label>
              <Input
                id="generate-label"
                name="label"
                placeholder="Scan to view on your phone"
                defaultValue={qr.label}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SubmitButton label="Generate & publish" />
            </div>
            <FormMessage {...generateState} />
          </form>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              Upload or select
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use an existing image from Media (PNG, JPEG, WebP, or SVG), or
              clear the selection to hide the QR until you generate a new one.
            </p>
          </div>
          <form action={saveAction} className="grid gap-4">
            <MediaSelect
              id="mediaId"
              name="mediaId"
              label="QR image"
              value={qr.mediaId ?? ""}
              mediaFiles={imageFiles}
              imagesOnly={false}
            />
            <div className="space-y-2">
              <Label htmlFor="save-targetUrl">Target URL (optional note)</Label>
              <Input
                id="save-targetUrl"
                name="targetUrl"
                type="url"
                placeholder="https://your-domain.com"
                defaultValue={qr.targetUrl}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="save-label">Label</Label>
              <Input
                id="save-label"
                name="label"
                placeholder="Scan to view on your phone"
                defaultValue={qr.label}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="enabled"
                name="enabled"
                type="checkbox"
                defaultChecked={qr.enabled}
              />
              <Label htmlFor="enabled">Show on public resume page</Label>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SubmitButton label="Save settings" />
            </div>
            <FormMessage {...saveState} />
          </form>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Remove</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hide the QR on the portfolio. The media file stays in the library
              unless you delete it from Media.
            </p>
          </div>
          <form action={clearAction}>
            <Button type="submit" variant="outline" size="sm">
              Remove from site
            </Button>
            <div className="mt-3">
              <FormMessage {...clearState} />
            </div>
          </form>
        </section>
      </div>

      <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
        <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Preview
        </p>
        {qr.imageUrl && qr.enabled ? (
          <div className="rounded-xl border border-border bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr.imageUrl}
              alt="Current portfolio QR preview"
              width={200}
              height={200}
              className="mx-auto size-[200px] rounded-md object-contain"
            />
          </div>
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            No QR published
          </div>
        )}
        {qr.targetUrl ? (
          <p className="break-all text-xs text-muted-foreground">{qr.targetUrl}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Tip: upload custom artwork via{" "}
          <Link href="/admin/media" className="underline underline-offset-2">
            Media
          </Link>{" "}
          first, then select it here.
        </p>
      </aside>
    </div>
  );
}

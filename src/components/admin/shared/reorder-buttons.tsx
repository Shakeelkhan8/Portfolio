"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { moveDisplayOrderAction } from "@/lib/admin/actions/reorder";
import { Button } from "@/components/ui/button";
import type { ReorderEntity } from "@/lib/validators/reorder";

type ReorderButtonsProps = {
  entity: ReorderEntity;
  id: string;
  scopeKey?: string;
  label?: string;
};

export function ReorderButtons({
  entity,
  id,
  scopeKey,
  label = "Reorder item",
}: ReorderButtonsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleMove(direction: "up" | "down") {
    setError(null);
    const formData = new FormData();
    formData.set("entity", entity);
    formData.set("id", id);
    formData.set("direction", direction);
    if (scopeKey) {
      formData.set("scopeKey", scopeKey);
    }

    startTransition(async () => {
      const result = await moveDisplayOrderAction({}, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className="inline-flex items-center gap-1"
        role="group"
        aria-label={label}
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={pending}
          onClick={() => handleMove("up")}
          aria-label="Move up"
        >
          <ArrowUp className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={pending}
          onClick={() => handleMove("down")}
          aria-label="Move down"
        >
          <ArrowDown className="size-4" />
        </Button>
      </div>
      {error ? (
        <p role="alert" className="max-w-40 text-right text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteItemButtonProps = {
  action: (formData: FormData) => Promise<{ error?: string; success?: string }>;
  id: string;
  label?: string;
  confirmMessage?: string;
};

export function DeleteItemButton({
  action,
  id,
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this item?",
}: DeleteItemButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.set("id", id);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={handleClick}
      >
        <Trash2 className="size-4" data-icon="inline-start" />
        {pending ? "Deleting…" : label}
      </Button>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

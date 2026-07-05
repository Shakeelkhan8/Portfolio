"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteItemButtonProps = {
  action: (formData: FormData) => Promise<{ error?: string; success?: string }>;
  id: string;
  label?: string;
};

export function DeleteItemButton({
  action,
  id,
  label = "Delete",
}: DeleteItemButtonProps) {
  return (
    <form
      action={async (formData) => {
        await action(formData);
      }}
      onSubmit={(event) => {
        if (
          !window.confirm("Are you sure you want to delete this item?")
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm">
        <Trash2 className="size-4" data-icon="inline-start" />
        {label}
      </Button>
    </form>
  );
}

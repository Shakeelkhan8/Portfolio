"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

type EditItemButtonProps = {
  onClick: () => void;
  label?: string;
};

export function EditItemButton({
  onClick,
  label = "Edit",
}: EditItemButtonProps) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <Pencil className="size-4" data-icon="inline-start" />
      {label}
    </Button>
  );
}

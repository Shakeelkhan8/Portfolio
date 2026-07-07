"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deleteServiceAction,
  upsertServiceAction,
} from "@/lib/admin/actions/cms-modules";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceRecord } from "@/types/cms";

type ServicesManagerProps = {
  services: ServiceRecord[];
};

function ServiceForm({
  service,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  service?: ServiceRecord;
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, saveService] = useActionState(upsertServiceAction, {});

  return (
    <form action={saveService} className="grid gap-4 md:grid-cols-2">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor={service ? `title-${service.id}` : "title"}>Title</Label>
        <Input
          id={service ? `title-${service.id}` : "title"}
          name="title"
          defaultValue={service?.title ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={service ? `icon-${service.id}` : "icon"}>
          Lucide icon name
        </Label>
        <Input
          id={service ? `icon-${service.id}` : "icon"}
          name="icon"
          placeholder="Server"
          defaultValue={service?.icon ?? ""}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={service ? `description-${service.id}` : "description"}>
          Description
        </Label>
        <Textarea
          id={service ? `description-${service.id}` : "description"}
          name="description"
          rows={3}
          defaultValue={service?.description ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={service ? `displayOrder-${service.id}` : "displayOrder"}>
          Display order
        </Label>
        <Input
          id={service ? `displayOrder-${service.id}` : "displayOrder"}
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={service?.displayOrder ?? nextDisplayOrder}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id={service ? `visible-${service.id}` : "visible"}
          name="visible"
          type="checkbox"
          defaultChecked={service?.visible ?? true}
        />
        <Label htmlFor={service ? `visible-${service.id}` : "visible"}>
          Visible on site
        </Label>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:col-span-2">
        <SubmitButton label={submitLabel} />
        {onCancel ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
      <div className="md:col-span-2">
        <FormMessage {...state} />
      </div>
    </form>
  );
}

export function ServicesManager({ services }: ServicesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add service</h2>
        <ServiceForm
          nextDisplayOrder={services.length}
          submitLabel="Add service"
        />
      </section>

      <section className="space-y-3">
        {services.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No services yet.
          </p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="rounded-xl border border-border p-4">
              {editingId === service.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit service</h3>
                  <ServiceForm
                    service={service}
                    nextDisplayOrder={service.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    {service.icon ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Icon: {service.icon}
                      </p>
                    ) : null}
                    {!service.visible ? (
                      <p className="mt-1 text-xs text-muted-foreground">Hidden</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <EditItemButton onClick={() => setEditingId(service.id)} />
                    <DeleteItemButton action={deleteServiceAction} id={service.id} />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

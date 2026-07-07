"use client";

import { useActionState } from "react";
import {
  deleteServiceAction,
  upsertServiceAction,
} from "@/lib/admin/actions/cms-modules";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceRecord } from "@/types/cms";

type ServicesManagerProps = {
  services: ServiceRecord[];
};

export function ServicesManager({ services }: ServicesManagerProps) {
  const [state, saveService] = useActionState(upsertServiceAction, {});

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add service</h2>
        <form action={saveService} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Lucide icon name</Label>
            <Input id="icon" name="icon" placeholder="Server" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input
              id="displayOrder"
              name="displayOrder"
              type="number"
              min={0}
              defaultValue={services.length}
            />
          </div>
          <div className="flex items-center gap-2">
            <input id="visible" name="visible" type="checkbox" defaultChecked />
            <Label htmlFor="visible">Visible on site</Label>
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Add service" />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...state} />
        </div>
      </section>

      <section className="space-y-3">
        {services.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No services yet.
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
            >
              <div>
                <p className="font-medium">{service.title}</p>
                <p className="text-sm text-muted-foreground">{service.description}</p>
                {service.icon ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Icon: {service.icon}
                  </p>
                ) : null}
                {!service.visible ? (
                  <p className="mt-1 text-xs text-muted-foreground">Hidden</p>
                ) : null}
              </div>
              <DeleteItemButton action={deleteServiceAction} id={service.id} />
            </div>
          ))
        )}
      </section>
    </div>
  );
}

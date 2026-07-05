"use client";

import { useActionState } from "react";
import {
  deleteNavigationAction,
  upsertNavigationAction,
} from "@/lib/admin/actions/content";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NavigationItemRecord } from "@/types/cms";

type NavigationManagerProps = {
  items: NavigationItemRecord[];
};

const groups: NavigationItemRecord["navGroup"][] = [
  "main",
  "utility",
  "footer",
  "social",
];

export function NavigationManager({ items }: NavigationManagerProps) {
  const [state, saveNavigation] = useActionState(upsertNavigationAction, {});

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add navigation item</h2>
        <form action={saveNavigation} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="navGroup">Group</Label>
            <select
              id="navGroup"
              name="navGroup"
              required
              className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="href">Href</Label>
            <Input id="href" name="href" required placeholder="/about" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={0} />
          </div>
          <div className="flex items-center gap-2">
            <input id="external" name="external" type="checkbox" />
            <Label htmlFor="external">External link</Label>
          </div>
          <div className="flex items-center gap-2">
            <input id="visible" name="visible" type="checkbox" defaultChecked />
            <Label htmlFor="visible">Visible</Label>
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Add navigation item" />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...state} />
        </div>
      </section>

      {groups.map((group) => {
        const groupItems = items.filter((item) => item.navGroup === group);
        if (groupItems.length === 0) return null;

        return (
          <section key={group} className="rounded-xl border border-border p-6">
            <h2 className="mb-4 text-lg font-semibold capitalize">{group}</h2>
            <ul className="space-y-2">
              {groupItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {item.title}{" "}
                      {!item.visible ? (
                        <span className="text-xs text-muted-foreground">(hidden)</span>
                      ) : null}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.href}
                      {item.external ? " · external" : ""} · order {item.displayOrder}
                    </p>
                  </div>
                  <DeleteItemButton
                    action={deleteNavigationAction}
                    id={item.id}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

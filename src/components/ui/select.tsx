"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  /** Lands on the trigger button, so `<Label htmlFor>` and focus-by-id work. */
  id: string;
  /** Name of the hidden input that carries the value into FormData. */
  name: string;
  options: readonly SelectOption[];
  /** Shown while nothing is chosen. An option with value "" is the "none" choice. */
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

/**
 * Styled single select (Base UI). It replaces <select> where the options
 * popup must match the site: a native popup is drawn by the OS and ignores
 * the theme (on Windows, light-grey rows with low-contrast text).
 *
 * Keyboard, typeahead and screen-reader semantics come from Base UI. The
 * popup is at least as wide as the trigger (wider for long labels, capped to
 * the screen), never taller than the space left in the viewport, and scrolls
 * inside itself, so it can't overflow a phone screen.
 * "" maps to Base UI's null, so a placeholder or "none" choice submits "".
 */
export function SelectField({
  id,
  name,
  options,
  placeholder,
  value,
  onValueChange,
  disabled,
  required,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: SelectFieldProps) {
  const items = React.useMemo(
    () =>
      options.map((option) => ({
        value: option.value === "" ? null : option.value,
        label: option.label,
      })),
    [options],
  );

  return (
    <SelectPrimitive.Root
      name={name}
      items={items}
      value={value === "" ? null : value}
      onValueChange={(next) => onValueChange(next ?? "")}
      disabled={disabled}
      required={required}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "group flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-input bg-background/50 py-1 pr-3 pl-3 text-left text-base shadow-xs transition-[color,box-shadow,border-color] outline-none select-none hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:border-foreground/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className,
        )}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
          className="min-w-0 truncate data-[placeholder]:text-muted-foreground"
        />
        <SelectPrimitive.Icon className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[popup-open]:rotate-180">
          <ChevronDown aria-hidden="true" className="size-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          sideOffset={6}
          alignItemWithTrigger={false}
          // Clear the sticky header (4rem) and the phone tab bar (4rem plus
          // the safe area), so the list never opens underneath either.
          collisionPadding={{ top: 76, right: 12, bottom: 96, left: 12 }}
          className="z-50 outline-none"
        >
          <SelectPrimitive.Popup
            className={cn(
              "w-max min-w-[var(--anchor-width)] max-w-[min(26rem,calc(100vw-1.5rem))] origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg shadow-black/40 outline-none",
              "transition-[opacity,transform] duration-150 ease-out data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0",
            )}
          >
            <SelectPrimitive.List className="max-h-[min(var(--available-height),20rem)] overflow-y-auto overscroll-contain p-1">
              {items.map((item) => (
                <SelectPrimitive.Item
                  key={item.value ?? "__none"}
                  value={item.value}
                  className="grid min-h-10 cursor-default grid-cols-[1fr_1rem] items-center gap-3 rounded-lg px-3 py-2 text-sm leading-snug text-foreground/85 outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-foreground data-[selected]:text-foreground"
                >
                  <SelectPrimitive.ItemText className="min-w-0 break-words">
                    {item.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="text-signal">
                    <Check aria-hidden="true" className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

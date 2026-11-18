"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState } from "react";

export function CheckboxList({
  className,
  items = ["Макет", "Прототип", "Проверка"],
  onChange,
}: {
  className?: string;
  items?: string[];
  onChange?: (items: string[]) => void;
}) {
  const [checked, setSelected] = useState<string[]>([]);
  const selected = checked.filter((value) => items.includes(value));
  return (
    <fieldset className={cn(surfacePanel + " grid min-w-44 gap-2", className)}>
      <legend className="rounded-full border bg-card px-2 font-mono text-[10px] tabular-nums">
        {selected.length} / {items.length}
      </legend>
      {items.map((item) => (
        <label
          key={item}
          className="flex min-h-8 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 hover:bg-muted"
        >
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={selected.includes(item)}
            onChange={(e) => {
              const next = e.target.checked
                ? [...selected, item]
                : selected.filter((x) => x !== item);
              setSelected(next);
              onChange?.(next);
            }}
          />
          <span
            className={
              selected.includes(item)
                ? "text-muted-foreground line-through"
                : ""
            }
          >
            {item}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

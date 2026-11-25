// Ported from Kokonut UI (https://kokonutui.com/docs/inputs/wheel-picker).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState, useRef } from "react";

export function WheelPicker({
  className,
  items = ["08:00", "09:00", "10:00", "11:00", "12:00"],
  label = "Время",
  onChange,
}: {
  className?: string;
  items?: string[];
  label?: string;
  onChange?: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [requested, setActive] = useState(0);
  const active = Math.min(requested, Math.max(0, items.length - 1));
  function select(i: number) {
    if (i !== active && items[i] !== undefined) {
      setActive(i);
      onChange?.(items[i]);
    }
  }
  function focusOption(i: number) {
    const node = ref.current?.querySelectorAll("button")[i];
    if (!node) return;
    select(i);
    ref.current?.scrollTo({ top: i * node.offsetHeight });
  }
  if (!items.length) return null;
  return (
    <div
      className={cn(
        surfacePanel + " relative w-36 overflow-hidden p-0",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-8 h-8 rounded-md border border-foreground/10 bg-muted"
      />
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className="relative h-24 snap-y snap-mandatory overflow-y-auto overscroll-contain py-8 text-center [scrollbar-width:none]"
        onScroll={(e) => {
          const i = Math.min(
            items.length - 1,
            Math.max(
              0,
              Math.round(
                e.currentTarget.scrollTop /
                  (e.currentTarget.querySelector("button")?.offsetHeight || 32),
              ),
            ),
          );
          select(i);
        }}
      >
        {items.map((v, i) => (
          <button
            type="button"
            key={v}
            aria-pressed={active === i}
            tabIndex={active === i ? 0 : -1}
            className={
              "block h-8 w-full snap-center text-sm " +
              (active === i
                ? "font-semibold tracking-wide"
                : "scale-95 text-muted-foreground")
            }
            onKeyDown={(e) => {
              const next = (
                {
                  ArrowDown: Math.min(items.length - 1, i + 1),
                  ArrowUp: Math.max(0, i - 1),
                  Home: 0,
                  End: items.length - 1,
                } as Record<string, number>
              )[e.key];
              if (next !== undefined) {
                e.preventDefault();
                ref.current
                  ?.querySelectorAll("button")
                  [next]?.focus({ preventScroll: true });
              }
            }}
            onFocus={() => focusOption(i)}
            onClick={() => focusOption(i)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

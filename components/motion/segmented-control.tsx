"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { ElasticIndicator } from "@/lib/takt-indicator";

export function SegmentedControl({
  className,
  options = ["День", "Неделя", "Месяц"],
  onChange,
}: {
  className?: string;
  options?: string[];
  onChange?: (index: number) => void;
}) {
  const [requested, setIndex] = useState(0);
  const index = Math.min(requested, Math.max(0, options.length - 1));
  if (!options.length) return null;
  return (
    <div className={cn("grid gap-3", className)}>
      <div
        role="group"
        aria-label="Период"
        className="relative flex items-center rounded-2xl border border-foreground/10 bg-muted p-1"
      >
        <span aria-hidden className="absolute inset-1 rounded-[inherit]">
          <ElasticIndicator
            count={options.length}
            index={index}
            className="border border-foreground/10 bg-card shadow-sm"
          />
        </span>
        {options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              onChange?.(i);
            }}
            className="relative min-h-9 flex-1 cursor-pointer rounded-xl px-4 text-xs font-medium"
          >
            <span
              className={
                i === index
                  ? "relative text-primary"
                  : "relative text-foreground/75"
              }
            >
              {opt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

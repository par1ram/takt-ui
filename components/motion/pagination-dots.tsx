"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { panel } from "@/lib/takt-surface";
export function PaginationDots({
  className,
  pages = 5,
  onChange,
}: {
  className?: string;
  pages?: number;
  onChange?: (index: number) => void;
}) {
  const [selected, setSelected] = useState(0);
  const total = Number.isFinite(pages) ? Math.max(0, Math.floor(pages)) : 0;
  const index = Math.max(0, Math.min(total - 1, selected));
  const start = Math.max(0, Math.min(index - 2, total - 5));
  function select(i: number) {
    if (i < 0 || i >= total) return;
    setSelected(i);
    onChange?.(i);
  }
  return (
    <div className={cn(panel + " grid justify-items-center gap-2", className)}>
      <output className="font-mono text-lg tabular-nums">
        {total ? String(index + 1).padStart(2, "0") : "00"}{" "}
        <span className="text-xs text-muted-foreground">/ {total}</span>
      </output>
      <div
        className="flex items-center gap-1"
        onKeyDown={(e) => {
          const n = (
            {
              Home: 0,
              End: total - 1,
              ArrowRight: Math.min(index + 1, total - 1),
              ArrowLeft: Math.max(0, index - 1),
            } as Record<string, number>
          )[e.key];
          if (n !== undefined && total) {
            e.preventDefault();
            select(n);
            const node = e.currentTarget;
            requestAnimationFrame(() =>
              node
                .querySelector<HTMLButtonElement>('[aria-current="page"]')
                ?.focus(),
            );
          }
        }}
      >
        {Array.from({ length: Math.min(total, 5) }, (_, i) => i + start).map(
          (i) => (
            <button
              key={i}
              type="button"
              tabIndex={i === index ? 0 : -1}
              aria-label={"Страница " + (i + 1)}
              aria-current={i === index ? "page" : undefined}
              onClick={() => select(i)}
              className="grid h-9 min-w-5 place-items-center rounded-full px-1"
            >
              <i
                className={
                  "h-2 rounded-full bg-primary motion-safe:transition-[width,opacity] motion-safe:duration-300 " +
                  (i === index ? "w-6" : "w-2 opacity-35")
                }
              />
            </button>
          ),
        )}
      </div>
    </div>
  );
}

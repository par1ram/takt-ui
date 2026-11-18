"use client";
import { cn } from "@/lib/utils";

import { useState, useId } from "react";
import { ElasticIndicator } from "@/lib/takt-indicator";

export function TabPill({
  className,
  options = ["Обзор", "Файлы", "Команда"],
  onChange,
  panels = ["Последние изменения", "Файлы проекта", "Участники проекта"],
}: {
  className?: string;
  options?: string[];
  onChange?: (index: number) => void;
  panels?: string[];
}) {
  const [requested, setIndex] = useState(0);
  const index = Math.min(requested, Math.max(0, options.length - 1));
  const id = useId();
  if (!options.length) return null;
  return (
    <div className={cn("grid gap-3", className)}>
      <div
        role="tablist"
        aria-label="Вкладки"
        className="relative flex items-center rounded-full border border-foreground/10 bg-muted p-1 shadow-inner"
      >
        <span aria-hidden className="absolute inset-1 rounded-[inherit]">
          <ElasticIndicator
            count={options.length}
            index={index}
            className="bg-primary shadow-sm"
          />
        </span>
        {options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            role="tab"
            id={id + "-tab-" + i}
            aria-selected={i === index}
            aria-controls={id + "-panel"}
            tabIndex={i === index ? 0 : -1}
            onKeyDown={(e) => {
              const next = (
                {
                  ArrowRight: (i + 1) % options.length,
                  ArrowLeft: (i + options.length - 1) % options.length,
                  Home: 0,
                  End: options.length - 1,
                } as Record<string, number>
              )[e.key];
              if (next === undefined) return;
              e.preventDefault();
              setIndex(next);
              onChange?.(next);
              document.getElementById(id + "-tab-" + next)?.focus();
            }}
            onClick={() => {
              setIndex(i);
              onChange?.(i);
            }}
            className="relative min-h-9 flex-1 cursor-pointer rounded-full px-3 text-xs font-medium"
          >
            <span
              className={
                i === index
                  ? "relative text-primary-foreground"
                  : "relative text-foreground/75"
              }
            >
              {opt}
            </span>
          </button>
        ))}
      </div>
      <div
        className="min-h-6 px-2 py-1 text-xs text-muted-foreground"
        id={id + "-panel"}
        role="tabpanel"
        aria-labelledby={id + "-tab-" + index}
      >
        {panels[index] ?? options[index]}
      </div>
    </div>
  );
}

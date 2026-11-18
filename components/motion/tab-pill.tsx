"use client";
import { cn } from "@/lib/utils";

import { useState, useId } from "react";
import { motion, useReducedMotion } from "motion/react";

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
  const reduced = useReducedMotion();
  if (!options.length) return null;
  return (
    <div className={cn("grid min-w-0 max-w-full gap-3", className)}>
      <motion.div
        layoutScroll
        role="tablist"
        aria-label="Вкладки"
        className="relative flex w-fit max-w-full items-center overflow-x-auto [scrollbar-width:none] rounded-full border border-foreground/10 bg-muted p-1 shadow-inner"
      >
        {options.map((opt, i) => (
          <button
            key={i}
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
            className="relative min-h-9 shrink-0 whitespace-nowrap cursor-pointer rounded-full px-3 text-xs font-medium"
          >
            {i === index && (
              <motion.span
                aria-hidden="true"
                layoutId={reduced ? undefined : id}
                initial={false}
                transition={{ type: "spring", stiffness: 480, damping: 36 }}
                className="pointer-events-none absolute inset-0 rounded-[inherit] bg-primary shadow-sm"
              />
            )}
            <span
              className={
                i === index
                  ? "relative z-10 text-primary-foreground"
                  : "relative z-10 text-foreground/75"
              }
            >
              {opt}
            </span>
          </button>
        ))}
      </motion.div>
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

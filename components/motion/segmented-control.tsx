"use client";
import { cn } from "@/lib/utils";

import { useState, useId } from "react";
import { motion, useReducedMotion } from "motion/react";

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
  const id = useId();
  const reduced = useReducedMotion();
  if (!options.length) return null;
  return (
    <div className={cn("grid min-w-0 max-w-full gap-3", className)}>
      <motion.div
        layoutScroll
        role="group"
        aria-label="Период"
        className="relative flex w-fit max-w-full items-center overflow-x-auto [scrollbar-width:none] rounded-2xl border border-foreground/10 bg-muted p-1"
      >
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              onChange?.(i);
            }}
            className="relative min-h-9 shrink-0 whitespace-nowrap cursor-pointer rounded-xl px-4 text-xs font-medium"
          >
            {i === index && (
              <motion.span
                aria-hidden="true"
                layoutId={reduced ? undefined : id}
                initial={false}
                transition={{ type: "spring", stiffness: 480, damping: 36 }}
                className="pointer-events-none absolute inset-0 rounded-[inherit] border border-foreground/10 bg-card shadow-sm"
              />
            )}
            <span
              className={
                i === index
                  ? "relative z-10 text-primary"
                  : "relative z-10 text-foreground/75"
              }
            >
              {opt}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}

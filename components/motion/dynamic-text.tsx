// Ported from Kokonut UI (https://kokonutui.com/docs/texts/dynamic-text).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function DynamicText({
  className,
  prefix = "Создавай",
  words = ["формы", "связи", "движение"],
}: {
  className?: string;
  prefix?: string;
  words?: string[];
}) {
  const [requested, setIndex] = useState(0);
  const index = Math.min(requested, Math.max(0, words.length - 1));
  const reduced = useReducedMotion();
  if (!words.length) return null;
  return (
    <button
      type="button"
      className={cn(
        "grid justify-items-start gap-0.5 rounded-md text-left font-serif text-3xl leading-tight tracking-tight",
        className,
      )}
      onClick={() => setIndex((index + 1) % Math.max(1, words.length))}
    >
      <span className="text-sm font-sans text-muted-foreground">{prefix}</span>
      <span className="inline-grid overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.strong
            exit={reduced ? { opacity: 0 } : { y: -16, opacity: 0, rotate: -3 }}
            key={index}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-start-1 row-start-1 inline-block pb-0.5"
          >
            {words[index]}
          </motion.strong>
        </AnimatePresence>
      </span>
    </button>
  );
}

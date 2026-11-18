"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RefreshCw } from "lucide-react";

export function RollingText({
  className,
  words = ["Привет", "Bonjour", "Hello"],
}: {
  className?: string;
  words?: string[];
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  if (!words.length) return null;
  const word = words[index % words.length];
  return (
    <button
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          setIndex(
            (i) =>
              (i + (e.key === "ArrowRight" ? 1 : words.length - 1)) %
              words.length,
          );
        }
      }}
      type="button"
      aria-label={word + " — сменить слово"}
      onClick={() => setIndex((i) => i + 1)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-4 overflow-hidden rounded-md px-2 py-1 text-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="flex overflow-hidden font-serif text-[43px] leading-tight tracking-[-0.04em]"
      >
        {Array.from(word).map((letter, i) => (
          <motion.span
            key={index + "-" + i}
            initial={index && !reduced ? { y: "100%" } : false}
            animate={{ y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.46,
              delay: reduced ? 0 : Math.min(i, 10) * 0.029,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </span>
      <span className="grid size-8 place-items-center rounded-full bg-muted">
        <RefreshCw size={14} aria-hidden />
      </span>
    </button>
  );
}

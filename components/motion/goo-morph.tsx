"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function GooMorph({
  className,
  words = ["Жидкость", "Форма", "Контур"],
}: {
  className?: string;
  words?: string[];
}) {
  const [requested, setIndex] = useState(0);
  const index = Math.min(requested, Math.max(0, words.length - 1));
  const reduced = useReducedMotion();
  if (!words.length) return null;
  return (
    <button
      type="button"
      aria-label="Сменить надпись"
      className={cn(
        "inline-grid place-items-center overflow-hidden rounded-lg px-3 py-2 text-[40px] leading-tight font-black tracking-[-.07em]",
        className,
      )}
      onClick={() => setIndex((index + 1) % Math.max(1, words.length))}
    >
      <AnimatePresence initial={false}>
        <motion.span
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, filter: "blur(2.5px)", scaleX: 1.06 }
          }
          key={index}
          className="col-start-1 row-start-1 inline-block"
          initial={
            reduced
              ? false
              : { filter: "blur(2px)", scaleX: 0.83, scaleY: 1.13 }
          }
          animate={{ filter: "blur(0px)", scaleX: 1, scaleY: 1 }}
          transition={{
            duration: reduced ? 0 : 0.4,
            ease: [0.18, 0.85, 0.25, 1],
          }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

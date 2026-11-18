"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";

export function WeightWave({
  className,
  text = "Амплитуда",
}: {
  className?: string;
  text?: string;
}) {
  const [index, setIndex] = useState(-1);
  const letters = Array.from(text);
  if (!letters.length) return null;
  return (
    <button
      type="button"
      aria-label={text}
      className={cn(
        "cursor-pointer whitespace-pre-wrap text-4xl tracking-[-.055em]",
        className,
      )}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          setIndex(
            ((index < 0 && e.key === "ArrowLeft" ? 0 : index) +
              (e.key === "ArrowRight" ? 1 : -1) +
              letters.length) %
              letters.length,
          );
        }
      }}
      onBlur={() => setIndex(-1)}
      onPointerLeave={() => setIndex(-1)}
      onClick={() => setIndex((index + 1) % letters.length)}
    >
      {letters.map((v, i) => (
        <span
          key={i}
          aria-hidden
          onPointerEnter={() => setIndex(i)}
          className="inline-block motion-safe:transition-[font-weight,translate] duration-350 ease-out motion-reduce:translate-none!"
          style={{
            fontWeight:
              index < 0
                ? 450
                : 350 + 550 * Math.exp(-Math.pow((i - index) / 1.65, 2)),
            translate:
              index < 0
                ? "none"
                : "0 " + -Math.max(0, 4 - Math.abs(i - index) * 2) + "px",
          }}
        >
          {v}
        </span>
      ))}
    </button>
  );
}

"use client";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";

export function ScrambleText({
  className,
  text = "SIGNAL",
}: {
  className?: string;
  text?: string;
}) {
  const [frame, setFrame] = useState(12);

  useEffect(() => {
    if (frame >= 12) return;
    const timer = setTimeout(() => setFrame(frame + 1), 32);
    return () => clearTimeout(timer);
  }, [frame]);
  return (
    <button
      type="button"
      className={cn(
        "rounded-xl border border-foreground/10 bg-card px-4 py-2.5 font-mono text-3xl font-semibold tracking-[.085em] text-card-foreground shadow-sm",
        className,
      )}
      aria-label={text + " — расшифровать"}
      onClick={() =>
        setFrame(
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 12
            : 0,
        )
      }
    >
      <span aria-hidden>
        {Array.from(text).map((v, i, letters) => {
          const settled =
            i < Math.ceil((letters.length * frame) / 12) || /\s/.test(v);
          return (
            <span
              key={i}
              className={
                settled ? "" : "text-primary"
              }
            >
              {settled ? v : "◒◇+≋⌁"[(i + frame) % 5]}
            </span>
          );
        })}
      </span>
    </button>
  );
}

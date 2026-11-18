"use client";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";

export function Typewriter({
  className,
  text = "Движение начинается.",
  interval = 45,
}: {
  className?: string;
  text?: string;
  interval?: number;
}) {
  const [length, setLength] = useState(Array.from(text).length);

  useEffect(() => {
    if (length >= Array.from(text).length) return;
    const timer = setTimeout(
      () => setLength((i) => i + 1),
      Math.max(12, interval) *
        (/[.,!?…]/.test(Array.from(text)[length - 1] ?? "") ? 3 : 1),
    );
    return () => clearTimeout(timer);
  }, [length, text, interval]);
  return (
    <button
      type="button"
      aria-label={"Напечатать: " + text}
      className={cn(
        "w-56 rounded-xl border border-foreground/10 bg-card px-3 py-3 text-left font-mono text-sm font-medium text-card-foreground shadow-sm",
        className,
      )}
      onClick={() =>
        setLength(
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? Array.from(text).length
            : 0,
        )
      }
    >
      <span aria-hidden>
        <i className="mr-2 text-muted-foreground not-italic">›</i>
        {Array.from(text).slice(0, length).join("")}
        <i className="ml-0.5 inline-block h-[1em] w-px align-[-.1em] bg-current motion-safe:animate-pulse" />
      </span>
    </button>
  );
}

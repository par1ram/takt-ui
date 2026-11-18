"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarRating({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (value: number) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <div
      className={cn(
        surfacePanel + " flex flex-wrap items-center justify-center gap-1",
        className,
      )}
      role="group"
      aria-label="Оценка"
      onPointerLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          type="button"
          key={i}
          aria-label={i + " из 5"}
          aria-pressed={rating === i}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(0)}
          onPointerEnter={() => setHover(i)}
          onClick={() => {
            setRating(i);
            onChange?.(i);
          }}
          className="grid size-8 place-items-center rounded-lg hover:bg-muted motion-safe:transition-colors"
        >
          <Star
            key={rating === i ? "rated" : "idle"}
            className={
              rating === i
                ? "motion-safe:animate-in motion-safe:zoom-in-50 text-primary"
                : ""
            }
            size={21}
            fill={i <= (hover || rating) ? "currentColor" : "none"}
          />
        </button>
      ))}
      <output className="ml-1 min-w-8 pl-1 font-mono text-xs tabular-nums">
        {hover || rating}/5
      </output>
    </div>
  );
}

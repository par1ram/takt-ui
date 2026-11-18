"use client";
import { cn } from "@/lib/utils";
import {
  panel as surfacePanel,
  secondary as surfaceSecondary,
} from "@/lib/takt-surface";

import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";

export function StreamingReply({
  className,
  text = "В основе интерфейса лежат ритм, контраст и движение.",
}: {
  className?: string;
  text?: string;
}) {
  const [revealed, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const count = Math.min(revealed, words.length);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!running || count >= words.length) return;
    const id = setTimeout(() => setCount((i) => i + 1), 85);
    return () => clearTimeout(id);
  }, [running, count, words.length]);
  return (
    <div className={cn(surfacePanel + " grid w-56 gap-2", className)}>
      <p className="min-h-16 rounded-lg bg-muted px-3 py-2.5 text-sm leading-relaxed">
        {count
          ? words.slice(0, count).map((word, i) => (
              <span
                key={i}
                className="inline-block whitespace-pre motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
              >
                {word}{" "}
              </span>
            ))
          : "Предпросмотр ответа"}
        {running && count < words.length && (
          <i
            aria-hidden
            className="inline-block size-1.5 rounded-full bg-primary motion-safe:animate-pulse"
          />
        )}
      </p>
      <progress
        aria-label="Готовность ответа"
        max={Math.max(1, words.length)}
        value={count}
        className="h-1 w-full overflow-hidden rounded-full accent-primary"
      />
      <button
        type="button"
        className={surfaceSecondary}
        disabled={!words.length}
        onClick={() => {
          if (running && count < words.length) {
            setRunning(false);
            return;
          }
          if (count === words.length) setCount(0);
          if (reduced) setCount(words.length);
          setRunning(true);
        }}
      >
        {running && count < words.length
          ? "Приостановить"
          : count === words.length
            ? "Повторить"
            : count
              ? "Продолжить"
              : "Показать ответ"}
      </button>
    </div>
  );
}

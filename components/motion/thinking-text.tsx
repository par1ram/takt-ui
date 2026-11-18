"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState } from "react";

export function ThinkingText({
  className,
  label = "Формирую ответ…",
}: {
  className?: string;
  label?: string;
}) {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      className={cn(surfacePanel + " font-medium", className)}
      aria-pressed={active}
      onClick={() => setActive(!active)}
    >
      <span aria-label={active ? label : "Начать обработку"}>
        {active
          ? Array.from(label).map((v, i) => (
              <span
                key={i}
                aria-hidden
                className="motion-safe:animate-pulse"
                style={{
                  animationDelay: i * 55 + "ms",
                  animationDuration: "1.6s",
                }}
              >
                {v}
              </span>
            ))
          : "Начать обработку"}
      </span>
    </button>
  );
}

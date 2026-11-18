"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState } from "react";

export function Scrubber({
  className,
  frames = 60,
  onChange,
}: {
  className?: string;
  frames?: number;
  onChange?: (frame: number) => void;
}) {
  const end = Math.max(0, Math.floor(frames) || 0);
  const [position, setFrame] = useState(12);
  const frame = Math.min(position, end);
  return (
    <label className={cn(surfacePanel + " grid w-56 gap-2", className)}>
      <span className="flex justify-between text-xs">
        Кадр{" "}
        <output className="font-mono">
          {frame} / {frames}
        </output>
      </span>
      <span
        className="relative has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 h-8 rounded-sm border-b border-foreground/25 bg-muted text-muted-foreground"
        style={{
          background:
            "repeating-linear-gradient(90deg,currentColor 0 1px,transparent 1px 8px)",
        }}
      >
        <i
          className="absolute -top-1 h-9 w-[2px] -translate-x-1/2 rounded bg-primary before:absolute before:-left-1 before:h-2 before:w-2.5 before:rounded-sm before:bg-primary"
          style={{ left: (frame / Math.max(1, end)) * 100 + "%" }}
        />
        <input
          className="absolute inset-0 w-full cursor-ew-resize opacity-0"
          aria-label="Кадр"
          type="range"
          min={0}
          max={end}
          value={frame}
          onChange={(e) => {
            setFrame(+e.target.value);
            onChange?.(+e.target.value);
          }}
        />
      </span>
    </label>
  );
}

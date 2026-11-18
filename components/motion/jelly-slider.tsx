"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export function JellySlider({
  className,
  label = "Упругость",
  onChange,
}: {
  className?: string;
  label?: string;
  onChange?: (value: number) => void;
}) {
  const [level, setLevel] = useState(45);
  const [drag, setDrag] = useState(false);
  const reduced = useReducedMotion();
  return (
    <label className={cn(surfacePanel + " grid w-52 gap-3", className)}>
      <span className="flex justify-between">
        {label}
        <output>{level}%</output>
      </span>
      <span className="relative mx-2 h-5 rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4">
        <span className="absolute inset-x-0 top-2 h-1 rounded bg-muted-foreground/40" />
        <span
          aria-hidden
          className="absolute inset-x-0 top-2 h-1 origin-left rounded bg-primary"
          style={{ transform: "scaleX(" + level / 100 + ")" }}
        />
        {drag && (
          <span
            aria-hidden
            className="absolute bottom-7 -translate-x-1/2 rounded-md bg-primary px-1.5 py-1 font-mono text-[10px] text-primary-foreground motion-safe:animate-in motion-safe:slide-in-from-bottom-1"
            style={{ left: level + "%" }}
          >
            {level}
          </span>
        )}
        <motion.span
          style={{ left: level + "%", x: "-50%" }}
          animate={{
            scaleX: drag && !reduced ? 1.22 : 1,
            scaleY: drag && !reduced ? 0.8 : 1,
          }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 215, damping: 24 }
          }
          className="absolute top-0 size-5 rounded-full bg-primary"
        />
        <input
          type="range"
          className="absolute inset-0 w-full opacity-0"
          aria-label={label}
          value={level}
          onPointerDown={(e) => {
            if (e.isPrimary && e.button === 0) {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDrag(true);
            }
          }}
          onLostPointerCapture={() => setDrag(false)}
          onPointerUp={() => setDrag(false)}
          onPointerCancel={() => setDrag(false)}
          onBlur={() => setDrag(false)}
          onChange={(e) => {
            setLevel(+e.target.value);
            onChange?.(+e.target.value);
          }}
        />
      </span>
    </label>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Bell } from "lucide-react";

export function BellButton({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (on: boolean) => void;
}) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      aria-label="Оповещения"
      aria-pressed={on}
      className={cn(
        surfacePanel + " relative grid size-14 place-items-center rounded-full",
        className,
      )}
      onClick={() => {
        setOn(!on);
        onChange?.(!on);
      }}
    >
      <motion.span
        initial={false}
        animate={{
          rotate: useReducedMotion() ? 0 : on ? [0, -20, 16, -8, 0] : 0,
        }}
      >
        <Bell size={22} fill={on ? "currentColor" : "none"} />
      </motion.span>
      {on && (
        <i
          aria-hidden
          className="pointer-events-none absolute inset-2 rounded-full border border-primary/60 opacity-0 motion-safe:animate-ping [animation-iteration-count:1] [animation-duration:700ms]"
        />
      )}
      {on && (
        <span className="absolute top-1 right-1 size-3 rounded-full border-2 border-card bg-primary" />
      )}
    </button>
  );
}

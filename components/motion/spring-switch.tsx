"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Bell, BellOff } from "lucide-react";

export function SpringSwitch({
  className,
  label = "Уведомления",
  defaultChecked = true,
  checked,
  onCheckedChange,
}: {
  className?: string;
  label?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
}) {
  const [internal, setInternal] = useState(defaultChecked);
  const active = checked ?? internal;
  const reduced = useReducedMotion();
  const Icon = active ? Bell : BellOff;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => {
        if (checked === undefined) setInternal(!active);
        onCheckedChange?.(!active);
      }}
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 rounded-[20px] border border-foreground/10 bg-card p-3 pr-4 text-sm font-medium text-card-foreground shadow-[0_8px_18px_-10px_#0005]",
        className,
      )}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-muted">
        <Icon aria-hidden size={17} strokeWidth={1.7} />
      </span>
      {label}
      <span
        aria-hidden
        className={
          "relative inline-flex h-6 w-10 rounded-full p-[3px] " +
          (active ? "bg-primary" : "bg-muted-foreground/50")
        }
      >
        <motion.span
          initial={false}
          animate={{ x: active ? 16 : 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 260, damping: 25 }
          }
          className="grid size-[18px] place-items-center rounded-full bg-primary-foreground shadow-[0_1px_3px_#0004]"
        >
          <i
            className={
              "h-1.5 rounded-full " +
              (active
                ? "w-1 bg-primary"
                : "w-1.5 border border-neutral-500")
            }
          />
        </motion.span>
      </span>
    </button>
  );
}

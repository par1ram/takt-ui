"use client";
import { cn } from "@/lib/utils";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { House, Layers, Heart, type LucideIcon } from "lucide-react";

const defaults = [
  { label: "Главная", icon: House },
  { label: "Слои", icon: Layers },
  { label: "Избранное", icon: Heart },
];

export function SpringDock({
  className,
  items = defaults,
  onChange,
}: {
  className?: string;
  items?: { label: string; icon: LucideIcon }[];
  onChange?: (index: number) => void;
}) {
  const [requested, setActive] = useState(0);
  const active = Math.min(requested, Math.max(0, items.length - 1));
  const id = useId();
  const reduced = useReducedMotion();
  if (!items.length) return null;
  return (
    <div
      role="group"
      aria-label="Переключатель разделов"
      className={cn(
        "inline-flex items-center gap-1 rounded-2xl border border-foreground/10 bg-card p-1.5 shadow-sm",
        className,
      )}
    >
      {items.map(({ label, icon: Icon }, index) => (
        <button
          type="button"
          key={label}
          aria-label={label}
          aria-pressed={active === index}
          onClick={() => {
            setActive(index);
            onChange?.(index);
          }}
          className="group relative flex h-10 cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-2xl px-3"
          title={label}
        >
          {active === index && (
            <motion.span
              aria-hidden
              layoutId={id}
              className="absolute inset-0 rounded-2xl bg-primary shadow-[inset_0_1px_1px_#ffffff30,0_2px_3px_#0002]"
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 410, damping: 27 }
              }
            />
          )}
          <Icon
            aria-hidden
            className="relative size-[21px] motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-active:scale-90"
            strokeWidth={1.65}
            color={
              active === index
                ? "var(--primary-foreground)"
                : "var(--muted-foreground)"
            }
          />
          <motion.span
            initial={false}
            animate={{
              width: index === active ? "auto" : 0,
              opacity: index === active ? 1 : 0,
            }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 360, damping: 30 }
            }
            aria-hidden
            className="relative overflow-hidden text-xs font-medium whitespace-nowrap text-primary-foreground"
          >
            {label}
          </motion.span>
        </button>
      ))}
    </div>
  );
}

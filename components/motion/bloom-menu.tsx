"use client";
import { cn } from "@/lib/utils";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Plus,
  Music2,
  Image as Picture,
  Type,
  type LucideIcon,
} from "lucide-react";

const defaults = [
  { label: "Фото", icon: Picture },
  { label: "Звук", icon: Music2 },
  { label: "Текст", icon: Type },
];
export function BloomMenu({
  className,
  actions = defaults,
  onSelect,
}: {
  className?: string;
  actions?: { label: string; icon: LucideIcon }[];
  onSelect?: (label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState("");
  const [last, setLast] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  return (
    <div
      className={cn(
        "relative grid h-32 w-48 place-items-center pt-9",
        className,
      )}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <motion.button
        type="button"
        ref={trigger}
        aria-label="Действия"
        aria-expanded={open}
        onClick={() => {
          setHovered("");
          setOpen((x) => !x);
        }}
        className="grid size-12 cursor-pointer place-items-center rounded-full border border-white/10 bg-[linear-gradient(150deg,#51635b,#222a26)] text-white shadow-[inset_0_1px_1px_#fffa,0_6px_15px_-5px_#0007]"
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: reduced ? 0 : 0.2 }}
      >
        <Plus size={22} />
      </motion.button>
      <AnimatePresence>
        {open &&
          actions.map(({ label, icon: Icon }, i) => {
            const angle =
              actions.length === 1
                ? Math.PI / 2
                : Math.PI * (0.14 + (0.72 * i) / (actions.length - 1));
            return (
              <motion.button
                key={label}
                type="button"
                aria-label={label}
                title={label}
                onFocus={() => setHovered(label)}
                onPointerEnter={() => setHovered(label)}
                onPointerLeave={() => setHovered("")}
                className="absolute top-[calc(50%_-_2px)] left-[calc(50%_-_18px)] grid size-9 cursor-pointer place-items-center rounded-full border border-foreground/10 bg-card text-card-foreground shadow-[0_3px_6px_#0002]"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.65 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: Math.cos(angle) * 65,
                  y: -Math.sin(angle) * 53,
                }}
                exit={{ opacity: 0, x: 0, y: 0, scale: reduced ? 1 : 0.7 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 230,
                        damping: 15,
                        delay: i * 0.025,
                      }
                }
                onClick={() => {
                  setLast(label);
                  setOpen(false);
                  trigger.current?.focus();
                  onSelect?.(label);
                }}
              >
                <Icon size={16} />
              </motion.button>
            );
          })}
      </AnimatePresence>
      <span
        aria-live="polite"
        className="absolute -bottom-2 text-xs font-medium text-foreground"
      >
        {open ? hovered : last}
      </span>
    </div>
  );
}

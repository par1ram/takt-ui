"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
export function FanCards({
  className,
  cards = ["♣", "♢", "♤"],
}: {
  className?: string;
  cards?: string[];
}) {
  const [open, setOpen] = useState(false),
    [raised, setRaised] = useState<number | null>(null);
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label="Веер карточек"
      onClick={() => {
        setOpen(!open);
        setRaised(null);
      }}
      onPointerLeave={() => setRaised(null)}
      onPointerMove={(e) => {
        if (!open || e.pointerType !== "mouse") return;
        const b = e.currentTarget.getBoundingClientRect();
        setRaised(
          Math.max(
            0,
            Math.min(
              cards.length - 1,
              Math.floor(((e.clientX - b.left) / b.width) * cards.length),
            ),
          ),
        );
      }}
      className={cn(
        "relative h-[150px] w-56 select-none rounded-xl",
        className,
      )}
    >
      {cards.map((s, i) => {
        const distance = i - (cards.length - 1) / 2;
        return (
          <motion.span
            key={i}
            initial={false}
            animate={{
              rotate: distance * (open ? 24 : 5),
              x: distance * (open ? 28 : 5),
              y: open && raised === i ? -10 : 0,
            }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 135, damping: 23, mass: 1.08 }
            }
            className="pointer-events-none absolute left-[calc(50%-40px)] top-3 flex h-28 w-20 origin-[50%_95%] flex-col justify-between rounded-lg border border-black/15 bg-[#f4f2eb] p-2 text-[#29453c] shadow-[0_3px_8px_#0002]"
          >
            <span className="self-start font-mono text-[10px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="self-center font-serif text-4xl">{s}</span>
            <span className="self-end font-mono text-[10px]">
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.span>
        );
      })}
    </button>
  );
}

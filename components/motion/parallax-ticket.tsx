"use client";
import { cn } from "@/lib/utils";

import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useState } from "react";
import { orbitCover } from "@/lib/takt-art-orbit";
import { Ticket } from "lucide-react";

export function ParallaxTicket({
  className,
  title = "Motion Night",
  date = "18 NOV",
  cover = orbitCover,
}: {
  className?: string;
  title?: string;
  date?: string;
  cover?: string;
}) {
  const [back, setBack] = useState(false);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(x);
  const ry = useSpring(y);
  return (
    <motion.button
      type="button"
      aria-description={title + " — оборот билета"}
      aria-pressed={back}
      onClick={() => setBack(!back)}
      className={cn(
        "relative w-56 overflow-hidden rounded-[16px] bg-[#222b27] text-sm text-white shadow-[0_8px_20px_-7px_#0007]",
        className,
      )}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 650 }}
      onPointerMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((0.5 - (e.clientY - r.top) / r.height) * 18);
        y.set(((e.clientX - r.left) / r.width - 0.5) * 18);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div
        className="relative flex h-28 flex-col justify-between bg-cover grayscale p-3 motion-safe:transition-[background-position] duration-700"
        style={{
          backgroundPosition: back ? "center 90%" : "center 35%",
          backgroundImage:
            'linear-gradient(0deg,#121715c9,transparent 75%),url("' +
            cover +
            '")',
        }}
      >
        <span className="flex items-center justify-between">
          <Ticket size={17} className={back ? "rotate-[-16deg]" : ""} />
          <span className="rounded-full bg-black/45 px-2 py-0.5 font-mono text-[9px]">
            {back ? "ОБОРОТ" : "ADMIT ONE"}
          </span>
        </span>
        <span className="text-left text-2xl leading-none font-medium tracking-tighter">
          {back ? date : title}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-white/35 px-3 py-3 font-mono text-xs">
        {back ? title : date}
        <i
          className="h-4 w-16"
          style={{
            background:
              "repeating-linear-gradient(90deg,currentColor 0 2px,transparent 2px 4px)",
          }}
        />
      </div>
    </motion.button>
  );
}

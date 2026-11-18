"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

function Sheet({
  title,
  index,
  total,
  illustrated,
}: {
  title: string;
  index: number;
  total: number;
  illustrated: boolean;
}) {
  return (
    <span
      className={
        "absolute inset-0 flex flex-col justify-between px-3 py-3 text-left " +
        (illustrated
          ? "bg-[#eff0e8] text-[#233b32]"
          : "bg-[#e1e5da] text-[#41564c]")
      }
    >
      <span className="font-mono text-[9px] tabular-nums">
        {illustrated ? index + 1 + " / " + total : "TAKT"}
      </span>
      {illustrated ? (
        <strong className="line-clamp-2 font-serif text-lg leading-tight">
          {title}
        </strong>
      ) : (
        <span aria-hidden className="grid aspect-square place-items-center">
          <span
            className={
              "block size-9 border border-current " +
              (index % 3 === 0
                ? "rounded-full"
                : index % 3 === 1
                  ? "rotate-45"
                  : "rounded-[50%_0]")
            }
          />
        </span>
      )}
    </span>
  );
}
export function PageFlip({
  className,
  pages = ["Форма", "Ритм", "Воздух"],
}: {
  className?: string;
  pages?: string[];
}) {
  const [state, setState] = useState({
    index: 0,
    previous: 0,
    direction: 1,
    revision: 0,
    turning: false,
    queued: 0,
  });
  const reduced = useReducedMotion(),
    total = pages.length;
  if (!total) return null;
  const idx = Math.min(state.index, total - 1),
    prev = Math.min(state.previous, total - 1),
    forward = state.direction > 0;
  const moving = state.turning && !reduced;
  function nextSheet(s: typeof state, direction: number, queued: number) {
    const from = Math.min(s.index, total - 1);
    return {
      index: (from + direction + total) % total,
      previous: from,
      direction,
      revision: s.revision + 1,
      turning: !reduced,
      queued,
    };
  }
  function turn(direction: number) {
    if (total < 2) return;
    setState((s) =>
      s.turning && !reduced
        ? { ...s, queued: s.queued + direction }
        : nextSheet(s, direction, 0),
    );
  }
  function finish(revision: number) {
    setState((s) => {
      if (s.revision !== revision) return s;
      if (!s.queued) return { ...s, turning: false };
      const direction = Math.sign(s.queued);
      return nextSheet(s, direction, s.queued - direction);
    });
  }
  function sheet(i: number, right: boolean) {
    return (
      <Sheet index={i} total={total} title={pages[i]} illustrated={right} />
    );
  }
  return (
    <button
      type="button"
      aria-label="Следующая страница"
      onClick={() => turn(1)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          turn(e.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      className={cn(
        "relative block h-[132px] w-[204px] rounded-md bg-[#355246] p-[3px] shadow-[0_3px_0_#bec2b6,0_8px_18px_#0003] [perspective:720px]",
        className,
      )}
    >
      <span className="absolute inset-[3px] [transform-style:preserve-3d]">
        <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-sm">
          {sheet(moving && forward ? prev : idx, false)}
        </span>
        <span className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-sm">
          {sheet(moving && !forward ? prev : idx, true)}
        </span>
        <i
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-black/12"
        />
        {moving && (
          <motion.span
            key={state.revision}
            aria-hidden
            initial={{ rotateY: 0 }}
            animate={{ rotateY: forward ? -180 : 180 }}
            transition={{ duration: 0.64, ease: [0.4, 0.02, 0.23, 1] }}
            onAnimationComplete={() => finish(state.revision)}
            className={
              "absolute inset-y-0 z-10 w-1/2 [transform-style:preserve-3d] " +
              (forward ? "right-0 origin-left" : "left-0 origin-right")
            }
          >
            <span className="absolute inset-0 overflow-hidden rounded-sm backface-hidden">
              {sheet(prev, forward)}
            </span>
            <span className="absolute inset-0 rotate-y-180 overflow-hidden rounded-sm backface-hidden">
              {sheet(idx, !forward)}
            </span>
          </motion.span>
        )}
      </span>
    </button>
  );
}

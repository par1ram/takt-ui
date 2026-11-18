"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

function Digit({
  value,
  previous,
  direction,
}: {
  value: string;
  previous: string;
  direction: number;
}) {
  const flap = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = flap.current;
    if (
      !el ||
      previous === value ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const anim = el.animate(
      [
        { transform: "rotateX(0deg)", opacity: 1 },
        { transform: "rotateX(" + -direction * 88 + "deg)", opacity: 0.55 },
      ],
      { duration: 190, easing: "cubic-bezier(.32,0,.8,.5)", fill: "none" },
    );
    return () => anim.cancel();
  }, [previous, value, direction]);
  return (
    <span className="relative grid h-[58px] w-[43px] place-items-center overflow-hidden rounded-[7px] border border-[#4c4e53] bg-[linear-gradient(#3b3d42_0%,#282a2e_49%,#202226_50%,#303237_100%)] font-mono text-[40px] leading-none font-medium text-white shadow-[inset_0_1px_0_#ffffff28,0_2px_3px_#0003] [perspective:180px]">
      {value}
      <span
        ref={flap}
        className={
          "pointer-events-none absolute inset-x-0 h-1/2 overflow-hidden bg-[#36383c] opacity-0 " +
          (direction > 0 ? "top-0 origin-bottom" : "bottom-0 origin-top")
        }
      >
        <i
          className={
            "absolute inset-x-0 grid h-[62px] place-items-center not-italic " +
            (direction > 0 ? "top-0" : "bottom-0")
          }
        >
          {previous}
        </i>
      </span>
      <i className="absolute inset-x-0 top-1/2 h-px bg-black/60 shadow-[0_1px_0_#ffffff16]" />
    </span>
  );
}
export function FlipCounter({
  className,
  defaultValue = 12,
  min = 0,
  max = 99,
  onValueChange,
}: {
  className?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
}) {
  const [count, setCount] = useState(() =>
    Math.min(max, Math.max(min, defaultValue)),
  );
  const [before, setBefore] = useState(count);
  function step(delta: number) {
    const next = Math.min(max, Math.max(min, count + delta));
    if (next === count) return;
    setBefore(count);
    setCount(next);
    onValueChange?.(next);
  }
  const digits =
    (count < 0 ? "−" : "") + String(Math.abs(count)).padStart(2, "0");
  const old =
    (before < 0 ? "−" : "") + String(Math.abs(before)).padStart(2, "0");
  const control =
    "grid size-9 cursor-pointer place-items-center rounded-full border border-foreground/10 bg-card text-card-foreground shadow-sm motion-safe:transition-transform motion-safe:active:scale-90 disabled:opacity-35";
  return (
    <div
      role="group"
      aria-label="Счётчик"
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          step(e.key === "ArrowUp" ? 1 : -1);
        }
      }}
      className={cn("flex items-center gap-3", className)}
    >
      <button
        type="button"
        className={control}
        aria-label="Уменьшить"
        disabled={count <= min}
        onClick={() => step(-1)}
      >
        <Minus size={16} />
      </button>
      <output aria-live="polite">
        <span className="sr-only">{count}</span>
        <span
          aria-hidden
          className="flex gap-[3px] rounded-xl border border-black/30 bg-[#191a1d] p-[4px] shadow-[0_9px_16px_-8px_#0007]"
        >
          {Array.from(digits).map((digit, i) => (
            <Digit
              key={digits.length - i}
              value={digit}
              previous={old[old.length - digits.length + i] ?? digit}
              direction={count >= before ? 1 : -1}
            />
          ))}
        </span>
      </output>
      <button
        type="button"
        className={control}
        aria-label="Увеличить"
        disabled={count >= max}
        onClick={() => step(1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

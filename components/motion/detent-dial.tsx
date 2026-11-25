// Ported from Kokonut UI (https://kokonutui.com/docs/inputs/detent-dial).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";
import { useRef, useState, type PointerEvent } from "react";
export function DetentDial({
  className,
  label = "Уровень",
  onChange,
}: {
  className?: string;
  label?: string;
  onChange?: (value: number) => void;
}) {
  const [level, setLevel] = useState(4);
  const grip = useRef<{ id: number; angle: number; notch: number } | null>(
    null,
  );
  function angle(event: PointerEvent<HTMLInputElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2,
      y = event.clientY - box.top - box.height / 2;
    return Math.hypot(x, y) < 12 ? null : (Math.atan2(x, -y) * 180) / Math.PI;
  }
  function change(next: number) {
    if (next === level) return;
    setLevel(next);
    onChange?.(next);
  }
  return (
    <label
      className={cn(
        "group relative grid w-36 justify-items-center gap-1 rounded-xl",
        className,
      )}
    >
      <span className="relative grid size-[116px] place-items-center rounded-full group-focus-within:ring-1">
        {Array.from({ length: 31 }, (_, i) => (
          <i
            key={i}
            aria-hidden
            className="pointer-events-none absolute inset-1"
            style={{ transform: "rotate(" + (-135 + i * 9) + "deg)" }}
          >
            <i
              className={
                "mx-auto block w-[2px] rounded-full " +
                (i % 3 ? "h-[4px]" : "h-2")
              }
              style={{
                backgroundColor:
                  i <= level * 3
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                opacity: i <= level * 3 ? 0.85 : 0.32,
              }}
            />
          </i>
        ))}
        <span className="relative grid size-[76px] place-items-center rounded-full border border-neutral-500 bg-[linear-gradient(145deg,#575a60,#272a2f_60%,#1c1d21)] font-mono text-2xl text-white shadow-[inset_0_1px_2px_#ffffff50,0_3px_5px_#0004,0_7px_11px_-5px_#0006]">
          {level}
          <span
            aria-hidden
            className="absolute inset-1.5 rounded-full motion-safe:transition-transform"
            style={{ transform: "rotate(" + (-135 + level * 27) + "deg)" }}
          >
            <i className="mx-auto block h-2 w-[3px] rounded bg-[#e4eae7]" />
          </span>
        </span>
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type="range"
        aria-label={label}
        min={0}
        max={10}
        step={1}
        value={level}
        className="absolute top-0 left-1/2 size-[116px] -translate-x-1/2 touch-none cursor-grab opacity-0 active:cursor-grabbing"
        onPointerDown={(e) => {
          if (!e.isPrimary || e.button !== 0) return;
          e.preventDefault();
          e.currentTarget.focus();
          const a = angle(e);
          grip.current = { id: e.pointerId, angle: a ?? NaN, notch: level };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const g = grip.current,
            a = angle(e);
          if (!g || g.id !== e.pointerId || a === null) return;
          if (Number.isFinite(g.angle)) {
            const turn = ((a - g.angle + 540) % 360) - 180;
            g.notch = Math.min(10, Math.max(0, g.notch + turn / 27));
            change(Math.round(g.notch));
          }
          g.angle = a;
        }}
        onPointerUp={() => {
          grip.current = null;
        }}
        onPointerCancel={() => {
          grip.current = null;
        }}
        onLostPointerCapture={() => {
          grip.current = null;
        }}
        onDoubleClick={() => change(4)}
        onChange={(e) => {
          change(+e.target.value);
        }}
      />
    </label>
  );
}

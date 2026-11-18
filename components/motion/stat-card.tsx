"use client";
import { cn } from "@/lib/utils";
import { type PointerEvent, useId, useState } from "react";
import { motion, type MotionValue, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { TrendingUp } from "lucide-react";
import { panel } from "@/lib/takt-surface";

// The horizontal control points of each cubic segment both sit at its midpoint.
function curveX(t: number) {
  return t * (1.5 + t * (t - 1.5));
}

function CurveMarker({ points, target }: {
  points: { x: number; y: number }[];
  target: MotionValue<number>;
}) {
  const spring = useSpring(target, { stiffness: 600, damping: 46, mass: 0.8, restDelta: 0.0005 });
  const progress = useReducedMotion() ? target : spring;
  const position = useTransform(progress, (value) => {
    const index = Math.max(0, Math.min(value, points.length - 1));
    const i = Math.floor(index);
    const start = points[i];
    const end = points[i + 1] ?? start;
    const t = index - i;
    return {
      x: start.x + (end.x - start.x) * curveX(t),
      y: start.y + (end.y - start.y) * t * t * (3 - 2 * t),
    };
  });
  const cx = useTransform(position, (p) => p.x);
  const cy = useTransform(position, (p) => p.y);
  return <motion.ellipse cx={cx} cy={cy} rx="1.25" ry="2.2" fill="currentColor" />;
}

export function StatCard({
  className,
  label = "Просмотры",
  daily = [12, 17, 9, 24, 16, 29, 21],
  weekly = [82, 64, 99, 71, 115, 86, 92],
}: {
  className?: string;
  label?: string;
  daily?: number[];
  weekly?: number[];
}) {
  const gradientId = useId();
  const [week, setWeek] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const data = week ? weekly : daily;
  const [curve, setCurve] = useState(true);
  const markerTarget = useMotionValue(0);
  const high = Math.max(1, ...data);
  const points = data.map((v, i) => ({
    x: ((i + 0.5) / data.length) * 100,
    y: 39 - (v / high) * 36,
  }));
  const line = points
    .map((p, i) => {
      if (!i) return `M ${p.x} ${p.y}`;
      const previous = points[i - 1],
        middle = (previous.x + p.x) / 2;
      return `C ${middle} ${previous.y} ${middle} ${p.y} ${p.x} ${p.y}`;
    })
    .join(" ");
  const sum = data.reduce((a, b) => a + b, 0);
  const selection = hovered ?? focused;
  const selected =
    selection === null ? null : Math.min(data.length - 1, selection);
  function trackPointer(event: PointerEvent<HTMLDivElement>) {
    if (!data.length) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) return;
    const index = Math.max(0, Math.min(data.length - 1,
      (event.clientX - bounds.left) / bounds.width * data.length - 0.5,
    ));
    if (curve) {
      const segment = Math.floor(index);
      const fraction = index - segment;
      // Invert the cubic's x coordinate to keep the marker under the pointer.
      let t = fraction;
      for (let step = 0; step < 3; step++) {
        t -= (curveX(t) - fraction) / (1.5 - 3 * t * (1 - t));
      }
      markerTarget.set(segment + t);
    }
    setHovered(Math.round(index));
  }
  return (
    <section className={cn(panel + " w-64", className)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <TrendingUp size={15} />
          {label}
        </span>
        <button
          type="button"
          className="ml-auto mr-1 rounded-full border bg-muted px-2 py-1 text-[10px]"
          aria-label="Линейный график"
          aria-pressed={curve}
          onClick={() => setCurve(!curve)}
        >
          {curve ? "Линия" : "Столбцы"}
        </button>
        <button
          type="button"
          aria-pressed={week}
          aria-label="Недельный период"
          className="rounded-full border bg-muted px-2 py-1 text-[10px] font-medium"
          onClick={() => {
            setWeek(!week);
            setHovered(null);
            setFocused(null);
          }}
        >
          {week ? "Неделя" : "День"} ↔
        </button>
      </div>
      <output className="mt-1 block text-[30px] leading-tight font-semibold tracking-tighter tabular-nums">
        {(selected === null ? sum : (data[selected] ?? 0)).toLocaleString(
          "ru-RU",
        )}
      </output>
      <div
        className="relative mt-2 flex h-11 items-end border-b border-foreground/15"
        onPointerEnter={trackPointer}
        onPointerMove={trackPointer}
        onPointerLeave={() => {
          if (focused !== null) markerTarget.set(focused);
          setHovered(null);
        }}
      >
        {curve && data.length > 0 && (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-primary"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
          >
            {points.length > 1 && (
              <>
                <defs>
                  <linearGradient
                    id={gradientId}
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="40"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="currentColor" stopOpacity=".19" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#${gradientId})`}
                  d={`${line} V 40 H ${points[0].x} Z`}
                />
              </>
            )}
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
              d={line}
            />
            {(points.length === 1 || selected !== null) && (
              <CurveMarker points={points} target={markerTarget} />
            )}
          </svg>
        )}
        {data.map((v, i) => (
          <button
            type="button"
            key={i}
            aria-label={"Значение " + (i + 1) + ": " + v}
            onFocus={() => {
              markerTarget.set(i);
              setHovered(null);
              setFocused(i);
            }}
            onBlur={() => setFocused(null)}
            onClick={() => {
              markerTarget.set(i);
              setFocused(i);
            }}
            className="relative h-full min-w-0 flex-1 focus:outline-none!"
          >
            {!curve && (
              <span
                className={
                  "absolute inset-x-[8%] bottom-0 h-full origin-bottom rounded-t bg-linear-to-b from-primary/55 to-primary motion-safe:transition-[transform,opacity] duration-300 " +
                  (selected === i
                    ? "ring-2 ring-inset ring-foreground/70"
                    : selected !== null
                      ? "opacity-50"
                      : "")
                }
                style={{
                  transform: "scaleY(" + Math.max(0.025, v / high) + ")",
                }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[9px] text-muted-foreground">
        <span>{week ? "ПН" : "00:00"}</span>
        <span>{week ? "ВС" : "24:00"}</span>
      </div>
    </section>
  );
}

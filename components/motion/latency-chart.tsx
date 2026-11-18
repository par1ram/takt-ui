"use client";

import { useId, useMemo, useState } from "react";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type LatencySample = {
  label: string;
  p50: number | null;
  p95: number | null;
};
const example: LatencySample[] = [
  [84, 142],
  [79, 137],
  [93, 156],
  [88, 149],
  [104, 196],
  [117, 232],
  [97, 178],
  [91, 160],
  [94, 169],
  [83, 150],
  [78, 136],
  [81, 144],
].map(([p50, p95], i) => ({
  label: "10:" + String(i * 5).padStart(2, "0"),
  p50,
  p95,
}));
const config = { latency: { color: "var(--primary)" } };
const valid = (value: number | null) =>
  value !== null && Number.isFinite(value) && value >= 0 ? value : null;

export function LatencyChart({
  samples = example,
  title = "Время ответа",
  unit = "мс",
  className,
}: {
  samples?: LatencySample[];
  title?: string;
  unit?: string;
  className?: string;
}) {
  const [series, setSeries] = useState<"p50" | "p95">("p95");
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const gradient = useId();
  const data = useMemo(
    () =>
      samples.map((sample, index) => ({
        ...sample,
        index,
        p50: valid(sample.p50),
        p95: valid(sample.p95),
      })),
    [samples],
  );
  const index = Math.min(active ?? data.length - 1, data.length - 1);
  const sample = data[index];
  const highest = useMemo(
    () =>
      data.reduce(
        (max, point) => Math.max(max, point.p95 ?? 0, point.p50 ?? 0),
        0,
      ),
    [data],
  );
  const showDots = useMemo(
    () => data.length === 1 || data.some((sample) => sample[series] === null),
    [data, series],
  );
  function inspect(point: { activeTooltipIndex?: number | string | null }) {
    if (point.activeTooltipIndex == null) return;
    const next = Number(point.activeTooltipIndex);
    if (Number.isInteger(next) && next >= 0 && next < data.length)
      setActive(next);
  }
  return (
    <Card
      className={cn("w-full min-w-0 gap-0 p-4 text-left sm:p-5", className)}
    >
      <header className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Activity size={16} className="text-primary" />
          {title}
        </h3>
        <div
          className="flex rounded-full border bg-muted/55 p-0.5"
          role="group"
          aria-label="Перцентиль"
        >
          {(["p50", "p95"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={series === key}
              onClick={() => setSeries(key)}
              className="rounded-full px-2 py-1 font-mono text-[10px] font-semibold uppercase text-muted-foreground aria-pressed:bg-card aria-pressed:text-primary aria-pressed:shadow-xs"
            >
              {key}
            </button>
          ))}
        </div>
      </header>
      {!sample ? (
        <p className="py-8 text-sm text-muted-foreground">Пока нет измерений</p>
      ) : (
        <>
          <div className="mt-4 flex items-baseline gap-1.5">
            <output className="text-4xl font-semibold tracking-tight tabular-nums">
              {sample[series] ?? "—"}
            </output>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          <p className="mb-2 text-xs text-muted-foreground">
            {series === "p95" ? "95-й перцентиль" : "Медиана"} · {sample.label}
          </p>
          <ChartContainer
            config={config}
            className="h-32 w-full aspect-auto"
            aria-label={title}
          >
            <AreaChart
              data={data}
              margin={{ left: 1, right: 7, top: 8, bottom: 0 }}
              onMouseMove={inspect}
              onClick={inspect}
              accessibilityLayer={false}
            >
              <defs>
                <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="var(--color-latency)" stopOpacity={0.18} />
                  <stop
                    offset="1"
                    stopColor="var(--color-latency)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="2 4" />
              <XAxis
                dataKey="index"
                type="category"
                tickFormatter={(i) => data[i]?.label ?? ""}
                axisLine={false}
                tickLine={false}
                minTickGap={25}
                tickMargin={7}
                height={21}
              />
              <YAxis
                domain={[0, Math.max(1, highest)]}
                allowDecimals={highest < 2}
                width={33}
                tickCount={4}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={() => null} cursor={false} />
              <Area
                type="monotone"
                dataKey={series}
                stroke="var(--color-latency)"
                fill={`url(#${gradient})`}
                strokeWidth={2.4}
                strokeLinecap="round"
                activeDot={false}
                dot={
                  showDots && {
                    r: 2,
                    fill: "var(--color-latency)",
                    strokeWidth: 0,
                  }
                }
                isAnimationActive={!reduce}
                animationDuration={320}
              />
              <ReferenceLine
                x={index}
                stroke="var(--muted-foreground)"
                strokeOpacity={0.45}
                strokeDasharray="2 4"
              />
              {sample[series] !== null && (
                <ReferenceDot
                  x={index}
                  y={sample[series]}
                  r={4}
                  fill="var(--primary)"
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ChartContainer>
          <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              {data[0].label} – {data[data.length - 1].label}
            </span>
            <div className="flex gap-1">
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label="Предыдущий замер"
                disabled={index <= 0}
                onClick={() => setActive(index - 1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label="Следующий замер"
                disabled={index === data.length - 1}
                onClick={() => setActive(index + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

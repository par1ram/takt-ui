"use client";

import { useId, useState } from "react";
import { Grid2X2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui/card";
import { MetricReading } from "@/lib/takt-metric-reading";
import { cn } from "@/lib/utils";

export type RetentionCohort = {
  id: string;
  label: string;
  size: number;
  retained: (number | null)[];
};
const example: RetentionCohort[] = [
  {
    id: "april-1",
    label: "01 апр",
    size: 100,
    retained: [100, 78, 62, 56, 51],
  },
  {
    id: "april-8",
    label: "08 апр",
    size: 120,
    retained: [120, 99, 81, 72, null],
  },
  {
    id: "april-15",
    label: "15 апр",
    size: 110,
    retained: [110, 89, 73, null, null],
  },
  {
    id: "april-22",
    label: "22 апр",
    size: 95,
    retained: [95, 80, null, null, null],
  },
];
function observed(
  value: number | null | undefined,
  size: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= size &&
    Number.isSafeInteger(size) &&
    size > 0
  );
}
export function CohortRetention({
  cohorts = example,
  title = "Удержание по когортам",
  periodLabel = "Неделя",
  locale = "ru-RU",
  className,
}: {
  cohorts?: RetentionCohort[];
  title?: string;
  periodLabel?: string;
  locale?: string;
  className?: string;
}) {
  const [selected, setSelected] = useState<{ id: string; period: number }>();
  const reduce = useReducedMotion();
  const indicator = useId();
  const percent = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const periods = cohorts.reduce(
    (max, c) => Math.max(max, c.retained.length),
    0,
  );
  const requested = cohorts.find((c) => c.id === selected?.id);
  const hasSelection =
    requested &&
    selected &&
    observed(requested.retained[selected.period], requested.size);
  const row = hasSelection
    ? requested
    : cohorts.find((c) => c.retained.some((v) => observed(v, c.size)));
  const period = hasSelection
    ? selected.period
    : (row?.retained.findLastIndex((v) => observed(v, row.size)) ?? -1);
  const count = row?.retained[period];
  return (
    <Card
      className={cn("w-full min-w-0 gap-0 p-4 text-left sm:p-5", className)}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Grid2X2 size={16} />
        {title}
      </h3>
      {!periods || !row ? (
        <p className="py-8 text-sm text-muted-foreground">Нет наблюдений</p>
      ) : (
        <>
          <div className="mt-4 flex items-baseline gap-2">
            <output className="text-4xl font-semibold tracking-tight tabular-nums">
              <MetricReading value={percent.format((count ?? 0) / row.size)} />
            </output>
            <span className="text-xs text-muted-foreground">
              {periodLabel} {period}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.label} · {count} / {row.size}
          </p>
          <motion.div layoutScroll className="mt-3 overflow-x-auto p-1">
            <motion.table
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true }}
              aria-label={title}
              className="w-full border-separate border-spacing-1 text-center text-[10px] tabular-nums"
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="text-left font-medium text-muted-foreground"
                  >
                    Когорта
                  </th>
                  {Array.from({ length: periods }, (_, i) => (
                    <th
                      scope="col"
                      key={i}
                      className="relative pb-1 font-mono font-normal text-muted-foreground"
                    >
                      <span className="sr-only">{periodLabel} </span>
                      {i}
                      {period === i && (
                        <motion.span
                          aria-hidden
                          layoutId={indicator + "-week"}
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 320, damping: 31 }
                          }
                          className="absolute inset-x-1/4 bottom-0 h-0.5 rounded-full bg-primary/55"
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((cohort, rowIndex) => (
                  <tr key={cohort.id}>
                    <th
                      scope="row"
                      className="pr-1 text-left font-medium whitespace-nowrap"
                    >
                      {cohort.label}
                    </th>
                    {Array.from({ length: periods }, (_, i) => {
                      const value = cohort.retained[i];
                      if (!observed(value, cohort.size))
                        return (
                          <td
                            key={i}
                            aria-label="Нет наблюдения"
                            className="rounded-md bg-muted/45 text-muted-foreground"
                          >
                            —
                          </td>
                        );
                      const ratio = value / cohort.size;
                      // Two tonal ranges keep printed values legible in either theme.
                      const strong = ratio >= 0.75;
                      const tint = strong
                        ? 82 + (ratio - 0.75) * 72
                        : 5 + ratio * 44;
                      const active = cohort.id === row.id && i === period;
                      return (
                        <td key={i}>
                          <motion.button
                            type="button"
                            tabIndex={0}
                            aria-pressed={active}
                            aria-label={[
                              cohort.label,
                              periodLabel + " " + i,
                              percent.format(ratio),
                            ].join(", ")}
                            onClick={() =>
                              setSelected({ id: cohort.id, period: i })
                            }
                            whileTap={reduce ? undefined : { scale: 0.94 }}
                            variants={{
                              hidden: { opacity: 0.25, y: 5, scale: 0.88 },
                              shown: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: reduce
                                  ? { duration: 0 }
                                  : {
                                      type: "spring",
                                      stiffness: 260,
                                      damping: 26,
                                      delay: Math.min(rowIndex + i, 8) * 0.042,
                                    },
                              },
                            }}
                            className="relative block h-8 w-full min-w-7 motion-reduce:opacity-100! motion-reduce:transform-none! motion-safe:transition-colors motion-safe:duration-300 rounded-md px-0.5 font-mono outline-offset-1"
                            style={{
                              backgroundColor: `color-mix(in srgb, var(--primary) ${Math.round(tint)}%, var(--card))`,
                              color: strong
                                ? "var(--primary-foreground)"
                                : "var(--card-foreground)",
                            }}
                          >
                            {active && (
                              <motion.span
                                aria-hidden
                                layoutId={indicator + "-cell"}
                                transition={
                                  reduce
                                    ? { duration: 0 }
                                    : {
                                        type: "spring",
                                        stiffness: 310,
                                        damping: 30,
                                      }
                                }
                                className="pointer-events-none absolute -inset-0.5 rounded-[inherit] border-2 border-primary shadow-[inset_0_0_0_1px_var(--card)]"
                              />
                            )}
                            {percent.format(ratio)}
                          </motion.button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </motion.table>
          </motion.div>
          <div className="mt-3 flex items-center gap-2 border-t pt-2 text-[11px] text-muted-foreground">
            <span aria-hidden>—</span>Нет наблюдения
          </div>
        </>
      )}
    </Card>
  );
}

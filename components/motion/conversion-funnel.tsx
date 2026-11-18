"use client";

import { useId, useState } from "react";
import { ListFilter } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FunnelStage = { id: string; label: string; count: number };
const example: FunnelStage[] = [
  { id: "enrolled", label: "Записались", count: 1240 },
  { id: "started", label: "Начали урок", count: 986 },
  { id: "submitted", label: "Сдали практику", count: 735 },
  { id: "finished", label: "Завершили курс", count: 618 },
];
export function ConversionFunnel({
  stages = example,
  title = "Воронка обучения",
  locale = "ru-RU",
  className,
}: {
  stages?: FunnelStage[];
  title?: string;
  locale?: string;
  className?: string;
}) {
  const [selected, setSelected] = useState<string>();
  const reduce = useReducedMotion();
  const highlight = useId();
  const requested = stages.findIndex((s) => s.id === selected);
  const index = requested < 0 ? stages.length - 1 : requested;
  const current = stages[index];
  const previous = index > 0 ? stages[index - 1] : undefined;
  const format = new Intl.NumberFormat(locale);
  const percent = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  });
  const usable = stages.every(
    (s) => Number.isSafeInteger(s.count) && s.count >= 0,
  );
  const max = stages.reduce(
    (largest, item) => Math.max(largest, item.count),
    1,
  );
  const last = stages.at(-1);
  const conversion =
    last && stages[0].count > 0
      ? percent.format(last.count / stages[0].count)
      : "—";
  return (
    <Card
      className={cn("w-full min-w-0 gap-0 p-4 text-left sm:p-5", className)}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <ListFilter size={16} />
        {title}
      </h3>
      {!current || !usable ? (
        <p className="py-8 text-sm text-muted-foreground">
          Нет данных по этапам
        </p>
      ) : (
        <>
          <div className="mt-4 text-4xl font-semibold tracking-tight tabular-nums">
            {conversion}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            От первого до последнего этапа
          </p>
          <div
            role="group"
            aria-label="Этапы воронки"
            className="mt-3 grid gap-0.5"
          >
            {stages.map((stage) => (
              <button
                type="button"
                key={stage.id}
                aria-pressed={stage.id === current.id}
                onClick={() => setSelected(stage.id)}
                className="group relative isolate rounded-lg px-1.5 py-1.5 text-left hover:bg-muted/60 focus-visible:outline-offset-0"
              >
                {stage.id === current.id && (
                  <motion.span
                    aria-hidden
                    layoutId={highlight}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 440, damping: 38 }
                    }
                    className="absolute inset-0 -z-10 rounded-lg bg-muted/70"
                  />
                )}
                <span className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                  <span>{stage.label}</span>
                  <span className="font-mono tabular-nums">
                    {format.format(stage.count)}
                  </span>
                </span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: stage.count / max }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 240, damping: 32 }
                    }
                    className="block h-full origin-left rounded-full bg-primary/50 group-aria-pressed:bg-primary"
                  />
                </span>
              </button>
            ))}
          </div>
          <div
            aria-live="polite"
            className="mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 text-xs"
          >
            <span className="text-muted-foreground">
              {previous ? "От предыдущего этапа" : "Базовая группа"}
            </span>
            <strong className="tabular-nums">
              {previous
                ? previous.count
                  ? percent.format(current.count / previous.count)
                  : "—"
                : format.format(current.count)}
            </strong>
          </div>
        </>
      )}
    </Card>
  );
}

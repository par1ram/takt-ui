"use client";

import { Check, Plus, Repeat2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTrackerIssues, type TrackerProps } from "./tracker-issues";

export function CyclePlanner({
  cycleId = "08",
  capacity = 8,
  title = "План цикла",
  className,
  ...props
}: TrackerProps & { cycleId?: string; capacity?: number; title?: string }) {
  const { rows, update } = useTrackerIssues(props);
  const reduced = useReducedMotion();
  const available = rows.filter(
    (row) => row.cycleId === undefined || row.cycleId === cycleId,
  );
  const points = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
  const planned = available.reduce(
    (sum, row) => sum + (row.cycleId === cycleId ? points(row.points) : 0),
    0,
  );
  const limit = points(capacity);
  const difference = limit - planned;
  const ratio = limit ? Math.min(planned / limit, 1) : 0;
  return (
    <Card className={cn("w-full min-w-0 gap-0 p-3.5 text-left", className)}>
      <header className="mb-3 flex items-center gap-2">
        <Repeat2 size={16} />
        <h3 className="flex-1 text-sm font-semibold">{title}</h3>
        <span className="rounded-full border px-2 py-0.5 font-mono text-[10px]">
          #{cycleId}
        </span>
      </header>
      <div className="rounded-xl border bg-muted/50 p-3">
        <div className="flex flex-wrap items-baseline justify-between gap-1">
          <span className="inline-flex items-baseline gap-1 font-semibold tabular-nums">
            <motion.span
              key={planned}
              initial={reduced ? false : { y: 3, opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl tracking-tight"
            >
              {planned}
            </motion.span>
            <span className="text-xs text-muted-foreground">/ {limit} pt</span>
          </span>
          <span role="status" className="text-xs font-medium">
            {difference < 0
              ? "Сверх плана"
              : difference === 0
                ? "План заполнен"
                : "Резерв"}
            {difference !== 0 && <> · {Math.abs(difference)} pt</>}
          </span>
        </div>
        <div
          aria-hidden
          className="relative mt-2 h-3 overflow-hidden rounded-sm bg-foreground/10"
        >
          <motion.div
            initial={false}
            animate={{ scaleX: ratio }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 230, damping: 30 }
            }
            className="absolute inset-0 origin-left bg-primary"
          />
          <span
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg,transparent 0 calc(5% - 2px),var(--card) calc(5% - 2px) 5%)",
            }}
          />
        </div>
      </div>
      <div
        className="mt-2 grid max-h-64 gap-px overflow-y-auto"
        role="group"
        aria-label="Состав цикла"
      >
        {available.map((row) => {
          const assigned = row.cycleId === cycleId;
          return (
            <button
              key={row.id}
              type="button"
              aria-pressed={assigned}
              onClick={() =>
                update(row.id, { cycleId: assigned ? undefined : cycleId })
              }
              className="group flex min-h-10 w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left hover:bg-muted/55"
            >
              <span className="sr-only">{row.id} · </span>
              <span className="grid size-5 shrink-0 place-items-center rounded-md border bg-card text-muted-foreground group-aria-pressed:border-primary/30 group-aria-pressed:bg-primary group-aria-pressed:text-primary-foreground">
                <motion.span
                  key={String(assigned)}
                  initial={reduced ? false : { scale: 0.65, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 23 }}
                >
                  {assigned ? <Check size={13} /> : <Plus size={13} />}
                </motion.span>
              </span>
              <span className="min-w-0 flex-1 text-xs font-medium wrap-anywhere">
                {row.title}
              </span>
              <span className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                {points(row.points)} pt
              </span>
            </button>
          );
        })}
        {!available.length && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Нет задач для планирования
          </p>
        )}
      </div>
    </Card>
  );
}

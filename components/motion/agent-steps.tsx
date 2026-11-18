"use client";

import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { panel, secondary } from "@/lib/takt-surface";
import { cn } from "@/lib/utils";

export function AgentSteps({
  className,
  steps = ["Проверка запроса", "Поиск материалов", "Сборка ответа"],
  onStep,
}: {
  className?: string;
  steps?: string[];
  onStep?: (step: number) => void;
}) {
  const [requested, setStep] = useState(0);
  const step = Math.min(requested, steps.length);
  if (!steps.length) return null;
  const done = step === steps.length;
  return (
    <section className={cn(panel, "w-64 max-w-full", className)}>
      <ol aria-label="Этапы агента" className="max-h-40 overflow-y-auto">
        {steps.map((name, i) => (
          <li
            key={i}
            aria-current={i === step ? "step" : undefined}
            className="relative grid min-h-9 grid-cols-[20px_minmax(0,1fr)] items-center gap-x-3"
          >
            {i > 0 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[9.5px] top-0 bottom-1/2 w-px",
                  i <= step ? "bg-primary/45" : "bg-border",
                )}
              />
            )}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[9.5px] top-1/2 bottom-0 w-px",
                  i < step ? "bg-primary/45" : "bg-border",
                )}
              />
            )}
            <span
              aria-hidden
              className="relative grid size-5 place-items-center rounded-full bg-card"
            >
              <span
                className={cn(
                  "grid size-4 place-items-center rounded-full border",
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                      ? "border-primary"
                      : "border-foreground/25",
                )}
              >
                {i < step ? (
                  <Check size={10} strokeWidth={3} />
                ) : i === step ? (
                  <i className="size-1.5 rounded-full bg-primary" />
                ) : null}
              </span>
            </span>
            <span
              className={cn(
                "min-w-0 py-1.5 text-[13px] leading-5",
                i === step
                  ? "font-semibold"
                  : i > step
                    ? "text-muted-foreground"
                    : "text-card-foreground",
              )}
            >
              {name}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex items-center justify-between border-t pt-2">
        <output
          aria-label="Завершено этапов"
          className="pl-1 font-mono text-[11px] text-muted-foreground tabular-nums"
        >
          {step} / {steps.length}
        </output>
        <button
          type="button"
          className={cn(secondary, "gap-1.5 px-3 text-xs")}
          onClick={() => {
            const next = done ? 0 : step + 1;
            setStep(next);
            onStep?.(next);
          }}
        >
          {done ? "Заново" : "Следующий этап"}
          {done ? <RotateCcw size={12} /> : <ArrowRight size={12} />}
        </button>
      </div>
    </section>
  );
}

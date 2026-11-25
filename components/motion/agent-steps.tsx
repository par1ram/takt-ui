// Ported from Kokonut UI (https://kokonutui.com/docs/ai/ai-loading).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
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
                className="absolute left-[9px] top-0 bottom-1/2 w-0.5 bg-border"
              >
                <i
                  className={cn(
                    "block h-full origin-top bg-primary/70 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
                    i <= step
                      ? "scale-y-100 motion-safe:delay-100"
                      : "scale-y-0",
                  )}
                />
              </span>
            )}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[9px] top-1/2 bottom-0 w-0.5 bg-border"
              >
                <i
                  className={cn(
                    "block h-full origin-top bg-primary/70 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-in",
                    i < step ? "scale-y-100" : "scale-y-0",
                  )}
                />
              </span>
            )}
            <span
              aria-hidden
              className="relative grid size-5 place-items-center rounded-full bg-card"
            >
              <span
                className={cn(
                  "absolute inset-0.5 rounded-full border motion-safe:transition-colors motion-safe:duration-200",
                  i === step ? "border-primary/30" : "border-foreground/25",
                )}
              />
              {i === step && (
                <span className="absolute inset-0.5 motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:fade-in motion-safe:duration-300">
                  <i className="block size-full rounded-full border-[1.5px] border-transparent border-t-primary border-r-primary motion-safe:animate-spin motion-safe:[animation-duration:1.8s]" />
                </span>
              )}
              <i
                className={cn(
                  "absolute size-1.5 rounded-full bg-primary motion-safe:transition-transform motion-safe:duration-300",
                  i === step ? "scale-100" : "scale-0",
                )}
              />
              <span
                className={cn(
                  "absolute inset-0.5 rounded-full bg-primary motion-safe:transition-transform motion-safe:duration-200",
                  i < step ? "scale-100" : "scale-0",
                )}
              />
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="relative size-3 text-primary-foreground"
              >
                <path
                  d="m3 8 3 3 7-7"
                  pathLength="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1 1"
                  strokeDashoffset={i < step ? 0 : 1}
                  className={cn(
                    "motion-safe:transition-[stroke-dashoffset] motion-safe:duration-200",
                    i < step ? "motion-safe:delay-75" : "invisible",
                  )}
                />
              </svg>
            </span>
            <span
              className={cn(
                "min-w-0 py-1.5 text-[13px] leading-5 motion-safe:transition-colors motion-safe:duration-300",
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
          <span className="inline-flex overflow-hidden align-bottom">
            <span
              key={step}
              className="motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:fade-in motion-safe:duration-200"
            >
              {step}
            </span>
          </span>{" "}
          / {steps.length}
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

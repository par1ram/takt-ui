"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { panel } from "@/lib/takt-surface";

const ordinal = (index: number) => String(index + 1).padStart(2, "0");

export function StepProgress({
  className,
  steps = ["Данные", "Оформление", "Проверка"],
  onChange,
}: {
  className?: string;
  steps?: string[];
  onChange?: (index: number) => void;
}) {
  const [requested, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  const step = Math.min(requested, Math.max(0, steps.length - 1));
  const last = step === steps.length - 1;

  useEffect(() => {
    const rail = viewport.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth) return;
    const center = (step + 0.5) * rail.scrollWidth / steps.length;
    rail.scrollTo({
      left: center - rail.clientWidth / 2,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [step, steps.length]);

  function select(index: number) {
    setDirection(index >= step ? 1 : -1);
    setStep(index);
    onChange?.(index);
  }

  if (!steps.length) return null;
  return (
    <div className={cn(panel, "w-full max-w-72 min-w-0 overflow-hidden rounded-[1.35rem] p-0", className)}>
      <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
        <div className="min-w-0" role="status" aria-atomic="true">
          <div className="flex items-baseline gap-2 font-mono text-[10px] leading-4 font-medium tracking-widest text-muted-foreground uppercase">
            <span>Шаг</span>
            <span className="tabular-nums">
              <span className="text-card-foreground">{ordinal(step)}</span>
              <span className="px-1" aria-hidden="true">/</span>
              <span className="sr-only"> из </span>{ordinal(steps.length - 1)}
            </span>
          </div>
          <div className="mt-1 overflow-hidden">
            <span
              key={step}
              className={cn(
                "block text-[clamp(1.35rem,5vw,1.65rem)] leading-tight font-semibold tracking-[-0.045em] wrap-anywhere motion-safe:transition-[translate,opacity] motion-safe:duration-300 motion-safe:ease-out motion-safe:starting:opacity-0",
                direction > 0 ? "motion-safe:starting:translate-y-2" : "motion-safe:starting:-translate-y-2",
              )}
            >
              {steps[step]}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label={last ? "Сначала" : "Далее"}
          title={last ? "Сначала" : "Далее"}
          onClick={() => select(last ? 0 : step + 1)}
          className="group grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-foreground/15 bg-card text-card-foreground outline-offset-2 hover:bg-muted motion-safe:transition-[background-color,transform] motion-safe:active:scale-95"
        >
          {last ? <RotateCcw size={18} aria-hidden="true" /> : (
            <ArrowRight size={19} aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
          )}
        </button>
      </div>

      <div
        ref={viewport}
        role="group"
        aria-label="Перейти к шагу"
        className="overflow-x-auto border-t border-foreground/10 bg-muted/50 [scrollbar-width:thin]"
      >
        <div className="relative flex" style={{ minWidth: steps.length * 44 }}>
          {steps.map((label, index) => (
            <button
              key={index}
              type="button"
              aria-label={ordinal(index) + " " + label}
              aria-current={index === step ? "step" : undefined}
              title={label}
              onClick={() => select(index)}
              className="group relative flex h-[3.75rem] min-w-0 flex-1 cursor-pointer flex-col items-center pt-2 text-muted-foreground outline-offset-[-4px] hover:text-foreground"
            >
              <span aria-hidden="true" className="flex h-6 items-center gap-0.5 font-mono text-[11px] font-medium tabular-nums">
                {index < step && <Check size={11} strokeWidth={2.4} />}
                {ordinal(index)}
              </span>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-2 h-[5px] bg-repeat-x text-foreground/25 [background-image:linear-gradient(90deg,transparent_calc(50%-0.5px),currentColor_calc(50%-0.5px),currentColor_calc(50%+0.5px),transparent_calc(50%+0.5px))] [background-size:12.5%_100%]" />
              <span aria-hidden="true" className="absolute bottom-2 h-2.5 w-px bg-foreground/40" />
            </button>
          ))}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex flex-col items-center pt-2 motion-safe:transition-transform motion-safe:duration-[440ms] motion-safe:ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ width: `${100 / steps.length}%`, transform: `translateX(${step * 100}%)` }}
          >
            <span className="grid h-6 min-w-9 place-items-center rounded-lg bg-primary px-1.5 font-mono text-xs font-semibold text-primary-foreground tabular-nums shadow-sm">
              {ordinal(step)}
            </span>
            <span className="h-[3px] w-1.5 bg-primary [clip-path:polygon(0_0,100%_0,50%_100%)]" />
            <span className="absolute bottom-2 h-3 w-0.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

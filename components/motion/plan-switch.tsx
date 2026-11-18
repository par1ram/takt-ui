"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { Check, Layers2 } from "lucide-react";
import { ElasticIndicator } from "@/lib/takt-indicator";
import { panel } from "@/lib/takt-surface";
const rates = [
  { monthly: 1200, total: 1200 },
  { monthly: 1000, total: 12000 },
];
const number = new Intl.NumberFormat("ru-RU");
export function PlanSwitch({
  className,
  options = ["Месяц", "Год"],
  prices = rates,
  onChange,
}: {
  className?: string;
  options?: string[];
  prices?: { monthly: number; total: number }[];
  onChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const selected = Math.min(index, Math.max(0, options.length - 1));
  const price = options.length ? prices[selected] : undefined;
  const base = prices[0]?.monthly;
  const saving =
    price && base > 0 ? Math.round((1 - price.monthly / base) * 100) : 0;
  return (
    <section className={cn(panel + " w-64 max-w-full", className)}>
      <header className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Layers2 size={16} />
        </span>
        <strong className="text-base tracking-tight">Studio</strong>
        {saving > 0 && (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
            −{saving}%
          </span>
        )}
      </header>
      <div
        role="group"
        aria-label="Период оплаты"
        className="relative my-3 flex rounded-full border border-foreground/5 bg-muted p-1"
      >
        <span aria-hidden className="absolute inset-1 rounded-full">
          <ElasticIndicator
            count={options.length}
            index={selected}
            className="bg-card shadow-sm"
          />
        </span>
        {options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            aria-pressed={selected === i}
            className={
              "relative flex-1 rounded-full px-2 py-1.5 text-xs " +
              (i === selected ? "font-semibold text-primary" : "text-foreground/75")
            }
            onClick={() => {
              setIndex(i);
              onChange?.(i);
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {price && (
        <div aria-live="polite">
          <div
            key={selected}
            className="motion-safe:animate-in motion-safe:slide-in-from-bottom-1"
          >
            <strong className="text-[28px] leading-tight font-semibold tracking-tight tabular-nums">
              {number.format(price.monthly)} ₽
            </strong>
            <span className="ml-1 text-xs text-muted-foreground">/ мес.</span>
          </div>
          <span className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Check size={13} />К оплате {number.format(price.total)} ₽
          </span>
        </div>
      )}
    </section>
  );
}

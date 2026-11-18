"use client";

import { useState } from "react";
import { Check, X, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { panel, secondary } from "@/lib/takt-surface";

export type ExerciseCase = {
  input: string;
  expected: boolean;
  actual: boolean;
};
const sample: ExerciseCase[] = [
  { input: "UI-7", expected: true, actual: true },
  { input: "UI-42", expected: true, actual: false },
  { input: "UI-X", expected: false, actual: false },
];

export function TestResults({
  results = sample,
  onAsk,
  className,
}: {
  results?: ExerciseCase[];
  onAsk?: (result: ExerciseCase) => void;
  className?: string;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const failed = results.findIndex((row) => row.actual !== row.expected);
  const index =
    choice !== null && results[choice] ? choice : Math.max(0, failed);
  const row = results[index];
  return (
    <section className={cn(panel, "grid w-72 max-w-full gap-3", className)}>
      <header className="flex items-baseline justify-between gap-2">
        <strong>Проверки</strong>
        <output className="font-mono text-xs tabular-nums">
          {results.filter((r) => r.expected === r.actual).length} /{" "}
          {results.length}
        </output>
      </header>
      <div className="flex flex-wrap gap-1.5">
        {results.map((test, i) => {
          const ok = test.expected === test.actual;
          const Icon = ok ? Check : X;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={i === index}
              aria-label={test.input + (ok ? " · пройден" : " · ошибка")}
              onClick={() => setChoice(i)}
              className="flex min-h-9 items-center gap-1 rounded-md border px-2 font-mono text-xs aria-pressed:border-primary aria-pressed:bg-primary/10 motion-safe:transition-colors"
            >
              <Icon size={13} />
              {String(i + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>
      {row ? (
        <div
          key={index}
          className="grid gap-2 border-t pt-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
        >
          <code className="break-all">{JSON.stringify(row.input)}</code>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-muted-foreground">Ожидалось</dt>
              <dd className="font-mono">{String(row.expected)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Получено</dt>
              <dd className="font-mono">{String(row.actual)}</dd>
            </div>
          </dl>
          {onAsk && row.actual !== row.expected && (
            <button
              type="button"
              className={secondary}
              onClick={() => onAsk(row)}
            >
              <MessageCircleQuestion size={14} />
              Разобрать тест
            </button>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">Проверок пока нет</p>
      )}
    </section>
  );
}

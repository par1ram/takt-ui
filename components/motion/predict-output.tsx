"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { action, panel, secondary } from "@/lib/takt-surface";

export function PredictOutput({
  code = 'console.log("UI-42".slice(3).length)',
  options = ["2", "3", "5"],
  answer = "2",
  explanation = "После slice(3) остаётся строка «42» длиной 2.",
  onAnswer,
  className,
}: {
  code?: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  onAnswer?: (guess: string) => void;
  className?: string;
}) {
  const [guess, setGuess] = useState<string>();
  const [revealed, setRevealed] = useState(false);
  const correct = guess === answer;
  return (
    <section className={cn(panel, "grid w-72 max-w-full gap-3", className)}>
      <strong>Что выведет код?</strong>
      <pre tabIndex={0} className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
        <code>{code}</code>
      </pre>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={guess === option}
            disabled={revealed}
            className="min-h-9 rounded-lg border px-3 font-mono text-xs aria-pressed:border-primary aria-pressed:bg-primary/10 motion-safe:transition-colors"
            onClick={() => setGuess(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {revealed ? (
        <div className="grid gap-2 motion-safe:animate-in motion-safe:slide-in-from-bottom-1">
          <output className="grid gap-1">
            <strong className="flex items-center gap-2 text-sm">
              {correct ? <Check size={15} /> : <X size={15} />}
              {correct ? "Верно" : "Вывод программы"}
              <code>{answer}</code>
            </strong>
            <span className="text-xs text-muted-foreground">{explanation}</span>
          </output>
          <button
            type="button"
            className={secondary}
            onClick={() => {
              setGuess(undefined);
              setRevealed(false);
            }}
          >
            <RotateCcw size={13} />
            Ещё раз
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={guess === undefined || !options.includes(guess)}
          className={action}
          onClick={() => {
            if (guess !== undefined) {
              setRevealed(true);
              onAnswer?.(guess);
            }
          }}
        >
          Сверить прогноз
        </button>
      )}
    </section>
  );
}

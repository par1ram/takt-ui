"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { panel, secondary } from "@/lib/takt-surface";

type Frame = { line: number; variables: Record<string, string | number> };
const lines = [
  "let total = 0",
  "for (const n of [2, 3]) {",
  "  total += n",
  "}",
  "return total",
];
const frames: Frame[] = [
  { line: 1, variables: { total: 0 } },
  { line: 2, variables: { total: 0, n: 2 } },
  { line: 3, variables: { total: 2, n: 2 } },
  { line: 2, variables: { total: 2, n: 3 } },
  { line: 3, variables: { total: 5, n: 3 } },
  { line: 5, variables: { total: 5 } },
];
export function ExecutionTrace({
  code = lines,
  steps = frames,
  className,
}: {
  code?: string[];
  steps?: Frame[];
  className?: string;
}) {
  const [position, setPosition] = useState(0);
  const index = Math.min(position, steps.length - 1);
  const frame = steps[index];
  if (!frame) return null;
  return (
    <section className={cn(panel, "grid w-72 max-w-full gap-3", className)}>
      <header className="flex items-center justify-between">
        <strong>Трассировка</strong>
        <output className="font-mono text-xs tabular-nums">
          {index + 1} / {steps.length}
        </output>
      </header>
      <div className="overflow-x-auto rounded-lg bg-muted py-2">
        <div className="relative min-w-max font-mono text-xs">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-6 border-s-2 border-primary bg-primary/10 motion-safe:transition-transform motion-safe:duration-200"
            style={{ transform: `translateY(${(frame.line - 1) * 100}%)` }}
          />
          {code.map((line, i) => (
            <div
              key={i}
              aria-current={frame.line === i + 1 ? "step" : undefined}
              className="relative flex h-6 items-center gap-3 px-2"
            >
              <span className="text-muted-foreground">{i + 1}</span>
              <code className="whitespace-pre">{line}</code>
            </div>
          ))}
        </div>
      </div>
      <dl aria-live="polite" className="flex flex-wrap gap-2 font-mono text-xs">
        {Object.entries(frame.variables).map(([name, value]) => (
          <div
            key={name}
            className="inline-flex items-center gap-2 rounded-md border px-2 py-1"
          >
            <dt className="text-muted-foreground">{name}</dt>
            <dd
              key={value}
              className="text-primary motion-safe:animate-in motion-safe:slide-in-from-bottom-1"
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Назад"
          className={secondary}
          disabled={index === 0}
          onClick={() => setPosition(index - 1)}
        >
          <ArrowLeft size={14} />
        </button>
        <button
          type="button"
          className={secondary}
          disabled={index === steps.length - 1}
          onClick={() => setPosition(index + 1)}
        >
          Шаг вперёд
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}

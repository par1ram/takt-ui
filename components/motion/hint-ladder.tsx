"use client";

import { useId, useState } from "react";
import { Lightbulb, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { panel, secondary } from "@/lib/takt-surface";

const hints = [
  "Сравните длину строк UI-7 и UI-42.",
  "Посмотрите, сколько цифр допускает [0-9].",
  "В шаблоне [a-z]+ знак + разрешает несколько букв подряд.",
];
export function HintLadder({
  items = hints,
  onReveal,
  className,
}: {
  items?: string[];
  onReveal?: (index: number) => void;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const id = useId();
  const shown = Math.min(count, items.length);
  return (
    <section className={cn(panel, "grid w-72 max-w-full gap-3", className)}>
      <header className="flex items-center gap-2">
        <Lightbulb size={16} />
        <strong>Подсказки</strong>
        <output className="ml-auto font-mono text-xs">
          {shown} / {items.length}
        </output>
      </header>
      <div aria-hidden className="flex gap-1">
        {items.map((_, i) => (
          <i
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full motion-safe:transition-colors",
              i < shown ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>
      <ol id={id} aria-live="polite" className="grid gap-2 empty:hidden">
        {items.slice(0, shown).map((hint, i) => (
          <li
            key={i}
            className="flex items-baseline gap-3 text-xs leading-relaxed motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
          >
            <span className="font-mono text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            {hint}
          </li>
        ))}
      </ol>
      {shown < items.length ? (
        <button
          type="button"
          aria-controls={id}
          className={secondary}
          onClick={() => {
            setCount(shown + 1);
            onReveal?.(shown);
          }}
        >
          <Plus size={14} />
          {shown ? "Ещё подсказка" : "Открыть подсказку"}
        </button>
      ) : (
        shown > 0 && (
          <button
            type="button"
            className={secondary}
            onClick={() => setCount(0)}
          >
            <RotateCcw size={13} />
            Скрыть подсказки
          </button>
        )
      )}
    </section>
  );
}

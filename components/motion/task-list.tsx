"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState } from "react";
import { CircleCheck, Circle } from "lucide-react";

export function TaskList({
  className,
  tasks = ["Собрать данные", "Проверить ответ", "Подготовить отчёт"],
  onChange,
}: {
  className?: string;
  tasks?: string[];
  onChange?: (done: string[]) => void;
}) {
  const [selected, setDone] = useState<string[]>([]);
  const done = selected.filter((t) => tasks.includes(t));
  return (
    <div className={cn(surfacePanel + " grid w-52 gap-1", className)}>
      <header className="flex justify-between font-medium">
        Задачи{" "}
        <output>
          {done.length}/{tasks.length}
        </output>
      </header>
      <span aria-hidden className="h-1 overflow-hidden rounded-full bg-muted">
        <i
          className="block h-full origin-left bg-primary motion-safe:transition-transform"
          style={{
            transform:
              "scaleX(" + done.length / Math.max(1, tasks.length) + ")",
          }}
        />
      </span>
      {tasks.map((t) => (
        <button
          type="button"
          key={t}
          aria-pressed={done.includes(t)}
          className="flex min-h-8 items-center gap-2.5 rounded-md px-1.5 py-1 text-left text-xs hover:bg-muted"
          onClick={() => {
            const next = done.includes(t)
              ? done.filter((x) => x !== t)
              : [...done, t];
            setDone(next);
            onChange?.(next);
          }}
        >
          {done.includes(t) ? (
            <CircleCheck
              size={15}
              className="text-emerald-600 motion-safe:animate-in motion-safe:zoom-in-50"
            />
          ) : (
            <Circle size={15} />
          )}
          <span className={done.includes(t) ? "line-through opacity-60" : ""}>
            {t}
          </span>
        </button>
      ))}
    </div>
  );
}

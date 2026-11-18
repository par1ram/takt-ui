"use client";

import { useEffect, useState } from "react";
import { Play, Square, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { secondary } from "@/lib/takt-surface";

export type RunState = {
  phase: "idle" | "compile" | "run" | "done" | "error" | "stopped";
  output?: string;
  duration?: number;
};
const labels = {
  idle: "Готов к запуску",
  compile: "Компиляция",
  run: "Выполнение",
  done: "Завершено",
  error: "Ошибка",
  stopped: "Остановлено",
};
export function RunConsole({
  state,
  onStop,
  onErrorLocation,
  className,
}: {
  state?: RunState;
  onStop?: () => void;
  onErrorLocation?: () => void;
  className?: string;
}) {
  const [demo, setDemo] = useState<RunState>({ phase: "idle" });
  const current = state ?? demo;
  const busy = current.phase === "compile" || current.phase === "run";
  useEffect(() => {
    if (state || (demo.phase !== "compile" && demo.phase !== "run")) return;
    const started = performance.now();
    const timer = setTimeout(
      () =>
        setDemo(
          demo.phase === "compile"
            ? { phase: "run" }
            : {
                phase: "done",
                output: 'match("UI-42") → true',
                duration: Math.round(performance.now() - started),
              },
        ),
      450,
    );
    return () => clearTimeout(timer);
  }, [state, demo.phase]);
  return (
    <section
      className={cn(
        "grid w-72 max-w-full gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm",
        className,
      )}
    >
      <header className="flex items-center gap-2 text-xs">
        <Terminal size={16} />
        <strong className="mr-auto">Консоль</strong>
        {current.duration !== undefined && (
          <span className="font-mono text-muted-foreground">
            {current.duration} ms
          </span>
        )}
      </header>
      <div
        role="status"
        className="grid min-h-16 content-start gap-2 rounded-lg bg-neutral-950 p-3 font-mono text-xs text-neutral-100 dark:border dark:border-white/10"
      >
        <span
          key={current.phase}
          className="flex items-center gap-2 motion-safe:animate-in motion-safe:fade-in"
        >
          <i
            aria-hidden
            className={cn(
              "size-1.5 rounded-full bg-current",
              busy && "motion-safe:animate-pulse",
            )}
          />
          {labels[current.phase]}
        </span>
        {current.output && (
          <pre className="max-h-28 overflow-auto whitespace-pre-wrap break-all border-t pt-2">
            {current.output}
          </pre>
        )}
      </div>
      {busy && (onStop || !state) ? (
        <button
          type="button"
          className={secondary}
          onClick={onStop ?? (() => setDemo({ phase: "stopped" }))}
        >
          <Square size={12} />
          Остановить
        </button>
      ) : (
        !state && (
          <button
            type="button"
            className={secondary}
            onClick={() => setDemo({ phase: "compile" })}
          >
            <Play size={13} />
            Повторить пример
          </button>
        )
      )}
      {current.phase === "error" && onErrorLocation && (
        <button type="button" className={secondary} onClick={onErrorLocation}>
          К строке с ошибкой
        </button>
      )}
    </section>
  );
}

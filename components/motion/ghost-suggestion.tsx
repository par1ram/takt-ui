"use client";
import { cn } from "@/lib/utils";
import {
  panel as surfacePanel,
  secondary as surfaceSecondary,
} from "@/lib/takt-surface";

import { useState } from "react";

export function GhostSuggestion({
  className,
  options = ["Собрать каталог", "Создать макет", "Открыть файл"],
  onChange,
}: {
  className?: string;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [atEnd, setAtEnd] = useState(true);
  const match =
    !dismissed &&
    atEnd &&
    value.length > 0 &&
    options.find(
      (x) =>
        x.toLowerCase().startsWith(value.toLowerCase()) &&
        x.toLowerCase() !== value.toLowerCase(),
    );
  function update(v: string) {
    setValue(v);
    setDismissed(false);
    onChange?.(v);
  }
  return (
    <div
      className={cn(surfacePanel + " grid w-64 max-w-full gap-2", className)}
    >
      <label className="relative flex min-h-11 items-center rounded-lg border border-foreground/15 bg-background px-3 text-sm focus-within:border-foreground/50">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 overflow-hidden whitespace-pre text-muted-foreground"
        >
          <span className="invisible">{value}</span>
          {match ? match.slice(value.length) : ""}
        </span>
        <input
          aria-label="Автодополнение"
          spellCheck={false}
          autoComplete="off"
          placeholder="Начните ввод…"
          onSelect={(e) => {
            const n = e.currentTarget;
            setAtEnd(
              n.selectionStart === n.value.length &&
                n.selectionEnd === n.value.length &&
                n.scrollLeft === 0,
            );
          }}
          className="relative w-full min-w-0 bg-transparent caret-foreground outline-none! selection:bg-primary/20"
          value={value}
          onChange={(e) => update(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;

            if (e.key === "Escape") {
              setDismissed(true);
              return;
            }
            if (
              (e.key === "ArrowRight" ||
                (e.key === "Tab" && !e.shiftKey && value.length > 0)) &&
              match &&
              e.currentTarget.selectionStart === value.length
            ) {
              e.preventDefault();
              update(match);
            }
          }}
        />
      </label>
      <button
        type="button"
        className={surfaceSecondary}
        disabled={!match}
        onClick={() => match && update(match)}
      >
        Принять{" "}
        <kbd className="ml-1 rounded border bg-muted px-1 font-mono text-[9px]">
          Tab
        </kbd>
      </button>
    </div>
  );
}

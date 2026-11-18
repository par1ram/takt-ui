"use client";
import { cn } from "@/lib/utils";
import {
  panel as surfacePanel,
  secondary as surfaceSecondary,
  field as surfaceField,
} from "@/lib/takt-surface";

import { useState, useRef } from "react";
import { Search, ArrowDownLeft, Command } from "lucide-react";

export function CommandPalette({
  className,
  commands = ["Новый проект", "Найти файл", "Настройки"],
  onExecute,
}: {
  className?: string;
  commands?: string[];
  onExecute?: (command: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [last, setLast] = useState("");
  const ordered =
    last && commands.includes(last)
      ? [last, ...commands.filter((c) => c !== last)]
      : commands;
  const filtered = ordered.filter((x) =>
    x.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  function select(value: string) {
    onExecute?.(value);
    setLast(value);
    dialog.current?.close();
  }
  return (
    <>
      <button
        type="button"
        className={cn(surfacePanel + " flex items-center gap-3", className)}
        onClick={() => {
          setQuery("");
          setActive(0);
          dialog.current?.showModal();
        }}
      >
        <Search size={17} />
        {last || "Палитра команд"}{" "}
        <Command size={13} aria-hidden className="text-muted-foreground" />
      </button>
      <dialog
        ref={dialog}
        aria-label="Палитра команд"
        className="fixed inset-0 m-auto max-h-[80dvh] w-80 max-w-[calc(100vw-2rem)] rounded-2xl border bg-popover p-3 text-popover-foreground shadow-xl backdrop:bg-black/40"
      >
        <input
          aria-label="Поиск команд"
          className={surfaceField}
          placeholder="Найти команду"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (!filtered.length) return;
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setActive(
                (i) =>
                  (i + (e.key === "ArrowDown" ? 1 : -1) + filtered.length) %
                  filtered.length,
              );
            }
            if (e.key === "Enter" && filtered[active]) {
              e.preventDefault();
              select(filtered[active]);
            }
          }}
        />
        <div className="my-2 grid max-h-[45dvh] gap-0.5 overflow-y-auto">
          {filtered.map((c, i) => (
            <button
              type="button"
              key={c}
              className={
                "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted " +
                (i === active ? "bg-muted font-medium" : "")
              }
              onClick={() => select(c)}
            >
              <span>
                {c}
                {c === last && (
                  <small className="ml-2 text-[9px] font-normal text-muted-foreground">
                    Недавно
                  </small>
                )}
              </span>
              {i === active && <ArrowDownLeft size={13} aria-hidden />}
            </button>
          ))}
          {!filtered.length && <span>Ничего не найдено</span>}
        </div>
        <button
          type="button"
          className={surfaceSecondary}
          onClick={() => dialog.current?.close()}
        >
          Закрыть
        </button>
      </dialog>
    </>
  );
}

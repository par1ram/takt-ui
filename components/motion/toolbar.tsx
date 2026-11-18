"use client";
import { cn } from "@/lib/utils";
import { panel as surfacePanel } from "@/lib/takt-surface";

import { useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";

export function Toolbar({
  className,
  text = "Форма",
  onChange,
}: {
  className?: string;
  text?: string;
  onChange?: (styles: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className={cn("grid justify-items-center gap-3", className)}>
      <span
        style={{
          fontWeight: selected.includes("bold") ? 750 : 400,
          fontStyle: selected.includes("italic") ? "italic" : "normal",
          textDecoration: selected.includes("underline") ? "underline" : "none",
        }}
        className="max-w-full px-3 pb-2 font-serif text-3xl"
      >
        {text}
      </span>
      <div
        role="group"
        aria-label="Формат текста"
        className={surfacePanel + " flex gap-1 p-1"}
      >
        {[Bold, Italic, Underline].map((Icon, i) => {
          const k = ["bold", "italic", "underline"][i];
          const on = selected.includes(k);
          return (
            <button
              key={k}
              type="button"
              className={
                "rounded-lg p-2 motion-safe:transition-transform motion-safe:hover:-translate-y-1 motion-safe:active:scale-90 " +
                (on ? "bg-primary text-primary-foreground" : "")
              }
              aria-pressed={on}
              title={["Полужирный", "Курсив", "Подчёркивание"][i]}
              aria-label={k}
              onClick={() => {
                const next = on
                  ? selected.filter((x) => x !== k)
                  : [...selected, k];
                setSelected(next);
                onChange?.(next);
              }}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

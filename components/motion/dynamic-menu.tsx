"use client";
import { useActionFocus } from "@/lib/takt-focus";
import { cn } from "@/lib/utils";
import {
  panel as surfacePanel,
  secondary as surfaceSecondary,
} from "@/lib/takt-surface";

import { useState } from "react";
import { Menu, ChevronRight } from "lucide-react";

export function DynamicMenu({
  className,
  formats = ["PDF", "SVG"],
  onChoose,
}: {
  className?: string;
  formats?: string[];
  onChoose?: (format: string) => void;
}) {
  const { root, focusAfterRender } = useActionFocus<HTMLDivElement>();
  const [view, setView] = useState<"closed" | "root" | "more">("closed");
  const [choice, setChoice] = useState("");
  return (
    <div
      ref={root}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          focusAfterRender(
            view === "more" ? "[data-export]" : "[aria-expanded]",
          );
          setView(view === "more" ? "root" : "closed");
        }
      }}
      className={cn(
        surfacePanel +
          " grid max-w-full gap-1.5 motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out " +
          (view === "more" ? "w-60" : "w-44"),
        className,
      )}
    >
      <button
        type="button"
        className={surfaceSecondary}
        aria-expanded={view !== "closed"}
        onClick={() => setView(view === "closed" ? "root" : "closed")}
      >
        <Menu size={15} />
        {choice || "Меню"}
      </button>
      {view === "root" && (
        <button
          type="button"
          className={surfaceSecondary}
          data-export
          onClick={() => {
            focusAfterRender("[data-back]");
            setView("more");
          }}
        >
          Экспорт <ChevronRight size={14} />
        </button>
      )}
      {view === "more" && (
        <div className="flex flex-wrap gap-2 motion-safe:animate-in motion-safe:slide-in-from-right-2">
          <button
            type="button"
            className={surfaceSecondary}
            aria-label="Назад"
            data-back
            onClick={() => {
              focusAfterRender("[data-export]");
              setView("root");
            }}
          >
            ←
          </button>
          {formats.map((f) => (
            <button
              type="button"
              key={f}
              className={surfaceSecondary}
              onClick={() => {
                focusAfterRender("[aria-expanded]");
                setChoice(f);
                onChoose?.(f);
                setView("closed");
              }}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

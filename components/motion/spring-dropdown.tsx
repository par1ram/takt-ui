"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { panel } from "@/lib/takt-surface";
import { cn } from "@/lib/utils";

export function SpringDropdown({
  className,
  options = ["В работе", "На проверке", "Готово"],
  onSelect,
}: {
  className?: string;
  options?: string[];
  onSelect?: (value: string) => void;
}) {
  const [requested, setValue] = useState(options[0] ?? "");
  const [open, setOpen] = useState(false);
  const value = options.includes(requested) ? requested : options[0];
  const trigger = useRef<HTMLButtonElement>(null);
  const contentId = useId();

  function close() {
    trigger.current?.focus({ preventScroll: true });
    setOpen(false);
  }

  if (!options.length) return null;
  return (
    <div
      className={cn("relative w-48 max-w-full", className)}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.stopPropagation();
          close();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(panel, "group flex w-full cursor-pointer items-center justify-between gap-2 text-left")}
      >
        {value}
        <ChevronDown
          size={15}
          aria-hidden="true"
          className="shrink-0 group-aria-expanded:rotate-180 motion-safe:transition-transform motion-safe:duration-[360ms] motion-safe:ease-[cubic-bezier(.22,1,.36,1)]"
        />
      </button>
      <div
        id={contentId}
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-[360ms] motion-safe:ease-[cubic-bezier(.22,1,.36,1)]",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-clip">
          <div className="pt-1.5 pb-1">
            <div className="rounded-lg border bg-popover p-1 text-popover-foreground shadow-sm">
              {options.map((opt, index) => (
                <button
                  key={index}
                  type="button"
                  aria-pressed={value === opt}
                  className="flex min-h-8 w-full items-center justify-between rounded px-2 py-1 text-left text-xs outline-offset-[-2px] hover:bg-accent aria-pressed:bg-accent aria-pressed:text-primary"
                  onClick={() => {
                    setValue(opt);
                    close();
                    onSelect?.(opt);
                  }}
                >
                  {opt}
                  <span aria-hidden="true">{value === opt ? "✓" : ""}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

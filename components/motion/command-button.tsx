"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { panel } from "@/lib/takt-surface";

export function CommandButton({
  className,
  label = "Запустить",
  onExecute,
}: {
  className?: string;
  label?: string;
  onExecute?: () => void;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const [count, setCount] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    function down(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.shiftKey ||
        !(event.metaKey || event.ctrlKey) ||
        event.key !== "Enter"
      )
        return;
      if (
        document.querySelector('[role="dialog"], dialog[open]') ||
        (event.target instanceof HTMLElement &&
          event.target.closest("input,textarea,[contenteditable=true]"))
      )
        return;
      event.preventDefault();
      if (!event.repeat) {
        setHeld(true);
        button.current?.click();
      }
    }
    function release() {
      setHeld(false);
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", release);
    };
  }, []);
  return (
    <button
      ref={button}
      type="button"
      aria-keyshortcuts="Meta+Enter Control+Enter"
      title="⌘ / Ctrl + Enter"
      data-held={held}
      onClick={() => {
        setCount((n) => n + 1);
        onExecute?.();
      }}
      className={cn(
        panel + " group inline-flex items-center gap-2.5 py-2.5",
        className,
      )}
    >
      <span
        key={count}
        className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground motion-safe:animate-in motion-safe:zoom-in-75"
      >
        {count ? <Check size={15} /> : <Terminal size={15} />}
      </span>
      <span className="font-medium">{label}</span>
      <kbd
        aria-hidden
        className="rounded-md border border-foreground/15 border-b-2 bg-muted px-2 py-1 font-mono text-[11px] text-foreground/75 group-active:border-b group-data-[held=true]:border-b motion-safe:transition-transform motion-safe:group-active:translate-y-px motion-safe:group-data-[held=true]:translate-y-px"
      >
        ⌘/Ctrl ↵
      </kbd>
      <output
        aria-label="Число запусков"
        className="min-w-3 font-mono text-[10px] tabular-nums text-muted-foreground"
      >
        {count}
      </output>
    </button>
  );
}

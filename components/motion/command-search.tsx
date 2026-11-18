"use client";
import { cn } from "@/lib/utils";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const subscribePlatform = () => () => {};
const platformKey = () =>
  /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? "⌘" : "Ctrl";
const defaultKey = () => "Ctrl";

export function CommandSearch({
  className,
  label = "Поиск",
  placeholder = "Найти в проекте",
  onSearch,
  shortcut = true,
}: {
  className?: string;
  label?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  shortcut?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLFormElement>(null);
  const modifier = useSyncExternalStore(
    subscribePlatform,
    platformKey,
    defaultKey,
  );
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!shortcut) return;
    function handleShortcut(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.shiftKey ||
        !(event.ctrlKey || event.metaKey) ||
        event.code !== "KeyK"
      )
        return;
      // Leave keyboard ownership with a modal or another editable field.
      if (
        event.target instanceof Element &&
        event.target.closest(
          "input,textarea,select,[contenteditable=true],dialog[open],[role=dialog]",
        )
      )
        return;
      event.preventDefault();
      setOpen(true);
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [shortcut]);

  useEffect(() => {
    if (!open) {
      if (restoreFocus.current) {
        restoreFocus.current = false;
        trigger.current?.focus({ preventScroll: true });
      }
      return;
    }
    input.current?.focus({ preventScroll: true });
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function closeAndFocus() {
    restoreFocus.current = true;
    setOpen(false);
  }

  return (
    <motion.form
      ref={root}
      role="search"
      aria-keyshortcuts={shortcut ? "Meta+K Control+K" : undefined}
      initial={false}
      animate={{ width: open ? 264 : 192 }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 400, damping: 32 }
      }
      className={cn(
        "relative flex h-12 max-w-full items-center overflow-hidden rounded-xl border border-foreground/10 bg-card text-sm text-card-foreground shadow-sm focus-within:ring-1 focus-within:ring-foreground/35",
        className,
      )}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          closeAndFocus();
        }
      }}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const value = query.trim();
        if (!value) return;
        onSearch?.(value);
        setLastQuery(value);
        setQuery("");
        closeAndFocus();
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        inert={open}
        aria-label={label}
        tabIndex={open ? -1 : 0}
        className={
          "absolute inset-0 flex items-center gap-2.5 rounded-[inherit] px-3.5 text-left focus:outline-none! " +
          (open ? "pointer-events-none opacity-0" : "")
        }
        onClick={() => setOpen(true)}
      >
        <Search size={16} className="shrink-0" />
        <span className="min-w-0 flex-1 truncate">{lastQuery || label}</span>
        {shortcut && (
          <kbd
            aria-hidden
            className="shrink-0 rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[10px]"
          >
            {modifier} K
          </kbd>
        )}
      </button>
      {open && (
        <div className="relative flex w-full items-center gap-2 bg-card px-3 motion-safe:animate-in motion-safe:fade-in">
          <Search size={16} className="shrink-0" />
          <input
            ref={input}
            aria-label={placeholder}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && !query && lastQuery) {
                e.preventDefault();
                setQuery(lastQuery);
              }
            }}
            value={query}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent focus:outline-none!"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            aria-label="Искать"
            disabled={!query.trim()}
            className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </motion.form>
  );
}

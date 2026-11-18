"use client";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { ArrowRight, Check, Search, X } from "lucide-react";
import { panel } from "@/lib/takt-surface";
export function SpringyInput({
  className,
  placeholder = "Поиск по проекту",
  onChange,
  onSubmit,
}: {
  className?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  onSubmit?: (query: string) => void;
}) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  function update(value: string) {
    setText(value);
    setSubmitted(false);
    onChange?.(value);
  }
  return (
    <form
      className={cn(
        panel +
          " flex w-64 items-center gap-2 px-3 py-2 motion-safe:transition-colors has-[input:focus]:border-foreground/55 forced-colors:has-[input:focus]:outline-2 forced-colors:has-[input:focus]:outline-[Highlight]",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSubmitted(true);
        onSubmit?.(text.trim());
      }}
    >
      <span
        key={text.length}
        className="shrink-0 text-muted-foreground motion-safe:animate-in motion-safe:zoom-in-90"
      >
        <Search size={17} />
      </span>
      <input
        ref={input}
        type="search"
        className="h-8 min-w-0 flex-1 bg-transparent text-sm focus:outline-none! [&::-webkit-search-cancel-button]:hidden"
        aria-label={placeholder}
        placeholder={placeholder}
        value={text}
        onChange={(e) => update(e.target.value)}
      />
      {text && (
        <button
          type="button"
          aria-label="Очистить"
          className="rounded-md p-1 text-muted-foreground"
          onClick={() => {
            update("");
            input.current?.focus();
          }}
        >
          <X size={13} />
        </button>
      )}
      <button
        type="submit"
        disabled={!text.trim()}
        aria-label="Найти"
        className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground disabled:opacity-30"
      >
        {submitted ? (
          <Check
            size={14}
            className="motion-safe:animate-in motion-safe:zoom-in-75"
          />
        ) : (
          <ArrowRight size={14} />
        )}
      </button>
      <span className="sr-only" role="status">
        {submitted ? "Запрос принят" : ""}
      </span>
    </form>
  );
}

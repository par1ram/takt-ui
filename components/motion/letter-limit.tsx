"use client";
import { cn } from "@/lib/utils";
import { useRef, useState, useId } from "react";
import { panel, field } from "@/lib/takt-surface";

const graphemes =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;
function characters(value: string) {
  return graphemes
    ? Array.from(graphemes.segment(value), (part) => part.segment)
    : Array.from(value);
}

export function LetterLimit({
  className,
  label = "Заметка",
  limit = 80,
  onChange,
}: {
  className?: string;
  label?: string;
  limit?: number;
  onChange?: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [discard, setDiscard] = useState({ letters: "", revision: 0 });
  const composing = useRef(false);
  const countId = useId();
  const max = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 80;
  const size = characters(text).length;
  const left = Math.max(0, max - size);
  function commit(raw: string) {
    const chars = characters(raw);
    const next = chars.slice(0, max).join("");
    if (chars.length > max)
      setDiscard((old) => ({
        revision: old.revision + 1,
        letters: chars.slice(max, max + 5).join(""),
      }));
    setText(next);
    onChange?.(next);
  }
  return (
    <label
      className={cn(
        panel + " relative grid w-64 max-w-full gap-2 overflow-hidden",
        className,
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <strong>{label}</strong>
        <span
          aria-hidden
          className={
            "grid size-7 place-items-center rounded-full " +
            (left < 10 ? "text-foreground" : "text-emerald-600")
          }
          style={{
            background:
              "conic-gradient(currentColor " +
              Math.min(100, (100 * size) / Math.max(1, max)) +
              "%,var(--muted) 0)",
          }}
        >
          <i className="size-5 rounded-full bg-card" />
        </span>
      </span>
      <textarea
        rows={2}
        className={field + " resize-none py-2"}
        value={text}
        aria-label={label}
        aria-describedby={countId}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(e) => {
          composing.current = false;
          commit(e.currentTarget.value);
        }}
        onChange={(e) => {
          if (composing.current) setText(e.target.value);
          else commit(e.target.value);
        }}
      />
      <span className="flex min-h-5 items-center justify-between">
        <span
          aria-hidden
          key={discard.revision}
          onAnimationEnd={() => setDiscard((old) => ({ ...old, letters: "" }))}
          className="pointer-events-none font-mono text-xs text-muted-foreground motion-safe:animate-out motion-safe:slide-out-to-bottom-4 motion-safe:fade-out motion-safe:duration-500 motion-reduce:hidden"
        >
          {discard.letters}
        </span>
        <small
          id={countId}
          className={
            "ml-auto font-mono text-[10px] tabular-nums " +
            (left < 10 ? "font-semibold" : "text-muted-foreground")
          }
        >
          {left === 0 ? "Лимит достигнут" : size + " / " + max}
        </small>
      </span>
    </label>
  );
}

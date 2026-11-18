"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";

export function OtpCode({
  className,
  length: requestedLength = 4,
  onComplete,
}: {
  className?: string;
  length?: number;
  onComplete?: (code: string) => void;
}) {
  const length = Number.isFinite(requestedLength)
    ? Math.max(0, Math.floor(requestedLength))
    : 0;
  const [raw, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [caret, setCaret] = useState(0);
  if (!length) return null;
  const code = raw.slice(0, length);
  return (
    <label
      className={cn(
        "relative block rounded-lg focus-within:outline-2 focus-within:outline-offset-4",
        className,
      )}
    >
      <span className="flex gap-1.5" aria-hidden>
        {Array.from({ length }, (_, i) => (
          <span
            key={i}
            className={
              "grid h-12 w-10 place-items-center rounded-xl border bg-card font-mono text-2xl font-semibold text-card-foreground shadow-[inset_0_1px_2px_#0001,0_2px_3px_#0001] motion-safe:transition-[transform,border-color] " +
              (focused && i === Math.min(caret, length - 1)
                ? "border-foreground ring-1 ring-foreground/25"
                : code.length === length
                  ? "border-emerald-600/60"
                  : "")
            }
          >
            <span
              key={code[i] ?? "empty"}
              className={
                code[i]
                  ? "motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:fade-in"
                  : "text-muted-foreground/50"
              }
            >
              {code[i] || "·"}
            </span>
          </span>
        ))}
      </span>
      <input
        className="absolute inset-0 h-full w-full opacity-0"
        aria-label="Одноразовый код"
        inputMode="numeric"
        onSelect={(e) =>
          setCaret(e.currentTarget.selectionStart ?? code.length)
        }
        onFocus={(e) => {
          setFocused(true);
          setCaret(e.currentTarget.selectionStart ?? code.length);
        }}
        onBlur={() => setFocused(false)}
        autoComplete="one-time-code"
        value={code}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, length);
          setCode(v);
          if (v.length === length && v !== code) onComplete?.(v);
        }}
      />
    </label>
  );
}

"use client";
import { cn } from "@/lib/utils";
import {
  panel as surfacePanel,
  field as surfaceField,
} from "@/lib/takt-surface";

import { useId, useState } from "react";

export function PasswordStrength({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const hint = useId();
  const rules = ["8 символов", "Заглавная буква", "Цифра", "Спецсимвол"];
  const checks = [
    Array.from(value).length >= 8,
    /\p{Lu}/u.test(value),
    /[0-9]/.test(value),
    /[^\p{L}\d]/u.test(value),
  ];
  const score = checks.filter(Boolean).length;
  return (
    <label
      className={cn(surfacePanel + " grid w-60 max-w-full gap-2.5", className)}
    >
      Пароль
      <input
        className={surfaceField}
        aria-label="Пароль"
        aria-describedby={hint}
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
      />
      <span className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <i
            title={rules[i - 1]}
            key={i}
            className={
              "h-1 flex-1 rounded motion-safe:transition-colors " +
              (checks[i - 1]
                ? "bg-emerald-600 dark:bg-emerald-400"
                : "bg-muted")
            }
          />
        ))}
      </span>
      <small
        id={hint}
        aria-live="polite"
        className="min-h-8 text-xs leading-4 text-muted-foreground"
      >
        {score === 4
          ? "Все критерии выполнены"
          : (value ? "Осталось: " : "") +
            rules.filter((_, i) => !checks[i]).join(" · ")}
      </small>
    </label>
  );
}

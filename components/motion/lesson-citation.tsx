"use client";

import { useId, useRef, useState } from "react";
import { BookOpen, CornerUpLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function LessonCitation({
  title = "Повторения в шаблоне",
  locator = "§ 2.3",
  excerpt = "Квантификатор + повторяет предыдущий элемент один или несколько раз. Например, [a-z]+ совпадает с целым словом из строчных латинских букв.",
  href,
  onReturn,
  className,
}: {
  title?: string;
  locator?: string;
  excerpt?: string;
  href?: string;
  onReturn?: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  return (
    <div className={cn("w-64 max-w-full text-sm", className)}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="inline-flex max-w-full items-center gap-2 rounded-lg border bg-card px-3 py-2 text-start font-medium text-card-foreground shadow-sm"
      >
        <BookOpen size={15} className="shrink-0 text-primary" />
        <span>{title}</span>
        <small className="whitespace-nowrap font-mono text-muted-foreground">
          {locator}
        </small>
      </button>
      <div
        id={id}
        hidden={!open}
        className="mt-2 rounded-xl border bg-card p-3 text-card-foreground motion-safe:animate-in motion-safe:slide-in-from-top-1"
      >
        <blockquote className="text-sm leading-relaxed">{excerpt}</blockquote>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          {href && (
            <a className="underline underline-offset-2" href={href}>
              Открыть урок
            </a>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-1 font-medium text-primary"
            onClick={() => {
              setOpen(false);
              button.current?.focus({ preventScroll: true });
              onReturn?.();
            }}
          >
            <CornerUpLeft size={13} />
            Вернуться
          </button>
        </div>
      </div>
    </div>
  );
}

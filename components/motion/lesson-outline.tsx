"use client";

import { useState } from "react";
import { BookOpen, Check, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { panel, secondary } from "@/lib/takt-surface";

type Lesson = {
  id: string;
  title: string;
  complete?: boolean;
  href?: string;
  excerpt?: string;
};
const lessons: Lesson[] = [
  {
    id: "01",
    title: "Символы и классы",
    complete: true,
    excerpt: "Класс [0-9] совпадает с одной цифрой.",
  },
  {
    id: "02",
    title: "Повторения в шаблоне",
    excerpt:
      "Добавьте + после класса, чтобы принять несколько символов подряд.",
  },
  {
    id: "03",
    title: "Границы строки",
    excerpt: "Якоря ^ и $ задают начало и конец строки.",
  },
];
export function LessonOutline({
  title = "Регулярные выражения",
  items = lessons,
  currentId,
  onResume,
  className,
}: {
  title?: string;
  items?: Lesson[];
  currentId?: string;
  onResume?: (id: string) => void;
  className?: string;
}) {
  const [selected, setSelected] = useState<string>(currentId ?? "");
  const [opened, setOpened] = useState<string>();
  const current =
    items.find((item) => item.id === selected) ??
    items.find((item) => !item.complete) ??
    items[0];
  const completed = items.filter((item) => item.complete).length;
  return (
    <nav
      aria-label="Программа курса"
      className={cn(panel, "grid w-72 max-w-full gap-3", className)}
    >
      <div className="flex items-center justify-between">
        <BookOpen size={17} />
        <span className="font-mono text-xs text-muted-foreground">
          {completed} / {items.length}
        </span>
      </div>
      <strong className="text-lg leading-tight tracking-tight">{title}</strong>
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                setSelected(item.id);
                setOpened(undefined);
              }}
              aria-current={current?.id === item.id ? "step" : undefined}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-xs aria-[current=step]:bg-muted motion-safe:transition-colors"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[10px]">
                {item.complete ? <Check size={11} /> : i + 1}
              </span>
              {item.title}
              {current?.id === item.id && (
                <ChevronRight
                  size={13}
                  className="ml-auto text-primary motion-safe:animate-in motion-safe:slide-in-from-left-1"
                />
              )}
            </button>
          </li>
        ))}
      </ol>
      {current &&
        (current.href ? (
          <a
            href={current.href}
            onClick={() => onResume?.(current.id)}
            className={secondary}
          >
            Открыть урок
          </a>
        ) : (
          <button
            type="button"
            className={secondary}
            onClick={() => {
              setOpened(current.id);
              onResume?.(current.id);
            }}
          >
            <Play size={12} />
            Открыть урок
          </button>
        ))}
      {opened === current?.id && current && (
        <div
          role="status"
          className="rounded-lg bg-muted p-3 text-xs leading-relaxed motion-safe:animate-in motion-safe:slide-in-from-top-1"
        >
          <strong>{current.title}</strong>
          {current.excerpt && <p className="mt-1">{current.excerpt}</p>}
        </div>
      )}
    </nav>
  );
}

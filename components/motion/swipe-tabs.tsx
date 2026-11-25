// Ported from Kokonut UI (https://kokonutui.com/docs/navigation/smooth-tab).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type SwipeTab = { id: string; title: string; content: ReactNode };
const defaults: SwipeTab[] = [
  {
    id: "overview",
    title: "Обзор",
    content: (
      <>
        <span className="text-xs text-muted-foreground">Просмотры сегодня</span>
        <strong className="block text-3xl tracking-tight">1 284</strong>
      </>
    ),
  },
  {
    id: "activity",
    title: "События",
    content: (
      <>
        <span className="text-xs text-muted-foreground">
          Последнее изменение
        </span>
        <strong className="block text-base">Опубликован новый макет</strong>
      </>
    ),
  },
  {
    id: "team",
    title: "Команда",
    content: (
      <>
        <span className="text-xs text-muted-foreground">Участники проекта</span>
        <strong className="block text-base">Мира, Дана и Алекс</strong>
      </>
    ),
  },
];
export function SwipeTabs({
  className,
  items = defaults,
  defaultValue,
  value,
  onChange,
  label = "Разделы проекта",
}: {
  className?: string;
  items?: SwipeTab[];
  defaultValue?: string;
  value?: string;
  onChange?: (id: string) => void;
  label?: string;
}) {
  const [selected, setSelected] = useState(defaultValue ?? items[0]?.id);
  const index = Math.max(
    0,
    items.findIndex((item) => item.id === (value ?? selected)),
  );
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointer: number;
    start: number;
    width: number;
    started: number;
  } | null>(null);
  if (!items.length) return null;

  function activate(next: number, focus = false) {
    if (!items[next]) return;
    if (next !== index) {
      if (value === undefined) setSelected(items[next].id);
      onChange?.(items[next].id);
    }
    if (focus) document.getElementById(id + "-tab-" + next)?.focus();
  }
  function release() {
    drag.current = null;
    if (root.current) {
      delete root.current.dataset.dragging;
      root.current.style.removeProperty("--swipe-offset");
    }
  }
  return (
    <div
      ref={root}
      className={cn(
        "group/swipe w-68 max-w-full rounded-2xl border border-foreground/10 bg-card p-2 text-card-foreground shadow-sm",
        className,
      )}
      style={{ "--swipe-index": index } as CSSProperties}
    >
      <div
        role="tablist"
        aria-label={label}
        className="flex rounded-xl bg-muted p-1"
      >
        <div className="relative flex w-full">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 rounded-lg bg-primary motion-safe:transition-transform motion-safe:duration-350 group-data-[dragging]/swipe:transition-none"
            style={{
              width: 100 / items.length + "%",
              transform:
                "translateX(calc((var(--swipe-index) + var(--swipe-offset, 0)) * 100%))",
            }}
          />
          {items.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={id + "-tab-" + i}
              aria-selected={index === i}
              aria-controls={id + "-panel-" + i}
              tabIndex={index === i ? 0 : -1}
              className={
                "relative min-w-0 flex-1 truncate rounded-lg px-1.5 py-2 text-xs font-medium " +
                (index === i ? "text-primary-foreground" : "text-foreground/75")
              }
              onClick={() => activate(i)}
              onKeyDown={(e) => {
                const next = (
                  {
                    ArrowLeft: (i + items.length - 1) % items.length,
                    ArrowRight: (i + 1) % items.length,
                    Home: 0,
                    End: items.length - 1,
                  } as Record<string, number>
                )[e.key];
                if (next !== undefined) {
                  e.preventDefault();
                  activate(next, true);
                }
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div
        className="mt-2 touch-pan-y overflow-hidden rounded-xl"
        onPointerDown={(e) => {
          if (
            items.length < 2 ||
            !e.isPrimary ||
            e.button !== 0 ||
            (e.target instanceof Element &&
              e.target.closest(
                "button,input,select,textarea,a,[contenteditable=true]",
              ))
          )
            return;
          drag.current = {
            pointer: e.pointerId,
            start: e.clientX,
            width: e.currentTarget.clientWidth,
            started: e.timeStamp,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
          if (root.current) root.current.dataset.dragging = "";
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || e.pointerId !== d.pointer) return;
          const shift = Math.max(
            -1,
            Math.min(1, (d.start - e.clientX) / Math.max(1, d.width)),
          );
          const offset = Math.max(
            -index,
            Math.min(items.length - 1 - index, shift),
          );
          root.current?.style.setProperty("--swipe-offset", String(offset));
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          if (!d || d.pointer !== e.pointerId) return;
          const dx = d.start - e.clientX;
          release();
          if (
            Math.abs(dx) >= Math.min(56, d.width * 0.23) ||
            (Math.abs(dx) > 16 &&
              Math.abs(dx) / Math.max(1, e.timeStamp - d.started) > 0.65)
          )
            activate(index + Math.sign(dx));
        }}
        onLostPointerCapture={release}
        onPointerCancel={release}
      >
        <div
          className="flex motion-safe:transition-transform motion-safe:duration-350 group-data-[dragging]/swipe:transition-none"
          style={{
            transform:
              "translateX(calc((var(--swipe-index) + var(--swipe-offset, 0)) * -100%))",
          }}
        >
          {items.map((tab, i) => (
            <div
              key={tab.id}
              id={id + "-panel-" + i}
              role="tabpanel"
              aria-labelledby={id + "-tab-" + i}
              aria-hidden={index !== i}
              inert={index !== i}
              tabIndex={index === i ? 0 : -1}
              className="grid min-h-20 min-w-0 shrink-0 basis-full content-center gap-1 px-3 py-2"
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

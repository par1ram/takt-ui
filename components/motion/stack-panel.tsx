// Ported from Kokonut UI (https://kokonutui.com/docs/navigation/stack-panel).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Folder,
  Layers3,
  PanelsTopLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  label: string;
  to?: string;
  detail?: string;
  icon?: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
};
export type StackPage = { title: string; rows?: Row[]; content?: ReactNode };
type Visit = { page: string; opener?: string };

export function StackPanel({
  className,
  title = "Библиотека",
  items,
  renderPanel,
  pages,
  root = "home",
}: {
  className?: string;
  title?: string;
  items?: string[];
  renderPanel?: (name: string) => ReactNode;
  pages?: Record<string, StackPage>;
  root?: string;
}) {
  const [path, setPath] = useState<Visit[]>([]);
  const [view, setView] = useState("Обложки");
  const [projectStatus, setProjectStatus] = useState<Record<string, string>>(
    {},
  );
  const custom = items !== undefined || !!renderPanel;
  const names = items ?? ["Проекты", "Архив"];
  const projects = ["Коллекция Glass", "Коллекция Orbit"];
  const book: Record<string, StackPage> =
    pages ??
    (custom
      ? {
          [root]: {
            title,
            rows: names.map((label, i) => ({
              id: String(i),
              label,
              to: "item-" + i,
              icon: <Folder />,
            })),
          },
          ...Object.fromEntries(
            names.map((label, i) => [
              "item-" + i,
              {
                title: label,
                content: path.some((v) => v.page === "item-" + i)
                  ? (renderPanel?.(label) ?? "Раздел «" + label + "»")
                  : null,
              },
            ]),
          ),
        }
      : {
          [root]: {
            title,
            rows: [
              {
                id: "projects",
                label: "Проекты",
                icon: <Folder />,
                detail: "2",
                to: "projects",
              },
              {
                id: "archive",
                label: "Архив",
                icon: <Archive />,
                to: "archive",
              },
              {
                id: "view",
                label: "Вид каталога",
                icon: <PanelsTopLeft />,
                detail: view,
                to: "view",
              },
            ],
          },
          projects: {
            title: "Проекты",
            rows: projects.map((label, i) => ({
              id: String(i),
              label,
              to: "project-" + i,
              icon: <Layers3 />,
              detail: projectStatus[i] ?? "В работе",
            })),
          },
          ...Object.fromEntries(
            projects.map((label, i) => [
              "project-" + i,
              {
                title: label,
                rows: ["В работе", "На ревью", "Готово"].map((status) => ({
                  id: status,
                  label: status,
                  selected: (projectStatus[i] ?? "В работе") === status,
                  onSelect: () =>
                    setProjectStatus((s) => ({ ...s, [i]: status })),
                })),
              },
            ]),
          ),
          archive: {
            title: "Архив",
            content: (
              <div className="grid justify-items-center gap-2 py-5 text-xs text-muted-foreground">
                <Archive size={22} />
                Архив пока пуст
              </div>
            ),
          },
          view: {
            title: "Вид каталога",
            rows: ["Обложки", "Список"].map((label) => ({
              id: label,
              label,
              selected: view === label,
              onSelect: () => setView(label),
            })),
          },
        });
  const visits: Visit[] = [{ page: root }];
  for (const visit of path) {
    if (!book[visit.page]) break;
    visits.push(visit);
  }
  const top = visits[visits.length - 1],
    previous = visits.at(-2);
  const panel = useRef<HTMLElement>(null),
    body = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    back = useRef<HTMLButtonElement>(null);
  const gesture = useRef<{
      id: number;
      x: number;
      y: number;
      time: number;
      dragging: boolean;
    } | null>(null),
    ignoreClick = useRef(false);
  const popping = useRef(false);
  const [height, setHeight] = useState<number | "auto">("auto");
  const x = useMotionValue(0),
    width = useMotionValue(288);
  const under = useTransform(() => (x.get() - width.get()) * 0.3);
  const reduced = useReducedMotion();
  const transition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.42, bounce: 0 };
  useLayoutEffect(() => {
    const node = body.current,
      container = panel.current;
    if (!node || !container) return;
    const measure = () => {
      setHeight(node.offsetHeight);
      width.set(container.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    observer.observe(container);
    return () => observer.disconnect();
  }, [top.page, width]);
  function push(row: Row, label: HTMLElement) {
    if (popping.current) return;
    row.onSelect?.();
    if (!row.to || !book[row.to]) return;
    const origin = label.getBoundingClientRect();
    x.jump(reduced ? 0 : width.get());
    flushSync(() =>
      setPath([...visits.slice(1), { page: row.to!, opener: row.id }]),
    );
    const target = heading.current;
    if (target && !reduced) {
      const dest = target.getBoundingClientRect();
      target.animate(
        [
          {
            transform:
              "translate(" +
              (origin.left - dest.left) +
              "px," +
              (origin.top - dest.top) +
              "px)",
          },
          { transform: "translate(0,0)" },
        ],
        { duration: 410, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    }
    animate(x, 0, transition);
    back.current?.focus({ preventScroll: true });
  }
  async function pop() {
    if (!previous || popping.current) return;
    popping.current = true;
    if (!reduced)
      await animate(x, width.get(), {
        type: "spring",
        duration: 0.34,
        bounce: 0,
      });
    if (!panel.current) {
      x.jump(0);
      popping.current = false;
      return;
    }
    const restoreFocus = panel.current.contains(document.activeElement);
    flushSync(() => setPath(visits.slice(1, -1)));
    x.jump(0);
    popping.current = false;
    if (restoreFocus && top.opener)
      body.current
        ?.querySelector<HTMLElement>(
          '[data-entry="' + CSS.escape(top.opener) + '"]',
        )
        ?.focus({ preventScroll: true });
  }
  function content(page: StackPage) {
    return (
      <div className="grid gap-2 p-2">
        {!!page.rows?.length && (
          <div className="divide-y divide-border/65 overflow-clip rounded-xl bg-muted/65">
            {page.rows.map((row) => (
              <button
                key={row.id}
                type="button"
                data-entry={row.id}
                aria-pressed={row.selected}
                onClick={(e) =>
                  push(row, e.currentTarget.querySelector("[data-label]")!)
                }
                className="flex min-h-11 w-full items-center gap-2.5 px-3 text-left text-[13px] hover:bg-foreground/5 focus-visible:-outline-offset-2!"
              >
                {row.icon && (
                  <span
                    aria-hidden
                    className="grid size-7 shrink-0 place-items-center rounded-[8px] border bg-card text-card-foreground shadow-xs [&>svg]:size-3.5"
                  >
                    {row.icon}
                  </span>
                )}
                <span
                  data-label
                  className="pointer-events-none min-w-0 flex-1 truncate font-medium"
                >
                  {row.label}
                </span>
                {row.detail && (
                  <span className="pointer-events-none max-w-[35%] truncate text-xs text-muted-foreground">
                    {row.detail}
                  </span>
                )}
                {row.to ? (
                  <ChevronRight
                    size={13}
                    className="shrink-0 text-muted-foreground"
                  />
                ) : row.selected ? (
                  <Check size={15} />
                ) : null}
              </button>
            ))}
          </div>
        )}
        {page.content != null && (
          <div className="rounded-xl bg-muted/55 p-2 text-sm">
            {page.content}
          </div>
        )}
      </div>
    );
  }
  if (!book[top.page]) return null;
  return (
    <section
      ref={panel}
      className={cn(
        "relative w-[286px] max-w-full overflow-hidden rounded-[19px] border bg-card text-card-foreground shadow-[0_6px_20px_-12px_#0005]",
        className,
      )}
      onClickCapture={(e) => {
        if (ignoreClick.current && e.detail) {
          ignoreClick.current = false;
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && previous) {
          e.preventDefault();
          void pop();
        }
      }}
    >
      <header className="relative z-10 flex h-11 items-center justify-center border-b border-border/65 bg-card px-10">
        {previous && (
          <button
            ref={back}
            type="button"
            aria-label="Назад"
            onClick={() => void pop()}
            className="absolute left-2 grid size-8 place-items-center rounded-full hover:bg-muted"
          >
            <ChevronLeft size={17} />
          </button>
        )}
        <h3
          ref={heading}
          className="truncate text-sm font-semibold tracking-tight"
        >
          {book[top.page].title}
        </h3>
      </header>
      <motion.div
        initial={false}
        animate={{ height }}
        transition={transition}
        className="relative overflow-hidden"
        onPointerDown={(e) => {
          ignoreClick.current = false;
          if (
            !previous ||
            !e.isPrimary ||
            e.button !== 0 ||
            popping.current ||
            (e.target as Element).closest(
              "input,textarea,select,[contenteditable=true]",
            )
          )
            return;
          gesture.current = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            time: e.timeStamp,
            dragging: false,
          };
        }}
        onPointerMove={(e) => {
          const g = gesture.current;
          if (g?.id !== e.pointerId) return;
          const dx = e.clientX - g.x,
            dy = e.clientY - g.y;
          if (!g.dragging) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 7) return;
            if (dx <= Math.abs(dy)) {
              gesture.current = null;
              return;
            }
            g.dragging = true;
            ignoreClick.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }
          x.set(Math.max(0, Math.min(width.get(), dx)));
        }}
        onPointerUp={(e) => {
          const g = gesture.current;
          if (g?.id !== e.pointerId) return;
          gesture.current = null;
          if (!g.dragging) return;
          const dx = e.clientX - g.x;
          if (
            dx > width.get() * 0.35 ||
            (dx > 16 && dx / Math.max(e.timeStamp - g.time, 1) > 0.5)
          )
            void pop();
          else animate(x, 0, transition);
        }}
        onPointerCancel={() => {
          if (gesture.current?.dragging) animate(x, 0, transition);
          gesture.current = null;
        }}
        style={{ touchAction: previous ? "pan-y pinch-zoom" : undefined }}
      >
        {previous && (
          <motion.div
            inert
            aria-hidden
            className="absolute inset-x-0 top-0 opacity-65"
            style={{ x: under }}
          >
            {content(book[previous.page])}
          </motion.div>
        )}
        <motion.div
          ref={body}
          style={{ x, touchAction: previous ? "pan-y pinch-zoom" : undefined }}
          className="relative max-h-44 overflow-y-auto bg-card"
        >
          {content(book[top.page])}
        </motion.div>
      </motion.div>
    </section>
  );
}

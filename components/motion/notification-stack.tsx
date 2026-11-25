// Ported from Kokonut UI (https://kokonutui.com/docs/cards/notification-stack).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  FileCheck2,
  MessageCircle,
  Radio,
  X,
} from "lucide-react";
import { useActionFocus } from "@/lib/takt-focus";
import { cn } from "@/lib/utils";

export type StackNotification = {
  id: string;
  title: string;
  body?: string;
  time?: string;
  icon?: ReactNode;
};
const inbox: StackNotification[] = [
  {
    id: "review",
    title: "Мира Ли",
    body: "Оставила комментарий в макете",
    time: "сейчас",
    icon: <MessageCircle size={15} />,
  },
  {
    id: "handoff",
    title: "Макет готов",
    body: "Коллекция Glass · версия 2",
    time: "4 мин",
    icon: <FileCheck2 size={15} />,
  },
  {
    id: "publish",
    title: "Сборка завершена",
    body: "Каталог опубликован",
    time: "12 мин",
    icon: <Radio size={15} />,
  },
];
const colors = [
  "bg-[#dceddf] text-[#285640]",
  "bg-[#d8e8ed] text-[#2b5663]",
  "bg-[#e5e6df] text-[#4a5142]",
];
const height = 54,
  gap = 6,
  peek = 9;
function Notice({
  row,
  index,
  color,
  open,
  dismiss,
  expand,
}: {
  row: StackNotification;
  index: number;
  color: string;
  open: boolean;
  dismiss: (side: number) => void;
  expand: () => void;
}) {
  const reduced = useReducedMotion(),
    present = useIsPresent();
  const accessible = present && (open || index === 0);
  const swiping = useRef(false);
  return (
    <motion.li
      initial={false}
      inert={!accessible}
      aria-hidden={!accessible}
      data-notice={row.id}
      animate={{
        y: open ? index * (height + gap) : Math.min(index, 2) * peek,
        scale: open ? 1 : 1 - Math.min(index, 2) * 0.055,
        opacity: !open && index > 2 ? 0 : 1,
      }}
      exit="dismissed"
      variants={{
        dismissed: (side: number) => ({
          x: reduced ? 0 : side * 310,
          opacity: 0,
          transition: { duration: reduced ? 0 : 0.2 },
        }),
      }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 400, damping: 36 }
      }
      style={{ zIndex: 100 - index, originY: 1 }}
      className="absolute inset-x-0 top-0"
    >
      <motion.div
        drag={accessible ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 520, bounceDamping: 46 }}
        onDragStart={() => {
          swiping.current = true;
        }}
        onDragEnd={(_, info) => {
          const dx = info.offset.x;
          if (
            Math.abs(dx) > 86 ||
            (Math.abs(dx) > 12 &&
              Math.sign(dx) === Math.sign(info.velocity.x) &&
              Math.abs(info.velocity.x) > 520)
          )
            dismiss(Math.sign(dx));
        }}
        onPointerDownCapture={() => {
          swiping.current = false;
        }}
        onClick={() => {
          if (!swiping.current && !open) expand();
        }}
        onKeyDown={(e) => {
          if ((e.key === "Delete" || e.key === "Backspace") && !e.repeat) {
            e.preventDefault();
            dismiss(1);
          }
        }}
        className="flex h-[54px] touch-pan-y select-none items-center gap-2 rounded-[14px] border bg-card px-2.5 text-card-foreground shadow-[0_2px_5px_#0000000a,0_5px_10px_-7px_#0004]"
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2.5 transition-opacity motion-reduce:transition-none",
            !accessible && "opacity-0",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-[10px]",
              color,
            )}
          >
            {row.icon ?? <Bell size={15} />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <b className="min-w-0 flex-1 truncate text-xs">{row.title}</b>
              {row.time && (
                <small className="shrink-0 text-[10px] text-muted-foreground">
                  {row.time}
                </small>
              )}
            </div>
            {row.body && (
              <p
                title={row.body}
                className="truncate text-[11px] text-muted-foreground"
              >
                {row.body}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label={"Скрыть " + row.title}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              dismiss(1);
            }}
            className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X size={12} />
          </button>
        </div>
      </motion.div>
    </motion.li>
  );
}
export function NotificationStack({
  className,
  messages,
  notifications,
  onDismiss,
}: {
  className?: string;
  messages?: string[];
  notifications?: readonly StackNotification[];
  onDismiss?: (message: string) => void;
}) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false);
  const [manual, setManual] = useState<boolean | null>(null);
  const [direction, setDirection] = useState(1);
  const { root, focusAfterRender } = useActionFocus<HTMLDivElement>();
  const counts = new Map<string, number>();
  const all =
    notifications ??
    messages?.map((title) => {
      const i = counts.get(title) ?? 0;
      counts.set(title, i + 1);
      return { title, id: JSON.stringify([title, i]) };
    }) ??
    inbox;
  const hidden = new Set(removed);
  const rows = all
    .map((row, i) => ({ ...row, color: colors[i % colors.length] }))
    .filter((row) => !hidden.has(row.id));
  const open = rows.length > 1 && (manual ?? (hovered || focused));
  const list = useId();
  function dismiss(row: StackNotification, index: number, side: number) {
    if (removed.includes(row.id)) return;
    const next = rows[index + 1] ?? rows[index - 1];
    const card = document.activeElement?.closest("[data-notice]");
    if (card?.getAttribute("data-notice") === row.id)
      focusAfterRender(
        next
          ? '[data-notice="' + CSS.escape(next.id) + '"] button'
          : "[data-empty]",
      );
    setDirection(side);
    setRemoved((prev) => [...prev, row.id]);
    onDismiss?.(row.title);
  }
  return (
    <div
      ref={root}
      className={cn("w-[288px] max-w-full", className)}
      onPointerLeave={() => {
        setHovered(false);
        setManual((current) => (current === false ? null : current));
      }}
      onFocusCapture={(e) => {
        if (e.target.closest("[data-notice]")) setFocused(true);
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
          setManual((current) => (current === false ? null : current));
        }
      }}
    >
      <div className="mb-2 flex min-h-7 items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Bell size={14} />
          <strong className="text-[13px]">Уведомления</strong>
          <span className="rounded-full bg-foreground/8 px-1.5 text-[10px] tabular-nums">
            {rows.length}
          </span>
        </div>
        {rows.length > 1 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={list}
            onClick={() => setManual(!open)}
            className="mr-2 flex h-7 items-center gap-1 rounded-full px-2 text-[11px] text-muted-foreground hover:bg-muted"
          >
            {open ? "Свернуть" : "Показать все"}
            <ChevronDown
              size={12}
              className={cn(
                "motion-safe:transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        )}
      </div>
      <div
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setHovered(true);
        }}
        className="max-h-[180px] overflow-x-clip overflow-y-auto overscroll-contain p-0.5"
      >
        <ol
          id={list}
          aria-label="Уведомления"
          className="relative motion-safe:transition-[height] motion-safe:duration-300"
          style={{
            height: !rows.length
              ? 0
              : open
                ? rows.length * (height + gap) - gap
                : height + Math.min(rows.length - 1, 2) * peek,
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            {rows.map((row, i) => (
              <Notice
                key={row.id}
                row={row}
                index={i}
                open={open}
                color={row.color}
                dismiss={(side) => dismiss(row, i, side)}
                expand={() => setManual(true)}
              />
            ))}
          </AnimatePresence>
        </ol>
      </div>
      {!rows.length && (
        <p
          role="status"
          data-empty
          tabIndex={-1}
          className="flex h-16 items-center justify-center gap-2 rounded-2xl border bg-card text-xs text-muted-foreground"
        >
          <CheckCheck size={17} />
          Новых уведомлений нет
        </p>
      )}
    </div>
  );
}

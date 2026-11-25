// Ported from Kokonut UI (https://kokonutui.com/docs/buttons/morph-popover).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  ArrowUp,
  Check,
  LoaderCircle,
  MessageSquareText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "open" | "sending" | "sent";
export function MorphPopover({
  className,
  title = "Обратная связь",
  children,
  onSubmit,
}: {
  className?: string;
  title?: string;
  children?: ReactNode;
  onSubmit?: (text: string) => void | Promise<void>;
}) {
  const [phase, setPhase] = useState<Phase>("idle"),
    [text, setText] = useState(""),
    [error, setError] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    field = useRef<HTMLTextAreaElement>(null),
    close = useRef<HTMLButtonElement>(null);
  const sending = useRef(false),
    restore = useRef(false),
    confirmed = useRef<HTMLDivElement>(null);
  const id = useId(),
    reduced = useReducedMotion(),
    open = phase === "open" || phase === "sending";
  const transition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.42, bounce: 0.14 };
  function collapse(focus: boolean) {
    restore.current = focus;
    setPhase("idle");
  }
  useEffect(() => {
    if (phase === "idle" && restore.current) {
      trigger.current?.focus({ preventScroll: true });
      restore.current = false;
    }
    if (phase === "sent") {
      if (restore.current) confirmed.current?.focus({ preventScroll: true });
      const timer = setTimeout(
        () => collapse(!!root.current?.contains(document.activeElement)),
        1600,
      );
      return () => clearTimeout(timer);
    }
  }, [phase]);
  useEffect(() => {
    if (!open) return;
    (field.current ?? close.current)?.focus({ preventScroll: true });
    function outside(e: PointerEvent) {
      if (
        !sending.current &&
        e.target instanceof Node &&
        !root.current?.contains(e.target)
      )
        collapse(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  async function send() {
    const value = text.trim();
    if (!value || sending.current) return;
    sending.current = true;
    setError(false);
    setPhase("sending");
    try {
      if (onSubmit) await onSubmit(value);
      else await new Promise((resolve) => setTimeout(resolve, 550));
      restore.current = !!root.current?.contains(document.activeElement);
      setText("");
      setPhase("sent");
    } catch {
      setError(true);
      setPhase("open");
      field.current?.focus({ preventScroll: true });
    } finally {
      sending.current = false;
    }
  }
  const label = (
    <motion.span
      layoutId={id + "-label"}
      transition={transition}
      className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold"
    >
      <MessageSquareText size={15} />
      {title}
    </motion.span>
  );
  return (
    <LayoutGroup id={id}>
      <motion.div
        ref={root}
        layout
        transition={transition}
        style={{ borderRadius: open ? 18 : 24 }}
        className={cn(
          "max-w-full border bg-card text-card-foreground shadow-[0_2px_4px_#0000000a,0_8px_20px_-12px_#0005]",
          open && "w-[288px]",
          className,
        )}
        onKeyDown={(e) => {
          if (e.key === "Escape" && phase === "open") {
            e.stopPropagation();
            collapse(true);
          }
          if (
            e.key === "Enter" &&
            (e.metaKey || e.ctrlKey) &&
            open &&
            children == null &&
            !e.nativeEvent.isComposing
          ) {
            e.preventDefault();
            void send();
          }
        }}
      >
        {phase === "idle" ? (
          <button
            ref={trigger}
            type="button"
            aria-expanded={false}
            onClick={() => {
              setError(false);
              setPhase("open");
            }}
            className="flex h-10 items-center rounded-full px-4"
          >
            {label}
          </button>
        ) : phase === "sent" ? (
          <div
            ref={confirmed}
            role="status"
            tabIndex={-1}
            className="flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold"
          >
            <span className="grid size-5 place-items-center rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
              <Check size={13} />
            </span>
            Спасибо за отзыв
          </div>
        ) : (
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between gap-2 pl-1">
              {label}
              <button
                ref={close}
                type="button"
                aria-label="Закрыть"
                aria-disabled={phase === "sending"}
                onClick={() => {
                  if (!sending.current) collapse(true);
                }}
                className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X size={14} />
              </button>
            </div>
            {children ?? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
                aria-busy={phase === "sending"}
              >
                <textarea
                  ref={field}
                  aria-label="Текст отзыва"
                  placeholder="Что можно улучшить?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  readOnly={phase === "sending"}
                  className="block h-[74px] w-full resize-none rounded-xl border bg-muted/55 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground/45 focus:outline-none!"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  {error ? (
                    <span role="alert" className="text-[11px] text-destructive">
                      Не удалось отправить
                    </span>
                  ) : (
                    <kbd
                      aria-hidden
                      className="pl-1 text-[10px] text-muted-foreground"
                    >
                      Ctrl / ⌘ ↵
                    </kbd>
                  )}
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    aria-disabled={phase === "sending" || !text.trim()}
                    className="flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    {phase === "sending" ? (
                      <>
                        <LoaderCircle
                          size={13}
                          className="motion-safe:animate-spin"
                        />
                        Отправка…
                      </>
                    ) : (
                      <>
                        Отправить
                        <ArrowUp size={13} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </LayoutGroup>
  );
}

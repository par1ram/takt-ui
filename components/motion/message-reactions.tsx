"use client";

import { cn } from "@/lib/utils";

import { useState } from "react";
import { SmilePlus } from "lucide-react";
import { Popover } from "radix-ui";
import { motion, useReducedMotion } from "motion/react";

export type ChatReaction = {
  emoji: string;
  label: string;
  count: number;
  mine: boolean;
};
export const studioReactions: ChatReaction[] = [
  { emoji: "👏", label: "Аплодисменты", count: 3, mine: false },
  { emoji: "❤️", label: "Нравится", count: 0, mine: false },
  { emoji: "💡", label: "Хорошая идея", count: 1, mine: false },
];

export function toggleReaction(list: ChatReaction[], emoji: string) {
  return list.map((item) =>
    item.emoji === emoji
      ? {
          ...item,
          mine: !item.mine,
          count: Math.max(0, item.count + (item.mine ? -1 : 1)),
        }
      : item,
  );
}

export function MessageReactions({
  reactions,
  onToggle,
  className,
}: {
  className?: string;
  reactions?: ChatReaction[];
  onToggle?: (emoji: string) => void;
}) {
  const [local, setLocal] = useState(studioReactions);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const items = reactions ?? local;
  function toggle(emoji: string) {
    if (reactions === undefined)
      setLocal((previous) => toggleReaction(previous, emoji));
    onToggle?.(emoji);
  }
  return (
    <div
      className={cn("flex flex-wrap gap-1.5", className)}
      role="group"
      aria-label="Реакции"
    >
      {items
        .filter((item) => item.count > 0)
        .map((item) => (
          <button
            type="button"
            key={item.emoji}
            aria-label={item.label + ", " + item.count}
            aria-pressed={item.mine}
            onClick={() => toggle(item.emoji)}
            className="inline-flex min-h-7 cursor-pointer items-center gap-1.5 rounded-full border bg-card px-2 text-xs font-medium text-muted-foreground tabular-nums transition-colors hover:border-primary/40 aria-pressed:border-primary/40 aria-pressed:bg-primary/10 aria-pressed:text-primary"
          >
            <motion.span
              aria-hidden
              key={String(item.mine)}
              initial={
                item.mine && !reduce ? { scale: 0.75, rotate: -12 } : false
              }
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 15 }}
            >
              {item.emoji}
            </motion.span>
            {item.count}
          </button>
        ))}
      {items.some((item) => !item.count) && (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label="Добавить реакцию"
              className="grid size-7 place-items-center rounded-full border border-dashed text-muted-foreground hover:text-primary"
            >
              <SmilePlus size={14} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              sideOffset={5}
              collisionPadding={8}
              aria-label="Реакции"
              className="z-50 flex gap-1 rounded-xl border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {items
                .filter((item) => !item.count)
                .map((item) => (
                  <button
                    type="button"
                    key={item.emoji}
                    aria-label={item.label}
                    className="grid size-8 place-items-center rounded-lg hover:bg-accent"
                    onClick={() => {
                      setOpen(false);
                      toggle(item.emoji);
                    }}
                  >
                    {item.emoji}
                  </button>
                ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </div>
  );
}

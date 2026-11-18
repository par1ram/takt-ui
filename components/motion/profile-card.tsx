"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, MessageCircle, UserPlus } from "lucide-react";
import { teamPortraits } from "@/lib/takt-art-team";
import { panel } from "@/lib/takt-surface";
import { cn } from "@/lib/utils";

const before = "12 489";
const after = "12 490";
const followSpring = { type: "spring", stiffness: 300, damping: 22 } as const;

export function ProfileCard({
  className,
  name = "Алиса Ли",
  role = "Дизайнер",
  onFollow,
  onMessage,
}: {
  className?: string;
  name?: string;
  role?: string;
  onMessage?: (name: string) => void;
  onFollow?: (value: boolean) => void;
}) {
  const [open, setOpen] = useState(true);
  const [following, setFollowing] = useState(false);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : followSpring;
  return (
    <section className={cn(panel, "w-[292px] max-w-full", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl text-left"
      >
        <motion.span
          aria-hidden
          initial={false}
          animate={{ scale: following && !reduced ? [1, 1.12, 1] : 1 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
          className="size-12 shrink-0 rounded-full bg-muted bg-cover bg-center grayscale ring-1 ring-foreground/10"
          style={{
            backgroundImage: "url(" + JSON.stringify(teamPortraits[0]) + ")",
          }}
        />
        <span className="grid min-w-0 flex-1">
          <strong className="truncate text-base tracking-tight">{name}</strong>
          <span className="truncate text-xs text-muted-foreground">{role}</span>
        </span>
        <ChevronDown
          size={15}
          className={cn(
            "text-muted-foreground motion-safe:transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <>
          <p className="my-3 flex items-baseline gap-1.5 text-xs text-muted-foreground">
            <strong
              aria-hidden
              className="inline-flex text-sm leading-5 font-semibold text-foreground tabular-nums"
            >
              {Array.from(before, (digit, i) =>
                digit === after[i] ? (
                  <span key={i}>{digit}</span>
                ) : (
                  <span key={i} className="inline-block h-5 overflow-hidden">
                    <motion.span
                      initial={false}
                      animate={{ y: following ? "-50%" : "0%" }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 260,
                              damping: 22,
                              delay: (before.length - 1 - i) * 0.06,
                            }
                      }
                      className="grid"
                    >
                      <span>{digit}</span>
                      <span>{after[i]}</span>
                    </motion.span>
                  </span>
                ),
              )}
            </strong>
            <span className="sr-only">{following ? after : before} </span>
            подписчиков
          </p>
          <div className="relative h-10">
            <motion.button
              type="button"
              initial={false}
              animate={{
                width: following ? "calc(50% - 4px)" : "calc(100% - 0px)",
              }}
              transition={transition}
              aria-pressed={following}
              aria-label={following ? "Вы подписаны" : "Подписаться"}
              onClick={() => {
                setFollowing(!following);
                setWriting(false);
                onFollow?.(!following);
              }}
              className={cn(
                "relative z-10 h-full overflow-hidden rounded-full text-xs font-semibold motion-safe:transition-colors",
                following
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              <motion.span
                key={String(following)}
                initial={
                  reduced ? false : { y: following ? 8 : -8, opacity: 0 }
                }
                animate={{ y: 0, opacity: 1 }}
                transition={transition}
                className="flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                {following ? <Check size={14} /> : <UserPlus size={14} />}
                {following ? "Вы подписаны" : "Подписаться"}
              </motion.span>
            </motion.button>
            <motion.button
              type="button"
              inert={!following}
              aria-hidden={!following}
              initial={false}
              animate={{
                opacity: following ? 1 : 0,
                x: following || reduced ? 0 : 14,
              }}
              transition={transition}
              onClick={() =>
                onMessage ? onMessage(name) : setWriting(!writing)
              }
              className="absolute inset-y-0 right-0 flex w-[calc(50%-4px)] items-center justify-center gap-1.5 rounded-full border text-xs font-semibold"
            >
              <MessageCircle size={14} /> Сообщение
            </motion.button>
          </div>
          {writing && (
            <label className="mt-3 grid gap-1 text-xs text-muted-foreground">
              Черновик сообщения
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="h-9 rounded-lg border bg-transparent px-2.5 text-sm text-foreground"
              />
            </label>
          )}
        </>
      )}
    </section>
  );
}

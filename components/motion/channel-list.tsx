"use client";

import { cn } from "@/lib/utils";

import { Hash, Layers2, UserRound } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

export type ChatChannel = {
  id: string;
  name: string;
  kind: "channel" | "direct";
  topic: string;
};

export const studioChannels: ChatChannel[] = [
  {
    id: "studio",
    name: "дизайн-студия",
    kind: "channel",
    topic: "Разборы интерфейсов и прототипы курса",
  },
  {
    id: "code",
    name: "ревью-кода",
    kind: "channel",
    topic: "Вопросы по реализации и обратная связь",
  },
  { id: "maya", name: "Майя Ли", kind: "direct", topic: "Наставник курса" },
];

export function ChannelList({
  channels = studioChannels,
  value,
  onSelect,
  workspace = "Design Lab",
  className,
}: {
  className?: string;
  channels?: ChatChannel[];
  value?: string;
  onSelect?: (id: string) => void;
  workspace?: string;
}) {
  const [local, setLocal] = useState(channels[0]?.id);
  const indicator = useId();
  const reduce = useReducedMotion();
  return (
    <nav
      aria-label="Диалоги курса"
      className={cn(
        "w-full max-w-64 rounded-2xl border bg-sidebar p-3 text-left text-sidebar-foreground",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2.5 border-b px-1 pb-3">
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Layers2 size={18} />
        </span>
        <div>
          <strong className="block text-sm tracking-tight">{workspace}</strong>
          <span className="block text-[11px] leading-tight text-muted-foreground">
            Пространство курса
          </span>
        </div>
      </div>
      {(["channel", "direct"] as const).map((kind) => {
        const group = channels.filter((channel) => channel.kind === kind);
        if (!group.length) return null;
        return (
          <div key={kind} className="mb-3 last:mb-0">
            <p className="mb-1 px-2 text-[11px] font-semibold text-muted-foreground">
              {kind === "channel" ? "Каналы" : "Личные сообщения"}
            </p>
            {group.map((channel) => {
              const active = (value ?? local) === channel.id;
              const Icon = kind === "channel" ? Hash : UserRound;
              return (
                <button
                  type="button"
                  key={channel.id}
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    setLocal(channel.id);
                    onSelect?.(channel.id);
                  }}
                  className="relative isolate flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-2 text-left text-sm outline-offset-1 hover:bg-muted"
                >
                  {active && (
                    <motion.span
                      layoutId={indicator}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 37 }
                      }
                      className="absolute inset-0 -z-10 rounded-lg border border-primary/15 bg-primary/10"
                    />
                  )}
                  <Icon size={14} aria-hidden className="shrink-0" />
                  <span className="truncate">{channel.name}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

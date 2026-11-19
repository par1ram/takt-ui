"use client";

import { cn } from "@/lib/utils";

import { useLayoutEffect, useRef, useState } from "react";
import { CornerDownRight, MessagesSquare } from "lucide-react";
import { ChatComposer } from "./chat-composer";
import { ChatPostBody, type ChatPost } from "./chat-post";

// Preserve the original thread entry point for installed consumers.
export { ChatPostBody, type ChatPost } from "./chat-post";

export const studioPost: ChatPost = {
  id: "review",
  author: "Майя Ли",
  initials: "ML",
  time: "09:41",
  text: "На ревью сегодня смотрим переход между состояниями. Какую пружину оставим для панели?",
  code: "spring({ stiffness: 320, damping: 30 })",
};
export const studioReply: ChatPost = {
  id: "first-reply",
  author: "Лев Ким",
  initials: "LK",
  time: "09:46",
  text: "Этот вариант хорошо читается даже при быстром переключении.",
};

export function ownPost(text: string): ChatPost {
  return {
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    author: "Вы",
    initials: "Y",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    text,
  };
}

export function MessageThread({
  parent = studioPost,
  replies,
  draft,
  onDraftChange,
  onReply,
  pending,
  className,
}: {
  className?: string;
  pending?: boolean;
  parent?: ChatPost;
  replies?: ChatPost[];
  draft?: string;
  onDraftChange?: (text: string) => void;
  onReply?: (text: string) => void | Promise<void>;
}) {
  const [local, setLocal] = useState([studioReply]);
  const items = replies ?? local;
  const list = useRef<HTMLDivElement>(null);
  const previousCount = useRef(items.length);
  useLayoutEffect(() => {
    if (items.length > previousCount.current && list.current)
      list.current.scrollTop = list.current.scrollHeight;
    previousCount.current = items.length;
  }, [items.length]);
  return (
    <section
      aria-label="Обсуждение"
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b px-4 py-3 text-sm font-semibold">
        <MessagesSquare size={16} />
        Обсуждение
      </div>
      <div
        ref={list}
        tabIndex={0}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4"
      >
        <ChatPostBody post={parent} />
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CornerDownRight size={14} />
          Ответы <span className="tabular-nums">{items.length}</span>
        </div>
        {items.map((reply) => (
          <ChatPostBody post={reply} key={reply.id} />
        ))}
      </div>
      <div className="p-2 pt-0">
        <ChatComposer
          pending={pending}
          value={draft}
          onChange={onDraftChange}
          placeholder="Ответить в треде"
          onSend={async (text) => {
            if (onReply) await onReply(text);
            if (replies === undefined)
              setLocal((previous) => [...previous, ownPost(text)]);
          }}
        />
      </div>
    </section>
  );
}

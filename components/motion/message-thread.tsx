"use client";

import { cn } from "@/lib/utils";

import { useLayoutEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CornerDownRight,
  Layers2,
  MessagesSquare,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatComposer } from "./chat-composer";

export type ChatPost = {
  id: string;
  author: string;
  initials: string;
  time: string;
  text: string;
  code?: string;
  resource?: { title: string; detail: string; href: string };
};
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

export function ChatPostBody({
  post,
  children,
}: {
  post: ChatPost;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex min-w-0 items-start gap-2.5 text-left"
    >
      <Avatar aria-hidden className="size-8 shrink-0 rounded-xl">
        <AvatarFallback className="rounded-xl bg-primary/10 font-mono text-[11px] font-bold text-primary">
          {post.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-baseline gap-x-2">
          <strong className="text-sm font-semibold">{post.author}</strong>
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {post.time}
          </span>
        </header>
        <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed wrap-anywhere">
          {post.text}
        </p>
        {post.resource && (
          <a
            href={post.resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 flex w-fit max-w-full items-center gap-2.5 overflow-hidden rounded-xl border bg-card p-1.5 pr-3 transition-colors hover:border-primary/40"
          >
            <span
              aria-hidden
              className="relative grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-neutral-900 text-emerald-100"
            >
              <span className="absolute h-14 w-24 -rotate-[28deg] rounded-[50%] border border-emerald-100/25" />
              <span className="absolute h-8 w-22 -rotate-[28deg] rounded-[50%] border border-emerald-100/30 motion-safe:transition-transform motion-safe:group-hover:rotate-0" />
              <Layers2 size={19} strokeWidth={1.5} />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-xs">
                {post.resource.title}
              </strong>
              <span className="block truncate text-[11px] text-muted-foreground">
                {post.resource.detail}
              </span>
            </span>
            <ArrowUpRight
              size={13}
              className="shrink-0 text-muted-foreground"
            />
          </a>
        )}
        {post.code && (
          <pre className="mt-2 overflow-x-auto rounded-lg border bg-muted/55 px-2.5 py-2 font-mono text-[11px]">
            <code>{post.code}</code>
          </pre>
        )}
        {children}
      </div>
    </motion.article>
  );
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

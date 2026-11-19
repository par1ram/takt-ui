"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Layers2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import styles from "./chat-post.module.css";

export type ChatPost = {
  id: string;
  author: string;
  initials: string;
  time: string;
  text: string;
  code?: string;
  resource?: { title: string; detail: string; href: string };
};

export function ChatPostBody({
  post,
  children,
  className,
}: {
  post: ChatPost;
  children?: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex min-w-0 items-start gap-2.5 text-left", className)}
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
              className={styles.thumbnail}
            >
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
          <pre tabIndex={0} className="mt-2 overflow-x-auto rounded-lg border bg-muted/55 px-2.5 py-2 font-mono text-[11px]">
            <code>{post.code}</code>
          </pre>
        )}
        {children}
      </div>
    </motion.article>
  );
}

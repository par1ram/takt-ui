"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Hash,
  List,
  MessageSquare,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChannelList, studioChannels, type ChatChannel } from "./channel-list";
import { ChatComposer } from "./chat-composer";
import {
  MessageReactions,
  studioReactions,
  toggleReaction,
  type ChatReaction,
} from "./message-reactions";
import {
  ChatPostBody,
  MessageThread,
  ownPost,
  studioPost,
  studioReply,
  type ChatPost,
} from "./message-thread";

export type ConversationPost = ChatPost & {
  reactions?: ChatReaction[];
  replies?: ChatPost[];
};
const starter: Record<string, ConversationPost[]> = {
  studio: [
    {
      id: "welcome",
      author: "Лев Ким",
      initials: "LK",
      time: "09:32",
      text: "Добавил два варианта перехода в прототип урока. Можно забирать на ревью.",
      resource: {
        title: "Практика в редакторе",
        detail: "Code Exercise · Takt",
        href: "https://takt-ui.vercel.app/ru/components/code-exercise",
      },
    },
    { ...studioPost, reactions: studioReactions, replies: [studioReply] },
  ],
  code: [
    {
      id: "code-review",
      author: "Лев Ким",
      initials: "LK",
      time: "10:12",
      text: "Можно ли сохранить фокус в редакторе после запуска тестов?",
    },
  ],
  maya: [
    {
      id: "hello",
      author: "Майя Ли",
      initials: "ML",
      time: "10:24",
      text: "Привет! Сюда можно присылать вопросы один на один.",
    },
  ],
};
const emptyReactions = studioReactions.map((item) => ({ ...item, count: 0 }));

export function CourseMessenger({
  channels = studioChannels,
  initialMessages = starter,
  messages: controlledMessages,
  onSend,
  onToggleReaction,
  workspace = "Design Lab",
  className = "h-[31rem]",
}: {
  messages?: Record<string, ConversationPost[]>;
  onSend?: (
    channelId: string,
    text: string,
    parentId?: string,
  ) => void | Promise<void>;
  onToggleReaction?: (channelId: string, postId: string, emoji: string) => void;
  channels?: ChatChannel[];
  initialMessages?: Record<string, ConversationPost[]>;
  workspace?: string;
  className?: string;
}) {
  const [channelId, select] = useState(channels[0]?.id);
  const [localMessages, setMessages] = useState(initialMessages);
  const messages = controlledMessages ?? localMessages;
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [threadId, setThreadId] = useState<string | null>(null);
  const [showNav, setShowNav] = useState(false);
  const stream = useRef<HTMLDivElement>(null);
  const threadTrigger = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const navTrigger = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const channel = channels.find((item) => item.id === channelId) ?? channels[0];
  const id = channel?.id ?? "";
  const posts = messages[id] ?? [];
  const thread = posts.find((item) => item.id === threadId);
  const lastPost = posts.at(-1)?.id;
  useLayoutEffect(() => {
    const node = stream.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [id, lastPost]);
  useLayoutEffect(() => {
    if (threadId) closeButton.current?.focus({ preventScroll: true });
  }, [threadId]);
  useLayoutEffect(() => {
    if (showNav) backButton.current?.focus({ preventScroll: true });
  }, [showNav]);

  function updatePost(
    postId: string,
    change: (post: ConversationPost) => ConversationPost,
  ) {
    setMessages((previous) => ({
      ...previous,
      [id]: (previous[id] ?? []).map((post) =>
        post.id === postId ? change(post) : post,
      ),
    }));
  }
  async function send(text: string, parentId?: string) {
    if (onSend) {
      const key = JSON.stringify(
        parentId === undefined ? [id] : [id, parentId],
      );
      setPending((previous) => ({ ...previous, [key]: true }));
      try {
        await onSend(id, text, parentId);
      } finally {
        setPending((previous) => ({ ...previous, [key]: false }));
      }
    }
    if (controlledMessages !== undefined) return;
    const message = ownPost(text);
    if (parentId)
      updatePost(parentId, (post) => ({
        ...post,
        replies: [...(post.replies ?? []), message],
      }));
    else
      setMessages((previous) => ({
        ...previous,
        [id]: [...(previous[id] ?? []), message],
      }));
  }
  function react(postId: string, emoji: string) {
    onToggleReaction?.(id, postId, emoji);
    if (controlledMessages === undefined)
      updatePost(postId, (post) => ({
        ...post,
        reactions: toggleReaction(post.reactions ?? emptyReactions, emoji),
      }));
  }
  function remember(key: string, text: string) {
    setDrafts((previous) => ({ ...previous, [key]: text }));
  }
  function closeThread() {
    setThreadId(null);
    requestAnimationFrame(() =>
      threadTrigger.current?.focus({ preventScroll: true }),
    );
  }
  function hideNav() {
    setShowNav(false);
    requestAnimationFrame(() =>
      navTrigger.current?.focus({ preventScroll: true }),
    );
  }
  if (!channel)
    return <p className="p-4 text-sm text-muted-foreground">Нет диалогов</p>;
  const channelDraft = JSON.stringify([id]);
  const threadDraft = JSON.stringify([id, threadId]);
  const Icon = channel.kind === "direct" ? UserRound : Hash;
  return (
    <section
      aria-label="Мессенджер курса"
      className={"@container w-full min-w-0 text-foreground " + className}
    >
      <div className="flex h-full overflow-hidden rounded-2xl border bg-card shadow-sm">
        <aside
          className={
            (showNav ? "flex" : "hidden") +
            " w-full flex-col overflow-y-auto bg-sidebar p-2 @min-[650px]:flex @min-[650px]:w-48 @min-[650px]:shrink-0 @min-[650px]:border-r"
          }
        >
          <Button
            ref={backButton}
            variant="ghost"
            className="mb-1 self-start @min-[650px]:hidden"
            onClick={hideNav}
          >
            <ArrowLeft />К переписке
          </Button>
          <div className="[&>nav]:max-w-none [&>nav]:border-0 [&>nav]:p-1.5">
            <ChannelList
              channels={channels}
              value={id}
              workspace={workspace}
              onSelect={(next) => {
                select(next);
                setThreadId(null);
                if (showNav) hideNav();
              }}
            />
          </div>
        </aside>
        <div
          className={
            (thread
              ? "hidden @min-[900px]:flex "
              : showNav
                ? "hidden @min-[650px]:flex "
                : "flex ") + "min-w-0 flex-1 flex-col"
          }
        >
          <header className="flex min-h-15 items-center gap-2 border-b px-3 @min-[650px]:px-5">
            <Button
              ref={navTrigger}
              variant="outline"
              size="icon"
              aria-label="Выбрать диалог"
              className="@min-[650px]:hidden"
              onClick={() => setShowNav(true)}
            >
              <List />
            </Button>
            <Icon size={18} className="shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">{channel.name}</h2>
              <p className="truncate text-xs text-muted-foreground">
                {channel.topic}
              </p>
            </div>
          </header>
          <div
            ref={stream}
            className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 @min-[650px]:p-5"
          >
            {posts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Начните обсуждение
              </p>
            )}
            {posts.map((post) => (
              <ChatPostBody key={post.id} post={post}>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <MessageReactions
                    reactions={post.reactions ?? emptyReactions}
                    onToggle={(emoji) => react(post.id, emoji)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={(event) => {
                      threadTrigger.current = event.currentTarget;
                      setThreadId(post.id);
                    }}
                  >
                    <MessageSquare />
                    {post.replies?.length ? (
                      <>Ответы · {post.replies.length}</>
                    ) : (
                      "Ответить"
                    )}
                  </Button>
                </div>
              </ChatPostBody>
            ))}
          </div>
          <div className="p-2.5 pt-0 @min-[650px]:p-4 @min-[650px]:pt-0">
            <ChatComposer
              pending={pending[channelDraft]}
              key={id}
              value={drafts[channelDraft] ?? ""}
              placeholder={"Сообщение в " + channel.name}
              onChange={(text) => remember(channelDraft, text)}
              onSend={(text) => send(text)}
            />
          </div>
        </div>
        {thread && (
          <aside
            key={thread.id}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeThread();
            }}
            className="relative min-h-0 min-w-0 flex-1 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2 motion-safe:duration-200 @min-[900px]:max-w-80 @min-[900px]:border-l [&>section]:rounded-none [&>section]:border-0"
          >
            <Button
              ref={closeButton}
              size="icon-sm"
              variant="ghost"
              aria-label="Закрыть тред"
              onClick={closeThread}
              className="absolute top-2 right-2 z-1"
            >
              <X />
            </Button>
            <MessageThread
              pending={pending[threadDraft]}
              parent={thread}
              replies={thread.replies ?? []}
              draft={drafts[threadDraft] ?? ""}
              onDraftChange={(text) => remember(threadDraft, text)}
              onReply={(text) => send(text, thread.id)}
            />
          </aside>
        )}
      </div>
    </section>
  );
}

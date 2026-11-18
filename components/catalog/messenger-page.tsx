import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Hash,
  MessagesSquare,
  MessageSquareText,
  PanelsTopLeft,
  Smile,
} from "lucide-react";
import { CourseMessenger } from "@/components/motion/course-messenger";
import { entries } from "@/lib/catalog";
import { AccentPicker } from "./accent-picker";
import { MessengerTheme } from "./messenger-theme";

const parts = [
  { slug: "channel-list", icon: Hash },
  { slug: "chat-composer", icon: MessageSquareText },
  { slug: "message-reactions", icon: Smile },
  { slug: "message-thread", icon: MessagesSquare },
  { slug: "course-messenger", icon: PanelsTopLeft },
];

export function MessengerPage({ lang }: { lang: "ru" | "en" }) {
  const prefix = lang === "ru" ? "/ru" : "";
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 text-foreground sm:px-8">
      <header className="flex h-16 items-center justify-between border-b">
        <Link
          href={prefix || "/"}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={15} />
          Каталог Takt
        </Link>
        <div className="flex items-center gap-2">
          <AccentPicker />
          <MessengerTheme />
          <Link
            className="grid size-9 place-items-center rounded-lg border text-xs font-semibold"
            href={lang === "ru" ? "/messenger" : "/ru/messenger"}
            hrefLang={lang === "ru" ? "en" : "ru"}
          >
            {lang === "ru" ? "EN" : "RU"}
          </Link>
        </div>
      </header>
      <div className="flex flex-wrap items-end justify-between gap-4 pt-9 pb-6 sm:pt-12">
        <div>
          <h1 className="text-4xl font-semibold tracking-[-.055em] sm:text-6xl">
            Мессенджер
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Каналы курса, личные диалоги и треды в одном рабочем пространстве.
          </p>
        </div>
        <Link
          href={prefix + "/components/course-messenger"}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground"
        >
          Установить мессенджер <ArrowUpRight size={15} />
        </Link>
      </div>
      <CourseMessenger className="h-[min(32rem,78svh)] min-h-80" />
      <h2 className="mt-9 mb-3 text-2xl font-semibold tracking-tight">
        Компоненты мессенджера
      </h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map(({ slug, icon: Icon }) => {
          const entry = entries.find((item) => item.slug === slug)!;
          return (
            <Link
              key={slug}
              href={prefix + "/components/" + slug}
              className="group flex items-start gap-3 rounded-xl border bg-card p-4 hover:border-primary/40"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Icon size={17} />
              </span>
              <span className="flex-1">
                <strong className="block text-sm font-semibold">
                  {entry.title}
                </strong>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {entry.description}
                </span>
              </span>
              <ArrowUpRight
                size={14}
                className="shrink-0 text-muted-foreground motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5"
              />
            </Link>
          );
        })}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { panel } from "@/lib/takt-surface";
import { PromptBox } from "./prompt-box";
import { LessonCitation } from "./lesson-citation";

type Citation = Pick<
  React.ComponentProps<typeof LessonCitation>,
  "title" | "locator" | "excerpt" | "href"
>;
export type TutorAnswer = { text: string; citation?: Citation };
const defaultContext = ["lesson.md § 2.3", "pattern.regex"];
const suggestions = ["Почему тест упал?", "Как работает повторение?"];
export function AskTutor({
  context = defaultContext,
  onAsk,
  onReturn,
  className,
}: {
  context?: string[];
  onAsk?: (question: string, context: string[]) => Promise<TutorAnswer>;
  onReturn?: () => void;
  className?: string;
}) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [answer, setAnswer] = useState<TutorAnswer | null>(null);
  const attached = context.filter((value) => !removed.includes(value));
  async function ask(question: string) {
    setAnswer(null);
    const result = onAsk
      ? await onAsk(question, attached)
      : {
          text:
            attached.length && question !== suggestions[1]
              ? "Сравните UI-7 и UI-42. Сколько цифр допускает часть [0-9] вашего шаблона?"
              : "Попробуйте сравнить шаблоны [0-9] и [0-9]+ на строке из двух цифр.",
          citation: {},
        };
    setAnswer(result);
  }
  return (
    <section className={cn(panel, "grid w-80 max-w-full gap-3", className)}>
      <div className="flex justify-between gap-2">
        <strong>Спросить по уроку</strong>
        {!onAsk && <small className="text-muted-foreground">Демоответ</small>}
      </div>
      <div className="flex flex-wrap gap-1">
        {attached.map((source) => (
          <button
            key={source}
            type="button"
            onClick={() => setRemoved((prev) => [...prev, source])}
            aria-label={"Убрать источник " + source}
            className="inline-flex max-w-full min-h-7 items-center gap-1 rounded-md border px-1.5 font-mono text-[10px]"
          >
            <Paperclip size={11} />
            <span className="min-w-0 truncate">{source}</span>
            <X size={11} />
          </button>
        ))}
      </div>
      <PromptBox
        className="w-full p-2 shadow-none"
        suggestions={suggestions}
        onSend={ask}
      />
      <div aria-live="polite" className="empty:hidden">
        {answer && (
          <div
            key={answer.text}
            className="grid gap-2 border-t pt-2 text-sm motion-safe:animate-in motion-safe:fade-in"
          >
            <p>{answer.text}</p>
            {answer.citation && (
              <LessonCitation
                {...answer.citation}
                className="w-full"
                onReturn={onReturn}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { ArrowUp, Check, LoaderCircle, Undo2 } from "lucide-react";
import { panel } from "@/lib/takt-surface";
export function PromptBox({
  className,
  onSend,
  suggestions = ["Найти идею", "Уточнить задачу"],
}: {
  className?: string;
  suggestions?: string[];
  onSend?: (text: string) => void | Promise<void>;
}) {
  const [text, setText] = useState("");
  const [last, setLast] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const pending = useRef(false);
  async function send() {
    const message = text.trim();
    if (!message || pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(false);
    try {
      await onSend?.(message);
      setLast(message);
      setText("");
    } catch {
      setError(true);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <form
      className={cn(panel + " grid w-72 max-w-full gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
    >
      {last && (
        <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1.5 text-xs motion-safe:animate-in motion-safe:slide-in-from-bottom-1">
          <Check size={13} />
          <output className="min-w-0 flex-1 truncate">{last}</output>
          <button
            type="button"
            aria-label="Редактировать прошлый запрос"
            disabled={busy}
            onClick={() => {
              setText(last);
              setLast("");
              field.current?.focus();
            }}
          >
            <Undo2 size={14} />
          </button>
        </div>
      )}
      {!text && !last && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions.map((v) => (
            <button
              type="button"
              className="rounded-md border bg-muted px-2.5 py-1.5 text-[11px] hover:bg-background"
              key={v}
              onClick={() => {
                setText(v);
                field.current?.focus();
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}
      <textarea
        ref={field}
        rows={2}
        aria-label="Запрос"
        readOnly={busy}
        placeholder="О чём спросить?"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(false);
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            void send();
          }
        }}
        className="min-w-0 resize-none rounded-md bg-transparent px-1 text-sm leading-relaxed outline-offset-2"
      />
      <div className="flex items-center justify-between border-t pt-2">
        <small role="status" className="text-[10px] text-muted-foreground">
          {error ? "Не удалось отправить" : "Shift + Enter · новая строка"}
        </small>
        <button
          type="submit"
          aria-label="Отправить"
          disabled={busy || !text.trim()}
          className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground motion-safe:transition-transform motion-safe:active:scale-90 disabled:opacity-35"
        >
          {busy ? (
            <LoaderCircle className="motion-safe:animate-spin" size={15} />
          ) : (
            <ArrowUp size={16} />
          )}
        </button>
      </div>
    </form>
  );
}

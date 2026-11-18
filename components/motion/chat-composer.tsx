"use client";

import { cn } from "@/lib/utils";

import { ArrowUp, Check } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function ChatComposer({
  value,
  onChange,
  onSend,
  placeholder = "Написать сообщение",
  pending = false,
  className,
}: {
  className?: string;
  pending?: boolean;
  value?: string;
  onChange?: (text: string) => void;
  onSend?: (text: string) => void | Promise<void>;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const sending = useRef(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const text = value ?? draft;
  const busy = pending || status === "sending";
  function update(next: string) {
    if (value === undefined) setDraft(next);
    onChange?.(next);
  }
  async function submit() {
    if (!text.trim() || busy || sending.current) return;
    sending.current = true;
    setStatus("sending");
    try {
      await onSend?.(text.trim());
      update("");
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      sending.current = false;
    }
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className={cn(
        "w-full min-w-0 rounded-xl border bg-background p-2.5 text-left shadow-xs focus-within:border-primary/45",
        className,
      )}
    >
      <textarea
        ref={input}
        rows={2}
        aria-label={placeholder}
        placeholder={placeholder}
        value={text}
        readOnly={busy}
        onChange={(event) => {
          update(event.target.value);
          setStatus("idle");
        }}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing &&
            event.nativeEvent.keyCode !== 229
          ) {
            event.preventDefault();
            if (!event.repeat) void submit();
          }
        }}
        className="block w-full resize-none bg-transparent px-1 py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-end justify-between gap-2">
        <span
          role="status"
          className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground"
        >
          {status === "sent" ? (
            <>
              <Check size={13} />
              Отправлено
            </>
          ) : status === "error" ? (
            "Ошибка отправки. Попробуйте ещё раз."
          ) : busy ? (
            "Отправка…"
          ) : (
            "Shift + Enter · новая строка"
          )}
        </span>
        <Button
          type="submit"
          size="icon"
          aria-label="Отправить сообщение"
          disabled={!text.trim() || busy}
          className="rounded-full motion-safe:active:scale-90"
          onClick={() => input.current?.focus({ preventScroll: true })}
        >
          <ArrowUp />
        </Button>
      </div>
    </form>
  );
}

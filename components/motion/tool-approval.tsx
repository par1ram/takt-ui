"use client";
import { useActionFocus } from "@/lib/takt-focus";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FileText, Check, ShieldCheck, Undo2, X } from "lucide-react";
import { panel, action as primary, secondary } from "@/lib/takt-surface";
export function ToolApproval({
  className,
  action = "Прочитать файл?",
  resource = "project/brief.md",
  onDecision,
}: {
  className?: string;
  action?: string;
  resource?: string;
  onDecision?: (allowed: boolean) => void;
}) {
  const { root, focusAfterRender } = useActionFocus<HTMLElement>();
  const [decision, setDecision] = useState<boolean | null>(null);
  function respond(value: boolean) {
    focusAfterRender("[data-reset]");
    setDecision(value);
    onDecision?.(value);
  }
  return (
    <section ref={root} className={cn(panel + " grid w-64 gap-3", className)}>
      <header className="flex items-center gap-2">
        <ShieldCheck size={17} />
        <strong>{action}</strong>
      </header>
      <code
        title={resource}
        className="flex items-center gap-2 overflow-hidden rounded-lg border bg-muted/50 px-3 py-2.5 font-mono text-xs"
      >
        <FileText size={14} />
        <span className="truncate">{resource}</span>
      </code>
      {decision === null ? (
        <div className="flex gap-1.5">
          <button
            type="button"
            className={secondary + " flex-1"}
            onClick={() => respond(false)}
          >
            Отклонить
          </button>
          <button
            type="button"
            className={primary + " flex-1 text-xs"}
            onClick={() => respond(true)}
          >
            Разрешить
          </button>
        </div>
      ) : (
        <div
          className="flex min-h-10 items-center gap-2 rounded-xl bg-muted px-2.5 text-xs font-medium motion-safe:animate-in motion-safe:slide-in-from-bottom-1"
          role="status"
        >
          {decision ? (
            <Check size={15} className="text-emerald-600" />
          ) : (
            <X size={15} className="text-rose-600" />
          )}{" "}
          {decision ? "Разрешено" : "Отклонено"}
          <button
            type="button"
            className="ml-auto rounded p-1.5"
            aria-label="Сброс"
            data-reset
            onClick={() => {
              focusAfterRender("button");
              setDecision(null);
            }}
          >
            <Undo2 size={14} />
          </button>
        </div>
      )}
    </section>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { action as surfaceAction } from "@/lib/takt-surface";

import { useState } from "react";
import { LoaderCircle, Check, Play } from "lucide-react";

export function LoadingSuccess({
  className,
  onRun,
}: {
  className?: string;
  onRun?: () => Promise<void>;
}) {
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">(
    "idle",
  );
  async function run() {
    setStatus("busy");
    try {
      await (onRun
        ? onRun()
        : new Promise<void>((resolve) => setTimeout(resolve, 650)));
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }
  return (
    <button
      type="button"
      className={cn(
        surfaceAction +
          " overflow-hidden whitespace-nowrap motion-safe:transition-[width,border-radius,background-color] motion-safe:duration-300 " +
          (status === "busy"
            ? "w-30 rounded-xl"
            : status === "ok"
              ? "w-30 bg-emerald-700! text-white!"
              : "w-36"),
        className,
      )}
      aria-busy={status === "busy"}
      disabled={status === "busy"}
      onClick={run}
    >
      {status === "busy" ? (
        <LoaderCircle className="motion-safe:animate-spin" size={16} />
      ) : status === "ok" ? (
        <Check size={16} />
      ) : (
        <Play size={16} />
      )}
      <span aria-live="polite" className={status === "busy" ? "sr-only" : ""}>
        {
          {
            idle: "Запустить",
            busy: "Выполняется",
            ok: "Готово",
            error: "Повторить",
          }[status]
        }
      </span>
    </button>
  );
}

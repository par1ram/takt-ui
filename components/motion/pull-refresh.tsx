"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { panel } from "@/lib/takt-surface";

export function PullRefresh({
  className,
  onRefresh,
}: {
  className?: string;
  onRefresh?: () => Promise<void>;
}) {
  const [count, setCount] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const [armed, setArmed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const grip = useRef<{ id: number; y: number } | null>(null);
  const pending = useRef(false),
    suppress = useRef(false);
  function release() {
    grip.current = null;
    root.current?.removeAttribute("data-pulling");
    root.current?.style.removeProperty("--pull");
    setArmed(false);
  }
  async function refresh() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(false);
    try {
      await onRefresh?.();
      setCount((n) => n + 1);
    } catch {
      setError(true);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <div
      ref={root}
      className={cn(
        panel + " group grid w-64 max-w-full gap-2 overflow-hidden",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Обновить"
        disabled={busy}
        className="grid w-full touch-pan-x gap-2 rounded-md py-1 text-left active:cursor-grabbing"
        onPointerDown={(e) => {
          if (!e.isPrimary || e.button !== 0) return;
          grip.current = { id: e.pointerId, y: e.clientY };
          root.current?.setAttribute("data-pulling", "");
          suppress.current = false;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const g = grip.current;
          if (!g || g.id !== e.pointerId) return;
          const dy = e.clientY - g.y;
          if (Math.abs(dy) > 4) suppress.current = true;
          setArmed(dy >= 88);
          root.current?.style.setProperty(
            "--pull",
            Math.max(0, Math.min(8, dy * 0.09)) + "px",
          );
        }}
        onPointerUp={(e) => {
          const g = grip.current;
          if (!g || g.id !== e.pointerId) return;
          const ready = e.clientY - g.y >= 88;
          release();
          if (ready) {
            suppress.current = true;
            void refresh();
          }
        }}
        onPointerCancel={() => {
          suppress.current = true;
          release();
        }}
        onLostPointerCapture={() => {
          if (grip.current) release();
        }}
        onClick={(e) => {
          if (e.detail === 0 || !suppress.current) void refresh();
          suppress.current = false;
        }}
      >
        <span className="flex items-center justify-between gap-2">
          <strong className="text-sm">Недавние файлы</strong>
          <span
            className={
              "grid size-8 place-items-center rounded-full " +
              (armed ? "bg-primary text-primary-foreground" : "bg-muted")
            }
          >
            <RefreshCw
              size={14}
              className={busy ? "motion-safe:animate-spin" : ""}
            />
          </span>
        </span>
        <span className="flex items-center gap-2.5 border-y py-3 motion-safe:translate-y-[var(--pull,0px)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-data-[pulling]:transition-none">
          <FileText size={18} className="text-muted-foreground" />
          <span className="grid gap-0.5">
            <b className="text-xs">Макет студии.fig</b>
            <span className="text-[11px] text-muted-foreground">
              {count ? "Синхронизировано" : "Локальная версия"}
            </span>
          </span>
        </span>
      </button>
      <output className="text-[11px] text-muted-foreground">
        {error
          ? "Попробуйте ещё раз"
          : busy
            ? "Обновление…"
            : armed
              ? "Отпустите для обновления"
              : count
                ? "Версия " + (count + 1)
                : "Потяните вниз для синхронизации"}
      </output>
    </div>
  );
}

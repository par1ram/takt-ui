"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FileText, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { panel } from "@/lib/takt-surface";
import { cn } from "@/lib/utils";

type ScanState = "idle" | "scanning" | "success" | "error";
const corners = [
  "M10 25v-6a9 9 0 0 1 9-9h6",
  "M39 10h6a9 9 0 0 1 9 9v6",
  "M54 39v6a9 9 0 0 1-9 9h-6",
  "M25 54h-6a9 9 0 0 1-9-9v-6",
];
const face = ["M22 25v4", "M42 25v4", "M32 25v10l-3 1", "M24 40q8 7 16 0"];
const captions = {
  idle: "Начать сканирование",
  scanning: "Сканирование…",
  success: "Готово · Закрыть доступ",
  error: "Повторить сканирование",
};

export function UnlockFaceId({
  className,
  onDemoComplete,
  status,
  onScan,
}: {
  className?: string;
  onDemoComplete?: () => void;
  status?: ScanState;
  onScan?: () => void;
}) {
  const [demo, setDemo] = useState<ScanState>("idle");
  const phase = status ?? demo;
  const scanning = phase === "scanning";
  const unlocked = phase === "success";
  const caption = status !== undefined && unlocked ? "Доступ открыт" : captions[phase];
  const reduced = useReducedMotion();
  const complete = useEffectEvent(() => onDemoComplete?.());
  useEffect(() => {
    if (status !== undefined || demo !== "scanning") return;
    const timer = setTimeout(() => {
      setDemo("success");
      complete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [demo, status]);
  return (
    <section className={cn(panel, "w-[246px] max-w-full", className)}>
      <button
        type="button"
        aria-label={"Face ID " + caption}
        disabled={scanning || (status !== undefined && unlocked)}
        onClick={() => {
          if (unlocked) {
            setDemo("idle");
            return;
          }
          if (status === undefined) setDemo("scanning");
          onScan?.();
        }}
        className="flex w-full items-center gap-3 rounded-xl text-left disabled:cursor-default"
      >
        <span
          aria-hidden
          className="relative grid size-[70px] shrink-0 place-items-center overflow-hidden rounded-[19px] bg-[#182520] text-[#cfe9dc] shadow-[inset_0_0_0_1px_#ffffff21,inset_0_-8px_18px_#0003]"
        >
          <svg
            viewBox="0 0 64 64"
            className="size-[62px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {corners.map((d, i) => (
              <motion.path
                key={phase + i}
                d={d}
                initial={scanning && !reduced ? { pathLength: 0.12 } : false}
                animate={{ pathLength: 1, opacity: unlocked ? 0.35 : 0.85 }}
                transition={{
                  duration: reduced ? 0 : 0.35,
                  delay: scanning && !reduced ? i * 0.07 : 0,
                }}
              />
            ))}
            {unlocked ? (
              <motion.path
                d="M21 32l8 8 16-18"
                stroke="#a1e5b8"
                strokeWidth="3.4"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduced ? 0 : 0.32 }}
              />
            ) : phase === "error" ? (
              <path d="M25 25l14 14m0-14L25 39" />
            ) : (
              face.map((d, i) => (
                <motion.path
                  key={phase + d}
                  d={d}
                  initial={
                    scanning && !reduced
                      ? { pathLength: 0, opacity: 0.2 }
                      : false
                  }
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: reduced ? 0 : 0.42,
                    delay: scanning && !reduced ? 0.26 + i * 0.07 : 0,
                  }}
                />
              ))
            )}
          </svg>
          {scanning && !reduced && (
            <motion.span
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [0, 42, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-x-2 top-3 h-2 border-b border-emerald-200 bg-linear-to-b from-transparent to-emerald-300/35"
            />
          )}
        </span>
        <span className="grid gap-1">
          <strong className="text-base leading-5 tracking-tight">
            Face ID{" "}
          </strong>
          <span
            role="status"
            className="text-xs leading-4 text-muted-foreground"
          >
            {caption}
          </span>
        </span>
      </button>
      <div className="mt-4 flex items-center gap-2.5 border-t pt-3">
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted"
        >
          <FileText size={15} />
        </span>
        <span className="grid min-w-0 flex-1 gap-0.5 text-xs">
          <span
            className={cn(
              "truncate font-semibold motion-safe:transition-[filter,opacity] motion-safe:duration-400",
              !unlocked && "blur-[3px] select-none",
            )}
            aria-hidden={!unlocked}
          >
            Бриф проекта.fig
          </span>
          <span className="text-[10px] text-muted-foreground">
            {unlocked
              ? "Доступ открыт"
              : phase === "error"
                ? "Лицо не распознано"
                : "Закрытый файл"}
          </span>
        </span>
        {unlocked ? (
          <LockKeyholeOpen
            aria-hidden
            size={15}
            className="text-emerald-700 dark:text-emerald-300"
          />
        ) : (
          <LockKeyhole
            aria-hidden
            size={15}
            className="text-muted-foreground"
          />
        )}
      </div>
    </section>
  );
}

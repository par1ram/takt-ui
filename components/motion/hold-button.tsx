// Ported from Kokonut UI (https://kokonutui.com/docs/buttons/hold-button).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Check, Fingerprint } from "lucide-react";
export function HoldButton({
  className,
  onConfirm,
  duration = 800,
  resetAfter = 1400,
}: {
  className?: string;
  onConfirm?: () => void;
  duration?: number;
  resetAfter?: number;
}) {
  const [phase, setPhase] = useState<"idle" | "holding" | "done">("idle");
  const state = useRef(phase);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function change(p: typeof phase) {
    state.current = p;
    setPhase(p);
  }
  function clear() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }
  useEffect(() => {
    function interrupt() {
      if (state.current === "holding") {
        clear();
        state.current = "idle";
        setPhase("idle");
      }
    }
    function visibility() {
      if (document.hidden) interrupt();
    }
    window.addEventListener("blur", interrupt);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", interrupt);
      document.removeEventListener("visibilitychange", visibility);
      clear();
      state.current = "idle";
      setPhase("idle");
    };
  }, []);
  function start() {
    if (state.current !== "idle") return;
    change("holding");
    timer.current = setTimeout(
      () => {
        change("done");
        timer.current = setTimeout(
          () => change("idle"),
          Math.max(0, resetAfter),
        );
        onConfirm?.();
      },
      Math.max(0, duration),
    );
  }
  function cancel() {
    if (state.current === "holding") {
      clear();
      change("idle");
    }
  }
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-12 min-w-44 cursor-pointer touch-none items-center justify-center gap-2.5 overflow-hidden rounded-full border border-foreground/15 bg-card px-5 text-sm font-semibold text-card-foreground shadow-sm select-none",
        className,
      )}
      onPointerDown={(e) => {
        if (e.button !== 0 || !e.isPrimary) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        start();
      }}
      onContextMenu={(e) => e.preventDefault()}
      onPointerUp={cancel}
      onLostPointerCapture={cancel}
      onPointerCancel={cancel}
      onBlur={cancel}
      onKeyDown={(e) => {
        if (["Enter", " "].includes(e.key)) {
          e.preventDefault();
          if (!e.repeat) start();
        }
      }}
      onKeyUp={(e) => {
        if (["Enter", " "].includes(e.key)) {
          e.preventDefault();
          cancel();
        }
      }}
    >
      <Fingerprint size={18} />
      <span aria-live="polite">
        {phase === "done" ? "Подтверждено" : "Удерживайте"}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center gap-2.5 bg-primary text-primary-foreground motion-safe:transition-[clip-path] motion-reduce:transition-none! motion-reduce:duration-0!"
        style={{
          clipPath: phase === "idle" ? "inset(0 100% 0 0)" : "inset(0 0 0 0)",
          transitionTimingFunction: "linear",
          transitionDuration: (phase === "holding" ? duration : 100) + "ms",
        }}
      >
        {phase === "done" ? <Check size={18} /> : <Fingerprint size={18} />}{" "}
        {phase === "done" ? "Подтверждено" : "Удерживайте"}
      </span>
    </button>
  );
}

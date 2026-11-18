"use client";
import { cn } from "@/lib/utils";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Upload } from "lucide-react";

export function HoldToPublish({
  className,
  duration = 1200,
  label = "Опубликовать",
  onPublish,
}: {
  className?: string;
  duration?: number;
  label?: string;
  onPublish?: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "holding" | "published">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const phaseRef = useRef(phase);
  const reduced = useReducedMotion();
  const holdMs = Number.isFinite(duration) ? Math.max(0, duration) : 1200;

  const change = useCallback((next: typeof phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);
  const cancel = useCallback(() => {
    if (phaseRef.current !== "holding") return;
    clearTimeout(timeout.current);
    change("idle");
  }, [change]);
  useEffect(() => {
    function visibility() {
      if (document.hidden) cancel();
    }
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", visibility);
      clearTimeout(timeout.current);
      phaseRef.current = "idle";
      setPhase("idle");
    };
  }, [cancel]);
  function begin() {
    if (phaseRef.current !== "idle") return;
    change("holding");
    timeout.current = setTimeout(() => {
      change("published");
      timeout.current = setTimeout(() => change("idle"), 1700);
      onPublish?.();
    }, holdMs);
  }
  const published = phase === "published";
  return (
    <motion.button
      type="button"
      initial={false}
      aria-label={
        published
          ? "Опубликовано"
          : label === "Опубликовать"
            ? "Удерживать для публикации"
            : "Удерживать для действия «" + label + "»"
      }
      animate={{
        width: published ? 56 : 220,
        scale: phase === "holding" && !reduced ? 0.97 : 1,
      }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 240, damping: 27 }
      }
      className={cn(
        "relative grid h-14 max-w-full touch-none place-items-center overflow-hidden rounded-full border border-foreground/10 bg-card font-medium text-card-foreground shadow-md select-none",
        published && "bg-primary",
        className,
      )}
      onPointerDown={(e) => {
        if (e.isPrimary && e.button === 0) {
          e.currentTarget.setPointerCapture(e.pointerId);
          begin();
        }
      }}
      onPointerCancel={cancel}
      onLostPointerCapture={cancel}
      onPointerUp={cancel}
      onBlur={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!e.repeat) begin();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cancel();
        }
      }}
    >
      {published ? (
        <Check
          aria-hidden
          size={21}
          className="relative text-primary-foreground"
        />
      ) : (
        <>
          <span
            aria-hidden
            className="absolute flex items-center gap-2 whitespace-nowrap"
          >
            <Upload size={16} />
            {label}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap bg-primary text-primary-foreground motion-safe:transition-[clip-path] motion-reduce:duration-0! motion-reduce:transition-none!"
            style={{
              clipPath: phase === "holding" ? "inset(0)" : "inset(0 100% 0 0)",
              transitionDuration: (phase === "holding" ? holdMs : 180) + "ms",
              transitionTimingFunction: "linear",
            }}
          >
            <Upload size={16} />
            {label}
          </span>
        </>
      )}
      <span className="sr-only" role="status">
        {published ? "Опубликовано" : ""}
      </span>
    </motion.button>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, useId } from "react";
import { Pause, Play, SkipForward } from "lucide-react";
import { panel } from "@/lib/takt-surface";
export function ReadAlong({
  className,
  text = "Всё начинается с простого движения.",
  interval = 600,
}: {
  className?: string;
  text?: string;
  interval?: number;
}) {
  const highlight = useId();
  const reduced = useReducedMotion();
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = words.length - 1;
  const position = Math.min(index, last);
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => {
        if (position >= last) setPlaying(false);
        else setIndex(position + 1);
      },
      Math.max(120, interval),
    );
    return () => clearTimeout(id);
  }, [playing, position, last, interval]);
  const control =
    "grid size-8 place-items-center rounded-full hover:bg-muted motion-safe:active:scale-95";
  return (
    <section className={cn(panel + " w-60 max-w-full", className)}>
      <div
        aria-label={text}
        className="mb-3 flex max-h-28 flex-wrap gap-x-1 gap-y-0.5 overflow-auto text-lg leading-relaxed font-medium tracking-tight"
      >
        {words.map((word, i) => (
          <button
            type="button"
            aria-label={"Читать со слова «" + word + "»"}
            onClick={() => setIndex(i)}
            key={i}
            className={
              "relative isolate rounded px-0.5 motion-safe:transition-colors motion-safe:duration-300 " +
              (i === position
                ? "text-foreground"
                : i < position
                  ? "text-foreground"
                  : "text-muted-foreground")
            }
          >
            {i === position && (
              <motion.span
                aria-hidden
                layoutId={highlight}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 230, damping: 31 }
                }
                className="absolute inset-0 -z-10 rounded bg-primary/15"
              />
            )}
            {word}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 border-t pt-2">
        <button
          type="button"
          className={control}
          disabled={!words.length}
          aria-label={playing ? "Приостановить чтение" : "Воспроизвести чтение"}
          onClick={() => {
            if (!playing && position === last) setIndex(0);
            setPlaying(!playing);
          }}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button
          type="button"
          className={control}
          disabled={!words.length}
          aria-label="Выделить следующее слово"
          onClick={() => {
            setPlaying(false);
            setIndex(position === last ? 0 : position + 1);
          }}
        >
          <SkipForward size={15} />
        </button>
        <output className="ml-auto font-mono text-xs tabular-nums">
          {position + 1} / {words.length}
        </output>
      </div>
    </section>
  );
}

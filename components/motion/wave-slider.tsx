"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { panel } from "@/lib/takt-surface";
export function WaveSlider({
  className,
  label = "Громкость",
  defaultValue = 60,
  value,
  onValueChange,
}: {
  className?: string;
  label?: string;
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const level = Math.max(0, Math.min(100, value ?? internal));
  const remembered = useRef(level || 60);
  function setVolume(n: number) {
    if (value === undefined) setInternal(n);
    onValueChange?.(n);
  }
  return (
    <div
      className={cn(
        panel +
          " flex w-60 max-w-full items-center gap-2.5 rounded-full! px-2.5! py-1!",
        className,
      )}
    >
      <span className="flex shrink-0 items-center text-xs font-medium">
        <button
          type="button"
          aria-label={level === 0 ? "Включить звук" : "Выключить звук"}
          aria-pressed={level === 0}
          className="grid size-9 place-items-center rounded-full bg-muted"
          onClick={() => {
            if (level) {
              remembered.current = level;
              setVolume(0);
            } else setVolume(remembered.current);
          }}
        >
          {level === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </span>
      <span className="relative flex h-11 min-w-0 flex-1 items-center rounded focus-within:ring-1 focus-within:ring-foreground/35">
        <span
          aria-hidden
          className="relative mx-1 h-1 w-full rounded-full bg-foreground/15"
        >
          <i
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ width: level + "%" }}
          />
          <i
            className="absolute top-1/2 size-3 -translate-1/2 rounded-full bg-primary"
            style={{ left: level + "%" }}
          />
        </span>
        <input
          type="range"
          aria-label={label}
          aria-valuetext={level + "%"}
          value={level}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          onChange={(e) => {
            const n = +e.target.value;
            setVolume(n);
          }}
        />
      </span>
      <output className="w-9 text-right font-mono text-xs tabular-nums">
        {level}%
      </output>
    </div>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sun, RotateCcw } from "lucide-react";
import { foldCover } from "@/lib/takt-art-fold";
export function ExposureSlider({
  className,
  onChange,
  image = foldCover,
}: {
  className?: string;
  onChange?: (ev: number) => void;
  image?: string;
}) {
  const [ev, setEv] = useState(0);
  const [compare, setCompare] = useState(false);
  function update(v: number) {
    setEv(v);
    onChange?.(v);
  }
  return (
    <div
      className={cn(
        "w-60 overflow-hidden rounded-[21px] border border-black/15 bg-[#21242a] p-1.5 text-white shadow-xl",
        className,
      )}
    >
      <div className="relative h-[100px] overflow-hidden rounded-[16px]">
        <div
          role="img"
          aria-label="Предпросмотр экспозиции"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("' + image + '")',
            filter: "brightness(" + Math.pow(2, ev) + ")",
          }}
        />
        {compare && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-cover bg-center [clip-path:inset(0_50%_0_0)]"
            style={{ backgroundImage: 'url("' + image + '")' }}
          />
        )}
        {compare && (
          <i
            aria-hidden
            className="absolute inset-y-0 left-1/2 w-px bg-white"
          />
        )}
        <button
          type="button"
          aria-label="Сравнить с оригиналом"
          aria-pressed={compare}
          onClick={() => setCompare(!compare)}
          className="absolute bottom-2 left-2 rounded-full bg-black/75 px-2.5 py-1.5 text-[11px] text-white"
        >
          {compare ? "До / После" : "Сравнить"}
        </button>
        <output className="absolute top-2 right-2 rounded-full bg-black/65 px-2 py-0.5 font-mono text-[10px] tabular-nums">
          {ev > 0 ? "+" : ""}
          {ev.toFixed(1)} EV
        </output>
      </div>
      <div className="px-2 pt-2 pb-1">
        <div className="flex items-center gap-1.5 text-xs">
          <Sun size={14} />
          Экспозиция
          <button
            type="button"
            aria-label="Сбросить экспозицию"
            disabled={ev === 0}
            className="ml-auto rounded p-1 disabled:opacity-40"
            onClick={() => update(0)}
          >
            <RotateCcw size={13} />
          </button>
        </div>
        <label className="relative block h-8 rounded focus-within:outline-2">
          <span
            className="absolute inset-x-1 top-2 h-3 text-white/40"
            style={{
              background:
                "repeating-linear-gradient(90deg,currentColor 0 1px,transparent 1px 5%)",
            }}
          />
          <span className="absolute inset-x-1 top-1">
            <i
              className="absolute h-5 w-1 -translate-x-1/2 rounded-full bg-white shadow-md"
              style={{ left: (ev + 2) * 25 + "%" }}
            />
          </span>
          <input
            type="range"
            aria-label="Экспозиция"
            aria-valuetext={ev + " EV"}
            min={-2}
            max={2}
            step={0.1}
            value={ev}
            className="absolute inset-0 w-full cursor-ew-resize opacity-0"
            onChange={(e) => update(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}

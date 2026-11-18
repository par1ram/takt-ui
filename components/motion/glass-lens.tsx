"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { ScanSearch } from "lucide-react";
import { glassCover } from "@/lib/takt-art-glass";
export function GlassLens({
  className,
  label = "Линза ×2",
  image = glassCover,
}: {
  className?: string;
  label?: string;
  image?: string;
}) {
  const lens = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: 0.58, y: 0.52 });
  const [zoomed, setZoomed] = useState(false);
  function position(
    x: number,
    y: number,
    w: number,
    h: number,
    zoom = zoomed ? 3 : 2,
  ) {
    const node = lens.current;
    if (!node) return;
    const radius = node.offsetWidth / 2;
    const px = Math.max(0, Math.min(w, x));
    const py = Math.max(0, Math.min(h, y));
    pos.current = { x: px / w, y: py / h };
    node.style.left = (100 * px) / w + "%";
    node.style.top = (100 * py) / h + "%";
    node.style.backgroundSize = w * zoom + "px " + h * zoom + "px";
    node.style.backgroundPosition =
      radius - zoom * px + "px " + (radius - zoom * py) + "px";
  }
  return (
    <div
      role="button"
      aria-pressed={zoomed}
      onClick={(e) => {
        setZoomed(!zoomed);
        const { clientWidth: w, clientHeight: h } = e.currentTarget;
        position(pos.current.x * w, pos.current.y * h, w, h, zoomed ? 2 : 3);
      }}
      tabIndex={0}
      aria-label="Лупа: перемещайте указателем или стрелками. Нажмите для смены увеличения"
      className={cn(
        "relative aspect-square w-[180px] touch-pan-y overflow-hidden rounded-2xl border border-white/20 bg-cover shadow-[0_12px_24px_-9px_#17372c80] outline-offset-4",
        className,
      )}
      style={{ backgroundImage: 'url("' + image + '")' }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        position(
          e.clientX - r.left,
          e.clientY - r.top,
          e.currentTarget.clientWidth,
          e.currentTarget.clientHeight,
        );
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
          return;
        }
        const keys: Record<string, [number, number]> = {
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
          ArrowUp: [0, -1],
          ArrowDown: [0, 1],
        };
        const delta = keys[e.key];
        if (!delta) return;
        e.preventDefault();
        const { clientWidth: w, clientHeight: h } = e.currentTarget;
        position(
          pos.current.x * w + delta[0] * 8,
          pos.current.y * h + delta[1] * 8,
          w,
          h,
        );
      }}
    >
      <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[9px] font-medium text-white">
        <ScanSearch size={11} />
        {zoomed ? "Линза ×3" : label}
      </span>
      <span
        ref={lens}
        aria-hidden
        className="pointer-events-none absolute size-16 -translate-1/2 rounded-full border border-white/75 shadow-[inset_2px_3px_5px_#ffffff77,inset_-2px_-3px_5px_#0004,0_4px_10px_#0005]"
        style={{
          left: "58%",
          top: "52%",
          backgroundImage: 'url("' + image + '")',
          backgroundSize: "320px 320px",
          backgroundPosition: "-154px -134px",
        }}
      />
    </div>
  );
}

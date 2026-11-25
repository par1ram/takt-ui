// Ported from Kokonut UI (https://kokonutui.com/docs/inputs/signature-pad).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";
import { useRef, useState, type PointerEvent } from "react";
import { Undo2 } from "lucide-react";
import { panel, secondary } from "@/lib/takt-surface";
type StrokePoint = { x: number; y: number; width: number };
type Stroke = StrokePoint[];
function paint(ctx: CanvasRenderingContext2D, a: StrokePoint, b: StrokePoint) {
  ctx.strokeStyle = ctx.fillStyle = "#23272e";
  ctx.lineCap = "round";
  ctx.lineWidth = b.width;
  if (a.x === b.x && a.y === b.y) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.width / 2, 0, 2 * Math.PI);
    ctx.fill();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}
export function SignaturePad({
  className,
  onSave,
}: {
  className?: string;
  onSave?: (png: string) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    strokes = useRef<Stroke[]>([]),
    drawing = useRef<number | null>(null);
  const [count, setCount] = useState(0);
  function point(e: PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * 480) / rect.width,
      y: ((e.clientY - rect.top) * 192) / rect.height,
      width: e.pointerType === "pen" ? 2 + e.pressure * 7 : 4,
    };
  }
  function redraw(next: Stroke[]) {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    strokes.current = next;
    ctx.clearRect(0, 0, 480, 192);
    for (const stroke of next)
      stroke.forEach((p, i) => paint(ctx, stroke[Math.max(0, i - 1)], p));
    setCount(next.length);
  }
  return (
    <div className={cn(panel + " grid w-72 max-w-full gap-3", className)}>
      <canvas
        ref={canvas}
        width={480}
        height={192}
        aria-label="Поле для рисунка подписи"
        className="w-full touch-none rounded-lg border border-foreground/15 bg-[#f5f4ef] bg-[linear-gradient(transparent_77%,#babbad_77.5%,transparent_78%)]"
        onPointerDown={(e) => {
          if (!e.isPrimary || e.button !== 0) return;
          const ctx = e.currentTarget.getContext("2d");
          if (!ctx) return;
          drawing.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          const p = point(e);
          strokes.current.push([p]);
          paint(ctx, p, p);
          setCount(strokes.current.length);
        }}
        onPointerMove={(e) => {
          if (drawing.current !== e.pointerId) return;
          const ctx = e.currentTarget.getContext("2d"),
            stroke = strokes.current.at(-1);
          if (!ctx || !stroke) return;
          const p = point(e);
          paint(ctx, stroke[stroke.length - 1], p);
          stroke.push(p);
        }}
        onLostPointerCapture={() => {
          drawing.current = null;
        }}
        onPointerCancel={() => {
          drawing.current = null;
        }}
        onPointerUp={() => {
          drawing.current = null;
        }}
      />
      <div className="flex gap-1">
        <button
          type="button"
          className={secondary}
          disabled={!count}
          aria-label="Отменить последний штрих"
          onClick={() => redraw(strokes.current.slice(0, -1))}
        >
          <Undo2 size={14} />
        </button>
        <button
          type="button"
          className={secondary}
          disabled={!count}
          onClick={() => redraw([])}
        >
          Очистить
        </button>
        <button
          type="button"
          className={secondary}
          disabled={!count}
          onClick={() => {
            const png = canvas.current?.toDataURL();
            if (!png) return;
            if (onSave) onSave(png);
            else {
              const link = document.createElement("a");
              link.href = png;
              link.download = "signature.png";
              link.click();
            }
          }}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}

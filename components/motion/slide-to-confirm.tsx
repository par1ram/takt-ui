"use client";
import { useActionFocus } from "@/lib/takt-focus";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Check, ChevronsRight, RotateCcw } from "lucide-react";
export function SlideToConfirm({
  className,
  onConfirm,
}: {
  className?: string;
  onConfirm?: () => void;
}) {
  const { root, focusAfterRender } = useActionFocus<HTMLDivElement>();
  const [progress, setProgress] = useState(0);
  const done = progress === 100;
  const range = useRef<HTMLInputElement>(null);
  const thumb = useRef<HTMLElement>(null);
  const confirmed = useRef(false);
  const drag = useRef<{
    id: number;
    startX: number;
    startY: number;
    origin: number;
    initial: number;
    width: number;
    end: number;
    moving: boolean;
  } | null>(null);

  function cancelDrag() {
    if (!drag.current) return;
    setProgress(drag.current.initial);
    drag.current = null;
  }

  useEffect(() => {
    window.addEventListener("blur", cancelDrag);
    return () => {
      window.removeEventListener("blur", cancelDrag);
      cancelDrag();
    };
  }, []);

  function confirm() {
    if (confirmed.current) return;
    confirmed.current = true;
    drag.current = null;
    focusAfterRender("button");
    setProgress(100);
    onConfirm?.();
  }

  function advance(event: PointerEvent<HTMLDivElement>) {
    const grip = drag.current;
    if (!grip || grip.id !== event.pointerId) return;
    const dx = event.clientX - grip.startX;
    if (!grip.moving) {
      if (dx < 5 || dx < Math.abs(event.clientY - grip.startY)) return;
      grip.moving = true;
    }
    const distance = Math.max(0, Math.min(grip.width, grip.origin + dx));
    const tolerance = Math.min(16, grip.width * 0.1);
    const nearEnd = distance >= grip.width - tolerance || event.clientX >= grip.end - tolerance;
    const minimumSwipe = Math.min(28, grip.width * 0.22, Math.max(5, grip.width * (1 - grip.initial / 100)));
    if (nearEnd && dx >= minimumSwipe) confirm();
    else setProgress(Math.min(99, Math.round(distance / grip.width * 100)));
  }
  return (
    <div ref={root} className={cn("relative w-60 max-w-full", className)}>
      <div
        className="relative grid h-[54px] touch-pan-y select-none place-items-center overflow-hidden rounded-full border border-foreground/15 bg-card text-card-foreground shadow-sm focus-within:outline-2 focus-within:outline-offset-4"
        onPointerDown={(e) => {
          if (!e.isPrimary || e.button !== 0 || done || drag.current) return;
          const knob = thumb.current;
          const track = knob?.parentElement;
          if (!knob || !track) return;
          const bounds = knob.getBoundingClientRect();
          const rail = track.getBoundingClientRect();
          if (rail.width <= 0) return;
          const onThumb = e.clientX >= bounds.left - 5 && e.clientX <= bounds.right + 5;
          const firstCenter = rail.left + bounds.width / 2;
          e.preventDefault();
          range.current?.focus({ preventScroll: true });
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = {
            id: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            origin: onThumb
              ? rail.width * progress / 100
              : Math.max(0, Math.min(rail.width, e.clientX - firstCenter)),
            initial: progress,
            width: rail.width,
            end: firstCenter + rail.width,
            moving: false,
          };
        }}
        onPointerMove={advance}
        onPointerUp={(event) => {
          if (drag.current?.id !== event.pointerId) return;
          advance(event);
          cancelDrag();
        }}
        onPointerCancel={(event) => {
          if (drag.current?.id === event.pointerId) cancelDrag();
        }}
        onLostPointerCapture={(event) => {
          if (drag.current?.id === event.pointerId) cancelDrag();
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-left rounded-full bg-primary/15"
          style={{ transform: "scaleX(" + progress / 100 + ")" }}
        />
        <i
          aria-hidden
          className="pointer-events-none absolute inset-y-4 right-5 w-px border-l border-dashed border-foreground/25"
        />
        <span className="relative text-xs font-semibold" role="status">
          {done ? "Подтверждено" : "Сдвиньте вправо"}
        </span>
        <span className="pointer-events-none absolute inset-x-[5px] top-[5px] mr-11">
          <i
            ref={thumb}
            className={
              "pointer-events-auto absolute grid size-11 touch-none cursor-grab place-items-center rounded-full shadow-md active:cursor-grabbing " +
              (done ? "bg-emerald-700 text-white" : "bg-primary text-primary-foreground")
            }
            style={{ left: progress + "%" }}
          >
            {done ? <Check size={18} /> : <ChevronsRight size={19} />}
          </i>
        </span>
        <input
          ref={range}
          type="range"
          min="0"
          max="100"
          aria-label="Подтверждение"
          aria-valuetext={done ? "Подтверждено" : progress + "%"}
          disabled={done}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
          value={progress}
          onBlur={cancelDrag}
          onKeyDown={(event) => {
            if (event.key === "Escape") cancelDrag();
          }}
          onChange={(e) => {
            if (drag.current) return;
            const value = Number(e.target.value);
            if (value === 100) confirm();
            else setProgress(value);
          }}
        />
      </div>
      {done && (
        <button
          type="button"
          aria-label="Сбросить подтверждение"
          className="absolute top-1/2 left-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground"
          onClick={() => {
            confirmed.current = false;
            focusAfterRender("input");
            setProgress(0);
          }}
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
}

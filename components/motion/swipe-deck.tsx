"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { orbitCover } from "@/lib/takt-art-orbit";
import { foldCover } from "@/lib/takt-art-fold";
import { glassCover } from "@/lib/takt-art-glass";

export type DeckCard = {
  title: string;
  color: string;
  ink: string;
  cover?: string;
};
const posters: DeckCard[] = [
  { title: "Orbit", color: "#b0c2ba", ink: "#1f2824", cover: orbitCover },
  { title: "Fold", color: "#a6bdd4", ink: "#15263c", cover: foldCover },
  { title: "Glass", color: "#acd0c4", ink: "#15362c", cover: glassCover },
];
export function SwipeDeck({
  className,
  cards = posters,
  onSwipe,
}: {
  className?: string;
  cards?: DeckCard[];
  onSwipe?: (card: DeckCard, direction: "left" | "right") => void;
}) {
  const [index, setIndex] = useState(0);
  const lead = useRef<HTMLSpanElement>(null);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    lastX: number;
    time: number;
    speed: number;
    tilt: number;
    width: number;
    travelled: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const leaving = useRef(false);
  if (!cards.length) return null;
  const front = index % cards.length;
  const reduce = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  async function turn(direction: number) {
    if (leaving.current || cards.length < 2) return;
    leaving.current = true;
    const node = lead.current;
    if (node && !reduce()) {
      const exit = node.animate(
        [
          { transform: getComputedStyle(node).transform, opacity: 1 },
          {
            transform:
              "translateX(" +
              direction * 68 +
              "px) rotate(" +
              direction * 18 +
              "deg) scale(.95)",
            opacity: 0,
          },
        ],
        { duration: 240, easing: "cubic-bezier(.4,0,.8,.4)" },
      );
      try {
        await exit.finished;
      } catch {
        return;
      } finally {
        leaving.current = false;
      }
    }
    onSwipe?.(cards[front], direction < 0 ? "left" : "right");
    node?.style.removeProperty("--next");
    node?.style.removeProperty("--previous");
    setIndex((i) => (i - direction + cards.length) % cards.length);
    leaving.current = false;
  }
  function releaseCard() {
    drag.current = null;
    if (!lead.current) return;
    lead.current.style.removeProperty("transition");
    lead.current.style.removeProperty("--next");
    lead.current.style.removeProperty("--previous");
    lead.current.style.transform = "rotate(5deg)";
  }
  return (
    <div className={cn("grid justify-items-center gap-3", className)}>
      <button
        type="button"
        aria-label={cards[front].title + " — показать следующую карточку"}
        className="relative h-[154px] w-[134px] touch-pan-y cursor-grab rounded-xl outline-offset-8 select-none active:cursor-grabbing"
        onPointerDown={(e) => {
          if (
            !e.isPrimary ||
            e.button !== 0 ||
            leaving.current ||
            cards.length < 2
          )
            return;
          const rect = e.currentTarget.getBoundingClientRect();
          drag.current = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            lastX: e.clientX,
            time: e.timeStamp,
            speed: 0,
            tilt: e.clientY - rect.top < rect.height / 2 ? 1 : -1,
            width: rect.width,
            travelled: false,
          };
          suppressClick.current = false;
          if (lead.current) lead.current.style.transition = "none";
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const grip = drag.current;
          if (!grip || grip.id !== e.pointerId || !lead.current) return;
          const dx = e.clientX - grip.x,
            dy = e.clientY - grip.y;
          const elapsed = e.timeStamp - grip.time;
          if (elapsed > 0)
            grip.speed =
              0.5 * grip.speed +
              (0.5 * (e.clientX - grip.lastX) * 1000) / elapsed;
          grip.time = e.timeStamp;
          grip.lastX = e.clientX;
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) grip.travelled = true;
          lead.current.style.setProperty(
            "--next",
            String(Math.min(1, Math.max(0, -dx / 55))),
          );
          lead.current.style.setProperty(
            "--previous",
            String(Math.min(1, Math.max(0, dx / 55))),
          );
          if (!reduce())
            lead.current.style.transform =
              "translate(" +
              dx +
              "px," +
              dy * 0.35 +
              "px) rotate(" +
              (5 + dx * 0.065 * grip.tilt) +
              "deg)";
        }}
        onPointerCancel={() => {
          suppressClick.current = true;
          releaseCard();
        }}
        onLostPointerCapture={() => {
          if (drag.current) releaseCard();
        }}
        onPointerUp={(e) => {
          const grip = drag.current;
          if (!grip || grip.id !== e.pointerId) return;
          const dx = e.clientX - grip.x;
          // The original uses a 110px throw on a 256px card, or a quick flick.
          const flick =
            e.timeStamp - grip.time < 80 &&
            Math.abs(grip.speed) > 700 &&
            Math.sign(grip.speed) === Math.sign(dx);
          suppressClick.current = grip.travelled || Math.abs(dx) > 5;
          if (
            Math.abs(dx) > (grip.width * 110) / 256 ||
            (Math.abs(dx) > 5 && flick)
          ) {
            drag.current = null;
            if (lead.current) lead.current.style.removeProperty("transition");
            void turn(Math.sign(dx));
          } else releaseCard();
        }}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          void turn(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            void turn(e.key === "ArrowLeft" ? 1 : -1);
          }
        }}
      >
        {Array.from({ length: Math.min(3, cards.length) }, (_, depth) => {
          const pos = (front + depth) % cards.length;
          const card = cards[pos];
          return (
            <span
              key={pos}
              ref={depth === 0 ? lead : undefined}
              aria-hidden
              className="absolute inset-0 overflow-hidden rounded-[12px] border border-black/10 text-left shadow-[0_3px_4px_#0002,0_14px_17px_-10px_#0005] motion-safe:transition-[transform] duration-300 ease-out"
              style={{
                zIndex: 3 - depth,
                backgroundColor: card.color,
                color: card.ink,
                transform:
                  depth === 0
                    ? "rotate(5deg)"
                    : "translate(" +
                      -depth * 10 +
                      "px," +
                      -depth * 2 +
                      "px) rotate(" +
                      (5 - depth * 12) +
                      "deg)",
              }}
            >
              <span
                className="absolute inset-0 bg-cover bg-center grayscale"
                style={{
                  backgroundImage: card.cover
                    ? 'url("' + card.cover + '")'
                    : "repeating-radial-gradient(ellipse at 75% 15%,transparent 0 5px,currentColor 6px 8px)",
                }}
              />
              {depth === 0 && (
                <>
                  <span
                    className="absolute top-3 right-2 -rotate-6 rounded border border-white/70 bg-black/50 px-1.5 font-mono text-[9px] text-white"
                    style={{ opacity: "var(--next,0)" }}
                  >
                    ДАЛЬШЕ
                  </span>
                  <span
                    className="absolute top-3 left-2 rotate-6 rounded border border-white/70 bg-black/50 px-1.5 font-mono text-[9px] text-white"
                    style={{ opacity: "var(--previous,0)" }}
                  >
                    НАЗАД
                  </span>
                </>
              )}
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-black/80 to-transparent px-3 pt-7 pb-2 text-white">
                <span className="font-serif text-[29px] leading-none tracking-[-.055em]">
                  {card.title}
                </span>
                <span className="font-mono text-[8px]">
                  {String(pos + 1).padStart(2, "0")}
                </span>
              </span>
            </span>
          );
        })}
      </button>
      <span className="flex items-center gap-1.5" aria-hidden>
        {cards.slice(0, 12).map((_, i) => (
          <i
            key={i}
            className={
              "h-1 rounded-full transition-[width] motion-reduce:transition-none " +
              (i === front ? "w-4 bg-primary" : "w-1 bg-foreground/25")
            }
          />
        ))}
      </span>
      <span className="sr-only" aria-live="polite">
        {cards[front].title}
      </span>
    </div>
  );
}

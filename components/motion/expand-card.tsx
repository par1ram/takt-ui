"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpLeft, ChevronRight } from "lucide-react";
import { glassCover } from "@/lib/takt-art-glass";
import { orbitCover } from "@/lib/takt-art-orbit";
import { foldCover } from "@/lib/takt-art-fold";
import { cn } from "@/lib/utils";

export type ExpandCardItem = {
  title: string;
  cover: string;
  body: string;
  subtitle?: string;
};
const collection: ExpandCardItem[] = [
  {
    title: "Коллекция Glass",
    subtitle: "Стекло и свет",
    cover: glassCover,
    body: "Две стеклянные полусферы. Тонкая кромка ловит свет, а глубина меняет оттенок от мяты до изумруда.",
  },
  {
    title: "Коллекция Orbit",
    subtitle: "Металл и форма",
    cover: orbitCover,
    body: "Полированный металл отражает соседние поверхности. В серии исследуем ритм вложенных колец.",
  },
  {
    title: "Коллекция Fold",
    subtitle: "Складки и тени",
    cover: foldCover,
    body: "Один лист образует рельеф. Жёсткие складки и рассеянный свет задают рисунок каждой плоскости.",
  },
];
export function ExpandCard({
  className,
  title,
  cover,
  body,
  items,
}: {
  className?: string;
  title?: string;
  cover?: string;
  body?: string;
  items?: readonly ExpandCardItem[];
}) {
  const rows =
    items ??
    (title !== undefined || cover !== undefined || body !== undefined
      ? [
          {
            title: title ?? collection[0].title,
            cover: cover ?? collection[0].cover,
            body: body ?? collection[0].body,
          },
        ]
      : collection);
  const [selection, setSelection] = useState<number | null>(null);
  const active =
    selection !== null && selection < rows.length ? selection : null;
  const id = useId();
  const reduced = useReducedMotion();
  const transition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 240, damping: 21 };
  const rowHeight = 58,
    gap = 7,
    expandedHeight = 208;
  if (!rows.length) return null;
  const closedHeight = rows.length * (rowHeight + gap) - gap;
  return (
    <motion.div
      initial={false}
      animate={{ height: active === null ? closedHeight : expandedHeight }}
      transition={transition}
      className={cn("relative w-[288px] max-w-full", className)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setSelection(null);
      }}
    >
      {rows.map((row, i) => {
        const open = active === i,
          away = active !== null && !open;
        return (
          <motion.article
            key={i}
            initial={false}
            inert={away}
            aria-hidden={away}
            animate={{
              y: open
                ? 0
                : i * (rowHeight + gap) + (away ? (i < active! ? -20 : 20) : 0),
              height: open ? expandedHeight : rowHeight,
              opacity: away ? 0 : 1,
              scale: away ? 0.94 : 1,
            }}
            transition={transition}
            style={{ zIndex: open ? 2 : 1 }}
            className="absolute inset-x-0 top-0 overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm"
          >
            <button
              type="button"
              aria-label={row.title}
              aria-expanded={open}
              aria-controls={id + "-" + i}
              onClick={() => setSelection(open ? null : i)}
              className={cn(
                "absolute inset-x-0 top-0 rounded-[inherit] text-left focus-visible:outline-offset-[-3px]!",
                open ? "h-[148px]" : "h-full",
              )}
            >
              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  width: open ? "calc(100% - 16px)" : "calc(0% + 42px)",
                  height: open ? 100 : 42,
                  borderRadius: open ? 10 : 11,
                }}
                transition={transition}
                style={{
                  backgroundImage: "url(" + JSON.stringify(row.cover) + ")",
                }}
                className={cn(
                  "absolute left-[7px] top-[7px] bg-muted bg-cover bg-center",
                  row.cover === orbitCover && "grayscale",
                )}
              />
              <motion.span
                initial={false}
                animate={{ x: open ? 13 : 60, y: open ? 115 : 10 }}
                transition={transition}
                className="absolute left-0 top-0 grid max-w-[72%]"
              >
                <b className="truncate text-sm leading-5">{row.title}</b>
                {row.subtitle && (
                  <span className="truncate text-[11px] leading-4 text-muted-foreground">
                    {row.subtitle}
                  </span>
                )}
              </motion.span>
              <span
                aria-hidden
                className={cn(
                  "absolute right-2.5 grid size-7 place-items-center rounded-full",
                  open
                    ? "top-3 bg-black/55 text-white"
                    : "top-3.5 text-muted-foreground",
                )}
              >
                {open ? <ArrowUpLeft size={15} /> : <ChevronRight size={15} />}
              </span>
            </button>
            <motion.div
              id={id + "-" + i}
              aria-hidden={!open}
              inert={!open}
              initial={false}
              animate={{ opacity: open ? 1 : 0, y: open ? 0 : 7 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.18, delay: open ? 0.12 : 0 }
              }
              className="absolute inset-x-3.5 top-[154px] bottom-1 overflow-auto text-xs leading-4 text-muted-foreground"
            >
              {row.body}
            </motion.div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}

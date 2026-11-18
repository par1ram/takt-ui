"use client";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";
import { Bookmark, Pin, Star } from "lucide-react";
export function MorphTooltip({
  className,
  label = "В закладки",
  onClick,
  onAction,
}: {
  className?: string;
  label?: string;
  onClick?: () => void;
  onAction?: (action: "bookmark" | "favorite" | "pin") => void;
}) {
  const [active, setActive] = useState<number | null>(null),
    [pressed, setPressed] = useState<string[]>([]);
  const id = useId();
  const actions = [
    { id: "bookmark", label, Icon: Bookmark },
    { id: "favorite", label: "В избранное", Icon: Star },
    { id: "pin", label: "Закрепить", Icon: Pin },
  ] as const;
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-1 rounded-xl border bg-card p-1.5 text-card-foreground shadow-sm",
        className,
      )}
      onPointerLeave={(e) => {
        const focused = [
          ...e.currentTarget.querySelectorAll("button"),
        ].findIndex((button) => button === document.activeElement);
        setActive(focused === -1 ? null : focused);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-1.5 bottom-full mb-2 h-7"
      >
        <span
          className="absolute top-0 w-1/3 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out"
          style={{ transform: "translateX(" + (active ?? 0) * 100 + "%)" }}
        >
          <span
            className={
              "absolute left-1/2 -translate-x-1/2 rounded-lg bg-primary px-2.5 py-1 text-xs whitespace-nowrap text-primary-foreground shadow-sm motion-safe:transition-opacity " +
              (active === null ? "opacity-0" : "opacity-100")
            }
          >
            {actions[active ?? 0].label}
          </span>
        </span>
      </span>
      {actions.map(({ id: key, label: name, Icon }, i) => (
        <button
          key={key}
          type="button"
          aria-label={name}
          aria-pressed={pressed.includes(key)}
          aria-describedby={active === i ? id : undefined}
          className="grid size-10 place-items-center rounded-xl hover:bg-muted focus-visible:bg-muted aria-pressed:bg-muted aria-pressed:[&>svg]:fill-current motion-safe:active:scale-90"
          onFocus={() => setActive(i)}
          onPointerEnter={() => setActive(i)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setActive(null);
          }}
          onClick={() => {
            setActive(i);
            setPressed((list) =>
              list.includes(key)
                ? list.filter((value) => value !== key)
                : [...list, key],
            );
            if (i === 0) onClick?.();
            onAction?.(key);
          }}
        >
          <Icon size={17} />
        </button>
      ))}
      {active !== null && (
        <span id={id} role="tooltip" className="sr-only">
          {actions[active].label}
        </span>
      )}
    </div>
  );
}

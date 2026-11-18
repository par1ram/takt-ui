"use client";
import { cn } from "@/lib/utils";
export function RollLinks({
  className,
  label = "К началу",
  href = "#top",
}: {
  className?: string;
  label?: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        "group inline-flex items-center gap-2 rounded-sm border-b border-foreground/20 font-medium text-3xl tracking-tight",
        className,
      )}
    >
      <span aria-hidden className="grid overflow-hidden whitespace-pre">
        <span className="col-start-1 row-start-1 px-0.5 leading-[1.25] ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-safe:transition-transform motion-safe:duration-450">
          {label}
        </span>
        <span className="col-start-1 row-start-1 translate-y-full px-0.5 font-serif italic leading-[1.25] ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-safe:transition-transform motion-safe:duration-450">
          {label}
        </span>
      </span>
      <span
        aria-hidden
        className="text-base motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
      >
        ↗
      </span>
    </a>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Plane, ChevronDown } from "lucide-react";
export function BoardingPass({
  className,
  from = "LIS",
  to = "OSL",
  flight = "TK 024",
  seat = "12A",
  gate = "B12",
  boarding = "10:05",
}: {
  className?: string;
  from?: string;
  to?: string;
  flight?: string;
  seat?: string;
  gate?: string;
  boarding?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      aria-expanded={open}
      className={cn(
        "w-64 max-w-full overflow-hidden rounded-xl border border-foreground/10 bg-[#f3f4ed] text-left text-[#222924] shadow-[0_4px_7px_#0001,0_16px_24px_-14px_#0005]",
        className,
      )}
      onClick={() => setOpen(!open)}
    >
      <span className="flex items-center justify-between bg-[#254638] px-4 py-2 text-[11px] font-medium tracking-wide text-white">
        <span className="flex items-center gap-1.5">
          <Plane size={12} /> Посадочный талон
        </span>
        <span className="font-mono">{flight}</span>
      </span>
      <span className="flex items-center gap-3 px-4 pt-3 text-3xl font-semibold tracking-tighter">
        {from}
        <i className="h-px flex-1 border-t border-dashed border-[#879a8f]" />
        <Plane size={15} className="rotate-45" />
        <i className="h-px flex-1 border-t border-dashed border-[#879a8f]" />
        {to}
      </span>
      <span className="flex justify-between px-4 py-2">
        {[
          ["Выход", gate],
          ["Посадка", boarding],
          ["Место", seat],
        ].map(([k, v]) => (
          <span key={k}>
            <small className="block text-[9px] text-[#58665f]">{k}</small>
            <strong className="font-mono text-sm">{v}</strong>
          </span>
        ))}
      </span>
      <span className="relative flex items-center justify-between before:absolute before:top-[-4px] before:-left-1 before:size-2 before:rounded-full before:bg-background after:absolute after:top-[-4px] after:-right-1 after:size-2 after:rounded-full after:bg-background border-t border-dashed border-[#a3ada5] px-4 py-2 text-[10px]">
        Штрихкод
        <ChevronDown
          size={14}
          className={
            (open ? "rotate-180 " : "") + "motion-safe:transition-transform"
          }
        />
      </span>
      {open && (
        <span
          className="mx-4 mb-3 block h-6 motion-safe:animate-in motion-safe:slide-in-from-top-1"
          aria-label="Демонстрационный штрихкод"
          style={{
            background:
              "repeating-linear-gradient(90deg,currentColor 0 1px,transparent 1px 3px,currentColor 3px 6px,transparent 6px 8px,currentColor 8px 10px,transparent 10px 13px)",
          }}
        />
      )}
    </button>
  );
}

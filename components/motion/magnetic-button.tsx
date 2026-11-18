"use client";
import { cn } from "@/lib/utils";

import { useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MagneticButton({
  className,
  children = "Притянуть",
  onClick,
}: {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}) {
  const follower = useRef<HTMLDivElement>(null);
  function move(x: number, y: number) {
    const node = follower.current;
    if (!node) return;
    node.style.transform = "translate(" + x + "px," + y + "px)";
    node.style.setProperty("--ink-x", x * 0.22 + "px");
    node.style.setProperty("--ink-y", y * 0.22 + "px");
  }
  const [pulse, setPulse] = useState(0);

  return (
    <div
      className="relative inline-grid place-items-center p-4"
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        move(
          (event.clientX - rect.left - rect.width / 2) * 0.32,
          (event.clientY - rect.top - rect.height / 2) * 0.32,
        );
      }}
      onPointerLeave={() => {
        move(0, 0);
      }}
    >
      <div
        ref={follower}
        className="relative transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transform-none! motion-reduce:transition-none"
      >
        {pulse > 0 && (
          <span
            key={pulse}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border border-primary/60 opacity-0 motion-safe:animate-ping [animation-iteration-count:1]"
          />
        )}
        <Button
          type="button"
          onClick={() => {
            setPulse((p) => p + 1);
            onClick?.();
          }}
          className={cn(
            "group h-13 cursor-pointer gap-4 rounded-full border border-white/15 bg-[linear-gradient(160deg,#44504b,#181f1c_80%)] pr-2 pl-6 text-sm font-medium text-white shadow-[inset_0_1px_1px_#ffffff44,0_4px_6px_-3px_#151a1866,0_14px_20px_-12px_#13191688] motion-safe:active:scale-[.96]",
            className,
          )}
        >
          <span className="motion-safe:translate-x-(--ink-x) motion-safe:translate-y-(--ink-y) motion-safe:transition-transform">
            {children}
          </span>
          <span className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/10">
            <ArrowUpRight
              aria-hidden
              className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            />
          </span>
        </Button>
      </div>
    </div>
  );
}

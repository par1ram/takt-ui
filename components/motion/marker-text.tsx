// Ported from Kokonut UI (https://kokonutui.com/docs/texts/marker-text).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";

export function MarkerText({
  className,
  text = "Важная деталь",
}: {
  className?: string;
  text?: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={on}
      className={cn(
        "relative isolate rounded px-1.5 font-serif text-[34px] leading-tight tracking-tight italic",
        className,
      )}
      onClick={() => setOn(!on)}
    >
      <i
        aria-hidden
        className={
          "pointer-events-none absolute inset-x-1 bottom-0 h-[2px] origin-left rounded-full bg-primary/50 motion-safe:transition-transform motion-safe:duration-300 " +
          (on ? "scale-x-100" : "scale-x-0")
        }
      />
      <span className="relative">{text}</span>
    </button>
  );
}

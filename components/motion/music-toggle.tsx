// Ported from SmoothUI (https://smoothui.dev/docs/components/music-toggle).
// Copyright (c) 2024 Eduardo Calvo. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";
import { action as surfaceAction } from "@/lib/takt-surface";

import { useState } from "react";

export function MusicToggle({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (on: boolean) => void;
}) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={on}
      className={cn(surfaceAction + " h-11", className)}
      onClick={() => {
        setOn(!on);
        onChange?.(!on);
      }}
    >
      <span className="flex h-5 items-center gap-[3px]">
        {[0.6, 1, 0.4, 0.8].map((v, i) => (
          <i
            key={i}
            className={
              "w-1 origin-bottom rounded bg-current motion-safe:transition-[height] " +
              (on ? "motion-safe:animate-pulse [animation-duration:1.2s]" : "")
            }
            style={{
              height: on ? v * 20 : 4,
              animationDelay: i * -110 + "ms",
              animationDuration: 520 + i * 90 + "ms",
            }}
          />
        ))}
      </span>
      <span className="sr-only">Музыка</span>
      {on ? "Включена" : "Выключена"}
    </button>
  );
}

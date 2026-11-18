"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Heart } from "lucide-react";
export function LikeBurst({
  className,
  likes = 24,
  onChange,
}: {
  className?: string;
  likes?: number;
  onChange?: (liked: boolean) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [revision, setRevision] = useState(0);
  return (
    <button
      type="button"
      aria-label="Нравится"
      aria-pressed={liked}
      onClick={() => {
        setLiked(!liked);
        setRevision((v) => v + 1);
        onChange?.(!liked);
      }}
      className={cn(
        "inline-flex h-12 items-center gap-2.5 rounded-full border border-foreground/10 bg-card px-5 text-card-foreground shadow-[0_3px_8px_#0001,inset_0_1px_0_#ffffff33]",
        className,
      )}
    >
      <span key={revision} className="relative grid place-items-center">
        <Heart
          size={23}
          strokeWidth={1.7}
          className={
            liked
              ? "fill-[#d84777] text-rose-600 motion-safe:animate-in motion-safe:zoom-in-90"
              : "text-muted-foreground"
          }
        />
        {liked &&
          Array.from({ length: 8 }, (_, i) => (
            <i
              key={i}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ transform: "rotate(" + i * 45 + "deg)" }}
            >
              <i className="absolute left-1/2 top-[-7px] h-1.5 w-[3px] rounded-full bg-[#cc5d88] motion-safe:animate-out motion-safe:fade-out motion-safe:slide-out-to-top-2 duration-500 [animation-fill-mode:forwards] motion-reduce:hidden" />
            </i>
          ))}
      </span>
      <output
        key={likes + Number(liked)}
        className={
          "font-medium tabular-nums motion-safe:animate-in " +
          (liked
            ? "motion-safe:slide-in-from-bottom-2"
            : "motion-safe:slide-in-from-top-2")
        }
      >
        {likes + Number(liked)}
      </output>
    </button>
  );
}

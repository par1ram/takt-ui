"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function GooThinking({
  className,
  label = "Обработка…",
  reply = "Макет готов. Можно переходить к прототипу.",
}: {
  className?: string;
  label?: string;
  reply?: string;
}) {
  const [phase, setPhase] = useState<"thinking" | "merging" | "reply">(
    "thinking",
  );
  const filter = useId(),
    reduced = useReducedMotion();
  const thinking = phase === "thinking",
    answered = phase === "reply";
  useEffect(() => {
    if (phase === "reply") return;
    const timer = setTimeout(
      () => setPhase(phase === "thinking" ? "merging" : "reply"),
      phase === "thinking" ? 2600 : reduced ? 0 : 430,
    );
    return () => clearTimeout(timer);
  }, [phase, reduced]);
  return (
    <motion.button
      type="button"
      layout
      initial={false}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 240, damping: 24 }
      }
      style={{ borderRadius: answered ? 18 : 28 }}
      aria-label={answered ? "Повторить обработку" : label}
      aria-describedby={answered ? filter + "-reply" : undefined}
      aria-expanded={answered}
      onClick={() => setPhase(answered ? "thinking" : "merging")}
      className={cn(
        "relative max-w-full overflow-hidden border bg-card text-card-foreground shadow-sm",
        answered
          ? "w-[255px] px-4 py-3 text-left"
          : "flex min-h-12 items-center gap-1.5 px-3.5",
        className,
      )}
    >
      {answered ? (
        <motion.span
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-1"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
            <Check size={13} />
            Ответ готов
          </span>
          <span id={filter + "-reply"} className="text-sm leading-5">
            {reply}
          </span>
        </motion.span>
      ) : (
        <>
          <svg
            aria-hidden
            className="h-7 w-[54px] shrink-0 text-primary"
            viewBox="0 0 54 32"
          >
            <defs>
              <filter
                id={filter}
                x="-30%"
                y="-50%"
                width="160%"
                height="200%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur stdDeviation="2.8" />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -8"
                />
              </filter>
            </defs>
            <g filter={`url(#${filter})`} fill="currentColor">
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  initial={false}
                  cy={18}
                  r={6}
                  animate={{
                    cx: thinking ? 13 + i * 13 : 27,
                    r: thinking ? 6 : 8.5,
                  }}
                  transition={{
                    cx: reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 22 },
                    r: { duration: reduced ? 0 : 0.28 },
                  }}
                >
                  {thinking && !reduced && (
                    <>
                      <animate
                        attributeName="cy"
                        values="18;19;8;19;18;18"
                        keyTimes="0;.12;.3;.5;.63;1"
                        dur="1.5s"
                        begin={-1.5 + i * 0.16 + "s"}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="r"
                        values="6;6.5;5.5;6.5;6;6"
                        keyTimes="0;.12;.3;.5;.63;1"
                        dur="1.5s"
                        begin={-1.5 + i * 0.16 + "s"}
                        repeatCount="indefinite"
                      />
                    </>
                  )}
                </motion.circle>
              ))}
            </g>
          </svg>
          <span className="pr-1 text-xs font-semibold">{label}</span>
        </>
      )}
    </motion.button>
  );
}

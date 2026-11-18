"use client";

import { motion, useReducedMotion } from "motion/react";

export function MetricReading({ value }: { value: string }) {
  const reduced = useReducedMotion();
  const characters = Array.from(value);
  return (
    <span className="relative inline-block whitespace-pre tabular-nums">
      <span className="opacity-0 motion-reduce:opacity-100">{value}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 inline-flex items-center select-none motion-reduce:hidden"
      >
        {characters.map((character, i) => {
          // Anchor the units wheel when a leading digit appears or disappears.
          const place = characters.length - i;
          if (!/^[0-9]$/.test(character))
            return (
              <span
                key={place}
                data-symbol={character}
                className="before:content-[attr(data-symbol)]"
              />
            );
          return (
            <span
              key={place}
              data-place={character}
              className="relative inline-block h-[1em] overflow-hidden leading-[1em] before:opacity-0 before:content-[attr(data-place)]"
            >
              <motion.span
                initial={false}
                animate={{ y: -Number(character) + "em" }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 255,
                        damping: 30,
                        mass: 0.72,
                      }
                }
                data-digits={"0\n1\n2\n3\n4\n5\n6\n7\n8\n9"}
                className="absolute inset-x-0 top-0 whitespace-pre leading-[1em] before:content-[attr(data-digits)]"
              />
            </span>
          );
        })}
      </span>
    </span>
  );
}

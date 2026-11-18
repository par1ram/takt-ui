"use client";

import { useLayoutEffect, useRef } from "react";

// The advancing edge reaches its stop before the trailing edge catches up.
export function ElasticIndicator({
  index,
  count,
  className = "bg-primary",
}: {
  index: number;
  count: number;
  className?: string;
}) {
  const pill = useRef<HTMLSpanElement>(null);
  const previous = useRef(index);
  useLayoutEffect(() => {
    const node = pill.current;
    if (!node || !count) return;
    const slot = Math.min(count - 1, Math.max(0, index));
    node.style.transitionDuration =
      slot >= previous.current ? "370ms, 190ms" : "190ms, 370ms";
    node.style.left = (100 * slot) / count + "%";
    node.style.right = (100 * (count - slot - 1)) / count + "%";
    previous.current = slot;
  }, [index, count]);
  return count > 0 ? (
    <span
      aria-hidden
      ref={pill}
      className={
        "pointer-events-none absolute inset-y-0 rounded-[inherit] ease-[cubic-bezier(.19,1,.32,1)] motion-safe:transition-[left,right] motion-reduce:transition-none! motion-reduce:duration-0! " +
        className
      }
    />
  ) : null;
}

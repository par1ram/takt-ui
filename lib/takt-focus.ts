"use client";

import { useLayoutEffect, useRef } from "react";

// Only move focus for a requested action that replaces the focused control.
export function useActionFocus<T extends HTMLElement>() {
  const root = useRef<T>(null);
  const pending = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (pending.current) {
      root.current
        ?.querySelector<HTMLElement>(pending.current)
        ?.focus({ preventScroll: true });
      pending.current = null;
    }
  });
  function focusAfterRender(selector: string) {
    pending.current = selector;
  }
  return { root, focusAfterRender };
}

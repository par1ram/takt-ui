"use client";

import { Activity, memo, Suspense, useEffect, useRef, useState } from "react";
import { demos } from "./demos";
import type { Entry } from "@/lib/catalog";

type Subscription = { near: boolean; update: (active: boolean) => void };
const previews = new Map<Element, Subscription>();
let observer: IntersectionObserver | undefined;

function updateVisibility() {
  for (const preview of previews.values())
    preview.update(preview.near && !document.hidden);
}

function observe(node: Element, update: Subscription["update"]) {
  if (!observer) {
    observer = new IntersectionObserver(
      (changes) => {
        for (const change of changes) {
          const target = previews.get(change.target);
          if (target) target.near = change.isIntersecting;
        }
        updateVisibility();
      },
      { rootMargin: "24px 0px" },
    );
    document.addEventListener("visibilitychange", updateVisibility);
  }
  previews.set(node, { near: false, update });
  observer.observe(node);
  return () => {
    observer?.unobserve(node);
    previews.delete(node);
    if (!previews.size) {
      observer?.disconnect();
      observer = undefined;
      document.removeEventListener("visibilitychange", updateVisibility);
    }
  };
}

export const Stage = memo(function Stage({ entry }: { entry: Entry }) {
  const root = useRef<HTMLDivElement>(null);
  const [visited, setVisited] = useState(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    return observe(root.current, (visible) => {
      if (visible) setVisited(true);
      setActive(visible);
    });
  }, []);
  const Demo = demos[entry.slug];
  return (
    <div
      ref={root}
      className={"demo-stage stage-" + entry.slug}
      data-category={entry.category}
      data-active={active}
    >
      {entry.slug === "magnetic-button" && (
        <div className="magnetic-field" aria-hidden>
          <i />
          <i />
          <i />
        </div>
      )}
      {visited && (
        <Activity mode={active ? "visible" : "hidden"}>
          <Suspense
            fallback={
              <span
                className="preview-placeholder"
                aria-label="Загрузка примера"
              />
            }
          >
            <Demo />
          </Suspense>
        </Activity>
      )}
    </div>
  );
});

"use client";
import { cn } from "@/lib/utils";
import {
  panel as surfacePanel,
  field as surfaceField,
} from "@/lib/takt-surface";

import { useState } from "react";

export function TagInput({
  className,
  initial = ["Motion"],
  onChange,
}: {
  className?: string;
  initial?: string[];
  onChange?: (tags: string[]) => void;
}) {
  const [tags, setTags] = useState(initial);
  const [draft, setDraft] = useState("");
  function change(next: string[]) {
    setTags(next);
    onChange?.(next);
  }
  return (
    <form
      className={cn(surfacePanel + " grid w-56 gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const t = draft.trim();
        if (
          t &&
          !tags.some((tag) => tag.toLocaleLowerCase() === t.toLocaleLowerCase())
        )
          change([...tags, t]);
        setDraft("");
      }}
    >
      <div className="flex max-h-16 flex-wrap gap-1 overflow-auto">
        {tags.map((t) => (
          <button
            type="button"
            key={t}
            aria-label={"Удалить " + t}
            className="min-h-8 rounded-md border border-foreground/10 bg-muted px-2.5 py-1 hover:bg-accent text-xs motion-safe:animate-in motion-safe:zoom-in"
            onClick={() => change(tags.filter((x) => x !== t))}
          >
            {t} ×
          </button>
        ))}
      </div>
      <input
        aria-label="Новая метка"
        className={surfaceField}
        placeholder="Метка + Enter"
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.nativeEvent.isComposing) return;
          if (e.key === "Backspace" && !draft && tags.length) {
            e.preventDefault();
            change(tags.slice(0, -1));
          }
          if (e.key === "," && draft.trim()) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
    </form>
  );
}

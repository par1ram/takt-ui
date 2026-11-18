"use client";

import { useEffect, useState } from "react";
import { Check, Palette } from "lucide-react";
import { Popover } from "radix-ui";

const presets = [
  { label: "Графит", color: "" },
  { label: "Синий", color: "#2866cc" },
  { label: "Хвоя", color: "#18715c" },
  { label: "Кармин", color: "#ad3856" },
];
const storageKey = "takt:accent";

function applyAccent(value: string) {
  const color = /^#[\da-f]{6}$/i.test(value) ? value.toLowerCase() : "";
  const html = document.documentElement;
  html.toggleAttribute("data-takt-accent", Boolean(color));
  if (color) html.style.setProperty("--takt-accent", color);
  else html.style.removeProperty("--takt-accent");
  return color;
}

export function AccentPicker() {
  const [color, setColor] = useState("");
  useEffect(() => {
    function restore() {
      try {
        setColor(applyAccent(localStorage.getItem(storageKey) ?? ""));
      } catch { /* The picker also works without storage. */ }
    }
    function sync(event: StorageEvent) {
      if (event.key === storageKey || event.key === null) restore();
    }
    restore();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function select(value: string) {
    setColor(applyAccent(value));
    try {
      if (value) localStorage.setItem(storageKey, value);
      else localStorage.removeItem(storageKey);
    } catch { /* Keep the current selection for this page. */ }
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" aria-label="Акцентный цвет" title="Акцентный цвет" className="grid size-[35px] shrink-0 cursor-pointer place-items-center rounded-lg border bg-card text-primary hover:bg-accent">
          <Palette size={17} aria-hidden />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={7} collisionPadding={10} aria-label="Акцентный цвет" className="z-20 w-52 rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg">
          <div className="mb-2 text-xs font-semibold">Акцентный цвет</div>
          <div className="flex gap-2">
            {presets.map((preset) => (
              <button
                type="button"
                key={preset.label}
                title={preset.label}
                aria-label={preset.label}
                aria-pressed={color === preset.color}
                onClick={() => select(preset.color)}
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-black/10 text-white"
                style={{ backgroundColor: preset.color || "#333333" }}
              >
                {color === preset.color && <Check size={16} />}
              </button>
            ))}
          </div>
          <label className="mt-3 flex cursor-pointer items-center justify-between gap-2 border-t pt-2 text-xs">
            Свой цвет
            <input type="color" value={color || "#333333"} onChange={(e) => select(e.target.value)} className="h-7 w-9 cursor-pointer" />
          </label>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

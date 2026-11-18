"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { House, Folder, Calendar, Image as Picture } from "lucide-react";
import { ElasticIndicator } from "@/lib/takt-indicator";
const tools = [
  { name: "Главная", Icon: House },
  { name: "Файлы", Icon: Folder },
  { name: "Календарь", Icon: Calendar },
  { name: "Фото", Icon: Picture },
];
export function RubberDock({
  className,
  onSelect,
}: {
  className?: string;
  onSelect?: (index: number) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const pointer = useRef<number | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  function slot(x: number) {
    const rect = rail.current!.getBoundingClientRect();
    return Math.max(
      0,
      Math.min(3, Math.floor((4 * (x - rect.left)) / rect.width)),
    );
  }
  function apply(index: number) {
    setSelected(index);
    onSelect?.(index);
  }
  const shown = preview ?? selected;
  return (
    <div className={cn("grid justify-items-center gap-2", className)}>
      <div className="rounded-2xl border border-foreground/10 bg-card p-1.5 text-card-foreground shadow-sm">
        <div
          ref={rail}
          role="group"
          aria-label="Панель приложений"
          className="relative flex touch-pan-y rounded-2xl"
          onPointerDown={(e) => {
            if (e.button !== 0 || !e.isPrimary) return;
            pointer.current = e.pointerId;
            setPreview(slot(e.clientX));
          }}
          onPointerMove={(e) => {
            if (pointer.current === e.pointerId) {
              e.currentTarget.setPointerCapture(e.pointerId);
              setPreview(slot(e.clientX));
            }
          }}
          onPointerUp={(e) => {
            if (pointer.current !== e.pointerId) return;
            pointer.current = null;
            setPreview(null);
            apply(slot(e.clientX));
          }}
          onPointerCancel={() => {
            pointer.current = null;
            setPreview(null);
          }}
          onPointerLeave={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
              pointer.current = null;
              setPreview(null);
            }
          }}
        >
          <ElasticIndicator
            index={shown}
            count={tools.length}
            className="bg-primary shadow-sm"
          />
          {tools.map(({ name, Icon }, i) => (
            <button
              key={name}
              type="button"
              aria-label={name}
              aria-pressed={selected === i}
              onClick={(e) => {
                if (e.detail === 0) apply(i);
              }}
              className={
                "relative grid size-11 place-items-center rounded-2xl " +
                (shown === i
                  ? "text-primary-foreground"
                  : "text-muted-foreground")
              }
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
      <output className="text-xs font-medium text-muted-foreground">
        {tools[shown].name}
      </output>
    </div>
  );
}

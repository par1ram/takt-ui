"use client";
import { useState } from "react";
import {
  Folder,
  Bookmark,
  PanelLeft,
  FileText,
  Image as Picture,
} from "lucide-react";
import { cn } from "@/lib/utils";

const documents = [
  ["Сетка макета", "Компоненты"],
  ["Референсы", "Типографика"],
];
export function SidebarCollapse({
  className,
  items = ["Проекты", "Подборки"],
  onSelect,
}: {
  className?: string;
  items?: [string, string];
  onSelect?: (index: number) => void;
}) {
  const [open, setOpen] = useState(true),
    [active, setActive] = useState(0);
  return (
    <div
      className={cn(
        "flex w-[310px] max-w-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <nav
        aria-label="Разделы студии"
        className={
          "shrink-0 overflow-hidden border-r bg-muted/55 p-1.5 motion-safe:transition-[width] motion-safe:duration-350 motion-safe:ease-[cubic-bezier(.22,1,.36,1)] " +
          (open ? "w-[124px]" : "w-11")
        }
      >
        <button
          type="button"
          aria-label="Боковая панель"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="mb-3 flex h-8 w-full items-center gap-2 overflow-hidden rounded-md px-2 hover:bg-muted"
        >
          <PanelLeft size={15} className="shrink-0" />
          <span
            aria-hidden
            className={
              "text-xs font-semibold motion-safe:transition-opacity " +
              (open ? "opacity-100" : "opacity-0")
            }
          >
            Студия
          </span>
        </button>
        {[Folder, Bookmark].map((Icon, i) => (
          <button
            type="button"
            key={i}
            title={items[i]}
            aria-label={items[i]}
            aria-pressed={active === i}
            onClick={() => {
              setActive(i);
              onSelect?.(i);
            }}
            className="mb-1 flex h-8 w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-xs text-muted-foreground hover:bg-muted aria-pressed:bg-card aria-pressed:font-semibold aria-pressed:text-card-foreground aria-pressed:shadow-sm"
          >
            <Icon size={15} className="shrink-0" />
            <span className={open ? "opacity-100" : "opacity-0"}>
              {items[i]}
            </span>
          </button>
        ))}
      </nav>
      <section className="min-w-0 flex-1 p-3.5">
        <h4 className="mb-3 text-sm font-semibold">{items[active]}</h4>
        <ul
          key={active}
          className="grid gap-2 text-xs motion-safe:animate-in motion-safe:fade-in"
        >
          {documents[active].map((doc, i) => (
            <li className="flex items-center gap-2" key={doc}>
              <span className="grid size-7 shrink-0 place-items-center rounded-md border bg-muted/50">
                {i ? <Picture size={13} /> : <FileText size={13} />}
              </span>
              <span className="truncate">{doc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

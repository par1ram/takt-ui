"use client";
import { useActionFocus } from "@/lib/takt-focus";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
function FileMark({ file }: { file: File }) {
  const tile = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = tile.current;
    if (
      !el ||
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
      ].includes(file.type)
    )
      return;
    const url = URL.createObjectURL(file);
    el.style.backgroundImage = 'url("' + url + '")';
    return () => {
      el.style.removeProperty("background-image");
      URL.revokeObjectURL(url);
    };
  }, [file]);
  return (
    <span
      ref={tile}
      aria-hidden
      className="grid size-6 shrink-0 place-items-center rounded-md border bg-muted bg-cover bg-center text-[8px] font-semibold uppercase"
    >
      {!file.type.startsWith("image/") &&
        (file.name.split(".").at(-1) ?? "").slice(0, 3)}
    </span>
  );
}
export function FileDrop({
  className,
  onFiles,
}: {
  className?: string;
  onFiles?: (files: File[]) => void;
}) {
  const { root, focusAfterRender } = useActionFocus<HTMLDivElement>();
  const [files, setFiles] = useState<File[]>([]);
  const [over, setOver] = useState(false);
  const depth = useRef(0);
  function receive(next: File[]) {
    setFiles(next);
    onFiles?.(next);
  }
  return (
    <div
      ref={root}
      className={cn(
        "w-72 max-w-full rounded-xl border bg-card p-2 shadow-sm",
        className,
      )}
    >
      <label
        className={
          "group relative grid min-h-20 cursor-pointer grid-cols-[36px_1fr] items-center gap-x-3 rounded-lg border p-3 text-sm motion-safe:transition-[border-color,background-color] focus-within:outline-2 " +
          (over
            ? "border-primary bg-primary/10"
            : "border-transparent bg-muted/45 text-card-foreground")
        }
        onDragEnter={(e) => {
          e.preventDefault();
          if (!e.dataTransfer.types.includes("Files")) return;
          depth.current++;
          setOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          depth.current = Math.max(0, depth.current - 1);
          setOver(depth.current > 0);
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          if (e.dataTransfer.files.length)
            receive(Array.from(e.dataTransfer.files));
        }}
      >
        <span
          aria-hidden
          className="row-span-2 grid size-9 place-items-center rounded-lg border bg-background"
        >
          <Upload size={17} className={over ? "-translate-y-1" : ""} />
        </span>
        <strong className="self-end text-sm">
          {over
            ? "Отпустите файлы"
            : files.length
              ? "Заменить файлы"
              : "Прикрепить файлы"}
        </strong>
        <small className="self-start text-xs text-muted-foreground">
          Перетащите сюда или{" "}
          <span className="underline underline-offset-2">выберите</span>
        </small>
        <input
          aria-label="Выбрать файлы"
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) receive(Array.from(e.target.files));
            e.target.value = "";
          }}
        />
      </label>
      {files.length > 0 && (
        <ul
          aria-label="Выбранные файлы"
          className="mt-1.5 max-h-16 space-y-1 overflow-y-auto"
        >
          {files.map((f, i) => (
            <li
              key={f.name + i}
              className="flex items-center gap-2 rounded-lg border bg-card px-2 py-1 text-xs text-card-foreground motion-safe:animate-in motion-safe:slide-in-from-bottom-1"
            >
              <FileMark file={f} />
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <small>{Math.ceil(f.size / 1024)} КБ</small>
              <button
                type="button"
                aria-label={"Убрать " + f.name}
                className="p-1"
                data-file-index={i}
                onClick={() => {
                  focusAfterRender(
                    files.length === 1
                      ? "input"
                      : '[data-file-index="' +
                          Math.min(i, files.length - 2) +
                          '"]',
                  );
                  receive(files.filter((_, j) => j !== i));
                }}
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

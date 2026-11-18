"use client";
import { cn } from "@/lib/utils";
import { action as surfaceAction } from "@/lib/takt-surface";

import { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({
  className,
  text = "Takt Motion",
}: {
  className?: string;
  text?: string;
}) {
  const [message, setMessage] = useState("");
  const request = useRef({ id: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const sequence = request.current;
    return () => {
      sequence.id++;
      clearTimeout(timer.current);
      setMessage("");
    };
  }, []);
  return (
    <button
      type="button"
      className={cn(surfaceAction, "min-w-36", className)}
      onClick={async () => {
        const id = ++request.current.id;
        clearTimeout(timer.current);
        let result: string;
        try {
          await navigator.clipboard.writeText(text);
          result = "Скопировано";
        } catch {
          result = "Копирование недоступно";
        }
        if (request.current.id !== id) return;
        setMessage(result);
        timer.current = setTimeout(() => setMessage(""), 2100);
      }}
    >
      {message === "Скопировано" ? (
        <Check
          className="motion-safe:animate-in motion-safe:zoom-in"
          size={16}
        />
      ) : (
        <Copy size={16} />
      )}
      <span
        key={message}
        aria-live="polite"
        className="motion-safe:animate-in motion-safe:slide-in-from-bottom-1"
      >
        {message || "Скопировать"}
      </span>
    </button>
  );
}

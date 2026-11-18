"use client";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { CalendarDays, MessageCircle, Moon, Waves } from "lucide-react";
const inbox = [
  { title: "Мира", body: "Оставила комментарий", time: "сейчас" },
  { title: "Календарь", body: "Обзор макетов", time: "5 мин" },
];
export function FocusMode({
  className,
  onChange,
  minutes = 25,
  notifications = inbox,
}: {
  className?: string;
  onChange?: (active: boolean) => void;
  minutes?: number;
  notifications?: { title: string; body: string; time: string }[];
}) {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const active = deadline !== null;
  useEffect(() => {
    if (deadline === null) return;
    const update = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setDeadline(null);
        onChange?.(false);
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [deadline, onChange]);
  const clock =
    Math.floor(remaining / 60) + ":" + String(remaining % 60).padStart(2, "0");
  return (
    <div
      className={cn(
        "w-72 max-w-full rounded-2xl bg-[#1c2320] p-2 text-[#f8faf9] shadow-[inset_0_1px_0_#ffffff20,0_12px_25px_-10px_#171d1a66]",
        className,
      )}
    >
      {active && (
        <div aria-hidden className="mx-3 my-2 flex h-1 gap-[2px]">
          {Array.from({ length: 24 }, (_, i) => (
            <span
              key={i}
              className={
                "flex-1 rounded-sm " +
                (i < Math.ceil((24 * remaining) / Math.max(1, minutes * 60))
                  ? "bg-[#d6dfdb]"
                  : "bg-white/15")
              }
            />
          ))}
        </div>
      )}
      <div className="relative h-[112px] overflow-hidden rounded-[18px]">
        <div
          aria-hidden={active}
          className={
            "grid gap-1.5 motion-safe:transition-[transform,opacity] duration-300 " +
            (active ? "-translate-y-5 scale-90 opacity-0" : "")
          }
        >
          {notifications.slice(0, 2).map((n, i) => (
            <div
              key={n.title + i}
              className="flex h-[53px] items-center gap-2.5 rounded-2xl border border-white/5 bg-white/[.065] px-3"
            >
              <span
                className={
                  "grid size-8 shrink-0 place-items-center rounded-xl " +
                  (i === 0
                    ? "bg-[#d1dcd7] text-[#4c6258]"
                    : "bg-[#b4d7ca] text-[#38574e]")
                }
              >
                {i === 0 ? (
                  <MessageCircle size={16} />
                ) : (
                  <CalendarDays size={16} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-xs">{n.title}</strong>
                <span className="block truncate text-[11px] text-white/65">
                  {n.body}
                </span>
              </span>
              <small className="self-start pt-2 text-[9px] text-white/55">
                {n.time}
              </small>
            </div>
          ))}
        </div>
        <div
          aria-hidden={!active}
          className={
            "pointer-events-none absolute inset-0 grid content-center justify-items-center gap-1 rounded-2xl bg-[radial-gradient(ellipse_at_50%_120%,#597468,transparent_75%)] motion-safe:transition-[opacity,transform] duration-300 " +
            (active ? "" : "translate-y-4 opacity-0")
          }
        >
          <Waves size={18} className="text-[#d7e0dc]" />
          <span
            role="timer"
            className="text-3xl font-medium tracking-tighter tabular-nums"
          >
            {clock}
          </span>
          <small className="text-[10px] text-white/65">До конца сессии</small>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={active}
        aria-label="Режим фокуса"
        className="mt-2 flex h-11 w-full items-center gap-2 rounded-[15px] bg-white/10 px-3 text-sm font-medium"
        onClick={() => {
          const seconds = Math.max(1, Math.round(minutes * 60));
          setRemaining(seconds);
          setDeadline(active ? null : Date.now() + seconds * 1000);
          onChange?.(!active);
        }}
      >
        <Moon size={16} />
        Фокус
        <span
          className={
            "ml-auto flex h-5 w-9 items-center rounded-full p-[3px] transition-colors " +
            (active ? "bg-[#c0cec8]" : "bg-white/25")
          }
        >
          <i
            className={
              "size-[14px] rounded-full bg-white shadow motion-safe:transition-transform " +
              (active ? "translate-x-4" : "")
            }
          />
        </span>
      </button>
    </div>
  );
}

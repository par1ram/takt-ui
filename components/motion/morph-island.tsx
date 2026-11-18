"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Clock3, Phone, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

const pressSpring = {
  type: "spring",
  stiffness: 520,
  damping: 18,
  mass: 1,
} as const;

const activities = [
  { id: "idle", label: "Покой", width: 126, height: 36 },
  { id: "timer", label: "Таймер", width: 230, height: 36 },
  { id: "upload", label: "Экспорт", width: 290, height: 56 },
  { id: "call", label: "Звонок", width: 340, height: 84 },
] as const;

function ActivityContent({ index, title }: { index: number; title: string }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (index !== 1 && index !== 2) return;
    const start = performance.now();
    const end = index === 1 ? 299000 : 2400;
    const timer = setInterval(
      () => {
        const ms = Math.min(end, performance.now() - start);
        setElapsed(ms);
        if (ms >= end) clearInterval(timer);
      },
      index === 1 ? 1000 : 80,
    );
    return () => clearInterval(timer);
  }, [index]);
  if (index === 0)
    return (
      <span aria-hidden className="flex items-center justify-center gap-1.5">
        <i className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        <span className="text-xs font-semibold">Takt Studio</span>
      </span>
    );
  if (index === 1) {
    const seconds = 299 - Math.floor(elapsed / 1000);
    return (
      <>
        <span className="flex items-center gap-2">
          <Clock3 size={16} />
          {title}
        </span>
        <span className="font-mono tabular-nums">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </span>
      </>
    );
  }
  if (index === 2) {
    const progress = Math.round(elapsed / 24);
    return (
      <>
        <svg
          className="size-8 shrink-0 -rotate-90"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden
        >
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="currentColor"
            opacity=".15"
            strokeWidth="3"
          />
          <circle
            cx="16"
            cy="16"
            r="12"
            pathLength="100"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            className="text-emerald-600 dark:text-emerald-400"
          />
        </svg>
        <span className="grid flex-1 text-left">
          <b>{progress === 100 ? "Экспорт готов" : "Экспорт макета"}</b>
          <small className="text-muted-foreground">Studio.fig</small>
        </span>
        <span className="font-mono tabular-nums">{progress}%</span>
      </>
    );
  }
  return (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-sm text-background">
        МЛ
      </span>
      <span className="grid flex-1 text-left">
        <b>Мира Ли</b>
        <small className="text-muted-foreground">Входящий звонок</small>
      </span>
    </>
  );
}

export function MorphIsland({
  className,
  title = "Фокус",
  onCall,
}: {
  className?: string;
  title?: string;
  onCall?: (accepted: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduced = useReducedMotion();
  const current = activities[index];
  const firstCycle = useRef(true);
  const width = useSpring(126, { stiffness: 380, damping: 24, mass: 1 });
  const height = useMotionValue(36);
  const scale = useMotionValue(1);
  const velocity = useVelocity(height);
  const shapeWidth = useTransform(
    () =>
      width.get() *
      (1 + Math.max(-0.05, Math.min(0.05, -velocity.get() / 7000))),
  );
  const radius = useTransform(height, (h) => Math.min(h / 2, 32));
  const changeActivity = useCallback(
    (next: number) => {
      const target = activities[next];
      const growing =
        target.width * target.height > current.width * current.height;
      if (reduced) {
        width.jump(target.width);
        height.jump(target.height);
        scale.jump(1);
      } else {
        animate(scale, 1, {
          ...pressSpring,
          velocity:
            scale.getVelocity() - (next === index ? 2 : growing ? 1.6 : 1),
        });
        if (next !== index) {
          width.set(target.width);
          animate(height, target.height, {
            type: "spring",
            stiffness: growing ? 300 : 390,
            damping: 22,
            velocity: height.getVelocity(),
          });
        }
      }
      setIndex(next);
    },
    [current, height, index, reduced, scale, width],
  );
  function press(target: number) {
    if (!reduced) animate(scale, target, pressSpring);
  }
  useEffect(() => {
    if (!auto || reduced) return;
    const timeout = setTimeout(
      () => {
        firstCycle.current = false;
        changeActivity((index + 1) % activities.length);
      },
      firstCycle.current ? 600 : 2800,
    );
    return () => clearTimeout(timeout);
  }, [auto, changeActivity, index, reduced]);
  function select(next: number) {
    setAuto(false);
    changeActivity(next);
  }
  const trigger = useRef<HTMLButtonElement>(null);
  function answer(accepted: boolean) {
    select(0);
    trigger.current?.focus();
    onCall?.(accepted);
  }
  return (
    <div
      className={cn(
        "grid w-[360px] max-w-full justify-items-center gap-3 px-2",
        className,
      )}
      onFocusCapture={() => setAuto(false)}
    >
      <div className="grid h-24 w-full place-items-center">
        <motion.div
          className="relative max-w-full overflow-hidden bg-card text-card-foreground shadow-[0_3px_14px_#0002] ring-1 ring-foreground/10"
          style={{
            width: reduced ? current.width : shapeWidth,
            height: reduced ? current.height : height,
            borderRadius: reduced ? Math.min(current.height / 2, 32) : radius,
            scale: reduced ? 1 : scale,
          }}
        >
          <button
            ref={trigger}
            type="button"
            aria-label={"Следующее состояние. " + current.label}
            onClick={() => select((index + 1) % 4)}
            onPointerDown={() => press(0.96)}
            onPointerUp={() => press(1)}
            onPointerLeave={() => press(1)}
            onPointerCancel={() => press(1)}
            className="absolute inset-0 rounded-[inherit] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/60"
          />
          <AnimatePresence initial={false}>
            <motion.div
              key={current.id}
              className={
                "pointer-events-none absolute inset-0 flex items-center justify-between gap-2 px-4 text-sm font-medium " +
                (index === 0 ? "justify-center!" : "") +
                (index === 3 ? " pr-24" : "")
              }
              initial={
                reduced
                  ? false
                  : { opacity: 0, filter: "blur(5px)", scale: 0.94 }
              }
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.22 }}
            >
              <ActivityContent index={index} title={title} />
            </motion.div>
          </AnimatePresence>
          {index === 3 && (
            <div className="absolute inset-y-0 right-3 flex items-center gap-1">
              <button
                type="button"
                aria-label="Отклонить звонок"
                onClick={() => answer(false)}
                className="grid size-9 place-items-center rounded-full bg-muted"
              >
                <PhoneOff size={16} />
              </button>
              <button
                type="button"
                aria-label="Принять звонок"
                onClick={() => answer(true)}
                className="grid size-9 place-items-center rounded-full bg-emerald-700 text-white"
              >
                <Phone size={16} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
      <div
        role="group"
        aria-label="Состояния острова"
        className="flex flex-wrap justify-center gap-1"
      >
        {activities.map((item, i) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={i === index}
            onClick={() => select(i)}
            className="rounded-full px-2.5 py-1.5 text-xs font-medium text-foreground/70 aria-pressed:bg-card aria-pressed:text-card-foreground aria-pressed:shadow-sm"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

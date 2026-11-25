// Ported from SmoothUI (https://smoothui.dev/docs/components/siri-orb).
// Copyright (c) 2024 Eduardo Calvo. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";

import { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  Check,
  Circle,
  CircleAlert,
  Ellipsis,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";

const modes = {
  idle: {
    label: "В ожидании",
    icon: Circle,
    speed: 0.34,
    ripple: 0.022,
    tilt: -0.52,
  },
  listening: {
    label: "Слушаю",
    icon: Mic,
    speed: 0.84,
    ripple: 0.085,
    tilt: -0.35,
  },
  thinking: {
    label: "Обдумываю",
    icon: Ellipsis,
    speed: 1.45,
    ripple: 0.065,
    tilt: -1.03,
  },
  streaming: {
    label: "Отвечаю",
    icon: AudioLines,
    speed: 1.1,
    ripple: 0.15,
    tilt: 0.24,
  },
  done: { label: "Готово", icon: Check, speed: 0, ripple: 0.035, tilt: -0.6 },
  error: {
    label: "Ошибка",
    icon: CircleAlert,
    speed: 0,
    ripple: 0.105,
    tilt: 0.55,
  },
};
export type OrbState = keyof typeof modes;
const phases = Object.keys(modes) as OrbState[];
const around = Array.from({ length: 81 }, (_, i) => {
  const a = (i * Math.PI) / 40;
  return { a, sin: Math.sin(a), cos: Math.cos(a) };
});
const bands = Array.from(
  { length: 34 },
  (_, i) => ((i + 0.5) * Math.PI) / 34 - Math.PI / 2,
);
function drawOrb(
  ctx: CanvasRenderingContext2D,
  phase: OrbState,
  t: number,
  level: number,
) {
  const preset = modes[phase],
    failed = phase === "error";
  ctx.clearRect(0, 0, 160, 160);
  const ct = Math.cos(preset.tilt),
    st = Math.sin(preset.tilt);
  const amplitude =
    preset.ripple +
    (phase === "streaming" || phase === "listening" ? level * 0.1 : 0);
  const field = ctx.createRadialGradient(59, 45, 2, 82, 82, 69);
  field.addColorStop(0, failed ? "#69756d" : "#bde8cc");
  field.addColorStop(0.42, failed ? "#46584f" : "#398773");
  field.addColorStop(0.78, "#133b36");
  field.addColorStop(1, "#081e1c");
  ctx.beginPath();
  ctx.arc(80, 80, 65, 0, 2 * Math.PI);
  ctx.fillStyle = field;
  ctx.fill();
  for (const lat of bands) {
    const r = Math.cos(lat),
      h = Math.sin(lat);
    ctx.beginPath();
    let visible = false;
    for (const { a, sin, cos } of around) {
      const wave =
        Math.sin(3 * a + 2.5 * lat + t * 1.5) +
        0.44 * Math.sin(5 * lat - 2 * a + t * 0.7);
      const y = h * 57 + amplitude * r * wave * 47;
      const z = r * sin * 60;
      if (z * 0.94 - y * 0.32 < -2) {
        visible = false;
        continue;
      }
      const x = r * cos * (61 + wave * amplitude * 17),
        v = y * 0.94 + z * 0.32;
      const px = 80 + x * ct - v * st,
        py = 80 + x * st + v * ct;
      if (!visible) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      visible = true;
    }
    const crest = (1 + Math.sin(lat * 8.2 - t * 0.72)) * 0.5;
    ctx.strokeStyle = failed
      ? "rgba(214,225,211," + (0.25 + crest * 0.65) + ")"
      : "rgba(" +
        Math.round(147 + 105 * crest) +
        ",249," +
        Math.round(192 + 38 * crest) +
        "," +
        (0.3 + crest * 0.64) +
        ")";
    ctx.lineWidth = 0.65 + 0.65 * crest;
    ctx.stroke();
  }
}

function OrbSurface({
  state,
  amplitude,
}: {
  state: OrbState;
  amplitude: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const level = useRef(0);
  const time = useRef(0);
  useEffect(() => {
    level.current = Number.isFinite(amplitude)
      ? Math.max(0, Math.min(1, amplitude))
      : 0;
  }, [amplitude]);
  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    node.width = node.height = Math.round(160 * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      visible = false,
      previous = 0;
    const paint = () => drawOrb(ctx, state, time.current, level.current);
    const tick = (now: number) => {
      if (now - previous >= 32) {
        time.current +=
          (Math.min(64, now - previous) * modes[state].speed) / 1000;
        previous = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (!visible || document.hidden) return;
      paint();
      previous = performance.now();
      if (!media.matches && modes[state].speed)
        frame = requestAnimationFrame(tick);
    };
    paint();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(node);
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [state]);
  return (
    <span aria-hidden className="relative grid size-36 place-items-center">
      <span className="absolute inset-[11%] rounded-full bg-[radial-gradient(ellipse_at_36%_26%,#ccebd3,#418d79_48%,#102e29_88%)] shadow-[0_10px_22px_-10px_#1c514bab]" />
      <canvas
        ref={canvas}
        width={160}
        height={160}
        className="absolute inset-0 size-full"
      />
      {(state === "done" || state === "error") && (
        <span className="absolute bottom-3 right-3 grid size-7 place-items-center rounded-full border bg-card text-foreground">
          {state === "done" ? <Check size={15} /> : <CircleAlert size={15} />}
        </span>
      )}
    </span>
  );
}

export function AssistantOrb({
  className,
  onChange,
  state,
  onStateChange,
  amplitude = 0,
  showControls = false,
}: {
  className?: string;
  state?: OrbState;
  onStateChange?: (state: OrbState) => void;
  amplitude?: number;
  onChange?: (active: boolean) => void;
  showControls?: boolean;
}) {
  const [local, setLocal] = useState<OrbState>("idle");
  const current = state ?? local;
  const choose = (next: OrbState) => {
    if (state === undefined) setLocal(next);
    onStateChange?.(next);
    onChange?.(next !== "idle");
  };
  const readonly = state !== undefined && !onStateChange && !onChange;
  const surface = <OrbSurface state={current} amplitude={amplitude} />;
  return (
    <div
      className={cn(
        "inline-grid justify-items-center gap-1 text-foreground",
        className,
      )}
    >
      {readonly ? (
        surface
      ) : (
        <button
          type="button"
          aria-label="Сфера ассистента"
          aria-pressed={current !== "idle"}
          onClick={() => choose(current === "idle" ? "listening" : "idle")}
          className="rounded-full"
        >
          {surface}
        </button>
      )}
      <span role="status" className="text-xs font-medium">
        {modes[current].label}
      </span>
      {showControls && !readonly && (
        <div
          role="group"
          aria-label="Режим ассистента"
          className="mt-1 flex gap-0.5 rounded-full border bg-card p-1 shadow-sm"
        >
          {phases.map((key) => {
            const Icon = modes[key].icon;
            return (
              <button
                key={key}
                type="button"
                aria-label={modes[key].label}
                title={modes[key].label}
                aria-pressed={current === key}
                onClick={() => choose(key)}
                className="grid size-7 place-items-center rounded-full text-muted-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground"
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
export { AssistantOrb as SiriOrb };

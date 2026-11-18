"use client";
import { cn } from "@/lib/utils";

import { useState, useRef, useEffect } from "react";
import { LoaderCircle, Mic, Pause, Play, Square } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const displayTime = (time: number) =>
  Math.floor(time / 60) + ":" + String(Math.floor(time) % 60).padStart(2, "0");

export function VoiceInput({
  className,
  onRecord,
}: {
  className?: string;
  onRecord?: (blob: Blob) => void;
}) {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playError, setPlayError] = useState(false);
  const requesting = useRef(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const session = useRef({ active: false });
  const [recording, setRecording] = useState<Blob | null>(null);
  const [status, setStatus] = useState("idle");
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (status !== "recording") return;
    const started = Date.now();
    const timer = setInterval(
      () => setSeconds(Math.floor((Date.now() - started) / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, [status]);
  const wave = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const stream = recorder.current?.stream,
      canvas = wave.current;
    if (
      status !== "recording" ||
      !stream ||
      !canvas ||
      reduced ||
      typeof AudioContext === "undefined"
    )
      return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let audio: AudioContext;
    try {
      audio = new AudioContext();
    } catch {
      return;
    }
    const meter = audio.createAnalyser(),
      source = audio.createMediaStreamSource(stream);
    meter.fftSize = 512;
    source.connect(meter);
    void audio.resume().catch(() => {});
    const samples = new Uint8Array(meter.fftSize);
    const levels = new Float32Array(36);
    const width = 144,
      height = 32,
      ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);
    const ink = getComputedStyle(canvas).color;
    let frame = 0,
      last = 0,
      envelope = 0;
    function draw(now: number) {
      if (now - last >= 42 && ctx && canvas) {
        last = now;
        meter.getByteTimeDomainData(samples);
        let energy = 0;
        for (const sample of samples) energy += ((sample - 128) / 128) ** 2;
        const level = Math.min(1, 4 * Math.sqrt(energy / samples.length));
        envelope += (level - envelope) * (level > envelope ? 0.8 : 0.35);
        levels.copyWithin(0, 1);
        levels[levels.length - 1] = envelope;
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = ink;
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        for (let i = 0; i < levels.length; i++) {
          const x = 2 + i * 4,
            h = 0.35 + levels[i] * 13.5;
          ctx.globalAlpha = 0.26 + (0.74 * i) / (levels.length - 1);
          ctx.beginPath();
          ctx.moveTo(x, height / 2 - h);
          ctx.lineTo(x, height / 2 + h);
          ctx.stroke();
        }
        canvas.parentElement?.style.setProperty(
          "--voice-level",
          String(envelope),
        );
      }
      frame = requestAnimationFrame(draw);
    }
    function visibility() {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(draw);
    }
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const track = canvas.parentElement;
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
      track?.style.removeProperty("--voice-level");
      source.disconnect();
      meter.disconnect();
      void audio.close().catch(() => {});
    };
  }, [status, reduced]);
  const playback = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const generation = { active: true };
    session.current = generation;
    return () => {
      generation.active = false;
      requesting.current = false;
      const r = recorder.current;
      if (r && r.state !== "inactive") r.stop();
      r?.stream.getTracks().forEach((t) => t.stop());
      recorder.current = null;
      setStatus("idle");
    };
  }, []);
  useEffect(() => {
    if (!recording) return;
    const objectUrl = URL.createObjectURL(recording);
    if (playback.current) playback.current.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [recording]);
  async function record() {
    const generation = session.current;
    if (requesting.current || status === "waiting" || status === "stopping")
      return;
    if (recorder.current?.state === "recording") {
      setStatus("stopping");
      recorder.current.stop();
      return;
    }
    requesting.current = true;
    setStatus("waiting");
    let stream: MediaStream | undefined;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!generation.active) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      const r = new MediaRecorder(stream);
      recorder.current = r;
      const started = performance.now();
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      r.onstop = () => {
        r.stream.getTracks().forEach((t) => t.stop());
        if (!generation.active || recorder.current !== r) return;
        recorder.current = null;
        const blob = new Blob(chunks, { type: r.mimeType });
        setDuration(Math.max(0.01, (performance.now() - started) / 1000));
        setPosition(0);
        setPlayError(false);
        setRecording(blob);
        setStatus("idle");
        onRecord?.(blob);
      };
      r.onerror = () => {
        r.stream.getTracks().forEach((t) => t.stop());
        if (!generation.active || recorder.current !== r) return;
        recorder.current = null;
        setStatus("error");
      };
      playback.current?.pause();
      setPlaying(false);
      setSeconds(0);
      r.start();
      setStatus("recording");
    } catch {
      stream?.getTracks().forEach((t) => t.stop());
      if (generation.active) {
        recorder.current = null;
        setStatus("error");
      }
    } finally {
      if (generation.active) requesting.current = false;
    }
  }
  const capturing = status === "recording";
  const busy = status === "waiting" || status === "stopping";
  const ready = !!recording && !capturing && !busy;
  async function togglePlayback() {
    const player = playback.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
      return;
    }
    try {
      setPlayError(false);
      await player.play();
    } catch {
      setPlayError(true);
    }
  }
  return (
    <section
      className={cn(
        "w-[266px] max-w-full rounded-[19px] border bg-card p-3.5 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold">
          {capturing
            ? "Идёт запись"
            : ready
              ? "Голосовая запись"
              : "Голосовая заметка"}
        </span>
        <span
          aria-label="Время записи"
          className="font-mono text-[11px] text-muted-foreground tabular-nums"
        >
          {displayTime(
            capturing
              ? seconds
              : ready
                ? playing || position > 0
                  ? position
                  : duration
                : 0,
          )}
        </span>
      </div>
      <div className="relative flex h-[54px] items-center gap-3 overflow-hidden rounded-[13px] bg-neutral-900 px-2.5 text-white dark:bg-neutral-950">
        <button
          type="button"
          aria-label={capturing ? "Остановить запись" : "Записать голос"}
          disabled={busy}
          onClick={record}
          className="relative isolate grid size-9 shrink-0 place-items-center rounded-full bg-[#d8eee0] text-[#153526] disabled:opacity-70"
        >
          {capturing && !reduced && (
            <i
              aria-hidden
              className="absolute -inset-1 -z-10 rounded-full border border-emerald-300/55"
              style={{
                transform: "scale(calc(1 + var(--voice-level,0) * .35))",
              }}
            />
          )}
          <motion.span
            key={status}
            initial={reduced ? false : { scale: 0.72, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 460, damping: 25 }}
          >
            {busy ? (
              <LoaderCircle size={16} className="motion-safe:animate-spin" />
            ) : capturing ? (
              <Square size={13} fill="currentColor" />
            ) : (
              <Mic size={16} />
            )}
          </motion.span>
        </button>
        <canvas
          aria-hidden
          ref={wave}
          width={144}
          height={32}
          className={cn(
            "h-8 min-w-0 flex-1 text-emerald-300",
            !capturing || reduced ? "hidden" : "block",
          )}
        />
        {(!capturing || reduced) && (
          <span
            aria-hidden
            className="flex h-8 flex-1 items-center justify-between gap-0.5"
          >
            {Array.from({ length: 30 }, (_, i) => (
              <i
                key={i}
                className="w-0.5 rounded-full bg-emerald-100/50"
                style={{ height: capturing ? 4 : 2 }}
              />
            ))}
          </span>
        )}
      </div>
      <div className="mt-2 flex min-h-5 items-center gap-2 text-[11px] text-muted-foreground">
        {status === "error" ? (
          <span role="status">Микрофон недоступен</span>
        ) : busy ? (
          <span role="status">
            {status === "waiting"
              ? "Доступ к микрофону…"
              : "Сохранение записи…"}
          </span>
        ) : capturing ? (
          <>
            <i aria-hidden className="size-1.5 rounded-full bg-red-500" />
            Нажмите квадрат, чтобы закончить
          </>
        ) : ready ? (
          <>
            <button
              type="button"
              aria-label={
                playing ? "Приостановить запись" : "Прослушать запись"
              }
              onClick={togglePlayback}
              className="grid size-7 place-items-center rounded-full bg-muted text-foreground"
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <input
              type="range"
              aria-label="Позиция записи"
              className="min-w-0 flex-1 accent-emerald-700"
              min={0}
              max={duration}
              step={0.01}
              value={Math.min(position, duration)}
              onChange={(e) => {
                const t = e.currentTarget.valueAsNumber;
                if (playback.current) {
                  playback.current.currentTime = t;
                  setPosition(t);
                }
              }}
            />
            {playError && <span role="status">Ошибка воспроизведения</span>}
          </>
        ) : (
          <span>Нажмите микрофон для записи</span>
        )}
      </div>
      {recording && (
        <audio
          ref={playback}
          hidden
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setPosition(0);
          }}
          onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
          onDurationChange={(e) => {
            const d = e.currentTarget.duration;
            if (Number.isFinite(d) && d > 0) setDuration(d);
          }}
        />
      )}
    </section>
  );
}

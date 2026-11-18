"use client";
import { cn } from "@/lib/utils";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Repeat2, Volume2, VolumeX } from "lucide-react";
import { foldCover } from "@/lib/takt-art-fold";

// A short, local four-note sample for previews without an audio source.
function makeSample() {
  const rate = 11025,
    samples = rate * 8;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  function tag(offset: number, text: string) {
    for (let i = 0; i < text.length; i++)
      view.setUint8(offset + i, text.charCodeAt(i));
  }
  tag(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  tag(8, "WAVE");
  tag(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  tag(36, "data");
  view.setUint32(40, samples * 2, true);
  const notes = [220, 277.18, 329.63, 440];
  for (let i = 0; i < samples; i++) {
    const t = i / rate,
      beat = t % 0.5,
      note = notes[Math.floor(t * 2) % notes.length];
    const envelope = Math.min(1, beat * 80) * Math.exp(-beat * 10);
    view.setInt16(
      44 + i * 2,
      Math.sin(2 * Math.PI * note * beat) * envelope * 4400,
      true,
    );
  }
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}
export function GlassPlayer({
  className,
  title = "Этюд",
  cover = foldCover,
  src,
}: {
  className?: string;
  title?: string;
  src?: string;
  cover?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const sample = useRef("");
  useEffect(() => {
    const player = audio.current;
    return () => {
      player?.pause();
      if (sample.current) {
        URL.revokeObjectURL(sample.current);
        sample.current = "";
      }
    };
  }, []);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(src ? 0 : 8);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(false);
  const stamp = (v: number) =>
    Math.floor(v / 60) + ":" + String(Math.floor(v) % 60).padStart(2, "0");
  function prepare(player: HTMLAudioElement) {
    if (src) return;
    if (!sample.current) sample.current = makeSample();
    if (player.src !== sample.current) player.src = sample.current;
  }
  async function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
      return;
    }
    try {
      prepare(player);
      await player.play();
      setError("");
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === "AbortError"))
        setError("Аудио недоступно");
    }
  }
  return (
    <section
      className={cn(
        "grid w-[278px] max-w-full gap-3 rounded-2xl border border-foreground/15 bg-card p-4 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3.5">
        <span
          role="img"
          aria-label="Обложка трека"
          className="size-16 shrink-0 rounded-lg bg-cover bg-center"
          style={{ backgroundImage: "url(" + JSON.stringify(cover) + ")" }}
        />
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-lg font-semibold tracking-tight">
            {title}
          </strong>
          <span role="status" className="text-xs text-muted-foreground">
            {error || (playing ? "Воспроизведение" : "На паузе")}
          </span>
        </span>
        <button
          type="button"
          aria-label={playing ? "Пауза" : "Воспроизвести"}
          onClick={toggle}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground motion-safe:active:scale-95"
        >
          {playing ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </div>
      <div>
        <label className="relative flex h-6 cursor-pointer items-center rounded-md has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-foreground/45">
          <span
            aria-hidden
            className="relative mx-1 h-1 w-full rounded-full bg-foreground/15"
          >
            <i
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              style={{ width: (duration ? (100 * time) / duration : 0) + "%" }}
            />
            <i
              className="absolute top-1/2 size-2.5 -translate-1/2 rounded-full bg-primary"
              style={{ left: (duration ? (100 * time) / duration : 0) + "%" }}
            />
          </span>
          <input
            aria-label="Позиция воспроизведения"
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={Math.min(time, duration)}
            disabled={!duration}
            onChange={(e) => {
              if (audio.current && duration) {
                prepare(audio.current);
                audio.current.currentTime = +e.target.value;
                setTime(+e.target.value);
              }
            }}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <div className="flex items-center gap-1">
          <span className="mr-auto font-mono text-[10px] tabular-nums text-muted-foreground">
            {stamp(time)} / {stamp(duration)}
          </span>
          <button
            aria-label="Повторять трек"
            aria-pressed={loop}
            type="button"
            onClick={() => setLoop(!loop)}
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted aria-pressed:bg-muted aria-pressed:text-foreground"
          >
            <Repeat2 size={15} />
          </button>
          <button
            aria-label="Без звука"
            aria-pressed={muted}
            type="button"
            onClick={() => setMuted(!muted)}
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted aria-pressed:bg-muted aria-pressed:text-foreground"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>
      <audio
        ref={audio}
        src={src}
        muted={muted}
        loop={loop}
        preload={src ? "metadata" : "none"}
        onError={() => {
          setPlaying(false);
          setDuration(0);
          setTime(0);
          setError("Аудио недоступно");
        }}
        onEmptied={() => {
          setPlaying(false);
          setTime(0);
          setDuration(src ? 0 : 8);
          setError("");
        }}
        onLoadedMetadata={(e) =>
          setDuration(
            Number.isFinite(e.currentTarget.duration)
              ? e.currentTarget.duration
              : 0,
          )
        }
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);
          setError("");
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </section>
  );
}

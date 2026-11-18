"use client";
import { cn } from "@/lib/utils";

import { useId, useRef, useState } from "react";
import { ArrowUpRight, Check, LoaderCircle, Users } from "lucide-react";
import { action, field, panel } from "@/lib/takt-surface";

import { teamPortraits } from "@/lib/takt-art-team";

export type ProjectMember = { name: string; email: string; avatar?: string };
const initialTeam = [
  { name: "Мира Ли", email: "mira@example.com", avatar: teamPortraits[0] },
  { name: "Алекс Ким", email: "alex@example.com", avatar: teamPortraits[1] },
  { name: "Дана Ю", email: "dana@example.com", avatar: teamPortraits[2] },
];
const portraits = [
  "from-[#dee5e2] to-[#86a195]",
  "from-[#b7ded4] to-[#568a7d]",
  "from-[#dfe7e3] to-[#8fa99d]",
  "from-[#c4d7ed] to-[#728daa]",
];

export function InvitePeople({
  className,
  members = initialTeam,
  onInvite,
}: {
  className?: string;
  members?: ProjectMember[];
  onInvite?: (email: string) => void | Promise<void>;
}) {
  const [added, setAdded] = useState<ProjectMember[]>([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [inspected, setInspected] = useState<string | null>(null);
  const shown = members
    .concat(added)
    .find((person) => person.email === inspected);
  const pending = useRef(false);
  const messageId = useId();
  const team = [
    ...members,
    ...added.filter(
      (member) =>
        !members.some(
          (m) => m.email.toLowerCase() === member.email.toLowerCase(),
        ),
    ),
  ];
  return (
    <form
      className={cn(panel + " w-72 max-w-full", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        const address = email.trim().toLowerCase();
        if (pending.current || !address) return;
        if (team.some((m) => m.email.toLowerCase() === address)) {
          setStatus("Этот адрес уже есть в команде");
          return;
        }
        pending.current = true;
        setBusy(true);
        setStatus("");
        try {
          await onInvite?.(address);
          setAdded((list) => [
            ...list,
            { name: address.split("@")[0], email: address },
          ]);
          setEmail("");
          setStatus("Добавлен " + address);
          setInspected(null);
        } catch {
          setStatus("Не удалось пригласить. Попробуйте снова.");
        } finally {
          pending.current = false;
          setBusy(false);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <strong className="text-base tracking-tight">Команда проекта</strong>
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[10px] tabular-nums text-muted-foreground">
          <Users size={12} />
          {team.length}
        </span>
      </div>
      <div
        className="relative my-3 flex min-h-14 items-center -space-x-2 px-0.5"
        aria-label="Участники"
      >
        {team.slice(-5).map((person, i) => (
          <button
            type="button"
            aria-label={person.name}
            aria-pressed={inspected === person.email}
            onClick={() =>
              setInspected(inspected === person.email ? null : person.email)
            }
            key={person.email}
            title={person.name}
            className={
              "relative inline-grid size-12 overflow-hidden  hover:z-10 motion-safe:hover:rotate-0 motion-safe:transition-transform motion-safe:hover:-translate-y-1 focus-visible:z-10 aria-pressed:z-10 aria-pressed:ring-2 aria-pressed:ring-primary/50 place-items-center rounded-[12px] border-2 border-card bg-linear-145 font-serif text-lg font-semibold text-[#20232d] shadow-sm motion-safe:animate-in motion-safe:zoom-in-75 " +
              portraits[i % portraits.length]
            }
          >
            {person.avatar ? (
              <span
                aria-hidden
                className="absolute inset-0 bg-cover bg-center grayscale"
                style={{
                  backgroundImage: "url(" + JSON.stringify(person.avatar) + ")",
                }}
              />
            ) : (
              person.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0]?.toUpperCase())
                .join("")
            )}
          </button>
        ))}
      </div>
      {shown && (
        <p role="status" className="-mt-1 mb-2 truncate text-xs font-medium">
          {shown.name}{" "}
          <span className="text-muted-foreground">{shown.email}</span>
        </p>
      )}
      <div className="flex gap-1.5">
        <input
          type="email"
          aria-label="Адрес коллеги"
          aria-describedby={messageId}
          required
          autoComplete="off"
          disabled={busy}
          className={field + " flex-1"}
          placeholder="Email коллеги"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("");
          }}
        />
        <button
          className={action + " size-10 px-0"}
          type="submit"
          disabled={busy}
          aria-label="Пригласить"
        >
          {busy ? (
            <LoaderCircle size={16} className="motion-safe:animate-spin" />
          ) : status.startsWith("Добавлен") ? (
            <Check size={17} />
          ) : (
            <ArrowUpRight size={18} />
          )}
        </button>
      </div>
      <p
        role="status"
        id={messageId}
        className="truncate text-xs text-muted-foreground empty:hidden not-empty:mt-2"
      >
        {status}
      </p>
    </form>
  );
}

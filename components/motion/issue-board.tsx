"use client";

import { useId, useRef, useState } from "react";
import { Columns3, Plus, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IssueProperty, statusIcons } from "./issue-property-menu";
import { cn } from "@/lib/utils";
import {
  issueStatuses,
  statusNames,
  useTrackerIssues,
  type TrackerProps,
  type IssueStatus,
} from "./tracker-issues";

export function IssueBoard({
  title = "Доска задач",
  className,
  ...props
}: TrackerProps & { title?: string }) {
  const { rows, commit, update } = useTrackerIssues(props);
  const [lane, setLane] = useState<IssueStatus>("backlog");
  const [draft, setDraft] = useState<string | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [over, setOver] = useState<IssueStatus | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const instance = useId();
  const reduce = useReducedMotion();
  function move(id: string, next: IssueStatus) {
    setLane(next);
    update(id, { status: next });
    requestAnimationFrame(() =>
      board.current
        ?.querySelector<HTMLButtonElement>(
          '[data-issue="' + CSS.escape(id) + '"] button',
        )
        ?.focus({ preventScroll: true }),
    );
  }
  function closeForm() {
    setDraft(null);
    addButton.current?.focus({ preventScroll: true });
  }
  function add() {
    if (!draft?.trim()) return;
    let n = rows.length + 1;
    while (rows.some((issue) => issue.id === "TASK-" + n)) n++;
    commit([
      ...rows,
      {
        id: "TASK-" + n,
        title: draft.trim(),
        status: lane,
        priority: "medium",
        points: 1,
      },
    ]);
    closeForm();
  }
  return (
    <Card
      ref={board}
      className={cn("@container w-full min-w-0 gap-0 p-3 text-left", className)}
    >
      <header className="flex items-center gap-2 border-b pb-2">
        <Columns3 size={16} />
        <h3 className="flex-1 text-sm font-semibold">{title}</h3>
        <Button
          ref={addButton}
          variant="outline"
          size="icon-sm"
          aria-label="Добавить задачу"
          aria-expanded={draft !== null}
          onClick={() => setDraft(draft === null ? "" : null)}
        >
          <Plus size={15} />
        </Button>
      </header>
      {draft !== null && (
        <form
          className="my-2 flex items-center gap-1 rounded-lg border bg-muted/40 p-1 motion-safe:animate-in motion-safe:fade-in"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeForm();
            }}
            placeholder="Название задачи"
            aria-label="Название задачи"
            className="min-w-0 flex-1 rounded-md bg-transparent px-2 py-1 text-xs"
          />
          <Button size="sm" type="submit" disabled={!draft.trim()}>
            Создать
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Отмена"
            onClick={closeForm}
          >
            <X />
          </Button>
        </form>
      )}
      <div
        className="mt-2 flex gap-1 rounded-lg bg-muted/65 p-1 @min-[34rem]:hidden"
        role="group"
        aria-label="Колонки доски"
      >
        {issueStatuses.map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={lane === status}
            onClick={() => setLane(status)}
            className="relative isolate min-h-8 min-w-0 flex-1 rounded-md text-[11px] font-medium text-muted-foreground aria-pressed:text-foreground"
          >
            {status === lane && (
              <motion.span
                aria-hidden
                layoutId={instance + "-lane"}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
                className="absolute inset-0 -z-10 rounded-md border bg-card shadow-xs"
              />
            )}
            {statusNames[status]}{" "}
            <span className="tabular-nums opacity-65">
              {rows.filter((row) => row.status === status).length}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-2 grid gap-2 @min-[34rem]:grid-cols-3">
        {issueStatuses.map((status) => {
          const items = rows.filter((row) => row.status === status);
          const Icon = statusIcons[status];
          return (
            <section
              key={status}
              aria-label={statusNames[status]}
              onDragOver={(event) => {
                if (dragged !== null) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setOver(status);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (
                  dragged !== null &&
                  event.dataTransfer.getData("text/plain") === instance
                ) {
                  move(dragged, status);
                }
                setDragged(null);
                setOver(null);
              }}
              className={cn(
                "min-w-0 rounded-xl border border-transparent bg-muted/40 p-1.5 @min-[34rem]:block",
                lane !== status && "hidden",
                over === status && "border-primary/45 bg-primary/5",
              )}
            >
              <div className="mb-1.5 hidden items-center gap-1.5 px-1 py-1 text-xs font-medium @min-[34rem]:flex">
                <Icon size={14} />
                {statusNames[status]}
                <span className="ml-auto font-mono text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="grid max-h-64 gap-1.5 overflow-y-auto p-0.5">
                {items.length === 0 && (
                  <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                    Пока нет задач
                  </p>
                )}
                {items.map((issue) => (
                  <motion.article
                    key={issue.id}
                    data-issue={issue.id}
                    layoutId={
                      reduce ? undefined : instance + "-issue-" + issue.id
                    }
                    transition={{ type: "spring", stiffness: 330, damping: 31 }}
                    className="min-w-0 rounded-lg border bg-card shadow-xs"
                  >
                    <div
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", instance);
                        event.dataTransfer.effectAllowed = "move";
                        setDragged(issue.id);
                      }}
                      onDragEnd={() => {
                        setDragged(null);
                        setOver(null);
                      }}
                      className="cursor-grab px-2.5 pt-2 active:cursor-grabbing"
                    >
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {issue.id}
                      </span>
                      <p className="text-sm font-medium leading-snug wrap-anywhere">
                        {issue.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-1.5 pb-1">
                      <IssueProperty
                        issue={issue}
                        field="status"
                        onChange={(next) => move(issue.id, next)}
                      />
                      <span className="pr-1 text-[10px] text-muted-foreground">
                        {issue.points} pt
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Card>
  );
}

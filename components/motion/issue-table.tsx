"use client";

import { useState } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Table2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui/card";
import { IssueProperty } from "./issue-property-menu";
import { cn } from "@/lib/utils";
import {
  issuePriorities,
  useTrackerIssues,
  type TrackerProps,
} from "./tracker-issues";

export function IssueTable({
  title = "Реестр задач",
  className,
  ...props
}: TrackerProps & { title?: string }) {
  const { rows, update } = useTrackerIssues(props);
  const [order, setOrder] = useState<"descending" | "ascending">("descending");
  const [edit, setEdit] = useState<{ id: string; text: string } | null>(null);
  const reduce = useReducedMotion();
  const ordered = [...rows].sort(
    (a, b) =>
      (issuePriorities.indexOf(a.priority) -
        issuePriorities.indexOf(b.priority)) *
      (order === "descending" ? 1 : -1),
  );
  const SortIcon =
    order === "descending" ? ArrowDownWideNarrow : ArrowUpNarrowWide;
  function finish(
    id: string,
    value: string,
    restoreFocus: boolean,
    input: HTMLInputElement,
  ) {
    const cell = input.closest("td");
    const text = value.trim();
    if (text && rows.find((row) => row.id === id)?.title !== text)
      update(id, { title: text });
    setEdit(null);
    if (restoreFocus)
      requestAnimationFrame(() =>
        cell?.querySelector("button")?.focus({ preventScroll: true }),
      );
  }
  return (
    <Card className={cn("w-full min-w-0 gap-0 p-0 text-left", className)}>
      <header className="flex items-center gap-2 border-b px-3 py-3">
        <Table2 size={16} />
        <h3 className="flex-1 text-sm font-semibold">{title}</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {rows.length}
        </span>
      </header>
      <div className="max-h-80 overflow-auto">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr className="text-[10px] text-muted-foreground">
              <th scope="col" className="px-2 py-2 font-medium">
                Задача
              </th>
              <th scope="col" className="w-[29%] px-1 font-medium">
                Статус
              </th>
              <th
                scope="col"
                aria-sort={order}
                className="w-[30%] px-1 font-medium"
              >
                <button
                  type="button"
                  aria-label="Сортировать по приоритету"
                  onClick={() =>
                    setOrder(
                      order === "descending" ? "ascending" : "descending",
                    )
                  }
                  className="inline-flex items-center gap-0.5 rounded py-2"
                >
                  Приоритет
                  <SortIcon size={11} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((issue) => (
              <motion.tr
                layout={reduce ? false : "position"}
                transition={{ type: "spring", stiffness: 365, damping: 34 }}
                key={issue.id}
                className="border-t hover:bg-muted/35"
              >
                <td className="px-2 py-2 align-middle">
                  <span className="block font-mono text-[9px] text-muted-foreground">
                    {issue.id}
                  </span>
                  {edit?.id === issue.id ? (
                    <input
                      autoFocus
                      aria-label="Название задачи"
                      className="w-full min-w-0 rounded border bg-background p-1 text-xs"
                      value={edit.text}
                      onFocus={(event) => event.currentTarget.select()}
                      onChange={(e) =>
                        setEdit({ id: issue.id, text: e.target.value })
                      }
                      onBlur={(e) =>
                        finish(
                          issue.id,
                          e.currentTarget.value,
                          false,
                          e.currentTarget,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.nativeEvent.isComposing) return;
                        if (e.key === "Enter" || e.key === "Escape") {
                          e.preventDefault();
                          finish(
                            issue.id,
                            e.key === "Enter" ? e.currentTarget.value : "",
                            true,
                            e.currentTarget,
                          );
                        }
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      aria-label={"Переименовать " + issue.title}
                      onClick={() =>
                        setEdit({ id: issue.id, text: issue.title })
                      }
                      className="block min-h-6 max-w-full rounded text-left text-xs leading-tight font-medium wrap-anywhere"
                    >
                      {issue.title}
                    </button>
                  )}
                </td>
                <td className="px-0.5">
                  <IssueProperty
                    issue={issue}
                    field="status"
                    onChange={(status) => update(issue.id, { status })}
                  />
                </td>
                <td className="px-0.5">
                  <IssueProperty
                    issue={issue}
                    field="priority"
                    onChange={(priority) => update(issue.id, { priority })}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-5 text-center text-xs text-muted-foreground">
            Пока нет задач
          </p>
        )}
      </div>
    </Card>
  );
}

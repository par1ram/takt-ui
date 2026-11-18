"use client";

import { useState } from "react";
export const issueStatuses = ["backlog", "active", "done"] as const;
export const issuePriorities = ["high", "medium", "low"] as const;
export type IssueStatus = (typeof issueStatuses)[number];
export type IssuePriority = (typeof issuePriorities)[number];
export type TrackerIssue = {
  id: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  points: number;
  cycleId?: string;
};
export type TrackerProps = {
  issues?: TrackerIssue[];
  defaultIssues?: TrackerIssue[];
  onIssuesChange?: (issues: TrackerIssue[]) => void;
  className?: string;
};

export const statusNames = {
  backlog: "Очередь",
  active: "В работе",
  done: "Готово",
};
export const priorityNames = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};
const example: TrackerIssue[] = [
  {
    id: "LAB-24",
    title: "Поиск по урокам",
    status: "backlog",
    priority: "high",
    points: 5,
  },
  {
    id: "LAB-23",
    title: "Черновики решений",
    status: "active",
    priority: "high",
    points: 3,
    cycleId: "08",
  },
  {
    id: "LAB-22",
    title: "Разбор ошибок",
    status: "backlog",
    priority: "medium",
    points: 3,
  },
  {
    id: "LAB-21",
    title: "Экспорт заметок",
    status: "done",
    priority: "low",
    points: 2,
    cycleId: "08",
  },
];

export function useTrackerIssues({
  issues,
  defaultIssues = example,
  onIssuesChange,
}: TrackerProps) {
  const [local, setLocal] = useState(defaultIssues);
  const rows = issues ?? local;
  function commit(next: TrackerIssue[]) {
    if (issues === undefined) setLocal(next);
    onIssuesChange?.(next);
  }
  function update(id: string, patch: Partial<Omit<TrackerIssue, "id">>) {
    commit(
      rows.map((issue) => (issue.id === id ? { ...issue, ...patch } : issue)),
    );
  }
  return { rows, commit, update };
}

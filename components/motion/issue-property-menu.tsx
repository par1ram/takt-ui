"use client";
import {
  Check,
  Circle,
  CircleCheck,
  CircleDot,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { Button } from "@/components/ui/button";

import {
  issueStatuses,
  issuePriorities,
  statusNames,
  priorityNames,
  type TrackerIssue,
  type IssueStatus,
  type IssuePriority,
} from "./tracker-issues";
export const statusIcons = {
  backlog: Circle,
  active: CircleDot,
  done: CircleCheck,
};
const priorityIcons = {
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
};

export function IssueProperty({
  issue,
  field,
  onChange,
}: {
  issue: TrackerIssue;
} & (
  | { field: "status"; onChange: (value: IssueStatus) => void }
  | { field: "priority"; onChange: (value: IssuePriority) => void }
)) {
  const status = field === "status";
  const options = status ? issueStatuses : issuePriorities;
  const labels = { ...statusNames, ...priorityNames };
  const icons = { ...statusIcons, ...priorityIcons };
  const value = issue[field];
  const Icon = icons[value];
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button
          size="sm"
          variant="ghost"
          aria-label={[
            status ? "Статус" : "Приоритет",
            issue.id,
            labels[value],
          ].join(" · ")}
          className="h-8 max-w-full justify-start gap-1 rounded-md px-1.5 text-[11px] font-medium"
        >
          <Icon className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{labels[value]}</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          collisionPadding={8}
          className="z-50 min-w-36 rounded-xl border bg-popover p-1 text-popover-foreground shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95"
        >
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(next) => {
              if (status) onChange(next as IssueStatus);
              else onChange(next as IssuePriority);
            }}
          >
            {options.map((option) => {
              const Mark = icons[option];
              return (
                <DropdownMenu.RadioItem
                  key={option}
                  value={option}
                  className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs outline-none data-highlighted:bg-muted"
                >
                  <Mark size={14} />
                  {labels[option]}
                  <DropdownMenu.ItemIndicator className="ml-auto">
                    <Check size={13} />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              );
            })}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

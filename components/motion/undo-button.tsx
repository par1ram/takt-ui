// Ported from Kokonut UI (https://kokonutui.com/docs/buttons/undo-button).
// Copyright (c) 2025 kokonutUI. Licensed under the MIT License.
// Full license text: https://github.com/par1ram/takt-ui/blob/main/THIRD_PARTY_NOTICES.md
"use client";
import { cn } from "@/lib/utils";
import {
  panel as surfacePanel,
  secondary as surfaceSecondary,
} from "@/lib/takt-surface";

import { useState } from "react";
import { Undo2, Trash2 } from "lucide-react";

export function UndoButton({
  className,
  label = "Черновик",
  onChange,
}: {
  className?: string;
  label?: string;
  onChange?: (removed: boolean) => void;
}) {
  const [removed, setRemoved] = useState(false);
  return (
    <div
      className={cn(
        surfacePanel + " flex min-w-56 items-center justify-between gap-3",
        className,
      )}
    >
      <span
        role="status"
        key={String(removed)}
        className={
          "text-sm motion-safe:animate-in motion-safe:slide-in-from-bottom-1 " +
          (removed ? "text-muted-foreground" : "font-medium")
        }
      >
        {removed ? "Запись удалена" : label}
      </span>
      <button
        type="button"
        className={
          surfaceSecondary +
          (removed ? " bg-primary! text-primary-foreground!" : "")
        }
        onClick={() => {
          setRemoved(!removed);
          onChange?.(!removed);
        }}
      >
        {removed ? (
          <>
            <Undo2 size={15} />
            Вернуть
          </>
        ) : (
          <>
            <Trash2 size={15} />
            Удалить
          </>
        )}
      </button>
    </div>
  );
}

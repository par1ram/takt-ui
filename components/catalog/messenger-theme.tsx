"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function MessengerTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className="grid size-9 place-items-center rounded-lg border"
      aria-label="Сменить тему"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun size={16} className="hidden dark:block" />
      <Moon size={16} className="dark:hidden" />
    </button>
  );
}

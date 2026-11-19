"use client";

import { useSyncExternalStore } from "react";
import { publishedOrigin, registryOrigin } from "@/lib/registry-origin";

const subscribe = () => () => {};
const currentOrigin = () => registryOrigin(window.location.href) || publishedOrigin;

export function InstallCommand({ path }: { path: string }) {
  const origin = useSyncExternalStore(subscribe, currentOrigin, () => publishedOrigin);
  return "bunx shadcn@latest add " + origin + path;
}

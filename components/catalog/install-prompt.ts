import type { Entry } from "@/lib/catalog";
import { publishedOrigin } from "@/lib/registry-origin";

export function installPrompt(entry: Entry | null, registryPath: string) {
  const registry = publishedOrigin + registryPath;
  const guide = publishedOrigin + "/llms.txt";
  const index = publishedOrigin + "/agents/components.json";
  const item = registry + (entry?.slug ?? "takt") + ".json";
  const command = "bunx shadcn@latest add " + item;

  return [
    entry
      ? "Установи в моё приложение компонент Takt " + entry.title + "."
      : "Подключи полную библиотеку Takt к моему приложению.",
    "Работай в проекте приложения. Прочитай его AGENTS.md, если он есть. Проверь package.json, Tailwind и алиасы в components.json.",
    "Инструкция Takt для установки: " + guide,
    "Индекс с именами экспортов, пропсами и примерами JSX: " + index,
    "Проверь список файлов и зависимостей пакета: " + item,
    "Если shadcn ещё не настроен, инициализируй его в приложении. Выполни команду из корня приложения через его пакетный менеджер. Для Bun:",
    command,
    entry
      ? "Используй именованный экспорт " + entry.symbol + " через UI-алиас приложения. Если место для компонента не указано, уточни его перед изменением страницы."
      : "Добавь @takt в registries существующего components.json, сохранив остальные записи: " + JSON.stringify({ "@takt": registry + "{name}.json" }) + ". Импортируй только используемые компоненты через UI-алиас приложения.",
    "Сохрани локальные правки при совпадении файлов. Используй токены темы приложения. Запусти его сборку и сообщи, какие файлы установлены и как проверить результат.",
  ].join("\n\n");
}

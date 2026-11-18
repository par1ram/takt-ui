<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Работа с Takt

Внешний агент начинает с `/llms.txt` на работающем сайте и ищет компонент в `/agents/components.json`. В репозитории каталог редактируется в `lib/catalog.ts`, а экспорт и зависимости проверяются по `components/motion/` и `registry.json`. Для подключения демо используйте `components/catalog/demos.ts`.

После изменений выполните `bun run build`. Сборка создаёт установочные пакеты shadcn и заново извлекает пропсы для индекса агентов из TypeScript. Сценарии состояний запускаются командой `bun run motion:review` при работающем каталоге.

Английская версия каталога и отдельные английские TSX собираются из исходников и словаря `i18n/en.json`. Редактируйте оригинал и перевод, затем выполните `bun run registry:build`. `/r/takt.json` устанавливает всю коллекцию, `/r/ru/` содержит русские варианты. Публичные URL в инструкциях вычисляются из домена запроса.

"use client";
import { useState, useRef, useEffect } from "react";
import { guideFor, usageExample } from "@/lib/component-guides";
import { installPrompt } from "./install-prompt";
import { registryOrigin } from "@/lib/registry-origin";
import { Dialog } from "radix-ui";
import { Check, Copy, X } from "lucide-react";
import { entries, type Entry } from "@/lib/catalog";
function CopyCode({ value }: { value: string }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="code-box">
      <pre tabIndex={0}>
        <code>{value}</code>
      </pre>
      <button
        type="button"
        title="Скопировать"
        aria-label="Скопировать код"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setMessage("Скопировано");
          } catch {
            setMessage("Выделите и скопируйте код");
          }
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setMessage(""), 2400);
        }}
      >
        {message === "Скопировано" ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <span role="status">{message}</span>
    </div>
  );
}

function Detail({
  locale,
  entry,
  initialCode,
}: {
  locale: "en" | "ru";
  entry: Entry | null;
  initialCode: boolean;
}) {
  const registryPath = locale === "ru" ? "/r/ru/" : "/r/";
  const publicOrigin = registryOrigin(window.location.origin);
  const installBase = publicOrigin || '"$TAKT_ORIGIN"';
  const [tab, setTab] = useState(initialCode ? "source" : "install");
  const showCode = tab === "source";
  const [files, setFiles] = useState<{ path: string; content: string }[]>([]);
  const [selected, setSelected] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!entry || !showCode) return;
    const controller = new AbortController();
    fetch(registryPath + entry.slug + ".json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Registry unavailable");
        return response.json();
      })
      .then((item) => setFiles(item.files))
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [entry, showCode, attempt, registryPath]);
  const slug = entry?.slug ?? entries[0].slug;
  const install =
    "bunx shadcn@latest add " + installBase + registryPath + slug + ".json";
  return (
    <>
      <Dialog.Title className="dialog-title">
        {entry?.title ?? "Установка"}
      </Dialog.Title>
      <Dialog.Description className="dialog-description">
        {entry?.description ??
          "Добавьте компоненты Takt в проект с React и Tailwind CSS через shadcn CLI."}
      </Dialog.Description>
      {
        <div className="detail-tabs">
          <button
            aria-pressed={tab === "install"}
            onClick={() => setTab("install")}
          >
            Подключение
          </button>
          {entry && (
            <button
              aria-pressed={showCode}
              onClick={() => {
                setFailed(false);
                setTab("source");
              }}
            >
              Исходник
            </button>
          )}
          <button
            aria-pressed={tab === "agent"}
            onClick={() => setTab("agent")}
          >
            Для агента
          </button>
        </div>
      }
      {tab === "agent" ? (
        <>
          <h3>Задание для агента</h3>
          <div className="whitespace-pre-wrap [&_pre]:whitespace-pre-wrap [&_pre]:wrap-anywhere">
            <CopyCode value={installPrompt(entry, registryPath, publicOrigin)} />
          </div>
          <a href={(locale === "ru" ? "/agents/ru" : "/agents") + (entry ? "/components/" + entry.slug + ".json" : "/search.json")} className="underline">
            {entry ? "Карточка компонента для агента" : "Каталог компонентов для агента"}
          </a>
        </>
      ) : showCode ? (
        files[selected] ? (
          <>
            {files.length > 1 && (
              <select
                aria-label="Файл исходника"
                className="max-w-full rounded-md border bg-background p-2 text-xs"
                value={selected}
                onChange={(event) => setSelected(Number(event.target.value))}
              >
                {files.map((file, i) => (
                  <option value={i} key={file.path}>
                    {file.path}
                  </option>
                ))}
              </select>
            )}
            <CopyCode value={files[selected].content} />
          </>
        ) : (
          <p role="status">
            {failed ? (
              <>
                Не удалось загрузить исходник.{" "}
                <button
                  onClick={() => {
                    setFailed(false);
                    setAttempt((n) => n + 1);
                  }}
                >
                  Повторить
                </button>
              </>
            ) : (
              "Загрузка…"
            )}
          </p>
        )
      ) : (
        <>
          {!entry && (
            <>
              <h3>Создайте приложение Next.js</h3>
              <CopyCode value={"bun create next-app@latest my-app --yes\ncd my-app"} />
              <h3>Подготовьте проект</h3>
              <p>
                Если в проекте ещё нет shadcn, выполните команду в его корне.
              </p>
              <CopyCode value="bunx shadcn@latest init" />
            </>
          )}
          <h3>
            {entry ? "Установка через shadcn" : "Установите первый компонент"}
          </h3>
          <CopyCode value={install} />
          {!publicOrigin && <p>{locale === "en" ? "Set TAKT_ORIGIN to your published Takt URL to use these commands." : "Для этих команд задайте TAKT_ORIGIN — публичный URL каталога."}</p>}
          {!entry && <>
            <h3>Установить всю библиотеку</h3>
            <CopyCode value={`bunx shadcn@latest add ${installBase}${registryPath}takt.json`} />
            <h3>Реестр проекта</h3>
            <p>Скопируйте этот блок в настройки registries вашего components.json.</p>
            <CopyCode value={JSON.stringify({ "@takt": (publicOrigin || "<published Takt origin>") + registryPath + "{name}.json" }, null, 2)} />
          </>}
          <p>Стили соберёт Tailwind вашего проекта. Акцент берётся из темы shadcn, а CLI добавит нужные компоненту вспомогательные файлы.</p>
          {entry && <>
            <h3>Сценарии использования</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {entry.useCases.map(scenario => <li key={scenario}>{scenario}</li>)}
            </ul>
          </>}
          <h3>Использование</h3>
          {entry && guideFor(entry.slug) && <p>{guideFor(entry.slug)?.behavior}</p>}
          <CopyCode value={usageExample(entry ?? entries[0])} />
          {entry && entry.references.length > 0 && (
            <p className="source-links">
              Референсы ·{" "}
              {entry.references.map((ref, index) => (
                <span key={ref.id}>
                  {index > 0 && " · "}
                  <a
                    href={"https://designbookmark.com/motion#" + ref.id}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {ref.name}
                  </a>
                </span>
              ))}
            </p>
          )}
        </>
      )}
    </>
  );
}

export function DetailDialog({
  locale,
  modal,
  initialCode,
  trigger,
  onClose,
}: {
  locale: "en" | "ru";
  modal: Entry | "install";
  initialCode: boolean;
  trigger: HTMLElement | null;
  onClose: () => void;
}) {
  return (
    <Dialog.Root
      open
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="catalog-dialog"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            trigger?.focus();
          }}
        >
          <Dialog.Close className="dialog-close" aria-label="Закрыть">
            <X size={19} />
          </Dialog.Close>
          {modal && (
            <Detail
              locale={locale}
              key={modal === "install" ? modal : modal.slug}
              entry={modal === "install" ? null : modal}
              initialCode={initialCode}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

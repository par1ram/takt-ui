"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { AccentPicker } from "./accent-picker";
import { Stage } from "./preview";
import {
  Moon,
  ChartNoAxesCombined,
  Columns3,
  Sun,
  TextCursorInput,
  GraduationCap,
  MessagesSquare,
  Sparkles,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Code2,
  Grid2X2,
  Layers2,
  MousePointer2,
  Navigation,
  Search,
  SlidersHorizontal,
  Type,
  X,
} from "lucide-react";
import { allEntries, entries, type Entry } from "@/lib/catalog";
import { useTheme } from "next-themes";
import "./catalog.css";

const DetailDialog = dynamic(() =>
  import("./detail-dialog").then((module) => module.DetailDialog),
);
const searchIndex = new Map(
  entries.map(
    (entry) =>
      [
        entry.slug,
        [
          entry.title,
          entry.description,
          entry.category,
          entry.gesture,
          ...entry.references.map((ref) => ref.name),
        ]
          .join(" ")
          .toLocaleLowerCase(),
      ] as const,
  ),
);
const filters = [
  { label: "Все", icon: Grid2X2 },
  { label: "Кнопки", icon: MousePointer2 },
  { label: "Карточки", icon: Layers2 },
  { label: "Навигация", icon: Navigation },
  { label: "Текст", icon: Type },
  { label: "Ввод", icon: TextCursorInput },
  { label: "AI", icon: Sparkles },
  { label: "Обучение", icon: GraduationCap },
  { label: "Мессенджер", icon: MessagesSquare },
  { label: "Метрики", icon: ChartNoAxesCombined },
  { label: "Трекеры", icon: Columns3 },
];
// Wait for hydration before exposing the browser’s saved theme to assistive technology.
const subscribeToHydration = () => () => {};

export function Catalog({ locale = "ru" }: { locale?: "en" | "ru" }) {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [category, setCategory] = useState("Все");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<Entry | "install" | null>(null);
  const [initialCode, setInitialCode] = useState(false);
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const library = useRef<HTMLElement>(null);

  useEffect(() => {
    function read() {
      try {
        const parsed: unknown = JSON.parse(
          localStorage.getItem("takt:saved") ??
            localStorage.getItem("kinetik:saved") ??
            "[]",
        );
        if (Array.isArray(parsed))
          setSaved(
            parsed.filter((slug): slug is string =>
              entries.some((entry) => entry.slug === slug),
            ),
          );
      } catch {
        /* Storage is optional. */
      }
    }
    function shortcut(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !document.querySelector("[role=dialog], dialog[open]") &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        )
      ) {
        e.preventDefault();
        search.current?.focus();
      }
    }
    read();
    window.addEventListener("storage", read);
    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("keydown", shortcut);
    };
  }, []);
  function bookmark(slug: string) {
    const next = saved.includes(slug)
      ? saved.filter((s) => s !== slug)
      : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("takt:saved", JSON.stringify(next));
    } catch {
      /* Keep bookmarks in memory. */
    }
  }
  function selectCollection(onlySaved: boolean) {
    setSavedOnly(onlySaved);
    setCategory("Все");
    setQuery("");
    library.current?.scrollIntoView({ behavior: "instant" });
  }
  function open(value: Entry | "install", trigger: HTMLElement, code = false) {
    setInitialCode(code);
    setOpener(trigger);
    setModal(value);
  }
  const normalized = query.trim().toLocaleLowerCase();
  const collection = !savedOnly && category === "Все" ? allEntries : entries;
  const visible = collection.filter(
    (e) =>
      (!savedOnly || saved.includes(e.slug)) &&
      (category === "Все" || e.category === category) &&
      (!normalized || searchIndex.get(e.slug)?.includes(normalized)),
  );

  return (
    <div className="catalog-app" id="top">
      <header className="masthead">
        <div className="shell nav-inner">
          <a className="brand" href="#top" aria-label="Takt, в начало">
            <span className="takt-mark" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            Takt
          </a>
          <nav aria-label="Разделы библиотеки">
            <button
              aria-pressed={!savedOnly}
              onClick={() => selectCollection(false)}
            >
              Каталог
            </button>
            <button
              aria-pressed={savedOnly}
              onClick={() => selectCollection(true)}
            >
              Избранное{saved.length > 0 && <small>{saved.length}</small>}
            </button>
          </nav>
          <div className="nav-tools">
            <div
              className="theme-picker"
              role="group"
              aria-label="Тема оформления"
            >
              <button
                className="light-choice"
                aria-pressed={mounted ? theme === "light" : undefined}
                type="button"
                aria-label="Светлая тема"
                title="Светлая тема"
                onClick={() => setTheme("light")}
              >
                <Sun size={15} />
              </button>
              <button
                className="dark-choice"
                aria-pressed={mounted ? theme === "dark" : undefined}
                type="button"
                aria-label="Тёмная тема"
                title="Тёмная тема"
                onClick={() => setTheme("dark")}
              >
                <Moon size={15} />
              </button>
            </div>
            <button
              className="install-button"
              onClick={(e) => open("install", e.currentTarget)}
            >
              <BookOpen size={15} />
              Установка
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </header>
      <main className="shell">
        <section
          ref={library}
          id="library"
          className="library"
          aria-labelledby="catalog-title"
        >
          <div className="section-heading">
            <div className="section-title">
              <h1 id="catalog-title">
                {savedOnly ? "Избранное" : "Компоненты"}
              </h1>
              <span>{String(visible.length).padStart(2, "0")}</span>
            </div>
            <div className="catalog-controls">
              <label className="search">
                <Search size={16} />
                <input
                  ref={search}
                  aria-label="Поиск компонентов"
                  placeholder="Найти компонент"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query ? (
                  <button
                    aria-label="Очистить поиск"
                    onClick={() => {
                      setQuery("");
                      search.current?.focus();
                    }}
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <kbd>/</kbd>
                )}
              </label>
              <AccentPicker />
              <a className="grid h-[35px] min-w-9 place-items-center rounded-lg border text-xs font-semibold" href={locale === "en" ? "/ru" : "/"} hrefLang={locale === "en" ? "ru" : "en"} aria-label={locale === "en" ? "Русский" : "English"}>{locale === "en" ? "RU" : "EN"}</a>
            </div>
          </div>
          <div className="filters" role="group" aria-label="Категории">
            {filters.map(({ label, icon: Icon }) => (
              <button
                key={label}
                aria-pressed={category === label}
                onClick={() => setCategory(label)}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <div className="specimen-grid">
            {visible.map((entry) => (
              <article key={entry.slug} className="specimen">
                <div className="stage-wrap">
                  <Stage entry={entry} />
                  <button
                    className="bookmark"
                    aria-label={
                      (saved.includes(entry.slug)
                        ? "Удалить из избранного "
                        : "Сохранить ") + entry.title
                    }
                    aria-pressed={saved.includes(entry.slug)}
                    onClick={() => bookmark(entry.slug)}
                  >
                    <Bookmark
                      size={15}
                      fill={
                        saved.includes(entry.slug) ? "currentColor" : "none"
                      }
                    />
                  </button>
                </div>
                <div className="specimen-caption">
                  <div>
                    <span className="category-label">{entry.category}</span>
                    <h2>
                      <a href={(locale === "ru" ? "/ru" : "") + "/components/" + entry.slug}>
                        {entry.title}
                      </a>
                    </h2>
                  </div>
                  <button
                    className="code-button"
                    title="Код компонента"
                    aria-label={"Открыть код " + entry.title}
                    onClick={(e) => open(entry, e.currentTarget, true)}
                  >
                    <Code2 size={17} />
                  </button>
                </div>
                <p className="gesture">{entry.gesture}</p>
              </article>
            ))}
          </div>
          {!visible.length && (
            <div className="empty">
              <SlidersHorizontal size={25} />
              <h3>
                {savedOnly && !saved.length
                  ? "Пока ничего не сохранено"
                  : "Компоненты не найдены"}
              </h3>
              <p>
                {savedOnly && !saved.length
                  ? "Нажмите на закладку в карточке компонента."
                  : "Попробуйте другую категорию или поисковый запрос."}
              </p>
              <button onClick={() => selectCollection(false)}>
                Показать все компоненты
              </button>
            </div>
          )}
        </section>
      </main>
      <footer className="shell footer">
        <span>Takt</span>
        <span>React · Tailwind CSS · Motion</span>
      </footer>
      {modal && (
        <DetailDialog
          locale={locale}
          modal={modal}
          initialCode={initialCode}
          trigger={opener}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

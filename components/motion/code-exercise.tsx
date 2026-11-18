"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ArrowLeft, Code2, MessageCircleQuestion, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { action, field, panel, secondary } from "@/lib/takt-surface";
import { AskTutor, type TutorAnswer } from "./ask-tutor";
import { RunConsole, type RunState } from "./run-console";
import { TestResults, type ExerciseCase } from "./test-results";

type InputCase = Omit<ExerciseCase, "actual">;
type Runner = (
  source: string,
  inputs: InputCase[],
  signal: AbortSignal,
  onRunning: () => void,
) => Promise<boolean[]>;
const cases: InputCase[] = [
  { input: "UI-7", expected: true },
  { input: "UI-X", expected: false },
  { input: "7", expected: false },
  { input: "UI-", expected: false },
  { input: "UI-42", expected: true },
];

// Patterns are data. Only this fixed worker program runs, and the caller can terminate it.
const workerProgram = `onmessage = ({data}) => {
  try {
    const pattern = new RegExp(data.source, "u");
    postMessage({ running: true });
    postMessage({ values: data.inputs.map(input => pattern.test(input)) });
  } catch (error) { postMessage({ error: error.message }); }
};`;
const runPatterns: Runner = (source, inputs, signal, onRunning) =>
  new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const url = URL.createObjectURL(
      new Blob([workerProgram], { type: "text/javascript" }),
    );
    let worker: Worker;
    try {
      worker = new Worker(url);
    } finally {
      URL.revokeObjectURL(url);
    }
    function stop() {
      cleanup();
      reject(signal.reason);
    }
    function cleanup() {
      worker.terminate();
      signal.removeEventListener("abort", stop);
    }
    signal.addEventListener("abort", stop, { once: true });
    worker.onmessage = ({ data }) => {
      if (data.running) {
        onRunning();
        return;
      }
      cleanup();
      if (data.error) reject(new Error(data.error));
      else resolve(data.values);
    };
    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message));
    };
    worker.postMessage({ source, inputs: inputs.map((item) => item.input) });
  });

function subscribeToDrafts(notify: () => void) {
  window.addEventListener("storage", notify);
  return () => window.removeEventListener("storage", notify);
}

export function CodeExercise({
  title = "Проверка идентификатора",
  instruction = "Примите UI- и одну или несколько цифр.",
  filename = "pattern.regex",
  initialSource = "^UI-[0-9]$",
  tests = cases,
  initialInput = "UI-42",
  onExecute = runPatterns,
  onAsk,
  draftKey,
  className,
}: {
  title?: string;
  instruction?: string;
  filename?: string;
  initialSource?: string;
  initialInput?: string;
  tests?: InputCase[];
  onExecute?: Runner;
  onAsk?: (question: string, context: string[]) => Promise<TutorAnswer>;
  draftKey?: string;
  className?: string;
}) {
  const saved = useSyncExternalStore(
    subscribeToDrafts,
    () => {
      try {
        return draftKey ? localStorage.getItem(draftKey) : null;
      } catch {
        return null;
      }
    },
    () => null,
  );
  const [edit, setEdit] = useState<{ key?: string; value: string }>();
  const source =
    edit && edit.key === draftKey ? edit.value : (saved ?? initialSource);
  const [input, setInput] = useState(initialInput);
  const [state, setState] = useState<RunState>({ phase: "idle" });
  const [results, setResults] = useState<ExerciseCase[]>([]);
  const [question, setQuestion] = useState<string[] | null>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const [view, setView] = useState<"editor" | "output">("editor");
  const [tutorOpen, setTutorOpen] = useState(false);
  const tutorBack = useRef<HTMLButtonElement>(null);
  const outputButton = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const nextFocus = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    nextFocus.current?.focus({ preventScroll: true });
    nextFocus.current = null;
  }, [view, tutorOpen]);

  function openTutor(context: string[], trigger: HTMLButtonElement) {
    returnTo.current = trigger;
    nextFocus.current = tutorBack.current;
    setQuestion(context);
    setTutorOpen(true);
  }

  function closeTutor() {
    nextFocus.current = returnTo.current;
    setTutorOpen(false);
  }
  const active = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      if (active.current) {
        active.current.abort();
        active.current = null;
        setState({ phase: "stopped" });
      }
    },
    [],
  );
  function stop() {
    active.current?.abort();
    active.current = null;
    setState({ phase: "stopped" });
  }
  async function run(check: boolean) {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    const started = performance.now();
    setResults([]);
    setQuestion(null);
    nextFocus.current = outputButton.current;
    setView("output");
    setState({ phase: "compile" });
    const batch = check ? tests : [{ input, expected: true }];
    const timer = setTimeout(() => {
      if (active.current !== controller) return;
      stop();
      setState({ phase: "error", output: "Превышено время выполнения" });
    }, 5000);
    try {
      const values = await onExecute(source, batch, controller.signal, () => {
        if (active.current === controller) setState({ phase: "run" });
      });
      if (active.current !== controller) return;
      if (values.length !== batch.length)
        throw new Error("Неполный ответ среды выполнения");
      const completed = batch.map((item, i) => ({
        ...item,
        actual: values[i],
      }));
      if (check) setResults(completed);
      setState({
        phase: "done",
        duration: Math.round(performance.now() - started),
        output: check ? undefined : String(values[0]),
      });
    } catch (error) {
      if (active.current === controller)
        setState({
          phase: "error",
          output: error instanceof Error ? error.message : "Ошибка запуска",
        });
    } finally {
      clearTimeout(timer);
      if (active.current === controller) active.current = null;
    }
  }
  const busy = state.phase === "run" || state.phase === "compile";
  function backToEditor() {
    nextFocus.current = editor.current;
    setView("editor");
    setTutorOpen(false);
  }
  return (
    <section
      className={cn(
        panel,
        "relative isolate w-96 max-w-full overflow-clip",
        className,
      )}
      onKeyDown={(event) => {
        if (
          tutorOpen &&
          event.key === "Escape" &&
          !event.nativeEvent.isComposing
        ) {
          event.preventDefault();
          event.stopPropagation();
          closeTutor();
        }
      }}
    >
      <div inert={tutorOpen}>
        <header>
          <strong className="text-base tracking-tight">{title}</strong>
          <p className="text-xs text-muted-foreground">{instruction}</p>
        </header>
        <div className="my-3 flex items-center justify-between border-b text-xs">
          <div role="group" aria-label="Вид упражнения" className="flex">
            <button
              type="button"
              aria-pressed={view === "editor"}
              onClick={() => setView("editor")}
              className="min-h-8 border-b-2 border-transparent px-2 font-medium text-muted-foreground aria-pressed:border-primary aria-pressed:text-foreground"
            >
              Редактор
            </button>
            <button
              ref={outputButton}
              type="button"
              aria-pressed={view === "output"}
              disabled={state.phase === "idle"}
              onClick={() => setView("output")}
              className="min-h-8 border-b-2 border-transparent px-2 font-medium text-muted-foreground aria-pressed:border-primary aria-pressed:text-foreground disabled:opacity-45"
            >
              Результат
            </button>
          </div>
          <button
            type="button"
            aria-label="Спросить о коде"
            title="Спросить о коде"
            disabled={busy}
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={(event) => {
              const node = editor.current;
              const selected = node
                ? source.slice(node.selectionStart, node.selectionEnd)
                : "";
              openTutor(
                [filename + " · " + (selected || source), title],
                event.currentTarget,
              );
            }}
          >
            <MessageCircleQuestion size={15} />
          </button>
        </div>
        <div className="relative h-56">
          <div
            hidden={view !== "editor"}
            className="absolute inset-0 overflow-y-auto overscroll-contain"
          >
            <div className="grid gap-3 p-1">
              <label className="grid overflow-hidden rounded-xl border bg-muted/40">
                <span className="flex items-center gap-2 border-b px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                  <Code2 size={13} />
                  {filename}
                </span>
                <textarea
                  ref={editor}
                  rows={2}
                  spellCheck={false}
                  readOnly={busy}
                  value={source}
                  onChange={(e) => {
                    setEdit({ key: draftKey, value: e.target.value });
                    setState({ phase: "idle" });
                    setQuestion(null);
                    setResults([]);
                    if (draftKey)
                      try {
                        localStorage.setItem(draftKey, e.target.value);
                      } catch {
                        /* Storage is optional. */
                      }
                  }}
                  className="min-w-0 resize-y p-3 font-mono text-sm outline-offset-[-2px]"
                />
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                Входная строка
                <input
                  className={field}
                  value={input}
                  readOnly={busy}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (!results.length) setState({ phase: "idle" });
                  }}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={secondary}
                  type="button"
                  disabled={busy}
                  onClick={() => void run(false)}
                >
                  <Play size={13} />
                  Запустить
                </button>
                <button
                  className={action}
                  type="button"
                  disabled={busy || !tests.length}
                  onClick={() => void run(true)}
                >
                  Проверить решение
                </button>
              </div>
            </div>
          </div>
          <div
            hidden={view !== "output"}
            className="absolute inset-0 overflow-y-auto overscroll-contain p-1"
          >
            {state.phase !== "idle" && !results.length && (
              <RunConsole
                state={state}
                className="w-full border-0 p-0 shadow-none"
                onStop={stop}
                onErrorLocation={() => {
                  editor.current?.setSelectionRange(0, source.length);
                  backToEditor();
                }}
              />
            )}
            {results.length > 0 && (
              <TestResults
                results={results}
                onAsk={(row, trigger) =>
                  openTutor(
                    [
                      filename + " · " + source,
                      JSON.stringify(row.input) +
                        " → " +
                        row.actual +
                        " ≠ " +
                        row.expected,
                      title,
                    ],
                    trigger,
                  )
                }
                className="w-full border-0 p-0 shadow-none"
              />
            )}
          </div>
        </div>
      </div>
      <div
        inert={!tutorOpen}
        className={cn(
          "absolute inset-0 z-10 flex min-h-0 flex-col bg-card text-card-foreground motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out",
          tutorOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="border-b px-3 py-2">
          <button
            ref={tutorBack}
            type="button"
            className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium hover:bg-muted"
            onClick={closeTutor}
          >
            <ArrowLeft size={14} />
            {view === "output" ? "К результату" : "К редактору"}
          </button>
        </div>
        {question && (
          <div
            key={JSON.stringify(question)}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3"
          >
            <AskTutor
              className="w-full border-0 p-0 shadow-none"
              context={question}
              onAsk={onAsk}
              onReturn={backToEditor}
            />
          </div>
        )}
      </div>
    </section>
  );
}

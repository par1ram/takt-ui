"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Code2, MessageCircleQuestion, Play } from "lucide-react";
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
  const tutor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (question) tutor.current?.querySelector("textarea")?.focus();
  }, [question]);
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
    setQuestion(null);
    editor.current?.focus();
  }
  return (
    <section className={cn(panel, "grid w-96 max-w-full gap-3", className)}>
      <header>
        <strong className="text-base tracking-tight">{title}</strong>
        <p className="text-xs text-muted-foreground">{instruction}</p>
      </header>
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
        <button
          type="button"
          className={secondary}
          aria-label="Спросить о коде"
          title="Спросить о коде"
          disabled={busy}
          onClick={() => {
            const node = editor.current;
            const selected = node
              ? source.slice(node.selectionStart, node.selectionEnd)
              : "";
            setQuestion([filename + " · " + (selected || source), title]);
          }}
        >
          <MessageCircleQuestion size={15} />
        </button>
      </div>
      {state.phase !== "idle" && (
        <RunConsole
          state={state}
          className="w-full"
          onStop={stop}
          onErrorLocation={() => {
            editor.current?.focus();
            editor.current?.select();
          }}
        />
      )}
      {results.length > 0 && (
        <TestResults
          results={results}
          onAsk={(row) =>
            setQuestion([
              filename + " · " + source,
              JSON.stringify(row.input) +
                " → " +
                row.actual +
                " ≠ " +
                row.expected,
              title,
            ])
          }
          className="w-full"
        />
      )}
      {question && (
        <div ref={tutor} className="grid gap-2">
          <AskTutor
            key={JSON.stringify(question)}
            className="w-full"
            context={question}
            onAsk={onAsk}
            onReturn={backToEditor}
          />
          <button className={secondary} type="button" onClick={backToEditor}>
            К редактору
          </button>
        </div>
      )}
    </section>
  );
}

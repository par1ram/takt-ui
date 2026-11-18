"use client";

import { lazy, Suspense, useState, useSyncExternalStore } from "react";
import { Check, CreditCard, LockKeyhole, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const HostedPaymentElement = lazy(() =>
  import("@stripe/react-stripe-js").then(({ PaymentElement }) => ({
    default: PaymentElement,
  })),
);
const subscribe = () => () => {};
const securePage = () =>
  window.isSecureContext && location.protocol === "https:";
const serverSnapshot = () => null;
type Props = { className?: string } & (
  | { mode?: "demo"; onChange?: (testDigits: string) => void }
  | { mode: "payment"; onCompleteChange?: (complete: boolean) => void }
);

function HostedField({
  onCompleteChange,
}: {
  onCompleteChange?: (complete: boolean) => void;
}) {
  const secure = useSyncExternalStore<boolean | null>(
    subscribe,
    securePage,
    serverSnapshot,
  );
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (secure === null)
    return (
      <p role="status" className="text-sm">
        Загрузка платёжной формы…
      </p>
    );
  if (!secure)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Для ввода карты откройте страницу по HTTPS.
      </p>
    );
  if (error)
    return (
      <div role="alert" className="grid gap-2 text-sm">
        Не удалось загрузить платёжную форму.
        <button
          type="button"
          className="justify-self-start rounded-md border px-3 py-1"
          onClick={() => {
            setError(false);
            setAttempt(attempt + 1);
          }}
        >
          Повторить
        </button>
      </div>
    );
  return (
    <Suspense
      fallback={
        <p role="status" className="text-sm">
          Загрузка платёжной формы…
        </p>
      }
    >
      <HostedPaymentElement
        key={attempt}
        onChange={(event) => {
          onCompleteChange?.(event.complete);
        }}
        onLoadError={() => {
          onCompleteChange?.(false);
          setError(true);
        }}
      />
    </Suspense>
  );
}

export function CardField(props: Props) {
  const [selected, setSelected] = useState(false);
  const payment = props.mode === "payment";
  return (
    <section
      className={cn(
        "grid w-full max-w-[290px] gap-4 rounded-2xl border bg-card p-4 text-card-foreground shadow-sm",
        payment && "max-w-md",
        props.className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <CreditCard size={17} />
          Способ оплаты
        </span>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {payment ? (
            <>
              <LockKeyhole size={12} />
              Stripe
            </>
          ) : (
            "Демо"
          )}
        </span>
      </div>
      {payment ? (
        <HostedField onCompleteChange={props.onCompleteChange} />
      ) : (
        <>
          <div className="rounded-xl bg-muted/65 px-3 py-3">
            <div className="mb-1 text-[11px] text-muted-foreground">
              {selected ? "Visa · тестовая карта" : "Номер тестовой карты"}
            </div>
            <output
              aria-live="polite"
              className="font-mono text-base tracking-[.07em] tabular-nums"
            >
              <span aria-hidden>•••• •••• •••• </span>
              {selected ? "4242" : "••••"}
            </output>
          </div>
          <button
            type="button"
            aria-pressed={selected}
            onClick={() => {
              setSelected(!selected);
              props.onChange?.(selected ? "" : "4242424242424242");
            }}
            className="flex min-h-9 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
          >
            {selected ? <RotateCcw size={13} /> : <Check size={14} />}
            {selected ? "Сбросить" : "Подставить тестовую карту"}
          </button>
        </>
      )}
    </section>
  );
}

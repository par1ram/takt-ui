"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CreditCard,
  LoaderCircle,
  Printer,
  RotateCcw,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ReceiptOrder = {
  id?: string;
  description: string;
  amount: number;
  currency: string;
};
export type PaymentReceipt = { orderId: string };
const sample: ReceiptOrder = {
  description: "Takt Studio",
  amount: 24,
  currency: "EUR",
};
type PrintedReceipt = {
  merchant: string;
  description: string;
  total: string;
  orderId: string;
};
const formatAmount = (order: ReceiptOrder) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: order.currency,
  }).format(order.amount);

type PrinterProps = {
  className?: string;
  merchant?: string;
  order?: ReceiptOrder;
  /** Resolve after confirmation. amount is in major currency units. */
  onPay?: (order: ReceiptOrder) => Promise<PaymentReceipt>;
};
export function ReceiptPrinter(props: PrinterProps) {
  const { order = sample, merchant = "Takt" } = props;
  return (
    <PrinterView
      key={JSON.stringify([
        merchant,
        order.id,
        order.description,
        order.amount,
        order.currency,
      ])}
      {...props}
    />
  );
}
function PrinterView({
  className,
  merchant = "Takt",
  order = sample,
  onPay,
}: PrinterProps) {
  const [phase, setPhase] = useState<
    "idle" | "processing" | "printing" | "complete" | "error"
  >("idle");
  const [receipt, setReceipt] = useState<PrintedReceipt | null>(null);
  const [print, setPrint] = useState(0);
  const pending = useRef(false);
  const demo = !onPay;
  const reduced = useReducedMotion();
  const total = formatAmount(order);
  // The demo simulates processing. Live checkout waits for the merchant's confirmation.
  useEffect(() => {
    if (phase !== "processing" || !receipt) return;
    const timer = setTimeout(() => setPhase("printing"), demo ? 1050 : 0);
    return () => clearTimeout(timer);
  }, [phase, receipt, demo]);
  async function pay() {
    if (pending.current || phase === "printing" || phase === "processing")
      return;
    if (receipt) {
      setPrint((n) => n + 1);
      setPhase("printing");
      return;
    }
    pending.current = true;
    setPhase("processing");
    try {
      const result = onPay
        ? await onPay({ ...order })
        : { orderId: "DEMO-024" };
      setReceipt({
        merchant,
        description: order.description,
        total,
        orderId: result.orderId,
      });
    } catch {
      setPhase("error");
    } finally {
      pending.current = false;
    }
  }
  const busy = phase === "processing" || phase === "printing";
  const status =
    phase === "processing"
      ? "Обрабатываем заказ"
      : phase === "printing"
        ? "Печатаем чек"
        : phase === "complete"
          ? "Заказ оплачен"
          : phase === "error"
            ? "Повторить оплату"
            : "Оплатить " + total;
  return (
    <section
      aria-label="Принтер чеков"
      className={cn(
        "relative isolate h-[274px] w-[254px] max-w-full",
        className,
      )}
    >
      <div className="relative z-10 rounded-[19px] border border-[#bcbfbb] bg-[linear-gradient(158deg,#e4e5e1,#c4c7c2)] px-3 pb-2 pt-2.5 text-[#1a1d1a] shadow-[inset_0_1px_0_#fff,0_4px_12px_#0002] dark:border-zinc-700 dark:bg-[linear-gradient(158deg,#393b3b,#222425)] dark:text-zinc-100 dark:shadow-[inset_0_1px_0_#ffffff18,0_4px_12px_#0006]">
        <div className="mb-2 flex h-5 items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 truncate text-[12px] font-bold">
            <Printer className="shrink-0" size={15} />
            {receipt?.merchant ?? merchant}
          </span>
          <span className="flex items-center gap-1.5">
            {demo && (
              <span className="rounded-full bg-white/60 dark:bg-white/10 px-2 py-0.5 text-[10px] font-medium">
                Демо
              </span>
            )}
            {phase === "complete" ? (
              <button
                type="button"
                aria-label="Напечатать ещё раз"
                onClick={pay}
                className="grid size-6 place-items-center rounded-full bg-white/70 dark:bg-white/10"
              >
                <RotateCcw size={12} />
              </button>
            ) : null}
          </span>
        </div>
        <button
          type="button"
          aria-label={status}
          disabled={busy || phase === "complete"}
          onClick={pay}
          className="flex min-h-9 w-full items-center justify-center gap-2 rounded-[9px] bg-[#fafbf8] px-2 text-[12px] font-medium shadow-[inset_0_0_0_1px_#ffffffb0] dark:bg-zinc-800 dark:shadow-[inset_0_0_0_1px_#ffffff25]"
        >
          {busy ? (
            <LoaderCircle size={14} className="motion-safe:animate-spin" />
          ) : phase === "complete" ? (
            <Check size={14} className="text-emerald-700 dark:text-emerald-300" />
          ) : (
            <CreditCard size={14} />
          )}
          <span role="status">{status}</span>
        </button>
        <div
          className="relative mx-1 mt-2 h-[5px] rounded-full bg-[#363d37] shadow-[0_1px_0_#fff9,inset_0_2px_3px_#101510] dark:bg-zinc-950 dark:shadow-[0_1px_0_#ffffff20,inset_0_2px_3px_#000]"
        >
          {receipt && (phase === "printing" || phase === "complete") && (
            <div className="pointer-events-none absolute inset-x-1.5 top-1/2 overflow-hidden pb-1.5">
              <motion.div
                key={print}
                initial={{ y: reduced ? "0%" : "-100%" }}
                animate={{ y: "0%" }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 1.64, ease: [0.36, 0.02, 0.32, 1] }
                }
                onAnimationComplete={() => setPhase("complete")}
                className="pb-[4px]"
              >
                <div
                  className="relative min-h-[177px] bg-white px-3.5 pb-8 pt-4 font-mono text-[11px] leading-relaxed text-[#222720] shadow-[0_4px_8px_#0002]"
                >
                  <p className="truncate font-sans text-base font-bold tracking-tight">
                    {receipt.merchant}
                  </p>
                  <p className="truncate text-[9px] text-[#62685f]">
                    Заказ № {receipt.orderId}
                  </p>
                  <div className="mt-3 flex justify-between gap-2">
                    <span className="min-w-0 break-words">{receipt.description}</span>
                    <span className="shrink-0">{receipt.total}</span>
                  </div>
                  <div className="mt-2 flex justify-between gap-2 border-t border-dashed border-[#c6c8be] pt-2 font-bold">
                    <span>Итого</span>
                    <span>{receipt.total}</span>
                  </div>
                  <p className="mt-3 text-center text-[9px] text-[#62685f]">
                    Спасибо за заказ!
                  </p>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-full h-[4px] bg-white [mask-image:linear-gradient(135deg,#000_25%,transparent_25%),linear-gradient(225deg,#000_25%,transparent_25%)] [mask-size:7px_8px]"
                  />
                </div>
              </motion.div>
              <i
                aria-hidden
                className="absolute inset-x-0 top-0 h-2 bg-linear-to-b from-black/15 to-transparent"
              />
            </div>
          )}
        </div>
      </div>
      {phase === "error" && (
        <p
          role="alert"
          className="mx-3 mt-3 text-center text-xs text-destructive"
        >
          Оплата не подтверждена
        </p>
      )}
    </section>
  );
}

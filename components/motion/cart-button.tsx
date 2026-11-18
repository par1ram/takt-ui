"use client";
import { useActionFocus } from "@/lib/takt-focus";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { orbitCover } from "@/lib/takt-art-orbit";
import { panel, action } from "@/lib/takt-surface";
export function CartButton({
  className,
  onAdd,
  onQuantityChange,
  title = "Постер Orbit",
  price = 1800,
  cover = orbitCover,
}: {
  className?: string;
  onAdd?: () => void;
  onQuantityChange?: (n: number) => void;
  title?: string;
  price?: number;
  cover?: string;
}) {
  const { root, focusAfterRender } = useActionFocus<HTMLDivElement>();
  const [quantity, setQuantity] = useState(0);
  function change(delta: number) {
    const n = Math.max(0, quantity + delta);
    if (!quantity || !n) focusAfterRender(n ? "[data-increase]" : "[data-add]");
    setQuantity(n);
    if (delta > 0) onAdd?.();
    onQuantityChange?.(n);
  }
  return (
    <div ref={root} className={cn(panel + " w-60", className)}>
      <div className="flex items-center gap-3">
        <span
          role="img"
          aria-label={title}
          className="size-14 shrink-0 grayscale rounded-lg border border-black/10 bg-cover bg-center shadow-sm"
          style={{ backgroundImage: 'url("' + cover + '")' }}
        />
        <span className="grid gap-0.5">
          <strong>{title}</strong>
          <small className="text-muted-foreground">
            {price.toLocaleString("ru-RU")} ₽
          </small>
        </span>
      </div>
      <div className="mt-3 border-t pt-3">
        {quantity === 0 ? (
          <button
            type="button"
            data-add
            className={action + " w-full"}
            onClick={() => change(1)}
          >
            <ShoppingBag size={15} />В корзину
          </button>
        ) : (
          <div className="flex h-10 items-center justify-between motion-safe:animate-in motion-safe:slide-in-from-bottom-1">
            <div className="inline-flex h-9 items-center rounded-xl bg-muted">
              <button
                type="button"
                aria-label="Убрать один"
                className="grid size-8 place-items-center"
                onClick={() => change(-1)}
              >
                <Minus size={14} />
              </button>
              <output className="w-5 text-center font-mono">{quantity}</output>
              <button
                type="button"
                data-increase
                aria-label="Добавить один"
                className="grid size-8 place-items-center"
                onClick={() => change(1)}
              >
                <Plus size={14} />
              </button>
            </div>
            <output className="font-semibold tabular-nums">
              {(quantity * price).toLocaleString("ru-RU")} ₽
            </output>
          </div>
        )}
      </div>
    </div>
  );
}

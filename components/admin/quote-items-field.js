"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lineTotal, formatMoney } from "@/lib/quotes";

const EMPTY_ITEM = { description: "", quantity: 1, unitPrice: 0, discount: 0 };

/** Lista editable de ítems de una cotización (servicio, cantidad, precio, descuento). */
export function QuoteItemsField({ value = [], onChange, currency = "USD", errors = [] }) {
  function updateAt(index, patch) {
    const next = [...value];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function add() {
    onChange([...value, { ...EMPTY_ITEM }]);
  }

  function removeAt(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="hidden gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[3fr_1fr_1fr_1fr_1fr_auto]">
        <span>Descripción</span>
        <span>Cantidad</span>
        <span>Precio unit.</span>
        <span>Descuento</span>
        <span className="text-right">Subtotal</span>
        <span />
      </div>

      {value.map((item, index) => (
        <div key={index} className="rounded-lg border border-border p-3">
          <div className="grid items-start gap-2 sm:grid-cols-[3fr_1fr_1fr_1fr_1fr_auto]">
            <div>
              <Input
                value={item.description}
                onChange={(e) => updateAt(index, { description: e.target.value })}
                placeholder="Ej. Desarrollo de sistema web"
                error={!!errors[index]?.description}
              />
              <FieldError>{errors[index]?.description?.message}</FieldError>
            </div>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={item.quantity}
              onChange={(e) => updateAt(index, { quantity: e.target.valueAsNumber || 0 })}
            />
            <Input
              type="number"
              min={0}
              step="0.01"
              value={item.unitPrice}
              onChange={(e) => updateAt(index, { unitPrice: e.target.valueAsNumber || 0 })}
            />
            <Input
              type="number"
              min={0}
              step="0.01"
              value={item.discount}
              onChange={(e) => updateAt(index, { discount: e.target.valueAsNumber || 0 })}
            />
            <p className="pt-2 text-right text-sm font-medium sm:text-left">{formatMoney(lineTotal(item), currency)}</p>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeAt(index)} aria-label="Eliminar ítem">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" />
        Agregar ítem
      </Button>
    </div>
  );
}

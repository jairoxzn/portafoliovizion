"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Lista editable de líneas de texto libre (características, alcance, etc.). */
export function StringListField({ value = [], onChange, placeholder = "", addLabel = "Agregar" }) {
  function updateAt(index, text) {
    const next = [...value];
    next[index] = text;
    onChange(next);
  }

  function add() {
    onChange([...value, ""]);
  }

  function removeAt(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {value.map((line, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input value={line} onChange={(e) => updateAt(index, e.target.value)} placeholder={placeholder} />
          <Button type="button" variant="ghost" size="icon" onClick={() => removeAt(index)} aria-label="Eliminar">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}

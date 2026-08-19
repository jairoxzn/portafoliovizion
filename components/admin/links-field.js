"use client";

import { Plus, Trash2, Link2 } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LINK_TYPES } from "@/schemas/project";
import { linkTypeLabel } from "@/lib/utils";

const EMPTY_LINK = { name: "", url: "", type: "DEMO" };

/** Lista editable de enlaces del proyecto (demo, sistema, repositorio…). */
export function LinksField({ value = [], onChange }) {
  function updateAt(index, patch) {
    const next = [...value];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function add() {
    onChange([...value, { ...EMPTY_LINK }]);
  }

  function removeAt(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {value.map((link, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-start">
          <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <Input
              value={link.name}
              onChange={(e) => updateAt(index, { name: e.target.value })}
              placeholder="Nombre (ej. Demo)"
            />
            <Input
              value={link.url}
              onChange={(e) => updateAt(index, { url: e.target.value })}
              placeholder="https://…"
              type="url"
            />
            <Select value={link.type} onChange={(e) => updateAt(index, { type: e.target.value })}>
              {LINK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {linkTypeLabel(type)}
                </option>
              ))}
            </Select>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => removeAt(index)} aria-label="Eliminar enlace">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" />
        Agregar enlace
      </Button>

      {value.length === 0 && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link2 className="h-3.5 w-3.5" />
          Agrega al menos un enlace para que los visitantes puedan probar el sistema.
        </p>
      )}
    </div>
  );
}

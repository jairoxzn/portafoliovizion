"use client";

import { useState } from "react";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Selector múltiple de tecnologías con búsqueda. */
export function TechSelector({ technologies, value = [], onChange }) {
  const [query, setQuery] = useState("");

  const filtered = technologies.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  function toggle(id) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <div>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar tecnología…"
          className="pl-9"
        />
      </div>

      <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-border p-3 sm:grid-cols-3">
        {filtered.map((tech) => {
          const active = value.includes(tech.id);
          return (
            <button
              key={tech.id}
              type="button"
              onClick={() => toggle(tech.id)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-left text-sm transition-colors",
                active
                  ? "border-brand-electric bg-brand-electric/10 text-brand-electric"
                  : "border-border text-foreground hover:bg-surface-muted"
              )}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: tech.color || "#999" }}
                />
                <span className="truncate">{tech.name}</span>
              </span>
              {active && <Check className="h-3.5 w-3.5 shrink-0" />}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-4 text-center text-sm text-muted-foreground">
            No se encontraron tecnologías.
          </p>
        )}
      </div>

      {value.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">{value.length} tecnología(s) seleccionada(s)</p>
      )}
    </div>
  );
}

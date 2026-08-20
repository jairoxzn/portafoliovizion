"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { QUOTE_STATUSES } from "@/schemas/quote";
import { quoteStatusLabel } from "@/lib/quotes";

export function QuotesFilters({ clients }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") || "");

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            updateParam("q", e.target.value);
          }}
          placeholder="Buscar por número, título o cliente…"
          className="pl-9"
        />
      </div>

      <Select defaultValue={searchParams.get("clientId") || ""} onChange={(e) => updateParam("clientId", e.target.value)} className="sm:w-48">
        <option value="">Todos los clientes</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select defaultValue={searchParams.get("status") || ""} onChange={(e) => updateParam("status", e.target.value)} className="sm:w-48">
        <option value="">Todos los estados</option>
        {QUOTE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {quoteStatusLabel(s)}
          </option>
        ))}
      </Select>
    </div>
  );
}

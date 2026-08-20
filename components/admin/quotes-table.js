"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { deleteQuote } from "@/actions/quotes";
import { calculateQuoteTotals, formatMoney, quoteStatusLabel, quoteStatusStyle } from "@/lib/quotes";
import { formatDate } from "@/lib/utils";

export function QuotesTable({ quotes }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState(null);

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteQuote(deleteTarget.id);
      if (result.success) {
        toast({ type: "success", title: "Cotización eliminada" });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast({ type: "error", title: "No se pudo eliminar", description: result.error });
      }
    });
  }

  if (quotes.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No se encontraron cotizaciones"
        description="Prueba con otros filtros o crea una nueva cotización."
        action={
          <Button href="/admin/cotizaciones/nueva" size="sm">
            Nueva cotización
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-medium">Número</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => {
              const totals = calculateQuoteTotals(quote.items, quote.discount, quote.taxRate);
              return (
                <tr key={quote.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                  <td className="px-4 py-3 font-medium">{quote.number}</td>
                  <td className="px-4 py-3 text-muted-foreground">{quote.client?.name}</td>
                  <td className="px-4 py-3">{quote.title}</td>
                  <td className="px-4 py-3 font-medium">{formatMoney(totals.total, quote.currency)}</td>
                  <td className="px-4 py-3">
                    <Badge className={quoteStatusStyle(quote.status)}>{quoteStatusLabel(quote.status)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(quote.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/cotizaciones/${quote.id}`}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                        aria-label="Ver"
                        title="Ver"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/cotizaciones/${quote.id}/editar`}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                        aria-label="Editar"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(quote)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        aria-label="Eliminar"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar cotización"
        description={`Esta acción eliminará "${deleteTarget?.number}" de forma permanente.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}

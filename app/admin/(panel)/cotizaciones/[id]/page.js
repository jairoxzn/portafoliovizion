import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, User, Calendar } from "lucide-react";
import { getQuoteById } from "@/actions/quotes";
import { Badge } from "@/components/ui/badge";
import { QuoteDetailActions } from "@/components/admin/quote-detail-actions";
import { calculateQuoteTotals, lineTotal, formatMoney, quoteStatusLabel, quoteStatusStyle } from "@/lib/quotes";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Detalle de cotización" };

export default async function QuoteDetailPage({ params }) {
  const { id } = await params;
  const quote = await getQuoteById(id);

  if (!quote) notFound();

  const totals = calculateQuoteTotals(quote.items, quote.discount, quote.taxRate);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/cotizaciones" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver a cotizaciones
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{quote.number}</h1>
            <p className="text-sm text-muted-foreground">{quote.title}</p>
          </div>
          <Badge className={quoteStatusStyle(quote.status)}>{quoteStatusLabel(quote.status)}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <User className="h-4 w-4 text-brand-electric" />
              Cliente
            </h2>
            <p className="font-medium">{quote.client.name}</p>
            {quote.client.taxId && <p className="text-sm text-muted-foreground">RUC/DNI: {quote.client.taxId}</p>}
            {quote.client.contactName && (
              <p className="text-sm text-muted-foreground">
                Contacto: {quote.client.contactName}
                {quote.client.contactRole ? ` (${quote.client.contactRole})` : ""}
              </p>
            )}
            {quote.client.email && <p className="text-sm text-muted-foreground">{quote.client.email}</p>}
            {quote.client.phone && <p className="text-sm text-muted-foreground">{quote.client.phone}</p>}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-2 font-semibold">Descripción</h2>
            <p className="whitespace-pre-line text-sm text-muted-foreground">{quote.description}</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Descripción</th>
                  <th className="px-4 py-3 font-medium text-right">Cant.</th>
                  <th className="px-4 py-3 font-medium text-right">Precio unit.</th>
                  <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatMoney(item.unitPrice, quote.currency)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatMoney(lineTotal(item), quote.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ml-auto max-w-xs space-y-1 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatMoney(totals.subtotal, quote.currency)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descuento</span>
                  <span>-{formatMoney(totals.discount, quote.currency)}</span>
                </div>
              )}
              {quote.taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impuesto ({quote.taxRate}%)</span>
                  <span>{formatMoney(totals.tax, quote.currency)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-1 text-base font-semibold text-brand-cobalt">
                <span>Total</span>
                <span>{formatMoney(totals.total, quote.currency)}</span>
              </div>
            </div>
          </div>

          {(quote.scopeIncludes.length > 0 || quote.scopeExcludes.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {quote.scopeIncludes.length > 0 && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <h3 className="mb-2 text-sm font-semibold">Incluye</h3>
                  <ul className="space-y-1.5">
                    {quote.scopeIncludes.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {quote.scopeExcludes.length > 0 && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <h3 className="mb-2 text-sm font-semibold">No incluye</h3>
                  <ul className="space-y-1.5">
                    {quote.scopeExcludes.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-sm">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {quote.paymentTerms && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-2 text-sm font-semibold">Forma de pago</h3>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{quote.paymentTerms}</p>
            </div>
          )}

          {quote.notes && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-2 text-sm font-semibold">Notas y condiciones</h3>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{quote.notes}</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Emitida: {formatDate(quote.issueDate)}
            </div>
            {quote.validUntil && (
              <div className="mt-1.5 flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Válida hasta: {formatDate(quote.validUntil)}
              </div>
            )}
          </div>

          <QuoteDetailActions quote={quote} total={totals.total} />
        </aside>
      </div>
    </div>
  );
}

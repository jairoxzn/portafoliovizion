"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Link2, Pencil } from "lucide-react";
import { generateQuotePdf, setQuoteStatus } from "@/actions/quotes";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { QUOTE_STATUSES } from "@/schemas/quote";
import { quoteStatusLabel, formatMoney } from "@/lib/quotes";

function whatsappNumber(phone) {
  return (phone || "").replace(/[^0-9]/g, "");
}

export function QuoteDetailActions({ quote, total }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  async function handleGeneratePdf() {
    setGeneratingPdf(true);
    const result = await generateQuotePdf(quote.id);
    setGeneratingPdf(false);

    if (!result.success) {
      toast({ type: "error", title: "No se pudo generar el PDF", description: result.error });
      return;
    }

    toast({ type: "success", title: "PDF generado" });
    window.open(result.data.url, "_blank", "noopener,noreferrer");
    router.refresh();
  }

  function handleStatusChange(status) {
    startTransition(async () => {
      const result = await setQuoteStatus(quote.id, status);
      if (result.success) {
        toast({ type: "success", title: `Cotización marcada como ${quoteStatusLabel(status)}` });
        router.refresh();
      } else {
        toast({ type: "error", title: "No se pudo actualizar el estado", description: result.error });
      }
    });
  }

  function handleCopyLink() {
    if (!quote.pdfUrl) return;
    const absoluteUrl = quote.pdfUrl.startsWith("http") ? quote.pdfUrl : `${window.location.origin}${quote.pdfUrl}`;
    navigator.clipboard.writeText(absoluteUrl);
    toast({ type: "success", title: "Link copiado" });
  }

  const number = whatsappNumber(quote.client?.whatsapp || quote.client?.phone);
  const pdfAbsoluteUrl =
    quote.pdfUrl && typeof window !== "undefined"
      ? quote.pdfUrl.startsWith("http")
        ? quote.pdfUrl
        : `${window.location.origin}${quote.pdfUrl}`
      : quote.pdfUrl;

  const whatsappMessage = encodeURIComponent(
    `Hola${quote.client?.contactName ? ` ${quote.client.contactName}` : ""} 👋\n\n` +
      `Te compartimos la cotización *${quote.number}* — ${quote.title}.\n` +
      `Total: ${formatMoney(total, quote.currency)}\n` +
      (quote.validUntil ? `Válida hasta: ${new Date(quote.validUntil).toLocaleDateString("es")}\n` : "") +
      (pdfAbsoluteUrl ? `\nPuedes verla aquí: ${pdfAbsoluteUrl}` : "\n(Genera el PDF para incluir el link aquí)")
  );

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Estado</label>
        <Select value={quote.status} onChange={(e) => handleStatusChange(e.target.value)} disabled={isPending}>
          {QUOTE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {quoteStatusLabel(s)}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="button" onClick={handleGeneratePdf} loading={generatingPdf} className="w-full">
          {!generatingPdf && <Download className="h-4 w-4" />}
          {quote.pdfUrl ? "Regenerar y descargar PDF" : "Generar PDF"}
        </Button>

        {quote.pdfUrl && (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => window.open(`https://wa.me/${number}?text=${whatsappMessage}`, "_blank", "noopener,noreferrer")}
              disabled={!number}
            >
              Compartir por WhatsApp
            </Button>
            <Button
              href={`mailto:${quote.client?.email || ""}?subject=${encodeURIComponent(`Cotización ${quote.number}`)}&body=${whatsappMessage}`}
              variant="outline"
              className="w-full"
            >
              Compartir por email
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={handleCopyLink}>
              <Link2 className="h-4 w-4" />
              Copiar link del PDF
            </Button>
          </>
        )}

        <Button href={`/admin/cotizaciones/${quote.id}/editar`} variant="outline" className="w-full">
          <Pencil className="h-4 w-4" />
          Editar cotización
        </Button>
      </div>

      {!quote.client?.whatsapp && !quote.client?.phone && (
        <p className="text-xs text-muted-foreground">
          Agrega un teléfono/WhatsApp al cliente para habilitar el botón de WhatsApp.
        </p>
      )}
    </div>
  );
}

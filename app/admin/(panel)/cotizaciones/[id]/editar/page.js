import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuoteById } from "@/actions/quotes";
import { listClients } from "@/actions/clients";
import { QuoteForm } from "@/components/admin/quote-form";

export const metadata = { title: "Editar cotización" };

export default async function EditQuotePage({ params }) {
  const { id } = await params;
  const [quote, clients] = await Promise.all([getQuoteById(id), listClients()]);

  if (!quote) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/cotizaciones" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver a cotizaciones
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Editar: {quote.number}</h1>
      </div>

      <QuoteForm quote={quote} clients={clients} />
    </div>
  );
}

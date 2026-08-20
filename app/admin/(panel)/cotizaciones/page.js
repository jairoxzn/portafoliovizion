import { Plus } from "lucide-react";
import { listQuotes } from "@/actions/quotes";
import { listClients } from "@/actions/clients";
import { Button } from "@/components/ui/button";
import { QuotesFilters } from "@/components/admin/quotes-filters";
import { QuotesTable } from "@/components/admin/quotes-table";

export const metadata = { title: "Cotizaciones" };

export default async function AdminQuotesPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || "";
  const status = params?.status || "";
  const clientId = params?.clientId || "";

  const [quotes, clients] = await Promise.all([
    listQuotes({ q, status, clientId }),
    listClients(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cotizaciones</h1>
          <p className="text-sm text-muted-foreground">{quotes.length} cotización(es)</p>
        </div>
        <Button href="/admin/cotizaciones/nueva">
          <Plus className="h-4 w-4" />
          Nueva cotización
        </Button>
      </div>

      <QuotesFilters clients={clients} />
      <QuotesTable quotes={quotes} />
    </div>
  );
}

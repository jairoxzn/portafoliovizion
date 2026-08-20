import Link from "next/link";
import { listClients } from "@/actions/clients";
import { QuoteForm } from "@/components/admin/quote-form";

export const metadata = { title: "Nueva cotización" };

export default async function NewQuotePage() {
  const clients = await listClients();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/cotizaciones" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver a cotizaciones
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Nueva cotización</h1>
      </div>

      <QuoteForm clients={clients} />
    </div>
  );
}

import { listClients } from "@/actions/clients";
import { ClientsManager } from "@/components/admin/clients-manager";

export const metadata = { title: "Clientes" };

export default async function AdminClientsPage() {
  const clients = await listClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">Empresas y contactos para tus cotizaciones.</p>
      </div>
      <ClientsManager clients={clients} />
    </div>
  );
}

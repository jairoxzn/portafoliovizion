import { listTechnologies } from "@/actions/technologies";
import { TechnologiesManager } from "@/components/admin/technologies-manager";

export const metadata = { title: "Tecnologías" };

export default async function AdminTechnologiesPage() {
  const technologies = await listTechnologies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tecnologías</h1>
        <p className="text-sm text-muted-foreground">Stack utilizado en los proyectos de viziontech.</p>
      </div>
      <TechnologiesManager technologies={technologies} />
    </div>
  );
}

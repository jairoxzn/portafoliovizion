import Link from "next/link";
import { FolderPlus } from "lucide-react";
import { listCategories } from "@/actions/categories";
import { listTechnologies } from "@/actions/technologies";
import { ProjectForm } from "@/components/admin/project-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Nuevo proyecto" };

export default async function NewProjectPage() {
  const [categories, technologies] = await Promise.all([listCategories(), listTechnologies()]);

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Crea una categoría primero"
        description="Necesitas al menos una categoría antes de poder registrar un proyecto."
        action={
          <Button href="/admin/categorias" size="sm">
            Ir a categorías
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/proyectos" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver a proyectos
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Nuevo proyecto</h1>
      </div>

      <ProjectForm categories={categories} technologies={technologies} />
    </div>
  );
}

import { listCategories } from "@/actions/categories";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata = { title: "Categorías" };

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
        <p className="text-sm text-muted-foreground">Organiza los proyectos por tipo de sistema.</p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}

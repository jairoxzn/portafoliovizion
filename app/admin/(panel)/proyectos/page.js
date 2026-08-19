import { Plus } from "lucide-react";
import { listProjectsAdmin } from "@/actions/projects";
import { listCategories } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { ProjectsFilters } from "@/components/admin/projects-filters";
import { ProjectsTable } from "@/components/admin/projects-table";

export const metadata = { title: "Proyectos" };

export default async function AdminProjectsPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || "";
  const category = params?.category || "";
  const status = params?.status || "";

  const [projects, categories] = await Promise.all([
    listProjectsAdmin({ q, category, status }),
    listCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-sm text-muted-foreground">{projects.length} proyecto(s)</p>
        </div>
        <Button href="/admin/proyectos/nuevo">
          <Plus className="h-4 w-4" />
          Nuevo proyecto
        </Button>
      </div>

      <ProjectsFilters categories={categories} />
      <ProjectsTable projects={projects} />
    </div>
  );
}

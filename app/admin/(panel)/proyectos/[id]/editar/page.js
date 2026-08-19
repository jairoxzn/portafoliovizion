import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/actions/projects";
import { listCategories } from "@/actions/categories";
import { listTechnologies } from "@/actions/technologies";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata = { title: "Editar proyecto" };

export default async function EditProjectPage({ params }) {
  const { id } = await params;
  const [project, categories, technologies] = await Promise.all([
    getProjectById(id),
    listCategories(),
    listTechnologies(),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/proyectos" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver a proyectos
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Editar: {project.name}</h1>
      </div>

      <ProjectForm project={project} categories={categories} technologies={technologies} />
    </div>
  );
}

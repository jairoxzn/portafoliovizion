"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Copy,
  Trash2,
  ExternalLink,
  FolderKanban,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import {
  deleteProject,
  duplicateProject,
  toggleProjectFeatured,
  toggleProjectPublished,
} from "@/actions/projects";
import { formatDate, statusLabel, statusStyle } from "@/lib/utils";

export function ProjectsTable({ projects }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState(null);

  function handleTogglePublished(project) {
    startTransition(async () => {
      const result = await toggleProjectPublished(project.id, !project.published);
      if (result.success) {
        toast({
          type: "success",
          title: !project.published ? "Proyecto publicado" : "Proyecto ocultado",
        });
        router.refresh();
      } else {
        toast({ type: "error", title: "No se pudo actualizar", description: result.error });
      }
    });
  }

  function handleToggleFeatured(project) {
    startTransition(async () => {
      const result = await toggleProjectFeatured(project.id, !project.featured);
      if (result.success) {
        router.refresh();
      } else {
        toast({ type: "error", title: "No se pudo actualizar", description: result.error });
      }
    });
  }

  function handleDuplicate(project) {
    startTransition(async () => {
      const result = await duplicateProject(project.id);
      if (result.success) {
        toast({ type: "success", title: "Proyecto duplicado", description: result.data.name });
        router.refresh();
      } else {
        toast({ type: "error", title: "No se pudo duplicar", description: result.error });
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteProject(deleteTarget.id);
      if (result.success) {
        toast({ type: "success", title: "Proyecto eliminado" });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast({ type: "error", title: "No se pudo eliminar", description: result.error });
      }
    });
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No se encontraron proyectos"
        description="Prueba con otros filtros o crea un nuevo proyecto."
        action={
          <Button href="/admin/proyectos/nuevo" size="sm">
            Nuevo proyecto
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-medium">Proyecto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Publicado</th>
              <th className="px-4 py-3 font-medium">Destacado</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                <td className="px-4 py-3">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project._count?.views ?? 0} visitas</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{project.category?.name || "—"}</td>
                <td className="px-4 py-3">
                  <Badge className={statusStyle(project.status)}>{statusLabel(project.status)}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={project.published}
                    onCheckedChange={() => handleTogglePublished(project)}
                    disabled={isPending}
                    label="Publicado"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    disabled={isPending}
                    aria-label="Destacado"
                    className="text-muted-foreground hover:text-amber-500 disabled:opacity-50"
                  >
                    <Star className={`h-4 w-4 ${project.featured ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(project.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {project.published && (
                      <Link
                        href={`/proyectos/${project.slug}`}
                        target="_blank"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                        aria-label="Ver en el sitio"
                        title="Ver en el sitio"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/proyectos/${project.id}/editar`}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                      aria-label="Editar"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(project)}
                      disabled={isPending}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
                      aria-label="Duplicar"
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                      aria-label="Eliminar"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar proyecto"
        description={`Esta acción eliminará "${deleteTarget?.name}" y sus imágenes de forma permanente. No se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { categorySchema } from "@/schemas/category";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export function CategoriesManager({ categories }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState(null); // null=cerrado, {}=nuevo, {...}=editar
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteCategory(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast({ type: "success", title: "Categoría eliminada" });
      setDeleteTarget(null);
      router.refresh();
    } else {
      toast({ type: "error", title: "No se pudo eliminar", description: result.error });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing({})}>
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState icon={Tags} title="Sin categorías" description="Crea la primera categoría para poder registrar proyectos." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Proyectos</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">/{cat.slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat._count?.projects ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing(cat)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        aria-label="Eliminar"
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
      )}

      <CategoryFormModal
        open={!!editing}
        category={editing?.id ? editing : null}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar categoría"
        description={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function CategoryFormModal({ open, category, onClose, onSaved }) {
  const { toast } = useToast();
  const isEditing = !!category;
  const [slugEdited, setSlugEdited] = useState(isEditing);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "", order: 0 },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name || "",
        slug: category?.slug || "",
        description: category?.description || "",
        order: category?.order ?? 0,
      });
      setSlugEdited(isEditing);
    }
  }, [open, category, isEditing, reset]);

  const name = watch("name");
  useEffect(() => {
    if (!slugEdited) setValue("slug", slugify(name || ""));
  }, [name, slugEdited, setValue]);

  async function onSubmit(values) {
    const result = isEditing ? await updateCategory(category.id, values) : await createCategory(values);
    if (!result.success) {
      toast({ type: "error", title: "No se pudo guardar", description: result.error });
      return;
    }
    toast({ type: "success", title: isEditing ? "Categoría actualizada" : "Categoría creada" });
    onSaved();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Editar categoría" : "Nueva categoría"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="cat-name" required>
            Nombre
          </Label>
          <Input id="cat-name" error={!!errors.name} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="cat-slug" required>
            Slug
          </Label>
          <Input id="cat-slug" error={!!errors.slug} {...register("slug", { onChange: () => setSlugEdited(true) })} />
          <FieldError>{errors.slug?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="cat-description">Descripción</Label>
          <Textarea id="cat-description" rows={3} {...register("description")} />
        </div>
        <div>
          <Label htmlFor="cat-order">Orden</Label>
          <Input id="cat-order" type="number" min={0} {...register("order")} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}

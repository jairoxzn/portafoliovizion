"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Cpu } from "lucide-react";
import { technologySchema } from "@/schemas/technology";
import { createTechnology, updateTechnology, deleteTechnology } from "@/actions/technologies";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Label, FieldError, FieldHint } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export function TechnologiesManager({ technologies }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteTechnology(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast({ type: "success", title: "Tecnología eliminada" });
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
          Nueva tecnología
        </Button>
      </div>

      {technologies.length === 0 ? (
        <EmptyState icon={Cpu} title="Sin tecnologías" description="Registra las tecnologías que usa viziontech en sus proyectos." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {technologies.map((tech) => (
            <div key={tech.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface p-3">
              <div className="flex min-w-0 items-center gap-2">
                {tech.icon ? (
                  <span className="shrink-0 text-base leading-none">{tech.icon}</span>
                ) : (
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: tech.color || "#999" }} />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech._count?.projects ?? 0} proyecto(s)</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!tech.active && (
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    Inactiva
                  </Badge>
                )}
                <button onClick={() => setEditing(tech)} className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground" aria-label="Editar">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setDeleteTarget(tech)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10" aria-label="Eliminar">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TechnologyFormModal
        open={!!editing}
        technology={editing?.id ? editing : null}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar tecnología"
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

function TechnologyFormModal({ open, technology, onClose, onSaved }) {
  const { toast } = useToast();
  const isEditing = !!technology;
  const [slugEdited, setSlugEdited] = useState(isEditing);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(technologySchema),
    defaultValues: { name: "", slug: "", icon: "", color: "#00AEEF", active: true },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: technology?.name || "",
        slug: technology?.slug || "",
        icon: technology?.icon || "",
        color: technology?.color || "#00AEEF",
        active: technology?.active ?? true,
      });
      setSlugEdited(isEditing);
    }
  }, [open, technology, isEditing, reset]);

  const name = watch("name");
  useEffect(() => {
    if (!slugEdited) setValue("slug", slugify(name || ""));
  }, [name, slugEdited, setValue]);

  async function onSubmit(values) {
    const result = isEditing ? await updateTechnology(technology.id, values) : await createTechnology(values);
    if (!result.success) {
      toast({ type: "error", title: "No se pudo guardar", description: result.error });
      return;
    }
    toast({ type: "success", title: isEditing ? "Tecnología actualizada" : "Tecnología creada" });
    onSaved();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Editar tecnología" : "Nueva tecnología"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="tech-name" required>
            Nombre
          </Label>
          <Input id="tech-name" error={!!errors.name} {...register("name")} placeholder="Next.js" />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="tech-slug" required>
            Slug
          </Label>
          <Input id="tech-slug" error={!!errors.slug} {...register("slug", { onChange: () => setSlugEdited(true) })} />
          <FieldError>{errors.slug?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="tech-icon">Icono</Label>
          <Input id="tech-icon" {...register("icon")} placeholder="Nombre de icono o emoji (opcional)" />
          <FieldHint>Ej. un emoji (⚛️) o el nombre de un icono de lucide-react.</FieldHint>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tech-color">Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" {...register("color")} className="h-10 w-10 rounded-md border border-border bg-transparent" />
              <Input {...register("color")} placeholder="#00AEEF" />
            </div>
            <FieldError>{errors.color?.message}</FieldError>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-3 text-sm font-medium">
              <Switch
                checked={watch("active")}
                onCheckedChange={(v) =>
                  setValue("active", v, { shouldValidate: true })
                }
                label="Activa"
              />
              Activa
            </label>
          </div>
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

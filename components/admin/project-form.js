"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { projectSchema, PROJECT_STATUSES } from "@/schemas/project";
import { createProject, updateProject, checkProjectSlugAvailable } from "@/actions/projects";
import { slugify } from "@/lib/slug";
import { statusLabel } from "@/lib/utils";
import { Input, Textarea, Select, Label, FieldError, FieldHint } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SingleImageUploader } from "@/components/admin/single-image-uploader";
import { GalleryUploader } from "@/components/admin/gallery-uploader";
import { LinksField } from "@/components/admin/links-field";
import { TechSelector } from "@/components/admin/tech-selector";
import { useToast } from "@/components/ui/toast";

function dateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function ProjectForm({ project, categories, technologies }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!project;
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const [slugStatus, setSlugStatus] = useState("idle"); // idle | checking | available | taken

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      slug: project?.slug || "",
      shortDescription: project?.shortDescription || "",
      description: project?.description || "",
      problem: project?.problem || "",
      features: project?.features?.length ? project.features : [],
      client: project?.client || "",
      categoryId: project?.categoryId || categories[0]?.id || "",
      mainImage: project?.mainImage || "",
      status: project?.status || "EN_DESARROLLO",
      published: project?.published ?? false,
      featured: project?.featured ?? false,
      order: project?.order ?? 0,
      developmentDate: dateInputValue(project?.developmentDate),
      metaTitle: project?.metaTitle || "",
      metaDescription: project?.metaDescription || "",
      metaKeywords: project?.metaKeywords || "",
      technologyIds: project?.technologies?.map((t) => t.technologyId) || [],
      images: project?.images?.map(({ url, alt, order }) => ({ url, alt, order })) || [],
      links: project?.links?.map(({ name, url, type }) => ({ name, url, type })) || [],
    },
  });

  const name = watch("name");
  const slug = watch("slug");

  useEffect(() => {
    if (!slugEdited) {
      setValue("slug", slugify(name || ""), { shouldValidate: false });
    }
  }, [name, slugEdited, setValue]);

  useEffect(() => {
    if (!slug || slug.length < 3) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const timeout = setTimeout(async () => {
      const available = await checkProjectSlugAvailable(slug, project?.id);
      setSlugStatus(available ? "available" : "taken");
    }, 400);
    return () => clearTimeout(timeout);
  }, [slug, project?.id]);

  async function onSubmit(values) {
    const action = isEditing ? updateProject.bind(null, project.id) : createProject;
    const result = await action(values);

    if (!result.success) {
      toast({ type: "error", title: "No se pudo guardar el proyecto", description: result.error });
      return;
    }

    toast({
      type: "success",
      title: isEditing ? "Proyecto actualizado" : "Proyecto creado",
      description: result.data.name,
    });
    router.push("/admin/proyectos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-10">
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Información básica</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name" required>
                Nombre del proyecto
              </Label>
              <Input id="name" error={!!errors.name} {...register("name")} placeholder="Sistema de Gestión para Barbería" />
              <FieldError>{errors.name?.message}</FieldError>
            </div>

            <div>
              <Label htmlFor="slug" required>
                Slug (URL)
              </Label>
              <div className="relative">
                <Input
                  id="slug"
                  error={!!errors.slug}
                  className="pr-9"
                  {...register("slug", {
                    onChange: () => setSlugEdited(true),
                  })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {slugStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  {slugStatus === "available" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {slugStatus === "taken" && <XCircle className="h-4 w-4 text-red-500" />}
                </span>
              </div>
              <FieldError>{errors.slug?.message}</FieldError>
              {slugStatus === "taken" && !errors.slug && (
                <FieldError>Ese slug ya está en uso.</FieldError>
              )}
              <FieldHint>
                Así se verá la página de este proyecto en tu portafolio: /proyectos/{slug || "…"}.
                Para enlazar tu sistema real (el que ya tienes en línea), usa la sección
                &quot;Enlaces&quot; más abajo — no este campo.
              </FieldHint>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="categoryId" required>
                Categoría
              </Label>
              <Select id="categoryId" error={!!errors.categoryId} {...register("categoryId")}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
              <FieldError>{errors.categoryId?.message}</FieldError>
            </div>

            <div>
              <Label htmlFor="client">Cliente</Label>
              <Input id="client" {...register("client")} placeholder="Nombre del cliente (opcional)" />
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription" required>
              Descripción corta
            </Label>
            <Textarea
              id="shortDescription"
              rows={2}
              error={!!errors.shortDescription}
              {...register("shortDescription")}
              placeholder="Se muestra en las cards del portafolio (máx. 220 caracteres)"
            />
            <FieldError>{errors.shortDescription?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="description" required>
              Descripción completa
            </Label>
            <Textarea id="description" rows={5} error={!!errors.description} {...register("description")} />
            <FieldError>{errors.description?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="problem">Problema que resuelve</Label>
            <Textarea id="problem" rows={3} {...register("problem")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Imágenes</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <Controller
            name="mainImage"
            control={control}
            render={({ field }) => (
              <SingleImageUploader label="Imagen principal" value={field.value} onChange={field.onChange} />
            )}
          />
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">Galería de imágenes</p>
            <Controller
              name="images"
              control={control}
              render={({ field }) => <GalleryUploader value={field.value} onChange={field.onChange} />}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Características principales</h2>
        </CardHeader>
        <CardContent>
          <Controller
            name="features"
            control={control}
            render={({ field }) => <FeaturesField value={field.value} onChange={field.onChange} />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Tecnologías</h2>
        </CardHeader>
        <CardContent>
          <Controller
            name="technologyIds"
            control={control}
            render={({ field }) => (
              <TechSelector technologies={technologies} value={field.value} onChange={field.onChange} />
            )}
          />
          <FieldError>{errors.technologyIds?.message}</FieldError>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Enlaces</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí va la URL de tu sistema real (ej. https://salondebelleza.vizionworld.tech). Este
            es el botón &quot;Visitar sistema&quot; que verán los visitantes del portafolio.
          </p>
        </CardHeader>
        <CardContent>
          <Controller
            name="links"
            control={control}
            render={({ field }) => <LinksField value={field.value} onChange={field.onChange} />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Estado y publicación</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="status">Estado del proyecto</Label>
              <Select id="status" {...register("status")}>
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="developmentDate">Fecha de desarrollo</Label>
              <Input id="developmentDate" type="date" {...register("developmentDate")} />
            </div>
            <div>
              <Label htmlFor="order">Orden de aparición</Label>
              <Input id="order" type="number" min={0} {...register("order")} />
              <FieldHint>Menor número aparece primero</FieldHint>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 text-sm font-medium">
                  <Switch checked={field.value} onCheckedChange={field.onChange} label="Publicado" />
                  Publicado (visible en el portafolio)
                </label>
              )}
            />
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 text-sm font-medium">
                  <Switch checked={field.value} onCheckedChange={field.onChange} label="Destacado" />
                  Destacado (aparece en la página de inicio)
                </label>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">SEO</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta title</Label>
            <Input id="metaTitle" {...register("metaTitle")} placeholder={`${name || "Nombre del proyecto"} | viziontech`} />
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta description</Label>
            <Textarea id="metaDescription" rows={2} {...register("metaDescription")} />
          </div>
          <div>
            <Label htmlFor="metaKeywords">Keywords (separadas por coma)</Label>
            <Input id="metaKeywords" {...register("metaKeywords")} />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-background/95 py-4 backdrop-blur">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? "Guardar cambios" : "Crear proyecto"}
        </Button>
      </div>
    </form>
  );
}

function FeaturesField({ value = [], onChange }) {
  function updateAt(index, text) {
    const next = [...value];
    next[index] = text;
    onChange(next);
  }

  function add() {
    onChange([...value, ""]);
  }

  function removeAt(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {value.map((feature, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={feature}
            onChange={(e) => updateAt(index, e.target.value)}
            placeholder="Ej. Gestión de inventario"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => removeAt(index)} aria-label="Eliminar característica">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" />
        Agregar característica
      </Button>
    </div>
  );
}

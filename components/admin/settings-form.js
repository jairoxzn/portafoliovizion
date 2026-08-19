"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema } from "@/schemas/settings";
import { updateSettings } from "@/actions/settings";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SingleImageUploader } from "@/components/admin/single-image-uploader";
import { useToast } from "@/components/ui/toast";

export function SettingsForm({ settings }) {
  const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: settings.companyName || "",
      logo: settings.logo || "",
      description: settings.description || "",
      email: settings.email || "",
      phone: settings.phone || "",
      whatsapp: settings.whatsapp || "",
      address: settings.address || "",
      schedule: settings.schedule || "",
      facebook: settings.facebook || "",
      instagram: settings.instagram || "",
      tiktok: settings.tiktok || "",
      linkedin: settings.linkedin || "",
      github: settings.github || "",
    },
  });

  async function onSubmit(values) {
    const result = await updateSettings(values);
    if (!result.success) {
      toast({ type: "error", title: "No se pudo guardar", description: result.error });
      return;
    }
    toast({ type: "success", title: "Configuración actualizada" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Empresa</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <SingleImageUploader label="Logo" value={field.value} onChange={field.onChange} aspect="aspect-[3/1]" />
            )}
          />
          <div>
            <Label htmlFor="companyName" required>
              Nombre de la empresa
            </Label>
            <Input id="companyName" error={!!errors.companyName} {...register("companyName")} />
            <FieldError>{errors.companyName?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Contacto</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" error={!!errors.email} {...register("email")} />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" {...register("phone")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" placeholder="+58 000-0000000" {...register("whatsapp")} />
            </div>
            <div>
              <Label htmlFor="schedule">Horario</Label>
              <Input id="schedule" placeholder="Lunes a viernes, 9:00 - 18:00" {...register("schedule")} />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" {...register("address")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Redes sociales</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" error={!!errors.facebook} {...register("facebook")} placeholder="https://facebook.com/…" />
              <FieldError>{errors.facebook?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" error={!!errors.instagram} {...register("instagram")} placeholder="https://instagram.com/…" />
              <FieldError>{errors.instagram?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="tiktok">TikTok</Label>
              <Input id="tiktok" error={!!errors.tiktok} {...register("tiktok")} placeholder="https://tiktok.com/@…" />
              <FieldError>{errors.tiktok?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" error={!!errors.linkedin} {...register("linkedin")} placeholder="https://linkedin.com/company/…" />
              <FieldError>{errors.linkedin?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" error={!!errors.github} {...register("github")} placeholder="https://github.com/…" />
              <FieldError>{errors.github?.message}</FieldError>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          Guardar configuración
        </Button>
      </div>
    </form>
  );
}
